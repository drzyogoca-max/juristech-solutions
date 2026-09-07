/**
 * src/lib/trialLimits.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — SaaS Contract Usage Limits & Trial Gate
 * Sprint 04B Phase 1: Frontend UX Gating
 *
 * CANONICAL CONTRACT LIMITS:
 *   Free Trial  = 2 total lifetime drafts
 *   Startup     = 10 contracts / month
 *   SMEs / Pro  = 50 contracts / month
 *   Enterprise  = Unlimited (Infinity)
 *
 * SECURITY ENFORCEMENT:
 *   • ZERO localStorage authority for subscription tier, role, or email.
 *   • ZERO hardcoded email or role bypasses.
 *   • Authoritative tier evaluation originates strictly from useSubscription().
 */

const ANON_TRIAL_KEY = 'juristech_anon_trial_v1';
export const MAX_FREE_TRIALS = 2;

export const TIER_CONTRACT_LIMITS = {
  'Free Trial': 2,
  'Startup': 10,
  'SMEs': 50,
  'Pro': 50,
  'Enterprise': Infinity,
} as const;

export type PlanTier = keyof typeof TIER_CONTRACT_LIMITS;

/**
 * Returns the current local anonymous trial counter (for guest sessions)
 */
export function getTrialUsageCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = localStorage.getItem(ANON_TRIAL_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Increments the local anonymous trial counter
 */
export function incrementTrialUsage(): number {
  const current = getTrialUsageCount();
  const updated = current + 1;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ANON_TRIAL_KEY, updated.toString());
    } catch {
      // Ignore storage error
    }
  }
  return updated;
}

/**
 * Backwards compatibility helper
 */
export function getContractUsageCount(): number {
  return getTrialUsageCount();
}

/**
 * Returns canonical contract limit for a given plan tier
 */
export function getContractLimitForTier(tier?: string | null): number {
  if (!tier) return MAX_FREE_TRIALS;
  const clean = tier.trim();
  if (clean === 'Enterprise') return Infinity;
  if (clean === 'SMEs' || clean === 'Pro') return 50;
  if (clean === 'Startup') return 10;
  return MAX_FREE_TRIALS;
}

/**
 * Backwards compatibility wrapper for getContractLimitForTier
 */
export function getContractLimitForCurrentPlan(tier?: string | null): number {
  return getContractLimitForTier(tier);
}

/**
 * Checks whether the user's tier has access to advanced institutional features
 * (Derived strictly from verified tier, NEVER from localStorage)
 */
export function canAccessAdvancedFeatures(tier?: string | null): boolean {
  if (!tier) return false;
  return tier === 'SMEs' || tier === 'Pro' || tier === 'Enterprise';
}

export interface TrialCheckOptions {
  tier?: string | null;
  contractCount?: number;
  isPrivileged?: boolean;
}

/**
 * Evaluates whether contract drafting limit has been reached.
 * ZERO authorization decisions are derived from localStorage values.
 */
export function isTrialLimitReached(options?: TrialCheckOptions): boolean {
  // Privileged override: Admin & Lawyer roles have unlimited contract drafting
  if (options?.isPrivileged) {
    return false;
  }

  const tier = options?.tier || 'Free Trial';
  const limit = getContractLimitForTier(tier);

  if (limit === Infinity) {
    return false;
  }

  // If authenticated user contract count is provided, check against canonical tier quota
  if (typeof options?.contractCount === 'number') {
    return options.contractCount >= limit;
  }

  // Fallback for unauthenticated or initial trial session
  return getTrialUsageCount() >= limit;
}

/**
 * Resets local testing counters
 */
export function resetTrialForTesting(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ANON_TRIAL_KEY);
      localStorage.removeItem('juristech_trial_usage');
      localStorage.removeItem('juristech_contract_usage_count');
      localStorage.removeItem('juristech_subscription_tier');
      localStorage.removeItem('juristech_user_role');
      localStorage.removeItem('juristech_user_email');
    } catch {
      // Ignore
    }
  }
}

