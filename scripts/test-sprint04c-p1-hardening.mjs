/**
 * scripts/test-sprint04c-p1-hardening.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 4: P1 Hardening Security Test Suite
 *
 * SCOPE:
 *   1. api/youtube-upload.js: Privileged OAuth token exchange protection
 *   2. api/leads/staging-pipeline.js: Proposal staging queue protection
 * ─────────────────────────────────────────────────────────────────────────────
 */

import assert from 'assert';

const TEST_ADMIN_SECRET = 'jt_test_admin_secret_998877';
const TEST_SERVICE_ROLE = 'jt_test_service_role_secret_112233';

process.env.ADMIN_SECRET_KEY = TEST_ADMIN_SECRET;
process.env.SUPABASE_SERVICE_ROLE_KEY = TEST_SERVICE_ROLE;
process.env.YOUTUBE_CLIENT_ID = 'test-youtube-client-id-xyz';
process.env.YOUTUBE_CLIENT_SECRET = 'test-youtube-super-secret-key-abc';
process.env.VITE_SUPABASE_URL = 'https://test-project.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key-123';

let totalTests = 0;
let passedTests = 0;
const failedTests = [];

function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } catch (err) {
    failedTests.push({ description, error: err.message });
    console.error(`  ❌ [FAIL] ${description}: ${err.message}`);
  }
}

async function asyncTest(description, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } catch (err) {
    failedTests.push({ description, error: err.message });
    console.error(`  ❌ [FAIL] ${description}: ${err.message}`);
  }
}

console.log('\n================================================================');
console.log('🛡️  JURISTECH SOLUTIONS — SPRINT 04C PHASE 4: P1 HARDENING SUITE');
console.log('================================================================\n');

// ── PART 1: api/youtube-upload.js ─────────────────────────────────────────────
console.log('─── PART 1: api/youtube-upload.js OAuth Token Exchange Protection ───');

const { default: youtubeHandler, POST: youtubePost } = await import('../api/youtube-upload.js');

// Mock helper to track google token exchange calls
let googleOAuthFetchCalls = [];
const originalFetch = globalThis.fetch;

