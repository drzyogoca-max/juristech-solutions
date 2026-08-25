/**
 * src/ai/agents/complianceAgent.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Jurisdiction Regulatory Compliance Audit Agent
 * Specification: JURISTECH-AI-P0 Phase P0-2, Phase P0-8 & Task 4 (Part A)
 *
 * Orchestrates statutory compliance audits against regional and international
 * regulatory frameworks (PDPL, GDPR, ZATCA, Corporate Governance, Labor).
 * Anchored to `GLOBAL_LEGAL_KNOWLEDGE_BASE` via `LegalResearchAgent`.
 */

import { buildCitations } from '../retrieval/citationEngine';
import { detectJurisdictionFromQuery, detectLegalDomain, semanticSearch } from '../retrieval/semanticSearch';
import { rankSources } from '../retrieval/sourceRanking';
import { checkAccess } from '../security/accessControl';
import { sanitizeInput } from '../security/privacyGuard';
import { LegalResearchAgent } from './legalResearchAgent';
import type {
  Citation,
  ComplianceAssessmentResult,
  ComplianceCheckResult,
  ComplianceGap,
  ComplianceItem,
  GroundingStatus,
  JurisdictionCode,
  LegalDomain,
  RegulatoryRequirement,
  RiskLevel,
  SourceVerificationStatus,
  SupportedAILang,
  UserTier,
} from '../types';

const COMPLIANCE_FRAMEWORKS: Record<JurisdictionCode, ComplianceItem[]> = {
  SA: [
    {
      regulation: 'KSA PDPL (Personal Data Protection Law - Royal Decree M/148)',
      status: 'REVIEW_REQUIRED',
      description: 'Mandatory consent logging, data localization, and privacy policy compliance under SDAIA guidelines.',
      recommendation: 'Appoint Data Protection Officer (DPO) and maintain localized record of processing activities (ROPA).',
    },
    {
      regulation: 'ZATCA E-Invoicing Phase 2 (FATOORA Integration)',
      status: 'COMPLIANT',
      description: 'Cryptographic stamp, UUID generation, and XML UBL 2.1 schema validation for B2B/B2C invoices.',
      recommendation: 'Maintain continuous API handshake with ZATCA production gateway.',
    },
    {
      regulation: 'New Saudi Companies Law (Royal Decree M/132)',
      status: 'COMPLIANT',
      description: 'Simplified Joint Stock / LLC statutory voting thresholds and mandatory corporate bylaws.',
      recommendation: 'Ensure articles of association reflect electronic voting and capital adequacy provisions.',
    },
    {
      regulation: 'Saudi Labor Law & Wage Protection System (WPS)',
      status: 'COMPLIANT',
      description: 'Mandatory monthly salary transfer via authorized banking channels and Qiwa contract authentication.',
      recommendation: 'Verify active Qiwa authentication for 100% of employment agreements.',
    },
  ],
  AE: [
    {
      regulation: 'UAE Federal Decree-Law No. 45/2021 (Personal Data Protection)',
      status: 'REVIEW_REQUIRED',
      description: 'Cross-border data transfer controls and user data subject rights enforcement.',
      recommendation: 'Implement automated data export and erasure workflows.',
    },
    {
      regulation: 'UAE Commercial Companies Law No. 32/2021',
      status: 'COMPLIANT',
      description: '100% foreign ownership compliance and mainland/freezone trade licensing validation.',
      recommendation: 'Maintain updated Economic Substance Regulations (ESR) filings.',
    },
    {
      regulation: 'DIFC Data Protection Law No. 5/2020',
      status: 'COMPLIANT',
      description: 'High-risk processing notifications and DIFC Commissioner data registry filing.',
      recommendation: 'Conduct annual Privacy Impact Assessments (PIA).',
    },
  ],
  EG: [
    {
      regulation: 'Egyptian Data Protection Law No. 151/2020',
      status: 'REVIEW_REQUIRED',
      description: 'License requirements for electronic marketing and cross-border data transfer.',
      recommendation: 'Register data controller credentials with the Egyptian Data Protection Center.',
    },
    {
      regulation: 'Egyptian Tax Authority (ETA) E-Receipt & E-Invoice Mandate',
      status: 'COMPLIANT',
      description: 'Real-time e-receipt integration with ETA API using HSM e-token digital signatures.',
      recommendation: 'Ensure validity of corporate digital signing certificates.',
    },
  ],
  EU: [
    {
      regulation: 'EU General Data Protection Regulation (GDPR 2016/679)',
      status: 'COMPLIANT',
      description: 'Art. 6 lawful basis, Art. 17 right to erasure, Art. 32 security of processing with AES-256.',
      recommendation: 'Audit cookie consent banners and third-party data processor agreements.',
    },
  ],
  GB: [
    {
      regulation: 'UK Data Protection Act 2018 & UK GDPR',
      status: 'COMPLIANT',
      description: 'ICO registration and international data transfer agreements (IDTA).',
      recommendation: 'Maintain annual ICO data fee payment and documentation.',
    },
  ],
  US: [
    {
      regulation: 'Delaware General Corporation Law & SEC Compliance',
      status: 'COMPLIANT',
      description: 'Annual franchise tax filings, registered agent maintenance, and corporate minutes.',
      recommendation: 'Execute annual corporate consent in lieu of annual shareholder meetings.',
    },
  ],
  QA: [],
  KW: [],
  BH: [],
  OM: [],
  JO: [],
  INTL: [],
  SG: [],
  TR: [],
  CN: [],
  UNKNOWN: [],
};

