/**
 * src/hooks/useSubscription.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Subscription & Entitlement State Hook for JurisTech Solutions
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { getStoredSubscriptions, cancelSubscriptionNow, UserSubscription } from '../lib/financialGateway';
import { getStoredPaddleSubscription, PaddleSubscriptionData, openPaddleCheckout } from '../lib/paddleClient';

export interface SubscriptionState {
  isSubscriber: boolean;
  tier: 'Free Trial' | 'Startup' | 'SMEs' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Expired' | 'Pending Renewal' | 'Cancelled';
  daysLeft: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  paddleData: PaddleSubscriptionData | null;
  loading: boolean;
  cancelSubscription: () => Promise<void>;
  subscribeWithPaddle: (planTier?: 'startup' | 'sme' | 'enterprise' | 'pro') => Promise<void>;
  refresh: () => void;
}

export function useSubscription(): SubscriptionState {
  const { user, isAdmin, isLawyer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<UserSubscription | null>(null);
  const [paddleMeta, setPaddleMeta] = useState<PaddleSubscriptionData | null>(null);

  function evaluate() {
    setLoading(true);
    const email = user?.email?.toLowerCase() || localStorage.getItem('juristech_last_login_email') || '';
    const allSubs = getStoredSubscriptions();
    const userSub = allSubs.find((s) => s.userEmail.toLowerCase() === email && s.status === 'Active') || allSubs.find((s) => s.status === 'Active') || null;
    const paddleSub = getStoredPaddleSubscription();

    setActiveSub(userSub);
    setPaddleMeta(paddleSub);
    setLoading(false);
  }

  useEffect(() => {
    evaluate();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'juristech_user_subscriptions' || e.key === 'juristech_paddle_subscription_meta') {
        evaluate();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  // Admins & Lawyers have full access by role
  const isPrivilegedRole = isAdmin || isLawyer;
  const isPaddleActive = paddleMeta?.status === 'active';
  const isLocalActive = activeSub?.status === 'Active' && activeSub.daysLeft > 0;
  const isSubscriber = isPrivilegedRole || isPaddleActive || isLocalActive;

  const tier = activeSub?.tier || (paddleMeta ? 'Pro' : (isPrivilegedRole ? 'Enterprise' : 'Free Trial'));
  const status = paddleMeta?.status === 'active' ? 'Active' : (activeSub?.status || (isPrivilegedRole ? 'Active' : 'Expired'));
  const daysLeft = activeSub?.daysLeft || (paddleMeta ? 30 : (isPrivilegedRole ? 365 : 0));
  const startDate = activeSub?.startDate || paddleMeta?.currentPeriodStart || new Date().toISOString().substring(0, 10);
  const endDate = activeSub?.endDate || paddleMeta?.currentPeriodEnd || new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10);
  const paymentMethod = activeSub?.paymentMethod || (paddleMeta ? 'Credit Card (Paddle)' : 'None');

  async function cancelSubscription() {
    if (activeSub) {
      cancelSubscriptionNow(activeSub.id);
    }
    if (paddleMeta) {
      const { cancelPaddleSubscriptionLocally } = await import('../lib/paddleClient');
      cancelPaddleSubscriptionLocally();
    }
    evaluate();
  }

  async function subscribeWithPaddle(planTier: 'startup' | 'sme' | 'enterprise' | 'pro' = 'pro') {
    await openPaddleCheckout({
      planTier,
      userEmail: user?.email,
      userName: user?.user_metadata?.full_name,
      onSuccess: () => evaluate(),
    });
  }

  return {
    isSubscriber,
    tier,
    status,
    daysLeft,
    startDate,
    endDate,
    paymentMethod,
    paddleData: paddleMeta,
    loading,
    cancelSubscription,
    subscribeWithPaddle,
    refresh: evaluate,
  };
}
