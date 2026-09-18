/**
 * scripts/test-live-production-smoke.mjs
 * Live Production Smoke Test against active Vercel Production deployment:
 * https://project-dm6godl1o-drzyogoca-4177s-projects.vercel.app
 */

import crypto from 'crypto';

const PROD_URL = 'https://www.juristech.solutions';
const cronSecret = process.env.CRON_SECRET || '';

let passed = 0;
let total = 0;
const failures = [];

function assert(condition, name, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  âœ… [PASS] ${name}`);
  } else {
    failures.push({ name, details });
    console.error(`  âŒ [FAIL] ${name}: ${details}`);
  }
}

async function runLiveSmokeTests() {
  console.log('================================================================');
  console.log(`ðŸŒ LIVE PRODUCTION SMOKE TESTING: ${PROD_URL}`);
  console.log('================================================================\n');

  // 1. Cron without secret => 401
  console.log('ðŸ“Œ Test 1: Cron without secret => 401');
  const cronResNoSecret = await fetch(`${PROD_URL}/api/cron/autonomous-outreach`, {
    method: 'POST',
    headers: {}
  });
  assert(cronResNoSecret.status === 401, 'Cron without secret returns 401', `HTTP ${cronResNoSecret.status}`);

  // 2. Cron with invalid secret => 401
  console.log('ðŸ“Œ Test 2: Cron with invalid secret => 401');
  const cronResBadSecret = await fetch(`${PROD_URL}/api/cron/autonomous-outreach`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer bad_invalid_secret_xyz' }
  });
  assert(cronResBadSecret.status === 401, 'Cron with invalid secret returns 401', `HTTP ${cronResBadSecret.status}`);

  // 3. Positive cron verification only when a test secret is explicitly injected.
  // Never pull production secrets automatically.
  if (cronSecret) {
    console.log('📌 Test 3: Cron with valid secret => 200');
    const cronResValid = await fetch(`${PROD_URL}/api/cron/autonomous-outreach`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cronSecret}` }
    });
    const cronJson = await cronResValid.json();
    assert(cronResValid.status === 200 && cronJson.success === true, 'Cron with valid secret returns 200 OK', `HTTP ${cronResValid.status}`);
  } else {
    console.log('📌 Test 3: Cron with valid secret => SKIPPED (no local secret injected)');
  }

  // 4. Payment webhook with no signature => 401
  console.log('ðŸ“Œ Test 4: Webhook with missing signature => 401');
  const whResNoSig = await fetch(`${PROD_URL}/api/webhooks/payment?provider=paddle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type: 'transaction.completed' })
  });
  assert(whResNoSig.status === 401, 'Webhook with missing signature returns 401', `HTTP ${whResNoSig.status}`);

  // 5. Payment webhook with invalid signature => 401
  console.log('ðŸ“Œ Test 5: Webhook with forged signature => 401');
  const whResBadSig = await fetch(`${PROD_URL}/api/webhooks/payment?provider=paddle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'paddle-signature': 'fake_forged_paddle_signature_123456789'
    },
    body: JSON.stringify({ event_type: 'transaction.completed' })
  });
  assert(whResBadSig.status === 401, 'Webhook with invalid signature returns 401', `HTTP ${whResBadSig.status}`);

  // 6-7. Do not send a synthetic successful payment webhook to production.\n  // Such a request can create financial state. Positive verification belongs in a sandbox/test destination.\n  console.log('📌 Tests 6-7: Valid/duplicate payment webhook => SKIPPED (production mutation guard)');\n\n  // 8. Admin API without authorization => 401
  console.log('ðŸ“Œ Test 8: Admin API without authorization => 401');
  const adminResNoAuth = await fetch(`${PROD_URL}/api/leads/get-staged`, {
    method: 'GET'
  });
  assert(adminResNoAuth.status === 401, 'Admin endpoint without authorization returns 401', `HTTP ${adminResNoAuth.status}`);

  // 9. Admin API with mock Bearer token bypass => 401
  console.log('ðŸ“Œ Test 9: Admin API with mock Bearer token => 401 (Bypass removed)');
  const adminResMockAuth = await fetch(`${PROD_URL}/api/leads/get-staged`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer juristech_admin_legacy_mock_token' }
  });
  assert(adminResMockAuth.status === 401, 'Admin endpoint with mock token returns 401', `HTTP ${adminResMockAuth.status}`);

  // 10. Admin positive authorization is tested only when explicitly injected into this process.\n  if (process.env.ADMIN_SECRET_KEY) {\n    console.log('📌 Test 10: Admin API with valid ADMIN_SECRET_KEY => 200 OK');\n    const adminResValid = await fetch(${PROD_URL}/api/leads/get-staged, {\n      method: 'GET',\n      headers: { 'Authorization': Bearer  }\n    });\n    assert(adminResValid.status === 200, 'Admin endpoint with valid ADMIN_SECRET_KEY returns 200 OK', HTTP );\n  } else {\n    console.log('📌 Test 10: Admin API with valid ADMIN_SECRET_KEY => SKIPPED (no local secret injected)');\n  }\n\n  console.log('\\n================================================================');
  console.log(`ðŸ“Š LIVE SMOKE TEST SUMMARY: ${passed} / ${total} PASSED`);
  if (failures.length === 0) {
    console.log('ðŸŽ‰ ALL LIVE PRODUCTION SECURITY GATES VERIFIED SUCCESSFULLY!');
  } else {
    console.error(`âš ï¸ FAILURES (${failures.length}):`, failures);
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