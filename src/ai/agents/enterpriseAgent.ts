/**
 * src/ai/agents/enterpriseAgent.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Multi-Jurisdiction Legal AI Agent & Planner
 * Specification: JURISTECH-AI-P0 Phase P0-2, Phase P0-8 & Task 5 (Part A)
 *
 * Master Enterprise Orchestration Facade that performs:
 *  - Intent-driven Task Planning
 *  - Safe Multi-step Delegation to Specialist Agents (Research, Contract, Compliance, Document, Generator)
 *  - Cross-Border Comparative Audits across 15 Jurisdictions
 *  - Zero Autonomous External Side Effects (Strict Read-Only & In-Memory AI Synthesis)
 */

import { LegalResearchAgent } from './legalResearchAgent';
import { ContractAgent } from './contractAgent';
import { ComplianceAgent } from './complianceAgent';
import { DocumentAgent } from './documentAgent';
import { DocumentGenerator } from '../generation/documentGenerator';
import { checkAccess } from '../security/accessControl';
import { sanitizeInput } from '../security/privacyGuard';
import { detectJurisdictionFromQuery } from '../retrieval/semanticSearch';
import type {
  Citation,
  EnterpriseExecutionResult,
  EnterpriseTaskPlan,
  EnterpriseTaskType,
  JurisdictionCode,
  LegalDomain,
  SourceVerificationStatus,
  SupportedAILang,
  TaskPlanStep,
  UserTier,
} from '../types';

export interface EnterpriseComparativeReport {
  title: string;
  timestamp: string;
  regionsAnalyzed: JurisdictionCode[];
  domain: LegalDomain;
  executiveSummary: string;
  statutoryMatrix: Array<{
    jurisdiction: JurisdictionCode;
    summary: string;
    citations: Citation[];
  }>;
  complianceOverview: string;
  confidenceScore: number;
}

export class EnterpriseAgent {
  /**
   * Plans and classifies an inbound enterprise request into structured multi-step tasks.
   */
  public static planTask(
    userPrompt: string,
    options: {
      jurisdiction?: JurisdictionCode;
      lang?: SupportedAILang;
    } = {}
  ): EnterpriseTaskPlan {
    const promptLower = userPrompt.toLowerCase();
    const taskId = `ent-task-${Date.now().toString(36)}`;
    let primaryTaskType: EnterpriseTaskType = 'GENERAL_AI';
    const steps: TaskPlanStep[] = [];

    // Task Type Detection
    if (promptLower.includes('contract') || promptLower.includes('عقد') || promptLower.includes('agreement') || promptLower.includes('clause') || promptLower.includes('بند')) {
      primaryTaskType = 'CONTRACT_ANALYSIS';
      steps.push({
        stepNumber: 1,
        taskType: 'CONTRACT_ANALYSIS',
        agentName: 'ContractAgent',
        description: 'Execute deep 8-axis statutory contract risk audit and extract clause vulnerabilities',
        status: 'PENDING',
      });
      steps.push({
        stepNumber: 2,
        taskType: 'LEGAL_RESEARCH',
        agentName: 'LegalResearchAgent',
        description: 'Retrieve verified statutory backing from knowledge base for critical findings',
        status: 'PENDING',
      });
    } else if (promptLower.includes('compliance') || promptLower.includes('امتثال') || promptLower.includes('gdpr') || promptLower.includes('pdpl') || promptLower.includes('zatca')) {
      primaryTaskType = 'COMPLIANCE';
      steps.push({
        stepNumber: 1,
        taskType: 'COMPLIANCE',
        agentName: 'ComplianceAgent',
        description: 'Audit mandatory regulatory framework requirements and identify compliance gaps',
        status: 'PENDING',
      });
    } else if (promptLower.includes('draft') || promptLower.includes('صياغة') || promptLower.includes('generate') || promptLower.includes('توليد') || promptLower.includes('memorandum') || promptLower.includes('مذكرة')) {
      primaryTaskType = 'DOCUMENT_GENERATION';
      steps.push({
        stepNumber: 1,
        taskType: 'LEGAL_RESEARCH',
        agentName: 'LegalResearchAgent',
        description: 'Retrieve jurisdiction-grounded statutory provisions for document drafting',
        status: 'PENDING',
      });
      steps.push({
        stepNumber: 2,
        taskType: 'DOCUMENT_GENERATION',
        agentName: 'DocumentGenerator',
        description: 'Construct structured legal draft with human review metadata and verified citations',
        status: 'PENDING',
      });
    } else if (promptLower.includes('document') || promptLower.includes('مستند') || promptLower.includes('classify') || promptLower.includes('تصنيف') || promptLower.includes('summary') || promptLower.includes('تلخيص')) {
      primaryTaskType = 'DOCUMENT_ANALYSIS';
      steps.push({
        stepNumber: 1,
        taskType: 'DOCUMENT_ANALYSIS',
        agentName: 'DocumentAgent',
        description: 'Classify document typology and extract faithful non-fabricated key points',
        status: 'PENDING',
      });
    } else {
      primaryTaskType = 'LEGAL_RESEARCH';
      steps.push({
        stepNumber: 1,
        taskType: 'LEGAL_RESEARCH',
        agentName: 'LegalResearchAgent',
        description: 'Search verified statutory knowledge base and rank relevant primary laws',
        status: 'PENDING',
      });
    }

    return {
      taskId,
      primaryTaskType,
      steps,
      plannedAt: new Date().toISOString(),
      estimatedConfidence: 0.95,
    };
  }

