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
      jurisdiction: forceJurisdiction || 'UNKNOWN',
      legalDomain: forceDomain || 'general',
      clarificationRequired: false,
    };
  }

  // 2. PII Sanitization
  const sanitizeResult = sanitizeQuery(query);
  const cleanQuery = sanitizeResult.sanitized;

  // 3. Jurisdiction & Domain Detection
  const jurisdiction: JurisdictionCode =
    forceJurisdiction || detectJurisdictionFromQuery(cleanQuery) || 'UNKNOWN';
  const domain: LegalDomain = forceDomain || detectLegalDomain(cleanQuery) || 'general';
  // P0 legal-safety gate: do not synthesize jurisdiction-specific advice without a governing jurisdiction.
  if (jurisdiction === 'UNKNOWN') {
    return {
      summary: isAr ? '\u0644\u0627 \u064a\u0645\u0643\u0646 \u062a\u0642\u062f\u064a\u0645 \u0631\u0623\u064a \u0642\u0627\u0646\u0648\u0646\u064a \u0645\u0648\u062b\u0648\u0642 \u0642\u0628\u0644 \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0627\u062e\u062a\u0635\u0627\u0635.' : 'A reliable legal opinion requires the governing jurisdiction to be identified first.',
      legalAnalysis: isAr ? '\u062a\u0645 \u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0644\u0645\u0646\u0639 \u062a\u0637\u0628\u064a\u0642 \u0642\u0627\u0646\u0648\u0646 \u0627\u062e\u062a\u0635\u0627\u0635 \u062e\u0627\u0637\u0626. \u062d\u062f\u062f \u0627\u0644\u062f\u0648\u0644\u0629 \u0623\u0648 \u0627\u0644\u0648\u0644\u0627\u064a\u0629 \u0627\u0644\u0642\u0636\u0627\u0626\u064a\u0629 \u0627\u0644\u0645\u0639\u0646\u064a\u0629.' : 'Analysis is paused to prevent cross-jurisdiction contamination. Specify the country or jurisdiction first.',
      applicableRules: [],
      risks: [isAr ? '\u0627\u0644\u0627\u062e\u062a\u0635\u0627\u0635 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a \u063a\u064a\u0631 \u0645\u062d\u062f\u062f.' : 'Governing jurisdiction is unspecified.'],
      recommendedActions: [isAr ? '\u062d\u062f\u062f \u0627\u0644\u062f\u0648\u0644\u0629 \u0623\u0648 \u0627\u0644\u0648\u0644\u0627\u064a\u0629 \u0627\u0644\u0642\u0636\u0627\u0626\u064a\u0629 \u0648\u0627\u0644\u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u062d\u0627\u0643\u0645 \u062b\u0645 \u0623\u0639\u062f \u0627\u0644\u062a\u062d\u0644\u064a\u0644.' : 'Specify the governing country, jurisdiction, and law, then rerun the analysis.'],
      sources: [], confidenceScore: 0, confidenceCalculation: 'evidence_based',
      sourceVerificationStatus: 'SOURCE_NOT_VERIFIED', groundingStatus: 'REQUIRES_VERIFICATION',
      hallucinationGuardTriggered: true, lang, isRtl, jurisdiction: 'UNKNOWN', legalDomain: domain,
      clarificationRequired: true,
      clarificationPrompt: isAr ? '\u0645\u0627 \u0647\u064a \u0627\u0644\u062f\u0648\u0644\u0629 \u0623\u0648 \u0627\u0644\u0648\u0644\u0627\u064a\u0629 \u0627\u0644\u0642\u0636\u0627\u0626\u064a\u0629 \u0627\u0644\u0645\u0639\u0646\u064a\u0629\u061f' : 'Which country or jurisdiction governs this matter?',
    };
  }

  // 4. Semantic Search & Source Ranking
  const searchResults = semanticSearch(cleanQuery, {
    lang,
    jurisdiction,
    domain: domain !== 'general' ? domain : undefined,
    topK: 6,
    minScore: 0.2,
  });

  const rankedSources = rankSources(searchResults, jurisdiction);
  const dedupedSources = deduplicateSources(rankedSources);
  const citations = buildCitations(dedupedSources);
  const applicableStatutes = dedupedSources.map(s => s.statute);
  // Evidence gate: never present synthesized legal conclusions as grounded advice when retrieval returns no authoritative source.
  if (citations.length === 0) {
    return {
      summary: isAr ? '\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0645\u0635\u062f\u0631 \u0642\u0627\u0646\u0648\u0646\u064a \u0645\u0648\u062b\u0648\u0642 \u0643\u0627\u0641\u064d \u0644\u062a\u0642\u062f\u064a\u0645 \u062a\u062d\u0644\u064a\u0644 \u0645\u0648\u062b\u0648\u0642.' : 'No authoritative legal source was retrieved with sufficient evidence for a grounded legal conclusion.',
      legalAnalysis: isAr ? '\u062a\u0645 \u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u062d\u0645\u0627\u064a\u0629\u064b \u0644\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0645\u0646 \u0627\u0644\u0627\u0633\u062a\u0646\u062a\u0627\u062c \u0628\u0644\u0627 \u0645\u0635\u062f\u0631 \u0642\u0627\u0646\u0648\u0646\u064a \u0645\u0639\u062a\u0645\u062f.' : 'Analysis is paused rather than inventing or generalizing a legal rule without supporting authority.',
      applicableRules: [],
      risks: [isAr ? '\u0646\u0642\u0635 \u0627\u0644\u0623\u062f\u0644\u0629 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629 \u0627\u0644\u0645\u0633\u0646\u062f\u0629.' : 'Insufficient authoritative legal evidence.'],
      recommendedActions: [isAr ? '\u062d\u062f\u062f \u0627\u0644\u0627\u062e\u062a\u0635\u0627\u0635 \u0648\u0627\u0644\u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u062d\u0627\u0643\u0645 \u0623\u0648 \u0642\u062f\u0645 \u0645\u0635\u062f\u0631\u0627\u064b \u0642\u0627\u0646\u0648\u0646\u064a\u0627\u064b \u0645\u0648\u062b\u0648\u0642\u0627\u064b \u0644\u0644\u0645\u0631\u0627\u062c\u0639\u0629.' : 'Specify the governing jurisdiction or provide authoritative legal material for verification.'],
      sources: [], confidenceScore: 0, confidenceCalculation: 'evidence_based',
      sourceVerificationStatus: 'SOURCE_NOT_VERIFIED', groundingStatus: 'REQUIRES_VERIFICATION',
      hallucinationGuardTriggered: true, lang, isRtl, jurisdiction, legalDomain: domain,
      clarificationRequired: true,
      clarificationPrompt: isAr ? '\u0647\u0644 \u064a\u0645\u0643\u0646\u0643 \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u062f\u0648\u0644\u0629 \u0648\u0627\u0644\u0627\u062e\u062a\u0635\u0627\u0635 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u061f' : 'Can you specify the governing country and jurisdiction?',
    };
  }

  // 5. Calculate Confidence Score based on top retrieved sources
  let confidenceScore = 0;
  if (dedupedSources.length > 0) {
    const topScore = dedupedSources[0].finalScore;
    confidenceScore = Math.max(0, Math.min(1, topScore));
  }

  // 6. Synthesize Structured Response Sections
  const topStatute = applicableStatutes[0];
  let summary = '';
  let legalAnalysis = '';
  const risks: string[] = [];
  const recommendedActions: string[] = [];

  if (isAr) {
    if (topStatute) {
      summary = `تمت مطابقة الاستفسار مع ${topStatute.countryNameAr} ومع المصدر ${topStatute.sourceCode} (${topStatute.articleNumber}). النتيجة أدناه مقصورة على النص القانوني المسترجع ولا تتجاوز نطاقه.`;
      legalAnalysis =
        `التحليل النظامي:\n` +
        (topStatute.contentAr ? `النص القانوني المسترجع: "${topStatute.contentAr}"` : `لم يتوفر نص تشريعي كافٍ للمادة ${topStatute.articleNumber} في قاعدة المعرفة.`) +
        `\n\nملاحظات المصدر/السوابق:\n${topStatute.precedentSummaryAr || 'لا توجد خلاصة سوابق مرتبطة بهذا المصدر في قاعدة المعرفة.'}`;

      // Build risks from statutes
      for (const st of applicableStatutes.slice(0, 3)) {
        risks.push(
          `نقطة مراجعة (${st.riskSeverityDefault}): راجع مدى انطباق ${st.sourceCode}، ${st.articleNumber} على الوقائع الفعلية قبل اتخاذ إجراء.`
        );
      }
      if (risks.length === 0) {
        risks.push('خطر عدم تضمين شرط تسوية النزاعات أو القانون الحاكم بدقة.');
      }

      recommendedActions.push(
        `مراجعة الوقائع والمستندات مقابل نطاق ${topStatute.sourceCode}، ${topStatute.articleNumber}.`,
        'التحقق من النسخة النافذة من النص ومذكراته/لوائحه التنفيذية من المصدر الرسمي قبل الاعتماد.',
        'عرض المسألة على محامٍ مرخص عند وجود أثر مالي أو نزاع أو مهلة قانونية.'
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
      summary = `The query was matched to ${topStatute.countryNameEn} and ${topStatute.sourceCode} (${topStatute.articleNumber}). The result is limited to the retrieved legal material and does not extend beyond its scope.`;
      legalAnalysis =
        `Source-grounded analysis:\n` +
        (topStatute.contentEn ? `Retrieved legal text: "${topStatute.contentEn}"` : `The knowledge base does not contain sufficient statutory text for ${topStatute.articleNumber}.`) +
        `\n\nSource/precedent notes:\n${topStatute.precedentSummaryEn || 'No linked precedent summary is available for this source.'}`;

      for (const st of applicableStatutes.slice(0, 3)) {
        risks.push(
          `Review point (${st.riskSeverityDefault}): confirm whether ${st.sourceCode}, ${st.articleNumber} applies to the actual facts before acting.`
        );
      }
      if (risks.length === 0) {
        risks.push('Risk of ambiguous governing law or disputed dispute resolution forum.');
      }

      recommendedActions.push(
        `Review the facts and documents against ${topStatute.sourceCode}, ${topStatute.articleNumber}.`,
        'Verify the currently effective text and implementing regulations from an authoritative official source before relying on it.',
        'Use licensed legal counsel where there is material financial exposure, litigation, or a statutory deadline.'
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

  // Fail closed: never expose a partially grounded legal conclusion to the user.
  if (!hallucinationCheck.passed) {
    return {
      summary: isAr
        ? 'تعذر التحقق من جميع الادعاءات القانونية من المصادر المرتبطة، لذلك لم يتم إصدار نتيجة قانونية نهائية.'
        : 'The legal claims could not all be verified against the attached authorities, so no final legal conclusion was issued.',
      legalAnalysis: isAr
        ? 'تم حجب النتيجة لحماية المستخدم من الاستنتاجات غير الموثقة. يمكن إعادة التحليل بعد توفير مصدر تشريعي موثوق أو سياق قانوني أدق.'
        : 'The result was withheld to prevent unsupported legal conclusions. Re-run with authoritative legal material or more precise context.',
      applicableRules: applicableStatutes,
      risks: [isAr ? 'الأدلة القانونية المرتبطة بالنتيجة غير كافية للتحقق الكامل.' : 'The legal evidence linked to the conclusion is insufficient for full verification.'],
      recommendedActions: [isAr ? 'مراجعة المصادر التشريعية الرسمية وتحديد القانون الحاكم بدقة.' : 'Verify the applicable law against authoritative sources and confirm the governing law.'],
      sources: citations,
      confidenceScore: 0,
      confidenceCalculation: 'evidence_based',
      sourceVerificationStatus: citations.length ? 'PARTIAL' : 'SOURCE_NOT_VERIFIED',
      groundingStatus: 'REQUIRES_VERIFICATION',
      hallucinationGuardTriggered: true,
      lang, isRtl, jurisdiction, legalDomain: domain,
      clarificationRequired: true,
      clarificationPrompt: isAr ? 'يرجى تحديد القانون الحاكم أو تزويد مصدر قانوني موثوق للتحقق.' : 'Please specify the governing law or provide authoritative legal material for verification.',
    };
  }

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
