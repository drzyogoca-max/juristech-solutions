import { useEffect } from 'react';

export default function GlobalForceUpdate() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check remote version.json immediately on mount
    fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.version) return;
        const currentLocal = localStorage.getItem('jt_deployed_version');

        if (currentLocal && currentLocal !== data.version) {
          console.warn(`[Auto-Purger] New Version detected: ${data.version} (was ${currentLocal}). Wiping stale caches...`);
          localStorage.setItem('jt_deployed_version', data.version);

          // 1. Purge CacheStorage
          if ('caches' in window) {
            caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
            });
          }

          // 2. Unregister Service Workers
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
              registrations.forEach((reg) => reg.unregister());
            });
          }

          // 3. Force Instant Hard Reload
          setTimeout(() => {
            window.location.reload();
          }, 200);
        } else if (!currentLocal) {
          localStorage.setItem('jt_deployed_version', data.version);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
