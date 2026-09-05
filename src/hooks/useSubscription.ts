/**
 * src/hooks/useSubscription.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Subscription & Entitlement State Hook for JurisTech Solutions
 * Fully decoupled from third-party vendor SDKs. Provider-neutral state machine.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { getStoredSubscriptions, cancelSubscriptionNow, UserSubscription } from '../lib/financialGateway';

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

export function useSubscription(): SubscriptionState {
  const { user, isAdmin, isLawyer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<UserSubscription | null>(null);

  function evaluate() {
    setLoading(true);
    const email = user?.email?.toLowerCase() || localStorage.getItem('juristech_last_login_email') || '';
    const allSubs = getStoredSubscriptions();
    const userSub = allSubs.find((s) => s.userEmail.toLowerCase() === email && s.status === 'Active') || allSubs.find((s) => s.status === 'Active') || null;

    setActiveSub(userSub);
    setLoading(false);
  }

  useEffect(() => {
    evaluate();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'juristech_user_subscriptions') {
        evaluate();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  // Admins & Lawyers have full access by role
  const isPrivilegedRole = isAdmin || isLawyer;
  const isLocalActive = activeSub?.status === 'Active' && activeSub.daysLeft > 0;
  const isSubscriber = isPrivilegedRole || isLocalActive;

  const tier = activeSub?.tier || (isPrivilegedRole ? 'Enterprise' : 'Free Trial');
  const status = activeSub?.status || (isPrivilegedRole ? 'Active' : 'Expired');
  const daysLeft = activeSub?.daysLeft || (isPrivilegedRole ? 365 : 0);
  const startDate = activeSub?.startDate || new Date().toISOString().substring(0, 10);
  const endDate = activeSub?.endDate || new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10);
  const paymentMethod = activeSub?.paymentMethod || 'None';

  async function cancelSubscription() {
    if (activeSub) {
      cancelSubscriptionNow(activeSub.id);
    }
    evaluate();
  }

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
    refresh: evaluate,
  };
}
