/**
 * paymentProviderAdapter.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Gateway Payment Orchestration & Adapter Engine
 * Supports: Active Direct Channels (SWIFT, Binance Pay, InstaPay), PayTabs (Under Review), Stripe (Not Available — No Account)
 * 
 * Standardized Unified Interface:
 *  - createCheckout()
 *  - verifyPayment()
 *  - handleWebhook()
 *  - cancelSubscription()
 *  - syncSubscription()
 */

export type SupportedPaymentProvider = 'paytabs' | 'paymob' | 'stripe' | 'manual_swift' | 'binance_pay';

export type SubscriptionPlanTier = 'startup' | 'sme' | 'enterprise';

export interface CheckoutRequestOptions {
  planId: SubscriptionPlanTier;
  customerEmail: string;
  customerName: string;
  companyName?: string;
  countryCode?: string;
  provider: SupportedPaymentProvider;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  provider: SupportedPaymentProvider;
  sessionId: string;
  checkoutUrl: string;
  amountUSD: number;
  currency: string;
  status: 'READY' | 'PENDING_CONFIG' | 'REDIRECT_REQUIRED';
  providerConfigStatus: 'LIVE' | 'SANDBOX_READY' | 'NOT_CONNECTED';
  instructions?: string;
}

export interface PaymentVerificationResult {
  transactionId: string;
  provider: SupportedPaymentProvider;
  isVerified: boolean;
  status: 'PAID' | 'PENDING' | 'FAILED';
  amountUSD: number;
  customerEmail: string;
  planId: SubscriptionPlanTier;
  timestamp: string;
  rawResponse?: unknown;
}

export interface WebhookEventPayload {
  eventId: string;
  provider: SupportedPaymentProvider;
  eventType: 'subscription.created' | 'subscription.updated' | 'subscription.cancelled' | 'payment.succeeded' | 'payment.failed';
  customerId: string;
  customerEmail: string;
  planId: SubscriptionPlanTier;
  amountUSD: number;
  signatureVerified: boolean;
  timestamp: string;
}

export const PLAN_PRICING: Record<SubscriptionPlanTier, { priceUSD: number; nameEn: string; nameAr: string }> = {
  startup: { priceUSD: 49, nameEn: 'Startup Plan', nameAr: 'باقة الرواد' },
  sme: { priceUSD: 139, nameEn: 'SME Plan', nameAr: 'باقة الشركات المتوسطة' },
  enterprise: { priceUSD: 349, nameEn: 'Enterprise Plan', nameAr: 'باقة المؤسسات الكبرى' },
};

export class PaymentProviderAdapter {
  private static instance: PaymentProviderAdapter;

  private constructor() {}

  public static getInstance(): PaymentProviderAdapter {
    if (!PaymentProviderAdapter.instance) {
      PaymentProviderAdapter.instance = new PaymentProviderAdapter();
    }
    return PaymentProviderAdapter.instance;
  }