function setupMockFetch(options = {}) {
  googleOAuthFetchCalls = [];
  globalThis.fetch = async (url, init) => {
    const urlStr = String(url);

    // Google OAuth token endpoint
    if (urlStr.includes('oauth2.googleapis.com/token')) {
      googleOAuthFetchCalls.push({ url: urlStr, init });
      if (options.googleError) {
        return new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'Bad code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({
        access_token: 'ya29.mock_access_token_success',
        refresh_token: '1//mock_refresh_token_success',
        expires_in: 3600,
        token_type: 'Bearer',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Supabase /auth/v1/user endpoint
    if (urlStr.includes('/auth/v1/user')) {
      const authHeader = init?.headers?.Authorization || '';
      if (authHeader.includes('valid_admin_jwt')) {
        return new Response(JSON.stringify({
          id: 'admin_user_uuid_1',
          email: 'admin@juristech.solutions',
          app_metadata: { role: 'admin' },
          user_metadata: { role: 'admin' },
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (authHeader.includes('official_admin_email_jwt')) {
        return new Response(JSON.stringify({
          id: 'drzyogo_uuid_2',
          email: 'drzyogo.ca@gmail.com',
          app_metadata: {},
          user_metadata: {},
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (authHeader.includes('regular_user_jwt')) {
        return new Response(JSON.stringify({
          id: 'user_uuid_3',
          email: 'user@external.com',
          app_metadata: { role: 'authenticated' },
          user_metadata: {},
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return originalFetch(url, init);
  };
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// 1. Public non-privileged actions remain accessible without secrets
await asyncTest('1.1 Non-privileged GET returns auth URL without requiring admin auth', async () => {
  const req = new Request('http://localhost/api/youtube-upload?action=get_auth_url', { method: 'GET' });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'OAUTH_CONFIGURED');
  assert.ok(data.authUrl.includes('accounts.google.com/o/oauth2/auth'));
  assert.ok(!JSON.stringify(data).includes(process.env.YOUTUBE_CLIENT_SECRET), 'Zero secret leakage in get_auth_url');
});

// 2. Anonymous exchange_code -> 401
await asyncTest('1.2 Anonymous exchange_code strictly rejected with 401', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'exchange_code', code: '4/test_code_123' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.ok(data.error.includes('Unauthorized'));
  assert.strictEqual(googleOAuthFetchCalls.length, 0, 'ZERO calls to Google OAuth on anonymous request');
  restoreFetch();
});

// 3. Malformed auth header -> 401
await asyncTest('1.3 Malformed auth header strictly rejected with 401', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic invalid_scheme_123',
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/test_code_123' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 401);
  assert.strictEqual(googleOAuthFetchCalls.length, 0, 'ZERO calls to Google OAuth on malformed auth');
  restoreFetch();
});

// 4. Invalid/forged server secret -> 401
await asyncTest('1.4 Forged or invalid server secret rejected with 401', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer wrong_secret_attacker_token',
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/test_code_123' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 401);
  assert.strictEqual(googleOAuthFetchCalls.length, 0, 'ZERO calls to Google OAuth on forged secret');
  restoreFetch();
});

// 5. Forged admin/body fields completely ignored -> 401
await asyncTest('1.5 Forged admin/role/email claims in request body completely ignored (401)', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'exchange_code',
      code: '4/test_code_123',
      isAdmin: true,
      role: 'admin',
      email: 'drzyogo.ca@gmail.com',
      userId: 'admin_spoofed',
    }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 401);
  assert.strictEqual(googleOAuthFetchCalls.length, 0, 'ZERO calls to Google OAuth on body claim spoofing');
  restoreFetch();
});

// 6. Non-admin Supabase JWT -> 401
await asyncTest('1.6 Non-admin authenticated user JWT strictly rejected with 401', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer regular_user_jwt',
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/test_code_123' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 401);
  assert.strictEqual(googleOAuthFetchCalls.length, 0, 'ZERO calls to Google OAuth for non-admin user');
  restoreFetch();
});

// 7. Rejection responses contain NO credential or secret leakage
await asyncTest('1.7 Rejection responses contain ZERO token or credential leakage', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'exchange_code', code: '4/test_code_123' }),
  });
  const res = await youtubePost(req);
  const rawText = await res.text();
  assert.ok(!rawText.includes(process.env.YOUTUBE_CLIENT_SECRET), 'No client_secret in error response');
  assert.ok(!rawText.includes(process.env.ADMIN_SECRET_KEY), 'No ADMIN_SECRET_KEY in error response');
  assert.ok(!rawText.includes('accessToken') && !rawText.includes('access_token'), 'No access token in error response');
  assert.ok(!rawText.includes('refreshToken') && !rawText.includes('refresh_token'), 'No refresh token in error response');
  restoreFetch();
});

// 8. Authorized admin via Bearer ADMIN_SECRET_KEY succeeds
await asyncTest('1.8 Authorized admin via Authorization Bearer ADMIN_SECRET_KEY executes token exchange', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_ADMIN_SECRET}`,
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/valid_auth_code_789' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.status, 'TOKENS_OBTAINED');
  assert.strictEqual(data.accessToken, 'ya29.mock_access_token_success');
  assert.strictEqual(data.refreshToken, '1//mock_refresh_token_success');
  assert.strictEqual(googleOAuthFetchCalls.length, 1, 'Exactly 1 Google OAuth call executed');
  assert.ok(googleOAuthFetchCalls[0].init.body.toString().includes('code=4%2Fvalid_auth_code_789'), 'Code passed to Google');
  restoreFetch();
});

// 9. Authorized admin via x-admin-token header succeeds
await asyncTest('1.9 Authorized admin via x-admin-token header executes token exchange', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': TEST_ADMIN_SECRET,
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/valid_auth_code_x_admin' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'TOKENS_OBTAINED');
  assert.strictEqual(googleOAuthFetchCalls.length, 1);
  restoreFetch();
});

// 10. Authorized admin via verified Supabase Admin JWT succeeds
await asyncTest('1.10 Authorized admin via verified Supabase Admin JWT executes token exchange', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_admin_jwt',
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/valid_code_supabase_admin' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'TOKENS_OBTAINED');
  assert.strictEqual(googleOAuthFetchCalls.length, 1);
  restoreFetch();
});

// 11. Missing authorization code with valid admin returns 400
await asyncTest('1.11 Missing OAuth code with valid admin returns 400 Missing code', async () => {
  setupMockFetch();
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_ADMIN_SECRET}`,
    },
    body: JSON.stringify({ action: 'exchange_code' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.ok(data.error.includes('Missing OAuth authorization code'));
  assert.strictEqual(googleOAuthFetchCalls.length, 0);
  restoreFetch();
});

// 12. Upstream Google error safely handled without leaking client secret
await asyncTest('1.12 Upstream Google error handled cleanly without leaking GOOGLE_CLIENT_SECRET', async () => {
  setupMockFetch({ googleError: true });
  const req = new Request('http://localhost/api/youtube-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_ADMIN_SECRET}`,
    },
    body: JSON.stringify({ action: 'exchange_code', code: '4/bad_grant_code' }),
  });
  const res = await youtubePost(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.error, 'Bad code');
  assert.ok(!JSON.stringify(data).includes(process.env.YOUTUBE_CLIENT_SECRET));
  restoreFetch();
});

