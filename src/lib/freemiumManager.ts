/**
 * freemiumManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Freemium Quota & Paywall Enforcement Manager — v9.0
 * Updated: 10-message free trial (up from 3)
 */

export const STORAGE_KEY = 'ls_free_chat_uses';
export const MAX_FREE_QUOTA = 10;

/** Get total used queries count */
export function getUsedQuotaCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

/** Get remaining free trial quota (10 -> 0) */
export function getFreeQuotaRemaining(): number {
  const used = getUsedQuotaCount();
  return Math.max(0, MAX_FREE_QUOTA - used);
}

/** Check if free trial quota is exhausted */
export function isQuotaExhausted(): boolean {
  return getFreeQuotaRemaining() <= 0;
}

/** Consume 1 free trial query */
export function consumeFreeQuota(): { remaining: number; exhausted: boolean } {
  const currentUsed = getUsedQuotaCount();
  const nextUsed = currentUsed + 1;
  try {
    localStorage.setItem(STORAGE_KEY, nextUsed.toString());
  } catch {}

  const remaining = Math.max(0, MAX_FREE_QUOTA - nextUsed);
  return {
    remaining,
    exhausted: remaining <= 0,
  };
}

/** Reset quota upon successful subscription */
export function resetFreeQuota(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '0');
  } catch {}
}

/** Check if user has active paid subscription */
export function isPaidSubscriber(): boolean {
  try {
    const subData = localStorage.getItem('ls_subscription_status');
    if (!subData) return false;
    const parsed = JSON.parse(subData);
    return parsed?.status === 'Active' && parsed?.tier !== 'Free Trial';
  } catch {
    return false;
  }
}
