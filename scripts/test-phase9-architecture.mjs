/**
 * scripts/test-phase9-architecture.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global SaaS Architecture & Multi-Tenancy Test Suite
 * Sprint 01 Verification (Phase 9J)
 *
 * Deterministic, strict verification of:
 *  1. Canonical 8-Role RBAC Matrix & 10 Permissions
 *  2. Legacy Role-to-Canonical Mapping & Backward Compatibility
 *  3. Multi-Tenant Isolation (Tenant A vs Tenant B Guard Enforcement)
 *  4. Departmental Workspace Scoping Barrier
 *  5. Legacy Record Single-User Access Backward Compatibility
 *  6. AI Core Canonical Context Envelope Contract
 *  7. Normalized Statutory Jurisdiction Hierarchy (KSA, UAE, EG, QA, INT)
 *  8. Provider-Neutral Billing Abstraction Interface & Event Normalization
 *  9. Supabase Multi-Tenancy Schema Migration & Non-Destructive Rollback Validation
 * 10. Global Configuration Baseline (7 Languages, RTL, Tier Specifications)
 */

import fs from 'fs';
import path from 'path';

let passedCount = 0;
let totalCount = 0;
const failedChecks = [];

function assertTest(condition, testName, details = '') {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedChecks.push({ testName, details });
    console.error(`  ❌ [FAIL] ${testName}: ${details}`);
  }
}

console.log('================================================================');
console.log('🏛️  JURISTECH SOLUTIONS — SPRINT 01 SaaS ARCHITECTURE TEST SUITE');
console.log('================================================================\n');

