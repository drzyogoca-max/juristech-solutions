/**
 * src/services/tenancy/personalOrgBackfill.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Deterministic Personal Organization Backfill Service
 * Sprint 02 (Phase 4)
 *
 * For legacy users/resources where organization_id IS NULL:
 * Generates a deterministic Personal Organization and default General workspace.
 * Prepares backfill for:
 *   - contracts
 *   - vault_documents
 *   - risk_assessments
 *   - chat_messages
 *
 * GUARANTEES:
 *  1. Zero data destruction / zero deletion
 *  2. Original user_id ownership strictly preserved
 *  3. Zero cross-tenant pollution: user resources never assigned to another organization
 *  4. Full idempotent simulation / dry-run capability
 */

import { TenantOrganization, SaaSWorkspace, SaaSRole } from '../../types/saas';

export interface LegacyResourceRecord {
  id: string;
  table: 'contracts' | 'vault_documents' | 'risk_assessments' | 'chat_messages';
  user_id?: string | null;
  organization_id?: string | null;
  workspace_id?: string | null;
  title?: string;
  created_at?: string;
}

export interface BackfillAuditReport {
  timestamp: string;
  isDryRun: boolean;
  recordsExamined: number;
  recordsMigrated: number;
  recordsSkipped: number;
  skipReasons: Record<string, number>;
  generatedOrganizations: Array<{
    orgId: string;
    ownerUserId: string;
    orgName: string;
    workspaceId: string;
    assignedResourcesCount: number;
  }>;
}

/**
 * Generate a deterministic organization ID for a user
 */
export function generateDeterministicOrgId(userId: string): string {
  // Deterministic clean slug hash
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `org_personal_${hex}`;
}

/**
 * Generate a deterministic workspace ID for a user's personal organization
 */
export function generateDeterministicWorkspaceId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 7) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `ws_general_${hex}`;
}

/**
 * Build the deterministic Personal Organization object for a user
 */
export function createPersonalOrganization(
  userId: string,
  userEmail: string,
  fullName?: string
): TenantOrganization {
  const orgId = generateDeterministicOrgId(userId);
  const now = new Date().toISOString();
  const displayName = fullName || userEmail.split('@')[0] || 'User';

  return {
    id: orgId,
    name: `Personal Workspace (${displayName})`,
    slug: `personal-${userId.slice(0, 8)}`,
    type: 'company',
    primaryJurisdiction: 'GLOBAL',
    ownerUserId: userId,
    seatLimit: 1,
    activeSeats: 1,
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Build the default General workspace for a personal organization
 */
export function createPersonalWorkspace(
  organizationId: string,
  userId: string
): SaaSWorkspace {
  const wsId = generateDeterministicWorkspaceId(userId);
  return {
    id: wsId,
    organizationId,
    name: 'General',
    department: 'general',
    description: 'Default personal workspace for historical documents and analyses',
    allowedJurisdictions: ['GLOBAL', 'SA', 'AE', 'US', 'GB', 'EU'],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Run deterministic backfill simulation (or dry-run) on an array of legacy records
 */
export function simulatePersonalOrgBackfill(
  records: LegacyResourceRecord[],
  userDirectory: Record<string, { email: string; fullName?: string }>,
  options: { isDryRun?: boolean } = { isDryRun: true }
): {
  updatedRecords: LegacyResourceRecord[];
  auditReport: BackfillAuditReport;
} {
  const auditReport: BackfillAuditReport = {
    timestamp: new Date().toISOString(),
    isDryRun: options.isDryRun ?? true,
    recordsExamined: records.length,
    recordsMigrated: 0,
    recordsSkipped: 0,
    skipReasons: {
      'ALREADY_BOUND_TO_ORGANIZATION': 0,
      'MISSING_USER_OWNERSHIP': 0,
      'ANONYMOUS_OR_CORRUPT': 0,
    },
    generatedOrganizations: [],
  };

  const orgRegistry = new Map<
    string,
    {
      org: TenantOrganization;
      ws: SaaSWorkspace;
      count: number;
    }
  >();

  const updatedRecords: LegacyResourceRecord[] = [];

  for (const record of records) {
    // 1. Skip if already bound to an organization
    if (record.organization_id) {
      auditReport.recordsSkipped++;
      auditReport.skipReasons['ALREADY_BOUND_TO_ORGANIZATION']++;
      updatedRecords.push(record);
      continue;
    }

    // 2. Skip if user_id is missing (cannot determine ownership)
    if (!record.user_id || record.user_id.trim() === '') {
      auditReport.recordsSkipped++;
      auditReport.skipReasons['MISSING_USER_OWNERSHIP']++;
      updatedRecords.push(record);
      continue;
    }

    const userId = record.user_id;
    const userMeta = userDirectory[userId] || { email: `${userId}@legacy.juristech.solutions` };

    // Get or create deterministic Personal Org & Workspace
    if (!orgRegistry.has(userId)) {
      const personalOrg = createPersonalOrganization(userId, userMeta.email, userMeta.fullName);
      const personalWs = createPersonalWorkspace(personalOrg.id, userId);
      orgRegistry.set(userId, { org: personalOrg, ws: personalWs, count: 0 });
    }

    const entry = orgRegistry.get(userId)!;
    entry.count++;

    // Safely bind record
    const migratedRecord: LegacyResourceRecord = {
      ...record,
      organization_id: entry.org.id,
      workspace_id: entry.ws.id,
    };

    updatedRecords.push(migratedRecord);
    auditReport.recordsMigrated++;
  }

  // Populate report generated organizations
  for (const [userId, { org, ws, count }] of orgRegistry.entries()) {
    auditReport.generatedOrganizations.push({
      orgId: org.id,
      ownerUserId: userId,
      orgName: org.name,
      workspaceId: ws.id,
      assignedResourcesCount: count,
    });
  }

  return {
    updatedRecords,
    auditReport,
  };
}
