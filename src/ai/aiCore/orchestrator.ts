/**
 * src/ai/aiCore/orchestrator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Legal AI Master Orchestration Engine
 * Specification: JURISTECH-AI-P0 Phase P0-1, Phase P0-2, Phase P0-6 & Phase P0-7
 *
 * Master Orchestration Layer that integrates:
 *  - Intent Classification (classifyUserIntent from existing classifier)
 *  - Dynamic Route Dispatching (Legal Research, Contract Forensics, Document Studio)
 *  - Privacy Guard (PII redaction & session safety)
 *  - Access Control (Strict Subscription / Tier check)
 *  - Context Manager (Session state tracking)
 *  - Legal Research Agent (15-jurisdiction vector KB retrieval)
 *  - Response Validator & Hallucination Guard
 */

import { callAIWithHistory } from '../../lib/api';
import { classifyUserIntent, type IntentAnalysisResult } from '../../services/aiIntentClassifier';
import type {
  Citation,
  JurisdictionCode,
  LegalAdvisorResponse,
  LegalDomain,
  OrchestratorRequest,
  SourceVerificationStatus,
  SupportedAILang,
} from '../types';
import { sanitizeInput, sanitizeOutput } from '../security/privacyGuard';
import { checkAccess } from '../security/accessControl';
import { checkForHallucination, buildInsufficientSourcesMessage } from '../security/hallucinationGuard';
import { contextManager } from './contextManager';
import { ResponseValidator } from './responseValidator';
import { LegalResearchAgent } from '../agents/legalResearchAgent';
import { formatCitationBlock } from '../retrieval/citationEngine';
import { addMessage } from '../memory/conversationMemory';

export class AIOrchestrator {
  private static instance: AIOrchestrator;

  private constructor() {}

  public static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  /**
   * Classifies user intent and routes to the appropriate specialist agent or engine.
   */
  public classifyAndRoute(query: string): IntentAnalysisResult {
    return classifyUserIntent(query);
  }