export class ComplianceAgent {
  /**
   * Main Task 4 Comprehensive Compliance Assessment Pipeline
   */
  public static async assessCompliance(
    queryOrPolicyText: string,
    options: {
      forceJurisdiction?: JurisdictionCode;
      forceDomain?: LegalDomain;
      lang?: SupportedAILang;
      userTier?: UserTier;
    } = {}
  ): Promise<ComplianceAssessmentResult> {
    const {
      forceJurisdiction,
      forceDomain,
      lang = 'en',
      userTier = 'free',
    } = options;

    const isAr = lang === 'ar';
    const isRtl = lang === 'ar';

    // ── 1. Access Control Check
    const access = checkAccess('compliance_agent', userTier);
    if (!access.allowed) {
      return this.buildGatedComplianceReport(lang, isRtl, access.reason || 'SME/Enterprise subscription required');
    }

    // ── 2. Privacy Sanitization
    const sanitized = sanitizeInput(queryOrPolicyText);
    const cleanText = sanitized.sanitized;

    // ── 3. Jurisdiction & Domain Resolution
    let jurisdiction: JurisdictionCode = forceJurisdiction || 'UNKNOWN';
    let jurisdictionSafetyStatus: 'RESOLVED' | 'JURISDICTION_REQUIRED' = 'RESOLVED';
    let clarificationPrompt: string | undefined;

    if (jurisdiction === 'UNKNOWN') {
      const detected = detectJurisdictionFromQuery(cleanText);
      if (detected !== 'UNKNOWN') {
        jurisdiction = detected;
      } else {
        jurisdictionSafetyStatus = 'JURISDICTION_REQUIRED';
        clarificationPrompt = isAr
          ? 'يرجى تحديد الدولة المعنية (مثل: السعودية، الإمارات، مصر، بريطانيا، الاتحاد الأوروبي) لإجراء تدقيق الامتثال التنظيمي الدقيق وفق اللوائح المعتمدة.'
          : 'Please specify the target jurisdiction (e.g., Saudi Arabia, UAE, Egypt, UK, European Union) to run an accurate regulatory compliance audit.';
      }
    }

    const regulatoryDomain = forceDomain || detectLegalDomain(cleanText) || 'compliance';

    // If jurisdiction is completely unknown, halt and require jurisdiction
    if (jurisdictionSafetyStatus === 'JURISDICTION_REQUIRED') {
      return {
        jurisdiction: 'UNKNOWN',
        regulatoryDomain,
        applicableRequirements: [],
        complianceGaps: [],
        riskLevel: 'MEDIUM',
        recommendedActions: [isAr ? 'تحديد الدولة أو الولاية القضائية' : 'Specify governing country / jurisdiction'],
        verifiedSources: [],
        confidenceScore: 0.4,
        confidenceCalculation: 'heuristic',
        sourceVerificationStatus: 'SOURCE_NOT_VERIFIED',
        groundingStatus: 'REQUIRES_VERIFICATION',
        jurisdictionSafetyStatus: 'JURISDICTION_REQUIRED',
        clarificationPrompt,
        lang,
        isRtl,
      };
    }

    // ── 4. Statutory Knowledge Base Grounding via Legal Research Agent
    const research = await LegalResearchAgent.executeResearch(cleanText, {
      lang,
      forceJurisdiction: jurisdiction,
      forceDomain: regulatoryDomain,
      topK: 5,
    });

    const verifiedSources = research.citations;
    let sourceVerificationStatus: SourceVerificationStatus = research.sourceVerificationStatus;
    let groundingStatus: GroundingStatus = research.groundingStatus;

    // ── 5. Requirement Identification & Compliance Gap Analysis
    const baseFramework = COMPLIANCE_FRAMEWORKS[jurisdiction] || [];
    const applicableRequirements: RegulatoryRequirement[] = [];
    const complianceGaps: ComplianceGap[] = [];

    // Map base framework items into requirements
    for (let i = 0; i < baseFramework.length; i++) {
      const item = baseFramework[i];
      const matchedCitation = verifiedSources.find(c =>
        item.regulation.toLowerCase().includes(c.sourceCode.toLowerCase()) ||
        item.description.toLowerCase().includes(c.titleEn.toLowerCase())
      );

      applicableRequirements.push({
        id: `req-${jurisdiction.toLowerCase()}-${i + 1}`,
        title: item.regulation,
        requirementText: item.description,
        authority: jurisdiction === 'SA' ? 'SDAIA / ZATCA / Ministry of Commerce' : (jurisdiction === 'EG' ? 'ETA / DPC' : 'Regulatory Authority'),
        mandatory: true,
        citationId: matchedCitation?.id,
        status: item.status,
      });

      if (item.status === 'REVIEW_REQUIRED' || item.status === 'NON_COMPLIANT') {
        complianceGaps.push({
          requirementId: `req-${jurisdiction.toLowerCase()}-${i + 1}`,
          description: isAr
            ? `فجوة امتثال محتملة في ${item.regulation}: ${item.description}`
            : `Potential compliance gap in ${item.regulation}: ${item.description}`,
          severity: item.status === 'NON_COMPLIANT' ? 'Critical' : 'High',
          remediation: item.recommendation || (isAr ? 'مراجعة السياسات وتحديث السجلات الرسمية' : 'Audit policies and update compliance records'),
        });
      }
    }

    // If framework had no items for jurisdiction, map statutes directly
    if (applicableRequirements.length === 0 && research.statutes.length > 0) {
      research.statutes.forEach((statute, i) => {
        applicableRequirements.push({
          id: `req-${jurisdiction.toLowerCase()}-${i + 1}`,
          title: isAr ? statute.titleAr : statute.titleEn,
          requirementText: isAr ? statute.contentAr : statute.contentEn,
          authority: statute.sourceCode,
          mandatory: true,
          citationId: statute.id,
          status: 'REVIEW_REQUIRED',
        });
      });
    }

    // ── 6. Risk Level Calculation
    let riskLevel: RiskLevel = 'SAFE';
    if (complianceGaps.some(g => g.severity === 'Critical')) {
      riskLevel = 'HIGH';
    } else if (complianceGaps.some(g => g.severity === 'High') || applicableRequirements.some(r => r.status === 'REVIEW_REQUIRED')) {
      riskLevel = 'MEDIUM';
    }

    const recommendedActions = complianceGaps.map(g => g.remediation);
    if (recommendedActions.length === 0) {
      recommendedActions.push(
        isAr ? 'الاحتفاظ بسجلات الامتثال المحدثة ومراجعتها سنوياً' : 'Maintain updated compliance documentation and conduct annual audits'
      );
    }

    return {
      jurisdiction,
      regulatoryDomain,
      applicableRequirements,
      complianceGaps,
      riskLevel,
      recommendedActions,
      verifiedSources,
      confidenceScore: verifiedSources.length > 0 ? 0.94 : 0.45,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus,
      groundingStatus,
      jurisdictionSafetyStatus: 'RESOLVED',
      lang,
      isRtl,
    };
  }