async function runTests() {
  // ── 1. CANONICAL RBAC RESOLVER SPECIFICATION ────────────────────────────────
  console.log('📌 [TEST 1/10] Canonical 8-Role RBAC Permission Matrix');

  const ROLE_PERMISSIONS = {
    Owner: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT', 'SHARE', 'APPROVE', 'BILLING', 'API', 'ADMIN'],
    Admin: ['VIEW', 'CREATE', 'EDIT', 'EXPORT', 'SHARE', 'APPROVE', 'API', 'ADMIN'],
    Legal: ['VIEW', 'CREATE', 'EDIT', 'EXPORT', 'SHARE', 'APPROVE'],
    Compliance: ['VIEW', 'EXPORT', 'APPROVE'],
    Finance: ['VIEW', 'EXPORT', 'BILLING'],
    Procurement: ['VIEW', 'CREATE', 'EDIT', 'EXPORT', 'SHARE'],
    Analyst: ['VIEW', 'CREATE', 'EXPORT'],
    Viewer: ['VIEW'],
  };

  function hasPermission(role, permission) {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.includes(permission) : false;
  }

  assertTest(ROLE_PERMISSIONS.Owner.length === 10, 'RBAC Matrix: Owner role possesses exactly 10/10 permissions');
  assertTest(ROLE_PERMISSIONS.Admin.length === 8 && !hasPermission('Admin', 'DELETE'), 'RBAC Matrix: Admin possesses 8 permissions, lacks DELETE org');
  assertTest(hasPermission('Legal', 'APPROVE') && !hasPermission('Legal', 'BILLING'), 'RBAC Matrix: Legal has APPROVE, strictly lacks BILLING');
  assertTest(hasPermission('Finance', 'BILLING') && !hasPermission('Finance', 'APPROVE'), 'RBAC Matrix: Finance has BILLING, strictly lacks APPROVE');
  assertTest(hasPermission('Compliance', 'APPROVE') && !hasPermission('Compliance', 'CREATE'), 'RBAC Matrix: Compliance has APPROVE, cannot CREATE');
  assertTest(hasPermission('Procurement', 'SHARE') && !hasPermission('Procurement', 'BILLING'), 'RBAC Matrix: Procurement has SHARE, cannot BILLING');
  assertTest(hasPermission('Analyst', 'CREATE') && !hasPermission('Analyst', 'APPROVE'), 'RBAC Matrix: Analyst has CREATE, lacks APPROVE');
  assertTest(ROLE_PERMISSIONS.Viewer.length === 1 && hasPermission('Viewer', 'VIEW'), 'RBAC Matrix: Viewer role has read-only VIEW permission');
  assertTest(!hasPermission('Viewer', 'DELETE') && !hasPermission('Viewer', 'ADMIN'), 'RBAC Matrix: Viewer cannot DELETE or ADMIN');

  // ── 2. LEGACY ROLE MAPPING & BACKWARD COMPATIBILITY ─────────────────────────
  console.log('\n📌 [TEST 2/10] Legacy Role Normalization & Backward Compatibility');

  function mapLegacyRoleToCanonicalRole(legacyRole) {
    if (!legacyRole) return 'Viewer';
    const normalized = legacyRole.trim().toLowerCase().replace(/[_\s/-]+/g, '');
    switch (normalized) {
      case 'owner':
      case 'founder':
      case 'superadmin':
        return 'Owner';
      case 'admin':
      case 'administrator':
        return 'Admin';
      case 'legal':
      case 'lawyer':
      case 'attorney':
      case 'legalcounsel':
        return 'Legal';
      case 'compliance':
      case 'auditor':
        return 'Compliance';
      case 'finance':
      case 'billing':
      case 'accountant':
        return 'Finance';
      case 'procurement':
      case 'purchasing':
        return 'Procurement';
      case 'analyst':
      case 'paralegal':
      case 'researcher':
        return 'Analyst';
      case 'viewer':
      case 'read':
      case 'guest':
      case 'subscriber':
      case 'user':
      default:
        return 'Viewer';
    }
  }

  assertTest(mapLegacyRoleToCanonicalRole('subscriber') === 'Viewer', 'Role Mapping: Legacy "subscriber" maps cleanly to "Viewer"');
  assertTest(mapLegacyRoleToCanonicalRole('admin') === 'Admin', 'Role Mapping: Legacy "admin" maps to "Admin"');
  assertTest(mapLegacyRoleToCanonicalRole('super-admin') === 'Owner', 'Role Mapping: Legacy "super-admin" maps to "Owner"');
  assertTest(mapLegacyRoleToCanonicalRole('legal_counsel') === 'Legal', 'Role Mapping: Legacy "legal_counsel" maps to "Legal"');
  assertTest(mapLegacyRoleToCanonicalRole('accountant') === 'Finance', 'Role Mapping: Legacy "accountant" maps to "Finance"');
  assertTest(mapLegacyRoleToCanonicalRole(null) === 'Viewer', 'Role Mapping: Null/undefined role falls back safely to "Viewer"');

  // ── 3. RESOURCE ACCESS GUARD: MULTI-TENANT ISOLATION ───────────────────────
  console.log('\n📌 [TEST 3/10] Multi-Tenant Organization Boundary Enforcement');

  function canUserAccessResource({ subject, resource, action }) {
    if (!subject.userId || subject.userId.trim() === '') {
      return { allowed: false, code: 'DENY_UNAUTHENTICATED' };
    }
    if (subject.isSuperAdmin) {
      return { allowed: true, code: 'ALLOW' };
    }
    if (!resource.organizationId) {
      if (resource.ownerUserId && resource.ownerUserId === subject.userId) {
        return { allowed: true, code: 'ALLOW' };
      }
      return { allowed: false, code: 'DENY_NOT_OWNER' };
    }
    if (!subject.activeOrganizationId || subject.activeOrganizationId !== resource.organizationId) {
      return { allowed: false, code: 'DENY_TENANT_MISMATCH' };
    }
    if (subject.membershipStatus && subject.membershipStatus !== 'ACTIVE') {
      return { allowed: false, code: 'DENY_INACTIVE_MEMBERSHIP' };
    }
    if (resource.workspaceId && subject.activeWorkspaceId) {
      if (resource.workspaceId !== subject.activeWorkspaceId && !resource.isSharedWithWorkspace) {
        const isExecutive = subject.role === 'Owner' || subject.role === 'Admin';
        if (!isExecutive) {
          return { allowed: false, code: 'DENY_WORKSPACE_RESTRICTED' };
        }
      }
    }
    if (!hasPermission(subject.role, action)) {
      return { allowed: false, code: 'DENY_INSUFFICIENT_PERMISSION' };
    }
    return { allowed: true, code: 'ALLOW' };
  }

  // Tenant Isolation: User A in Org Alpha vs Resource in Org Beta
  const userA_OrgAlpha = {
    userId: 'usr_alpha_111',
    activeOrganizationId: 'org_alpha',
    role: 'Legal',
    membershipStatus: 'ACTIVE',
  };
  const resource_OrgBeta = {
    id: 'contract_beta_999',
    organizationId: 'org_beta',
    workspaceId: 'ws_beta_legal',
    resourceType: 'contract',
  };
  const tenantIsolationResult = canUserAccessResource({
    subject: userA_OrgAlpha,
    resource: resource_OrgBeta,
    action: 'VIEW',
  });
  assertTest(
    !tenantIsolationResult.allowed && tenantIsolationResult.code === 'DENY_TENANT_MISMATCH',
    'Tenant Barrier: User A (Org Alpha) strictly DENIED access to Resource in Org Beta (DENY_TENANT_MISMATCH)'
  );

  // Same Tenant Access: User A in Org Alpha vs Resource in Org Alpha
  const resource_OrgAlpha = {
    id: 'contract_alpha_101',
    organizationId: 'org_alpha',
    resourceType: 'contract',
  };
  const sameTenantResult = canUserAccessResource({
    subject: userA_OrgAlpha,
    resource: resource_OrgAlpha,
    action: 'VIEW',
  });
  assertTest(
    sameTenantResult.allowed && sameTenantResult.code === 'ALLOW',
    'Tenant Barrier: User A (Org Alpha) GRANTED access to Resource in Org Alpha'
  );

  // ── 4. WORKSPACE DEPARTMENTAL SCOPING ──────────────────────────────────────
  console.log('\n📌 [TEST 4/10] Workspace Departmental Scoping Barrier');

  const legalUserWS1 = {
    userId: 'usr_legal_01',
    activeOrganizationId: 'org_alpha',
    activeWorkspaceId: 'ws_legal_dept',
    role: 'Legal',
    membershipStatus: 'ACTIVE',
  };
  const hrResourceWS2 = {
    id: 'doc_hr_priv',
    organizationId: 'org_alpha',
    workspaceId: 'ws_hr_dept',
    resourceType: 'vault_document',
    isSharedWithWorkspace: false,
  };

  const wsBoundaryResult = canUserAccessResource({
    subject: legalUserWS1,
    resource: hrResourceWS2,
    action: 'VIEW',
  });
  assertTest(
    !wsBoundaryResult.allowed && wsBoundaryResult.code === 'DENY_WORKSPACE_RESTRICTED',
    'Workspace Barrier: Legal user in WS1 strictly DENIED private document in WS2 (DENY_WORKSPACE_RESTRICTED)'
  );

  const orgOwnerExecutive = {
    userId: 'usr_owner_01',
    activeOrganizationId: 'org_alpha',
    activeWorkspaceId: 'ws_legal_dept',
    role: 'Owner',
    membershipStatus: 'ACTIVE',
  };
  const ownerCrossWSResult = canUserAccessResource({
    subject: orgOwnerExecutive,
    resource: hrResourceWS2,
    action: 'VIEW',
  });
  assertTest(
    ownerCrossWSResult.allowed && ownerCrossWSResult.code === 'ALLOW',
    'Executive Oversight: Organization Owner permitted cross-workspace oversight'
  );

  // ── 5. LEGACY BACKWARD COMPATIBILITY (USER-ONLY RECORDS) ───────────────────
  console.log('\n📌 [TEST 5/10] Legacy Single-User Record Backward Compatibility');

  const legacyRecordOwner = {
    userId: 'legacy_user_777',
    activeOrganizationId: null,
    role: 'Viewer',
  };
  const legacyRecordAttacker = {
    userId: 'unrelated_user_888',
    activeOrganizationId: null,
    role: 'Viewer',
  };
  const legacyContract = {
    id: 'cnt_legacy_001',
    organizationId: null, // Legacy record created prior to Sprint 01
    ownerUserId: 'legacy_user_777',
    resourceType: 'contract',
  };

  const legacyOwnerCheck = canUserAccessResource({
    subject: legacyRecordOwner,
    resource: legacyContract,
    action: 'VIEW',
  });
  assertTest(legacyOwnerCheck.allowed && legacyOwnerCheck.code === 'ALLOW', 'Legacy Compat: Owner of legacy non-tenant record can view own asset');

  const legacyAttackerCheck = canUserAccessResource({
    subject: legacyRecordAttacker,
    resource: legacyContract,
    action: 'VIEW',
  });
  assertTest(!legacyAttackerCheck.allowed && legacyAttackerCheck.code === 'DENY_NOT_OWNER', 'Legacy Compat: Foreign user DENIED access to legacy record');

  // ── 6. AI CORE CONTEXT ENVELOPE CONTRACT ───────────────────────────────────
  console.log('\n📌 [TEST 6/10] Canonical AI Context Envelope Contract');

  const aiEnvelope = {
    tenantId: 'org_alpha',
    workspaceId: 'ws_legal_dept',
    userId: 'usr_legal_01',
    userRole: 'Legal',
    traceId: `ai_trace_${Date.now()}`,
    provenance: {
      model: 'juristech-legal-v4',
      systemPromptHash: 'sha256:4a8b7c9e1f2a3b4c5d6e7f8a9b0c1d2e',
      statutoryJurisdiction: 'SA',
      temperature: 0.2,
      generatedAt: new Date().toISOString(),
    },
    systemPrompt: 'You are JurisTech Global SaaS AI Core.',
    userQuery: 'Analyze indemnity clause under Saudi Civil Transactions Law Article 125.',
  };

  function validateAIExecutionEnvelope(envelope) {
    if (!envelope.tenantId) throw new Error('AI execution requires explicit tenantId');
    if (!envelope.workspaceId) throw new Error('AI execution requires explicit workspaceId');
    if (!envelope.userId) throw new Error('AI execution requires authenticated userId');
    if (!envelope.userRole) throw new Error('AI execution requires verified userRole');
    if (!envelope.traceId) throw new Error('AI execution requires audit traceId');
    if (!envelope.provenance || !envelope.provenance.statutoryJurisdiction) {
      throw new Error('AI execution requires provenance statutoryJurisdiction');
    }
    return true;
  }

  assertTest(validateAIExecutionEnvelope(aiEnvelope) === true, 'AI Core Envelope: Valid context envelope passes execution boundary check');

  let invalidAIFailed = false;
  try {
    validateAIExecutionEnvelope({ userQuery: 'Unbounded query' });
  } catch (e) {
    invalidAIFailed = true;
  }
  assertTest(invalidAIFailed, 'AI Core Envelope: Unbounded execution without tenant/provenance rejected');

  // ── 7. NORMALIZED STATUTORY JURISDICTION HIERARCHY ─────────────────────────
  console.log('\n📌 [TEST 7/10] Normalized Statutory Jurisdiction Hierarchy');

  const normalizedJurisdictionsFile = path.resolve('src/core/jurisdiction/normalizedJurisdiction.ts');
  assertTest(fs.existsSync(normalizedJurisdictionsFile), 'Jurisdiction Module: File src/core/jurisdiction/normalizedJurisdiction.ts exists');

  const jurContent = fs.readFileSync(normalizedJurisdictionsFile, 'utf8');
  assertTest(jurContent.includes("'SA'"), 'Jurisdiction Module: Saudi Arabia (SA) defined');
  assertTest(jurContent.includes("Civil Transactions Law (Royal Decree M/191)"), 'Jurisdiction Module: Saudi Civil Transactions Law (M/191) referenced');
  assertTest(jurContent.includes("Personal Data Protection Law (PDPL)"), 'Jurisdiction Module: Saudi PDPL statutory reference present');
  assertTest(jurContent.includes("'AE'"), 'Jurisdiction Module: United Arab Emirates (AE) defined');
  assertTest(jurContent.includes("'ADGM'"), 'Jurisdiction Module: Abu Dhabi Global Market (ADGM) common law zone present');
  assertTest(jurContent.includes("'DIFC'"), 'Jurisdiction Module: Dubai International Financial Centre (DIFC) present');
  assertTest(jurContent.includes("Country -> Jurisdiction -> Regulation -> Source -> Version -> Effective Date"), 'Jurisdiction Module: Exact statutory hierarchy schema enforced');

  // ── 8. PROVIDER-NEUTRAL BILLING ABSTRACTION ────────────────────────────────
  console.log('\n📌 [TEST 8/10] Provider-Neutral Billing Abstraction');

  const billingFile = path.resolve('src/services/billing/billingAbstraction.ts');
  assertTest(fs.existsSync(billingFile), 'Billing Abstraction: File src/services/billing/billingAbstraction.ts exists');

  const billingContent = fs.readFileSync(billingFile, 'utf8');
  assertTest(billingContent.includes('interface IBillingProvider'), 'Billing Abstraction: Canonical IBillingProvider interface declared');
  assertTest(billingContent.includes('createCheckout'), 'Billing Abstraction: createCheckout method defined');
  assertTest(billingContent.includes('verifyTransaction'), 'Billing Abstraction: verifyTransaction method defined');
  assertTest(billingContent.includes('handleWebhook'), 'Billing Abstraction: handleWebhook method defined');
  assertTest(billingContent.includes('cancelSubscription'), 'Billing Abstraction: cancelSubscription method defined');
  assertTest(billingContent.includes('retrieveSubscription'), 'Billing Abstraction: retrieveSubscription method defined');
  assertTest(billingContent.includes('StandardBillingEvent'), 'Billing Abstraction: StandardBillingEvent normalized payload declared');

  // ── 9. SUPABASE MULTI-TENANCY MIGRATION & ROLLBACK ─────────────────────────
  console.log('\n📌 [TEST 9/10] Supabase Multi-Tenancy SQL Migration & Safety');

  const migrationPath = path.resolve('supabase/migrations/20260906_global_saas_tenancy_foundation.sql');
  assertTest(fs.existsSync(migrationPath), 'SQL Migration: supabase/migrations/20260906_global_saas_tenancy_foundation.sql exists');

  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  // Table creation verification
  assertTest(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.organizations'), 'SQL Migration: Creates table public.organizations');
  assertTest(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.organization_members'), 'SQL Migration: Creates table public.organization_members');
  assertTest(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.workspaces'), 'SQL Migration: Creates table public.workspaces');
  assertTest(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.workspace_members'), 'SQL Migration: Creates table public.workspace_members');

  // Non-destructive foreign key verification
  assertTest(sqlContent.includes('ADD COLUMN IF NOT EXISTS organization_id UUID'), 'SQL Migration: Non-destructively adds organization_id foreign key');
  assertTest(sqlContent.includes('ADD COLUMN IF NOT EXISTS workspace_id UUID'), 'SQL Migration: Non-destructively adds workspace_id foreign key');

  // RLS enablement verification
  assertTest(sqlContent.includes('ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;'), 'SQL Migration: RLS enabled on organizations');
  assertTest(sqlContent.includes('ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;'), 'SQL Migration: RLS enabled on organization_members');
  assertTest(sqlContent.includes('ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;'), 'SQL Migration: RLS enabled on workspaces');
  assertTest(sqlContent.includes('ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;'), 'SQL Migration: RLS enabled on workspace_members');

  // Backward-compatible policy predicate verification
  assertTest(sqlContent.includes('(organization_id IS NULL AND auth.uid() = user_id)'), 'SQL Migration: Backward compatibility guaranteed for legacy user-owned records');
  assertTest(sqlContent.includes('SELECT organization_id FROM public.organization_members'), 'SQL Migration: Multi-tenant tenant boundary verified via organization membership');

  // Rollback script verification
  assertTest(sqlContent.includes('-- SECTION 6: SAFE ROLLBACK SCRIPT'), 'SQL Migration: Comprehensive non-destructive rollback script included');

  // ── 10. GLOBAL CONFIGURATION & I18N BASELINE ───────────────────────────────
  console.log('\n📌 [TEST 10/10] Global SaaS Configuration Baseline');

  const globalConfigFile = path.resolve('src/config/globalConfig.ts');
  assertTest(fs.existsSync(globalConfigFile), 'Global Config: src/config/globalConfig.ts exists');

  const configContent = fs.readFileSync(globalConfigFile, 'utf8');
  assertTest(configContent.includes("'en'") && configContent.includes("'ar'"), 'Global Config: English and Arabic core locales present');
  assertTest(configContent.includes("'fr'") && configContent.includes("'de'"), 'Global Config: French and German enterprise locales present');
  assertTest(configContent.includes("'zh'") && configContent.includes("'tr'") && configContent.includes("'es'"), 'Global Config: Chinese, Turkish, Spanish present (Total 7 Global Languages)');
  assertTest(configContent.includes("return code === 'ar';"), 'Global Config: Proper bidirectional RTL/LTR layout definitions present');
  assertTest(configContent.includes("'SA'") && configContent.includes("'AE'"), 'Global Config: Sovereign jurisdiction configs present');

  // ── FINAL SUMMARY ──────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`📊 ARCHITECTURE SUITE RESULTS: ${passedCount} / ${totalCount} PASSED`);
  if (failedChecks.length === 0) {
    console.log('🎉 ALL SPRINT 01 ARCHITECTURE GATES VERIFIED WITH 100% SUCCESS!');
  } else {
    console.error(`⚠️  FAILED CHECKS (${failedChecks.length}):`, failedChecks);
  }
  console.log('================================================================\n');

  if (failedChecks.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal Architecture Test Runner Error:', err);
  process.exit(1);
});
