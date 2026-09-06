/**
 * src/services/teamService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical Organization Team Management Service
 * Sprint 02 (Task 7 & 8)
 *
 * Implements member lifecycle across the 8 canonical SaaS roles:
 * Owner, Admin, Legal, Compliance, Finance, Procurement, Analyst, Viewer
 */

import { SaaSRole, OrganizationMember } from '../types/saas';
import { canRolePerform } from '../security/rbacResolver';

export interface InviteMemberParams {
  organizationId: string;
  email: string;
  role: SaaSRole;
  fullName?: string;
  actorRole: SaaSRole;
}

export interface MemberActionParams {
  organizationId: string;
  memberId: string;
  actorRole: SaaSRole;
}

export interface ChangeRoleParams extends MemberActionParams {
  newRole: SaaSRole;
}

export interface TeamOperationResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

// Hierarchy rank for role elevation checks (higher index = higher privilege)
const ROLE_HIERARCHY_RANK: Record<SaaSRole, number> = {
  Viewer: 1,
  Analyst: 2,
  Procurement: 3,
  Finance: 3,
  Compliance: 4,
  Legal: 5,
  Admin: 6,
  Owner: 7,
};

const STORAGE_KEY_PREFIX = 'juristech_org_members_';

export class TeamService {
  private static instance: TeamService;

  private constructor() {}

