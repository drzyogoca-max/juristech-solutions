/**
 * src/ai/security/tierAccessGuard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — User Tier Access Guard & Quota Enforcement
 * Specification: JURISTECH-AI-P0 Phase P0-4
 */

import type { AccessCheckResult, UserTier } from '../types';

export interface TierQuotaConfig {
  maxDailyQueries: number;
  allowCrossJurisdiction: boolean;
  allowDocGeneration: boolean;
  allowComplianceAudit: boolean;
  allowDeepOcr: boolean;
  allowRedlining: boolean;
}

export const TIER_CONFIGS: Record<UserTier, TierQuotaConfig> = {
  free: {
    maxDailyQueries: 5,
    allowCrossJurisdiction: false,
    allowDocGeneration: false,
    allowComplianceAudit: false,
    allowDeepOcr: false,
    allowRedlining: false,
  },
  startup: {
    maxDailyQueries: 50,
    allowCrossJurisdiction: true,
    allowDocGeneration: true,
    allowComplianceAudit: false,
    allowDeepOcr: true,
    allowRedlining: true,
  },
  sme: {
    maxDailyQueries: 150,
    allowCrossJurisdiction: true,
    allowDocGeneration: true,
    allowComplianceAudit: true,
    allowDeepOcr: true,
    allowRedlining: true,
  },
  pro: {
    maxDailyQueries: 500,
    allowCrossJurisdiction: true,
    allowDocGeneration: true,
    allowComplianceAudit: true,
    allowDeepOcr: true,
    allowRedlining: true,
  },
  enterprise: {
    maxDailyQueries: Infinity,
    allowCrossJurisdiction: true,
    allowDocGeneration: true,
    allowComplianceAudit: true,
    allowDeepOcr: true,
    allowRedlining: true,
  },
  admin: {
    maxDailyQueries: Infinity,
    allowCrossJurisdiction: true,
    allowDocGeneration: true,
    allowComplianceAudit: true,
    allowDeepOcr: true,
    allowRedlining: true,
  },
  lawyer: {
    maxDailyQueries: Infinity,
    allowCrossJurisdiction: true,
    allowDocGeneration: true,
    allowComplianceAudit: true,
    allowDeepOcr: true,
    allowRedlining: true,
  },
};

/**
 * Checks whether the user tier is permitted to perform a requested AI action.
 */
export function checkTierAccess(
  tier: UserTier,
  feature: 'query' | 'doc_generation' | 'compliance_audit' | 'deep_ocr' | 'cross_jurisdiction' | 'redlining',
  currentUsageCount = 0
): AccessCheckResult {
  const config = TIER_CONFIGS[tier] || TIER_CONFIGS.free;

  // Check quota for query execution
  if (feature === 'query') {
    if (currentUsageCount >= config.maxDailyQueries) {
      return {
        allowed: false,
        reason: `Daily query limit reached (${config.maxDailyQueries} queries/day for ${tier} tier).`,
        upgradeRequired: true,
        minimumTier: tier === 'free' ? 'startup' : 'pro',
      };
    }
    return { allowed: true };
  }

  // Feature permission checks
  if (feature === 'doc_generation' && !config.allowDocGeneration) {
    return {
      allowed: false,
      reason: 'Automated legal drafting requires a Startup or Pro subscription.',
      upgradeRequired: true,
      minimumTier: 'startup',
    };
  }

  if (feature === 'compliance_audit' && !config.allowComplianceAudit) {
    return {
      allowed: false,
      reason: 'Deep multi-statute compliance audit requires an SME or Pro subscription.',
      upgradeRequired: true,
      minimumTier: 'sme',
    };
  }

  if (feature === 'deep_ocr' && !config.allowDeepOcr) {
    return {
      allowed: false,
      reason: 'Multi-page document OCR & AI contract breakdown requires a Startup plan or higher.',
      upgradeRequired: true,
      minimumTier: 'startup',
    };
  }

  if (feature === 'cross_jurisdiction' && !config.allowCrossJurisdiction) {
    return {
      allowed: false,
      reason: 'Cross-border multi-jurisdiction comparative law search requires a Startup plan or higher.',
      upgradeRequired: true,
      minimumTier: 'startup',
    };
  }

  if (feature === 'redlining' && !config.allowRedlining) {
    return {
      allowed: false,
      reason: 'Automated contract redline clause substitution requires a Startup plan or higher.',
      upgradeRequired: true,
      minimumTier: 'startup',
    };
  }

  return { allowed: true };
}
