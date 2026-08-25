/**
 * src/ai/aiCore/responseValidator.ts
 * JurisTech Solutions — Response Validator & Quality Gate
 * Specification: JURISTECH-AI-P0 Phase P0-1 & Phase P0-6
 * Validates responses for length, quality, structure, and integrity before returning to user.
 */

import type { Citation, HallucinationCheckResult } from '../types';
import { checkForHallucination } from '../security/hallucinationGuard';

export interface ValidationReport {
  isValid: boolean;
  score: number; // 0.0 to 1.0
  reasons: string[];
  hallucinationCheck: HallucinationCheckResult;
}

export class ResponseValidator {
  public static validate(
    rawText: string,
    citations: Citation[],
    minConfidence: number = 0.6
  ): ValidationReport {
    const reasons: string[] = [];
    let score = 1.0;

    if (!rawText || rawText.trim().length < 10) {
      return {
        isValid: false,
        score: 0.0,
        reasons: ['Response is empty or too short'],
        hallucinationCheck: {
          passed: false,
          flags: ['empty_response'],
          verifiedCitationCount: 0,
          unverifiedClaims: [],
          verdict: 'INSUFFICIENT',
        },
      };
    }

    const hallucinationCheck = checkForHallucination(rawText, citations);
    if (!hallucinationCheck.passed) {
      score -= 0.25;
      reasons.push(`Hallucination check verdict: ${hallucinationCheck.verdict}`);
    }

    if (citations.length === 0) {
      score -= 0.2;
      reasons.push('Zero verified citations attached');
    }

    const isValid = score >= minConfidence && hallucinationCheck.verdict !== 'RESPONSE_REQUIRES_VERIFICATION';

    return {
      isValid,
      score: Math.max(0.1, Math.min(1.0, score)),
      reasons,
      hallucinationCheck,
    };
  }
}
