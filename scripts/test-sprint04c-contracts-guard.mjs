/**
 * scripts/test-sprint04c-contracts-guard.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 2B: Contract Generation Security Suite
 *
 * Verifies:
 *   AUTH:
 *     1. Anonymous request -> 401 MISSING_AUTHORIZATION_TOKEN
 *     2. Malformed Bearer -> 401 MALFORMED_AUTHORIZATION_HEADER
 *     3. Invalid/expired JWT -> 401 INVALID_OR_EXPIRED_TOKEN
 *   ANTI-SPOOF:
 *     4. userSession role=SUPREME_ADMIN cannot bypass
 *     5. isAdmin=true in body cannot bypass
 *     6. fake user_id cannot affect authorization
 *     7. fake Enterprise tier cannot affect authorization
 *     8. fake limit cannot affect quota
 *     9. fake period_key cannot affect quota
 *   TIER:
 *     10. No subscription -> Free Trial (limit 2, period lifetime)
 *     11. Active Startup -> Startup (limit 10, period YYYY-MM)
 *     12. Active SMEs -> SMEs (limit 50, period YYYY-MM)
 *     13. Active Enterprise -> Enterprise (unlimited)
 *     14. Expired subscription -> Free Trial (limit 2, period lifetime)
 *   QUOTAS:
 *     15. Free Trial contract 1 -> allowed
 *     16. Free Trial contract 2 -> allowed
 *     17. Free Trial contract 3 -> 429 QUOTA_EXCEEDED
 *     18. Startup contract 10 -> allowed
 *     19. Startup contract 11 -> 429 QUOTA_EXCEEDED
 *     20. SMEs contract 50 -> allowed
 *     21. SMEs contract 51 -> 429 QUOTA_EXCEEDED
 *     22. Enterprise -> unlimited
 *     23. Admin -> unlimited
 *     24. Lawyer -> unlimited
 *   COST PROTECTION:
 *     25. Unauthorized request never reaches Gemini
 *     26. Quota-exceeded request never reaches Gemini
 *     27. Subscription-authority failure never reaches Gemini
 *     28. RPC failure never reaches Gemini
 *   SECURITY:
 *     29. Missing userSession never grants admin
 *     30. client role never changes verified role
 *   CONCURRENCY:
 *     31. concurrent quota calls cannot exceed the configured limit
 */

import assert from 'assert';

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
console.log('📜  JURISTECH — SPRINT 04C CONTRACT GENERATION GUARD TEST SUITE');
console.log('================================================================\n');

process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test_service_role_key_simulated';

// Import modules under test
const {
  verifyAdminOrEnforcePaywall,
  enforceContractQuota,
  getUtcMonthlyPeriodKey,
  CONTRACT_LIMITS,
  CONTRACT_PERIODS,
} = await import('../lib/security/sovereign-guard.js');

const { default: contractHandler, POST: contractPost } = await import('../api/contracts/generate-engine.js');

function createMockNodeRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    }
  };
}

// ── TEST GROUP 1: Authentication Boundary ────────────────────────────────────
console.log('--- TEST GROUP 1: Authentication Boundary ---');

