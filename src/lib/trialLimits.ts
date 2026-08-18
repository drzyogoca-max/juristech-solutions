const TRIAL_KEY = 'juristech_trial_usage';
const CONTRACT_USAGE_KEY = 'juristech_contract_usage_count';
const MAX_FREE_TRIALS = 2;

export function getTrialUsageCount(): number {
  try {
    const val = localStorage.getItem(TRIAL_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementTrialUsage(): number {
  const current = getTrialUsageCount();
  const updated = current + 1;
  try {
    localStorage.setItem(TRIAL_KEY, updated.toString());
    const totalContractUsage = getContractUsageCount() + 1;
    localStorage.setItem(CONTRACT_USAGE_KEY, totalContractUsage.toString());
  } catch {
    // Ignore storage error
  }
  return updated;
}

export function getContractUsageCount(): number {
  try {
    const val = localStorage.getItem(CONTRACT_USAGE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function getContractLimitForCurrentPlan(): number {
  try {
    const rawSub = localStorage.getItem('ls_subscription_status');
    if (rawSub) {
      const parsed = JSON.parse(rawSub);
      if (parsed?.contractLimit) return parsed.contractLimit;
    }
    const tier = localStorage.getItem('juristech_subscription_tier');
    if (tier === 'enterprise') return 999999;
    if (tier === 'sme') return 50;
    if (tier === 'startup' || tier === 'pro') return 10;
  } catch {}
  return MAX_FREE_TRIALS;
}

export function canAccessAdvancedFeatures(): boolean {
  try {
    const rawSub = localStorage.getItem('ls_subscription_status');
    if (rawSub) {
      const parsed = JSON.parse(rawSub);
      if (parsed?.tier === 'SMEs' || parsed?.tier === 'Enterprise' || parsed?.planId === 'sme' || parsed?.planId === 'enterprise') {
        return true;
      }
    }
    const tier = localStorage.getItem('juristech_subscription_tier');
    return tier === 'sme' || tier === 'enterprise';
  } catch {
    return false;
  }
}

export function isTrialLimitReached(): boolean {
  // Check Super Admin Email Bypass or Role
  try {
    const role = localStorage.getItem('juristech_user_role');
    if (role === 'admin' || role === 'super-admin') return false;
    const userEmail = localStorage.getItem('juristech_user_email');
    if (userEmail === 'drzyogo.ca@gmail.com') return false;
  } catch {}

  // Check if subscriber has paid plan
  const userPlan = localStorage.getItem('juristech_subscription_tier');
  if (userPlan && userPlan !== 'free') {
    const limit = getContractLimitForCurrentPlan();
    const used = getContractUsageCount();
    return used >= limit;
  }
  return getTrialUsageCount() >= MAX_FREE_TRIALS;
}

export function resetTrialForTesting(): void {
  localStorage.removeItem(TRIAL_KEY);
  localStorage.removeItem(CONTRACT_USAGE_KEY);
}
