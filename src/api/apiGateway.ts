/**
 * src/api/apiGateway.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise API Gateway
 * Specification: Task 13.1
 *
 * Sovereign institutional API router supporting:
 *  • /v1/legal/research
 *  • /v1/contracts/audit
 *  • /v1/compliance/verify
 *  • /v1/documents/draft
 *
 * Features:
 *  • Cryptographic API Key Verification (SHA-256)
 *  • Granular Scope Enforcement
 *  • Token-Bucket Rate Limiting
 *  • Tenant Isolation & Quota Checking
 *  • Latency Metering & Error Sanitization
 */

import { apiKeyManager, ApiKeyScope } from './apiKeyManager';
import { quotaManager, QuotaMetricType } from '../enterprise/quotaManager';
import { aiGovernanceCenter } from '../ai/governance/aiGovernanceCenter';
import { enterpriseAuditEngine } from '../audit/enterpriseAuditEngine';
import type { JurisdictionCode } from '../ai/types';

export interface ApiGatewayRequest {
  endpoint: '/v1/legal/research' | '/v1/contracts/audit' | '/v1/compliance/verify' | '/v1/documents/draft';
  apiKey: string;
  payload: {
    jurisdiction?: JurisdictionCode;
    query?: string;
    clauseText?: string;
    contractType?: string;
    documentType?: string;
    parameters?: Record<string, unknown>;
  };
}

export interface ApiGatewayResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
    organizationId?: string;
    endpoint: string;
    latencyMs: number;
    rateLimitRemaining: number;
    quotaRemaining: number;
    timestamp: string;
  };
}

interface RateLimitTracker {
  count: number;
  windowStart: number;
}

class ApiGateway {
  private static instance: ApiGateway;
  private rateLimiters: Map<string, RateLimitTracker> = new Map(); // Keyed by keyHash

  private constructor() {}

  public static getInstance(): ApiGateway {
    if (!ApiGateway.instance) {
      ApiGateway.instance = new ApiGateway();
    }
    return ApiGateway.instance;
  }

