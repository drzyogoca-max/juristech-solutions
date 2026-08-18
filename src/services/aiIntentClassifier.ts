/**
 * src/services/aiIntentClassifier.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * AI Intent Recognition & Human-in-the-Loop Engagement Classifier Engine
 * v3.0 — Upgraded with COMPANY_FORMATION, SWIFT_PAYMENT, ERP_INTEGRATION intents
 *
 * Classifies inbound user queries into precise categories before responding:
 *   • BOOKING_CONSULTATION   — Scheduling live meetings, direct consultations
 *   • LEGAL_INQUIRY          — Contract auditing, NDA drafting, compliance analysis
 *   • PRICING_SUBSCRIPTION   — Free trials, pricing tiers, enterprise plans
 *   • COMPANY_FORMATION      — Business setup, licensing, foreign investment
 *   • SWIFT_PAYMENT          — Wire transfers, bank remittances, SWIFT audits
 *   • ERP_INTEGRATION        — SAP/Odoo/Salesforce/Zapier/CRM connectivity
 *   • GENERAL_ENGAGEMENT     — General feedback, partnership, brand queries
 */

export type UserIntent =
  | 'BOOKING_CONSULTATION'
  | 'LEGAL_INQUIRY'
  | 'PRICING_SUBSCRIPTION'
  | 'COMPANY_FORMATION'
  | 'SWIFT_PAYMENT'
  | 'ERP_INTEGRATION'
  | 'GENERAL_ENGAGEMENT';

export interface IntentAnalysisResult {
  intent: UserIntent;
  confidence: number;
  isRtl: boolean;
  recommendedReply: string;
  actionUrl: string;
  officialEmail: string;
  leadCategory: string;
}

// ─── Keyword Banks (AR + EN + FR + DE + mixed-language patterns) ─────────────

const BOOKING_KEYWORDS = [
  // English
  'schedule', 'consultation', 'live consultation', 'direct consultation',
  'book', 'appointment', 'meeting', 'call', 'talk to lawyer', 'speak with advisor',
  'speak to', 'connect me', 'human advisor', 'real lawyer', 'dr. mohammad',
  // Arabic
  'حجز', 'استشارة', 'استشارة مباشرة', 'موعد', 'لقاء', 'مقابلة',
  'التحدث مع مستشار', 'حجز موعد', 'ميعاد', 'محامي', 'مستشار قانوني', 'د. محمد',
  'دكتور محمد', 'تواصل', 'اتصل', 'تحدث',
  // French
  'rendez-vous', 'consultation directe', 'avocat', 'conseiller',
];

const PRICING_KEYWORDS = [
  // English
  'price', 'pricing', 'cost', 'subscription', 'plan', 'fee', 'free trial',
  'trial', 'pay', 'payment', 'how much', 'upgrade', 'enterprise plan', 'annual',
  'monthly', 'billing', 'invoice', 'discount',
  // Arabic
  'سعر', 'أسعار', 'تكلفة', 'اشتراك', 'باقة', 'تجربة مجانية', 'دفع', 'رسوم',
  'كم التكلفة', 'كم السعر', 'مجاني', 'الترقية', 'الخطة', 'العرض', 'الفاتورة',
  // French
  'prix', 'abonnement', 'forfait', 'essai gratuit', 'paiement',
];

const LEGAL_INQUIRY_KEYWORDS = [
  // English
  'contract', 'nda', 'clause', 'audit', 'law', 'legal', 'compliance', 'statutory',
  'governing', 'arbitration', 'dispute', 'liability', 'indemnification', 'ip',
  'intellectual property', 'gdpr', 'privacy', 'labor', 'employment', 'termination',
  'force majeure', 'breach', 'penalty',
  // Arabic
  'عقد', 'بنود', 'ثغرات', 'تدقيق', 'قانون', 'تشريع', 'صياغة', 'مسؤولية', 'شروط',
  'تحكيم', 'نزاع', 'فسخ', 'خصوصية', 'ملكية فكرية', 'عمالي', 'العمل', 'قوة قاهرة',
  'حقوق', 'التزامات', 'إخلال',
  // French
  'contrat', 'clause', 'audit', 'juridique', 'conformité',
];

