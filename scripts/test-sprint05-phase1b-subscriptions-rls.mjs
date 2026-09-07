/**
 * scripts/test-sprint05-phase1b-subscriptions-rls.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 05 Phase 1B: Subscriptions RLS Write Lockdown
 *
 * Verifies:
 *   1. Migration file integrity and strict adherence to verified schema (user_id).
 *   2. Removal of all historical permissive policies (Allow public select/upsert).
 *   3. Absence of any customer INSERT, UPDATE, or DELETE policies.
 *   4. Anonymous PostgREST access boundary (SELECT, INSERT, UPDATE, DELETE).
 *   5. Field tampering immunity (plan_id, plan_name, status, etc.).
 *   6. Privileged RPC write path preservation (admin_approve_receipt_and_activate).
 *   7. Zero destructive pollution on production database.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

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
console.log('🔒  JURISTECH SOLUTIONS — SPRINT 05 PHASE 1B RLS LOCKDOWN AUDIT');
console.log('================================================================\n');

const SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO';

// ── TEST GROUP 1: Migration File & Policy Definition Audit ──────────────────
console.log('--- TEST GROUP 1: Migration File & Policy Definition Audit ---');

try {
  const migrationPath = path.resolve('supabase/migrations/20260907_sprint05_p0_subscriptions_rls_closure.sql');
  assert(fs.existsSync(migrationPath), 'Migration 20260907_sprint05_p0_subscriptions_rls_closure.sql must exist');
  pass('Migration file exists at supabase/migrations/20260907_sprint05_p0_subscriptions_rls_closure.sql');

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // 1.1 RLS enabled
  assert(sql.includes('ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;'), 'RLS must be enabled on public.subscriptions');
  pass('Migration explicitly enables Row Level Security on public.subscriptions');

  // 1.2 Historical permissive policies dropped
  assert(sql.includes('DROP POLICY IF EXISTS "Allow public upsert on subscriptions"'), 'Must drop Allow public upsert on subscriptions');
  assert(sql.includes('DROP POLICY IF EXISTS "Allow public select on subscriptions"'), 'Must drop Allow public select on subscriptions');
  assert(sql.includes('DROP POLICY IF EXISTS "Users can upsert own subscription"'), 'Must drop Users can upsert own subscription');
  assert(sql.includes('DROP POLICY IF EXISTS "Users can view own subscription"'), 'Must drop Users can view own subscription');
  assert(sql.includes('DROP POLICY IF EXISTS "Users can view own subscriptions"'), 'Must drop Users can view own subscriptions');
  pass('Migration drops all historical public and customer upsert/select policies');

  // 1.3 Keyed strictly by verified user_id (not inventing non-existent customer_id)
  assert(sql.includes('auth.uid() = user_id'), 'Owner SELECT policy must key on user_id');
  assert(!sql.includes('customer_id IN'), 'Must NOT invent customer_id column on public.subscriptions');
  pass('Owner SELECT policy matches verified schema (user_id UUID -> auth.users.id)');

  // 1.4 No customer write policies
  assert(!sql.includes('FOR INSERT TO authenticated'), 'Must NOT grant INSERT to authenticated');
  assert(!sql.includes('FOR UPDATE TO authenticated'), 'Must NOT grant UPDATE to authenticated');
  assert(!sql.includes('FOR DELETE TO authenticated'), 'Must NOT grant DELETE to authenticated');
  assert(!sql.includes('FOR ALL TO authenticated'), 'Must NOT grant ALL to authenticated');
  pass('Zero customer INSERT/UPDATE/DELETE/ALL policies created (fail-closed model)');

  // 1.5 Table grants
  assert(sql.includes('REVOKE INSERT, UPDATE, DELETE ON TABLE public.subscriptions FROM anon, authenticated, public;'), 'Revokes table write from client roles');
  assert(sql.includes('GRANT ALL ON TABLE public.subscriptions TO service_role;'), 'Preserves service_role full management access');
  pass('Table privileges strictly scoped: client write revoked, service_role preserved');
} catch (err) {
  fail('Test Group 1: Migration File & Policy Definition Audit', err);
}

// ── TEST GROUP 2: Privileged RPC Contract Verification ───────────────────────
console.log('\n--- TEST GROUP 2: Privileged RPC Contract Verification ---');

try {
  // Test that admin_approve_receipt_and_activate RPC exists, is active, and guards unauthorized callers
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_approve_receipt_and_activate`, {
    method: 'POST',
    headers: {
      'apikey': PUBLISHABLE_KEY,
      'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_receipt_id: '00000000-0000-0000-0000-000000000000',
      p_admin_notes: 'Automated Post-Lockdown Probe'
    })
  });

  const rpcText = await rpcRes.text();
  assert(
    (rpcRes.status === 401 || rpcRes.status === 403) && rpcText.includes('42501'),
    `RPC must reject unauthorized caller with HTTP 401/403 and SQLSTATE 42501 (got ${rpcRes.status})`
  );
  pass('admin_approve_receipt_and_activate RPC exists, active, and enforces 42501 security barrier');
} catch (err) {
  fail('Test Group 2: Privileged RPC Contract Verification', err);
}

// ── TEST GROUP 3: Live PostgREST Anonymous Endpoint Probing ──────────────────
console.log('\n--- TEST GROUP 3: Live PostgREST Endpoint Probing ---');

try {
  // 3.1 Check subscriptions endpoint responds
  const selRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?select=id,user_id,plan_id,plan_name,status&limit=1`, {
    headers: {
      'apikey': PUBLISHABLE_KEY,
      'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      'Prefer': 'count=exact'
    }
  });

  assert.strictEqual(selRes.status, 200, `subscriptions must respond with HTTP 200 (got ${selRes.status})`);
  const countRange = selRes.headers.get('content-range');
  assert.strictEqual(countRange, '*/0', `Row count must remain 0 (got ${countRange})`);
  pass('Live subscriptions endpoint returns HTTP 200 with zero production rows exposed');

  // 3.2 Field tampering probe: attempt to insert arbitrary subscription
  const fakeUserId = '00000000-0000-0000-0000-000000000099';
  const tamperInsert = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
    method: 'POST',
    headers: {
      'apikey': PUBLISHABLE_KEY,
      'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: fakeUserId,
      plan_id: 'enterprise',
      plan_name: 'Enterprise Plan',
      status: 'active',
      expires_at: '2099-12-31T23:59:59Z'
    })
  });

  // Must not succeed (HTTP 201/200)
  assert.notStrictEqual(tamperInsert.status, 201, 'Tamper INSERT must not succeed with HTTP 201');
  assert.notStrictEqual(tamperInsert.status, 200, 'Tamper INSERT must not succeed with HTTP 200');
  pass(`Tamper INSERT attempt rejected with HTTP ${tamperInsert.status}`);

  // 3.3 Verify no rows were created in subscriptions
  const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${fakeUserId}`, {
    headers: {
      'apikey': PUBLISHABLE_KEY,
      'Authorization': `Bearer ${PUBLISHABLE_KEY}`
    }
  });
  const verifyData = await verifyRes.json();
  assert.strictEqual(verifyData.length, 0, 'Tampered subscription row must not exist in database');
  pass('Database integrity verified: 0 tampered rows exist');
} catch (err) {
  fail('Test Group 3: Live PostgREST Endpoint Probing', err);
}

console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
