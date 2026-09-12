/**
 * src/lib/paddleClient.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Decommissioned Gateway Module
 * STATUS: PERMANENTLY DECOMMISSIONED (Paddle rejected - Zero Runtime Calls).
 * PayTabs is the primary gateway under review.
 */

export const PADDLE_CONFIG = {
  productId: 'decommissioned',
  priceId: 'decommissioned',
  environment: 'sandbox' as const,
  clientToken: '',
};

export interface PaddleCheckoutOptions {
  priceId?: string;
  userEmail?: string;
  userName?: string;
  planTier?: 'startup' | 'sme' | 'enterprise' | 'pro';
  amountUSD?: number;
  onSuccess?: (data: any) => void;
  onClosed?: () => void;
}

export interface PaddleSubscriptionData {
  customerId: string;
  subscriptionId: string;
  priceId: string;
  status: 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  updatedAt: string;
}

/**
 * Inert loader — permanently disabled. Never loads external scripts.
 */
export function loadPaddleScript(): Promise<null> {
  return Promise.resolve(null);
}

/**
 * Inert checkout stub — throws informative error if called.
 */
export async function openPaddleCheckout(_options: PaddleCheckoutOptions = {}): Promise<void> {
  throw new Error('Paddle checkout is permanently decommissioned. Please use Bank Wire SWIFT, Binance Pay, InstaPay, or contact support for PayTabs activation status.');
}

export function getStoredPaddleSubscription(): PaddleSubscriptionData | null {
  return null;
}

export function savePaddleSubscription(_data: PaddleSubscriptionData): void {}

export function cancelPaddleSubscriptionLocally(): void {}

export function togglePaddleEnvironment(_env: 'sandbox' | 'live'): void {}

