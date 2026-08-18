export interface VisitorBehavior {
  timeOnPageSeconds: number;
  pagesVisited: string[];
  activeTopic: string | null;
  hasInteractedWithAI: boolean;
}

const BEHAVIOR_STORAGE_KEY = 'juristech_visitor_radar';

export function getVisitorBehavior(): VisitorBehavior {
  try {
    const raw = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage errors
  }
  return {
    timeOnPageSeconds: 0,
    pagesVisited: [],
    activeTopic: null,
    hasInteractedWithAI: false,
  };
}

export function recordPageView(pagePath: string) {
  const behavior = getVisitorBehavior();
  if (!behavior.pagesVisited.includes(pagePath)) {
    behavior.pagesVisited.push(pagePath);
  }
  try {
    localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(behavior));
  } catch {
    // Ignore storage write error
  }
}

export function generateSmartOutreach(behavior: VisitorBehavior, isRtl: boolean): { title: string; body: string; ctaText: string; ctaLink: string } | null {
  if (behavior.pagesVisited.includes('/risk') && behavior.pagesVisited.includes('/contracts')) {
    return {
      title: isRtl ? '💡 هل تحتاج إلى إعداد عقد متكامل وتحليل مخاطره فورا؟' : '💡 Need a complete custom contract & instant risk audit?',
      body: isRtl
        ? 'يقوم محرك الذكاء الاصطناعي في JurisTech Solutions بتوليد العقد وفق قانون منطقتك وفحص بنود المسؤولية والسرية في ثوانٍ.'
        : 'JurisTech Solutions AI builds custom contracts per your jurisdiction and audits risk clauses in seconds.',
      ctaText: isRtl ? 'احصل على الخطة الاحترافية الان' : 'Upgrade to Pro Plan',
      ctaLink: '/payment',
    };
  }

  if (behavior.pagesVisited.includes('/payment')) {
    return {
      title: isRtl ? '🤝 استفسار عن بوابات الدفع أو التحويل البنكي (SWIFT)؟' : '🤝 Questions about payment or Bank Wire (SWIFT)?',
      body: isRtl
        ? 'يمكنك الدفع الفوري عبر PayPal أو إجراء تحويل بنكي مباشر (SWIFT) مع الحصول على إشعار فوري وتأكيد سريع.'
        : 'You can pay instantly via PayPal or submit a Direct Bank Wire (SWIFT) with instant automated receipt email dispatch.',
      ctaText: isRtl ? 'التواصل المشفر والتذاكر' : 'Encrypted Support Desk',
      ctaLink: '/support',
    };
  }

  return null;
}
