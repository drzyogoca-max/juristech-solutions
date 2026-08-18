/**
 * src/lib/security/totpEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions | Real TOTP Engine — RFC 6238 Compliant
 * Uses Web Crypto API only — zero external dependencies
 * Compatible with: Google Authenticator, Authy, Microsoft Authenticator
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Base32 Encoding/Decoding (RFC 4648) ──────────────────────────────────────

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer: Uint8Array): string {
  let result = '';
  let bits = 0;
  let value = 0;

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) result += BASE32_CHARS[(value << (5 - bits)) & 31];
  return result;
}

function base32Decode(encoded: string): Uint8Array {
  const clean = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of clean) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

// ─── HOTP (HMAC-based OTP) — Core Algorithm ──────────────────────────────────

async function generateHOTP(secret: string, counter: number): Promise<string> {
  const keyBytes = base32Decode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  // Counter as 8-byte big-endian
  const counterBuffer = new ArrayBuffer(8);
  const view = new DataView(counterBuffer);
  view.setUint32(4, counter >>> 0, false);
  view.setUint32(0, Math.floor(counter / 0x100000000) >>> 0, false);

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
  const hmac = new Uint8Array(signature);

  // Dynamic truncation (RFC 4226)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (code % 1_000_000).toString().padStart(6, '0');
}

// ─── TOTP — Time-Based OTP (RFC 6238) ────────────────────────────────────────

const TOTP_STEP = 30; // seconds per time step
const TOTP_WINDOW = 1; // allow ±1 step for clock drift

/**
 * Generate a cryptographically secure TOTP secret (160-bit / 20 bytes)
 */
export function generateTOTPSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}

/**
 * Verify a TOTP token against a secret with time window tolerance
 */
export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  if (!token || !/^\d{6}$/.test(token.trim())) return false;

  const currentStep = Math.floor(Date.now() / 1000 / TOTP_STEP);

  for (let delta = -TOTP_WINDOW; delta <= TOTP_WINDOW; delta++) {
    const expected = await generateHOTP(secret, currentStep + delta);
    if (expected === token.trim()) return true;
  }
  return false;
}

/**
 * Get the current TOTP token for a secret (for testing/display)
 */
export async function getCurrentTOTP(secret: string): Promise<string> {
  const step = Math.floor(Date.now() / 1000 / TOTP_STEP);
  return generateHOTP(secret, step);
}

/**
 * Generate OTP URI for QR code (Google Authenticator compatible)
 */
export function generateOTPAuthURI(
  secret: string,
  email: string,
  issuer = 'JurisTech Solutions'
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generate 8 one-time backup codes (alphanumeric, 8 chars each)
 */
export function generateBackupCodes(): string[] {
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars
  return Array.from({ length: 8 }, () =>
    Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(b => CHARS[b % CHARS.length])
      .join('')
  );
}

/**
 * Generate a 6-digit email OTP (numeric, expires after use)
 */
export function generateEmailOTP(): string {
  const array = crypto.getRandomValues(new Uint32Array(1));
  return (100000 + (array[0] % 900000)).toString();
}

/**
 * Hash a backup code for safe storage comparison
 */
export async function hashBackupCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code.toUpperCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