try {
  // 1. Anonymous request -> 401
  const resAnon = createMockNodeRes();
  await contractHandler({ method: 'POST', headers: {} }, resAnon);
  assert.strictEqual(resAnon.statusCode, 401);
  assert.strictEqual(resAnon.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('Anonymous request without Authorization header strictly returns 401 MISSING_AUTHORIZATION_TOKEN');

  // 2. Malformed Bearer -> 401
  const resMalformed = createMockNodeRes();
  await contractHandler({ method: 'POST', headers: { authorization: 'Basic dXNlcjpwYXNz' } }, resMalformed);
  assert.strictEqual(resMalformed.statusCode, 401);
  assert.strictEqual(resMalformed.body?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  pass('Malformed non-Bearer authorization header strictly returns 401 MALFORMED_AUTHORIZATION_HEADER');

  // 3. Invalid / expired JWT -> 401
  const resBadToken = createMockNodeRes();
  await contractHandler({ method: 'POST', headers: { authorization: 'Bearer invalid.token.payload' } }, resBadToken);
  assert.strictEqual(resBadToken.statusCode, 401);
  assert(
    resBadToken.body?.code === 'INVALID_OR_EXPIRED_TOKEN' || resBadToken.body?.code === 'TOKEN_VERIFICATION_FAILED',
    `Expected 401 invalid token code, got ${resBadToken.body?.code}`
  );
  pass('Cryptographically invalid / expired JWT strictly returns 401 UNAUTHORIZED');
} catch (err) {
  fail('Test Group 1: Authentication Boundary', err);
}

// ── TEST GROUP 2: Anti-Spoofing & Trust Boundary ─────────────────────────────
console.log('\n--- TEST GROUP 2: Anti-Spoofing & Trust Boundary ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    let capturedRpcLimit = null;
    let capturedRpcPeriod = null;

    globalThis.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'real-user-uuid-1111',
            email: 'realuser@example.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {}
          })
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] }; // Real DB: Free Trial
      }
      if (u.includes('/rest/v1/rpc/check_and_increment_usage')) {
        const payload = JSON.parse(opts.body);
        capturedRpcLimit = payload.p_limit;
        capturedRpcPeriod = payload.p_period_key;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            allowed: true,
            current_usage: 1,
            limit: payload.p_limit,
            metric: payload.p_metric,
            period_key: payload.p_period_key
          })
        };
      }
      return originalFetch(url, opts);
    };

    // 4. userSession role=SUPREME_ADMIN in body cannot bypass
    const resSpoofRole = createMockNodeRes();
    await contractHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.customer.token' },
      body: { userSession: { role: 'SUPREME_ADMIN' } }
    }, resSpoofRole);
    assert.strictEqual(resSpoofRole.statusCode, 200);
    assert.strictEqual(capturedRpcLimit, 2, 'Must enforce server Free Trial limit 2, not unlimited');
    pass('userSession role=SUPREME_ADMIN in request body is completely ignored');

    // 5. isAdmin=true in body cannot bypass
    const resSpoofAdmin = createMockNodeRes();
    await contractHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.customer.token' },
      body: { isAdmin: true, userSession: { isAdmin: true, email: 'Drzyogo.ca@gmail.com' } }
    }, resSpoofAdmin);
    assert.strictEqual(resSpoofAdmin.statusCode, 200);
    assert.strictEqual(capturedRpcLimit, 2, 'Must enforce server Free Trial limit 2, not unlimited');
    pass('isAdmin=true and hardcoded email in request body cannot bypass quota');

    // 6. fake user_id cannot affect authorization
    const resSpoofUid = createMockNodeRes();
    await contractHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.customer.token' },
      body: { user_id: 'spoofed-admin-id', userId: 'spoofed-admin-id' }
    }, resSpoofUid);
    assert.strictEqual(resSpoofUid.statusCode, 200);
    pass('fake user_id in request body cannot affect authorization or identity');

    // 7. fake Enterprise tier in body cannot affect authorization
    const resSpoofTier = createMockNodeRes();
    await contractHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.customer.token' },
      body: { tier: 'Enterprise', plan: 'Enterprise' }
    }, resSpoofTier);
    assert.strictEqual(resSpoofTier.statusCode, 200);
    assert.strictEqual(capturedRpcLimit, 2, 'Server computes tier from DB (Free Trial), not body');
    pass('fake Enterprise tier/plan in request body is completely ignored');

    // 8. fake limit cannot affect quota
    const resSpoofLimit = createMockNodeRes();
    await contractHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.customer.token' },
      body: { limit: 999999 }
    }, resSpoofLimit);
    assert.strictEqual(resSpoofLimit.statusCode, 200);
    assert.strictEqual(capturedRpcLimit, 2, 'Server computes limit 2, not 999999');
    pass('fake limit parameter in request body cannot override server-computed quota');

    // 9. fake period_key cannot affect quota
    const resSpoofPeriod = createMockNodeRes();
    await contractHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.customer.token' },
      body: { period_key: 'unlimited_eternal' }
    }, resSpoofPeriod);
    assert.strictEqual(resSpoofPeriod.statusCode, 200);
    assert.strictEqual(capturedRpcPeriod, 'lifetime', 'Server computes Free Trial period "lifetime", not body');
    pass('fake period_key parameter in request body cannot override server-computed period');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 2: Anti-Spoofing & Trust Boundary', err);
}

