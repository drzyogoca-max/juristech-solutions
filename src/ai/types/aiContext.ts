/**
 * src/ai/types/aiContext.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical AI Core Request & Provenance Context Interface
 * Sprint 01 Foundation (Phase 9F)
 *
 * Provides a standardized context contract for all current and future AI pipelines:
 * AI Request → User/Org Context → Jurisdiction Context → Model Execution → Provenance & Audit
 */

import { SaaSRole } from '../../types/saas';
import { SupportedLanguage } from '../../i18n';

export interface AIRequestContext {
  /** Authenticated user initiating request */
  userId: string;
  /** Active tenant organization ID */
  organizationId?: string;
  /** Active departmental workspace ID */
  workspaceId?: string;
  /** Canonical RBAC role of requesting user */
  role: SaaSRole;
  /** Country / Jurisdiction code (e.g., 'SA', 'AE', 'EG', 'US', 'GLOBAL') */
  jurisdiction: string;
  /** Request / Response language locale */
  locale: SupportedLanguage;
  /** Optional persistent session ID */
  sessionId?: string;
  /** Unique request trace identifier */
  requestId: string;
  /** ISO timestamp */
  timestamp: string;
}

export interface AIProvenanceMetadata {
  /** Formal statutory and regulatory citations invoked */
  statutoryCitations: string[];
  /** Calculated statistical confidence (0.0 to 1.0) */
  confidenceScore: number;
  /** Verification and reproducibility hash */
  traceabilityHash: string;
  /** AI Core model and engine version */
  engineVersion: string;
  /** Hallucination Guard verification flag */
  isGroundingVerified: boolean;
}

export interface AIAuditRecord {
  requestId: string;
  userId: string;
  organizationId?: string;
  workspaceId?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  timestamp: string;
}

export interface AIExecutionEnvelope<T = unknown> {
  success: boolean;
  data: T;
  provenance: AIProvenanceMetadata;
  audit: AIAuditRecord;
  error?: string;
}