  public static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }

  private getStorageKey(organizationId: string): string {
    return `${STORAGE_KEY_PREFIX}${organizationId}`;
  }

  /**
   * List all members of an organization
   */
  public listMembers(organizationId: string): OrganizationMember[] {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(this.getStorageKey(organizationId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Save members roster for an organization
   */
  public saveMembers(organizationId: string, members: OrganizationMember[]): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(this.getStorageKey(organizationId), JSON.stringify(members));
    } catch {
      // Fallback
    }
  }

  /**
   * Invite a new member to the organization
   */
  public inviteMember(params: InviteMemberParams): TeamOperationResult<OrganizationMember> {
    const { organizationId, email, role, fullName, actorRole } = params;

    // RBAC Check: Only Owner or Admin can invite members
    if (!canRolePerform(actorRole, 'ADMIN')) {
      return {
        success: false,
        message: 'Permission denied: Only Owner or Admin can invite team members.',
        errorCode: 'DENY_INSUFFICIENT_PERMISSIONS',
      };
    }

    // Role Escalation Prevention: Cannot invite member with higher privilege than self
    if (ROLE_HIERARCHY_RANK[role] > ROLE_HIERARCHY_RANK[actorRole]) {
      return {
        success: false,
        message: `Security violation: You cannot invite a member with higher privilege (${role}) than your own role (${actorRole}).`,
        errorCode: 'DENY_PRIVILEGE_ESCALATION',
      };
    }

    // Only Owner can invite another Owner
    if (role === 'Owner' && actorRole !== 'Owner') {
      return {
        success: false,
        message: 'Security violation: Only the Organization Owner can grant Owner role.',
        errorCode: 'DENY_OWNER_ESCALATION',
      };
    }

    const currentMembers = this.listMembers(organizationId);
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate
    if (currentMembers.some((m) => m.userEmail.toLowerCase() === normalizedEmail)) {
      return {
        success: false,
        message: `User with email ${email} is already a member of this organization.`,
        errorCode: 'DUPLICATE_MEMBER',
      };
    }

    const newMember: OrganizationMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId,
      userId: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userEmail: normalizedEmail,
      fullName: fullName || normalizedEmail.split('@')[0],
      role,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString(),
    };

    const updated = [...currentMembers, newMember];
    this.saveMembers(organizationId, updated);

    return {
      success: true,
      message: `Member ${newMember.userEmail} invited successfully as ${role}.`,
      data: newMember,
    };
  }

  /**
   * Suspend a member's access
   */
  public suspendMember(params: MemberActionParams): TeamOperationResult<OrganizationMember> {
    const { organizationId, memberId, actorRole } = params;

    if (!canRolePerform(actorRole, 'ADMIN')) {
      return {
        success: false,
        message: 'Permission denied: Only Owner or Admin can suspend members.',
        errorCode: 'DENY_INSUFFICIENT_PERMISSIONS',
      };
    }

    const members = this.listMembers(organizationId);
    const target = members.find((m) => m.id === memberId);

    if (!target) {
      return {
        success: false,
        message: 'Target member not found.',
        errorCode: 'MEMBER_NOT_FOUND',
      };
    }

    // Cannot suspend an Owner
    if (target.role === 'Owner') {
      return {
        success: false,
        message: 'Security policy: Organization Owner cannot be suspended.',
        errorCode: 'CANNOT_SUSPEND_OWNER',
      };
    }

    // Admin cannot suspend an Admin
    if (target.role === 'Admin' && actorRole !== 'Owner') {
      return {
        success: false,
        message: 'Security policy: Only the Owner can suspend an Admin.',
        errorCode: 'DENY_PEER_SUSPENSION',
      };
    }

    const updatedMembers = members.map((m) =>
      m.id === memberId ? { ...m, status: 'SUSPENDED' as const } : m
    );

    this.saveMembers(organizationId, updatedMembers);

    return {
      success: true,
      message: `Member ${target.userEmail} suspended successfully.`,
      data: { ...target, status: 'SUSPENDED' },
    };
  }

  /**
   * Reactivate a suspended member
   */
  public activateMember(params: MemberActionParams): TeamOperationResult<OrganizationMember> {
    const { organizationId, memberId, actorRole } = params;

    if (!canRolePerform(actorRole, 'ADMIN')) {
      return {
        success: false,
        message: 'Permission denied: Only Owner or Admin can activate members.',
        errorCode: 'DENY_INSUFFICIENT_PERMISSIONS',
      };
    }

    const members = this.listMembers(organizationId);
    const target = members.find((m) => m.id === memberId);

    if (!target) {
      return {
        success: false,
        message: 'Target member not found.',
        errorCode: 'MEMBER_NOT_FOUND',
      };
    }

    const updatedMembers = members.map((m) =>
      m.id === memberId ? { ...m, status: 'ACTIVE' as const } : m
    );

    this.saveMembers(organizationId, updatedMembers);

    return {
      success: true,
      message: `Member ${target.userEmail} activated successfully.`,
      data: { ...target, status: 'ACTIVE' },
    };
  }

  /**
   * Change member role
   */
  public changeRole(params: ChangeRoleParams): TeamOperationResult<OrganizationMember> {
    const { organizationId, memberId, newRole, actorRole } = params;

    if (!canRolePerform(actorRole, 'ADMIN')) {
      return {
        success: false,
        message: 'Permission denied: Only Owner or Admin can alter member roles.',
        errorCode: 'DENY_INSUFFICIENT_PERMISSIONS',
      };
    }

    // Prevent privilege escalation
    if (ROLE_HIERARCHY_RANK[newRole] > ROLE_HIERARCHY_RANK[actorRole]) {
      return {
        success: false,
        message: `Security violation: You cannot assign a role (${newRole}) higher than your own (${actorRole}).`,
        errorCode: 'DENY_PRIVILEGE_ESCALATION',
      };
    }

    const members = this.listMembers(organizationId);
    const target = members.find((m) => m.id === memberId);

    if (!target) {
      return {
        success: false,
        message: 'Target member not found.',
        errorCode: 'MEMBER_NOT_FOUND',
      };
    }

    // Cannot demote Owner unless caller is Owner
    if (target.role === 'Owner' && actorRole !== 'Owner') {
      return {
        success: false,
        message: 'Security policy: Only the Owner can modify the Owner role.',
        errorCode: 'DENY_MODIFY_OWNER',
      };
    }

    const updatedMembers = members.map((m) =>
      m.id === memberId ? { ...m, role: newRole } : m
    );

    this.saveMembers(organizationId, updatedMembers);

    return {
      success: true,
      message: `Role for ${target.userEmail} changed to ${newRole}.`,
      data: { ...target, role: newRole },
    };
  }

  /**
   * Remove member from organization
   */
  public removeMember(params: MemberActionParams): TeamOperationResult {
    const { organizationId, memberId, actorRole } = params;

    if (!canRolePerform(actorRole, 'ADMIN')) {
      return {
        success: false,
        message: 'Permission denied: Only Owner or Admin can remove members.',
        errorCode: 'DENY_INSUFFICIENT_PERMISSIONS',
      };
    }

    const members = this.listMembers(organizationId);
    const target = members.find((m) => m.id === memberId);

    if (!target) {
      return {
        success: false,
        message: 'Target member not found.',
        errorCode: 'MEMBER_NOT_FOUND',
      };
    }

    if (target.role === 'Owner') {
      return {
        success: false,
        message: 'Security violation: Organization Owner cannot be removed.',
        errorCode: 'CANNOT_REMOVE_OWNER',
      };
    }

    if (target.role === 'Admin' && actorRole !== 'Owner') {
      return {
        success: false,
        message: 'Security policy: Only the Owner can remove an Admin.',
        errorCode: 'DENY_REMOVE_ADMIN',
      };
    }

    const updatedMembers = members.filter((m) => m.id !== memberId);
    this.saveMembers(organizationId, updatedMembers);

    return {
      success: true,
      message: `Member ${target.userEmail} removed from organization.`,
    };
  }
}

export const teamService = TeamService.getInstance();
