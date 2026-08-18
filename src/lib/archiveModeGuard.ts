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

export const ARCHIVE_MODE_REDIRECT_URL = 'https://www.juristech.solutions';

/**
 * Returns true when running on legalshieldsolution.online or legalsolution domains
 */
export function isArchiveDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host.includes('legalshield') || host.includes('legalsolution') || host === 'juristech.solutions';
}

/**
 * Call on app boot — immediately redirects all visitors from Legal Solution / legacy domains
 * directly to the primary active platform: https://www.juristech.solutions
 */
export function enforceArchiveModeGuard(): void {
  if (!isArchiveDomain()) return;

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const currentHash = window.location.hash;

  // Immediate permanent seamless redirection
  window.location.replace(`${ARCHIVE_MODE_REDIRECT_URL}${currentPath}${currentSearch}${currentHash}`);
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