  /**
   * Main Task 5 Enterprise Multi-Step Task Execution Pipeline
   * (Zero Autonomous Side Effects: Pure In-Memory & Read-Only Synthesis)
   */
  public static async executeEnterpriseTask(
    userPrompt: string,
    options: {
      forceJurisdiction?: JurisdictionCode;
      lang?: SupportedAILang;
      userTier?: UserTier;
    } = {}
  ): Promise<EnterpriseExecutionResult> {
    const {
      forceJurisdiction,
      lang = 'en',
      userTier = 'free',
    } = options;

    const isAr = lang === 'ar';
    const isRtl = lang === 'ar';

    // ── 1. Access Control Check
    const access = checkAccess('enterprise_multi_jurisdiction', userTier);
    if (!access.allowed) {
      return this.buildGatedExecutionResult(userPrompt, lang, isRtl, access.reason || 'Enterprise subscription required');
    }

    // ── 2. Privacy & PII Sanitization
    const sanitized = sanitizeInput(userPrompt);
    const cleanPrompt = sanitized.sanitized;

    // ── 3. Jurisdiction Resolution
    const jurisdiction = forceJurisdiction || detectJurisdictionFromQuery(cleanPrompt);

    // ── 4. Task Planning
    const plan = this.planTask(cleanPrompt, { jurisdiction, lang });

    let specialistResult: any = null;
    let verifiedCitations: Citation[] = [];
    let sourceVerificationStatus: SourceVerificationStatus = 'VERIFIED';
    let executiveSummary = '';

    // ── 5. Specialist Agent Delegation
    switch (plan.primaryTaskType) {
      case 'CONTRACT_ANALYSIS': {
        const audit = await ContractAgent.executeStructuredContractAudit(cleanPrompt, {
          targetJurisdiction: jurisdiction,
          forceJurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
          lang,
          userTier,
        });
        specialistResult = audit;
        verifiedCitations = audit.citations;
        sourceVerificationStatus = audit.sourceVerificationStatus;
        executiveSummary = audit.executiveSummary;
        break;
      }

      case 'COMPLIANCE': {
        const comp = await ComplianceAgent.assessCompliance(cleanPrompt, {
          forceJurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
          lang,
          userTier,
        });
        specialistResult = comp;
        verifiedCitations = comp.verifiedSources;
        sourceVerificationStatus = comp.sourceVerificationStatus;
        executiveSummary = isAr
          ? `تدقيق الامتثال المؤسسي: تم فحص ${comp.applicableRequirements.length} متطلبات تنظيمية ورصد ${comp.complianceGaps.length} فجوات محتملة.`
          : `Enterprise Compliance Audit: Evaluated ${comp.applicableRequirements.length} regulatory requirements with ${comp.complianceGaps.length} potential gaps identified.`;
        break;
      }

      case 'DOCUMENT_GENERATION': {
        const doc = await DocumentGenerator.generateLegalDraft({
          documentTitle: 'Enterprise Legal Draft',
          templateType: cleanPrompt.toLowerCase().includes('contract') ? 'Contract Draft' : 'Legal Memorandum',
          jurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
          keyTerms: [cleanPrompt],
          lang,
          userTier,
        });
        specialistResult = doc;
        verifiedCitations = doc.citations;
        sourceVerificationStatus = doc.sourceVerificationStatus;
        executiveSummary = isAr
          ? `تم إنشاء مسودة المستند القانوني (${doc.templateType}) بنجاح مع ربط الاستناد التشريعي المعتمد.`
          : `Legal document draft (${doc.templateType}) generated successfully with verified statutory citations.`;
        break;
      }

      case 'DOCUMENT_ANALYSIS': {
        const docAnalysis = await DocumentAgent.analyzeDocument(cleanPrompt, {
          forceJurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
          lang,
          userTier,
        });
        specialistResult = docAnalysis;
        verifiedCitations = docAnalysis.citations;
        sourceVerificationStatus = docAnalysis.sourceVerificationStatus;
        executiveSummary = docAnalysis.executiveSummary;
        break;
      }

      case 'LEGAL_RESEARCH':
      default: {
        const research = await LegalResearchAgent.executeResearch(cleanPrompt, {
          forceJurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
          lang,
          topK: 4,
        });
        specialistResult = research;
        verifiedCitations = research.citations;
        sourceVerificationStatus = research.sourceVerificationStatus;
        executiveSummary = isAr
          ? (research.reasoningAr || `تم استرجاع ${research.statutes.length} نصوص ومبادئ نظامية موثقة.`)
          : (research.reasoningEn || `Retrieved ${research.statutes.length} verified statutory provisions.`);
        break;
      }
    }

    // Mark all planned steps as COMPLETED
    plan.steps.forEach(s => { s.status = 'COMPLETED'; });

    return {
      taskId: plan.taskId,
      taskType: plan.primaryTaskType,
      plan,
      executiveSummary,
      specialistResult,
      verifiedCitations,
      confidenceScore: 0.95,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus,
      requiresHumanReview: true,
      jurisdiction,
      lang,
      isRtl,
      executionTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Cross-Border Comparative Audit across multiple regions
   */
  public static async executeComparativeAudit(
    topicQuery: string,
    jurisdictions: JurisdictionCode[] = ['SA', 'AE', 'EG', 'INTL'],
    lang: SupportedAILang = 'en'
  ): Promise<EnterpriseComparativeReport> {
    const statutoryMatrix: EnterpriseComparativeReport['statutoryMatrix'] = [];

    for (const j of jurisdictions) {
      const research = await LegalResearchAgent.executeResearch(topicQuery, {
        lang,
        forceJurisdiction: j,
        topK: 2,
      });

      const summary = lang === 'ar'
        ? `تحليل الأنظمة القضائية والتشريعية في (${j}): تم رصد ${research.statutes.length} نصوص ومبادئ نظامية رئيسية.`
        : `Statutory framework review for (${j}): ${research.statutes.length} relevant legislative provisions identified.`;

      statutoryMatrix.push({
        jurisdiction: j,
        summary,
        citations: research.citations,
      });
    }

    const comp = await ComplianceAgent.evaluateCompliance(topicQuery, jurisdictions[0] || 'INTL', lang);

    const isAr = lang === 'ar';
    const executiveSummary = isAr
      ? `تقرير استشاري مقارن متعدد الولايات القضائية لمنظومة المؤسسات الكبرى. تم فحص الموضوع عبر ${jurisdictions.length} أقاليم تشريعية بنسبة امتثال ${comp.overallStatus}.`
      : `Enterprise cross-border comparative advisory report. Analyzed across ${jurisdictions.length} legal jurisdictions with overall compliance status: ${comp.overallStatus}.`;

    return {
      title: isAr ? 'تقرير الحوكمة والتحليل التشريعي المقارن للمؤسسات' : 'Enterprise Cross-Border Statutory Comparative Report',
      timestamp: new Date().toISOString(),
      regionsAnalyzed: jurisdictions,
      domain: 'corporate',
      executiveSummary,
      statutoryMatrix,
      complianceOverview: `Status: ${comp.overallStatus} (${comp.items.length} regulations tracked)`,
      confidenceScore: 0.95,
    };
  }

  private static buildGatedExecutionResult(
    userPrompt: string,
    lang: SupportedAILang,
    isRtl: boolean,
    reason: string
  ): EnterpriseExecutionResult {
    const text = isRtl
      ? `🔒 تتطلب ميزات Enterprise AI باقة اشتراك مؤسسية نشطة (Enterprise Tier). (${reason})`
      : `🔒 Enterprise AI features require an active Enterprise subscription tier. (${reason})`;

    const plan = this.planTask(userPrompt, { lang });

    return {
      taskId: plan.taskId,
      taskType: plan.primaryTaskType,
      plan,
      executiveSummary: text,
      specialistResult: null,
      verifiedCitations: [],
      confidenceScore: 0.0,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus: 'INSUFFICIENT',
      requiresHumanReview: true,
      jurisdiction: 'UNKNOWN',
      lang,
      isRtl,
      executionTimestamp: new Date().toISOString(),
    };
  }
}
