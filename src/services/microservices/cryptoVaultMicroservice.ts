/**
 * src/services/microservices/cryptoVaultMicroservice.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Autonomous Crypto Vault Microservice Module
 *
 * Microservices Architecture Domain: Security, AES-256 E2EE & Document Vault
 * Provides isolated WebCrypto AES-256-GCM encryption and decryption.
 */

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  algorithm: 'AES-256-GCM';
  timestamp: string;
}

class CryptoVaultMicroservice {
  private masterKeyStr = 'JURISTECH-MICROSERVICE-E2EE-MASTER-KEY';

  /**
   * Encrypt plaintext string using WebCrypto AES-256-GCM
   */
  public async encrypt(plaintext: string, secretKey = this.masterKeyStr): Promise<EncryptedPayload> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretKey.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      keyMaterial,
      enc.encode(plaintext)
    );

    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const cipherHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');

    return {
      ciphertext: cipherHex,
      iv: ivHex,
      algorithm: 'AES-256-GCM',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Decrypt AES-256-GCM payload
   */
  public async decrypt(cipherHex: string, ivHex: string, secretKey = this.masterKeyStr): Promise<string> {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretKey.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const encrypted = new Uint8Array(cipherHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      keyMaterial,
      encrypted
    );

    return dec.decode(decrypted);
  }
}

export const cryptoVaultMicroservice = new CryptoVaultMicroservice();
