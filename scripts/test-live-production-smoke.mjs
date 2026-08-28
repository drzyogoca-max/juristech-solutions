/**
 * scripts/test-live-production-smoke.mjs
 * Live Production Smoke Test against active Vercel Production deployment:
 * https://project-dm6godl1o-drzyogoca-4177s-projects.vercel.app
 */

import crypto from 'crypto';
import fs from 'fs';

const PROD_URL = 'https://www.juristech.solutions';
const secrets = JSON.parse(fs.readFileSync('.env.live.secrets.json', 'utf8'));

let passed = 0;
let total = 0;
const failures = [];

function assert(condition, name, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failures.push({ name, details });
    console.error(`  ❌ [FAIL] ${name}: ${details}`);
  }
}

async function runLiveSmokeTests() {
  console.log('================================================================');
  console.log(`🌐 LIVE PRODUCTION SMOKE TESTING: ${PROD_URL}`);
  console.log('================================================================\n');

  // 1. Cron without secret => 401
  console.log('📌 Test 1: Cron without secret => 401');
  const cronResNoSecret = await fetch(`${PROD_URL}/api/cron/autonomous-outreach`, {
    method: 'POST',
    headers: {}
  });
  assert(cronResNoSecret.status === 401, 'Cron without secret returns 401', `HTTP ${cronResNoSecret.status}`);

  // 2. Cron with invalid secret => 401
  console.log('📌 Test 2: Cron with invalid secret => 401');
  const cronResBadSecret = await fetch(`${PROD_URL}/api/cron/autonomous-outreach`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer bad_invalid_secret_xyz' }
  });
  assert(cronResBadSecret.status === 401, 'Cron with invalid secret returns 401', `HTTP ${cronResBadSecret.status}`);

  // 3. Cron with valid secret => 200
  console.log('📌 Test 3: Cron with valid secret => 200');
  const cronResValid = await fetch(`${PROD_URL}/api/cron/autonomous-outreach`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${secrets.CRON_SECRET}` }
  });
  const cronJson = await cronResValid.json();
  assert(cronResValid.status === 200 && cronJson.success === true, 'Cron with valid secret returns 200 OK', `HTTP ${cronResValid.status}`);

  // 4. Payment webhook with no signature => 401
  console.log('📌 Test 4: Webhook with missing signature => 401');
  const whResNoSig = await fetch(`${PROD_URL}/api/webhooks/payment?provider=paddle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type: 'transaction.completed' })
  });
  assert(whResNoSig.status === 401, 'Webhook with missing signature returns 401', `HTTP ${whResNoSig.status}`);

  // 5. Payment webhook with invalid signature => 401
  console.log('📌 Test 5: Webhook with forged signature => 401');
  const whResBadSig = await fetch(`${PROD_URL}/api/webhooks/payment?provider=paddle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'paddle-signature': 'fake_forged_paddle_signature_123456789'
    },
    body: JSON.stringify({ event_type: 'transaction.completed' })
  });
  assert(whResBadSig.status === 401, 'Webhook with invalid signature returns 401', `HTTP ${whResBadSig.status}`);

  // 6. Payment webhook with valid HMAC signature => 200 Accepted
  console.log('📌 Test 6: Webhook with valid HMAC signature => Accepted');
  const testPayload = {
    event_id: `EVT-LIVE-${Date.now()}`,
    event_type: 'transaction.completed',
    data: {
      id: 'txn_live_test_789',
      items: [{ price: { id: 'pri_01m0ty6sxjj7w0xpm1r07r50ss' } }],
      customer: { email: 'client@example.com' },
      details: { totals: { total: '19900' } },
      currency_code: 'USD'
    }
  };
  const rawBody = JSON.stringify(testPayload);
  const validSignature = crypto.createHmac('sha256', secrets.PADDLE_WEBHOOK_SECRET).update(rawBody).digest('hex');

  const whResValid = await fetch(`${PROD_URL}/api/webhooks/payment?provider=paddle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'paddle-signature': validSignature
    },
    body: rawBody
  });
  const whData = await whResValid.json();
  assert(whResValid.status === 200 && whData.success === true, 'Webhook with valid HMAC signature accepted with 200 OK', `HTTP ${whResValid.status}`);

  // 7. Duplicate webhook event => 200 Idempotent duplicate
  console.log('📌 Test 7: Duplicate Webhook Event => Idempotent');
  const whResDup = await fetch(`${PROD_URL}/api/webhooks/payment?provider=paddle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'paddle-signature': validSignature
    },
    body: rawBody
  });
  const whDupData = await whResDup.json();
  assert(whResDup.status === 200 && whDupData.duplicate === true, 'Duplicate webhook event handled idempotently (no duplicate activation)', `HTTP ${whResDup.status}`);

  // 8. Admin API without authorization => 401
  console.log('📌 Test 8: Admin API without authorization => 401');
  const adminResNoAuth = await fetch(`${PROD_URL}/api/leads/get-staged`, {
    method: 'GET'
  });
  assert(adminResNoAuth.status === 401, 'Admin endpoint without authorization returns 401', `HTTP ${adminResNoAuth.status}`);

  // 9. Admin API with mock Bearer token bypass => 401
  console.log('📌 Test 9: Admin API with mock Bearer token => 401 (Bypass removed)');
  const adminResMockAuth = await fetch(`${PROD_URL}/api/leads/get-staged`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer juristech_admin_legacy_mock_token' }
  });
  assert(adminResMockAuth.status === 401, 'Admin endpoint with mock token returns 401', `HTTP ${adminResMockAuth.status}`);

  // 10. Admin API with valid ADMIN_SECRET_KEY => 200 OK
  console.log('📌 Test 10: Admin API with valid ADMIN_SECRET_KEY => 200 OK');
  const adminResValid = await fetch(`${PROD_URL}/api/leads/get-staged`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${secrets.ADMIN_SECRET_KEY}` }
  });
  assert(adminResValid.status === 200, 'Admin endpoint with valid ADMIN_SECRET_KEY returns 200 OK', `HTTP ${adminResValid.status}`);

  console.log('\n================================================================');
  console.log(`📊 LIVE SMOKE TEST SUMMARY: ${passed} / ${total} PASSED`);
  if (failures.length === 0) {
    console.log('🎉 ALL LIVE PRODUCTION SECURITY GATES VERIFIED SUCCESSFULLY!');
  } else {
    console.error(`⚠️ FAILURES (${failures.length}):`, failures);
  }
  console.log('================================================================\n');

  if (failures.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runLiveSmokeTests().catch(err => {
  console.error('Fatal live smoke runner error:', err);
  process.exit(1);
});