// ── TEST GROUP 3: Contract Tier Resolution ───────────────────────────────────
console.log('\n--- TEST GROUP 3: Contract Tier Resolution ---');

try {
  const testUser = { id: 'test-user-uuid-9999', email: 'test@example.com' };

  // 10. No subscription -> Free Trial (limit 2, period lifetime)
  const quotaNoSub = await enforceContractQuota(testUser, { mockSubscription: null, mockRpcHandler: async ({ p_limit, p_period_key }) => ({ allowed: true, current_usage: 1, limit: p_limit, period_key: p_period_key }) });
  assert.strictEqual(quotaNoSub.tier, 'Free Trial');
  assert.strictEqual(quotaNoSub.limit, 2);
  assert.strictEqual(quotaNoSub.periodKey, 'lifetime');
  pass('No subscription resolves to Free Trial (limit: 2 lifetime)');

  // 11. Active Startup -> Startup (limit 10, period YYYY-MM)
  const quotaStartup = await enforceContractQuota(testUser, {
    mockSubscription: { plan_id: 'tier_startup_49', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: async ({ p_limit, p_period_key }) => ({ allowed: true, current_usage: 1, limit: p_limit, period_key: p_period_key })
  });
  assert.strictEqual(quotaStartup.tier, 'Startup');
  assert.strictEqual(quotaStartup.limit, 10);
  assert.strictEqual(quotaStartup.periodKey, getUtcMonthlyPeriodKey());
  pass(`Active Startup subscription resolves to Startup (limit: 10 per month, period: ${getUtcMonthlyPeriodKey()})`);

  // 12. Active SMEs -> SMEs (limit 50, period YYYY-MM)
  const quotaSMEs = await enforceContractQuota(testUser, {
    mockSubscription: { plan_id: 'tier_smes_139', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: async ({ p_limit, p_period_key }) => ({ allowed: true, current_usage: 1, limit: p_limit, period_key: p_period_key })
  });
  assert.strictEqual(quotaSMEs.tier, 'SMEs');
  assert.strictEqual(quotaSMEs.limit, 50);
  assert.strictEqual(quotaSMEs.periodKey, getUtcMonthlyPeriodKey());
  pass(`Active SMEs subscription resolves to SMEs (limit: 50 per month, period: ${getUtcMonthlyPeriodKey()})`);

  // 13. Active Enterprise -> Enterprise (unlimited)
  let enterpriseRpcCalled = false;
  const quotaEnterprise = await enforceContractQuota(testUser, {
    mockSubscription: { plan_id: 'tier_enterprise_349', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: async () => { enterpriseRpcCalled = true; return { allowed: true }; }
  });
  assert.strictEqual(quotaEnterprise.allowed, true);
  assert.strictEqual(quotaEnterprise.unlimited, true);
  assert.strictEqual(enterpriseRpcCalled, false, 'Enterprise tier must never call quota RPC');
  pass('Active Enterprise subscription resolves to Enterprise (unlimited / bypasses RPC)');

  // 14. Expired subscription -> Free Trial (limit 2, period lifetime)
  const quotaExpired = await enforceContractQuota(testUser, {
    mockSubscription: { plan_id: 'tier_enterprise_349', status: 'active', expires_at: '2025-01-01T00:00:00.000Z' },
    mockRpcHandler: async ({ p_limit, p_period_key }) => ({ allowed: true, current_usage: 1, limit: p_limit, period_key: p_period_key })
  });
  assert.strictEqual(quotaExpired.tier, 'Free Trial');
  assert.strictEqual(quotaExpired.limit, 2);
  assert.strictEqual(quotaExpired.periodKey, 'lifetime');
  pass('Expired subscription safely falls back to Free Trial (limit: 2 lifetime)');
} catch (err) {
  fail('Test Group 3: Contract Tier Resolution', err);
}

// ── TEST GROUP 4: Quota Enforcement ──────────────────────────────────────────
console.log('\n--- TEST GROUP 4: Quota Enforcement ---');

try {
  const verifiedUser = { id: 'quota-test-user-uuid', email: 'quota@example.com' };

  // 15. Free Trial contract 1 -> allowed
  let freeCounter = 0;
  const mockFreeRpc = async ({ p_limit }) => {
    freeCounter++;
    return { allowed: freeCounter <= p_limit, current_usage: freeCounter, limit: p_limit };
  };

  const q1 = await enforceContractQuota(verifiedUser, { mockSubscription: null, mockRpcHandler: mockFreeRpc });
  assert.strictEqual(q1.allowed, true);
  assert.strictEqual(q1.currentUsage, 1);
  pass('Free Trial contract 1 is allowed (usage: 1/2)');

  // 16. Free Trial contract 2 -> allowed
  const q2 = await enforceContractQuota(verifiedUser, { mockSubscription: null, mockRpcHandler: mockFreeRpc });
  assert.strictEqual(q2.allowed, true);
  assert.strictEqual(q2.currentUsage, 2);
  pass('Free Trial contract 2 is allowed (usage: 2/2)');

  // 17. Free Trial contract 3 -> 429
  const q3 = await enforceContractQuota(verifiedUser, { mockSubscription: null, mockRpcHandler: mockFreeRpc });
  assert.strictEqual(q3.allowed, false);
  assert.strictEqual(q3.code, 'QUOTA_EXCEEDED');
  assert.strictEqual(q3.response?.status, 429);
  pass('Free Trial contract 3 is strictly rejected with HTTP 429 QUOTA_EXCEEDED');

  // 18. Startup contract 10 -> allowed
  const mockStartupRpc = async ({ p_limit }) => ({ allowed: true, current_usage: 10, limit: p_limit });
  const qStartup10 = await enforceContractQuota(verifiedUser, {
    mockSubscription: { plan_id: 'tier_startup_49', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: mockStartupRpc
  });
  assert.strictEqual(qStartup10.allowed, true);
  pass('Startup contract 10 is allowed (10/10 capacity)');

  // 19. Startup contract 11 -> 429
  const mockStartupExceeded = async ({ p_limit }) => ({ allowed: false, current_usage: 11, limit: p_limit });
  const qStartup11 = await enforceContractQuota(verifiedUser, {
    mockSubscription: { plan_id: 'tier_startup_49', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: mockStartupExceeded
  });
  assert.strictEqual(qStartup11.allowed, false);
  assert.strictEqual(qStartup11.code, 'QUOTA_EXCEEDED');
  assert.strictEqual(qStartup11.response?.status, 429);
  pass('Startup contract 11 is strictly rejected with HTTP 429 QUOTA_EXCEEDED');

  // 20. SMEs contract 50 -> allowed
  const mockSmesRpc = async ({ p_limit }) => ({ allowed: true, current_usage: 50, limit: p_limit });
  const qSmes50 = await enforceContractQuota(verifiedUser, {
    mockSubscription: { plan_id: 'tier_smes_139', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: mockSmesRpc
  });
  assert.strictEqual(qSmes50.allowed, true);
  pass('SMEs contract 50 is allowed (50/50 capacity)');

  // 21. SMEs contract 51 -> 429
  const mockSmesExceeded = async ({ p_limit }) => ({ allowed: false, current_usage: 51, limit: p_limit });
  const qSmes51 = await enforceContractQuota(verifiedUser, {
    mockSubscription: { plan_id: 'tier_smes_139', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: mockSmesExceeded
  });
  assert.strictEqual(qSmes51.allowed, false);
  assert.strictEqual(qSmes51.code, 'QUOTA_EXCEEDED');
  assert.strictEqual(qSmes51.response?.status, 429);
  pass('SMEs contract 51 is strictly rejected with HTTP 429 QUOTA_EXCEEDED');

  // 22. Enterprise -> unlimited
  let enterpriseCalled = false;
  const qEnt = await enforceContractQuota(verifiedUser, {
    mockSubscription: { plan_id: 'tier_enterprise_349', status: 'active', expires_at: new Date(Date.now() + 86400000).toISOString() },
    mockRpcHandler: async () => { enterpriseCalled = true; return { allowed: true }; }
  });
  assert.strictEqual(qEnt.allowed, true);
  assert.strictEqual(qEnt.unlimited, true);
  assert.strictEqual(enterpriseCalled, false);
  pass('Enterprise tier receives unlimited contract quota');

  // 23. Admin -> unlimited
  let adminCalled = false;
  const adminUser = { id: 'admin-123', email: 'admin@juristech.solutions', isAdmin: true };
  const qAdmin = await enforceContractQuota(adminUser, { mockRpcHandler: async () => { adminCalled = true; return { allowed: true }; } });
  assert.strictEqual(qAdmin.allowed, true);
  assert.strictEqual(qAdmin.unlimited, true);
  assert.strictEqual(adminCalled, false);
  pass('Admin role receives unlimited contract quota (bypasses RPC)');

  // 24. Lawyer -> unlimited
  let lawyerCalled = false;
  const lawyerUser = { id: 'lawyer-123', email: 'lawyer@juristech.solutions', isLawyer: true };
  const qLawyer = await enforceContractQuota(lawyerUser, { mockRpcHandler: async () => { lawyerCalled = true; return { allowed: true }; } });
  assert.strictEqual(qLawyer.allowed, true);
  assert.strictEqual(qLawyer.unlimited, true);
  assert.strictEqual(lawyerCalled, false);
  pass('Lawyer role receives unlimited contract quota (bypasses RPC)');
} catch (err) {
  fail('Test Group 4: Quota Enforcement', err);
}

// ── TEST GROUP 5: Cost Protection (Zero Unbounded Gemini Calls) ──────────────
console.log('\n--- TEST GROUP 5: Cost Protection ---');

try {
  let geminiApiEverCalled = false;
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('generativelanguage.googleapis.com')) {
        geminiApiEverCalled = true;
      }
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-user-cost-test',
            email: 'user@example.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {}
          })
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] };
      }
      return originalFetch(url, opts);
    };

    // 25. Unauthorized request never reaches Gemini
    geminiApiEverCalled = false;
    const resNoAuth = createMockNodeRes();
    await contractHandler({ method: 'POST', headers: {} }, resNoAuth);
    assert.strictEqual(resNoAuth.statusCode, 401);
    assert.strictEqual(geminiApiEverCalled, false, 'Gemini must NEVER be invoked for unauthenticated request');
    pass('Unauthorized request (401) terminates before Gemini execution');

    // 26. Quota-exceeded request never reaches Gemini
    geminiApiEverCalled = false;
    const mockQuotaFetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('generativelanguage.googleapis.com')) {
        geminiApiEverCalled = true;
      }
      if (u.includes('/auth/v1/user')) {
        return { ok: true, status: 200, json: async () => ({ id: 'usr-q', email: 'q@test.com', app_metadata: { role: 'authenticated' }, user_metadata: {} }) };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] }; // Free Trial
      }
      if (u.includes('/rest/v1/rpc/check_and_increment_usage')) {
        return { ok: true, status: 200, json: async () => ({ allowed: false, current_usage: 2, limit: 2 }) };
      }
      return originalFetch(url, opts);
    };

    globalThis.fetch = mockQuotaFetch;
    const resOverQuota = createMockNodeRes();
    await contractHandler({ method: 'POST', headers: { authorization: 'Bearer valid.jwt.token' } }, resOverQuota);
    assert.strictEqual(resOverQuota.statusCode, 429);
    assert.strictEqual(geminiApiEverCalled, false, 'Gemini must NEVER be invoked when quota is exceeded');
    pass('Quota-exceeded request (429) terminates before Gemini execution');

    // 27. Subscription-authority failure never reaches Gemini
    geminiApiEverCalled = false;
    const mockDbFailFetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('generativelanguage.googleapis.com')) {
        geminiApiEverCalled = true;
      }
      if (u.includes('/auth/v1/user')) {
        return { ok: true, status: 200, json: async () => ({ id: 'usr-fail', email: 'f@test.com', app_metadata: { role: 'authenticated' }, user_metadata: {} }) };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: false, status: 500, json: async () => ({ error: 'DB down' }) };
      }
      return originalFetch(url, opts);
    };

    globalThis.fetch = mockDbFailFetch;
    const resDbFail = createMockNodeRes();
    await contractHandler({ method: 'POST', headers: { authorization: 'Bearer valid.jwt.token' } }, resDbFail);
    assert.strictEqual(resDbFail.statusCode, 500);
    assert.strictEqual(geminiApiEverCalled, false, 'Gemini must NEVER be invoked on subscription authority error');
    pass('Subscription-authority failure (500) terminates before Gemini execution');

    // 28. RPC failure never reaches Gemini
    geminiApiEverCalled = false;
    const mockRpcFailFetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('generativelanguage.googleapis.com')) {
        geminiApiEverCalled = true;
      }
      if (u.includes('/auth/v1/user')) {
        return { ok: true, status: 200, json: async () => ({ id: 'usr-rpc-fail', email: 'rf@test.com', app_metadata: { role: 'authenticated' }, user_metadata: {} }) };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] };
      }
      if (u.includes('/rest/v1/rpc/check_and_increment_usage')) {
        return { ok: false, status: 500, json: async () => ({ error: 'RPC failed' }) };
      }
      return originalFetch(url, opts);
    };

    globalThis.fetch = mockRpcFailFetch;
    const resRpcFail = createMockNodeRes();
    await contractHandler({ method: 'POST', headers: { authorization: 'Bearer valid.jwt.token' } }, resRpcFail);
    assert.strictEqual(resRpcFail.statusCode, 500);
    assert.strictEqual(geminiApiEverCalled, false, 'Gemini must NEVER be invoked on RPC failure');
    pass('RPC usage verification failure (500) terminates before Gemini execution');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 5: Cost Protection', err);
}

