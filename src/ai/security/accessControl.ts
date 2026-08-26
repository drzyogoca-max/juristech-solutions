/**
 * src/ai/security/accessControl.ts
 * JurisTech Solutions — AI Feature Access Control
 * Specification: JURISTECH-AI-P0 Phase P0-8
 * Maps UserTier to allowed AI features.
 * PERMISSIONS SOURCE: useSubscription() / useAuth() — NOT localStorage, NOT URL params.
 */

import type { AccessCheckResult, UserTier } from '../types';

export type AIFeature =
  | 'basic_legal_qa'
  | 'structured_advisor'
  | 'contract_intelligence'
  | 'document_generator'
  | 'enterprise_multi_jurisdiction'
  | 'hallucination_guard_details'
  | 'compliance_agent'
  | 'seo_content_draft'
  | 'admin_ai_analytics'
  | 'customer_success_console'
  | 'enterprise_governance_console'
  | 'enterprise_ecosystem_console'
  | 'legal_ops_command_center'
  | 'enterprise_command_center_v2'
  | 'regulatory_radar_v3'
  | 'sovereign_cloud_console'
  | 'singularity_hub'
  | 'sovereign_federation_hub'
  | 'planetary_hub'
  | 'operations_center'
  | 'trust_hub'
  | 'scale_readiness'
  | 'lifecycle_hub'
  | 'strategic_operations'
  | 'enterprise_adoption'
  | 'enterprise_operations'
  | 'commercial_intelligence'
  | 'partner_ecosystem'
  | 'global_intelligence'
  | 'institutional_os'
  | 'global_ecosystem'
  | 'operational_maturity';

const TIER_RANK: Record<UserTier, number> = {
  free: 0, startup: 1, sme: 2, pro: 3, enterprise: 4, lawyer: 4, admin: 5,
};

const FEATURE_MINIMUM_TIER: Record<AIFeature, UserTier> = {
  basic_legal_qa:                  'free',
  structured_advisor:              'startup',
  contract_intelligence:           'startup',
  document_generator:              'startup',
  hallucination_guard_details:     'sme',
  compliance_agent:                'sme',
  enterprise_multi_jurisdiction:   'pro',
  seo_content_draft:               'admin',
  admin_ai_analytics:              'admin',
  customer_success_console:        'admin',
  enterprise_governance_console:   'admin',
  enterprise_ecosystem_console:    'admin',
  legal_ops_command_center:        'admin',
  enterprise_command_center_v2:    'admin',
  regulatory_radar_v3:             'admin',
  sovereign_cloud_console:         'admin',
  singularity_hub:                 'admin',
  sovereign_federation_hub:        'admin',
  planetary_hub:                   'admin',
  operations_center:               'admin',
  trust_hub:                       'admin',
  scale_readiness:                 'admin',
  lifecycle_hub:                   'admin',
  strategic_operations:            'admin',
  enterprise_adoption:             'admin',
  enterprise_operations:           'admin',
  commercial_intelligence:         'admin',
  partner_ecosystem:               'admin',
  global_intelligence:             'admin',
  institutional_os:                'admin',
  global_ecosystem:                'admin',
  operational_maturity:            'admin',
};

