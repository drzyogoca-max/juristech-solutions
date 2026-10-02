/**
 * src/lib/gumroadGateway.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Gumroad Sovereign Card & Apple Pay Payment Gateway
 * Merchant of Record (MoR) Integration — Zero Company Registration Required
 *
 * Capabilities:
 *  1. Direct Card Checkout (Visa, Mastercard, American Express, Apple Pay, Google Pay).
 *  2. Seamless Gumroad Overlay (opens directly in-app via gumroad.js without leaving site).
 *  3. Dynamic email pre-fill for zero-friction conversion.
 *  4. Environment-variable & runtime customizable permalinks for all tiers:
 *     - Startup: $49/mo
 *     - SMEs & Growth: $139/mo
 *     - Enterprise: $349/mo
 *     - Deal Room: $990
 */

export interface GumroadPlanConfig {
  id: 'startup' | 'sme' | 'enterprise' | 'dealroom';
  nameEn: string;
  nameAr: string;
  priceUSD: number;
  defaultPermalink: string;
  envKey: string;
}

export const GUMROAD_PLANS: Record<string, GumroadPlanConfig> = {
  startup: {
    id: 'startup',
    nameEn: 'Micro / Startup Tier',
    nameAr: 'حزمة الشركات الصغرى والناشئة',
    priceUSD: 49,
    defaultPermalink: 'https://drzyo.gumroad.com/l/nydsh',
    envKey: 'VITE_GUMROAD_STARTUP_URL',
  },
  sme: {
    id: 'sme',
    nameEn: 'SMEs & Growth Package',
    nameAr: 'حزمة الشركات المتوسطة والنمو المتسارع',
    priceUSD: 139,
    defaultPermalink: 'https://drzyo.gumroad.com/l/ekrrs',
    envKey: 'VITE_GUMROAD_SME_URL',
  },
  enterprise: {
    id: 'enterprise',
    nameEn: 'Enterprise Sovereign Tier',
    nameAr: 'حزمة المؤسسات السيادية والشركات الكبرى',
    priceUSD: 349,
    defaultPermalink: 'https://drzyo.gumroad.com/l/sqzed',
    envKey: 'VITE_GUMROAD_ENTERPRISE_URL',
  },
  dealroom: {
    id: 'dealroom',
    nameEn: 'Dedicated Deal Room Retainer',
    nameAr: 'غرفة الصفقات والاستحواذ المخصصة M&A',
    priceUSD: 990,
    defaultPermalink: 'https://drzyo.gumroad.com/l/sqzed',
    envKey: 'VITE_GUMROAD_DEALROOM_URL',
  },
};

const STORAGE_OVERRIDE_PREFIX = 'juristech_gumroad_url_';

/**
 * Gets the active checkout URL for a specific plan.
 * Checks runtime localStorage overrides first, then Vite env variables, then default.
 */
export function getGumroadCheckoutUrl(
  planId: string,
  options?: { email?: string; referrer?: string; returnUrl?: string }
): string {
  const plan = GUMROAD_PLANS[planId] || GUMROAD_PLANS.startup;

  // 1. Check localStorage override (useful for testing and instant production overrides)
  let baseUrl = '';
  if (typeof window !== 'undefined') {
    baseUrl = localStorage.getItem(`${STORAGE_OVERRIDE_PREFIX}${plan.id}`) || '';
  }

  // 2. Check Vite env variables
  if (!baseUrl && typeof import.meta !== 'undefined' && import.meta.env) {
    const envVal = import.meta.env[plan.envKey];
    if (typeof envVal === 'string' && envVal.trim()) {
      baseUrl = envVal.trim();
    }
  }

  // 3. Fallback to default permalink
  if (!baseUrl) {
    baseUrl = plan.defaultPermalink;
  }

  // Ensure protocol
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }

  // Append query parameters
  try {
    const urlObj = new URL(baseUrl);
    if (options?.email && options.email.trim()) {
      urlObj.searchParams.set('email', options.email.trim());
    }
    if (options?.referrer) {
      urlObj.searchParams.set('referrer', options.referrer);
    }
    // Flag to enable Gumroad clean overlay behavior
    urlObj.searchParams.set('wanted', 'true');
    return urlObj.toString();
  } catch (err) {
    // In case of invalid URL string fallback
    const queryParts: string[] = ['wanted=true'];
    if (options?.email) queryParts.push(`email=${encodeURIComponent(options.email.trim())}`);
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryParts.join('&')}`;
  }
}

/**
 * Sets a custom Gumroad URL in localStorage for real-time testing or admin updates
 */
export function setGumroadCustomUrl(planId: string, url: string): void {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim();
  if (cleanUrl) {
    localStorage.setItem(`${STORAGE_OVERRIDE_PREFIX}${planId}`, cleanUrl);
  } else {
    localStorage.removeItem(`${STORAGE_OVERRIDE_PREFIX}${planId}`);
  }
}

/**
 * Triggers the Gumroad checkout for a given plan.
 * Uses Gumroad Overlay if available; falls back to window.open.
 */
export function openGumroadCheckout(
  planId: string,
  options?: { email?: string; referrer?: string }
): void {
  const url = getGumroadCheckoutUrl(planId, options);

  // If running in browser:
  if (typeof window !== 'undefined') {
    // Attempt to invoke Gumroad Overlay if the script attached to window
    const gumroadGlobal = (window as unknown as { GumroadOverlay?: { open: (url: string) => void } }).GumroadOverlay;
    if (gumroadGlobal && typeof gumroadGlobal.open === 'function') {
      try {
        gumroadGlobal.open(url);
        return;
      } catch (e) {
        console.warn('[Gumroad Gateway] Overlay launch failed, falling back to direct window:', e);
      }
    }

    // Direct window open fallback (guarantees payment works 100% on mobile and all browsers)
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