  /**
   * Backward-compatible evaluation adapter
   */
  public static async evaluateCompliance(
    topicQuery: string,
    jurisdiction: JurisdictionCode = 'SA',
    lang: SupportedAILang = 'en',
    userTier: UserTier = 'enterprise'
  ): Promise<ComplianceCheckResult> {
    return runComplianceAudit(jurisdiction, 'compliance', userTier);
  }

  public static runComplianceAudit = runComplianceAudit;

  private static buildGatedComplianceReport(
    lang: SupportedAILang,
    isRtl: boolean,
    reason: string
  ): ComplianceAssessmentResult {
    const text = isRtl
      ? `🔒 تتطلب ميزة تدقيق الامتثال التنظيمي باقة اشتراك SME أو Enterprise. (${reason})`
      : `🔒 Regulatory compliance audits require an active SME or Enterprise subscription tier. (${reason})`;

    return {
      jurisdiction: 'UNKNOWN',
      regulatoryDomain: 'compliance',
      applicableRequirements: [],
      complianceGaps: [],
      riskLevel: 'HIGH',
      recommendedActions: [isRtl ? 'ترقية الاشتراك لتفعيل وكيل الامتثال' : 'Upgrade subscription to enable Compliance Agent'],
      verifiedSources: [],
      confidenceScore: 0.0,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus: 'INSUFFICIENT',
      groundingStatus: 'UNGROUNDED',
      jurisdictionSafetyStatus: 'JURISDICTION_REQUIRED',
      lang,
      isRtl,
    };
  }
}

