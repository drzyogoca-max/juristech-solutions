/**
 * src/ai/types.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Shared Type Definitions for AI Intelligence Layer P0
 * Specification: JURISTECH-AI-P0 (Tasks 1, 2, 3, 4, 5)
 */

import type { LegalStatute } from '../services/legalRAGOrchestrator';
import type { Deep8AxisAuditReport } from '../services/contractAnalysisEngine';

export type SupportedAILang = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'tr' | 'zh';
export type UserTier = 'free' | 'startup' | 'sme' | 'pro' | 'enterprise' | 'admin' | 'lawyer';
export type LegalDomain =
  | 'corporate' | 'labor' | 'ip' | 'criminal' | 'compliance'
  | 'contract' | 'real_estate' | 'banking' | 'tax' | 'arbitration'
  | 'company_formation' | 'general';

export type JurisdictionCode =
  | 'SA' | 'AE' | 'EG' | 'QA' | 'KW' | 'BH' | 'OM' | 'JO'
  | 'INTL' | 'GB' | 'US' | 'EU' | 'SG' | 'TR' | 'CN' | 'UNKNOWN';

export interface Citation {
  id: string;
  sourceCode: string;
  articleNumber: string;
  titleEn: string;
  titleAr: string;
  jurisdictionCode: JurisdictionCode;
  countryNameEn: string;
  countryNameAr: string;
  relevanceScore: number;
  formattedCitationEn: string;
  formattedCitationAr: string;
  authorityLevel?: 'Primary_Statute' | 'Royal_Decree' | 'Treaty' | 'Executive_Regulation' | 'Precedent';
  isVerified: boolean;
}

export type SourceVerificationStatus = 'VERIFIED' | 'PARTIAL' | 'INSUFFICIENT' | 'SOURCE_NOT_VERIFIED';
export type GroundingStatus = 'GROUNDED' | 'UNGROUNDED' | 'REQUIRES_VERIFICATION';

export interface LegalAdvisorResponse {
  summary: string;
  legalAnalysis: string;
  applicableRules: LegalStatute[];
  risks: string[];
  recommendedActions: string[];
  sources: Citation[];
  confidenceScore: number;
  confidenceCalculation?: 'heuristic';
  sourceVerificationStatus: SourceVerificationStatus;
  groundingStatus?: GroundingStatus;
  hallucinationGuardTriggered: boolean;
  lang: SupportedAILang;
  isRtl: boolean;
  jurisdiction: JurisdictionCode;
  legalDomain: LegalDomain;
  clarificationRequired: boolean;
  clarificationPrompt?: string;
  rawAIResponse?: string;
}