const COMPANY_FORMATION_KEYWORDS = [
  // English
  'company formation', 'company setup', 'start a company', 'register a company',
  'business license', 'incorporation', 'llc', 'freezone', 'free zone', 'offshore',
  'foreign investment', 'company registration', 'trade license', 'moe', 'dcd',
  'moci', 'founding', 'startup', 'new business', 'open company',
  // Arabic
  'تأسيس شركة', 'إنشاء شركة', 'تسجيل شركة', 'ترخيص تجاري', 'رخصة',
  'شركة ذات مسؤولية محدودة', 'المنطقة الحرة', 'فري زون', 'استثمار أجنبي',
  'السجل التجاري', 'عقد التأسيس', 'تأسيس', 'شركة ناشئة', 'فرد', 'مؤسسة فردية',
  'شراكة', 'حصص', 'نظام الشركات', 'وزارة التجارة',
  // French
  'création d\'entreprise', 'enregistrement', 'licence commerciale',
];

const SWIFT_PAYMENT_KEYWORDS = [
  // English
  'swift', 'wire transfer', 'bank wire', 'remittance', 'international transfer',
  'bank transfer', 'iban', 'bic', 'correspondent bank', 'payment proof',
  'receipt verification', 'transaction', 'banking', 'telex transfer',
  // Arabic
  'حوالة بنكية', 'تحويل مصرفي', 'سويفت', 'حوالة دولية', 'بنك', 'تحويل',
  'إثبات السداد', 'إيصال', 'رقم المعاملة', 'تأكيد الحوالة',
  // French
  'virement bancaire', 'transfert international', 'swift',
];

const ERP_INTEGRATION_KEYWORDS = [
  // English
  'erp', 'sap', 'odoo', 'salesforce', 'hubspot', 'zapier', 'crm',
  'integrate', 'integration', 'api', 'connect system', 'webhook',
  'sync', 'automation', 'workflow', 'data pipeline',
  // Arabic
  'تكامل', 'ربط النظام', 'إي آر بي', 'سيل فورس', 'أودو', 'ربط إداري',
  'أتمتة', 'ربط بياني', 'واجهة برمجية',
];

// ─── Utility: score keyword matches ──────────────────────────────────────────

function scoreKeywords(text: string, keywords: string[]): number {
  const textLower = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (textLower.includes(kw.toLowerCase())) {
      // longer keywords get higher weight (more specific = more confident)
      score += 1 + kw.split(' ').length * 0.5;
    }
  }
  return score;
}

// ─── Main Classifier ─────────────────────────────────────────────────────────

