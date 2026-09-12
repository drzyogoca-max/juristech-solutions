/**
 * src/hooks/useDailyQuota.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Authoritative Daily AI Quota Hook
 * Sprint 06 Priority #1: In-App Quota Meter
 *
 * Guarantees:
 *  1. Authoritative Data: Directly queries public.user_usage_ledger via Supabase.
 *  2. Non-mutating: Uses read-only SELECT (auth.uid() = user_id RLS policy).
 *  3. Zero LocalStorage: Never relies on client storage for quota counts.
 *  4. Single Source of Truth: Mirrors the exact ledger row incremented by check_and_increment_usage.
 *  5. Race-Condition Protection: Internal guard prevents concurrent duplicate refreshes.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';
import { TIER_CONFIGS } from '../ai/security/tierAccessGuard';

export interface DailyQuotaState {
  remaining: number | null;
  limit: number;
  used: number | null;
  loading: boolean;
  isExhausted: boolean;
  refresh: () => Promise<void>;
}

export const CANONICAL_TRIAL_DAILY_LIMIT = TIER_CONFIGS.free.maxDailyQueries;

/**
 * Derives UTC date string (YYYY-MM-DD) matching subscriptionResolver.getUtcDailyPeriodKey
 */
export function getUtcDailyPeriodKey(date: Date = new Date()): string {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useDailyQuota(isTrialUser: boolean = true): DailyQuotaState {
  const { user } = useAuth();
  const [used, setUsed] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isRefreshingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const userId = user?.id || null;

  const fetchQuota = useCallback(async () => {
    // Paid users or unauthenticated visitors do not query trial quota
    if (!userId || !isTrialUser) {
      if (isMountedRef.current) {
        setUsed(null);
        setLoading(false);
      }
      return;
    }

    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      const today = getUtcDailyPeriodKey();
      const { data, error } = await supabase
        .from('user_usage_ledger')
        .select('ai_queries_executed')
        .eq('user_id', userId)
        .eq('period_key', today)
        .maybeSingle();

      if (isMountedRef.current) {
        if (error) {
          console.warn('[useDailyQuota] Error fetching usage ledger:', error.message);
          setUsed(null);
        } else {
          const queriesCount = Number(data?.ai_queries_executed || 0);
          setUsed(queriesCount);
        }
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.warn('[useDailyQuota] Unexpected error fetching quota:', err?.message || err);
        setUsed(null);
      }
    } finally {
      isRefreshingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId, isTrialUser]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchQuota();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchQuota]);

  const remaining = used !== null ? Math.max(0, CANONICAL_TRIAL_DAILY_LIMIT - used) : null;
  const isExhausted = remaining !== null && remaining === 0;

  return {
    remaining,
    limit: CANONICAL_TRIAL_DAILY_LIMIT,
    used,
    loading,
    isExhausted,
    refresh: fetchQuota,
  };
}
