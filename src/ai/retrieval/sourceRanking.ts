/**
 * src/ai/retrieval/sourceRanking.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Factor Legal Source Ranking Engine
 * Specification: JURISTECH-AI-P0 Phase P0-3 & Task 2-C
 *
 * Ranks retrieved legal statutes across 6 objective criteria:
 *  1. Jurisdiction match
 *  2. Legal-domain correlation
 *  3. Source authority level (Royal Decree, Primary Statute, Federal Code, Treaty)
 *  4. Citation validity & Knowledge base presence
 *  5. Direct query relevance & keyword density
 *  6. Legislative recency & active validity status
 */

import { GLOBAL_LEGAL_KNOWLEDGE_BASE } from '../../services/legalRAGOrchestrator';
import type { JurisdictionCode, LegalDomain } from '../types';
import type { SemanticSearchResult } from './semanticSearch';

export interface RankedSource extends SemanticSearchResult {
  finalScore: number;
  rankReason: string[];
  authorityLevel: 'Primary_Statute' | 'Royal_Decree' | 'Treaty' | 'Executive_Regulation' | 'Precedent';
  isCitationValid: boolean;
}

const KB_ID_SET = new Set<string>(GLOBAL_LEGAL_KNOWLEDGE_BASE.map(s => s.id));

function determineAuthority(sourceCode: string): RankedSource['authorityLevel'] {
  const code = sourceCode.toLowerCase();
  if (code.includes('royal decree') || code.includes('مرسوم ملكي') || code.includes('m/191') || code.includes('m/132')) {
    return 'Royal_Decree';
  }
  if (code.includes('treaty') || code.includes('cisg') || code.includes('uncitral') || code.includes('icc') || code.includes('gdpr')) {
    return 'Treaty';
  }
  if (code.includes('civil code') || code.includes('commercial code') || code.includes('federal decree') || code.includes('law no.')) {
    return 'Primary_Statute';
  }
  if (code.includes('court') || code.includes('precedent') || code.includes('scca') || code.includes('lcia')) {
    return 'Precedent';
  }
  return 'Executive_Regulation';
}

export function rankSources(
  results: SemanticSearchResult[],
  preferredJurisdiction?: JurisdictionCode,
  preferredDomain?: LegalDomain
): RankedSource[] {
  return results.map(r => {
    let bonus = 0;
    const reasons: string[] = [];

    // 1. Jurisdiction match bonus (+0.25)
    if (preferredJurisdiction && preferredJurisdiction !== 'UNKNOWN') {
      if (r.statute.jurisdictionCode === preferredJurisdiction) {
        bonus += 0.25;
        reasons.push('jurisdiction_exact_match');
      } else if (r.statute.jurisdictionCode === 'INTL') {
        bonus += 0.10;
        reasons.push('international_treaty_fallback');
      }
    }

    // 2. Legal-domain match bonus (+0.15)
    if (preferredDomain && preferredDomain !== 'general') {
      const statuteText = (r.statute.titleEn + ' ' + r.statute.titleAr + ' ' + r.statute.relevanceKeywords.join(' ')).toLowerCase();
      if (statuteText.includes(preferredDomain.toLowerCase())) {
        bonus += 0.15;
        reasons.push('domain_alignment');
      }
    }

    // 3. Source authority level bonus (+0.15)
    const authority = determineAuthority(r.statute.sourceCode);
    if (authority === 'Royal_Decree' || authority === 'Treaty') {
      bonus += 0.15;
      reasons.push(`high_authority_${authority.toLowerCase()}`);
    } else if (authority === 'Primary_Statute') {
      bonus += 0.10;
      reasons.push('primary_statute_authority');
    }

    // 4. Citation validity check (+0.10)
    const isCitationValid = KB_ID_SET.has(r.statute.id);
    if (isCitationValid) {
      bonus += 0.10;
      reasons.push('verified_in_knowledge_base');
    }

    // 5. Risk severity weighting
    if (r.statute.riskSeverityDefault === 'Critical') {
      bonus += 0.10;
      reasons.push('critical_statutory_severity');
    } else if (r.statute.riskSeverityDefault === 'High') {
      bonus += 0.05;
      reasons.push('high_statutory_severity');
    }

    // 6. Recency / active status (2026/2024 active frameworks)
    if (r.statute.sourceCode.includes('2022') || r.statute.sourceCode.includes('2021') || r.statute.sourceCode.includes('191') || r.statute.sourceCode.includes('132')) {
      bonus += 0.05;
      reasons.push('recent_legislative_enactment');
    }

    const finalScore = Math.min(0.99, Math.max(0.1, r.relevanceScore + bonus));

    return {
      ...r,
      finalScore,
      rankReason: reasons,
      authorityLevel: authority,
      isCitationValid,
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

export function deduplicateSources(ranked: RankedSource[]): RankedSource[] {
  const seen = new Set<string>();
  return ranked.filter(r => {
    if (seen.has(r.statute.id)) return false;
    seen.add(r.statute.id);
    return true;
  });
}