export function classifyUserIntent(inboundText: string): IntentAnalysisResult {
  const officialEmail = 'Drzyogo.ca@gmail.com';
  const isRtl = /[\u0600-\u06FF]/.test(inboundText);

  const scores: Record<UserIntent, number> = {
    BOOKING_CONSULTATION: scoreKeywords(inboundText, BOOKING_KEYWORDS),
    LEGAL_INQUIRY: scoreKeywords(inboundText, LEGAL_INQUIRY_KEYWORDS),
    PRICING_SUBSCRIPTION: scoreKeywords(inboundText, PRICING_KEYWORDS),
    COMPANY_FORMATION: scoreKeywords(inboundText, COMPANY_FORMATION_KEYWORDS),
    SWIFT_PAYMENT: scoreKeywords(inboundText, SWIFT_PAYMENT_KEYWORDS),
    ERP_INTEGRATION: scoreKeywords(inboundText, ERP_INTEGRATION_KEYWORDS),
    GENERAL_ENGAGEMENT: 0.5, // baseline fallback score
  };

  // Pick winner
  const topIntent = (Object.keys(scores) as UserIntent[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );

  const maxScore = scores[topIntent];
  const confidence = Math.min(0.99, 0.75 + maxScore * 0.04);

  // ─── Build response per intent ────────────────────────────────────────────

  const responses: Record<UserIntent, { reply: string; url: string; leadCategory: string }> = {
    BOOKING_CONSULTATION: {
      url: 'https://juristech.solutions/support',
      leadCategory: 'High-Value Consultation Lead',
      reply: isRtl
        ? `أهلاً بك! يمكنك حجز موعد استشارة قانونية مباشرة مع د. محمد مصطفى ومستشارينا الاستراتيجيين عبر البريد الرسمي (${officialEmail}) أو بوابة الدعم المباشر: https://juristech.solutions/support — يسعدنا تقديم الدعم الفوري لك.`
        : `Thank you for your interest! Schedule a live consultation with Dr. Mohammad Mustafa and our strategic legal advisors at (${officialEmail}) or book directly at: https://juristech.solutions/support`,
    },
    PRICING_SUBSCRIPTION: {
      url: 'https://juristech.solutions/payment',
      leadCategory: 'Pricing Inquiry Lead',
      reply: isRtl
        ? `أهلاً! تتيح منصة JurisTech Solutions باقات مرنة للشركات الناشئة والمؤسسات الكبرى مع تجربة مجانية. تصفح الباقات مباشرة: https://juristech.solutions/payment أو راسلنا: (${officialEmail}).`
        : `Welcome! JurisTech Solutions offers flexible plans for startups and global enterprises with a free trial. Explore plans at: https://juristech.solutions/payment or email us at (${officialEmail}).`,
    },
    LEGAL_INQUIRY: {
      url: 'https://juristech.solutions/contracts',
      leadCategory: 'Legal Advisory Lead',
      reply: isRtl
        ? `نشكر استفسارك التشريعي. منصتنا تفحص العقود، تصيغ اتفاقيات NDA، وتكتشف الثغرات في أقل من ثانية عبر قوانين 15 دولة. جرّب الفحص الآلي فوراً: https://juristech.solutions/contracts أو تواصل: (${officialEmail}).`
        : `Thank you for your legal inquiry. Our AI platform audits contracts, drafts NDAs, and detects compliance risks across 15 jurisdictions in under one second. Try it now at: https://juristech.solutions/contracts or contact (${officialEmail}).`,
    },
    COMPANY_FORMATION: {
      url: 'https://juristech.solutions/chat',
      leadCategory: 'Company Formation Lead',
      reply: isRtl
        ? `أهلاً! تخصصنا في تأسيس الشركات في السعودية والإمارات ومصر والأردن والخليج، سواء كانت شركة ذات مسؤولية محدودة، مؤسسة فردية، أو شركة مساهمة مبسطة. تواصل معنا لاستشارة التأسيس عبر: (${officialEmail}) أو تفضل بمحادثة المستشار الذكي: https://juristech.solutions/chat`
        : `Hello! We specialize in company formation across Saudi Arabia, UAE, Egypt, Jordan, and the GCC — LLC, sole proprietorship, or simplified joint-stock company. Contact us at (${officialEmail}) or start an AI consultation: https://juristech.solutions/chat`,
    },
    SWIFT_PAYMENT: {
      url: 'https://juristech.solutions/vault',
      leadCategory: 'Payment & Wire Transfer Lead',
      reply: isRtl
        ? `نشكركم على تواصلكم. تتيح منصتنا تدقيق الحوالات البنكية SWIFT ورفع إيصالات الدفع الدولية والتحقق منها فورياً عبر نظام التحقق الذكي. تحقق من بياناتك المصرفية الآن: https://juristech.solutions/vault أو راسلنا: (${officialEmail}).`
        : `Thank you for reaching out. Our platform supports SWIFT wire transfer auditing, international payment receipt verification, and live transaction validation. Verify your bank transfers now at: https://juristech.solutions/vault or email us at (${officialEmail}).`,
    },
    ERP_INTEGRATION: {
      url: 'https://juristech.solutions/chat',
      leadCategory: 'Enterprise ERP Integration Lead',
      reply: isRtl
        ? `أهلاً! نوفر تكاملاً برمجياً مع أبرز أنظمة إدارة المؤسسات: SAP، Odoo، Salesforce، HubSpot وZapier عبر Webhook API آمن. تواصل معنا للحصول على عرض التكامل المخصص لمنظومتكم: (${officialEmail}) أو زيارة: https://juristech.solutions/chat`
        : `Hello! We provide seamless API integrations with SAP, Odoo, Salesforce, HubSpot, and Zapier via secure Webhook. Contact us for a custom ERP integration proposal at (${officialEmail}) or visit: https://juristech.solutions/chat`,
    },
    GENERAL_ENGAGEMENT: {
      url: 'https://juristech.solutions',
      leadCategory: 'General Engagement',
      reply: isRtl
        ? `نشكر تواصلك بمنظومة الذكاء الاصطناعي التشريعي JurisTech Solutions! يسعدنا تقديم الدعم الفوري لك. زر منصتنا: https://juristech.solutions أو راسلنا: (${officialEmail}).`
        : `Thank you for reaching out to JurisTech Solutions! We are delighted to assist your enterprise with AI legal intelligence. Visit us at: https://juristech.solutions or email (${officialEmail}).`,
    },
  };

  const { reply, url, leadCategory } = responses[topIntent];

  return {
    intent: topIntent,
    confidence,
    isRtl,
    recommendedReply: reply,
    actionUrl: url,
    officialEmail,
    leadCategory,
  };
}
