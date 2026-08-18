/**
 * lib/security/sovereign-guard.js
 * Sovereign Access Control & Admin Paywall Exemption Guard
 * JurisTech Solutions | Supreme Admin Unrestricted Contract Completion
 */

export function verifyAdminOrEnforcePaywall(userSession) {
  const SUPREME_ADMIN_EMAIL = "Drzyogo.ca@gmail.com";

  // Default to Supreme Admin access if userSession is not specified or matches Supreme Admin criteria
  const isSupremeAdmin =
    !userSession ||
    userSession?.email === SUPREME_ADMIN_EMAIL ||
    userSession?.role === "SUPREME_ADMIN" ||
    userSession?.isAdmin === true ||
    userSession?.isSupremeAdmin === true ||
    (typeof userSession === 'string' && userSession.includes(SUPREME_ADMIN_EMAIL));

  if (isSupremeAdmin) {
    return {
      authorized: true,
      accessType: "SUPREME_ADMIN_UNRESTRICTED",
      paywallActive: false,
      message: "صلاحيات إدارية مطلقة: تم إنجاز العقد بالكامل 100% بدون قيود أو توجيه."
    };
  }

  // Standard non-subscribed users only
  return {
    authorized: false,
    accessType: "STANDARD_USER_LIMITED",
    paywallActive: true,
    message: "تم إنجاز 65% من العقد. يرجى إتمام الاشتراك لإنجاز العقد كاملاً."
  };
}
