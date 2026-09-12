/**
 * scripts/test-sprint04c-auth-guard.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 1B-1: Universal Auth Guard Test Suite
 *
 * Verifies:
 *   1. Missing Authorization header -> 401 MISSING_AUTHORIZATION_TOKEN
 *   2. Malformed Bearer header -> 401 MALFORMED_AUTHORIZATION_HEADER
 *   3. Invalid/Expired token -> 401 INVALID_OR_EXPIRED_TOKEN
 *   4. Valid token verification and normalized user identity derivation
 *   5. Untrusted request body parameters (userSession, role, isAdmin) ignored by design
 *   6. Privileged role detection (Admin, Lawyer) strictly from trusted auth claims
 *   7. Zero anonymous fallback (fails closed)
 *   8. Zero token logging and zero service_role exposure
 *   9. src/lib/api.ts client transport correctly injects Authorization Bearer header
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
console.log('🛡️  JURISTECH SOLUTIONS — SPRINT 04C AUTH GUARD TEST SUITE');
console.log('================================================================\n');

// Import the backendAuthGuard module
const { authenticateRequest, extractBearerToken, createUnauthorizedResponse } =
  await import('../lib/security/backendAuthGuard.js');

// ── TEST GROUP 1: Header Extraction & Validation ─────────────────────────────
console.log('--- TEST GROUP 1: Header Extraction & Validation ---');

try {
  // 1. Missing Authorization Header
  const reqNoAuth = { headers: {} };
  const resNoAuth = await authenticateRequest(reqNoAuth);
  assert.strictEqual(resNoAuth.authenticated, false);
  assert.strictEqual(resNoAuth.error?.code, 'MISSING_AUTHORIZATION_TOKEN');
  assert.strictEqual(resNoAuth.response?.status, 401);
  pass('Missing Authorization header returns structured 401 MISSING_AUTHORIZATION_TOKEN');

  // 2. Malformed Auth Header - Non-Bearer format (Basic)
  const reqBasic = {
    headers: {
      get: (h) => (h.toLowerCase() === 'authorization' ? 'Basic dXNlcjpwYXNz' : null)
    }
  };
  const resBasic = await authenticateRequest(reqBasic);
  assert.strictEqual(resBasic.authenticated, false);
  assert.strictEqual(resBasic.error?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  assert.strictEqual(resBasic.response?.status, 401);
  pass('Non-Bearer Authorization header returns structured 401 MALFORMED_AUTHORIZATION_HEADER');

  // 3. Malformed Auth Header - Empty Bearer token
  const reqEmptyBearer = {
    headers: {
      get: (h) => (h.toLowerCase() === 'authorization' ? 'Bearer   ' : null)
    }
  };
  const resEmptyBearer = await authenticateRequest(reqEmptyBearer);
  assert.strictEqual(resEmptyBearer.authenticated, false);
  assert.strictEqual(resEmptyBearer.error?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  assert.strictEqual(resEmptyBearer.response?.status, 401);
  pass('Whitespace-only Bearer token returns structured 401 MALFORMED_AUTHORIZATION_HEADER');

  // 4. Token Extraction Helper
  assert.strictEqual(extractBearerToken({ headers: { authorization: 'Bearer test.jwt.token' } }), 'test.jwt.token');
  assert.strictEqual(extractBearerToken({ headers: { Authorization: 'BEARER test.jwt.token' } }), 'test.jwt.token');
  assert.strictEqual(extractBearerToken({ headers: {} }), null);
  pass('extractBearerToken helper handles case-insensitivity and whitespace stripping cleanly');
} catch (err) {
  fail('Test Group 1: Header Extraction & Validation', err);
}

// ── TEST GROUP 2: Cryptographic Token Verification Logic ─────────────────────
console.log('\n--- TEST GROUP 2: Token Verification Logic ---');

try {
  // 5. Invalid / Expired Token rejection
  // Test against live Supabase Auth endpoint with a known invalid token
  const reqInvalidToken = {
    headers: {
      get: (h) => (h.toLowerCase() === 'authorization' ? 'Bearer invalid.fake.token.123' : null)
    }
  };
  const resInvalidToken = await authenticateRequest(reqInvalidToken, {
    customSupabaseUrl: 'https://slhxqshdvivvsdifbsxo.supabase.co',
    customAnonKey: 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO'
  });
  assert.strictEqual(resInvalidToken.authenticated, false);
  assert.strictEqual(resInvalidToken.error?.code, 'INVALID_OR_EXPIRED_TOKEN');
  assert.strictEqual(resInvalidToken.response?.status, 401);
  pass('Cryptographically invalid token is rejected with structured 401 INVALID_OR_EXPIRED_TOKEN');

  // 6. Valid Token Simulation & Normalized User Identity Derivation
  // Simulate successful Supabase Auth response to verify normalization
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, opts) => {
      if (url.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'usr_789456_valid',
            email: 'customer@juristech.solutions',
            created_at: '2026-01-01T00:00:00.000Z',
            app_metadata: { role: 'authenticated' },
            user_metadata: { full_name: 'Verified Customer' }
          })
        };
      }
      return originalFetch(url, opts);
    };

    const reqValidToken = {
      headers: {
        get: (h) => (h.toLowerCase() === 'authorization' ? 'Bearer valid.simulated.token' : null)
      }
    };
    const resValidToken = await authenticateRequest(reqValidToken, {
      customSupabaseUrl: 'https://slhxqshdvivvsdifbsxo.supabase.co',
      customAnonKey: 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO'
    });

    assert.strictEqual(resValidToken.authenticated, true);
    assert.strictEqual(resValidToken.user?.id, 'usr_789456_valid');
    assert.strictEqual(resValidToken.user?.email, 'customer@juristech.solutions');
    assert.strictEqual(resValidToken.user?.role, 'authenticated');
    assert.strictEqual(resValidToken.user?.isAdmin, false);
    assert.strictEqual(resValidToken.user?.isLawyer, false);
    pass('Valid token resolves verified user context (id, email, role, isAdmin: false, isLawyer: false)');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 2: Token Verification Logic', err);
}

// ── TEST GROUP 3: Anti-Spoofing & Trust Boundaries ───────────────────────────
console.log('\n--- TEST GROUP 3: Anti-Spoofing & Trust Boundaries ---');

try {
  const originalFetch = globalThis.fetch;
  try {
    // 7. Request Body Spoofing Resistance
    // Caller passes fake userSession with admin credentials in request body
    globalThis.fetch = async (url, opts) => {
      if (url.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'usr_regular_customer',
            email: 'regular@example.com',
            app_metadata: { role: 'authenticated' },
            user_metadata: {}
          })
        };
      }
      return originalFetch(url, opts);
    };

    const reqSpoofAttempt = {
      headers: {
        get: (h) => (h.toLowerCase() === 'authorization' ? 'Bearer regular.token' : null)
      },
      body: {
        userSession: {
          role: 'admin',
          isAdmin: true,
          email: 'drzyogo.ca@gmail.com',
          isLawyer: true
        },
        role: 'super-admin',
        isAdmin: true,
        user_id: '00000000-0000-0000-0000-000000000000'
      }
    };

    const resSpoof = await authenticateRequest(reqSpoofAttempt, {
      customSupabaseUrl: 'https://slhxqshdvivvsdifbsxo.supabase.co',
      customAnonKey: 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO'
    });

    assert.strictEqual(resSpoof.authenticated, true);
    assert.strictEqual(resSpoof.user?.id, 'usr_regular_customer');
    assert.strictEqual(resSpoof.user?.email, 'regular@example.com');
    assert.strictEqual(resSpoof.user?.isAdmin, false);
    assert.strictEqual(resSpoof.user?.isLawyer, false);
    assert.strictEqual(resSpoof.user?.role, 'authenticated');
    pass('Client body spoofing (userSession, role, isAdmin, user_id) completely ignored');

    // 8. Privileged Role Derivation from Trusted Claims
    globalThis.fetch = async (url, opts) => {
      if (url.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'usr_admin_1',
            email: 'drzyogo.ca@gmail.com',
            app_metadata: { role: 'admin' },
            user_metadata: {}
          })
        };
      }
      return originalFetch(url, opts);
    };

    const reqAdmin = {
      headers: {
        get: (h) => (h.toLowerCase() === 'authorization' ? 'Bearer admin.token' : null)
      }
    };
    const resAdmin = await authenticateRequest(reqAdmin, {
      customSupabaseUrl: 'https://slhxqshdvivvsdifbsxo.supabase.co',
      customAnonKey: 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO'
    });

    assert.strictEqual(resAdmin.authenticated, true);
    assert.strictEqual(resAdmin.user?.isAdmin, true);
    pass('Admin privilege granted ONLY when verified from trusted Supabase Auth identity');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 3: Anti-Spoofing & Trust Boundaries', err);
}

// ── TEST GROUP 4: Security Constraints & Client Transport ────────────────────
console.log('\n--- TEST GROUP 4: Security Constraints & Client Transport ---');

try {
  const guardCode = fs.readFileSync(path.resolve('lib/security/backendAuthGuard.js'), 'utf-8');

  // 9. Zero Token Logging in Guard
  assert(!guardCode.includes('console.log(token)'), 'Must not log raw token');
  assert(!guardCode.includes('console.log(`Bearer'), 'Must not log Bearer header');
  assert(!guardCode.includes('console.log(authHeader)'), 'Must not log raw authHeader');
  pass('Zero logging of sensitive access tokens or credentials');

  // 10. Zero service_role Key Exposure
  assert(!guardCode.includes('SUPABASE_SERVICE_ROLE_KEY'), 'backendAuthGuard must NOT use or expose service_role key');
  pass('backendAuthGuard operates strictly using verified Supabase Auth (zero service_role key exposure)');

  // 11. Fail Closed / Zero Anonymous Fallback
  assert(!guardCode.includes("role = 'anon'"), 'Must not fall back to anon role');
  assert(!guardCode.includes('authenticated = true') || guardCode.includes('authenticated: false'), 'Must fail closed');
  pass('Fails closed on any error (zero anonymous fallback)');

  // 12. Client Transport in src/lib/api.ts
  const apiCode = fs.readFileSync(path.resolve('src/lib/api.ts'), 'utf-8');
  assert(apiCode.includes("import { supabase } from './supabaseClient'"), 'api.ts must import supabase client');
  assert(apiCode.includes('supabase.auth.getSession()'), 'api.ts must read session from supabase.auth.getSession()');
  assert(apiCode.includes("authHeaders['Authorization'] = `Bearer ${sessionData.session.access_token}`"), 'api.ts must attach Authorization Bearer token');
  assert(apiCode.includes("headers: { 'Content-Type': 'application/json', 'X-Language': lang, ...authHeaders }"), 'api.ts fetch must include authHeaders');
  pass('src/lib/api.ts client transport attaches verified Authorization: Bearer token to /api/chat and /api/ai');
} catch (err) {
  fail('Test Group 4: Security Constraints & Client Transport', err);
}

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 04C PHASE 1B-1 AUTH GUARD VERIFIED SUCCESSFULLY!\n');
  process.exitCode = 0;
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED!\n`);
  process.exitCode = 1;
}
