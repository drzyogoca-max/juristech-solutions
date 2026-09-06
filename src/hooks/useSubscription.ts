/**
 * src/hooks/useSubscription.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Subscription & Entitlement State Hook for JurisTech Solutions
 * Sprint 03B-1: Database-Backed Subscription Read Path
 * 
 * Single Source of Truth: public.subscriptions (filtered by auth.users.id)
 * Fail-Safe Fallback: Free Trial (zero paid escalation on DB errors or guest sessions)
 * Privileged Override: Admins & Lawyers maintain enterprise operational access
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

export interface SubscriptionState {
  isSubscriber: boolean;
  tier: 'Free Trial' | 'Startup' | 'SMEs' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Expired' | 'Pending Renewal' | 'Cancelled';
  daysLeft: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  loading: boolean;
  cancelSubscription: () => Promise<void>;
  refresh: () => void;
}

export interface DbSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  receipt_id?: string | null;
  activated_at?: string | null;
  expires_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Normalizes database plan_id / plan_name to canonical application plan tier
 */
export function mapPlanIdToTier(planId?: string | null, planName?: string | null): 'Free Trial' | 'Startup' | 'SMEs' | 'Pro' | 'Enterprise' {
  const combined = `${planId || ''} ${planName || ''}`.trim().toLowerCase();
  if (!combined) return 'Free Trial';
  if (combined.includes('enterprise') || combined.includes('مؤسسات') || combined.includes('كبرى')) return 'Enterprise';
  if (combined.includes('sme') || combined.includes('متوسطة')) return 'SMEs';
  if (combined.includes('pro') || combined.includes('احترافي')) return 'Pro';
  if (combined.includes('startup') || combined.includes('ناشئة') || combined.includes('صغرى') || combined.includes('رواد')) return 'Startup';
  return 'Startup';
}

/**
 * Maps database subscription status to UI display status
 */
export function mapDbStatus(status?: string | null): 'Active' | 'Expired' | 'Pending Renewal' | 'Cancelled' {
  if (!status) return 'Expired';
  const clean = status.trim().toLowerCase();
  if (clean === 'active') return 'Active';
  if (clean === 'cancelled' || clean === 'canceled') return 'Cancelled';
  if (clean === 'pending' || clean === 'pending_renewal') return 'Pending Renewal';
  if (clean === 'expired') return 'Expired';
  return 'Expired';
}

/**
 * Validates whether a database subscription record is active and unexpired
 */
export function isSubscriptionActive(sub: DbSubscription | null): boolean {
  if (!sub) return false;
  if (sub.status?.toLowerCase() !== 'active') return false;
  if (!sub.expires_at) return true; // Null expires_at represents indefinite active term
  const expiry = new Date(sub.expires_at);
  if (isNaN(expiry.getTime())) return false;
  return expiry.getTime() > Date.now();
}

export function useSubscription(): SubscriptionState {
  const { user, isAdmin, isLawyer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dbSub, setDbSub] = useState<DbSubscription | null>(null);

  const userId = user?.id || null;
  const isPrivilegedRole = Boolean(isAdmin || isLawyer);

  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setDbSub(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan_id, plan_name, status, receipt_id, activated_at, expires_at, created_at, updated_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[useSubscription] DB read error, failing safe to free trial:', error.message);
        setDbSub(null);
      } else {
        setDbSub(data as DbSubscription | null);
      }
    } catch (err: any) {
      console.warn('[useSubscription] Unexpected query exception, failing safe to free trial:', err?.message || err);
      setDbSub(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!userId) {
        if (isMounted) {
          setDbSub(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, user_id, plan_id, plan_name, status, receipt_id, activated_at, expires_at, created_at, updated_at')
          .eq('user_id', userId)
          .maybeSingle();

        if (isMounted) {
          if (error) {
            console.warn('[useSubscription] DB read error, failing safe to free trial:', error.message);
            setDbSub(null);
          } else {
            setDbSub(data as DbSubscription | null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('[useSubscription] Unexpected query exception, failing safe to free trial:', err?.message || err);
          setDbSub(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Entitlement Evaluation Logic
  const isDbActive = isSubscriptionActive(dbSub);
  const isSubscriber = isPrivilegedRole || isDbActive;

  // Plan Tier Derivation
  const rawTier = dbSub ? mapPlanIdToTier(dbSub.plan_id, dbSub.plan_name) : 'Free Trial';
  const tier: 'Free Trial' | 'Startup' | 'SMEs' | 'Pro' | 'Enterprise' = isPrivilegedRole
    ? 'Enterprise'
    : (isDbActive ? rawTier : 'Free Trial');

  // Status Derivation
  const rawStatus = dbSub ? mapDbStatus(dbSub.status) : 'Expired';
  const effectiveStatus = (dbSub && dbSub.status?.toLowerCase() === 'active' && !isDbActive)
    ? 'Expired'
    : rawStatus;
  const status: 'Active' | 'Expired' | 'Pending Renewal' | 'Cancelled' = isPrivilegedRole
    ? 'Active'
    : (isDbActive ? 'Active' : effectiveStatus);

  // Remaining Period Days
  let daysLeft = 0;
  if (isPrivilegedRole) {
    daysLeft = 365;
  } else if (isDbActive && dbSub) {
    if (dbSub.expires_at) {
      const expiry = new Date(dbSub.expires_at);
      daysLeft = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    } else {
      daysLeft = 365;
    }
  }

  // Dates
  const startDate = dbSub?.activated_at
    ? new Date(dbSub.activated_at).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10);

  const endDate = dbSub?.expires_at
    ? new Date(dbSub.expires_at).toISOString().substring(0, 10)
    : new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10);

  const paymentMethod = dbSub?.receipt_id
    ? 'Verified Payment Receipt'
    : (isDbActive ? 'Active Subscription' : 'None');

  const cancelSubscription = useCallback(async () => {
    if (dbSub?.id && userId) {
      try {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('id', dbSub.id)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('[useSubscription] cancel subscription error:', err);
      }
    }
    await fetchSubscription();
  }, [dbSub?.id, userId, fetchSubscription]);

  return {
    isSubscriber,
    tier,
    status,
    daysLeft,
    startDate,
    endDate,
    paymentMethod,
    loading,
    cancelSubscription,
    refresh: fetchSubscription,
  };
}
