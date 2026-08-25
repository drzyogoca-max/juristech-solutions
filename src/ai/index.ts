/**
 * src/ai/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Legal AI Master Subsystem Entry Point (Facade Layer)
 * Specification: JURISTECH-AI-P0
 *
 * Exposes a structured, modular interface to all legal AI capabilities:
 * - AI Core (Orchestrator, Context Manager, Response Validator, Legal Orchestrator)
 * - Agents (Legal Research, Contract, Compliance, Document, Enterprise, Contract Risk)
 * - Retrieval & Citations (Semantic Search, Source Ranking, Citation Engine)
 * - Session Memory (SessionStorage & In-memory multi-turn deduplication)
 * - Security & Quality (Privacy Guard, PII Sanitizer, Hallucination Guard, Access Control, Tier Guard)
 * - SEO AI Foundation (Draft-only FAQs and localized metadata)
 */

// ── Shared Types ─────────────────────────────────────────────────────────────
export * from './types';

// ── AI Core Layer ────────────────────────────────────────────────────────────
export { AIOrchestrator, aiOrchestrator } from './aiCore/orchestrator';
export { executeLegalQuery } from './aiCore/legalOrchestrator';
export { SYSTEM_LEGAL_PROMPTS, buildLegalContextPrompt } from './aiCore/promptTemplates';
export { ContextManager, contextManager } from './aiCore/contextManager';
export { ResponseValidator, type ValidationReport } from './aiCore/responseValidator';

// ── Specialized Agents ───────────────────────────────────────────────────────
export { LegalResearchAgent, type LegalResearchResult } from './agents/legalResearchAgent';
export { ContractAgent } from './agents/contractAgent';
export { auditContractText, type ContractAuditResult, type ClauseAuditItem } from './agents/contractRiskAgent';
export { generateLegalDocument } from './agents/docGenerationAgent';
export { ComplianceAgent, runComplianceAudit } from './agents/complianceAgent';
export { DocumentAgent } from './agents/documentAgent';
export { DocumentGenerator, type DocumentGenerationOptions } from './generation/documentGenerator';
export { EnterpriseAgent, type EnterpriseComparativeReport } from './agents/enterpriseAgent';

// ── Retrieval, Ranking & Citations ───────────────────────────────────────────
export {
  semanticSearch,
  detectJurisdictionFromQuery,
  detectLegalDomain,
  type SemanticSearchResult,
} from './retrieval/semanticSearch';
export {
  rankSources,
  deduplicateSources,
  type RankedSource,
} from './retrieval/sourceRanking';
export {
  formatCitation,
  buildCitations,
  formatCitationBlock,
  isCitationVerified,
  linkClaimsToCitations,
  SOURCE_NOT_VERIFIED_STATUS,
} from './retrieval/citationEngine';

// ── Session Memory & Context ─────────────────────────────────────────────────
export {
  addMessage,
  getHistory,
  getHistoryForAI,
  clearHistory,
  getMessageCount,
  type ChatMessage,
} from './memory/conversationMemory';
export {
  getOrCreateSession,
  recordTurn,
  isDuplicateAdvice,
  getFormattedHistory,
  clearSession,
  type StoredSession,
  type TurnRecord,
} from './memory/sessionMemory';
export {
  getUserPreferences,
  setUserPreferences,
  clearUserPreferences,
  type UserAIPreferences,
} from './memory/userContext';

// ── Security, Privacy & Access Control ───────────────────────────────────────
export {
  sanitizeInput,
  sanitizeOutput,
  isLogSafe,
  safeLog,
} from './security/privacyGuard';
export {
  sanitizeQuery,
  sanitizeQueryWithMapping,
  restoreSanitized,
  type PiiTokenMapping,
} from './security/piiSanitizer';
export {
  checkForHallucination,
  verifyAIResponseGrounding,
  buildInsufficientSourcesMessage,
} from './security/hallucinationGuard';
export {
  checkAccess,
  getFeatureLabel,
  isAdmin,
  isEnterprise,
  type AIFeature,
} from './security/accessControl';
export {
  checkTierAccess,
  TIER_CONFIGS,
  type TierQuotaConfig,
} from './security/tierAccessGuard';

// ── SEO AI Foundation (Draft Only) ───────────────────────────────────────────
export { FAQGenerator } from './seo/faqGenerator';
export { generateFAQList, type FAQSeed } from './seo/faqSchemaGenerator';
export { MetadataEngine, type LocalizedMetadata } from './seo/metadataEngine';