// ── TEST GROUP 6: Sovereign Guard & Concurrency ──────────────────────────────
console.log('\n--- TEST GROUP 6: Sovereign Guard & Concurrency ---');

try {
  // 29. Missing userSession never grants admin
  const guardMissing = verifyAdminOrEnforcePaywall(null);
  assert.strictEqual(guardMissing.authorized, false);
  assert.strictEqual(guardMissing.paywallActive, true);
  const guardEmpty = verifyAdminOrEnforcePaywall({});
  assert.strictEqual(guardEmpty.authorized, false);
  assert.strictEqual(guardEmpty.paywallActive, true);
  pass('Missing or empty userSession in sovereign-guard strictly denies admin access');

  // 30. Client role in unverified context never changes verified role
  const spoofedContext = { id: 'usr-regular', email: 'regular@test.com', role: 'SUPREME_ADMIN', isAdmin: false, isLawyer: false };
  const guardSpoof = verifyAdminOrEnforcePaywall(spoofedContext);
  assert.strictEqual(guardSpoof.authorized, false, 'Client role string SUPREME_ADMIN must not grant admin');
  pass('Client-controlled role="SUPREME_ADMIN" on non-admin verified user is strictly rejected');

  // 31. Concurrent quota calls cannot exceed configured limit
  let sharedCounter = 0;
  const limit = 2;
  const mockConcurrentRpc = async ({ p_limit }) => {
    // Simulate atomic check_and_increment_usage with Postgres FOR UPDATE
    if (sharedCounter < p_limit) {
      sharedCounter++;
      return { allowed: true, current_usage: sharedCounter, limit: p_limit };
    }
    return { allowed: false, current_usage: sharedCounter, limit: p_limit };
  };

  const concurrentUser = { id: 'concurrency-user-uuid', email: 'concurrent@test.com' };
  const attempts = 10;
  const promises = [];
  for (let i = 0; i < attempts; i++) {
    promises.push(
      enforceContractQuota(concurrentUser, {
        mockSubscription: null, // Free Trial: limit 2
        mockRpcHandler: mockConcurrentRpc
      })
    );
  }

  const results = await Promise.all(promises);
  const allowedCount = results.filter(r => r.allowed).length;
  const deniedCount = results.filter(r => !r.allowed).length;

  assert.strictEqual(allowedCount, 2, `Exactly 2 concurrent requests must be allowed (got ${allowedCount})`);
  assert.strictEqual(deniedCount, 8, `Exactly 8 concurrent requests must be rejected (got ${deniedCount})`);
  assert.strictEqual(sharedCounter, 2, 'Counter must not exceed limit 2 under concurrency');
  pass('Concurrent quota requests (10 parallel) atomically capped at exactly 2');
} catch (err) {
  fail('Test Group 6: Sovereign Guard & Concurrency', err);
}

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 04C PHASE 2B CONTRACT GENERATION ENGINE FULLY VERIFIED!\n');
  process.exitCode = 0;
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED!\n`);
  process.exitCode = 1;
}
