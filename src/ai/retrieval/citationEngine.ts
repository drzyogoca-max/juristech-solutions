/**
 * src/ai/retrieval/citationEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Verified Legal Citation Engine
 * Specification: JURISTECH-AI-P0 Phase P0-3 & Task 2-D
 *
 * Extracts and formats verified statutory citations from GLOBAL_LEGAL_KNOWLEDGE_BASE.
 * Strictly blocks hallucinated / fabricated citations and tags unverified claims
 * with explicit SOURCE_NOT_VERIFIED status.
 */

import type { LegalStatute } from '../../services/legalRAGOrchestrator';
import { GLOBAL_LEGAL_KNOWLEDGE_BASE } from '../../services/legalRAGOrchestrator';
import type { Citation, JurisdictionCode, SupportedAILang } from '../types';
import type { RankedSource } from './sourceRanking';

// Build a fast lookup index of all verified statutes
const KB_INDEX = new Map<string, LegalStatute>(
  GLOBAL_LEGAL_KNOWLEDGE_BASE.map(s => [s.id, s])
);

export const SOURCE_NOT_VERIFIED_STATUS = 'SOURCE_NOT_VERIFIED';

/**
 * Formats a verified statute into a standard structured Citation.
 */
export function formatCitation(
  statute: LegalStatute,
  relevanceScore: number,
  authorityLevel: Citation['authorityLevel'] = 'Primary_Statute'
): Citation {
  const isVerified = KB_INDEX.has(statute.id);
  const en = `${statute.sourceCode}, ${statute.articleNumber} — ${statute.titleEn}`;
  const ar = `${statute.sourceCode}، ${statute.articleNumber} — ${statute.titleAr}`;

  return {
    id: statute.id,
    sourceCode: statute.sourceCode,
    articleNumber: statute.articleNumber,
    titleEn: statute.titleEn,
    titleAr: statute.titleAr,
    jurisdictionCode: statute.jurisdictionCode as JurisdictionCode,
    countryNameEn: statute.countryNameEn,
    countryNameAr: statute.countryNameAr,
    relevanceScore,
    formattedCitationEn: en,
    formattedCitationAr: ar,
    authorityLevel,
    isVerified,
  };
}

/**
 * Converts ranked search results into verified citations.
 * Skips any source not found in the verified knowledge base.
 */
export function buildCitations(rankedSources: RankedSource[]): Citation[] {
  return rankedSources
    .filter(r => KB_INDEX.has(r.statute.id))
    .map(r => formatCitation(r.statute, r.finalScore, r.authorityLevel));
}

/**
 * Verifies that a citation ID exists in the knowledge base.
 */
export function isCitationVerified(id: string): boolean {
  return KB_INDEX.has(id);
}

/**
 * Correlates legal claims with verified citations.
 * Returns linked pairs or flags claims as SOURCE_NOT_VERIFIED.
 */
export function linkClaimsToCitations(
  claims: string[],
  citations: Citation[]
): Array<{ claim: string; citationId?: string; status: 'VERIFIED' | 'SOURCE_NOT_VERIFIED' }> {
  return claims.map(claim => {
    const claimLower = claim.toLowerCase();
    const matchedCitation = citations.find(c => {
      const artNum = c.articleNumber.toLowerCase().replace(/^(art\.|مادة|المادة)\s*/, '').trim();
      return (
        claimLower.includes(c.sourceCode.toLowerCase()) ||
        claimLower.includes(c.id.toLowerCase()) ||
        (artNum.length > 1 && claimLower.includes(artNum))
      );
    });

    if (matchedCitation && matchedCitation.isVerified) {
      return {
        claim,
        citationId: matchedCitation.id,
        status: 'VERIFIED',
      };
    }

    return {
      claim,
      status: 'SOURCE_NOT_VERIFIED',
    };
  });
}

/**
 * Formats citations as a readable Markdown reference block for the UI.
 */
export function formatCitationBlock(citations: Citation[], lang: SupportedAILang = 'en'): string {
  if (citations.length === 0) {
    return lang === 'ar'
      ? '⚠️ **حالة التوثيق (SOURCE_NOT_VERIFIED):** لم يتم العثور على مصادر نظامية موثقة كافية في قاعدة المعرفة لهذا الاستفسار.'
      : '⚠️ **Verification Status (SOURCE_NOT_VERIFIED):** Insufficient verified statutory sources found in the knowledge base.';
  }

  const isRtl = lang === 'ar';
  const header = isRtl ? '📚 **المصادر القانونية الموثقة (Verified Sources):**' : '📚 **Verified Legal Sources:**';
  const lines = citations.map((c, i) => {
    const text = isRtl ? c.formattedCitationAr : c.formattedCitationEn;
    const score = Math.round(c.relevanceScore * 100);
    const auth = c.authorityLevel ? ` [${c.authorityLevel}]` : '';
    return `${i + 1}. ${text}${auth} _(${isRtl ? 'درجة الملاءمة التقديرية' : 'Heuristic Relevance'}: ${score}%)_`;
  });

  return `${header}\n${lines.join('\n')}`;
}
