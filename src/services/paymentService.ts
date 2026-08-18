/**
 * paymentService.ts — Modular Decoupled Financial Gateway & Subscription Provisioner
 * JurisTech Solutions Enterprise Architecture
 */

import { activateUserSubscription } from '../lib/financialGateway';

export interface PaymentPlan {
  id: 'startup' | 'sme' | 'enterprise';
  nameAr: string;
  nameEn: string;
  priceUSD: number;
  contractLimit: number;
}

export const SUBSCRIPTION_PLANS: Record<string, PaymentPlan> = {
  startup: {
    id: 'startup',
    nameAr: 'حزمة الشركات الصغرى',
    nameEn: 'Startup Tier',
    priceUSD: 49,
    contractLimit: 10,
  },
  sme: {
    id: 'sme',
    nameAr: 'حزمة الشركات المتوسطة',
    nameEn: 'SME Tier',
    priceUSD: 139,
    contractLimit: 50,
  },
  enterprise: {
    id: 'enterprise',
    nameAr: 'حزمة الكبرى والمؤسسات',
    nameEn: 'Enterprise Tier',
    priceUSD: 349,
    contractLimit: 99999,
  },
};

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /** Activate user subscription tier via Binance Pay or Wire Transfer */
  public async processPayment(
    planId: 'startup' | 'sme' | 'enterprise',
    paymentMethod: 'binance' | 'swift',
    transactionRef: string
  ): Promise<{ success: boolean; message: string }> {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid payment package plan specified.');
    }

    try {
      await activateUserSubscription({
        userEmail: 'client@juristech.solutions',
        userName: 'Enterprise Client',
        planId: planId,
        paymentMethod: paymentMethod === 'binance' ? 'Binance Pay (USDT)' : 'Bank Wire SWIFT',
        amountUSD: plan.priceUSD,
        receiptUrl: transactionRef,
      });
      return {
        success: true,
        message: `Subscription successfully activated for ${plan.nameEn} via ${paymentMethod.toUpperCase()}`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Payment activation failed.',
      };
    }
  }
}

export const paymentService = PaymentService.getInstance();
