/**
 * src/services/billing/billingAbstraction.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Provider-Neutral Billing & Subscription Abstraction
 * Sprint 01 Foundation (Phase 9H)
 *
 * Implements a provider-neutral interface contract wrapping payment providers.
 * STRICT SAFETY:
 *  • Zero modification to live customer checkout
 *  • Zero activation of unverified providers
 *  • Complete backward compatibility with existing paymentProviderAdapter
 */

import {
  paymentProviderAdapter,
  SupportedPaymentProvider,
  SubscriptionPlanTier,
  CheckoutRequestOptions,
  CheckoutSessionResult,
  PaymentVerificationResult,
  WebhookEventPayload,
} from '../paymentProviderAdapter';

export interface BillingCustomer {
  customerId: string;
  email: string;
  name: string;
  organizationId?: string;
  countryCode?: string;
  createdAt: string;
}

export interface BillingSubscription {
  subscriptionId: string;
  customerId: string;
  organizationId?: string;
  planTier: SubscriptionPlanTier;
  status: 'ACTIVE' | 'PENDING' | 'CANCELED' | 'PAST_DUE';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amountUSD: number;
  provider: SupportedPaymentProvider;
}

export interface StandardBillingEvent {
  eventId: string;
  provider: SupportedPaymentProvider;
  eventType: 'payment.succeeded' | 'payment.failed' | 'subscription.created' | 'subscription.canceled';
  customerEmail: string;
  amountUSD: number;
  planTier: SubscriptionPlanTier;
  timestamp: string;
}

/**
 * Provider-Neutral Billing Interface Contract
 */
export interface IBillingProvider {
  readonly providerName: SupportedPaymentProvider;
  createCheckout(options: CheckoutRequestOptions): Promise<CheckoutSessionResult>;
  verifyTransaction(transactionRef: string, options: Partial<CheckoutRequestOptions>): Promise<PaymentVerificationResult>;
  handleWebhook(headers: Record<string, string>, body: unknown): Promise<{ success: boolean; event?: StandardBillingEvent }>;
  cancelSubscription(subscriptionId: string): Promise<{ success: boolean; message: string }>;
  retrieveSubscription(subscriptionId: string): Promise<BillingSubscription | null>;
}

/**
 * Native Canonical Adapter Boundary around JurisTech's existing paymentProviderAdapter
 */
export class CurrentBillingAdapter implements IBillingProvider {
  public readonly providerName: SupportedPaymentProvider;

  constructor(providerName: SupportedPaymentProvider = 'paytabs') {
    this.providerName = providerName;
  }

  public getProviderName(): SupportedPaymentProvider {
    return this.providerName;
  }

  public isAvailable(): boolean {
    const status = paymentProviderAdapter.getProviderStatus(this.providerName);
    return status.isConnected;
  }

  public async createCheckout(options: CheckoutRequestOptions): Promise<CheckoutSessionResult> {
    return paymentProviderAdapter.createCheckout(options);
  }

  public async verifyTransaction(
    transactionRef: string,
    _options: Partial<CheckoutRequestOptions> = {}
  ): Promise<PaymentVerificationResult> {
    return paymentProviderAdapter.verifyPayment(transactionRef, this.providerName);
  }

  public async handleWebhook(
    headers: Record<string, string>,
    body: unknown
  ): Promise<{ success: boolean; event?: StandardBillingEvent }> {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body || {});
    const result = await paymentProviderAdapter.handleWebhook(rawBody, headers, this.providerName);
    if (!result.success || !result.event) {
      return { success: result.success };
    }

    const raw = result.event;
    return {
      success: true,
      event: {
        eventId: raw.eventId,
        provider: raw.provider,
        eventType: raw.eventType === 'subscription.cancelled' ? 'subscription.canceled' : (raw.eventType as StandardBillingEvent['eventType']),
        customerEmail: raw.customerEmail,
        amountUSD: raw.amountUSD,
        planTier: raw.planId,
        timestamp: new Date().toISOString(),
      },
    };
  }

  public async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; message: string }> {
    return paymentProviderAdapter.cancelSubscription(subscriptionId, this.providerName);
  }

  public async retrieveSubscription(subscriptionId: string): Promise<BillingSubscription | null> {
    const result = await paymentProviderAdapter.syncSubscription(subscriptionId, this.providerName);
    if (result.status !== 'ACTIVE') return null;

    return {
      subscriptionId,
      customerId: subscriptionId,
      planTier: 'startup',
      status: 'ACTIVE',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: result.expiresAt,
      amountUSD: 0,
      provider: this.providerName,
    };
  }
}

export const defaultBillingProvider = new CurrentBillingAdapter('paytabs');