// ── PART 2: api/leads/staging-pipeline.js ─────────────────────────────────────
console.log('\n─── PART 2: api/leads/staging-pipeline.js Staging Protection ───');

const {
  POST: stagingPost,
  getStagingQueue,
} = await import('../api/leads/staging-pipeline.js');

// 13. Anonymous POST -> 401 and DOES NOT mutate queue
await asyncTest('2.1 Anonymous POST strictly rejected with 401', async () => {
  const queueBefore = (await getStagingQueue()).length;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      leadCompanyId: 'attacker_lead_1',
      companyName: 'Attacker Co',
      proposalContent: 'Malicious spam proposal',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.ok(data.error.includes('Unauthorized'));
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore, 'STAGED_PROPOSALS was NOT mutated by unauthorized call');
});

// 14. Malformed auth -> 401
await asyncTest('2.2 Malformed auth header rejected with 401 without queue mutation', async () => {
  const queueBefore = (await getStagingQueue()).length;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token invalid_scheme',
    },
    body: JSON.stringify({
      leadCompanyId: 'attacker_lead_2',
      companyName: 'Attacker Co 2',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 401);
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore, 'STAGED_PROPOSALS was NOT mutated');
});

// 15. Invalid / forged secret -> 401
await asyncTest('2.3 Forged admin secret rejected with 401 without queue mutation', async () => {
  const queueBefore = (await getStagingQueue()).length;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer fake_admin_secret_xyz',
    },
    body: JSON.stringify({
      leadCompanyId: 'attacker_lead_3',
      companyName: 'Attacker Co 3',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 401);
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore, 'STAGED_PROPOSALS was NOT mutated');
});

// 16. Forged admin body fields -> 401
await asyncTest('2.4 Forged admin/role/email in JSON body strictly ignored (401)', async () => {
  const queueBefore = (await getStagingQueue()).length;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isAdmin: true,
      role: 'admin',
      email: 'drzyogo.ca@gmail.com',
      leadCompanyId: 'attacker_lead_4',
      companyName: 'Attacker Co 4',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 401);
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore, 'STAGED_PROPOSALS was NOT mutated');
});

