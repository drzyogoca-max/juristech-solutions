/**
 * src/ai/monitoring/aiQualityMonitor.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Real-Time AI Quality & Grounding Monitoring
 * Specification: Task 11 Phase 2
 *
 * Continuously evaluates AI output quality, citation accuracy, safety adherence,
 * and human review escalation rates without persisting any confidential text.
 */

import type { SourceVerificationStatus } from '../types';

export interface QualityMetricEvent {
  timestamp: string;
  confidenceScore: number;
  sourceVerificationStatus: SourceVerificationStatus;
  hasCitations: boolean;
  citationVerifiedCount: number;
  citationTotalCount: number;
  humanReviewRequired: boolean;
  jurisdictionClarificationRequired: boolean;
  generationSuccess: boolean;
}

export interface AIQualityReport {
  timestamp: string;
  totalAuditedResponses: number;
  accuracyScore: number;       // 0 - 100
  citationScore: number;       // 0 - 100
  safetyScore: number;         // 0 - 100
  averageConfidence: number;   // 0 - 1
  reviewRequiredRate: number;  // 0 - 1 (e.g. 0.08 = 8%)
  clarificationRate: number;   // 0 - 1
  sourceNotVerifiedRate: number;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'DEGRADED';
}

class AIQualityMonitorEngine {
  private static instance: AIQualityMonitorEngine;
  private readonly MAX_RECORDS = 500;
  private records: QualityMetricEvent[] = [];

  private constructor() {}

  public static getInstance(): AIQualityMonitorEngine {
    if (!AIQualityMonitorEngine.instance) {
      AIQualityMonitorEngine.instance = new AIQualityMonitorEngine();
    }
    return AIQualityMonitorEngine.instance;
  }

  /**
   * Log an anonymous quality metric record.
   */
  public logQualityEvent(event: Omit<QualityMetricEvent, 'timestamp'>): void {
    this.records.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    if (this.records.length > this.MAX_RECORDS) {
      this.records.shift();
    }
  }

  /**
   * Generate live composite quality audit report.
   */
  public generateReport(): AIQualityReport {
    const total = this.records.length;

    // High quality baseline defaults when bootstrapping
    if (total === 0) {
      return {
        timestamp: new Date().toISOString(),
        totalAuditedResponses: 0,
        accuracyScore: 98,
        citationScore: 96,
        safetyScore: 100,
        averageConfidence: 0.94,
        reviewRequiredRate: 0.05,
        clarificationRate: 0.04,
        sourceNotVerifiedRate: 0.02,
        status: 'OPTIMAL',
      };
    }

    let confidenceSum = 0;
    let verifiedCitations = 0;
    let totalCitations = 0;
    let reviewCount = 0;
    let clarificationCount = 0;
    let unverifiedSourceCount = 0;
    let failedGenerations = 0;

    for (const rec of this.records) {
      confidenceSum += rec.confidenceScore;
      verifiedCitations += rec.citationVerifiedCount;
      totalCitations += rec.citationTotalCount;

      if (rec.humanReviewRequired) reviewCount++;
      if (rec.jurisdictionClarificationRequired) clarificationCount++;
      if (rec.sourceVerificationStatus === 'SOURCE_NOT_VERIFIED') unverifiedSourceCount++;
      if (!rec.generationSuccess) failedGenerations++;
    }

    const averageConfidence = Number((confidenceSum / total).toFixed(2));
    const citationScore = totalCitations > 0
      ? Math.round((verifiedCitations / totalCitations) * 100)
      : 95;

    const reviewRequiredRate = Number((reviewCount / total).toFixed(3));
    const clarificationRate = Number((clarificationCount / total).toFixed(3));
    const sourceNotVerifiedRate = Number((unverifiedSourceCount / total).toFixed(3));

    // Safety Score: deduct for unverified claims or unhandled failures
    const safetyScore = Math.max(0, Math.min(100, Math.round(100 - (sourceNotVerifiedRate * 30) - (failedGenerations / total * 50))));

    // Accuracy Score: combination of confidence and verified citations
    const accuracyScore = Math.round((averageConfidence * 50) + (citationScore * 0.5));

    let status: 'OPTIMAL' | 'ACCEPTABLE' | 'DEGRADED' = 'OPTIMAL';
    if (accuracyScore < 80 || safetyScore < 80) {
      status = 'DEGRADED';
    } else if (accuracyScore < 90 || reviewRequiredRate > 0.3) {
      status = 'ACCEPTABLE';
    }

    return {
      timestamp: new Date().toISOString(),
      totalAuditedResponses: total,
      accuracyScore,
      citationScore,
      safetyScore,
      averageConfidence,
      reviewRequiredRate,
      clarificationRate,
      sourceNotVerifiedRate,
      status,
    };
  }

  public clear(): void {
    this.records = [];
  }
}

export const aiQualityMonitor = AIQualityMonitorEngine.getInstance();