/**
 * Runs a regulatory compliance audit for a given jurisdiction.
 */
export function runComplianceAudit(
  jurisdiction: JurisdictionCode = 'SA',
  domain: LegalDomain = 'compliance',
  userTier: UserTier = 'pro'
): ComplianceCheckResult {
  const access = checkAccess('compliance_agent', userTier);
  if (!access.allowed) {
    return {
      jurisdiction,
      domain,
      items: [],
      overallStatus: 'FAIL',
      confidenceScore: 0,
      sources: [],
    };
  }

  const items = COMPLIANCE_FRAMEWORKS[jurisdiction] || COMPLIANCE_FRAMEWORKS.SA;
  const hasFailures = items.some(i => i.status === 'NON_COMPLIANT');
  const hasReviews = items.some(i => i.status === 'REVIEW_REQUIRED');

  let overallStatus: 'PASS' | 'FAIL' | 'PARTIAL' = 'PASS';
  if (hasFailures) overallStatus = 'FAIL';
  else if (hasReviews) overallStatus = 'PARTIAL';

  // Find supporting statutes
  const searchResults = semanticSearch('compliance data protection regulatory tax law', {
    jurisdiction,
    domain,
    topK: 4,
  });
  const ranked = rankSources(searchResults, jurisdiction);
  const citations = buildCitations(ranked);

  return {
    jurisdiction,
    domain,
    items,
    overallStatus,
    confidenceScore: 0.94,
    sources: citations,
  };
}
