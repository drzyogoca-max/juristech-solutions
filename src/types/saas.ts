/**
 * src/types/saas.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical Multi-Tenant Global SaaS Domain Model
 * Sprint 01 Foundation (Phase 9A)
 *
 * Logical Hierarchy:
 * Platform → Organization (Tenant) → Workspaces → Assets
 */

import { SupportedLanguage } from '../i18n';

// ── 1. CANONICAL ROLES & PERMISSIONS ──────────────────────────────────────────

export type SaaSRole =
  | 'Owner'
  | 'Admin'
  | 'Legal'
  | 'Compliance'
  | 'Finance'
  | 'Procurement'
  | 'Analyst'
  | 'Viewer';

export type SaaSPermission =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'EXPORT'
  | 'SHARE'
  | 'APPROVE'
  | 'BILLING'
  | 'API'
  | 'ADMIN';

// ── 2. TENANT & ORGANIZATION MODEL ────────────────────────────────────────────

export type OrganizationType =
  | 'company'
  | 'law_firm'
  | 'legal_department'
  | 'enterprise_group';

export type TenantStatus = 'ACTIVE' | 'PROVISIONING' | 'SUSPENDED' | 'DECOMMISSIONED';

export interface TenantOrganization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  primaryJurisdiction: string;
  ownerUserId: string;
  seatLimit: number;
  activeSeats: number;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  customDomain?: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  fullName?: string;
  role: SaaSRole;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  joinedAt: string;
}

// ── 3. WORKSPACE MODEL ────────────────────────────────────────────────────────

export type WorkspaceDepartment =
  | 'legal'
  | 'compliance'
  | 'procurement'
  | 'finance'
  | 'hr'
  | 'general';

export interface SaaSWorkspace {
  id: string;
  organizationId: string;
  name: string;
  department: WorkspaceDepartment;
  description?: string;
  allowedJurisdictions: string[];
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: SaaSRole;
  joinedAt: string;
}

// ── 4. CONTEXT LAYER (Phase 9A) ───────────────────────────────────────────────

export interface UserContext {
  userId: string;
  email: string;
  fullName?: string;
  isSuperAdmin: boolean;
  is2FAVerified: boolean;
}

export interface OrganizationContext {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  primaryJurisdiction: string;
  seatLimit: number;
  activeSeats: number;
  status: TenantStatus;
}

export interface WorkspaceContext {
  workspaceId: string;
  organizationId: string;
  name: string;
  department: WorkspaceDepartment;
  allowedJurisdictions: string[];
}

export interface SaaSContext {
  user: UserContext | null;
  organization: OrganizationContext | null;
  workspace: WorkspaceContext | null;
  role: SaaSRole | null;
  permissions: SaaSPermission[];
  locale: {
    lang: SupportedLanguage;
    dir: 'rtl' | 'ltr';
    isRtl: boolean;
  };
}

// ── 5. RESOURCE OWNERSHIP TYPES (Phase 9E) ────────────────────────────────────

export type ResourceType =
  | 'contract'
  | 'document'
  | 'risk_assessment'
  | 'ai_session'
  | 'billing'
  | 'audit_log'
  | 'api_key';

export interface SaaSResourceMetadata {
  id: string;
  type: ResourceType;
  ownerUserId?: string | null;
  organizationId?: string | null;
  workspaceId?: string | null;
  isSharedWithWorkspace?: boolean;
}
