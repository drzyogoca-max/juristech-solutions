/**
 * cacheManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions | Platform-Wide Persistent Cache Purging & Anti-Stale Utility
 *
 * Ensures all existing and new users automatically receive the latest platform code,
 * Gemini AI upgrades, official email configurations, and privacy fixes immediately.
 */

const PLATFORM_VERSION = '3.5.0-LIVE-2026';
const VERSION_STORAGE_KEY = 'juristech_app_version';

/** Purges local cache if version mismatch or forced reset */
export function purgePlatformCache(force = false): void {
  if (typeof window === 'undefined') return;

  try {
    const currentVersion = localStorage.getItem(VERSION_STORAGE_KEY);

    if (force || currentVersion !== PLATFORM_VERSION) {
      console.info(`[CacheManager] Updating platform cache to version: ${PLATFORM_VERSION}`);

      // 1. Invalidate stale session keys
      const keysToClear = [
        'jt_free_chat_count',
        'juristech_ai_response_cache',
        'ls_cached_responses',
        'juristech_evolution_timestamp',
      ];

      keysToClear.forEach(key => localStorage.removeItem(key));

      // 2. Set new version
      localStorage.setItem(VERSION_STORAGE_KEY, PLATFORM_VERSION);

      // 3. Clear ServiceWorker / Cache API if supported
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('juristech') || name.includes('v1') || name.includes('v2')) {
              caches.delete(name);
            }
          });
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[CacheManager] Non-fatal error during cache purge:', err);
  }
}

// Auto-run cache check upon module load
purgePlatformCache();