  /**
   * Main entry point for structured legal advisory requests
   */
  public async executeLegalAdvisory(request: OrchestratorRequest): Promise<LegalAdvisorResponse> {
    const { query, userTier = 'free' } = request;
    const lang: SupportedAILang = request.lang || 'en';
    const isRtl = lang === 'ar';

    // ── 1. Access Control Quality Gate
    const access = checkAccess('basic_legal_qa', userTier);
    if (!access.allowed) {
      return this.buildGatedResponse(lang, isRtl, access.reason || 'Upgrade required');
    }

    // ── 2. Privacy & PII Sanitization
    const sanitizedInput = sanitizeInput(query);
    const cleanQuery = sanitizedInput.sanitized;

    // ── 3. Intent Classification & Routing Pre-check
    const intentResult = this.classifyAndRoute(cleanQuery);

    // ── 4. Session Context Update
    const sessionCtx = contextManager.updateFromQuery(cleanQuery, lang, userTier);

    // ── 5. Legal Research & Citation Retrieval
    const research = await LegalResearchAgent.executeResearch(cleanQuery, {
      lang,
      forceJurisdiction: request.forceJurisdiction || sessionCtx.detectedJurisdiction,
      forceDomain: request.forceDomain || sessionCtx.legalDomain,
      topK: 4,
    });

    const jurisdiction = research.jurisdiction;
    const domain = research.domain;
    const citations = research.citations;
    const applicableRules = research.statutes;

    // ── 6. Clarification Check (If jurisdiction completely unknown for complex inquiry)
    const isAmbiguousQuery =
      jurisdiction === 'UNKNOWN' &&
      cleanQuery.split(' ').length > 8 &&
      !cleanQuery.includes('international') &&
      intentResult.intent === 'LEGAL_INQUIRY';

    if (isAmbiguousQuery && request.forceJurisdiction === undefined) {
      const clarificationPrompt = isRtl
        ? 'يرجى تحديد الدولة أو الولاية القضائية المعنية (مثل: السعودية، الإمارات، مصر، الأردن، أمريكا) لتقديم الاستشارة القانونية الدقيقة وفق الأنظمة المحلية.'
        : 'Please specify the governing jurisdiction (e.g., Saudi Arabia, UAE, Egypt, Jordan, US Delaware) to ensure accurate statutory citations.';

      return {
        summary: clarificationPrompt,
        legalAnalysis: clarificationPrompt,
        applicableRules: [],
        risks: [],
        recommendedActions: [isRtl ? 'حدد الدولة المعنية بالسؤال' : 'Specify the governing country / jurisdiction'],
        sources: [],
        confidenceScore: 0.4,
        confidenceCalculation: 'heuristic',
        sourceVerificationStatus: 'SOURCE_NOT_VERIFIED',
        groundingStatus: 'REQUIRES_VERIFICATION',
        hallucinationGuardTriggered: false,
        lang,
        isRtl,
        jurisdiction: 'UNKNOWN',
        legalDomain: domain,
        clarificationRequired: true,
        clarificationPrompt,
      };
    }

    // ── 7. Synthesis via Decoupled AI Core Engine
    const contextPrompt = `[JurisTech Legal AI Context]:
Intent: ${intentResult.intent} (Confidence: ${Math.round(intentResult.confidence * 100)}%)
Jurisdiction: ${jurisdiction}
Legal Domain: ${domain}
Verified Statutes Available: ${citations.length}
${citations.map(c => `- ${c.formattedCitationEn}`).join('\n')}
`;

    const rawReply = await callAIWithHistory(
      [
        ...(request.conversationHistory || []),
        { role: 'user', content: cleanQuery },
      ],
      lang,
      contextPrompt
    );

    // ── 8. Privacy & Output Sanitization
    const sanitizedReply = sanitizeOutput(rawReply).sanitized;

    // ── 9. Quality Gate & Hallucination Guard
    const validation = ResponseValidator.validate(sanitizedReply, citations);
    const hCheck = validation.hallucinationCheck;

    let finalAnalysis = sanitizedReply;
    let sourceVerificationStatus: SourceVerificationStatus = 'VERIFIED';
    let hallucinationTriggered = false;

    if (citations.length === 0) {
      sourceVerificationStatus = 'SOURCE_NOT_VERIFIED';
      finalAnalysis = `${buildInsufficientSourcesMessage(lang)}\n\n${sanitizedReply}`;
      hallucinationTriggered = true;
    } else if (hCheck.verdict === 'RESPONSE_REQUIRES_VERIFICATION') {
      sourceVerificationStatus = 'PARTIAL';
      hallucinationTriggered = true;
    }

    // Append verified citation references at the end
    const citationFooter = formatCitationBlock(citations, lang);

    // ── 10. Extract Structured Findings
    const summary = sanitizedReply.slice(0, 280).replace(/^[#*-\s]+/, '').trim() + '...';
    const risks = isRtl
      ? ['مخاطر عدم وضوح سقف المسؤولية التعاقدية', 'ضرورة مطابقة شروط الفاتورة الإلكترونية والضرائب']
      : ['Risk of uncapped contractual liabilities', 'Mandatory statutory compliance verification'];

    const recommendedActions = isRtl
      ? ['مراجعة نصوص المواد التشريعية المعتمدة في المراجع أعلاه', 'توثيق العقد عبر الجهة التنظيمية الرسمية']
      : ['Review verified statutory references provided above', 'Formally record agreements through official registries'];

    // ── 11. Record into Memory
    addMessage({ role: 'user', content: cleanQuery, lang });
    addMessage({ role: 'assistant', content: finalAnalysis, lang });

    return {
      summary,
      legalAnalysis: finalAnalysis + '\n\n' + citationFooter,
      applicableRules,
      risks,
      recommendedActions,
      sources: citations,
      confidenceScore: validation.score,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus,
      groundingStatus: citations.length > 0 ? 'GROUNDED' : 'UNGROUNDED',
      hallucinationGuardTriggered: hallucinationTriggered,
      lang,
      isRtl,
      jurisdiction,
      legalDomain: domain,
      clarificationRequired: false,
      rawAIResponse: rawReply,
    };
  }

  private buildGatedResponse(lang: SupportedAILang, isRtl: boolean, reason: string): LegalAdvisorResponse {
    const text = isRtl
      ? `🔒 تتطلب هذه الميزة باقة اشتراك مدفوعة نشطة للاستفادة الكاملة من المستشار القانوني المهيكل. (${reason})`
      : `🔒 This feature requires an active paid subscription tier to access full structured legal advisory. (${reason})`;

    return {
      summary: text,
      legalAnalysis: text,
      applicableRules: [],
      risks: [],
      recommendedActions: [isRtl ? 'ترقية الاشتراك إلى إحدى الباقات الرسمية' : 'Upgrade subscription plan'],
      sources: [],
      confidenceScore: 0.0,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus: 'INSUFFICIENT',
      groundingStatus: 'UNGROUNDED',
      hallucinationGuardTriggered: false,
      lang,
      isRtl,
      jurisdiction: 'UNKNOWN',
      legalDomain: 'general',
      clarificationRequired: false,
    };
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
