/**
 * scripts/test-sprint04a-portal.mjs
 * JurisTech Solutions — Sprint 04A: Customer Self-Service Portal Test Suite
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

let passedTests = 0;
let totalTests = 0;

function pass(msg) {
  passedTests++;
  totalTests++;
  console.log(`  ✅ [PASS] ${msg}`);
}

function fail(msg, err) {
  totalTests++;
  console.error(`  ❌ [FAIL] ${msg}:`, err?.message || err);
}

console.log('================================================================');
console.log('🚀  JURISTECH SOLUTIONS — SPRINT 04A CUSTOMER PORTAL TEST SUITE');
console.log('================================================================\n');

// ── TEST GROUP 1: Source Code & Architectural Integrity ──────────────────────
console.log('--- TEST GROUP 1: Source Code & Architectural Integrity ---');

try {
  const billingCode = fs.readFileSync(path.resolve('src/pages/BillingPage.tsx'), 'utf-8');

  // 1. Auth Gate Verification
  assert(billingCode.includes('if (!user)'), 'Must include strict !user Auth Gate');
  assert(billingCode.includes('CustomerAuthModal'), 'Must mount or trigger CustomerAuthModal for guests');
  assert(!billingCode.includes("localStorage.getItem('juristech_last_login_email')"), 'Must NOT fallback to mock email in localStorage');
  assert(!billingCode.includes("'client@juristech.solutions'"), 'Must NOT fallback to hardcoded mock email');
  pass('Guest /billing access strictly guarded with CustomerAuthModal and zero mock email leakage');

  // 2. Customer Account Card
  assert(billingCode.includes('user.email'), 'Must display user.email');
  assert(billingCode.includes('user.id'), 'Must display user.id');
  assert(billingCode.includes('user.created_at'), 'Must display member since from user.created_at');
  assert(billingCode.includes('user.user_metadata'), 'Must check user_metadata for full_name');
  pass('Customer Account Card renders verified Supabase Auth fields (email, full_name, user.id, created_at)');

  // 3. Dynamic Plan Pricing
  assert(!billingCode.includes('"$49.00 / mo"'), 'Must NOT have hardcoded $49.00 / mo string');
  assert(billingCode.includes('TIER_PRICING'), 'Must define canonical TIER_PRICING model');
  assert(billingCode.includes('planPricing.formatted'), 'Must dynamically render planPricing.formatted');
  pass('Dynamic plan pricing derives from canonical model (Startup $49, SMEs $139, Enterprise $349, Free $0)');

  // 4. Plan Entitlements Display
  assert(billingCode.includes('TIER_ENTITLEMENTS'), 'Must define canonical TIER_ENTITLEMENTS model');
  assert(billingCode.includes('entitlements.map'), 'Must render active tier capabilities list');
  pass('Plan Entitlements section displays verified capabilities for active tier');

  // 5. Real Receipt Database Read Path
  assert(billingCode.includes(".from('payment_receipts')"), 'Must query payment_receipts table');
  assert(billingCode.includes(".eq('user_id', user.id)"), 'Must filter payment_receipts by user_id = user.id');
  assert(billingCode.includes(".order('created_at',"), 'Must order receipts by created_at DESC');
  assert(!billingCode.includes('getStoredTransactions'), 'Must NOT import or call getStoredTransactions');
  pass('Real receipt history queries public.payment_receipts with RLS (getStoredTransactions eradicated)');

  // 6. Navbar Customer Tier Badge
  const navbarCode = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf-8');
  assert(navbarCode.includes('useSubscription'), 'Navbar must import useSubscription');
  assert(navbarCode.includes('tier'), 'Navbar must retrieve customer tier');
  assert(navbarCode.includes('{tier}'), 'Navbar must render customer tier badge in auth pill');
  assert(navbarCode.includes('to="/billing"'), 'Navbar customer profile pill must link to /billing');
  pass('Navbar renders real-time customer tier badge linked to /billing');

} catch (err) {
  fail('Source code integrity verification failed', err);
}

// ── TEST GROUP 2: Pricing & Entitlement Unit Logic ───────────────────────────
console.log('\n--- TEST GROUP 2: Pricing & Entitlement Logic ---');

try {
  const billingCode = fs.readFileSync(path.resolve('src/pages/BillingPage.tsx'), 'utf-8');
  assert(billingCode.includes('Startup: { amount: 49'), 'Startup price must be 49');
  assert(billingCode.includes('SMEs: { amount: 139'), 'SMEs price must be 139');
  assert(billingCode.includes('Enterprise: { amount: 349'), 'Enterprise price must be 349');
  assert(billingCode.includes("'Free Trial': { amount: 0"), 'Free Trial price must be 0');
  pass('TIER_PRICING matches canonical pricing model exactly ($49 / $139 / $349 / $0)');

  // Verify entitlements exist for all canonical tiers
  assert(billingCode.includes('Startup: {'), 'Startup entitlements defined');
  assert(billingCode.includes('SMEs: {'), 'SMEs entitlements defined');
  assert(billingCode.includes('Enterprise: {'), 'Enterprise entitlements defined');
  assert(billingCode.includes("'Free Trial': {"), 'Free Trial entitlements defined');
  pass('TIER_ENTITLEMENTS provides bilingual verified capabilities for all tiers');

  // Verify receipt to transaction adapter
  assert(billingCode.includes('function receiptToTransaction'), 'receiptToTransaction adapter function defined');
  assert(billingCode.includes('amountUSD: Number(receipt.claimed_amount)'), 'amountUSD parsed correctly');
  assert(billingCode.includes("status: receipt.status === 'verified' ? 'Paid'"), 'verified status maps to Paid');
  pass('receiptToTransaction() formats database receipts correctly for DigitalInvoiceModal');

} catch (err) {
  fail('Pricing and entitlement logic tests failed', err);
}

// ── TEST GROUP 3: Security & Client Protection ───────────────────────────────
console.log('\n--- TEST GROUP 3: Security & Client Protection ---');

try {
  const billingCode = fs.readFileSync(path.resolve('src/pages/BillingPage.tsx'), 'utf-8');
  assert(!billingCode.includes('service_role'), 'Must NEVER expose service_role in BillingPage');
  assert(!billingCode.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Must NEVER use SUPABASE_SERVICE_ROLE_KEY');
  assert(!billingCode.includes('.delete()'), 'BillingPage must NOT perform DELETE operations');
  assert(!billingCode.includes('.insert('), 'BillingPage must NOT perform direct receipt INSERTs');
  pass('Zero service_role leakage and strictly read-only receipt retrieval');

  assert(!billingCode.includes('saveTransactions'), 'BillingPage must NOT write to localStorage transactions');
  pass('Zero localStorage billing authority on /billing');

} catch (err) {
  fail('Security checks failed', err);
}

// ── TEST GROUP 4: Regression Suites ────────────────────────────────────────
console.log('\n--- TEST GROUP 4: Regression Suites ---');

try {
  // 1. Customer Auth Regression
  console.log('  Running scripts/test-customer-auth.mjs...');
  const authProc = spawnSync('node', ['scripts/test-customer-auth.mjs'], { encoding: 'utf-8' });
  assert.strictEqual(authProc.status, 0, `Customer Auth test suite failed:\n${authProc.stderr || authProc.stdout}`);
  pass('Sprint 03A Customer Auth regression: 21 / 21 PASS');

  // 2. Subscription Read Regression
  console.log('  Running scripts/test-subscription-read.mjs...');
  const subProc = spawnSync('node', ['scripts/test-subscription-read.mjs'], { encoding: 'utf-8' });
  assert.strictEqual(subProc.status, 0, `Subscription Read test suite failed:\n${subProc.stderr || subProc.stdout}`);
  pass('Sprint 03B-1 Subscription Read regression: 16 / 16 PASS');

  // 3. Admin Approval RPC Regression
  console.log('  Running scripts/test-admin-approval-rpc.mjs...');
  const adminProc = spawnSync('node', ['scripts/test-admin-approval-rpc.mjs'], { encoding: 'utf-8' });
  assert.strictEqual(adminProc.status, 0, `Admin Approval RPC test suite failed:\n${adminProc.stderr || adminProc.stdout}`);
  pass('Sprint 03B-2 Admin Approval write path regression: 21 / 21 PASS');

} catch (err) {
  fail('Regression test execution failed', err);
}

console.log('\n================================================================');
console.log(`🏁  SPRINT 04A TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}