  /**
   * Check connection & configuration status of each provider
   */
  public getProviderStatus(provider: SupportedPaymentProvider): {
    provider: SupportedPaymentProvider;
    isConnected: boolean;
    isAvailable: boolean;
    mode: 'LIVE' | 'SANDBOX' | 'NOT_CONFIGURED';
    statusLabelEn: string;
    statusLabelAr: string;
    missingRequirements: string[];
  } {
    switch (provider) {
      case 'paytabs':
        return {
          provider: 'paytabs',
          isConnected: false,
          isAvailable: false,
          mode: 'NOT_CONFIGURED',
          statusLabelEn: 'UNDER REVIEW',
          statusLabelAr: 'قيد مراجعة حساب التاجر (PayTabs)',
          missingRequirements: ['MERCHANT_KYC_APPROVAL', 'PAYTABS_PROFILE_ID', 'PAYTABS_SERVER_KEY'],
        };
      case 'paymob':
        return {
          provider: 'paymob',
          isConnected: false,
          isAvailable: false,
          mode: 'NOT_CONFIGURED',
          statusLabelEn: 'NOT CONFIGURED',
          statusLabelAr: 'غير مهيأ',
          missingRequirements: ['PAYMOB_API_KEY', 'PAYMOB_INTEGRATION_ID', 'PAYMOB_IFRAME_ID'],
        };
      case 'stripe':
        return {
          provider: 'stripe',
          isConnected: false,
          isAvailable: false,
          mode: 'NOT_CONFIGURED',
          statusLabelEn: 'NOT AVAILABLE — NO STRIPE ACCOUNT',
          statusLabelAr: 'غير متاح — لا يوجد حساب Stripe حالياً',
          missingRequirements: ['NO_STRIPE_ACCOUNT', 'NOT_AVAILABLE'],
        };
      case 'manual_swift':
        return {
          provider: 'manual_swift',
          isConnected: true,
          isAvailable: true,
          mode: 'LIVE',
          statusLabelEn: 'ACTIVE — SWIFT WIRE TRANSFER',
          statusLabelAr: 'متاح ونشط — تحويل بنكي رسمي SWIFT',
          missingRequirements: [],
        };
      case 'binance_pay':
        return {
          provider: 'binance_pay',
          isConnected: true,
          isAvailable: true,
          mode: 'LIVE',
          statusLabelEn: 'ACTIVE — BINANCE PAY (USDT)',
          statusLabelAr: 'متاح ونشط — بينانس باي المباشر',
          missingRequirements: [],
        };
      default:
        return {
          provider,
          isConnected: false,
          isAvailable: false,
          mode: 'NOT_CONFIGURED',
          statusLabelEn: 'UNKNOWN PROVIDER',
          statusLabelAr: 'مزود غير معروف',
          missingRequirements: ['UNKNOWN_PROVIDER'],
        };
    }
  }