const FEATURE_DESCRIPTION: Record<AIFeature, { en: string; ar: string }> = {
  basic_legal_qa:                  { en: 'Basic Legal Q&A (limited)', ar: 'الاستشارة القانونية الأساسية' },
  structured_advisor:              { en: 'Structured Legal Advisor', ar: 'المستشار القانوني المهيكل' },
  contract_intelligence:           { en: 'Contract Intelligence Engine', ar: 'محرك ذكاء العقود' },
  document_generator:              { en: 'Legal Document Generator', ar: 'منشئ الوثائق القانونية' },
  hallucination_guard_details:     { en: 'Hallucination Guard Diagnostics', ar: 'تفاصيل حارس الهلوسة' },
  compliance_agent:                { en: 'Multi-Jurisdiction Compliance Agent', ar: 'وكيل الامتثال متعدد الأنظمة' },
  enterprise_multi_jurisdiction:   { en: 'Enterprise Multi-Jurisdiction Engine', ar: 'محرك المؤسسات متعدد الأنظمة' },
  seo_content_draft:               { en: 'SEO Legal Content Generator', ar: 'منشئ محتوى الـ SEO القانوني' },
  admin_ai_analytics:              { en: 'Admin AI Analytics', ar: 'تحليلات الذكاء الاصطناعي للمسؤول' },
  customer_success_console:        { en: 'Customer Success Operations Console', ar: 'منصة عمليات نجاح العملاء' },
  enterprise_governance_console:   { en: 'Enterprise Governance Console', ar: 'منصة الحوكمة المؤسسية' },
  enterprise_ecosystem_console:    { en: 'Enterprise AI Ecosystem Console', ar: 'منصة المنظومة المؤسسية الشاملة' },
  legal_ops_command_center:        { en: 'Legal Operations Command Center', ar: 'مركز قيادة العمليات القانونية' },
  enterprise_command_center_v2:    { en: 'Global Enterprise Command Center 2.0', ar: 'مركز القيادة المؤسسي العالمي 2.0' },
  regulatory_radar_v3:             { en: 'Regulatory Horizon Radar 3.0', ar: 'رادار الأفق التنظيمي العالمي 3.0' },
  sovereign_cloud_console:         { en: 'Sovereign Cloud & Zero-Retention Console 4.0', ar: 'منصة السحابة السيادية ومراقبة انعدام التخزين 4.0' },
  singularity_hub:                 { en: 'Legal AI Singularity Operating System Hub 5.0', ar: 'مركز نظام تشغيل السينغيولاريتي القانوني 5.0' },
  sovereign_federation_hub:        { en: 'Global Sovereign Legal Node Federation Hub', ar: 'مركز الاتحاد القانوني السيادي وشبكة العقد المؤسسية' },
  planetary_hub:                   { en: 'Planetary Legal AI Intelligence Hub', ar: 'مركز الذكاء القانوني الكوكبي والشبكة الذكية متعددة الوكلاء' },
  operations_center:               { en: 'Enterprise Operations & Governance Center', ar: 'مركز العمليات والحوكمة المؤسسية' },
  trust_hub:                       { en: 'Enterprise Trust & Certification Hub', ar: 'مركز الثقة والاعتمادات والمشتريات المؤسسية' },
  scale_readiness:                 { en: 'Enterprise Scale & Disaster Recovery Hub', ar: 'مركز التوسع والاستمرارية والجاهزية الخارجية' },
  lifecycle_hub:                   { en: 'Enterprise Continuous Governance & Lifecycle Hub', ar: 'مركز الحوكمة المستمرة والاعتماد ودورة الحياة' },
  strategic_operations:            { en: 'Strategic Operations & Executive Intelligence Hub', ar: 'مركز العمليات الاستراتيجية والذكاء التنبؤي' },
  enterprise_adoption:             { en: 'Enterprise Adoption & Regulatory Passport Hub', ar: 'مركز التبني المؤسسي والجواز التنظيمي الدولي' },
  enterprise_operations:           { en: 'Enterprise Scale Operations & Value Command Center', ar: 'مركز العمليات المؤسسية وإثبات القيمة' },
  commercial_intelligence:         { en: 'Commercial Intelligence & Revenue Command Center', ar: 'مركز قيادة الذكاء التجاري وتفعيل الإيرادات' },
  partner_ecosystem:               { en: 'Partner Ecosystem & Integration Command Center', ar: 'مركز قيادة منظومة الشركاء والتكامل المؤسسي' },
  global_intelligence:             { en: 'Global Intelligence & Simulation Command Center', ar: 'مركز قيادة المحاكاة والذكاء المؤسسي العالمي' },
  institutional_os:                { en: 'Institutional Legal Operating System Command Center', ar: 'مركز قيادة نظام التشغيل القانوني المؤسسي' },
  global_ecosystem:                { en: 'Global Legal Intelligence Ecosystem Command Center', ar: 'مركز قيادة المنظومة القانونية العالمية' },
  operational_maturity:            { en: 'Operational Maturity & Global Ecosystem Command Center', ar: 'مركز قيادة النضج التشغيلي والمنظومة العالمية' },
};

export function checkAccess(feature: AIFeature, userTier: UserTier): AccessCheckResult {
  const required = TIER_RANK[FEATURE_MINIMUM_TIER[feature]];
  const actual = TIER_RANK[userTier] ?? 0;

  if (actual >= required) {
    return { allowed: true };
  }

  const minimumTier = FEATURE_MINIMUM_TIER[feature];
  return {
    allowed: false,
    upgradeRequired: true,
    minimumTier,
    reason: `Feature '${feature}' requires tier '${minimumTier}' or higher.`,
  };
}

export function getFeatureLabel(feature: AIFeature, lang: string): string {
  const desc = FEATURE_DESCRIPTION[feature];
  return lang === 'ar' ? desc.ar : desc.en;
}

export function isAdmin(tier: UserTier): boolean {
  return tier === 'admin';
}

export function isEnterprise(tier: UserTier): boolean {
  return tier === 'enterprise' || tier === 'admin' || tier === 'lawyer';
}
