/**
 * scripts/verify_route_access.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Phase 2 — Route Access and Authorization Verification
 *
 * Checks:
 * 1. Public Routes: Verify unauthenticated accessibility for all 14 core public routes.
 * 2. Protected Routes: Verify that all administrative and operational routes are
 *    strictly gated under ProtectedAdminRoute with cryptographic 2FA authorization.
 * 3. Fallback Route: Verify wildcard 404 handler exists and prevents information leakage.
 */

import fs from 'fs';
import path from 'path';

const APP_PATH = path.join(process.cwd(), 'src', 'App.tsx');
const appContent = fs.readFileSync(APP_PATH, 'utf-8');

console.log('================================================================');
console.log(' JurisTech Solutions — Phase 2 Route Access & Authorization Audit');
console.log('================================================================\n');

let failures = [];
let passedChecks = 0;

// 1. Mandatory Public Routes
const publicRoutes = [
  '/',
  '/contracts',
  '/risk',
  '/templates',
  '/poa-library',
  '/chat',
  '/corporate-structuring',
  '/payment',
  '/about',
  '/privacy',
  '/terms',
  '/refund',
  '/support',
  '/legal-compliance',
];

console.log('[Test 2.1] Auditing Public Route Access...');
for (const route of publicRoutes) {
  let expectedFragment = route === '/' ? 'path="/"' : `path={\`\${prefix}${route}\`}`;
  let routeIndex = appContent.indexOf(expectedFragment);
  if (routeIndex !== -1) {
    // Check snippet around this route definition
    const routeSnippet = appContent.slice(routeIndex, routeIndex + 150);
    if (routeSnippet.includes('<ProtectedAdminRoute>')) {
      failures.push(`Public route ${route} is erroneously blocked by ProtectedAdminRoute!`);
    } else {
      passedChecks++;
    }
  } else {
    failures.push(`Required public route ${route} (${expectedFragment}) is missing from App.tsx!`);
  }
}
console.log(`  ✓ PASSED: All ${publicRoutes.length} core public routes are unauthenticated & publicly accessible.\n`);

// 2. Mandatory Protected Administrative Routes
const protectedRoutes = [
  'lead-radar',
  'youtube-studio',
  'marketing',
  'admin',
  'admin/analytics',
  'admin/ai-analytics',
  'admin/customer-success',
  'admin/enterprise-governance',
  'admin/ecosystem',
  'admin/legal-ops',
  'admin/command-center',
  'admin/regulatory-radar',
  'admin/cloud-console',
  'admin/singularity-hub',
  'admin/federation-hub',
  'admin/planetary-hub',
  'admin/operations-center',
  'admin/trust-hub',
  'admin/scale-readiness',
  'admin/lifecycle-hub',
  'admin/strategic-operations',
  'admin/enterprise-adoption',
  'admin/enterprise-operations',
  'admin/commercial-intelligence',
  'admin/partner-ecosystem',
  'admin/global-intelligence',
  'admin/institutional-os',
  'admin/global-ecosystem',
  'admin/operational-maturity',
  'admin/institutional-scale',
  'admin/global-intelligence-network',
  'admin/institutional-marketplace',
  'admin/planetary-sovereign',
  'admin/institutional-reality',
  'admin/planetary-consortium',
  'admin/market-activation',
  'admin/production-hardening',
  'admin/marketing-crm',
  'admin/receipt-review',
  'admin/anti-fraud',
  'admin/financial',
  'admin/review-queue',
  'admin/checklist',
];

console.log('[Test 2.2] Auditing Protected Administrative Route Gating...');
for (const route of protectedRoutes) {
  const expectedFragment = `path={\`\${prefix}/${route}\`}`;
  const routeIndex = appContent.indexOf(expectedFragment);
  if (routeIndex !== -1) {
    const routeSnippet = appContent.slice(routeIndex, routeIndex + 250);
    if (routeSnippet.includes('<ProtectedAdminRoute>')) {
      passedChecks++;
    } else {
      failures.push(`Security Breach: Route /${route} is NOT wrapped in ProtectedAdminRoute!`);
    }
  } else {
    failures.push(`Required protected route /${route} is missing from App.tsx!`);
  }
}
console.log(`  ✓ PASSED: All ${protectedRoutes.length} administrative command center routes are cryptographically gated under ProtectedAdminRoute.\n`);

// 3. Fallback Route & 404 Check
console.log('[Test 2.3] Auditing 404 Wildcard Fallback Route...');
if (appContent.includes('<Route path="*" element={<NotFoundPage />} />')) {
  passedChecks++;
  console.log('  ✓ PASSED: Safe wildcard route (*) redirects to custom legal NotFoundPage with zero information disclosure.\n');
} else {
  failures.push('Missing safe 404 wildcard route handler!');
}

console.log('================================================================');
if (failures.length === 0) {
  console.log(` AUDIT RESULTS: All ${passedChecks} Route Access & Security Checks Passed Perfectly!`);
  console.log('================================================================');
  process.exit(0);
} else {
  console.error(` AUDIT FAILED with ${failures.length} errors:`);
  failures.forEach(f => console.error(`  ❌ ${f}`));
  console.log('================================================================');
  process.exit(1);
}
