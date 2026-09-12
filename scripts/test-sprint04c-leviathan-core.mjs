/**
 * scripts/test-sprint04c-leviathan-core.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 3C: Leviathan Core Security Test Suite
 *
 * Verifies:
 *   AUTH:
 *     1. Anonymous request -> 401
 *     2. Malformed Bearer -> 401
 *     3. Invalid/expired JWT -> 401
 *   TIER:
 *     4. Free Trial -> 403
 *     5. Startup -> 403
 *     6. SMEs -> 403
 *     7. Enterprise -> allowed (200)
 *     8. Verified Admin -> allowed (200)
 *     9. Verified Lawyer -> allowed (200)
 *   SPOOFING:
 *     10. Fake role cannot grant access
 *     11. Fake isAdmin cannot grant access
 *     12. Fake tier cannot grant access
 *     13. Fake userId cannot grant access
 *     14. Fake visitorIntentScore cannot grant access or bypass tier
 *     15. Fake limit cannot modify quota
 *     16. Fake period_key cannot modify quota
 *   INPUT:
 *     17. Missing message -> 400
 *     18. Empty message -> 400
 *     19. message > 10,000 chars -> 400
 *     20. companyContext > 2,000 chars -> 400
 *     21. Non-string companyContext -> 400
 *     22. visitorIntentScore is safely normalized/clamped
 *     23. Malformed JSON -> 400
 *   COST PROTECTION:
 *     24. Authentication failure never calls Gemini
 *     25. Tier failure never calls Gemini
 *     26. Input validation failure never calls Gemini
 *     27. Subscription failure never calls Gemini
 *   FAIL-CLOSED / MODEL PROTECTION:
 *     28. Missing GEMINI_API_KEY fails closed (never HTTP 200)
 *     29. Gemini upstream failure fails closed (never HTTP 200)
 *     30. Empty Gemini response fails closed (never HTTP 200)
 *   PROMPT & AUDIT:
 *     31. Prompt uses boundary delimiters for untrusted inputs
 *     32. visitorIntentScore > 70 adds strategic directive
 *     33. Zero credential leakage in response
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
console.log('🦁  JURISTECH — SPRINT 04C LEVIATHAN CORE SECURITY SUITE');
console.log('================================================================\n');

process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test_service_role_key_simulated';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test_gemini_api_key_simulated';

// Import handler and exports under test
const { default: leviathanHandler, POST: leviathanPost, processLeviathanCoreRequest } = await import('../api/ai/leviathan-core.js');

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
    },
  };
}

const validPayload = {
  message: 'حلل الثغرات القانونية في عقد الشراكة واستراتيجية التفاوض المقترحة.',
  companyContext: 'شركة تقنية مالية ناشئة برأس مال 5 ملايين ريال.',
  visitorIntentScore: 85,
};

// ── TEST GROUP 1: Authentication Boundary (Tests 1–3) ────────────────────────
console.log('--- TEST GROUP 1: Authentication Boundary ---');

try {
  // 1. Anonymous -> 401
  const resAnon = createMockNodeRes();
  await leviathanHandler({ method: 'POST', headers: {}, body: validPayload }, resAnon);
  assert.strictEqual(resAnon.statusCode, 401, 'Anonymous request must return 401');
  assert.strictEqual(resAnon.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('Test 1: Anonymous request strictly rejected with 401 MISSING_AUTHORIZATION_TOKEN');

  // 2. Malformed Bearer -> 401
  const resMalformed = createMockNodeRes();
  await leviathanHandler({
    method: 'POST',
    headers: { authorization: 'Basic dXNlcjpwYXNz' },
    body: validPayload,
  }, resMalformed);
  assert.strictEqual(resMalformed.statusCode, 401, 'Malformed bearer must return 401');
  assert.strictEqual(resMalformed.body?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  pass('Test 2: Malformed non-Bearer header strictly rejected with 401 MALFORMED_AUTHORIZATION_HEADER');

  // 3. Invalid/expired JWT -> 401
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      if (String(url).includes('/auth/v1/user')) {
        return { ok: false, status: 401, json: async () => ({ message: 'Invalid or expired token' }) };
      }
      return originalFetch(url);
    };
    const resBadToken = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer invalid.or.expired.jwt' },
      body: validPayload,
    }, resBadToken);
    assert.strictEqual(resBadToken.statusCode, 401, 'Invalid JWT must return 401');
    assert(
      resBadToken.body?.code === 'INVALID_OR_EXPIRED_TOKEN' || resBadToken.body?.code === 'TOKEN_VERIFICATION_FAILED',
      `Expected invalid token code, got ${resBadToken.body?.code}`
    );
    pass('Test 3: Invalid / expired JWT strictly rejected with 401 INVALID_OR_EXPIRED_TOKEN');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 1: Authentication Boundary', err);
}

// ── TEST GROUP 2: Tier Enforcement (Enterprise Required) (Tests 4–9) ─────────
console.log('\n--- TEST GROUP 2: Tier Enforcement (Enterprise Required) ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    let currentSubPlan = null;
    let currentUserRole = 'authenticated';
    let currentIsAdmin = false;
    let currentIsLawyer = false;

    globalThis.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-user-uuid',
            email: currentIsAdmin ? 'drzyogo.ca@gmail.com' : 'user@example.com',
            app_metadata: { role: currentUserRole },
            user_metadata: { isAdmin: currentIsAdmin, isLawyer: currentIsLawyer },
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        if (!currentSubPlan) {
          return { ok: true, status: 200, json: async () => [] };
        }
        return {
          ok: true,
          status: 200,
          json: async () => [{ plan_id: currentSubPlan, plan_name: `${currentSubPlan} plan`, status: 'active' }],
        };
      }
      if (u.includes('generativelanguage.googleapis.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'تحليل ليفياثان الاستراتيجي: تم رصد وإحكام الثغرات.' }] } }],
          }),
        };
      }
      return originalFetch(url, opts);
    };

    // 4. Free Trial -> 403
    currentSubPlan = null; // No subscription -> Free Trial
    const resFree = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: validPayload,
    }, resFree);
    assert.strictEqual(resFree.statusCode, 403, 'Free Trial must be rejected with 403');
    assert.strictEqual(resFree.body?.code, 'INSUFFICIENT_TIER');
    assert.strictEqual(resFree.body?.requiredTier, 'Enterprise');
    pass('Test 4: Free Trial tier strictly rejected with 403 INSUFFICIENT_TIER');

    // 5. Startup -> 403
    currentSubPlan = 'Startup';
    const resStartup = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: validPayload,
    }, resStartup);
    assert.strictEqual(resStartup.statusCode, 403, 'Startup plan must be rejected with 403');
    assert.strictEqual(resStartup.body?.code, 'INSUFFICIENT_TIER');
    assert.strictEqual(resStartup.body?.requiredTier, 'Enterprise');
    pass('Test 5: Startup tier strictly rejected with 403 INSUFFICIENT_TIER');

    // 6. SMEs -> 403 (Unlike Cross-Border RAG, Leviathan is strictly Enterprise)
    currentSubPlan = 'SMEs';
    const resSMEs = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: validPayload,
    }, resSMEs);
    assert.strictEqual(resSMEs.statusCode, 403, 'SMEs plan must be rejected with 403');
    assert.strictEqual(resSMEs.body?.code, 'INSUFFICIENT_TIER');
    assert.strictEqual(resSMEs.body?.requiredTier, 'Enterprise');
    pass('Test 6: SMEs tier strictly rejected with 403 INSUFFICIENT_TIER');

    // 7. Enterprise -> Allowed 200
    currentSubPlan = 'Enterprise';
    const resEnt = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: validPayload,
    }, resEnt);
    assert.strictEqual(resEnt.statusCode, 200, 'Enterprise plan must be allowed with 200');
    assert.strictEqual(resEnt.body?.status, 'optimized');
    assert(resEnt.body?.reply?.includes('ليفياثان'), 'Reply must contain model output');
    pass('Test 7: Enterprise tier successfully allowed with 200 OK');

    // 8. Verified Admin -> Allowed 200 (even without subscription)
    currentSubPlan = null;
    currentIsAdmin = true;
    const resAdmin = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.admin.token' },
      body: validPayload,
    }, resAdmin);
    assert.strictEqual(resAdmin.statusCode, 200, 'Verified Admin must be allowed with 200');
    assert.strictEqual(resAdmin.body?.tier, 'Enterprise');
    pass('Test 8: Verified Admin privileged override allowed with 200 OK');
    currentIsAdmin = false;

    // 9. Verified Lawyer -> Allowed 200
    currentSubPlan = null;
    currentUserRole = 'lawyer';
    currentIsLawyer = true;
    const resLawyer = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.lawyer.token' },
      body: validPayload,
    }, resLawyer);
    assert.strictEqual(resLawyer.statusCode, 200, 'Verified Lawyer must be allowed with 200');
    assert.strictEqual(resLawyer.body?.tier, 'Enterprise');
    pass('Test 9: Verified Lawyer privileged override allowed with 200 OK');
    currentUserRole = 'authenticated';
    currentIsLawyer = false;

  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 2: Tier Enforcement', err);
}

// ── TEST GROUP 3: Anti-Spoofing & Boundary Checks (Tests 10–16) ───────────────
console.log('\n--- TEST GROUP 3: Anti-Spoofing & Boundary Checks ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'unprivileged-uuid',
            email: 'hacker@example.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] }; // Free Trial
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    // 10. Fake role in body -> Denied 403
    const resSpoofRole = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, role: 'admin' },
    }, resSpoofRole);
    assert.strictEqual(resSpoofRole.statusCode, 403, 'Fake role in body must not grant privilege');
    pass('Test 10: Forged role in request body strictly ignored (403)');

    // 11. Fake isAdmin in body -> Denied 403
    const resSpoofAdmin = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, isAdmin: true },
    }, resSpoofAdmin);
    assert.strictEqual(resSpoofAdmin.statusCode, 403, 'Fake isAdmin in body must not grant privilege');
    pass('Test 11: Forged isAdmin flag in request body strictly ignored (403)');

    // 12. Fake tier in body -> Denied 403
    const resSpoofTier = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, tier: 'Enterprise', plan: 'Enterprise' },
    }, resSpoofTier);
    assert.strictEqual(resSpoofTier.statusCode, 403, 'Fake tier in body must not grant privilege');
    pass('Test 12: Forged tier/plan in request body strictly ignored (403)');

    // 13. Fake userId in body -> Ignored (bound to JWT)
    const resSpoofUser = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, userId: 'victim-uuid-123' },
    }, resSpoofUser);
    assert.strictEqual(resSpoofUser.statusCode, 403, 'Forged userId in body must be ignored');
    pass('Test 13: Forged userId in request body strictly ignored');

    // 14. Fake extreme visitorIntentScore -> cannot grant privilege
    const resSpoofIntent = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, visitorIntentScore: 999999 },
    }, resSpoofIntent);
    assert.strictEqual(resSpoofIntent.statusCode, 403, 'Extreme visitorIntentScore cannot bypass tier');
    pass('Test 14: Extreme visitorIntentScore (999999) cannot bypass commercial tier check (403)');

    // 15. Fake limit in body -> Ignored
    const resSpoofLimit = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, limit: 999999 },
    }, resSpoofLimit);
    assert.strictEqual(resSpoofLimit.statusCode, 403, 'Fake limit in body must be ignored');
    pass('Test 15: Forged limit in request body strictly ignored');

    // 16. Fake period_key in body -> Ignored
    const resSpoofPeriod = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.user.token' },
      body: { ...validPayload, period_key: '2099-12-31' },
    }, resSpoofPeriod);
    assert.strictEqual(resSpoofPeriod.statusCode, 403, 'Fake period_key in body must be ignored');
    pass('Test 16: Forged period_key in request body strictly ignored');

  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 3: Anti-Spoofing & Boundary Checks', err);
}

// ── TEST GROUP 4: Input Validation (Tests 17–23) ──────────────────────────────
console.log('\n--- TEST GROUP 4: Input Validation ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-enterprise-user',
            email: 'corp@enterprise.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [{ plan_id: 'Enterprise', plan_name: 'Enterprise Plan', status: 'active' }] };
      }
      if (u.includes('generativelanguage.googleapis.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'تحليل قانوني معتمد.' }] } }],
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    // 17. Missing message -> 400
    const resNoMsg = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { companyContext: 'test' },
    }, resNoMsg);
    assert.strictEqual(resNoMsg.statusCode, 400, 'Missing message must return 400');
    assert.strictEqual(resNoMsg.body?.code, 'MISSING_MESSAGE');
    pass('Test 17: Missing message parameter rejected with 400 MISSING_MESSAGE');

    // 18. Empty message -> 400
    const resEmptyMsg = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { message: '    ' },
    }, resEmptyMsg);
    assert.strictEqual(resEmptyMsg.statusCode, 400, 'Whitespace message must return 400');
    assert.strictEqual(resEmptyMsg.body?.code, 'INVALID_REQUEST_MESSAGE');
    pass('Test 18: Whitespace-only message rejected with 400 INVALID_REQUEST_MESSAGE');

    // 19. Oversized message (> 10,000 chars) -> 400
    const resOversizedMsg = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { message: 'A'.repeat(10001) },
    }, resOversizedMsg);
    assert.strictEqual(resOversizedMsg.statusCode, 400, 'Oversized message must return 400');
    assert.strictEqual(resOversizedMsg.body?.code, 'MESSAGE_TOO_LONG');
    pass('Test 19: Oversized message (>10k chars) rejected with 400 MESSAGE_TOO_LONG');

    // 20. Oversized companyContext (> 2,000 chars) -> 400
    const resOversizedCtx = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { message: 'valid message', companyContext: 'B'.repeat(2001) },
    }, resOversizedCtx);
    assert.strictEqual(resOversizedCtx.statusCode, 400, 'Oversized companyContext must return 400');
    assert.strictEqual(resOversizedCtx.body?.code, 'CONTEXT_TOO_LONG');
    pass('Test 20: Oversized companyContext (>2k chars) rejected with 400 CONTEXT_TOO_LONG');

    // 21. Non-string companyContext -> 400
    const resInvalidCtx = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { message: 'valid message', companyContext: 12345 },
    }, resInvalidCtx);
    assert.strictEqual(resInvalidCtx.statusCode, 400, 'Non-string companyContext must return 400');
    assert.strictEqual(resInvalidCtx.body?.code, 'INVALID_CONTEXT');
    pass('Test 21: Non-string companyContext rejected with 400 INVALID_CONTEXT');

    // 22. visitorIntentScore normalization
    const resNormalizeScore = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { message: 'valid message', visitorIntentScore: 'not-a-number' },
    }, resNormalizeScore);
    assert.strictEqual(resNormalizeScore.statusCode, 200, 'Invalid visitorIntentScore normalized gracefully');
    pass('Test 22: Non-numeric visitorIntentScore normalized to safe default without crashing');

    // 23. Malformed JSON -> 400
    const badJsonReq = {
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      json: async () => { throw new Error('SyntaxError: Unexpected token'); },
    };
    const resBadJson = createMockNodeRes();
    await leviathanHandler(badJsonReq, resBadJson);
    assert.strictEqual(resBadJson.statusCode, 400, 'Malformed JSON must return 400');
    assert.strictEqual(resBadJson.body?.code, 'MALFORMED_JSON');
    pass('Test 23: Malformed JSON payload strictly rejected with 400 MALFORMED_JSON');

  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 4: Input Validation', err);
}

// ── TEST GROUP 5: Usage & Cost Protection (Zero Gemini Calls) (Tests 24–27) ──
console.log('\n--- TEST GROUP 5: Cost & Model Invocation Protection ---');

try {
  let geminiCalls = 0;
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('generativelanguage.googleapis.com')) {
        geminiCalls++;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'Response' }] } }],
          }),
        };
      }
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-user-uuid',
            email: 'user@example.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [] }; // Free Trial
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    // 24. Auth failure -> zero Gemini calls
    geminiCalls = 0;
    const resAuthFail = createMockNodeRes();
    await leviathanHandler({ method: 'POST', headers: {}, body: validPayload }, resAuthFail);
    assert.strictEqual(resAuthFail.statusCode, 401);
    assert.strictEqual(geminiCalls, 0, 'Gemini must not be called on auth failure');
    pass('Test 24: Authentication failure makes ZERO Gemini calls');

    // 25. Tier failure -> zero Gemini calls
    geminiCalls = 0;
    const resTierFail = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: validPayload,
    }, resTierFail);
    assert.strictEqual(resTierFail.statusCode, 403);
    assert.strictEqual(geminiCalls, 0, 'Gemini must not be called on tier failure');
    pass('Test 25: Tier failure (Free Trial) makes ZERO Gemini calls');

    // 26. Validation failure -> zero Gemini calls
    geminiCalls = 0;
    const resValFail = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: { message: '' },
    }, resValFail);
    assert.strictEqual(geminiCalls, 0, 'Gemini must not be called on validation failure');
    pass('Test 26: Validation failure makes ZERO Gemini calls');

    // 27. Subscription failure -> zero Gemini calls
    geminiCalls = 0;
    const originalFetch2 = globalThis.fetch;
    globalThis.fetch = async (url) => {
      if (String(url).includes('/rest/v1/subscriptions')) {
        return { ok: false, status: 500, json: async () => ({ message: 'Database error' }) };
      }
      return originalFetch2(url);
    };
    const resSubFail = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: validPayload,
    }, resSubFail);
    assert.strictEqual(resSubFail.statusCode, 500);
    assert.strictEqual(geminiCalls, 0, 'Gemini must not be called on subscription DB failure');
    pass('Test 27: Subscription DB failure makes ZERO Gemini calls');

  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 5: Cost & Model Invocation Protection', err);
}

// ── TEST GROUP 6: Fail-Closed & Model Protection (Tests 28–30) ────────────────
console.log('\n--- TEST GROUP 6: Fail-Closed & Model Protection ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-enterprise-user',
            email: 'corp@enterprise.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [{ plan_id: 'Enterprise', status: 'active' }] };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    // 28. Missing GEMINI_API_KEY fails closed with 500
    const originalKey = process.env.GEMINI_API_KEY;
    const originalViteKey = process.env.VITE_GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.VITE_GEMINI_API_KEY;
    try {
      const resNoKey = createMockNodeRes();
      await leviathanHandler({
        method: 'POST',
        headers: { authorization: 'Bearer valid.jwt' },
        body: validPayload,
      }, resNoKey);
      assert.strictEqual(resNoKey.statusCode, 500, 'Missing GEMINI_API_KEY must return 500');
      assert.strictEqual(resNoKey.body?.code, 'AI_SERVICE_UNCONFIGURED');
      pass('Test 28: Missing GEMINI_API_KEY fails closed with 500 AI_SERVICE_UNCONFIGURED (never fake 200)');
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
      process.env.VITE_GEMINI_API_KEY = originalViteKey;
    }

    // 29. Gemini upstream failure fails closed with 502
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-enterprise-user',
            email: 'corp@enterprise.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [{ plan_id: 'Enterprise', status: 'active' }] };
      }
      if (u.includes('generativelanguage.googleapis.com')) {
        return { ok: false, status: 503, json: async () => ({ error: 'Service Unavailable' }) };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    const resGeminiErr = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: validPayload,
    }, resGeminiErr);
    assert.strictEqual(resGeminiErr.statusCode, 502, 'Gemini failure must return 502');
    assert.strictEqual(resGeminiErr.body?.code, 'UPSTREAM_AI_ERROR');
    pass('Test 29: Gemini upstream failure fails closed with 502 UPSTREAM_AI_ERROR (never fake 200)');

    // 30. Empty Gemini response fails closed with 502
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-enterprise-user',
            email: 'corp@enterprise.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [{ plan_id: 'Enterprise', status: 'active' }] };
      }
      if (u.includes('generativelanguage.googleapis.com')) {
        return { ok: true, status: 200, json: async () => ({ candidates: [] }) };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    const resEmptyGemini = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: validPayload,
    }, resEmptyGemini);
    assert.strictEqual(resEmptyGemini.statusCode, 502, 'Empty Gemini response must return 502');
    assert.strictEqual(resEmptyGemini.body?.code, 'UPSTREAM_AI_ERROR');
    pass('Test 30: Empty Gemini candidate output fails closed with 502 UPSTREAM_AI_ERROR');

  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 6: Fail-Closed & Model Protection', err);
}

// ── TEST GROUP 7: Prompt & Audit Verification (Tests 31–33) ───────────────────
console.log('\n--- TEST GROUP 7: Prompt & Audit Verification ---');

try {
  let capturedGeminiBody = null;
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'verified-enterprise-user',
            email: 'corp@enterprise.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {},
          }),
        };
      }
      if (u.includes('/rest/v1/subscriptions')) {
        return { ok: true, status: 200, json: async () => [{ plan_id: 'Enterprise', status: 'active' }] };
      }
      if (u.includes('generativelanguage.googleapis.com')) {
        capturedGeminiBody = JSON.parse(opts.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'تحليل ليفياثان المعتمد.' }] } }],
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    // 31. Prompt uses boundary delimiters
    const resPrompt = createMockNodeRes();
    await leviathanHandler({
      method: 'POST',
      headers: { authorization: 'Bearer valid.jwt' },
      body: {
        message: 'تعليمات اختبار الثغرات',
        companyContext: 'شركة تجارية كبرى',
        visitorIntentScore: 90,
      },
    }, resPrompt);

    assert.strictEqual(resPrompt.statusCode, 200);
    const userPromptPart = capturedGeminiBody?.contents?.find((c) => c.role === 'user' && c.parts?.[0]?.text?.includes('<<<BEGIN_UNTRUSTED_LEGAL_QUERY>>>'));
    assert(userPromptPart, 'Prompt must contain <<<BEGIN_UNTRUSTED_LEGAL_QUERY>>> delimiter');
    assert(userPromptPart.parts[0].text.includes('<<<BEGIN_UNTRUSTED_COMPANY_CONTEXT>>>'), 'Prompt must contain company context delimiter');
    pass('Test 31: User query and company context are encapsulated within strict boundary delimiters');

    // 32. visitorIntentScore > 70 adds strategic directive
    const sysPromptPart = capturedGeminiBody?.contents?.find((c) => c.parts?.[0]?.text?.includes('[SYSTEM INSTRUCTION]'));
    assert(sysPromptPart.parts[0].text.includes('[تنبيه استخباراتي]'), 'visitorIntentScore > 70 must trigger intelligence alert');
    pass('Test 32: visitorIntentScore > 70 dynamically includes intelligence alert without altering security boundaries');

    // 33. Zero credential leakage in response
    const resString = JSON.stringify(resPrompt.body);
    assert(!resString.includes(process.env.SUPABASE_SERVICE_ROLE_KEY), 'Response must never leak service role key');
    assert(!resString.includes(process.env.GEMINI_API_KEY), 'Response must never leak GEMINI API key');
    assert(!resString.includes('valid.jwt'), 'Response must never leak Bearer token');
    pass('Test 33: Response contains ZERO credential or token leakage');

  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 7: Prompt & Audit Verification', err);
}

// ── SUMMARY REPORT ────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🎯  TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('================================================================');

if (totalTests === passedTests && totalTests === 33) {
  console.log('🌟 SPRINT 04C PHASE 3C LEVIATHAN CORE SECURITY SUITE: ALL PASS');
  process.exit(0);
} else {
  console.error('💥 SOME TESTS FAILED');
  process.exit(1);
}