  /**
   * 1. Create Checkout Session
   */
  public async createCheckout(options: CheckoutRequestOptions): Promise<CheckoutSessionResult> {
    const plan = PLAN_PRICING[options.planId];
    if (!plan) {
      throw new Error(`Invalid plan specified: ${options.planId}`);
    }

    const sessionId = `CHK-${options.provider.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Handle Manual Fallbacks
    if (options.provider === 'manual_swift') {
      return {
        provider: 'manual_swift',
        sessionId,
        checkoutUrl: '/payment?method=swift',
        amountUSD: plan.priceUSD,
        currency: 'USD',
        status: 'READY',
        providerConfigStatus: 'LIVE',
        instructions: 'Al Baraka Bank SWIFT Wire Transfer details displayed in payment modal.',
      };
    }

    if (options.provider === 'binance_pay') {
      return {
        provider: 'binance_pay',
        sessionId,
        checkoutUrl: '/payment?method=binance',
        amountUSD: plan.priceUSD,
        currency: 'USDT',
        status: 'READY',
        providerConfigStatus: 'LIVE',
        instructions: 'Binance Pay UID / USDT QR code displayed in payment modal.',
      };
    }

    // Handle Stripe: Strictly NOT AVAILABLE (No Stripe Account)
    if (options.provider === 'stripe') {
      return {
        provider: 'stripe',
        sessionId,
        checkoutUrl: '/payment?provider=stripe&status=not_available',
        amountUSD: plan.priceUSD,
        currency: 'USD',
        status: 'PENDING_CONFIG',
        providerConfigStatus: 'NOT_CONNECTED',
        instructions: 'Stripe is not available — JurisTech does not currently have an active Stripe account. Please use Bank Wire SWIFT, Binance Pay, InstaPay, or Proforma Invoice.',
      };
    }

    // Handle PayTabs: UNDER REVIEW
    if (options.provider === 'paytabs') {
      return {
        provider: 'paytabs',
        sessionId,
        checkoutUrl: '/payment?provider=paytabs&status=under_review',
        amountUSD: plan.priceUSD,
        currency: 'USD',
        status: 'PENDING_CONFIG',
        providerConfigStatus: 'NOT_CONNECTED',
        instructions: 'PayTabs card checkout is currently under merchant compliance review. Please use Bank Wire SWIFT, Binance Pay, InstaPay, or Proforma Invoice.',
      };
    }

    // Automated Card Providers (Standby Adapter Mode for other providers)
    const status = this.getProviderStatus(options.provider);
    return {
      provider: options.provider,
      sessionId,
      checkoutUrl: `/payment?provider=${options.provider}&plan=${options.planId}`,
      amountUSD: plan.priceUSD,
      currency: 'USD',
      status: 'PENDING_CONFIG',
      providerConfigStatus: status.isConnected ? 'LIVE' : 'NOT_CONNECTED',
      instructions: `Provider ${options.provider.toUpperCase()} is not available.`,
    };
  }

  /**
   * 2. Verify Payment Transaction
   */
  public async verifyPayment(
    transactionId: string,
    provider: SupportedPaymentProvider
  ): Promise<PaymentVerificationResult> {
    const timestamp = new Date().toISOString();

    if (provider === 'manual_swift' || provider === 'binance_pay') {
      return {
        transactionId,
        provider,
        isVerified: true,
        status: 'PENDING',
        amountUSD: 49,
        customerEmail: 'manual_client@juristech.solutions',
        planId: 'startup',
        timestamp,
        rawResponse: { type: 'manual_receipt_review' },
      };
    }

    if (provider === 'stripe') {
      return {
        transactionId,
        provider: 'stripe',
        isVerified: false,
        status: 'FAILED',
        amountUSD: 0,
        customerEmail: '',
        planId: 'startup',
        timestamp,
        rawResponse: { error: 'NOT_AVAILABLE — JurisTech does not currently have an active Stripe account' },
      };
    }

    return {
      transactionId,
      provider,
      isVerified: false,
      status: 'PENDING',
      amountUSD: 0,
      customerEmail: '',
      planId: 'startup',
      timestamp,
      rawResponse: { note: 'Live gateway API not yet activated' },
    };
  }

  /**
   * 3. Handle Webhook Payload (PayTabs, Paymob, Stripe)
   */
  public async handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
    provider: SupportedPaymentProvider
  ): Promise<{ success: boolean; event: WebhookEventPayload | null; error?: string }> {
    const timestamp = new Date().toISOString();

    try {
      // Stub HMAC validation logic for each gateway
      let signatureVerified = false;
      const signature = headers['x-paytabs-signature'] || headers['stripe-signature'] || headers['signature'] || '';

      if (process.env.NODE_ENV === 'development' || !signature) {
        signatureVerified = true;
      }

      const parsed = JSON.parse(rawBody || '{}');

      const event: WebhookEventPayload = {
        eventId: parsed.id || `EVT-${Date.now().toString(36)}`,
        provider,
        eventType: parsed.event_type || 'payment.succeeded',
        customerId: parsed.customer_id || 'CUST_UNKNOWN',
        customerEmail: parsed.email || parsed.customer_email || 'client@juristech.solutions',
        planId: parsed.plan_id || 'startup',
        amountUSD: parsed.amount || 49,
        signatureVerified,
        timestamp,
      };

      return { success: true, event };
    } catch (e: any) {
      return { success: false, event: null, error: e?.message || 'Webhook parsing failed' };
    }
  }

  /**
   * 4. Cancel Subscription
   */
  public async cancelSubscription(
    subscriptionId: string,
    provider: SupportedPaymentProvider
  ): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Subscription ${subscriptionId} cancellation recorded for ${provider.toUpperCase()}.`,
    };
  }

  /**
   * 5. Sync Subscription Status
   */
  public async syncSubscription(
    subscriptionId: string,
    provider: SupportedPaymentProvider
  ): Promise<{ status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE'; expiresAt: string }> {
    return {
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    };
  }
}

export const paymentProviderAdapter = PaymentProviderAdapter.getInstance();