  /**
   * Process and route an enterprise external API request
   */
  public async handleRequest(req: ApiGatewayRequest): Promise<ApiGatewayResponse> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Authenticate API Key
    const authCheck = apiKeyManager.verifyApiKey(req.apiKey);
    if (!authCheck.isValid || !authCheck.record) {
      return {
        success: false,
        statusCode: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: authCheck.reason || 'Invalid or missing API key.',
        },
        meta: {
          requestId,
          endpoint: req.endpoint,
          latencyMs: Date.now() - startTime,
          rateLimitRemaining: 0,
          quotaRemaining: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }

    const keyRecord = authCheck.record;
    const orgId = keyRecord.organizationId;

    // 2. Check Rate Limit (Sliding Window per Minute)
    const rateLimit = this.checkRateLimit(keyRecord.keyHash, keyRecord.rateLimitPerMinute);
    if (!rateLimit.allowed) {
      return {
        success: false,
        statusCode: 429,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Limit: ${keyRecord.rateLimitPerMinute} requests per minute.`,
        },
        meta: {
          requestId,
          organizationId: orgId,
          endpoint: req.endpoint,
          latencyMs: Date.now() - startTime,
          rateLimitRemaining: 0,
          quotaRemaining: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 3. Map endpoint to required scope & quota metric
    const { requiredScope, quotaMetric } = this.getEndpointRequirements(req.endpoint);

    // 4. Verify Scope Permissions
    if (!apiKeyManager.hasScope(keyRecord, requiredScope)) {
      return {
        success: false,
        statusCode: 403,
        error: {
          code: 'FORBIDDEN_SCOPE',
          message: `API Key lacks required scope: '${requiredScope}'.`,
        },
        meta: {
          requestId,
          organizationId: orgId,
          endpoint: req.endpoint,
          latencyMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          quotaRemaining: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 5. Tenant Isolation & Quota Metering
    const quotaCheck = quotaManager.checkQuota(orgId, quotaMetric, 1);
    if (!quotaCheck.allowed) {
      return {
        success: false,
        statusCode: 402,
        error: {
          code: 'QUOTA_EXCEEDED',
          message: quotaCheck.reason || 'Organization AI usage quota exceeded.',
        },
        meta: {
          requestId,
          organizationId: orgId,
          endpoint: req.endpoint,
          latencyMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          quotaRemaining: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 6. Enterprise Governance Gate Evaluation
    const govEvaluation = aiGovernanceCenter.evaluateRequest({
      organizationId: orgId,
      jurisdiction: req.payload.jurisdiction,
    });

    if (!govEvaluation.allowed) {
      return {
        success: false,
        statusCode: 400,
        error: {
          code: govEvaluation.violationType || 'GOVERNANCE_POLICY_VIOLATION',
          message: govEvaluation.reason || 'Operation prohibited by enterprise AI governance policy.',
        },
        meta: {
          requestId,
          organizationId: orgId,
          endpoint: req.endpoint,
          latencyMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          quotaRemaining: quotaCheck.remaining,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 7. Consume Quota & Audit Event
    quotaManager.consumeQuota(orgId, quotaMetric, 1);
    quotaManager.consumeQuota(orgId, 'monthlyRequests', 1);

    await enterpriseAuditEngine.logEvent({
      organizationId: orgId,
      event: 'AI_REQUEST',
      actor: `api_key:${keyRecord.keyPrefix}`,
      summary: `API Gateway routed call to ${req.endpoint} for jurisdiction ${req.payload.jurisdiction || 'SA'}`,
    });

    // 8. Return Sanitized Successful API Response
    const executionData = this.mockExecuteEndpoint(req.endpoint, req.payload);

    return {
      success: true,
      statusCode: 200,
      data: executionData,
      meta: {
        requestId,
        organizationId: orgId,
        endpoint: req.endpoint,
        latencyMs: Date.now() - startTime,
        rateLimitRemaining: rateLimit.remaining,
        quotaRemaining: quotaCheck.remaining - 1,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private checkRateLimit(keyHash: string, limitPerMinute: number): { allowed: boolean; remaining: number } {
    const now = Date.now();
    let tracker = this.rateLimiters.get(keyHash);

    if (!tracker || now - tracker.windowStart > 60000) {
      tracker = { count: 1, windowStart: now };
      this.rateLimiters.set(keyHash, tracker);
      return { allowed: true, remaining: limitPerMinute - 1 };
    }

    if (tracker.count >= limitPerMinute) {
      return { allowed: false, remaining: 0 };
    }

    tracker.count += 1;
    this.rateLimiters.set(keyHash, tracker);
    return { allowed: true, remaining: Math.max(0, limitPerMinute - tracker.count) };
  }

  private getEndpointRequirements(endpoint: ApiGatewayRequest['endpoint']): {
    requiredScope: ApiKeyScope;
    quotaMetric: QuotaMetricType;
  } {
    switch (endpoint) {
      case '/v1/legal/research':
        return { requiredScope: 'legal.research', quotaMetric: 'monthlyRequests' };
      case '/v1/contracts/audit':
        return { requiredScope: 'contract.analyze', quotaMetric: 'contractAnalyses' };
      case '/v1/compliance/verify':
        return { requiredScope: 'compliance.scan', quotaMetric: 'complianceScans' };
      case '/v1/documents/draft':
        return { requiredScope: 'document.generate', quotaMetric: 'documentsGenerated' };
    }
  }

  private mockExecuteEndpoint(endpoint: string, payload: ApiGatewayRequest['payload']): Record<string, unknown> {
    return {
      status: 'COMPLETED',
      jurisdiction: payload.jurisdiction || 'SA',
      grounded: true,
      citationCount: 3,
      statutoryAnchors: ['Saudi Civil Transactions Law (Royal Decree M/191)'],
      timestamp: new Date().toISOString(),
    };
  }

  public clear(): void {
    this.rateLimiters.clear();
  }
}

export const apiGateway = ApiGateway.getInstance();
