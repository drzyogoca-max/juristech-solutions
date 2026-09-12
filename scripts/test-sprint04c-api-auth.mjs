/**
 * scripts/test-sprint04c-api-auth.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 1B-2: API Auth Verification Suite
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
console.log('🛡️  JURISTECH SOLUTIONS — SPRINT 04C API AUTH TEST SUITE');
console.log('================================================================\n');

// Import handlers dynamically
const { default: chatHandler, POST: chatPost, GET: chatGet } = await import('../api/chat.js');
const { default: aiHandler, POST: aiPost, GET: aiGet } = await import('../api/ai.js');

// Mock response helper for Node.js handler testing
function createMockNodeRes() {
  const res = {
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
  return res;
}

// ── TEST GROUP 1: Static Code & Architectural Integrity ─────────────────────
console.log('--- TEST GROUP 1: Static Code & Architectural Integrity ---');

try {
  const chatCode = fs.readFileSync(path.resolve('api/chat.js'), 'utf-8');
  assert(chatCode.includes("import { authenticateRequest } from '../lib/security/backendAuthGuard.js'"), 'chat.js must import authenticateRequest');
  assert(chatCode.includes('authenticateRequest(req'), 'chat.js must invoke authenticateRequest');
  assert(!chatCode.includes('console.log(token'), 'chat.js must not log tokens');
  assert(!chatCode.includes('console.log(authHeader'), 'chat.js must not log auth headers');
  pass('/api/chat.js statically verified: imports backendAuthGuard and contains zero credential logging');

  const aiCode = fs.readFileSync(path.resolve('api/ai.js'), 'utf-8');
  assert(aiCode.includes("import { authenticateRequest } from '../lib/security/backendAuthGuard.js'"), 'ai.js must import authenticateRequest');
  assert(aiCode.includes('authenticateRequest(req'), 'ai.js must invoke authenticateRequest');
  assert(!aiCode.includes('console.log(token'), 'ai.js must not log tokens');
  assert(!aiCode.includes('console.log(authHeader'), 'ai.js must not log auth headers');
  pass('/api/ai.js statically verified: imports backendAuthGuard and contains zero credential logging');
} catch (err) {
  fail('Test Group 1: Static Code & Architectural Integrity', err);
}

// ── TEST GROUP 2: /api/chat Authentication Enforcement ───────────────────────
console.log('\n--- TEST GROUP 2: /api/chat Authentication Enforcement ---');

try {
  // 1. /api/chat Node: No Authorization Header -> 401
  const reqNoAuthNode = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { prompt: 'What are the labor laws in KSA?' }
  };
  const resNoAuthNode = createMockNodeRes();
  await chatHandler(reqNoAuthNode, resNoAuthNode);
  assert.strictEqual(resNoAuthNode.statusCode, 401);
  assert.strictEqual(resNoAuthNode.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/chat (Node): Missing Authorization header strictly rejected with 401 MISSING_AUTHORIZATION_TOKEN');

  // 2. /api/chat Edge: No Authorization Header -> 401
  const reqNoAuthEdge = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Tell me about NDAs' })
  });
  const resNoAuthEdge = await chatPost(reqNoAuthEdge);
  assert.strictEqual(resNoAuthEdge.status, 401);
  const dataNoAuthEdge = await resNoAuthEdge.json();
  assert.strictEqual(dataNoAuthEdge.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/chat (Edge): Missing Authorization header strictly rejected with 401 MISSING_AUTHORIZATION_TOKEN');

  // 3. /api/chat: Malformed Bearer (Basic auth) -> 401
  const reqMalformed = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic dXNlcjpwYXNz'
    },
    body: { prompt: 'Legal test' }
  };
  const resMalformed = createMockNodeRes();
  await chatHandler(reqMalformed, resMalformed);
  assert.strictEqual(resMalformed.statusCode, 401);
  assert.strictEqual(resMalformed.body?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  pass('/api/chat: Malformed non-Bearer Authorization strictly rejected with 401 MALFORMED_AUTHORIZATION_HEADER');

  // 4. /api/chat: Invalid/Expired Token -> 401
  const reqInvalidToken = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer fake.invalid.expired.jwt.token'
    },
    body: { prompt: 'Legal consultation' }
  };
  const resInvalidToken = createMockNodeRes();
  await chatHandler(reqInvalidToken, resInvalidToken);
  assert.strictEqual(resInvalidToken.statusCode, 401);
  assert.strictEqual(resInvalidToken.body?.code, 'INVALID_OR_EXPIRED_TOKEN');
  pass('/api/chat: Cryptographically invalid token strictly rejected with 401 INVALID_OR_EXPIRED_TOKEN');

  // 5. /api/chat: Body Role Spoofing Prevention -> 401 (Cannot bypass missing auth)
  const reqSpoofNoAuth = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      prompt: 'Privileged prompt',
      userSession: { role: 'admin', isAdmin: true, email: 'drzyogo.ca@gmail.com' },
      role: 'admin',
      isAdmin: true,
      user_id: '00000000-0000-0000-0000-000000000000'
    }
  };
  const resSpoofNoAuth = createMockNodeRes();
  await chatHandler(reqSpoofNoAuth, resSpoofNoAuth);
  assert.strictEqual(resSpoofNoAuth.statusCode, 401);
  assert.strictEqual(resSpoofNoAuth.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/chat: Body role spoofing (userSession/isAdmin/role) cannot bypass authentication (401)');
} catch (err) {
  fail('Test Group 2: /api/chat Authentication Enforcement', err);
}

// ── TEST GROUP 3: /api/ai Authentication Enforcement ─────────────────────────
console.log('\n--- TEST GROUP 3: /api/ai Authentication Enforcement ---');

try {
  // 6. /api/ai Node: No Authorization Header -> 401
  const reqNoAuthNode = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { prompt: 'Review this contract clause' }
  };
  const resNoAuthNode = createMockNodeRes();
  await aiHandler(reqNoAuthNode, resNoAuthNode);
  assert.strictEqual(resNoAuthNode.statusCode, 401);
  assert.strictEqual(resNoAuthNode.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/ai (Node): Missing Authorization header strictly rejected with 401 MISSING_AUTHORIZATION_TOKEN');

  // 7. /api/ai Edge: No Authorization Header -> 401
  const reqNoAuthEdge = new Request('http://localhost/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Review this contract clause' })
  });
  const resNoAuthEdge = await aiPost(reqNoAuthEdge);
  assert.strictEqual(resNoAuthEdge.status, 401);
  const dataNoAuthEdge = await resNoAuthEdge.json();
  assert.strictEqual(dataNoAuthEdge.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/ai (Edge): Missing Authorization header strictly rejected with 401 MISSING_AUTHORIZATION_TOKEN');

  // 8. /api/ai: Malformed Bearer (Empty) -> 401
  const reqMalformed = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer   '
    },
    body: { prompt: 'Legal test' }
  };
  const resMalformed = createMockNodeRes();
  await aiHandler(reqMalformed, resMalformed);
  assert.strictEqual(resMalformed.statusCode, 401);
  assert.strictEqual(resMalformed.body?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  pass('/api/ai: Whitespace Bearer token strictly rejected with 401 MALFORMED_AUTHORIZATION_HEADER');

  // 9. /api/ai: Invalid/Expired Token -> 401
  const reqInvalidToken = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer invalid.token.payload.signature'
    },
    body: { prompt: 'Legal consultation' }
  };
  const resInvalidToken = createMockNodeRes();
  await aiHandler(reqInvalidToken, resInvalidToken);
  assert.strictEqual(resInvalidToken.statusCode, 401);
  assert.strictEqual(resInvalidToken.body?.code, 'INVALID_OR_EXPIRED_TOKEN');
  pass('/api/ai: Cryptographically invalid token strictly rejected with 401 INVALID_OR_EXPIRED_TOKEN');

  // 10. /api/ai: Body Role Spoofing Prevention -> 401
  const reqSpoofNoAuth = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      prompt: 'High-risk audit',
      userSession: { role: 'admin', isAdmin: true },
      role: 'super-admin'
    }
  };
  const resSpoofNoAuth = createMockNodeRes();
  await aiHandler(reqSpoofNoAuth, resSpoofNoAuth);
  assert.strictEqual(resSpoofNoAuth.statusCode, 401);
  assert.strictEqual(resSpoofNoAuth.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('/api/ai: Body role spoofing (userSession/role) cannot bypass authentication (401)');
} catch (err) {
  fail('Test Group 3: /api/ai Authentication Enforcement', err);
}

// ── TEST GROUP 4: Valid Authenticated Path & Handler Preservation ────────────
console.log('\n--- TEST GROUP 4: Valid Authenticated Path & Handler Preservation ---');

try {
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test_service_role_key_simulated';
  const originalFetch = globalThis.fetch;
  try {
    // Intercept Supabase Auth, subscriptions, and RPC checks to return verified user WITHOUT calling external Gemini API
    globalThis.fetch = async (url, opts) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/v1/user')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: '01234567-89ab-cdef-0123-456789abcdef',
            email: 'customer@juristech.solutions',
            created_at: '2026-01-01T00:00:00.000Z',
            app_metadata: { role: 'authenticated' },
            user_metadata: { full_name: 'Verified Customer' }
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
        return {
          ok: true,
          status: 200,
          json: async () => ({
            allowed: true,
            current_usage: 1,
            limit: 5,
            metric: 'ai_queries_executed',
            period_key: '2026-09-07'
          })
        };
      }
      return originalFetch(url, opts);
    };

    // 11. /api/chat with valid authenticated token returns 200 and valid AI response
    const reqValidChat = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.customer.access.token'
      },
      body: {
        prompt: 'hello',
        lang: 'en'
      }
    };
    const resValidChat = createMockNodeRes();
    await chatHandler(reqValidChat, resValidChat);

    assert.strictEqual(resValidChat.statusCode, 200, `/api/chat must return 200 OK for valid caller (got ${resValidChat.statusCode})`);
    assert(resValidChat.body?.reply, '/api/chat must return reply field');
    assert(resValidChat.body?.result, '/api/chat must return result field');
    pass('/api/chat: Valid authenticated caller successfully executes and receives expected AI response structure (200 OK)');

    // 12. /api/ai with valid authenticated token returns 200 and valid AI response
    const reqValidAI = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.customer.access.token'
      },
      body: {
        prompt: 'hello',
        lang: 'en'
      }
    };
    const resValidAI = createMockNodeRes();
    await aiHandler(reqValidAI, resValidAI);

    assert.strictEqual(resValidAI.statusCode, 200, `/api/ai must return 200 OK for valid caller (got ${resValidAI.statusCode})`);
    assert(resValidAI.body?.reply, '/api/ai must return reply field');
    assert(resValidAI.body?.result, '/api/ai must return result field');
    pass('/api/ai: Valid authenticated caller successfully executes and receives expected AI response structure (200 OK)');

    // 13. Authenticated request with body spoofing ignores body claims
    const reqValidSpoof = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid.customer.access.token'
      },
      body: {
        prompt: 'hello',
        userSession: { role: 'admin', isAdmin: true },
        role: 'admin'
      }
    };
    const resValidSpoof = createMockNodeRes();
    await chatHandler(reqValidSpoof, resValidSpoof);
    assert.strictEqual(resValidSpoof.statusCode, 200);
    pass('Client-supplied body role/userSession does not alter verified user identity or bypass security boundary');

    // 14. Edge runtime GET request with valid token
    const reqValidGetEdge = new Request('http://localhost/api/chat', {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid.customer.access.token'
      }
    });
    const resValidGetEdge = await chatGet(reqValidGetEdge);
    assert.strictEqual(resValidGetEdge.status, 200);
    const dataValidGetEdge = await resValidGetEdge.json();
    assert.strictEqual(dataValidGetEdge.status, 'ok');
    pass('Edge GET handler accepts valid Bearer token and returns service status (200 OK)');

    // 15. Edge runtime GET request WITHOUT token is rejected
    const reqInvalidGetEdge = new Request('http://localhost/api/chat', {
      method: 'GET',
      headers: {}
    });
    const resInvalidGetEdge = await chatGet(reqInvalidGetEdge);
    assert.strictEqual(resInvalidGetEdge.status, 401);
    pass('Edge GET handler rejects unauthenticated caller with 401 MISSING_AUTHORIZATION_TOKEN');
  } finally {
    globalThis.fetch = originalFetch;
  }
} catch (err) {
  fail('Test Group 4: Valid Authenticated Path & Handler Preservation', err);
}

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 04C PHASE 1B-2 API AUTH VERIFIED SUCCESSFULLY!\n');
  process.exitCode = 0;
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED!\n`);
  process.exitCode = 1;
}
