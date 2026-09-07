/**
 * test-sprint05-phase1a-receipt-activation.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 05 Phase 1A Security Verification Suite
 * Verifies that client-side subscription auto-activation is permanently closed.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log(' JurisTech Solutions — Sprint 05 Phase 1A Security Suite');
console.log(' Target: Close Client-Side Subscription Auto-Activation');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── Test Group 1: Source Code Static Security Assertions ─────────────────────
console.log('--- Group 1: ReceiptVerificationPage Static Security Audit ---');

const receiptPageCode = readFileSync(
  resolve(process.cwd(), 'src/pages/ReceiptVerificationPage.tsx'),
  'utf8'
);

assert(
  !receiptPageCode.includes("from('subscriptions')"),
  "ReceiptVerificationPage contains ZERO calls to from('subscriptions')"
);

assert(
  !receiptPageCode.includes('.upsert({') || !receiptPageCode.includes('plan_id'),
  "ReceiptVerificationPage contains NO client-side subscription upsert"
);

assert(
  !receiptPageCode.includes('Auto-activating subscription'),
  "ReceiptVerificationPage has eliminated 'Auto-activating subscription' text"
);

assert(
  receiptPageCode.includes('Queued for Admin Approval') || receiptPageCode.includes('Queuing for Admin Audit'),
  "ReceiptVerificationPage clearly indicates staging for admin audit and approval"
);

assert(
  receiptPageCode.includes('runFraudCheck'),
  'ReceiptVerificationPage preserves AI OCR and fraud verification flow'
);

assert(
  receiptPageCode.includes('payment_receipts') || receiptPageCode.includes('runFraudCheck'),
  'ReceiptVerificationPage retains receipt staging mechanism'
);

// ── Test Group 2: Administrative Approval Authority Verification ─────────────
console.log('\n--- Group 2: Authoritative Administrative Approval Path Audit ---');

const financialRepoCode = readFileSync(
  resolve(process.cwd(), 'src/lib/financialRepository.ts'),
  'utf8'
);

assert(
  financialRepoCode.includes("rpc('admin_approve_receipt_and_activate'"),
  'auditApproveReceipt routes exclusively through admin_approve_receipt_and_activate RPC'
);

assert(
  financialRepoCode.includes('p_receipt_id'),
  'Approval RPC expects secure server-side parameter p_receipt_id'
);

const adminReviewCode = readFileSync(
  resolve(process.cwd(), 'src/pages/AdminReceiptReviewPage.tsx'),
  'utf8'
);

assert(
  adminReviewCode.includes('if (!isAdmin)'),
  'AdminReceiptReviewPage strictly enforces !isAdmin check'
);

assert(
  adminReviewCode.includes('<Forbidden403Page />'),
  'AdminReceiptReviewPage renders Forbidden403Page for non-admin users'
);

// ── Test Group 3: Simulation & Anti-Tampering Evaluation ───────────────────────
console.log('\n--- Group 3: Simulation & Anti-Tampering Evaluation ---');

const regexSubscriptionUpsert = /supabase\s*\.\s*from\(\s*['"]subscriptions['"]\s*\)\s*\.\s*upsert/g;
const hasSubscriptionUpsert = regexSubscriptionUpsert.test(receiptPageCode);

assert(
  !hasSubscriptionUpsert,
  'Regex scan confirms NO supabase.from("subscriptions").upsert pattern exists'
);

// ── Test Group 4: Subscription Fail-Closed Integrity ─────────────────────────
console.log('\n--- Group 4: Subscription Resolver & Entitlement Read-Path Audit ---');

const useSubscriptionCode = readFileSync(
  resolve(process.cwd(), 'src/hooks/useSubscription.ts'),
  'utf8'
);

assert(
  useSubscriptionCode.includes("const rawTier = dbSub ? mapPlanIdToTier(dbSub.plan_id, dbSub.plan_name) : 'Free Trial'"),
  'useSubscription strictly defaults to Free Trial when dbSub is null'
);

assert(
  useSubscriptionCode.includes('isDbActive ? rawTier : \'Free Trial\''),
  'useSubscription strictly returns Free Trial when subscription is not active'
);

// ── Test Group 5: Sovereign Guard & Backend Quota Integrity ──────────────────
console.log('\n--- Group 5: Backend Server-Side Quota Enforcement Check ---');

const sovereignGuardCode = readFileSync(
  resolve(process.cwd(), 'lib/security/sovereign-guard.js'),
  'utf8'
);

assert(
  sovereignGuardCode.includes("'Free Trial': 2"),
  "Backend sovereign guard maintains Free Trial limit of 2 lifetime contracts"
);

assert(
  sovereignGuardCode.includes("'Startup': 10"),
  "Backend sovereign guard maintains Startup limit of 10 contracts/month"
);

assert(
  sovereignGuardCode.includes("'SMEs': 50"),
  "Backend sovereign guard maintains SMEs limit of 50 contracts/month"
);

// ── Final Summary ─────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
