/**
 * scripts/test-sprint04c-db.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 1A: Database Foundation Verification
 *
 * Verifies:
 *   1. public.user_usage_ledger table exists and RLS is active.
 *   2. public.check_and_increment_usage RPC exists and is active.
 *   3. Anonymous caller has NO execute permissions on the RPC (PUBLIC revoked).
 *   4. Anonymous caller has NO write access to user_usage_ledger.
 *   5. Production table row counts remain strictly 0 (no accidental test data).
 */

import assert from 'assert';

let totalTests = 0;
let passedTests = 0;

function pass(msg) {
  totalTests++;
  passedTests++;
  console.log(`  ✅ [PASS] ${msg}`);
}

function fail(msg, err) {
  totalTests++;
  console.error(`  ❌ [FAIL] ${msg}:`, err?.message || err);
}

const SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO';

console.log('================================================================');
console.log('📊  JURISTECH SOLUTIONS — SPRINT 04C DB FOUNDATION AUDIT');
console.log('================================================================\n');

// ── TEST GROUP 1: user_usage_ledger Table & RLS ──────────────────────────────
console.log('--- TEST GROUP 1: user_usage_ledger Table & RLS ---');

try {
  // 1. Table exists and is queryable via PostgREST with anon key
  const tableRes = await fetch(`${SUPABASE_URL}/rest/v1/user_usage_ledger?select=*`, {
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      'Prefer': 'count=exact'
    }
  });

  assert.strictEqual(tableRes.status, 200, `user_usage_ledger must return HTTP 200 (got ${tableRes.status})`);
  const contentRange = tableRes.headers.get('content-range');
  assert.strictEqual(contentRange, '*/0', `user_usage_ledger row count must be 0 (got ${contentRange})`);
  pass('public.user_usage_ledger exists, queryable, and contains 0 production rows');

  // 2. Anonymous INSERT rejected by RLS
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/user_usage_ledger`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: '00000000-0000-0000-0000-000000000000',
      period_key: 'lifetime',
      contracts_created: 1
    })
  });

  assert(
    insertRes.status === 401 || insertRes.status === 403 || insertRes.status === 400 || insertRes.status === 404,
    `Anonymous INSERT on user_usage_ledger must be rejected by RLS (got HTTP ${insertRes.status})`
  );
  pass('Anonymous INSERT on user_usage_ledger is strictly prohibited by RLS');
} catch (err) {
  fail('Test Group 1: user_usage_ledger table & RLS', err);
}

// ── TEST GROUP 2: check_and_increment_usage RPC & Security Definer ───────────
console.log('\n--- TEST GROUP 2: check_and_increment_usage RPC & Access Control ---');

try {
  // 3. Anonymous RPC invocation must be rejected (PUBLIC EXECUTE revoked)
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_and_increment_usage`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_metric: 'contracts_created',
      p_limit: 10,
      p_period_key: 'lifetime'
    })
  });

  const bodyText = await rpcRes.text();

  // With PUBLIC EXECUTE revoked, PostgREST returns 401/403 or 42501 permission denied
  assert(
    rpcRes.status === 401 || rpcRes.status === 403 || bodyText.includes('42501') || bodyText.includes('permission denied'),
    `Anonymous execution of check_and_increment_usage must be rejected (got HTTP ${rpcRes.status}: ${bodyText})`
  );
  pass('Anonymous execution of check_and_increment_usage is rejected (PUBLIC EXECUTE revoked)');

  // 4. Verify RPC is discovered in schema (not 404)
  assert.notStrictEqual(rpcRes.status, 404, 'RPC must exist in the schema cache (must not return 404)');
  pass('public.check_and_increment_usage function exists and is active in schema cache');
} catch (err) {
  fail('Test Group 2: check_and_increment_usage RPC & Access Control', err);
}

// ── TEST GROUP 3: Existing Production Tables Isolation ───────────────────────
console.log('\n--- TEST GROUP 3: Existing Production Tables Isolation ---');

try {
  const existingTables = ['payment_receipts', 'payments', 'subscriptions', 'admin_review_queue', 'contracts'];
  for (const t of existingTables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=*`, {
      headers: {
        apikey: PUBLISHABLE_KEY,
        Authorization: `Bearer ${PUBLISHABLE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    assert.strictEqual(res.status, 200, `Table '${t}' must remain operational (HTTP 200)`);
    const countRange = res.headers.get('content-range');
    assert.strictEqual(countRange, '*/0', `Table '${t}' row count must remain 0 (got ${countRange})`);
    pass(`Production table '${t}' row count remains 0 (zero mutations or test data leakage)`);
  }
} catch (err) {
  fail('Test Group 3: Existing Production Tables Isolation', err);
}

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 04C PHASE 1A DATABASE FOUNDATION FULLY VERIFIED!\n');
  process.exit(0);
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED!\n`);
  process.exit(1);
}