// 17. Non-admin Supabase JWT -> 401
await asyncTest('2.5 Non-admin Supabase user JWT strictly rejected with 401', async () => {
  setupMockFetch();
  const queueBefore = (await getStagingQueue()).length;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer regular_user_jwt',
    },
    body: JSON.stringify({
      leadCompanyId: 'attacker_lead_5',
      companyName: 'Attacker Co 5',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 401);
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore, 'STAGED_PROPOSALS was NOT mutated');
  restoreFetch();
});

// 18. Valid admin via Bearer ADMIN_SECRET_KEY succeeds and stages proposal
await asyncTest('2.6 Valid admin via Bearer ADMIN_SECRET_KEY successfully stages proposal (200 OK)', async () => {
  const queueBefore = (await getStagingQueue()).length;
  const uniqueLeadId = `comp_valid_admin_${Date.now()}`;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_ADMIN_SECRET}`,
    },
    body: JSON.stringify({
      leadCompanyId: uniqueLeadId,
      companyName: 'شركة الرياض للاستشارات القانونية',
      proposalContent: 'عرض الشراكة السيادية والحلول المتقدمة.',
      targetEmail: 'contact@riyadh-legal.sa',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.stagedId.startsWith('lead-staged-'));
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore + 1, 'Proposal successfully added to STAGED_PROPOSALS queue');
});

// 19. Valid admin via x-admin-token succeeds
await asyncTest('2.7 Valid admin via x-admin-token header successfully stages proposal', async () => {
  const queueBefore = (await getStagingQueue()).length;
  const uniqueLeadId = `comp_admin_token_${Date.now()}`;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': TEST_ADMIN_SECRET,
    },
    body: JSON.stringify({
      leadCompanyId: uniqueLeadId,
      companyName: 'مؤسسة دبي للوساطة التجارية',
      proposalContent: 'عرض الحماية التعاقدية الشاملة.',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore + 1);
});

// 20. Valid admin via verified Supabase Admin JWT succeeds
await asyncTest('2.8 Valid admin via verified Supabase Admin JWT successfully stages proposal', async () => {
  setupMockFetch();
  const queueBefore = (await getStagingQueue()).length;
  const uniqueLeadId = `comp_supabase_jwt_${Date.now()}`;
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_admin_jwt',
    },
    body: JSON.stringify({
      leadCompanyId: uniqueLeadId,
      companyName: 'مجموعة المنامة للتحكيم الدولي',
      proposalContent: 'عرض إدارة عقود التحكيم الذكية.',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  const queueAfter = (await getStagingQueue()).length;
  assert.strictEqual(queueAfter, queueBefore + 1);
  restoreFetch();
});

// 21. Duplicate lead detection still functions for authenticated admin
await asyncTest('2.9 Duplicate lead prevention functions correctly for authenticated admin', async () => {
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_ADMIN_SECRET}`,
    },
    body: JSON.stringify({
      leadCompanyId: 'lead_demo_01', // Already in PROCESSED_LEAD_IDS
      companyName: 'شركة سابقة مكررة',
    }),
  });
  const res = await stagingPost(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'skipped');
  assert.ok(data.message.includes('تم إرسال عرض مسبق'));
});

// 22. Zero secret or token leakage in rejection response
await asyncTest('2.10 Zero secret or token leakage in unauthorized staging response', async () => {
  const req = new Request('http://localhost/api/leads/staging-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const res = await stagingPost(req);
  const rawText = await res.text();
  assert.ok(!rawText.includes(process.env.ADMIN_SECRET_KEY));
  assert.ok(!rawText.includes(process.env.SUPABASE_SERVICE_ROLE_KEY));
});

// ── FINAL SUMMARY ─────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🎯 TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests.length}`);
console.log('================================================================');

if (failedTests.length > 0) {
  console.error('\n❌ FAILED CHECKS:');
  failedTests.forEach(f => console.error(`  - ${f.description}: ${f.error}`));
  process.exit(1);
} else {
  console.log('🌟 SPRINT 04C PHASE 4 P1 HARDENING SECURITY SUITE: ALL PASS\n');
  process.exit(0);
}
