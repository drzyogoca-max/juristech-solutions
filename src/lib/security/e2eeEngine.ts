/**
 * src/lib/security/e2eeEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions | AES-256-GCM End-to-End Encryption Engine
 * Implements At-Rest encryption for contracts, conversations & sensitive data
 * Uses Web Crypto API exclusively — zero external dependencies
 * Standard: AES-256-GCM (NIST SP 800-38D) | Key Derivation: PBKDF2-SHA-256
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface EncryptedPayload {
  iv: string;        // Base64 encoded 12-byte IV
  salt: string;      // Base64 encoded 16-byte salt (for derived keys)
  ciphertext: string; // Base64 encoded encrypted data
  tag?: string;      // Authentication tag (included in ciphertext for GCM)
  algorithm: 'AES-256-GCM';
  version: 1;
}

// ─── Key Generation & Derivation ─────────────────────────────────────────────

/**
 * Generate a random session encryption key (AES-256)
 */
export async function generateSessionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive a deterministic AES-256 key from user credentials using PBKDF2
 * Suitable for encrypting user-specific data that persists across sessions
 */
export async function deriveKeyFromCredentials(
  password: string,
  salt: Uint8Array,
  iterations = 100_000
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// ─── Encode / Decode Helpers ──────────────────────────────────────────────────

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// ─── Core Encryption / Decryption ────────────────────────────────────────────

/**
 * Encrypt plaintext with AES-256-GCM using a CryptoKey
 */
export async function encryptWithKey(
  plaintext: string,
  key: CryptoKey
): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encoder.encode(plaintext)
  );

  return {
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
    ciphertext: bufferToBase64(ciphertext),
    algorithm: 'AES-256-GCM',
    version: 1,
  };
}

/**
 * Decrypt an EncryptedPayload with a CryptoKey
 */
export async function decryptWithKey(
  payload: EncryptedPayload,
  key: CryptoKey
): Promise<string> {
  const iv = new Uint8Array(base64ToBuffer(payload.iv));
  const ciphertext = base64ToBuffer(payload.ciphertext);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

// ─── Session-Scoped Storage Encryption ───────────────────────────────────────

// Session key stored in memory only — never persisted
let _sessionKey: CryptoKey | null = null;

async function getOrCreateSessionKey(): Promise<CryptoKey> {
  if (!_sessionKey) {
    _sessionKey = await generateSessionKey();
  }
  return _sessionKey;
}

/**
 * Encrypt a string for localStorage storage (session-scoped key)
 * Returns a JSON string of the EncryptedPayload
 */
export async function encryptForStorage(plaintext: string): Promise<string> {
  const key = await getOrCreateSessionKey();
  const payload = await encryptWithKey(plaintext, key);
  return JSON.stringify(payload);
}

/**
 * Decrypt a string from localStorage (session-scoped key)
 * Returns null if decryption fails (wrong session, corrupted data)
 */
export async function decryptFromStorage(encryptedJson: string): Promise<string | null> {
  try {
    const key = await getOrCreateSessionKey();
    const payload: EncryptedPayload = JSON.parse(encryptedJson);
    if (payload.version !== 1 || payload.algorithm !== 'AES-256-GCM') return null;
    return await decryptWithKey(payload, key);
  } catch {
    return null;
  }
}

// ─── Contract Encryption Helpers ─────────────────────────────────────────────

/**
 * Encrypt contract text for secure At-Rest storage
 */
export async function encryptContractText(contractText: string): Promise<string> {
  return encryptForStorage(contractText);
}

/**
 * Decrypt a previously encrypted contract
 */
export async function decryptContractText(encryptedContract: string): Promise<string | null> {
  return decryptFromStorage(encryptedContract);
}

// ─── SHA-256 Hashing (for audit integrity) ───────────────────────────────────

/**
 * Generate a real SHA-256 hash of any string — for audit trail integrity
 */
export async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a tamper-evident hash for a security event
 */
export async function hashSecurityEvent(event: Record<string, unknown>): Promise<string> {
  const canonical = JSON.stringify(event, Object.keys(event).sort());
  return sha256Hash(canonical);
}
