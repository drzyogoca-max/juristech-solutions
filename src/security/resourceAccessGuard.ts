/**
 * src/security/resourceAccessGuard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Central Resource Ownership & Access Check Abstraction
 * Sprint 01 Foundation (Phase 9E)
 *
 * Evaluates whether a subject (User + Tenant + Workspace + Role) can access a target resource.
 * Adheres strictly to:
 *   User Access AND Organization Membership AND Workspace/Resource Permission
 */

import { SaaSRole, SaaSPermission, ResourceType, SaaSResourceMetadata } from '../types/saas';
import { hasPermission } from './rbacResolver';

export type AccessDecisionCode =
  | 'ALLOW'
  | 'DENY_UNAUTHENTICATED'
  | 'DENY_TENANT_MISMATCH'
  | 'DENY_WORKSPACE_RESTRICTED'
  | 'DENY_INSUFFICIENT_PERMISSION'
  | 'DENY_INACTIVE_MEMBERSHIP'
  | 'DENY_NOT_OWNER';

export interface SubjectContext {
  userId: string;
  isSuperAdmin?: boolean;
  activeOrganizationId?: string | null;
  activeWorkspaceId?: string | null;
  role?: SaaSRole | null;
  membershipStatus?: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | null;
  assignedWorkspaceIds?: string[];
}

export interface ResourceAccessCheckRequest {
  subject: SubjectContext;
  resource: SaaSResourceMetadata;
  action: SaaSPermission;
}

export interface ResourceAccessCheckResult {
  allowed: boolean;
  code: AccessDecisionCode;
  auditReason: string; // Internal reason for audit logs, never leaked to untrusted UI clients
}

/**
 * Pure evaluation function answering: "Can user X access resource Y to perform action Z?"
 */
export function canUserAccessResource(request: ResourceAccessCheckRequest): ResourceAccessCheckResult {
  const { subject, resource, action } = request;

  // 1. Authentication Check
  if (!subject.userId || subject.userId.trim() === '') {
    return {
      allowed: false,
      code: 'DENY_UNAUTHENTICATED',
      auditReason: 'Subject has no authenticated user identity.',
    };
  }

  // 2. Platform Super Admin Escape-Hatch (with immutable audit trace)
  if (subject.isSuperAdmin) {
    return {
      allowed: true,
      code: 'ALLOW',
      auditReason: 'Subject possesses platform sovereign Super Admin privilege.',
    };
  }

  // 3. Backward Compatibility: Legacy Records without Organization ID (User-only ownership)
  if (!resource.organizationId) {
    if (resource.ownerUserId && resource.ownerUserId === subject.userId) {
      return {
        allowed: true,
        code: 'ALLOW',
        auditReason: 'Legacy single-user asset owned directly by authenticated user.',
      };
    }
    return {
      allowed: false,
      code: 'DENY_NOT_OWNER',
      auditReason: 'Legacy single-user asset owned by another user ID.',
    };
  }

  // 4. Multi-Tenant Organization Isolation Barrier
  if (!subject.activeOrganizationId || subject.activeOrganizationId !== resource.organizationId) {
    return {
      allowed: false,
      code: 'DENY_TENANT_MISMATCH',
      auditReason: `Tenant barrier violation: Subject active org (${subject.activeOrganizationId || 'none'}) does not match resource org (${resource.organizationId}).`,
    };
  }

  // 5. Organization Membership Status Barrier
  if (subject.membershipStatus && subject.membershipStatus !== 'ACTIVE') {
    return {
      allowed: false,
      code: 'DENY_INACTIVE_MEMBERSHIP',
      auditReason: `Subject organization membership is not active (${subject.membershipStatus}).`,
    };
  }

  // 6. Workspace Departmental Barrier
  if (resource.workspaceId && subject.activeWorkspaceId) {
    // If resource is assigned to a specific workspace and user is operating in another workspace
    if (resource.workspaceId !== subject.activeWorkspaceId && !resource.isSharedWithWorkspace) {
      // Organization Owners and Admins have cross-workspace oversight
      const isExecutive = subject.role === 'Owner' || subject.role === 'Admin';
      if (!isExecutive) {
        return {
          allowed: false,
          code: 'DENY_WORKSPACE_RESTRICTED',
          auditReason: `Workspace barrier: Resource belongs to workspace ${resource.workspaceId}, user active in ${subject.activeWorkspaceId}.`,
        };
      }
    }
  }

  // 7. Canonical RBAC Permission Check
  if (!hasPermission(subject.role, action)) {
    return {
      allowed: false,
      code: 'DENY_INSUFFICIENT_PERMISSION',
      auditReason: `RBAC check failed: Role '${subject.role || 'none'}' lacks '${action}' permission.`,
    };
  }

  // 8. Access Approved
  return {
    allowed: true,
    code: 'ALLOW',
    auditReason: `Access granted: User ${subject.userId} possesses permission '${action}' in organization ${resource.organizationId}.`,
  };
}
