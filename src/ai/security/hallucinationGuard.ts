/**
 * src/ai/security/hallucinationGuard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Legal Hallucination Detection & Verification Guard
 * Specification: JURISTECH-AI-P0 Phase P0-4, Phase P0-6 & Task 2-D
 *
 * Validates AI responses against verified knowledge base entries.
 * Flags fabricated citations, unverifiable article claims, and unsupported legal rules.
 */

import { GLOBAL_LEGAL_KNOWLEDGE_BASE } from '../../services/legalRAGOrchestrator';
import type { Citation, HallucinationCheckResult, SupportedAILang } from '../types';

const VERIFIED_ARTICLE_SET = new Set<string>(
  GLOBAL_LEGAL_KNOWLEDGE_BASE.map(s => s.id.toLowerCase())
);

/**
 * Validates whether the citations in an AI response are grounded in the verified knowledge base.
 */
export function verifyAIResponseGrounding(
  responseText: string,
  attachedCitations: Citation[]
): HallucinationCheckResult {
  const flags: string[] = [];
  const unverifiedClaims: string[] = [];

  // 1. Verify attached citations against knowledge base IDs
  let verifiedCount = 0;
  for (const citation of attachedCitations) {
    if (citation.isVerified && VERIFIED_ARTICLE_SET.has(citation.id.toLowerCase())) {
      verifiedCount++;
    } else {
      flags.push(`Unverified citation detected: ${citation.id} (${citation.sourceCode})`);
    }
  }

  // 2. Scan response text for potential fabricated article references
  const articleRefRegex = /(?:article|art\.|المادة|مادة|قانون رقم|decree no\.)\s*([0-9]+(?:\/[0-9]+)?)/gi;
  let match: RegExpExecArray | null;
  const detectedArticles: string[] = [];

  while ((match = articleRefRegex.exec(responseText)) !== null) {
    if (match[1] && !detectedArticles.includes(match[1])) {
      detectedArticles.push(match[1]);
    }
  }

  // Check if any referenced article number matches our attached citations
  for (const articleNum of detectedArticles) {
    const isGrounded = attachedCitations.some(
      c => c.articleNumber.toLowerCase().includes(articleNum.toLowerCase()) ||
           c.sourceCode.toLowerCase().includes(articleNum.toLowerCase())
    );
    if (!isGrounded && attachedCitations.length > 0) {
      unverifiedClaims.push(`Referenced article '${articleNum}' without verified citation backing.`);
    }
  }

  // 3. Determine overall verdict
  let verdict: HallucinationCheckResult['verdict'] = 'VERIFIED';
  let passed = true;

  if (attachedCitations.length === 0) {
    verdict = 'SOURCE_NOT_VERIFIED';
    passed = false;
    flags.push('No verified statutory citations were attached to this legal advice.');
  } else if (flags.length > 0 || unverifiedClaims.length > 2) {
    verdict = 'RESPONSE_REQUIRES_VERIFICATION';
    passed = false;
  } else if (unverifiedClaims.length > 0) {
    verdict = 'PARTIAL';
    passed = true;
  }

  return {
    passed,
    flags,
    verifiedCitationCount: verifiedCount,
    unverifiedClaims,
    verdict,
  };
}

/** Alias matching JURISTECH-AI-P0 spec */
export function checkForHallucination(
  responseText: string,
  attachedCitations: Citation[]
): HallucinationCheckResult {
  return verifyAIResponseGrounding(responseText, attachedCitations);
}

/**
 * Builds an explicit insufficient sources message when no grounded citations exist.
 */
export function buildInsufficientSourcesMessage(lang: SupportedAILang = 'en'): string {
  const isAr = lang === 'ar';
  return isAr
    ? '⚠️ **حالة التوثيق (SOURCE_NOT_VERIFIED):** تعذر العثور على نصوص نظامية موثقة كافية لهذا الاستفسار بدقة عالية. يرجى توضيح الولاية القضائية أو تزويدنا ببيانات إضافية.'
    : '⚠️ **Verification Status (SOURCE_NOT_VERIFIED):** Insufficient verified statutory sources were identified for this query. Please clarify the target jurisdiction or provide additional context.';
}
