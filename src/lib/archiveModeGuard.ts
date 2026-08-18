/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LEGALSHIELD ARCHIVE MODE GUARD v9.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Enforces legalshieldsolution.online as a READ-ONLY subscriber archive.
 *
 * When active (hostname contains 'legalshield'):
 *  ✅ Allows: Legacy subscriber profile retrieval, historical invoice lookup
 *  🚫 Blocks: New subscriptions, new payments, public marketing UI
 *  🔀 Redirects: All new-user flows → juristech.solutions
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export const ARCHIVE_MODE_REDIRECT_URL = 'https://juristech.solutions';

/**
 * Returns true when running on legalshieldsolution.online domain
 * (archive / legacy node)
 */
export function isArchiveDomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.toLowerCase().includes('legalshield');
}

/**
 * Routes blocked on archive domain — any match triggers redirect to juristech.solutions
 */
const BLOCKED_ARCHIVE_ROUTES = [
  '/payment',
  '/subscribe',
  '/plans',
  '/checkout',
  '/register',
  '/signup',
];

/**
 * Call on app boot — silently redirects new-user flows to juristech.solutions
 * if running on legalshieldsolution.online
 */
export function enforceArchiveModeGuard(): void {
  if (!isArchiveDomain()) return;

  const currentPath = window.location.pathname.toLowerCase();

  const isBlockedRoute = BLOCKED_ARCHIVE_ROUTES.some((route) =>
    currentPath.startsWith(route)
  );

  if (isBlockedRoute) {
    // Hard redirect to active platform for new subscriptions
    window.location.href = `${ARCHIVE_MODE_REDIRECT_URL}${currentPath}`;
  }

  // Stamp the domain tag in localStorage so all financial reads scope correctly
  try {
    localStorage.setItem('active_platform_domain', 'legalshieldsolution.online');
    localStorage.setItem('archive_mode_active', 'true');
  } catch {}

  console.info(
    '[ArchiveModeGuard] ℹ️ Running in archive/legacy mode on legalshieldsolution.online. ' +
    'New subscriptions → juristech.solutions'
  );
}

/**
 * Strips legalshieldsolution.online brand references from a text string.
 * Use in components that render dynamic platform name strings.
 */
export function sanitizeBrandReference(text: string): string {
  return text
    .replace(/legalshieldsolution\.online/gi, 'juristech.solutions')
    .replace(/LegalShield Solution/gi, 'JurisTech Solutions')
    .replace(/Legal Shield Solution/gi, 'JurisTech Solutions');
}
