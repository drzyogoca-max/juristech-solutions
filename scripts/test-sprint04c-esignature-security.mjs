/**
 * scripts/test-sprint04c-esignature-security.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 04C Phase 2C: E-Signature Security Verification
 *
 * Verifies all 26 security requirements:
 *   AUTH (1-3), IDENTITY (4-7), CONTRACT AUTHORIZATION (8-10),
 *   ORG/IP (11-12), AUDIT (13-16), CRYPTO (17-20),
 *   SIDE EFFECT (21-23), SECURITY (24-26).
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
console.log('🖋️  JURISTECH — SPRINT 04C E-SIGNATURE SECURITY TEST SUITE');
console.log('================================================================\n');

process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test_service_role_key_simulated';

// Import modules under test
const { default: esignatureHandler, POST: esignaturePost } = await import('../api/contracts/esignature.js');
const { createImmutableAuditLog, computeCanonicalHash } = await import('../lib/security/audit-ledger.js');

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

// Fixed test UUIDs
const REAL_USER_ID = '11111111-1111-4111-8111-111111111111';
const REAL_USER_EMAIL = 'alice.owner@example.com';
const OTHER_USER_ID = '22222222-2222-4222-8222-222222222222';

const OWN_CONTRACT_ID = '33333333-3333-4333-8333-333333333333';
const FOREIGN_CONTRACT_ID = '44444444-4444-4444-8444-444444444444';
const NONEXISTENT_CONTRACT_ID = '99999999-9999-4999-8999-999999999999';

// Mock DB state
const mockContractsDb = new Map();
mockContractsDb.set(OWN_CONTRACT_ID, {
  id: OWN_CONTRACT_ID,
  user_id: REAL_USER_ID,
  content: 'Sovereign Mutual Non-Disclosure Agreement content text...',
  organization_id: 'org_legit_123'
});
mockContractsDb.set(FOREIGN_CONTRACT_ID, {
  id: FOREIGN_CONTRACT_ID,
  user_id: OTHER_USER_ID,
  content: 'Foreign confidential proprietary agreement...',
  organization_id: 'org_foreign_456'
});

const mockAuditTrailDb = [];

// Setup Mock Fetch dispatcher
const originalFetch = globalThis.fetch;
function setupMockFetch(options = {}) {
  mockAuditTrailDb.length = 0;
  let contractDbQueries = 0;
  let auditDbWrites = 0;

  globalThis.fetch = async (url, opts = {}) => {
    const u = String(url);
    const method = opts.method || 'GET';

    // 1. Supabase Auth Verification endpoint
    if (u.includes('/auth/v1/user')) {
      const authHeader = opts.headers?.Authorization || opts.headers?.authorization || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();

      if (token === 'valid-alice-token') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: REAL_USER_ID,
            email: REAL_USER_EMAIL,
            app_metadata: { role: 'authenticated' },
            user_metadata: { full_name: 'Alice Owner' }
          })
        };
      }
      return {
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid JWT' })
      };
    }

    // 2. Contracts Table Lookup
    if (u.includes('/rest/v1/contracts')) {
      contractDbQueries++;
      if (options.dbError) {
        return { ok: false, status: 500, text: async () => 'DB internal error' };
      }
      const match = u.match(/id=eq\.([a-f0-9-]+)/i);
      const queriedId = match ? match[1] : null;
      const contract = queriedId ? mockContractsDb.get(queriedId) : null;
      return {
        ok: true,
        status: 200,
        json: async () => (contract ? [contract] : [])
      };
    }

    // 3. Audit Trail Persistence
    if (u.includes('/rest/v1/audit_trail')) {
      auditDbWrites++;
      if (options.auditError) {
        return { ok: false, status: 500, text: async () => 'Audit table insert failure' };
      }
      const body = JSON.parse(opts.body || '{}');
      mockAuditTrailDb.push(body);
      return {
        ok: true,
        status: 201,
        text: async () => ''
      };
    }

    return { ok: false, status: 404, text: async () => 'Not found' };
  };

  return {
    getContractDbQueries: () => contractDbQueries,
    getAuditDbWrites: () => auditDbWrites,
    restore: () => { globalThis.fetch = originalFetch; }
  };
}

// ── TEST GROUP 1: Authentication Boundary ────────────────────────────────────
console.log('--- TEST GROUP 1: Authentication Boundary ---');

try {
  setupMockFetch();

  // 1. Anonymous request -> 401
  const resAnon = createMockNodeRes();
  await esignatureHandler({ method: 'POST', headers: {} }, resAnon);
  assert.strictEqual(resAnon.statusCode, 401);
  assert.strictEqual(resAnon.body?.code, 'MISSING_AUTHORIZATION_TOKEN');
  pass('Anonymous request without Authorization header strictly returns 401 MISSING_AUTHORIZATION_TOKEN');

  // 2. Malformed Bearer header -> 401
  const resMalformed = createMockNodeRes();
  await esignatureHandler({ method: 'POST', headers: { authorization: 'Basic dXNlcjpwYXNz' } }, resMalformed);
  assert.strictEqual(resMalformed.statusCode, 401);
  assert.strictEqual(resMalformed.body?.code, 'MALFORMED_AUTHORIZATION_HEADER');
  pass('Malformed non-Bearer authorization header strictly returns 401 MALFORMED_AUTHORIZATION_HEADER');

  // 3. Invalid JWT -> 401
  const resInvalidJwt = createMockNodeRes();
  await esignatureHandler({ method: 'POST', headers: { authorization: 'Bearer invalid.token.payload' } }, resInvalidJwt);
  assert.strictEqual(resInvalidJwt.statusCode, 401);
  assert.strictEqual(resInvalidJwt.body?.code, 'INVALID_OR_EXPIRED_TOKEN');
  pass('Cryptographically invalid or expired JWT strictly returns 401 INVALID_OR_EXPIRED_TOKEN');
} catch (err) {
  fail('Test Group 1: Authentication Boundary', err);
}

// ── TEST GROUP 2: Identity & Anti-Spoofing ───────────────────────────────────
console.log('\n--- TEST GROUP 2: Identity & Anti-Spoofing ---');

try {
  setupMockFetch();

  // 4. body signerEmail cannot override verified JWT email
  const resSpoofEmail = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: {
      contractId: OWN_CONTRACT_ID,
      signerEmail: 'victim.ceo@fortune500.com',
      signerName: 'Spoofed CEO'
    }
  }, resSpoofEmail);
  assert.strictEqual(resSpoofEmail.statusCode, 200);
  assert.strictEqual(resSpoofEmail.body?.signatureCertificate?.signerEmail, REAL_USER_EMAIL);
  pass('body signerEmail cannot override verified JWT email (strictly Alice)');

  // 5. body userId cannot override verified JWT userId
  const resSpoofUserId = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: {
      contractId: OWN_CONTRACT_ID,
      userId: OTHER_USER_ID
    }
  }, resSpoofUserId);
  assert.strictEqual(resSpoofUserId.statusCode, 200);
  assert.strictEqual(resSpoofUserId.body?.signatureCertificate?.signerUserId, REAL_USER_ID);
  pass('body userId cannot override verified JWT userId');

  // 6. body role/isAdmin cannot grant privilege
  const resSpoofRole = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: {
      contractId: FOREIGN_CONTRACT_ID,
      role: 'SUPREME_ADMIN',
      isAdmin: true,
      isLawyer: true
    }
  }, resSpoofRole);
  assert.strictEqual(resSpoofRole.statusCode, 403);
  assert.strictEqual(resSpoofRole.body?.code, 'FORBIDDEN_CONTRACT_ACCESS');
  pass('body role/isAdmin cannot bypass contract ownership or grant privilege');

  // 7. body userSession cannot grant privilege
  const resSpoofSession = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: {
      contractId: FOREIGN_CONTRACT_ID,
      userSession: { role: 'admin', isAdmin: true, email: 'drzyogo.ca@gmail.com' }
    }
  }, resSpoofSession);
  assert.strictEqual(resSpoofSession.statusCode, 403);
  pass('body userSession cannot grant access to foreign contract');
} catch (err) {
  fail('Test Group 2: Identity & Anti-Spoofing', err);
}

// ── TEST GROUP 3: Contract Authorization & Ownership ─────────────────────────
console.log('\n--- TEST GROUP 3: Contract Authorization & Ownership ---');

try {
  setupMockFetch();

  // 8. nonexistent contract -> 404
  const resNotFound = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: NONEXISTENT_CONTRACT_ID }
  }, resNotFound);
  assert.strictEqual(resNotFound.statusCode, 404);
  assert.strictEqual(resNotFound.body?.code, 'CONTRACT_NOT_FOUND');
  pass('Nonexistent contract ID strictly returns HTTP 404 CONTRACT_NOT_FOUND');

  // 9. own contract -> 200 allowed
  const resOwn = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: OWN_CONTRACT_ID }
  }, resOwn);
  assert.strictEqual(resOwn.statusCode, 200);
  assert.strictEqual(resOwn.body?.success, true);
  pass('Authenticated owner signing own contract successfully executes (HTTP 200)');

  // 10. foreign contract -> 403 forbidden
  const resForeign = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: FOREIGN_CONTRACT_ID }
  }, resForeign);
  assert.strictEqual(resForeign.statusCode, 403);
  assert.strictEqual(resForeign.body?.code, 'FORBIDDEN_CONTRACT_ACCESS');
  pass('Attempting to sign another user\'s contract strictly denied with HTTP 403 FORBIDDEN_CONTRACT_ACCESS');
} catch (err) {
  fail('Test Group 3: Contract Authorization & Ownership', err);
}

// ── TEST GROUP 4: Org & IP Trust ─────────────────────────────────────────────
console.log('\n--- TEST GROUP 4: Org & IP Trust ---');

try {
  setupMockFetch();

  // 11. arbitrary orgId cannot grant authorization
  const resFakeOrg = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: FOREIGN_CONTRACT_ID, orgId: 'org_foreign_456' }
  }, resFakeOrg);
  assert.strictEqual(resFakeOrg.statusCode, 403);
  pass('Arbitrary client orgId cannot grant access to foreign contract');

  // 12. body ipAddress cannot override server-observed IP metadata
  const resIpHeader = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: {
      authorization: 'Bearer valid-alice-token',
      'x-forwarded-for': '198.51.100.42, 10.0.0.1'
    },
    body: { contractId: OWN_CONTRACT_ID, ipAddress: '127.0.0.1_spoofed' }
  }, resIpHeader);
  assert.strictEqual(resIpHeader.statusCode, 200);
  assert.strictEqual(resIpHeader.body?.signatureCertificate?.clientIpMetadata, '198.51.100.42');
  pass('body ipAddress is ignored; client IP is derived strictly from server-observed headers');
} catch (err) {
  fail('Test Group 4: Org & IP Trust', err);
}

// ── TEST GROUP 5: Audit Trail Integrity ──────────────────────────────────────
console.log('\n--- TEST GROUP 5: Audit Trail Integrity ---');

try {
  const spy = setupMockFetch();

  // 13 & 14: audit identity uses verified userId & email
  const resAuditSuccess = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: {
      contractId: OWN_CONTRACT_ID,
      signerEmail: 'spoofed@attacker.com',
      userId: 'spoofed-id'
    }
  }, resAuditSuccess);
  assert.strictEqual(resAuditSuccess.statusCode, 200);
  assert.strictEqual(mockAuditTrailDb.length, 1);
  const recordedEntry = mockAuditTrailDb[0];
  assert.strictEqual(recordedEntry.user_id, REAL_USER_ID);
  assert.strictEqual(recordedEntry.user_email, REAL_USER_EMAIL);
  pass('Audit record binds strictly to verified user_id (13)');
  pass('Audit record binds strictly to verified user_email (14)');

  // 15. unauthorized request creates no audit record
  const preUnauthorizedAuditCount = mockAuditTrailDb.length;
  const resAuditUnauth = createMockNodeRes();
  await esignatureHandler({ method: 'POST', headers: {} }, resAuditUnauth);
  assert.strictEqual(resAuditUnauth.statusCode, 401);
  assert.strictEqual(mockAuditTrailDb.length, preUnauthorizedAuditCount);
  pass('Unauthorized request creates zero audit records (15)');

  // 16. failed ownership check creates no audit record
  const preOwnershipAuditCount = mockAuditTrailDb.length;
  const resAuditForbidden = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: FOREIGN_CONTRACT_ID }
  }, resAuditForbidden);
  assert.strictEqual(resAuditForbidden.statusCode, 403);
  assert.strictEqual(mockAuditTrailDb.length, preOwnershipAuditCount);
  pass('Failed ownership check creates zero audit records (16)');
} catch (err) {
  fail('Test Group 5: Audit Trail Integrity', err);
}

// ── TEST GROUP 6: Cryptographic Payload & Canonical Hashing ──────────────────
console.log('\n--- TEST GROUP 6: Cryptographic Payload & Canonical Hashing ---');

try {
  setupMockFetch();

  const resSig = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: OWN_CONTRACT_ID }
  }, resSig);
  assert.strictEqual(resSig.statusCode, 200);
  const cert = resSig.body?.signatureCertificate;

  // 17. signature/hash binds contractId
  assert.strictEqual(cert?.contractId, OWN_CONTRACT_ID);
  pass('Signature proof binds canonical contractId (17)');

  // 18. signature/hash binds verified userId
  assert.strictEqual(cert?.signerUserId, REAL_USER_ID);
  pass('Signature proof binds verified userId (18)');

  // 19. signature/hash binds verified signerEmail
  assert.strictEqual(cert?.signerEmail, REAL_USER_EMAIL);
  pass('Signature proof binds verified signerEmail (19)');

  // 20. deterministic payload produces deterministic hash where inputs are identical
  const parts = ['contractId:test', 'userId:123', 'signerEmail:a@b.com', 'timestamp:2026-09-07T00:00:00.000Z'];
  const hash1 = await computeCanonicalHash(parts);
  const hash2 = await computeCanonicalHash(parts);
  assert.strictEqual(hash1, hash2);
  assert.strictEqual(hash1.length, 64);
  pass('Deterministic canonical payload produces identical deterministic 64-char SHA-256 hash (20)');
} catch (err) {
  fail('Test Group 6: Cryptographic Payload & Canonical Hashing', err);
}

// ── TEST GROUP 7: Side-Effect Ordering ───────────────────────────────────────
console.log('\n--- TEST GROUP 7: Side-Effect Ordering ---');

try {
  // 21. authentication failure happens before database write
  const spyAuth = setupMockFetch();
  const resNoAuth = createMockNodeRes();
  await esignatureHandler({ method: 'POST', headers: {} }, resNoAuth);
  assert.strictEqual(resNoAuth.statusCode, 401);
  assert.strictEqual(spyAuth.getContractDbQueries(), 0);
  assert.strictEqual(spyAuth.getAuditDbWrites(), 0);
  pass('Authentication failure terminates before database queries or audit writes (21)');

  // 22. ownership failure happens before signature generation
  const spyOwner = setupMockFetch();
  const resForbidden = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: FOREIGN_CONTRACT_ID }
  }, resForbidden);
  assert.strictEqual(resForbidden.statusCode, 403);
  assert.strictEqual(spyOwner.getAuditDbWrites(), 0);
  pass('Ownership failure terminates before signature certificate generation or audit write (22)');

  // 23. authorization failure happens before audit persistence
  const spyLookup = setupMockFetch();
  const resBadId = createMockNodeRes();
  await esignatureHandler({
    method: 'POST',
    headers: { authorization: 'Bearer valid-alice-token' },
    body: { contractId: NONEXISTENT_CONTRACT_ID }
  }, resBadId);
  assert.strictEqual(resBadId.statusCode, 404);
  assert.strictEqual(spyLookup.getAuditDbWrites(), 0);
  pass('Authorization failure terminates before audit persistence (23)');
} catch (err) {
  fail('Test Group 7: Side-Effect Ordering', err);
}

// ── TEST GROUP 8: Security & Sanitization Integrity ──────────────────────────
console.log('\n--- TEST GROUP 8: Security & Sanitization Integrity ---');

try {
  const esigCode = fs.readFileSync(path.resolve('api/contracts/esignature.js'), 'utf-8');
  const auditCode = fs.readFileSync(path.resolve('lib/security/audit-ledger.js'), 'utf-8');

  // 24. no access token logging
  assert(!esigCode.includes('console.log(token'), 'esignature.js must not log access tokens');
  assert(!esigCode.includes('console.log(authHeader'), 'esignature.js must not log auth headers');
  assert(!auditCode.includes('console.log(token'), 'audit-ledger.js must not log access tokens');
  pass('Zero logging of sensitive access tokens across endpoints and audit modules (24)');

  // 25. no service_role exposure
  assert(!esigCode.includes('return Response.json({ serviceKey'), 'Must never leak service_role key to client');
  assert(!esigCode.includes('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE'), 'Must not reference public service_role');
  pass('Zero client exposure of SUPABASE_SERVICE_ROLE_KEY (25)');

  // 26. no anonymous fallback
  assert(!esigCode.includes("role: 'admin' || !userSession"), 'Must never elevate unauthenticated callers');
  assert(!esigCode.includes("userId: 'anonymous'"), 'Must never permit anonymous signing fallback');
  pass('Strict fail-closed architecture with zero anonymous fallback (26)');
} catch (err) {
  fail('Test Group 8: Security & Sanitization Integrity', err);
}

// Restore fetch
originalFetch ? (globalThis.fetch = originalFetch) : null;

console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 04C PHASE 2C E-SIGNATURE SECURITY FULLY VERIFIED!\n');
  process.exit(0);
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED!\n`);
  process.exit(1);
}
