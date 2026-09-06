/**
 * src/security/rbacResolver.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical Role-Based Access Control (RBAC) Engine
 * Sprint 01 Foundation (Phase 9D)
 *
 * 8 Canonical Roles:
 * Owner, Admin, Legal, Compliance, Finance, Procurement, Analyst, Viewer
 *
 * 10 Canonical Permissions:
 * VIEW, CREATE, EDIT, DELETE, EXPORT, SHARE, APPROVE, BILLING, API, ADMIN
 */

import { SaaSRole, SaaSPermission } from '../types/saas';

export const ROLE_PERMISSIONS: Record<SaaSRole, readonly SaaSPermission[]> = {
  Owner: [
    'VIEW',
    'CREATE',
    'EDIT',
    'DELETE',
    'EXPORT',
    'SHARE',
    'APPROVE',
    'BILLING',
    'API',
    'ADMIN',
  ],
  Admin: [
    'VIEW',
    'CREATE',
    'EDIT',
    'EXPORT',
    'SHARE',
    'APPROVE',
    'API',
    'ADMIN',
  ],
  Legal: [
    'VIEW',
    'CREATE',
    'EDIT',
    'EXPORT',
    'SHARE',
    'APPROVE',
  ],
  Compliance: [
    'VIEW',
    'EXPORT',
    'APPROVE',
  ],
  Finance: [
    'VIEW',
    'EXPORT',
    'BILLING',
  ],
  Procurement: [
    'VIEW',
    'CREATE',
    'EDIT',
    'EXPORT',
    'SHARE',
  ],
  Analyst: [
    'VIEW',
    'CREATE',
    'EXPORT',
  ],
  Viewer: [
    'VIEW',
  ],
};

/**
 * Check if a role possesses a specific permission.
 */
export function hasPermission(role: SaaSRole | null | undefined, permission: SaaSPermission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export const canRolePerform = hasPermission;

/**
 * Get all permissions assigned to a canonical role.
 */
export function getPermissionsForRole(role: SaaSRole | null | undefined): SaaSPermission[] {
  if (!role) return [];
  return [...(ROLE_PERMISSIONS[role] || [])];
}

export const getRolePermissions = getPermissionsForRole;

/**
 * Backward compatibility bridge:
 * Maps legacy role strings across the codebase into canonical SaaSRoles.
 */
export function mapLegacyRoleToCanonicalRole(legacyRole?: string | null): SaaSRole {
  if (!legacyRole) return 'Viewer';

  const normalized = legacyRole.trim().toLowerCase().replace(/[_\s/-]+/g, '');

  switch (normalized) {
    case 'superadmin':
    case 'owner':
    case 'generalcounsel':
    case 'chieflegal':
      return 'Owner';

    case 'admin':
    case 'legalopslead':
    case 'legaloperations':
      return 'Admin';

    case 'lawyer':
    case 'legal':
    case 'legalcounsel':
    case 'seniorcounsel':
    case 'staffattorney':
      return 'Legal';

    case 'compliance':
    case 'complianceofficer':
    case 'dpo':
      return 'Compliance';

    case 'finance':
    case 'cfo':
    case 'billing':
      return 'Finance';

    case 'procurement':
    case 'purchasing':
    case 'vendorlead':
      return 'Procurement';

    case 'analyst':
    case 'reviewer':
    case 'member':
      return 'Analyst';

    case 'client':
    case 'viewer':
    case 'clientviewer':
    case 'guest':
    default:
      return 'Viewer';
  }
}
