/**
 * src/config/globalConfig.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical Global Configuration (Single Source of Truth)
 * Sprint 01 Foundation (Phase 9I)
 *
 * Centralizes all core platform constants:
 *  1. Supported Languages & RTL Locales
 *  2. Sovereign Platform Positioning & Corporate Identity
 *  3. Product Subscription Tiers & Pricing Limits
 *  4. Canonical Statutory Jurisdictions
 *  5. Operational Environment Settings
 */

import { SupportedLanguage } from '../i18n';

export const GLOBAL_CONFIG = {
  // ── 1. LOCALIZATION & LANGUAGE SUPPORT ──────────────────────────────────────
  localization: {
    supportedLanguages: ['ar', 'en', 'fr', 'es', 'de', 'tr', 'zh'] as const,
    defaultLocale: 'ar' as SupportedLanguage,
    fallbackLocale: 'en' as SupportedLanguage,
    rtlLanguages: ['ar'] as const,
    isRTL: (lang: string): boolean => {
      const code = (lang || '').toLowerCase().slice(0, 2);
      return code === 'ar';
    },
  },

  // ── 2. SOVEREIGN PLATFORM IDENTITY (STRICT BRAND & LEGAL POSITIONING) ────────
  platformIdentity: {
    name: 'JurisTech Solutions',
    brandNameAr: 'جوريستك سوليوشنز',
    operatingModel: 'منصة رقمية عالمية — تعمل عن بعد (Global Digital Platform — Operated remotely)',
    positioning: {
      ar: 'منصة LegalTech SaaS مدعومة بالذكاء الاصطناعي لصياغة العقود وتحليل المستندات واكتشاف المخاطر ودعم سير العمل القانوني.',
      en: 'AI-powered LegalTech SaaS software for contract drafting, document analysis, risk detection and legal workflow support.',
    },
    leadership: {
      founderAr: 'د. محمد مصطفى (المؤسس ورئيس مجلس الإدارة)',
      founderEn: 'Dr. Mohammad Mustafa (Founder & Chief AI Architect)',
      officialEmail: 'founder@juristech.solutions',
    },
    officialDomains: [
      'https://www.juristech.solutions',
      'https://juristech.solutions',
    ],
  },

  // ── 3. PRODUCT TIERS & ENTITLEMENTS ──────────────────────────────────────────
  productTiers: {
    startup: {
      tierId: 'startup',
      nameAr: 'باقة الشركات الصغرى والناشئة',
      nameEn: 'Startup Tier',
      priceMonthlyUSD: 49,
      contractLimitMonthly: 10,
      maxDailyQueries: 50,
      allowCrossJurisdiction: true,
      allowDocGeneration: true,
      allowComplianceAudit: false,
      allowDeepOcr: true,
      allowRedlining: true,
      seatLimit: 3,
    },
    sme: {
      tierId: 'sme',
      nameAr: 'باقة الشركات المتوسطة والنمو',
      nameEn: 'SME Growth Tier',
      priceMonthlyUSD: 139,
      contractLimitMonthly: 50,
      maxDailyQueries: 150,
      allowCrossJurisdiction: true,
      allowDocGeneration: true,
      allowComplianceAudit: true,
      allowDeepOcr: true,
      allowRedlining: true,
      seatLimit: 10,
    },
    enterprise: {
      tierId: 'enterprise',
      nameAr: 'باقة المؤسسات السيادية والكبرى',
      nameEn: 'Enterprise Sovereign Tier',
      priceMonthlyUSD: 349,
      contractLimitMonthly: 99999,
      maxDailyQueries: 99999,
      allowCrossJurisdiction: true,
      allowDocGeneration: true,
      allowComplianceAudit: true,
      allowDeepOcr: true,
      allowRedlining: true,
      seatLimit: 50,
    },
  },

  // ── 4. CANONICAL STATUTORY JURISDICTIONS ────────────────────────────────────
  jurisdictions: {
    primaryCodes: ['SA', 'AE', 'EG', 'US', 'GB', 'QA', 'KW', 'EU', 'GLOBAL'] as const,
    restrictedCodes: ['LY'] as const,
  },

  // ── 5. SECURITY & ENVIRONMENT BOUNDARIES ────────────────────────────────────
  security: {
    encryptionStandard: 'AES-256-GCM',
    tlsRequirement: 'TLS 1.3',
    adminSessionDurationHours: 4,
    enforceStrictRLS: true,
  },
} as const;

export default GLOBAL_CONFIG;
