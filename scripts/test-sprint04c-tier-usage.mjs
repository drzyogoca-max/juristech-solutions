/**
 * scripts/test-sprint04c-tier-usage.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 1C: Tier & Usage Enforcement Test Suite
 *
 * Verifies:
 *   A. Authentication regression (401 on missing/invalid auth)
 *   B. Server-side Tier Resolution (Free Trial, Startup, SMEs, Enterprise, Expired, Spoof-immune)
 *   C. Atomic Usage Enforcement (Free Trial: 5, Startup: 50, SMEs: 150, Enterprise: unlimited, Admin: unlimited)
 *   D. Daily UTC Period Handling (YYYY-MM-DD format & distinct rollover)
 *   E. RPC Security Boundary (Anon / Browser client cannot invoke check_and_increment_usage)
 *   F. Cost Protection (Denied quota / Auth failure NEVER calls Gemini or synthesis fallback)
 *   G. Client Spoofing Immunity (req.body parameters completely ignored)
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
console.log('💎  JURISTECH SOLUTIONS — SPRINT 04C TIER & USAGE TEST SUITE');
console.log('================================================================\n');

process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test_service_role_key_simulated';

// Import modules
const {
  resolveUserSubscription,
  enforceUsageQuota,
  getUtcDailyPeriodKey,
  mapPlanNameToTier,
  isSubscriptionRecordActive,
  DAILY_AI_LIMITS,
  TIER_WEIGHTS
} = await import('../lib/security/subscriptionResolver.js');

const { default: chatHandler, POST: chatPost } = await import('../api/chat.js');
const { default: aiHandler, POST: aiPost } = await import('../api/ai.js');

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

// ── TEST GROUP A: Authentication Regression ──────────────────────────────────
console.log('--- TEST GROUP A: Authentication Regression ---');

try {
  // 1. Missing auth on /api/chat -> 401
  const resNoAuthChat = createMockNodeRes();
  await chatHandler({ method: 'POST', headers: {} }, resNoAuthChat);
  assert.strictEqual(resNoAuthChat.statusCode, 401);
  assert.strictEqual(resNoAuthChat.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/chat missing Authorization header returns 401 MISSING_AUTHORIZATION_TOKEN');

  // 2. Missing auth on /api/ai -> 401
  const resNoAuthAI = createMockNodeRes();
  await aiHandler({ method: 'POST', headers: {} }, resNoAuthAI);
  assert.strictEqual(resNoAuthAI.statusCode, 401);
  assert.strictEqual(resNoAuthAI.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/ai missing Authorization header returns 401 MISSING_AUTHORIZATION_TOKEN');

  // 3. Invalid token on /api/chat -> 401
  const resInvalidChat = createMockNodeRes();
  await chatHandler({ method: 'POST', headers: { authorization: 'Bearer bad.token.here' } }, resInvalidChat);
  assert.strictEqual(resInvalidChat.statusCode, 401);
  assert.strictEqual(resInvalidChat.body?.code, 'INVALID_OR_EXPIRED_TOKEN');
  pass('/api/chat invalid Bearer token returns 401 INVALID_OR_EXPIRED_TOKEN');
} catch (err) {
  fail('Test Group A: Authentication Regression', err);
}

// ── TEST GROUP B: Server-Side Tier Resolution ────────────────────────────────
console.log('\n--- TEST GROUP B: Server-Side Tier Resolution ---');

try {
  const verifiedUser = { id: '01234567-89ab-cdef-0123-456789abcdef', email: 'user@example.com' };

  // 4. No subscription -> Free Trial (weight 0, limit 5)
  const resNoSub = await resolveUserSubscription(verifiedUser, { mockSubscription: null });
  assert.strictEqual(resNoSub.tier, 'Free Trial');
  assert.strictEqual(resNoSub.tierWeight, 0);
  assert.strictEqual(resNoSub.dailyLimit, 5);
  assert.strictEqual(resNoSub.isSubscriber, false);
  pass('User with no subscription resolves to Free Trial (limit: 5/day)');

  // 5. Active Startup subscription -> Startup (weight 1, limit 50)
  const resStartup = await resolveUserSubscription(verifiedUser, {
    mockSubscription: {
      plan_id: 'tier_startup_49',
      plan_name: 'Startup Tier',
      status: 'active',
      expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
    }
  });
  assert.strictEqual(resStartup.tier, 'Startup');
  assert.strictEqual(resStartup.tierWeight, 1);
  assert.strictEqual(resStartup.dailyLimit, 50);
  assert.strictEqual(resStartup.isSubscriber, true);
  pass('Active Startup subscription resolves to Startup (limit: 50/day)');

  // 6. Active SMEs subscription -> SMEs (weight 2, limit 150)
  const resSMEs = await resolveUserSubscription(verifiedUser, {
    mockSubscription: {
      plan_id: 'tier_smes_139',
      plan_name: 'SMEs Pro Tier',
      status: 'active',
      expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
    }
  });
  assert.strictEqual(resSMEs.tier, 'SMEs');
  assert.strictEqual(resSMEs.tierWeight, 2);
  assert.strictEqual(resSMEs.dailyLimit, 150);
  assert.strictEqual(resSMEs.isSubscriber, true);
  pass('Active SMEs subscription resolves to SMEs (limit: 150/day)');

  // 7. Active Enterprise subscription -> Enterprise (weight 3, unlimited)
  const resEnterprise = await resolveUserSubscription(verifiedUser, {
    mockSubscription: {
      plan_id: 'tier_enterprise_349',
      plan_name: 'Enterprise Sovereign Tier',
      status: 'active',
      expires_at: new Date(Date.now() + 86400000 * 365).toISOString()
    }
  });
  assert.strictEqual(resEnterprise.tier, 'Enterprise');
  assert.strictEqual(resEnterprise.tierWeight, 3);
  assert.strictEqual(resEnterprise.dailyLimit, null);
  assert.strictEqual(resEnterprise.isSubscriber, true);
  pass('Active Enterprise subscription resolves to Enterprise (unlimited / null limit)');

  // 8. Expired subscription -> Free Trial (limit 5)
  const resExpired = await resolveUserSubscription(verifiedUser, {
    mockSubscription: {
      plan_id: 'tier_enterprise_349',
      plan_name: 'Enterprise Tier',
      status: 'active',
      expires_at: '2025-01-01T00:00:00.000Z' // Past expiry
    }
  });
  assert.strictEqual(resExpired.tier, 'Free Trial');
  assert.strictEqual(resExpired.dailyLimit, 5);
  assert.strictEqual(resExpired.isSubscriber, false);
  pass('Expired subscription safely falls back to Free Trial (limit: 5/day)');
} catch (err) {
  fail('Test Group B: Server-Side Tier Resolution', err);
}

// ── TEST GROUP C: Atomic Usage Enforcement ───────────────────────────────────
console.log('\n--- TEST GROUP C: Atomic Usage Enforcement ---');

try {
  const verifiedUser = { id: '01234567-89ab-cdef-0123-456789abcdef', email: 'user@example.com' };

  // 9. Free Trial query 1..5 allowed
  let freeCounter = 0;
  const mockFreeRpc = async ({ p_limit }) => {
    freeCounter++;
    return {
      allowed: freeCounter <= p_limit,
      current_usage: freeCounter,
      limit: p_limit
    };
  };

  for (let i = 1; i <= 5; i++) {
    const quotaRes = await enforceUsageQuota(verifiedUser, {
      mockSubscription: null, // Free Trial
      mockRpcHandler: mockFreeRpc
    });
    assert.strictEqual(quotaRes.allowed, true, `Query ${i} should be allowed`);
    assert.strictEqual(quotaRes.currentUsage, i);
  }
  pass('Free Trial queries 1..5 are successfully allowed');

  // 10. Free Trial query 6 -> 429 Quota Exceeded
  const quotaExceededRes = await enforceUsageQuota(verifiedUser, {
    mockSubscription: null, // Free Trial
    mockRpcHandler: mockFreeRpc
  });
  assert.strictEqual(quotaExceededRes.allowed, false);
  assert.strictEqual(quotaExceededRes.code, 'QUOTA_EXCEEDED');
  assert.strictEqual(quotaExceededRes.response?.status, 429);
  pass('Free Trial query 6 is rejected with HTTP 429 QUOTA_EXCEEDED');

  // 11. Startup query > 50 -> 429
  const startupSub = {
    plan_id: 'tier_startup_49',
    plan_name: 'Startup',
    status: 'active',
    expires_at: new Date(Date.now() + 86400000).toISOString()
  };
  const mockStartupOverLimit = async () => ({ allowed: false, current_usage: 51, limit: 50 });
  const quotaStartupExceeded = await enforceUsageQuota(verifiedUser, {
    mockSubscription: startupSub,
    mockRpcHandler: mockStartupOverLimit
  });
  assert.strictEqual(quotaStartupExceeded.allowed, false);
  assert.strictEqual(quotaStartupExceeded.code, 'QUOTA_EXCEEDED');
  assert.strictEqual(quotaStartupExceeded.response?.status, 429);
  pass('Startup user exceeding 50 queries/day is rejected with HTTP 429');

  // 12. SMEs query > 150 -> 429
  const smesSub = {
    plan_id: 'tier_smes_139',
    plan_name: 'SMEs',
    status: 'active',
    expires_at: new Date(Date.now() + 86400000).toISOString()
  };
  const mockSmesOverLimit = async () => ({ allowed: false, current_usage: 151, limit: 150 });
  const quotaSmesExceeded = await enforceUsageQuota(verifiedUser, {
    mockSubscription: smesSub,
    mockRpcHandler: mockSmesOverLimit
  });
  assert.strictEqual(quotaSmesExceeded.allowed, false);
  assert.strictEqual(quotaSmesExceeded.code, 'QUOTA_EXCEEDED');
  assert.strictEqual(quotaSmesExceeded.response?.status, 429);
  pass('SMEs user exceeding 150 queries/day is rejected with HTTP 429');

  // 13. Enterprise -> unlimited (never calls limiter)
  const enterpriseSub = {
    plan_id: 'tier_enterprise_349',
    plan_name: 'Enterprise',
    status: 'active',
    expires_at: new Date(Date.now() + 86400000).toISOString()
  };
  let enterpriseRpcCalled = false;
  const mockEnterpriseRpc = async () => {
    enterpriseRpcCalled = true;
    return { allowed: true, current_usage: 9999 };
  };
  const quotaEnterprise = await enforceUsageQuota(verifiedUser, {
    mockSubscription: enterpriseSub,
    mockRpcHandler: mockEnterpriseRpc
  });
  assert.strictEqual(quotaEnterprise.allowed, true);
  assert.strictEqual(quotaEnterprise.unlimited, true);
  assert.strictEqual(enterpriseRpcCalled, false, 'Enterprise tier should bypass RPC limiter completely');
  pass('Enterprise tier receives unlimited quota (bypasses rate limit checks)');

  // 14. Admin / Lawyer -> unlimited (never calls limiter)
  const adminUser = { id: 'admin-id-123', email: 'admin@juristech.solutions', isAdmin: true };
  let adminRpcCalled = false;
  const mockAdminRpc = async () => {
    adminRpcCalled = true;
    return { allowed: true };
  };
  const quotaAdmin = await enforceUsageQuota(adminUser, { mockRpcHandler: mockAdminRpc });
  assert.strictEqual(quotaAdmin.allowed, true);
  assert.strictEqual(quotaAdmin.unlimited, true);
  assert.strictEqual(adminRpcCalled, false, 'Admin user should bypass RPC limiter completely');
  pass('Admin / Lawyer role receives unlimited quota (bypasses rate limit checks)');
} catch (err) {
  fail('Test Group C: Atomic Usage Enforcement', err);
}

// ── TEST GROUP D: Period Handling ────────────────────────────────────────────
console.log('\n--- TEST GROUP D: Period Handling ---');

try {
  // 15. getUtcDailyPeriodKey produces YYYY-MM-DD in UTC
  const testDate1 = new Date(Date.UTC(2026, 8, 7, 12, 0, 0)); // 2026-09-07
  const periodKey1 = getUtcDailyPeriodKey(testDate1);
  assert.strictEqual(periodKey1, '2026-09-07');
  pass('Daily period key accurately formatted as YYYY-MM-DD in UTC (2026-09-07)');

  // 16. Next day produces a distinct period key (counter rollover)
  const testDate2 = new Date(Date.UTC(2026, 8, 8, 0, 0, 1)); // 2026-09-08
  const periodKey2 = getUtcDailyPeriodKey(testDate2);
  assert.strictEqual(periodKey2, '2026-09-08');
  assert.notStrictEqual(periodKey1, periodKey2);
  pass('Next UTC day rollover generates a new daily counter partition');

  // 17. Monthly plan does NOT use monthly period key for daily quota
  const subMonthly = { plan_id: 'tier_smes_monthly', plan_name: 'SMEs Monthly', status: 'active' };
  const resolvedMonthly = await resolveUserSubscription(
    { id: 'usr-123' },
    { mockSubscription: subMonthly, customPeriodKey: getUtcDailyPeriodKey(testDate1) }
  );
  assert.strictEqual(resolvedMonthly.periodKey, '2026-09-07');
  assert(!resolvedMonthly.periodKey.match(/^\d{4}-\d{2}$/), 'Period key must be daily YYYY-MM-DD, not monthly YYYY-MM');
  pass('Monthly plans use daily period key (YYYY-MM-DD) for AI query metering, preventing monthly locking');
} catch (err) {
  fail('Test Group D: Period Handling', err);
}

// ── TEST GROUP E: RPC Security Boundary ──────────────────────────────────────
console.log('\n--- TEST GROUP E: RPC Security Boundary ---');

try {
  const SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO';

  // 18. Anonymous execution of check_and_increment_usage is blocked by Supabase
  const rpcAnonRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_and_increment_usage`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_metric: 'ai_queries_executed',
      p_limit: 5,
      p_period_key: '2026-09-07'
    })
  });

  const anonBody = await rpcAnonRes.text();
  assert(
    rpcAnonRes.status === 401 || rpcAnonRes.status === 403 || anonBody.includes('permission denied') || anonBody.includes('42501'),
    `Direct client RPC execution must be blocked (got HTTP ${rpcAnonRes.status})`
  );
  pass('Direct anonymous/client RPC execution of check_and_increment_usage is strictly rejected by Postgres permissions');
} catch (err) {
  fail('Test Group E: RPC Security Boundary', err);
}

// ── TEST GROUP F: Cost Protection ────────────────────────────────────────────
console.log('\n--- TEST GROUP F: Cost Protection ---');

try {
  let geminiApiEverCalled = false;
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = async (url, opts) => {
      const urlStr = String(url);
      if (urlStr.includes('generativelanguage.googleapis.com')) {
        geminiApiEverCalled = true;
      }
      if (urlStr.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: '01234567-89ab-cdef-0123-456789abcdef',
            email: 'customer@juristech.solutions',
            app_metadata: { role: 'authenticated' },
            user_metadata: {}
          })
        };
      }
      if (urlStr.includes('/rest/v1/subscriptions')) {
        return {
          ok: true,
          status: 200,
          json: async () => [] // Free Trial
        };
      }
      if (urlStr.includes('/rest/v1/rpc/check_and_increment_usage')) {
        // Mock quota exceeded (5/5)
        return {
          ok: true,
          status: 200,
          json: async () => ({
            allowed: false,
            current_usage: 5,
            limit: 5,
            metric: 'ai_queries_executed',
            period_key: '2026-09-07'
          })
        };
      }
      return originalFetch(url, opts);
    };

    // 19. /api/chat with quota exceeded returns 429 and NEVER calls Gemini
    geminiApiEverCalled = false;
    const reqChat = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.customer.token'
      },
      body: { prompt: 'Expensive legal analysis prompt' }
    };
    const resChat = createMockNodeRes();
    await chatHandler(reqChat, resChat);

    assert.strictEqual(resChat.statusCode, 429);
    assert.strictEqual(resChat.body?.code, 'QUOTA_EXCEEDED');
    assert.strictEqual(geminiApiEverCalled, false, 'Gemini must NEVER be called when quota is exceeded');
    assert(!resChat.body?.reply, 'Must NOT return fallback synthesis text when quota exceeded');
    pass('/api/chat: Quota exceeded returns 429 and terminates immediately without calling Gemini or fallback synthesis');

    // 20. /api/ai with quota exceeded returns 429 and NEVER calls Gemini
    geminiApiEverCalled = false;
    const reqAI = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.customer.token'
      },
      body: { prompt: 'Expensive legal analysis prompt' }
    };
    const resAI = createMockNodeRes();
    await aiHandler(reqAI, resAI);

    assert.strictEqual(resAI.statusCode, 429);
    assert.strictEqual(resAI.body?.code, 'QUOTA_EXCEEDED');
    assert.strictEqual(geminiApiEverCalled, false, 'Gemini must NEVER be called when quota is exceeded');
    assert(!resAI.body?.reply, 'Must NOT return fallback synthesis text when quota exceeded');
    pass('/api/ai: Quota exceeded returns 429 and terminates immediately without calling Gemini or fallback synthesis');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group F: Cost Protection', err);
}

// ── TEST GROUP G: Client Spoofing Immunity ────────────────────────────────────
console.log('\n--- TEST GROUP G: Client Spoofing Immunity ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    let receivedRpcLimit = null;
    let receivedRpcPeriod = null;

    globalThis.fetch = async (url, opts) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'real-user-id-uuid-1234',
            email: 'regular@example.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {}
          })
        };
      }
      if (urlStr.includes('/rest/v1/subscriptions')) {
        return {
          ok: true,
          status: 200,
          json: async () => [] // Real DB says Free Trial
        };
      }
      if (urlStr.includes('/rest/v1/rpc/check_and_increment_usage')) {
        const payload = JSON.parse(opts.body);
        receivedRpcLimit = payload.p_limit;
        receivedRpcPeriod = payload.p_period_key;
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

    // 21. Caller injects fake plan, tier, limit, period_key, userId, role in body
    const reqSpoof = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.customer.token'
      },
      body: {
        prompt: 'hello',
        plan: 'Enterprise',
        tier: 'Enterprise',
        limit: 999999,
        period_key: 'lifetime',
        userId: 'fake-admin-uuid',
        user_id: 'fake-admin-uuid',
        role: 'super-admin',
        isAdmin: true,
        userSession: { role: 'admin', isAdmin: true }
      }
    };
    const resSpoof = createMockNodeRes();
    await chatHandler(reqSpoof, resSpoof);

    assert.strictEqual(resSpoof.statusCode, 200);
    // Server must have enforced server-computed limit (5 for Free Trial), NOT 999999!
    assert.strictEqual(receivedRpcLimit, 5, `Server must enforce Free Trial limit 5, not client body limit (got ${receivedRpcLimit})`);
    // Server must have enforced server-computed daily period, NOT 'lifetime'!
    assert.strictEqual(receivedRpcPeriod, getUtcDailyPeriodKey(), `Server must enforce daily period, not client body period (got ${receivedRpcPeriod})`);
    pass('Client body injection (plan, tier, limit, period_key, userId, role) completely ignored by server-side resolver');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group G: Client Spoofing Immunity', err);
}

// ── TEST GROUP H: Strict Fail-Closed Verification ─────────────────────────────
console.log('\n--- TEST GROUP H: Strict Fail-Closed Verification (Zero Fallback to Free Trial) ---');

try {
  const verifiedUser = { id: '01234567-89ab-cdef-0123-456789abcdef', email: 'user@example.com' };

  // 22. Missing service_role key -> resolveUserSubscription returns AUTHORIZATION_SERVICE_ERROR
  const savedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const resNoKey = await resolveUserSubscription(verifiedUser);
    assert.strictEqual(resNoKey.success, false, 'Missing service key must fail with success: false');
    assert.strictEqual(resNoKey.error?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(resNoKey.tier, undefined, 'Missing service key must NEVER resolve to Free Trial');
    pass('Missing service_role key returns AUTHORIZATION_SERVICE_ERROR (never Free Trial)');

    // 23. Missing service_role key -> enforceUsageQuota fails closed with HTTP 500
    const quotaNoKey = await enforceUsageQuota(verifiedUser);
    assert.strictEqual(quotaNoKey.allowed, false, 'Missing service key must deny usage');
    assert.strictEqual(quotaNoKey.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(quotaNoKey.response?.status, 500);
    pass('Missing service_role key in enforceUsageQuota rejects request with HTTP 500');
  } finally {
    process.env.SUPABASE_SERVICE_ROLE_KEY = savedKey;
  }

  // 24. Database HTTP 500 -> resolveUserSubscription fails closed
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/rest/v1/subscriptions')) {
        return {
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: async () => 'Database connection failed'
        };
      }
      return originalFetch(url);
    };

    const resDb500 = await resolveUserSubscription(verifiedUser);
    assert.strictEqual(resDb500.success, false);
    assert.strictEqual(resDb500.error?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(resDb500.tier, undefined, 'DB HTTP 500 must NEVER resolve to Free Trial');
    pass('Subscription DB HTTP 500 returns AUTHORIZATION_SERVICE_ERROR (never Free Trial)');

    // 25. Database HTTP 500 -> enforceUsageQuota returns HTTP 500
    const quotaDb500 = await enforceUsageQuota(verifiedUser);
    assert.strictEqual(quotaDb500.allowed, false);
    assert.strictEqual(quotaDb500.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(quotaDb500.response?.status, 500);
    pass('Subscription DB HTTP 500 in enforceUsageQuota rejects request with HTTP 500');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 26. Database malformed JSON -> resolveUserSubscription fails closed
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/rest/v1/subscriptions')) {
        return {
          ok: true,
          status: 200,
          json: async () => { throw new SyntaxError('Unexpected token < in JSON at position 0'); }
        };
      }
      return originalFetch(url);
    };

    const resBadJson = await resolveUserSubscription(verifiedUser);
    assert.strictEqual(resBadJson.success, false);
    assert.strictEqual(resBadJson.error?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(resBadJson.tier, undefined);
    pass('Subscription DB malformed JSON returns AUTHORIZATION_SERVICE_ERROR (never Free Trial)');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 27. Database returns non-array object -> resolveUserSubscription fails closed
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/rest/v1/subscriptions')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ code: 'PGRST100', message: 'Table error' })
        };
      }
      return originalFetch(url);
    };

    const resNonArray = await resolveUserSubscription(verifiedUser);
    assert.strictEqual(resNonArray.success, false);
    assert.strictEqual(resNonArray.error?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(resNonArray.tier, undefined);
    pass('Subscription DB non-array object response returns AUTHORIZATION_SERVICE_ERROR');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 28. Database network exception (fetch throws) -> resolveUserSubscription fails closed
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/rest/v1/subscriptions')) {
        throw new Error('Connection reset by peer: ECONNRESET');
      }
      return originalFetch(url);
    };

    const resNetworkErr = await resolveUserSubscription(verifiedUser);
    assert.strictEqual(resNetworkErr.success, false);
    assert.strictEqual(resNetworkErr.error?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(resNetworkErr.tier, undefined);
    pass('Subscription DB network exception returns AUTHORIZATION_SERVICE_ERROR (never Free Trial)');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 29. Usage RPC execution returns HTTP 500 -> enforceUsageQuota fails closed with HTTP 500
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] }; // Free Trial
      }
      if (u.includes('/rest/v1/rpc/check_and_increment_usage')) {
        return { ok: false, status: 500, json: async () => ({ error: 'RPC crashed' }) };
      }
      return originalFetch(url);
    };

    const quotaRpcFail = await enforceUsageQuota(verifiedUser);
    assert.strictEqual(quotaRpcFail.allowed, false);
    assert.strictEqual(quotaRpcFail.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(quotaRpcFail.response?.status, 500);
    pass('Atomic usage RPC HTTP 500 failure rejects request with HTTP 500');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 30. End-to-end: /api/chat with DB failure returns HTTP 500 and NEVER invokes Gemini
  try {
    let geminiEverCalledOnDbFail = false;
    globalThis.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('generativelanguage.googleapis.com')) {
        geminiEverCalledOnDbFail = true;
      }
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-user-1234',
            email: 'user@juristech.solutions',
            app_metadata: { role: 'authenticated' },
            user_metadata: {}
          })
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: false, status: 500, json: async () => ({ error: 'Sub DB down' }) };
      }
      return originalFetch(url, opts);
    };

    const chatReq = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.jwt.token'
      },
      body: { prompt: 'Any prompt' }
    };
    const chatRes = createMockNodeRes();
    await chatHandler(chatReq, chatRes);

    assert.strictEqual(chatRes.statusCode, 500);
    assert.strictEqual(chatRes.body?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(geminiEverCalledOnDbFail, false, 'Gemini must NEVER be invoked on subscription authority error');
    assert.strictEqual(chatRes.body?.reply, undefined, 'Must not return synthesized reply text on service error');
    pass('End-to-End: /api/chat fails closed with HTTP 500 on DB failure without executing Gemini or fallback synthesis');

    // 31. End-to-end: /api/ai with DB failure returns HTTP 500 and NEVER invokes Gemini
    geminiEverCalledOnDbFail = false;
    const aiReq = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.jwt.token'
      },
      body: { prompt: 'Any AI prompt' }
    };
    const aiRes = createMockNodeRes();
    await aiHandler(aiReq, aiRes);

    assert.strictEqual(aiRes.statusCode, 500);
    assert.strictEqual(aiRes.body?.code, 'AUTHORIZATION_SERVICE_ERROR');
    assert.strictEqual(geminiEverCalledOnDbFail, false, 'Gemini must NEVER be invoked on subscription authority error');
    assert.strictEqual(aiRes.body?.reply, undefined, 'Must not return synthesized reply text on service error');
    pass('End-to-End: /api/ai fails closed with HTTP 500 on DB failure without executing Gemini or fallback synthesis');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group H: Strict Fail-Closed Verification', err);
}

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 04C PHASE 1C TIER & USAGE ENFORCEMENT VERIFIED SUCCESSFULLY!\n');
  process.exitCode = 0;
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED!\n`);
  process.exitCode = 1;
}
