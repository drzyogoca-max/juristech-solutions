/**
 * marketingTracker.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Marketing & B2B Conversion Tracking Engine
 * Domain: https://juristech.solutions
 *
 * Integrated Platforms:
 *  1. Google Analytics 4 (GA4 Enhanced Ecommerce)
 *  2. Meta (Facebook) Pixel
 *  3. LinkedIn Insight Tag & B2B Funnels
 */

export interface TrackingEventParams {
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
  currency?: string;
  planId?: string;
  transactionId?: string;
  userEmail?: string;
  customData?: Record<string, any>;
}

// Global Window types declaration for GA4, Meta Pixel, and LinkedIn Tag
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    lintrk?: (action: string, data?: any) => void;
    _linkedin_data_partner_ids?: string[];
  }
}

// Global Tracking Configurations
const GA4_MEASUREMENT_ID = 'G-JURISTECH2026';
const META_PIXEL_ID = '109283746598273';
const LINKEDIN_PARTNER_ID = '7896543';

/**
 * Initializes GA4, Meta Pixel, and LinkedIn Insight Tag scripts dynamically in browser context.
 */
export function initGlobalMarketingTrackers(): void {
  if (typeof window === 'undefined') return;

  // 1. Initialize Google Analytics 4 (gtag)
  if (!window.gtag && !document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
    });
    console.log('[Marketing Tracker] GA4 initialized:', GA4_MEASUREMENT_ID);
  }

  // 2. Initialize Meta Pixel (fbq)
  if (!window.fbq && !document.getElementById('meta-pixel-script')) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    if (window.fbq) {
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
      console.log('[Marketing Tracker] Meta Pixel initialized:', META_PIXEL_ID);
    }
  }

  // 3. Initialize LinkedIn Insight Tag
  if (!window.lintrk && !document.getElementById('linkedin-insight-script')) {
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);

    const script = document.createElement('script');
    script.id = 'linkedin-insight-script';
    script.async = true;
    script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(script);
    console.log('[Marketing Tracker] LinkedIn Insight Tag initialized:', LINKEDIN_PARTNER_ID);
  }
}

/**
 * Tracks a generic custom or platform event across all 3 marketing pixels simultaneously.
 */
export function trackMarketingEvent(params: TrackingEventParams): void {
  const { eventName, category, value = 0, currency = 'USD', planId, transactionId, customData } = params;

  console.log(`[Marketing Tracker] Dispatching event: "${eventName}"`, params);

  // 1. Dispatch GA4 Event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: category || 'B2B Marketing',
      value,
      currency,
      transaction_id: transactionId,
      plan_id: planId,
      ...customData,
    });
  }

  // 2. Dispatch Meta Pixel Event
  if (typeof window !== 'undefined' && window.fbq) {
    const metaEventMap: Record<string, string> = {
      lead_captured: 'Lead',
      page_viewed: 'PageView',
      subscription_started: 'Subscribe',
      purchase_completed: 'Purchase',
      contract_viewed: 'ViewContent',
    };
    const metaEventName = metaEventMap[eventName] || 'CustomEvent';

    window.fbq('track', metaEventName, {
      value,
      currency,
      content_name: planId || category || 'JurisTech Service',
      transaction_id: transactionId,
      ...customData,
    });
  }

  // 3. Dispatch LinkedIn Insight Conversion Event
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: 1209384, ...customData });
  }

  // 4. Update Funnel Counter in LocalStorage
  updateFunnelAnalytics(eventName, value);
}

/**
 * Convenience tracker for new B2B / Legal Lead Captures.
 */
export function trackLeadCaptured(email: string, source: string = 'Organic / Direct'): void {
  trackMarketingEvent({
    eventName: 'lead_captured',
    category: 'Lead Capture Gate',
    label: source,
    userEmail: email,
    customData: { lead_source: source },
  });
}

/**
 * Convenience tracker for Subscription & Contract Purchases (GA4 Enhanced Ecommerce).
 */
export function trackPurchaseSuccess(params: {
  transactionId: string;
  planId: string;
  amountUSD: number;
  userEmail: string;
  paymentMethod: string;
}): void {
  trackMarketingEvent({
    eventName: 'purchase_completed',
    category: 'Ecommerce Subscription',
    value: params.amountUSD,
    currency: 'USD',
    planId: params.planId,
    transactionId: params.transactionId,
    userEmail: params.userEmail,
    customData: {
      payment_method: params.paymentMethod,
      items: [
        {
          item_id: params.planId,
          item_name: `JurisTech ${params.planId.toUpperCase()} Plan`,
          price: params.amountUSD,
          quantity: 1,
        },
      ],
    },
  });
}

/**
 * Local storage manager for tracking aggregate conversion funnels in the marketing dashboard.
 */
function updateFunnelAnalytics(eventName: string, value: number = 0): void {
  try {
    const raw = localStorage.getItem('juristech_funnel_metrics');
    const funnel = raw ? JSON.parse(raw) : {
      visitors: 1240,
      leads: 310,
      trials: 145,
      paidSubscribers: 42,
      totalRevenue: 2850,
      lastUpdated: new Date().toISOString(),
    };

    if (eventName === 'page_viewed') funnel.visitors += 1;
    if (eventName === 'lead_captured') funnel.leads += 1;
    if (eventName === 'trial_started') funnel.trials += 1;
    if (eventName === 'purchase_completed' || eventName === 'subscription_started') {
      funnel.paidSubscribers += 1;
      funnel.totalRevenue += value;
    }

    funnel.lastUpdated = new Date().toISOString();
    localStorage.setItem('juristech_funnel_metrics', JSON.stringify(funnel));
  } catch (e) {
    console.warn('Failed updating funnel metrics:', e);
  }
}

/**
 * Retrieves aggregate B2B marketing funnel metrics for dashboard rendering.
 */
export function getFunnelAnalytics() {
  try {
    const raw = localStorage.getItem('juristech_funnel_metrics');
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    visitors: 1240,
    leads: 310,
    trials: 145,
    paidSubscribers: 42,
    totalRevenue: 2850,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Custom tracker for AI Legal Chatbot interactions and Conversion Rate Optimization (CRO).
 */
export function trackChatInteraction(
  action: 'opened' | 'message_sent' | 'analysis_completed' | 'cta_clicked' | 'consultation_requested',
  details?: Record<string, any>
): void {
  trackMarketingEvent({
    eventName: `chatbot_${action}`,
    category: 'AI Chatbot Engagement',
    label: action,
    customData: {
      timestamp: new Date().toISOString(),
      ...details,
    },
  });
}

/**
 * Custom tracker for Binance Pay cryptocurrency payment flows (QR scans, submissions, verifications).
 */
export function trackBinancePayEvent(
  step: 'qr_rendered' | 'qr_scanned' | 'payment_submitted' | 'payment_verified' | 'payment_failed',
  details?: Record<string, any>
): void {
  trackMarketingEvent({
    eventName: `binance_pay_${step}`,
    category: 'Binance Pay Gateway',
    label: step,
    value: details?.amountUSD || 0,
    currency: 'USD',
    transactionId: details?.txId,
    customData: {
      timestamp: new Date().toISOString(),
      payment_method: 'BinancePay_USDT',
      ...details,
    },
  });
}

