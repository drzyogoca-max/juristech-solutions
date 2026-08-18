/**
 * aiPersonalization.ts
 * AI Supporting Architecture — Personalization Engine
 * Tracks per-user behavior across sessions, scores intent, and delivers
 * customized UI hints, chatbot prompts, and recommended actions.
 */
import { supabase } from '../lib/supabaseClient';

export type UserIntent =
  | 'contract_creation'
  | 'risk_audit'
  | 'b2b_partnership'
  | 'company_formation'
  | 'vault_management'
  | 'payment_upgrade'
  | 'general_browse';

export interface PersonalizationProfile {
  sessionId: string;
  detectedLanguage: string;
  topIntent: UserIntent;
  visitCount: number;
  pagesVisited: string[];
  lastActiveAt: string;
  suggestedActions: SuggestedAction[];
  riskScore: number; // 0-100 churn risk
}

export interface SuggestedAction {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  route: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

const PROFILE_KEY = 'ls_persona_profile';
const SESSION_KEY = 'ls_vault_session';

function getSessionId(): string {
  try {
    return localStorage.getItem(SESSION_KEY) || 'anon';
  } catch {
    return 'anon';
  }
}

export function getProfile(): PersonalizationProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProfile(profile: PersonalizationProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

/** Infer primary user intent from visited pages */
function inferIntent(pages: string[]): UserIntent {
  if (pages.includes('/contracts') && pages.length > 1) return 'contract_creation';
  if (pages.includes('/risk')) return 'risk_audit';
  if (pages.includes('/sponsors-ads') || pages.includes('/b2b-proposals')) return 'b2b_partnership';
  if (pages.includes('/company-formation')) return 'company_formation';
  if (pages.includes('/vault')) return 'vault_management';
  if (pages.includes('/payment')) return 'payment_upgrade';
  return 'general_browse';
}

/** Build a personalized action list based on intent & pages visited */
function buildSuggestedActions(intent: UserIntent, pages: string[]): SuggestedAction[] {
  const actions: SuggestedAction[] = [];

  if (!pages.includes('/chat')) {
    actions.push({
      id: 'chat_advisor',
      titleAr: 'تحدث مع المستشار الذكي',
      titleEn: 'Talk to AI Legal Advisor',
      descAr: 'احصل على استشارة قانونية فورية مجانية مدعومة بالذكاء الاصطناعي',
      descEn: 'Get instant free AI-powered legal consultation',
      route: '/chat',
      priority: 'high',
      icon: '🤖',
    });
  }

  if (intent === 'contract_creation' && !pages.includes('/negotiation')) {
    actions.push({
      id: 'negotiation',
      titleAr: 'توقيع إلكتروني وتفاوض',
      titleEn: 'E-Signature & Negotiation',
      descAr: 'وقّع عقدك أو ابدأ جلسة تفاوض آمنة مشفرة',
      descEn: 'Sign your contract or launch a secure negotiation session',
      route: '/negotiation',
      priority: 'high',
      icon: '✍️',
    });
  }

  if (intent === 'risk_audit' && !pages.includes('/enterprise-audit')) {
    actions.push({
      id: 'enterprise_audit',
      titleAr: 'تدقيق المشاريع الكبرى M&A',
      titleEn: 'Enterprise M&A Due Diligence',
      descAr: 'فحص شامل لصفقات الاندماج والاستحواذ والعقود المؤسسية',
      descEn: 'Comprehensive due diligence for M&A deals and institutional contracts',
      route: '/enterprise-audit',
      priority: 'medium',
      icon: '🔍',
    });
  }

  if (!pages.includes('/vault')) {
    actions.push({
      id: 'vault',
      titleAr: 'احفظ مستنداتك في الخزنة',
      titleEn: 'Store Docs in Encrypted Vault',
      descAr: 'حفظ عقودك ومحاضر اجتماعاتك بتشفير AES-256',
      descEn: 'Store your contracts & minutes with AES-256 encryption',
      route: '/vault',
      priority: 'medium',
      icon: '🔐',
    });
  }

  if (!pages.includes('/payment') && intent !== 'payment_upgrade') {
    actions.push({
      id: 'upgrade',
      titleAr: 'ترقية للباقة الاحترافية',
      titleEn: 'Upgrade to Pro Plan',
      descAr: 'وصول كامل لجميع أدوات الذكاء الاصطناعي القانوني',
      descEn: 'Full access to all AI legal intelligence tools',
      route: '/payment',
      priority: 'low',
      icon: '⚡',
    });
  }

  return actions.slice(0, 3);
}

/** Record a page visit and update the personalization profile */
export function trackPageVisit(path: string, language: string): PersonalizationProfile {
  const existing = getProfile();
  const pages = existing?.pagesVisited || [];

  if (!pages.includes(path)) pages.push(path);

  const intent = inferIntent(pages);
  const visitCount = (existing?.visitCount || 0) + 1;

  // Churn risk: high if visited payment but didn't subscribe
  const riskScore = pages.includes('/payment') && visitCount > 3 ? 72 :
    pages.length >= 4 ? 45 :
    pages.length >= 2 ? 25 : 10;

  const profile: PersonalizationProfile = {
    sessionId: getSessionId(),
    detectedLanguage: language,
    topIntent: intent,
    visitCount,
    pagesVisited: pages,
    lastActiveAt: new Date().toISOString(),
    suggestedActions: buildSuggestedActions(intent, pages),
    riskScore,
  };

  saveProfile(profile);

  // Async sync to Supabase
  (async () => {
    try {
      await supabase.from('user_personas').upsert({
        session_id: profile.sessionId,
        top_intent: profile.topIntent,
        visit_count: profile.visitCount,
        risk_score: profile.riskScore,
        last_active_at: profile.lastActiveAt,
        detected_language: profile.detectedLanguage,
      });
    } catch {}
  })();

  return profile;
}

/** Get AI-generated smart greeting based on current profile */
export function getSmartGreeting(profile: PersonalizationProfile, isRtl: boolean): string {
  const hour = new Date().getHours();
  const timeAr = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';
  const timeEn = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const intentGreetings: Record<UserIntent, { ar: string; en: string }> = {
    contract_creation: {
      ar: `${timeAr} — جاهز لإنشاء عقد جديد بدقة قانونية كاملة؟`,
      en: `${timeEn} — Ready to draft a legally precise contract?`,
    },
    risk_audit: {
      ar: `${timeAr} — هل تريد فحص مخاطر عقودك الحالية؟`,
      en: `${timeEn} — Want to audit the risks in your current contracts?`,
    },
    b2b_partnership: {
      ar: `${timeAr} — مرحباً بك في سوق الرعايات والشراكات B2B.`,
      en: `${timeEn} — Welcome to our B2B sponsorship marketplace.`,
    },
    company_formation: {
      ar: `${timeAr} — نساعدك في تأسيس شركتك في أمريكا والإمارات خطوة بخطوة.`,
      en: `${timeEn} — Let's set up your company in the US or UAE step by step.`,
    },
    vault_management: {
      ar: `${timeAr} — مستنداتك محمية في الخزنة المشفرة AES-256.`,
      en: `${timeEn} — Your documents are protected in the AES-256 encrypted vault.`,
    },
    payment_upgrade: {
      ar: `${timeAr} — اكتشف الباقات الاحترافية وفتح الوصول الكامل.`,
      en: `${timeEn} — Explore Pro plans and unlock full AI legal access.`,
    },
    general_browse: {
      ar: `${timeAr} — استكشف منظومة الذكاء القانوني الكاملة.`,
      en: `${timeEn} — Explore the complete AI legal intelligence platform.`,
    },
  };

  const g = intentGreetings[profile.topIntent];
  return isRtl ? g.ar : g.en;
}