export interface AISessionContext {
  sessionId: string;
  lang: SupportedAILang;
  detectedJurisdiction: JurisdictionCode;
  legalDomain: LegalDomain;
  userTier: UserTier;
  messageCount: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface OrchestratorRequest {
  query: string;
  lang?: SupportedAILang;
  userTier: UserTier;
  context?: AISessionContext;
  forceJurisdiction?: JurisdictionCode;
  forceDomain?: LegalDomain;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export interface ContractRiskSummary {
  overallRisk: RiskLevel;
  riskScore: number;
  riskLabel: string;
  missingClauses: string[];
  topRisks: string[];
  recommendedActions: string[];
  confidenceScore: number;
  sources: Citation[];
}

export interface ClauseFinding {
  clauseName: string;
  type: 'missing' | 'ambiguous' | 'unfavorable' | 'high_risk' | 'jurisdiction_sensitive';
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Safe';
  statutoryBasis?: string;
  recommendedRedline?: string;
  relevantStatuteId?: string;
}

export interface RiskCategoryResult {
  categoryId: string;
  name: string;
  score: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Safe';
  findings: string[];
  statutoryBasis: string;
  redline: string;
}

export interface StructuredContractReport {
  documentTitle: string;
  auditTimestamp: string;
  executiveSummary: string;
  overallRisk: RiskLevel;
  overallScore: number;
  riskLabel: string;
  financialLiabilityCap: {
    isCapped: boolean;
    detectedCap: string;
    recommendedCap: string;
  };
  criticalFindings: string[];
  clauseFindings: ClauseFinding[];
  missingClauses: string[];
  ambiguousClauses: string[];
  unfavorableClauses: string[];
  jurisdictionSensitiveClauses: string[];
  riskCategories: RiskCategoryResult[];
  recommendations: string[];
  governingLawAnalysis: string;
  disputeResolutionRecommendation: string;
  jurisdiction: JurisdictionCode;
  jurisdictionSafetyStatus: 'RESOLVED' | 'JURISDICTION_REQUIRED';
  citations: Citation[];
  confidenceScore: number;
  confidenceCalculation: 'heuristic';
  sourceVerificationStatus: SourceVerificationStatus;
  groundingStatus: GroundingStatus;
  lang: SupportedAILang;
  isRtl: boolean;
  rawReport?: Deep8AxisAuditReport;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  minimumTier?: UserTier;
}

export interface SanitizeResult {
  sanitized: string;
  redactedCount: number;
  patterns: string[];
}

export interface HallucinationCheckResult {
  passed: boolean;
  flags: string[];
  verifiedCitationCount: number;
  unverifiedClaims: string[];
  verdict: 'VERIFIED' | 'PARTIAL' | 'INSUFFICIENT' | 'RESPONSE_REQUIRES_VERIFICATION' | 'SOURCE_NOT_VERIFIED';
}

export type DocType =
  | 'employment_contract' | 'nda' | 'service_agreement'
  | 'partnership_agreement' | 'legal_letter' | 'memo'
  | 'internal_policy' | 'company_formation';

export interface DocumentGenerationRequest {
  docType: DocType;
  jurisdiction: JurisdictionCode;
  lang: SupportedAILang;
  parties: string[];
  additionalDetails: Record<string, string>;
  userTier: UserTier;
}

export interface DocumentGenerationResult {
  content: string;
  lang: SupportedAILang;
  docType: DocType;
  jurisdiction: JurisdictionCode;
  isDraft: boolean;
  requiredFields?: string[];
  confidenceScore: number;
}

// ── Compliance Intelligence Types (Task 4-A) ─────────────────────────────────

export interface RegulatoryRequirement {
  id: string;
  title: string;
  requirementText: string;
  authority: string;
  mandatory: boolean;
  citationId?: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED' | 'NOT_APPLICABLE';
}

export interface ComplianceGap {
  requirementId: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  remediation: string;
}

export interface ComplianceAssessmentResult {
  jurisdiction: JurisdictionCode;
  regulatoryDomain: LegalDomain;
  applicableRequirements: RegulatoryRequirement[];
  complianceGaps: ComplianceGap[];
  riskLevel: RiskLevel;
  recommendedActions: string[];
  verifiedSources: Citation[];
  confidenceScore: number;
  confidenceCalculation: 'heuristic';
  sourceVerificationStatus: SourceVerificationStatus;
  groundingStatus: GroundingStatus;
  jurisdictionSafetyStatus: 'RESOLVED' | 'JURISDICTION_REQUIRED';
  clarificationPrompt?: string;
  lang: SupportedAILang;
  isRtl: boolean;
}

export interface ComplianceItem {
  regulation: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED' | 'NOT_APPLICABLE';
  description: string;
  recommendation?: string;
}

export interface ComplianceCheckResult {
  jurisdiction: JurisdictionCode;
  domain: LegalDomain;
  items: ComplianceItem[];
  overallStatus: 'PASS' | 'FAIL' | 'PARTIAL';
  confidenceScore: number;
  sources: Citation[];
}

// ── Document Intelligence Types (Task 4-B) ───────────────────────────────────

export type LegalDocumentType =
  | 'Contract'
  | 'Legal Notice'
  | 'Policy'
  | 'Regulation'
  | 'Court/Legal Document'
  | 'Corporate Document'
  | 'DOCUMENT_TYPE_UNKNOWN';

export interface DocumentSection {
  title: string;
  content: string;
  clauseType?: string;
  riskSeverity?: 'Critical' | 'High' | 'Medium' | 'Safe';
}

export interface StructuredDocumentAnalysis {
  documentTitle: string;
  documentType: LegalDocumentType;
  classificationConfidence: number;
  executiveSummary: string;
  keyPoints: string[];
  sections: DocumentSection[];
  identifiedIssues: string[];
  extractedMetadata: {
    parties: string[];
    effectiveDate?: string;
    governingJurisdiction?: JurisdictionCode;
    governingLawText?: string;
    monetaryValues?: string[];
    language: SupportedAILang;
  };
  jurisdiction: JurisdictionCode;
  citations: Citation[];
  confidenceScore: number;
  confidenceCalculation: 'heuristic';
  sourceVerificationStatus: SourceVerificationStatus;
  lang: SupportedAILang;
  isRtl: boolean;
}

// ── Enterprise AI & Task Planning Types (Task 5-A) ───────────────────────────

export type EnterpriseTaskType =
  | 'LEGAL_RESEARCH'
  | 'CONTRACT_ANALYSIS'
  | 'COMPLIANCE'
  | 'DOCUMENT_ANALYSIS'
  | 'DOCUMENT_GENERATION'
  | 'GENERAL_AI';

export interface TaskPlanStep {
  stepNumber: number;
  taskType: EnterpriseTaskType;
  agentName: 'LegalResearchAgent' | 'ContractAgent' | 'ComplianceAgent' | 'DocumentAgent' | 'DocumentGenerator' | 'AIOrchestrator';
  description: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'SKIPPED';
}

export interface EnterpriseTaskPlan {
  taskId: string;
  primaryTaskType: EnterpriseTaskType;
  steps: TaskPlanStep[];
  plannedAt: string;
  estimatedConfidence: number;
}

export interface EnterpriseExecutionResult {
  taskId: string;
  taskType: EnterpriseTaskType;
  plan: EnterpriseTaskPlan;
  executiveSummary: string;
  specialistResult: any;
  verifiedCitations: Citation[];
  confidenceScore: number;
  confidenceCalculation: 'heuristic';
  sourceVerificationStatus: SourceVerificationStatus;
  requiresHumanReview: boolean;
  jurisdiction: JurisdictionCode;
  lang: SupportedAILang;
  isRtl: boolean;
  executionTimestamp: string;
}

// ── Structured Document Generation Types (Task 5-B) ──────────────────────────

export type GeneratedDocumentTemplateType =
  | 'Legal Memorandum'
  | 'Contract Draft'
  | 'Legal Notice'
  | 'Compliance Report'
  | 'Policy Draft'
  | 'Executive Legal Summary';

export type DocumentGenerationStatus = 'DRAFT' | 'VERIFIED_SOURCES' | 'REQUIRES_REVIEW';

export interface GeneratedLegalDocument {
  documentId: string;
  documentTitle: string;
  templateType: GeneratedDocumentTemplateType;
  documentStatus: DocumentGenerationStatus;
  jurisdiction: JurisdictionCode;
  governingLaw: string;
  content: string;
  sections: Array<{ heading: string; body: string }>;
  placeholders: string[];
  citations: Citation[];
  sourceVerificationStatus: SourceVerificationStatus;
  confidenceScore: number;
  confidenceCalculation: 'heuristic';
  metadata: {
    generatedAt: string;
    language: SupportedAILang;
    jurisdiction: JurisdictionCode;
    documentType: GeneratedDocumentTemplateType;
    sourceVerificationStatus: SourceVerificationStatus;
    confidence: number;
    requiresHumanReview: true;
    version: string;
  };
  lang: SupportedAILang;
  isRtl: boolean;
}

export interface LegalFAQItem {
  id: string;
  question: string;
  answerEn: string;
  answerAr: string;
  jurisdiction: JurisdictionCode;
  domain: LegalDomain;
  schemaJsonLd: string;
  status: 'DRAFT';
  generatedAt: string;
}
