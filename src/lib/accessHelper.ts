/**
 * src/lib/accessHelper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Paid Subscription Access & Entitlement Decision Helper
 * Rules:
 *  - Treat 'active' AND 'trialing' as access-granting.
 *  - Do NOT revoke access if a scheduled_change (to cancel/pause in the future) exists
 *    as long as status is still 'active' or 'trialing'.
 *  - Revoke access only when status is actually 'canceled', 'cancelled', 'paused', or 'past_due'.
 */

import { supabase } from './supabaseClient';

export interface SubscriptionStatusQuery {
  status: string; // e.g. 'active', 'trialing', 'canceled', 'paused', 'past_due'
  scheduledChangeAction?: string | null; // e.g. 'cancel', 'pause'
  scheduledChangeAt?: string | null;
}

/**
 * Pure access decision helper: returns true if subscription currently grants paid access.
 */
export function hasPaidAccess(
  status: string | null | undefined,
  _scheduledChangeAction?: string | null
): boolean {
  if (!status) return false;
  const normalizedStatus = status.toLowerCase().trim();

  // Active and trialing subscriptions grant paid access
  if (normalizedStatus === 'active' || normalizedStatus === 'trialing') {
    return true;
  }

  // Revoked for canceled, cancelled, past_due, paused, expired
  return false;
}

/**
 * Checks whether a user (by email) currently has paid Pro / Enterprise access.
 */
export async function checkUserPaidAccess(userEmail: string): Promise<{
  hasAccess: boolean;
  status: string;
  planTier: string;
}> {
  if (!userEmail) {
    return { hasAccess: false, status: 'none', planTier: 'none' };
  }

  try {
    if (!supabase) {
      // Offline fallback: check localStorage meta
      const stored = localStorage.getItem('juristech_paddle_subscription_meta');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hasAccess: hasPaidAccess(parsed.status),
          status: parsed.status || 'inactive',
          planTier: parsed.planTier || 'pro',
        };
      }
      return { hasAccess: false, status: 'offline', planTier: 'free' };
    }

    // 1. Fetch customer
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', userEmail.toLowerCase().trim())
      .single();

    if (!customer) {
      return { hasAccess: false, status: 'no_customer', planTier: 'free' };
    }

    // 2. Fetch active/recent subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan_tier, metadata')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!subscription) {
      return { hasAccess: false, status: 'no_subscription', planTier: 'free' };
    }

    const scheduledChangeAction = subscription.metadata?.scheduled_change_action || null;
    const accessGranted = hasPaidAccess(subscription.status, scheduledChangeAction);

    return {
      hasAccess: accessGranted,
      status: subscription.status,
      planTier: subscription.plan_tier || 'pro',
    };
  } catch (err) {
    console.warn('[Access Helper Query Warning]:', err);
    return { hasAccess: false, status: 'query_error', planTier: 'free' };
  }
}
