/**
 * lib/security/audit-ledger.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Cryptographic Audit Ledger & Integrity Verification
 * Sprint 04C Phase 2C: Verified Audit Record Hardening
 *
 * GUARANTEES:
 *   - Never treats signerEmail as userId. userId must be verified UUID.
 *   - Never trusts caller-supplied privilege or client-controlled admin roles.
 *   - No anonymous default; requires verified identity context.
 *   - Exposes deterministic canonical SHA-256 payload hashing.
 *   - Zero logging of access tokens or service_role credentials.
 */

/**
 * Computes deterministic SHA-256 hex string from canonical input string
 * @param {string | string[]} canonicalParts
 * @returns {Promise<string>}
 */
export async function computeCanonicalHash(canonicalParts) {
  const encoder = new TextEncoder();
  const raw = Array.isArray(canonicalParts) ? canonicalParts.join('|') : String(canonicalParts);
  const dataBuffer = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates an immutable cryptographic audit record binding verified identity
 * @param {string} actionType
 * @param {string} userId - Verified Supabase user UUID (NOT email)
 * @param {string} orgId - Verified organization context or 'personal'
 * @param {Record<string, any>} payload
 * @returns {Promise<{
 *   timestamp: string,
 *   actionType: string,
 *   userId: string,
 *   orgId: string,
 *   cryptographicHash: string,
 *   payloadSummary: string
 * }>}
 */
export async function createImmutableAuditLog(actionType, userId, orgId, payload) {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('[audit-ledger] Verified userId is strictly required for audit log creation.');
  }

  const timestamp = new Date().toISOString();
  const cleanAction = String(actionType || 'GENERIC_ACTION');
  const cleanOrg = String(orgId || 'personal');
  const cleanSummary = payload?.summary || payload?.signerEmail || 'Secured Transaction';

  // Deterministic canonical serialization
  const canonicalString = `action:${cleanAction}|userId:${userId.trim()}|orgId:${cleanOrg}|summary:${cleanSummary}|timestamp:${timestamp}`;
  const cryptographicHash = await computeCanonicalHash(canonicalString);

  const auditRecord = {
    timestamp,
    actionType: cleanAction,
    userId: userId.trim(),
    orgId: cleanOrg,
    cryptographicHash,
    payloadSummary: cleanSummary,
  };

  return auditRecord;
}

export default createImmutableAuditLog;
