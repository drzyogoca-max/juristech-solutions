/**
 * financialIsolation.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Sovereign Financial & Ledger Isolation Service
 *
 * Enforces strict 100% financial isolation between target platforms:
 *  - juristech.solutions
 *  - legalshieldsolution.online
 */

export type PlatformDomainScope = 'juristech.solutions' | 'legalshieldsolution.online';

/** Detect current domain scope from window location */
export function getCurrentDomainScope(): PlatformDomainScope {
  if (typeof window === 'undefined') return 'juristech.solutions';
  const host = window.location.hostname.toLowerCase();
  if (host.includes('legalshield')) {
    return 'legalshieldsolution.online';
  }
  return 'juristech.solutions';
}

export interface IsolatedFinancialRecord {
  id: string;
  domainScope: PlatformDomainScope;
  userEmail: string;
  amountUSD: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

/** Stamp record with domain scope */
export function stampDomainScope<T extends Record<string, any>>(record: T): T & { domain_scope: PlatformDomainScope } {
  return {
    ...record,
    domain_scope: getCurrentDomainScope(),
  };
}

/** Filter transactions by domain scope */
export function filterByDomainScope<T extends { domain_scope?: string; domainScope?: string }>(
  items: T[],
  scope: PlatformDomainScope
): T[] {
  return items.filter(
    (item) => (item.domain_scope || item.domainScope || 'juristech.solutions') === scope
  );
}
