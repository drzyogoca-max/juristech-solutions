/**
 * src/ai/agents/legalResearchAgent.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Legal Research Agent (Facade Layer)
 * Specification: JURISTECH-AI-P0 Phase P0-2, Task 2-A, Task 2-E & Task 2-F
 *
 * Acts as a strict Facade / Adapter over the existing `legalRAGOrchestrator.ts`
 * and `GLOBAL_LEGAL_KNOWLEDGE_BASE`. Orchestrates jurisdiction safety, contextual
 * retrieval, source ranking, and citation building without creating a duplicate RAG.
 */

import {
  GLOBAL_LEGAL_KNOWLEDGE_BASE,
  legalDraftingAgent,
  type LegalStatute,
} from '../../services/legalRAGOrchestrator';
import { buildCitations } from '../retrieval/citationEngine';
import {
  detectJurisdictionFromQuery,
  detectLegalDomain,
  semanticSearch,
} from '../retrieval/semanticSearch';
import { deduplicateSources, rankSources } from '../retrieval/sourceRanking';
import type {
  Citation,
  GroundingStatus,
  JurisdictionCode,
  LegalDomain,
  SourceVerificationStatus,
  SupportedAILang,
} from '../types';

export interface LegalResearchResult {
  statutes: LegalStatute[];
  citations: Citation[];
  jurisdiction: JurisdictionCode;
  domain: LegalDomain;
  confidenceScore: number;
  confidenceCalculation: 'heuristic';
  sourceVerificationStatus: SourceVerificationStatus;
  groundingStatus: GroundingStatus;
  jurisdictionSafetyStatus: 'RESOLVED' | 'JURISDICTION_REQUIRED';
  clarificationRequired: boolean;
  clarificationPrompt?: string;
  reasoningAr?: string;
  reasoningEn?: string;
  redlineAr?: string;
  redlineEn?: string;
}

export class LegalResearchAgent {
  /**
   * Executes structured statutory legal research by bridging to existing RAG assets.
   */
  public static async executeResearch(
    query: string,
    options: {
      lang?: SupportedAILang;
      forceJurisdiction?: JurisdictionCode;
      forceDomain?: LegalDomain;
      topK?: number;
    } = {}
  ): Promise<LegalResearchResult> {
    const lang = options.lang || 'en';
    const isAr = lang === 'ar';

    // 1. Jurisdiction & Domain Resolution
    const detectedJur = detectJurisdictionFromQuery(query);
    const jurisdiction = options.forceJurisdiction || detectedJur;
    const domain = options.forceDomain || detectLegalDomain(query);

    // 2. Jurisdiction Safety Check (Task 2-E)
    if (jurisdiction === 'UNKNOWN' && !query.toLowerCase().includes('international') && query.split(' ').length > 7) {
      const prompt = isAr
        ? 'يرجى تحديد الدولة أو الولاية القضائية المعنية (مثل: السعودية، الإمارات، مصر، الأردن، بريطانيا، أمريكا) لضمان دقة الاستناد التشريعي.'
        : 'Please specify the governing country or legal jurisdiction (e.g., Saudi Arabia, UAE, Egypt, UK, US Delaware) to ensure accurate statutory grounding.';

      return {
        statutes: [],
        citations: [],
        jurisdiction: 'UNKNOWN',
        domain,
        confidenceScore: 0.4,
        confidenceCalculation: 'heuristic',
        sourceVerificationStatus: 'SOURCE_NOT_VERIFIED',
        groundingStatus: 'REQUIRES_VERIFICATION',
        jurisdictionSafetyStatus: 'JURISDICTION_REQUIRED',
        clarificationRequired: true,
        clarificationPrompt: prompt,
      };
    }

    // 3. Contextual Search over existing Knowledge Base
    const searchResults = semanticSearch(query, {
      lang,
      jurisdiction: jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined,
      domain: domain !== 'general' ? domain : undefined,
      topK: options.topK || 5,
    });

    // 4. Source Ranking & Deduplication (Task 2-C)
    const ranked = deduplicateSources(rankSources(searchResults, jurisdiction, domain));

    // 5. Citation Generation (Task 2-D)
    const citations = buildCitations(ranked);
    const statutes = ranked.map(r => r.statute);

    // 6. Synthesis via Existing Legal Drafting Agent
    const drafting = legalDraftingAgent(query, statutes, isAr);

    // 7. Heuristic Confidence & Verification Status Calculation (Task 2-F)
    let sourceVerificationStatus: SourceVerificationStatus = 'VERIFIED';
    let groundingStatus: GroundingStatus = 'GROUNDED';
    let confidenceScore = 0.5;

    if (citations.length === 0) {
      sourceVerificationStatus = 'SOURCE_NOT_VERIFIED';
      groundingStatus = 'UNGROUNDED';
      confidenceScore = 0.35;
    } else if (citations.length === 1 && citations[0].relevanceScore < 0.4) {
      sourceVerificationStatus = 'PARTIAL';
      groundingStatus = 'REQUIRES_VERIFICATION';
      confidenceScore = 0.65;
    } else {
      const topScore = ranked[0]?.finalScore || 0.85;
      confidenceScore = Math.min(0.96, Math.max(0.70, topScore));
    }

    return {
      statutes,
      citations,
      jurisdiction,
      domain,
      confidenceScore,
      confidenceCalculation: 'heuristic',
      sourceVerificationStatus,
      groundingStatus,
      jurisdictionSafetyStatus: 'RESOLVED',
      clarificationRequired: false,
      reasoningAr: drafting.reasoningAr,
      reasoningEn: drafting.reasoningEn,
      redlineAr: drafting.redlineAr,
      redlineEn: drafting.redlineEn,
    };
  }

  /**
   * Retrieves all verified statutes for a specific jurisdiction code.
   */
  public static getStatutesByJurisdiction(jurisdictionCode: JurisdictionCode): LegalStatute[] {
    return GLOBAL_LEGAL_KNOWLEDGE_BASE.filter(s => s.jurisdictionCode === jurisdictionCode);
  }
}
