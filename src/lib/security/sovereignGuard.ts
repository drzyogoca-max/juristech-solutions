/**
 * src/lib/security/sovereignGuard.ts
 * Sovereign Access Control & Admin Paywall Exemption Guard
 * JurisTech Solutions | Supreme Admin Unrestricted Contract Completion
 */

export interface UserSessionPayload {
  email?: string;
  role?: string;
  isAdmin?: boolean;
  isSupremeAdmin?: boolean;
}

export interface SovereignGuardResult {
  authorized: boolean;
  accessType: string;
  paywallActive: boolean;
  message: string;
}

export function verifyAdminOrEnforcePaywall(userSession?: UserSessionPayload | string | null): SovereignGuardResult {
  // ⚠️ SECURITY FIX: null/undefined session MUST be denied, not granted super-admin
  if (!userSession) {
    return {
      authorized: false,
      accessType: 'UNAUTHENTICATED',
      paywallActive: true,
      message: 'جلسة غير مصادق عليها — يُرجى تسجيل الدخول أولاً.'
    };
  }

  const SUPREME_ADMIN_EMAIL = import.meta.env.VITE_SUPREME_ADMIN_EMAIL || '';
  let isSupremeAdmin = false;

  if (typeof userSession === 'string') {
    // Exact email match only — no partial includes, no wildcard
    isSupremeAdmin = SUPREME_ADMIN_EMAIL.length > 0 && userSession === SUPREME_ADMIN_EMAIL;
  } else {
    isSupremeAdmin =
      (SUPREME_ADMIN_EMAIL.length > 0 && userSession.email === SUPREME_ADMIN_EMAIL) ||
      userSession.role === 'SUPREME_ADMIN' ||
      userSession.isSupremeAdmin === true;
    // ⚠️ NOTE: isAdmin alone does NOT grant SUPREME access — requires explicit role
  }

  if (isSupremeAdmin) {
    return {
      authorized: true,
      accessType: 'SUPREME_ADMIN_UNRESTRICTED',
      paywallActive: false,
      message: 'صلاحيات إدارية مطلقة: تم إنجاز العقد بالكامل 100% بدون قيود أو توجيه.'
    };
  }

  return {
    authorized: false,
    accessType: 'STANDARD_USER_LIMITED',
    paywallActive: true,
    message: 'تم إنجاز 65% من العقد. يرجى إتمام الاشتراك لإنجاز العقد كاملاً.'
  };
}
