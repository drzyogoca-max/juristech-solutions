/**
 * src/ai/aiCore/legalOrchestrator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Chief Legal AI Intelligence Orchestrator
 * Specification: JURISTECH-AI-P0 Phase P0-1 / P0-3 / P0-4
 *
 * Coordinates PII sanitization, tier checks, multi-statute vector retrieval,
 * grounding verification, and structured multi-lingual response generation.
 */

import { buildCitations } from '../retrieval/citationEngine';
import {
  detectJurisdictionFromQuery,
  detectLegalDomain,
  semanticSearch,
} from '../retrieval/semanticSearch';
import { deduplicateSources, rankSources } from '../retrieval/sourceRanking';
import { verifyAIResponseGrounding } from '../security/hallucinationGuard';
import { sanitizeQuery } from '../security/piiSanitizer';
import { checkTierAccess } from '../security/tierAccessGuard';
import { getOrCreateSession, isDuplicateAdvice, recordTurn } from '../memory/sessionMemory';
import type {
  JurisdictionCode,
  LegalAdvisorResponse,
  LegalDomain,
  OrchestratorRequest,
  SupportedAILang,
} from '../types';

/**
 * Main entry point for executing legal reasoning queries.
 */
export async function executeLegalQuery(
  request: OrchestratorRequest
): Promise<LegalAdvisorResponse> {
  const {
    query,
    lang = 'ar',
    userTier = 'free',
    forceJurisdiction,
    forceDomain,
    conversationHistory = [],
  } = request;

  const isAr = lang === 'ar';
  const isRtl = lang === 'ar';

  // 1. Tier & Quota check
  const tierCheck = checkTierAccess(userTier, 'query');
  if (!tierCheck.allowed) {
    return {
      summary: isAr ? 'تم استنفاد الحد اليومي للاستشارات المجانية.' : 'Daily query limit reached.',
      legalAnalysis: isAr
        ? `عزيزي العميل، لقد بلغت الحد الأقصى للاستفسارات المتاحة لباقة ${userTier}. يرجى الترقية إلى باقة Startup أو Pro للمتابعة دون انقطاع.`
        : `You have reached the maximum daily queries for the ${userTier} tier. Please upgrade to Startup or Pro to continue.`,
      applicableRules: [],
      risks: [isAr ? 'توقف التحليل بسبب الوصول للحد الأقصى' : 'Analysis halted due to quota limit'],
      recommendedActions: [
        isAr ? 'ترقية الاشتراك إلى باقة Pro أو Enterprise' : 'Upgrade subscription to Pro or Enterprise tier',
      ],
      sources: [],
      confidenceScore: 0,
      sourceVerificationStatus: 'INSUFFICIENT',
      hallucinationGuardTriggered: false,
      lang,
      isRtl,
      jurisdiction: forceJurisdiction || 'SA',
      legalDomain: forceDomain || 'general',
      clarificationRequired: false,
    };
  }

  // 2. PII Sanitization
  const sanitizeResult = sanitizeQuery(query);
  const cleanQuery = sanitizeResult.sanitized;

  // 3. Jurisdiction & Domain Detection
  const jurisdiction: JurisdictionCode =
    forceJurisdiction || detectJurisdictionFromQuery(cleanQuery) || 'SA';
  const domain: LegalDomain = forceDomain || detectLegalDomain(cleanQuery) || 'general';

  // 4. Semantic Search & Source Ranking
  const searchResults = semanticSearch(cleanQuery, {
    lang,
    jurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
    domain: domain !== 'general' ? domain : undefined,
    topK: 6,
    minScore: 0.2,
  });

  const rankedSources = rankSources(searchResults, jurisdiction);
  const dedupedSources = deduplicateSources(rankedSources);
  const citations = buildCitations(dedupedSources);
  const applicableStatutes = dedupedSources.map(s => s.statute);

  // 5. Calculate Confidence Score based on top retrieved sources
  let confidenceScore = 0.65;
  if (dedupedSources.length > 0) {
    const topScore = dedupedSources[0].finalScore;
    confidenceScore = Math.min(0.98, Math.max(0.70, topScore));
  }

  // 6. Synthesize Structured Response Sections
  const topStatute = applicableStatutes[0];
  let summary = '';
  let legalAnalysis = '';
  const risks: string[] = [];
  const recommendedActions: string[] = [];

  if (isAr) {
    if (topStatute) {
      summary = `بناءً على فحص التشريعات المنطبقة في ${topStatute.countryNameAr} وخاصة (${topStatute.titleAr})، يتضح وجود متطلبات نظامية دقيقة تحكم هذا الإجراء وتستوجب الامتثال للضوابط القانونية لتفادي البطلان أو الغرامات.`;
      legalAnalysis =
        `التحليل النظامي:\n` +
        `وفقاً لما تقضي به أحكام ${topStatute.sourceCode} وتحديداً ${topStatute.articleNumber}، فإن الالتزام التعاقدي يخضع لمبدأ حسن النية والتوازن العقدي. ` +
        (topStatute.contentAr ? `وينص الحكم النظامي على: "${topStatute.contentAr}" ` : '') +
        `\n\nالسوابق والاتجاه القضائي:\n${topStatute.precedentSummaryAr || 'المحاكم المختصة تشدد على التفسير الضيق للشروط المقيدة للالتزامات.'}`;

      // Build risks from statutes
      for (const st of applicableStatutes.slice(0, 3)) {
        risks.push(
          `خطر (${st.riskSeverityDefault}): مخالفة مقتضيات ${st.articleNumber} مما قد يعرض الالتزام للإبطال القضائي أو فرض تعويضات.`
        );
      }
      if (risks.length === 0) {
        risks.push('خطر عدم تضمين شرط تسوية النزاعات أو القانون الحاكم بدقة.');
      }

      recommendedActions.push(
        `تعديل الصياغة لتتوافق صراحة مع مقتضيات ${topStatute.sourceCode} وتفادي الشروط التعسفية.`,
        'إدراج بند تحكيم واضح أو تحديد الاختصاص القضائي المكاني بدقة.',
        'توثيق المراسلات والإشعارات خطياً عبر الوسائل الرقمية المعتمدة نظاماً.'
      );
    } else {
      summary = 'تم تحليل الاستفسار استناداً إلى القواعد العامة للقانون التجاري والمدني للولاية القضائية المحددة.';
      legalAnalysis = 'يتطلب هذا الإجراء مراجعة تفصيلية لبنود الاتفاق والتأكد من توافر الأركان النظامية (الرضا، المحل، والسبب) ومراعاة عدم مخالفة النظام العام.';
      risks.push('احتمالية غموض التزامات الأطراف في حال غياب بنود التفويض والإنهاء الواضحة.');
      recommendedActions.push(
        'صياغة اتفاقية مفصلة تحدد بدقة نطاق العمل، شروط الدفع، وحالات الإنهاء المبكر.',
        'إجراء فحص نافٍ للجهالة على المستندات التعاقدية.'
      );
    }
  } else {
    // English / Global Synthesis
    if (topStatute) {
      summary = `Based on statutory review under ${topStatute.countryNameEn} jurisprudence, specifically (${topStatute.titleEn}), this matter is governed by statutory standards requiring strict alignment to prevent contractual invalidity or liability exposure.`;
      legalAnalysis =
        `Legal Analysis:\n` +
        `Under ${topStatute.sourceCode} (${topStatute.articleNumber}), contractual obligations must adhere to statutory fairness and commercial reasonableness. ` +
        (topStatute.contentEn ? `Statutory provision states: "${topStatute.contentEn}" ` : '') +
        `\n\nJudicial Precedent:\n${topStatute.precedentSummaryEn || 'Competent tribunals strictly scrutinize one-sided or penal stipulations.'}`;

      for (const st of applicableStatutes.slice(0, 3)) {
        risks.push(
          `Risk (${st.riskSeverityDefault}): Non-compliance with ${st.articleNumber} may expose the agreement to judicial redline or unenforceable penalties.`
        );
      }
      if (risks.length === 0) {
        risks.push('Risk of ambiguous governing law or disputed dispute resolution forum.');
      }

      recommendedActions.push(
        `Redline clauses to align strictly with ${topStatute.sourceCode} requirements.`,
        'Incorporate explicit dispute resolution and arbitration mechanisms.',
        'Maintain authenticated written records and notices for all milestone handovers.'
      );
    } else {
      summary = 'Query analyzed under general commercial and civil law principles for the target jurisdiction.';
      legalAnalysis = 'This matter requires verification of essential contractual formation elements and compliance with regional statutory public policy.';
      risks.push('Risk of ambiguous scope or lack of defined termination triggers.');
      recommendedActions.push(
        'Draft a comprehensive agreement defining performance benchmarks and dispute escalation procedures.',
        'Perform legal due diligence on underlying operational schedules.'
      );
    }
  }

  // 7. Hallucination Guard
  const combinedText = `${summary}\n${legalAnalysis}\n${risks.join('\n')}`;
  const hallucinationCheck = verifyAIResponseGrounding(combinedText, citations);

  // 8. Session Context & Deduplication Update
  const sessionId = request.context?.sessionId || `sess_${Date.now()}`;
  const session = getOrCreateSession(sessionId, {
    lang,
    userTier,
    jurisdiction,
    domain,
  });

  const citedIds = citations.map(c => c.id);
  const isDuplicate = isDuplicateAdvice(sessionId, summary);

  recordTurn(
    sessionId,
    {
      role: 'assistant',
      content: combinedText,
      citedStatuteIds: citedIds,
      summaryKey: summary.slice(0, 80),
    },
    {
      detectedJurisdiction: jurisdiction,
      legalDomain: domain,
    }
  );

  return {
    summary,
    legalAnalysis,
    applicableRules: applicableStatutes,
    risks,
    recommendedActions,
    sources: citations,
    confidenceScore,
    sourceVerificationStatus: hallucinationCheck.verdict === 'VERIFIED' ? 'VERIFIED' : 'PARTIAL',
    hallucinationGuardTriggered: !hallucinationCheck.passed,
    lang,
    isRtl,
    jurisdiction,
    legalDomain: domain,
    clarificationRequired: isDuplicate,
    clarificationPrompt: isDuplicate
      ? (isAr
          ? 'ملاحظة: هذا الموضوع تم تناوله في رسالة سابقة؛ هل ترغب في تخصيص بند محدد أو مراجعة صياغة بديلة؟'
          : 'Note: This issue was referenced in earlier turns. Would you like to deep-dive into a specific clause or alternative redline?')
      : undefined,
  };
}
