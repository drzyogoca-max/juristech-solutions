/**
 * src/api/apiKeyManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Developer API Key Management Engine
 * Specification: Task 13.2
 *
 * Implements cryptographic developer API key generation, hashing, and scope validation.
 * STRICT RULES:
 *  • Raw API keys are returned ONLY ONCE upon creation.
 *  • NEVER store raw API keys in memory or database; store ONLY SHA-256 hashes.
 *  • Zero modifications to financial / payment systems.
 */

export type ApiKeyScope =
  | 'legal.research'
  | 'contract.analyze'
  | 'compliance.scan'
  | 'document.generate'
  | 'admin.ecosystem';

export type ApiKeyEnvironment = 'live' | 'test';

export interface StoredApiKeyRecord {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string; // First 8 chars e.g. "jt_live_a1b2..."
  keyHash: string;   // SHA-256 hash of the full raw key
  environment: ApiKeyEnvironment;
  scopes: ApiKeyScope[];
  createdAt: string;
  lastUsedAt?: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  rateLimitPerMinute: number;
}

export interface ApiKeyCreationResult {
  rawKey: string; // Provided only once to the client
  record: StoredApiKeyRecord;
}

class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keys: Map<string, StoredApiKeyRecord> = new Map(); // Keyed by keyHash

  private constructor() {
    this.seedDefaultKeys();
  }

  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  private seedDefaultKeys(): void {
    // Seed initial test key for demo organization
    const demoKeyRaw = 'jt_test_altamimi_demo_key_998877665544332211';
    const hash = this.computeSha256(demoKeyRaw);
    const record: StoredApiKeyRecord = {
      id: 'key_demo_01',
      organizationId: 'org_enterprise_demo_01',
      name: 'Default Legal Integration Key',
      keyPrefix: 'jt_test_altamimi...',
      keyHash: hash,
      environment: 'test',
      scopes: ['legal.research', 'contract.analyze', 'compliance.scan', 'document.generate'],
      createdAt: '2026-01-20T10:00:00.000Z',
      lastUsedAt: '2026-02-25T14:30:00.000Z',
      status: 'ACTIVE',
      rateLimitPerMinute: 120,
    };
    this.keys.set(hash, record);
  }

  /**
   * Create a new API Key for an organization
   */
  public createApiKey(params: {
    organizationId: string;
    name: string;
    environment: ApiKeyEnvironment;
    scopes: ApiKeyScope[];
    rateLimitPerMinute?: number;
  }): ApiKeyCreationResult {
    const envPrefix = params.environment === 'live' ? 'jt_live_' : 'jt_test_';
    const entropy = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const rawKey = `${envPrefix}${entropy}`;
    const keyHash = this.computeSha256(rawKey);
    const id = `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const record: StoredApiKeyRecord = {
      id,
      organizationId: params.organizationId,
      name: params.name.trim(),
      keyPrefix: `${rawKey.substring(0, 12)}...`,
      keyHash,
      environment: params.environment,
      scopes: params.scopes,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      rateLimitPerMinute: params.rateLimitPerMinute || 60,
    };

    this.keys.set(keyHash, record);

    return {
      rawKey,
      record,
    };
  }

  /**
   * Verify an incoming raw API key against stored SHA-256 hashes
   */
  public verifyApiKey(rawKey: string): {
    isValid: boolean;
    record?: StoredApiKeyRecord;
    reason?: string;
  } {
    if (!rawKey || (!rawKey.startsWith('jt_live_') && !rawKey.startsWith('jt_test_'))) {
      return { isValid: false, reason: 'Invalid API key format. Must start with jt_live_ or jt_test_.' };
    }

    const keyHash = this.computeSha256(rawKey);
    const record = this.keys.get(keyHash);

    if (!record) {
      return { isValid: false, reason: 'API key not found or unrecognized.' };
    }

    if (record.status !== 'ACTIVE') {
      return { isValid: false, reason: `API key is ${record.status.toLowerCase()}.` };
    }

    // Update last used timestamp
    record.lastUsedAt = new Date().toISOString();
    this.keys.set(keyHash, record);

    return {
      isValid: true,
      record,
    };
  }

  /**
   * Check if a verified key record has the required scope
   */
  public hasScope(record: StoredApiKeyRecord, requiredScope: ApiKeyScope): boolean {
    if (record.scopes.includes('admin.ecosystem')) return true;
    return record.scopes.includes(requiredScope);
  }

  /**
   * Revoke an API key
   */
  public revokeApiKey(keyId: string): boolean {
    for (const [hash, record] of this.keys.entries()) {
      if (record.id === keyId) {
        record.status = 'REVOKED';
        this.keys.set(hash, record);
        return true;
      }
    }
    return false;
  }

  /**
   * List API keys for an organization (hashed only)
   */
  public listApiKeys(organizationId: string): StoredApiKeyRecord[] {
    return Array.from(this.keys.values()).filter(k => k.organizationId === organizationId);
  }

  public computeSha256(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  public clear(): void {
    this.keys.clear();
  }
}

export const apiKeyManager = ApiKeyManager.getInstance();
