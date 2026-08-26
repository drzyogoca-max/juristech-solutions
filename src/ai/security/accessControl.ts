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
  | 'planetary_hub';

const TIER_RANK: Record<UserTier, number> = {
  free: 0, startup: 1, sme: 2, pro: 3, enterprise: 4, lawyer: 4, admin: 5,
};

const FEATURE_MINIMUM_TIER: Record<AIFeature, UserTier> = {
  basic_legal_qa:                  'free',
  structured_advisor:              'startup',
  contract_intelligence:           'startup',
  document_generator:              'startup',
  hallucination_guard_details:     'startup',
  compliance_agent:                'sme',
  enterprise_multi_jurisdiction:   'enterprise',
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
};

const FEATURE_DESCRIPTION: Record<AIFeature, { en: string; ar: string }> = {
  basic_legal_qa:                  { en: 'Basic Legal Q&A (limited)', ar: 'الاستشارة القانونية الأساسية' },
  structured_advisor:              { en: 'Structured Legal Advisor', ar: 'المستشار القانوني المهيكل' },
  contract_intelligence:           { en: 'Contract Intelligence Engine', ar: 'محرك ذكاء العقود' },
  document_generator:              { en: 'Legal Document Generator', ar: 'مولد المستندات القانونية' },
  hallucination_guard_details:     { en: 'Source Verification Details', ar: 'تفاصيل التحقق من المصادر' },
  compliance_agent:                { en: 'Regulatory Compliance Agent', ar: 'وكيل الامتثال التنظيمي' },
  enterprise_multi_jurisdiction:   { en: 'Enterprise Multi-Jurisdiction AI', ar: 'الذكاء المتعدد للولايات المؤسسي' },
  seo_content_draft:               { en: 'SEO AI Content Draft', ar: 'مسودة محتوى SEO' },
  admin_ai_analytics:              { en: 'Admin AI Analytics Dashboard', ar: 'لوحة تحليلات الذكاء الاصطناعي الإدارية' },
  customer_success_console:        { en: 'Customer Success Console', ar: 'لوحة نجاح العملاء المؤسسيين' },
  enterprise_governance_console:   { en: 'Enterprise Governance Console', ar: 'مركز حوكمة الذكاء الاصطناعي المؤسسي' },
  enterprise_ecosystem_console:    { en: 'Enterprise Ecosystem Console', ar: 'لوحة منظومة المطورين والشركاء المؤسسية' },
  legal_ops_command_center:        { en: 'Legal Operations Command Center', ar: 'مركز العمليات والذكاء القانوني الموحد' },
  enterprise_command_center_v2:    { en: 'Enterprise AI Command Center 2.0', ar: 'مركز قيادة العمليات القانونية الذاتية 2.0' },
  regulatory_radar_v3:             { en: 'Enterprise AI Regulatory Radar 3.0', ar: 'مركز الحوكمة والرادار التنظيمي للذكاء الاصطناعي 3.0' },
  sovereign_cloud_console:         { en: 'Sovereign Enterprise AI Cloud Console', ar: 'قمرة قيادة السحابة السيادية والذكاء الاصطناعي الخاص' },
  singularity_hub:                 { en: 'Global Legal AI Singularity Hub', ar: 'مركز سينجولارتي للذكاء القانوني ونظام التشغيل الذاتي' },
  sovereign_federation_hub:        { en: 'Global Sovereign Legal Node Federation Hub', ar: 'مركز الاتحاد القانوني السيادي وشبكة العقد المؤسسية' },
  planetary_hub:                   { en: 'Planetary Legal AI Intelligence Hub', ar: 'مركز الذكاء القانوني الكوكبي والشبكة الذكية متعددة الوكلاء' },
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
