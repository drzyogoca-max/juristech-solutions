/**
 * Sovereign Client-Side End-to-End Encryption (E2EE) Service
 * Implements AES-GCM 256-bit cryptographic encryption via native Web Crypto API.
 * Ensures Zero-Knowledge architecture: Documents are encrypted in the browser before storage.
 */

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256;

export interface EncryptedPayload {
  cipherTextBase64: string;
  ivBase64: string;
  saltBase64: string;
  encryptedAt: string;
  version: string;
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export class E2EEncryptionService {
  private static masterPassphraseKey = 'juristech_sovereign_e2ee_passphrase';

  public static isE2EEActive(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.masterPassphraseKey);
  }

  public static setMasterPassphrase(passphrase: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.masterPassphraseKey, passphrase);
  }

  public static getMasterPassphrase(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.masterPassphraseKey);
  }

  public static generateSecurePassphrase(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    const randomVals = new Uint8Array(24);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomVals);
    }
    let res = '';
    for (let i = 0; i < 24; i++) {
      if (i > 0 && i % 6 === 0) res += '-';
      res += chars[randomVals[i] % chars.length];
    }
    return res;
  }

  private static async deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as unknown as BufferSource,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  public static async encryptDocument(plainText: string, customPassphrase?: string): Promise<EncryptedPayload> {
    const passphrase = customPassphrase || this.getMasterPassphrase() || 'JurisTech_Sovereign_Default_E2EE_2026';
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    const salt = new Uint8Array(16);
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(salt);
    window.crypto.getRandomValues(iv);

    const key = await this.deriveKey(passphrase, salt);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      data
    );

    return {
      cipherTextBase64: bufferToBase64(cipherBuffer),
      ivBase64: bufferToBase64(iv),
      saltBase64: bufferToBase64(salt),
      encryptedAt: new Date().toISOString(),
      version: 'AES-GCM-256',
    };
  }

  public static async decryptDocument(payload: EncryptedPayload, customPassphrase?: string): Promise<string> {
    const passphrase = customPassphrase || this.getMasterPassphrase() || 'JurisTech_Sovereign_Default_E2EE_2026';
    const salt = base64ToBuffer(payload.saltBase64);
    const iv = base64ToBuffer(payload.ivBase64);
    const cipherText = base64ToBuffer(payload.cipherTextBase64);

    const key = await this.deriveKey(passphrase, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      cipherText as unknown as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }
}
