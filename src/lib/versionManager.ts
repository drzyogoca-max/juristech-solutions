/**
 * src/lib/versionManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Global Force-Update Protocol & Autonomous Cache Destruction Engine
 *
 * Responsibilities:
 *  1. Immediate Cache Destruction & Hard Reload on App Version Mismatch
 *  2. Poll for remote /version.json every 60 seconds
 *  3. On version mismatch → purge all ServiceWorker & CacheStorage entries
 *  4. Force-reload all open tabs via BroadcastChannel (with 60s loop protection)
 *  5. Wipe stale localStorage keys on version bump
 */

export const CURRENT_APP_VERSION = '2026.08.15-FORCE-PURGE-1787130045386';
const CHECK_INTERVAL_MS         = 60_000;               // Poll every 60 s
const VERSION_ENDPOINT          = '/version.json';      // Served from /public
const BROADCAST_CHANNEL_NAME    = 'juristech_updates';
const LS_VERSION_KEY            = 'juristech_app_version';
const LS_FORCE_REFRESH_KEY      = 'ls_force_refresh';

// localStorage keys that are safe to wipe on a version bump
const STALE_CACHE_KEYS = [
  'ls_persona_profile',
  'ls_outreach_history',
  'ls_radar_leads',
  'ls_analytics_cache',
  'ls_vector_context',
  'ls_review_queue_items_v2',
  'juristech_live_radar_leads_v2',
  'juristech_global_contract_state',
  'juristech_visitor_radar',
];

// ── Broadcast Channel ─────────────────────────────────────────────────────────
let _channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!_channel) _channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  return _channel;
}

/** Read stored version from localStorage */
export function getStoredVersion(): string {
  try { return localStorage.getItem(LS_VERSION_KEY) || CURRENT_APP_VERSION; } catch { return CURRENT_APP_VERSION; }
}

/** Global Force-Update: Purges CacheStorage, ServiceWorkers & Hard Reloads */
export function enforceGlobalForceUpdate() {
  if (typeof window === 'undefined') return;

  try {
    const savedVersion = localStorage.getItem(LS_VERSION_KEY);
    if (savedVersion !== CURRENT_APP_VERSION) {
      console.warn(`[Global Force-Update] Version mismatch: ${savedVersion} → ${CURRENT_APP_VERSION}. Purging caches...`);
      localStorage.setItem(LS_VERSION_KEY, CURRENT_APP_VERSION);
      localStorage.setItem('ls_app_version', CURRENT_APP_VERSION);

      // 1. Purge CacheStorage
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }

      // 2. Unregister Service Workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }

      // 3. Purge Stale LocalStorage Keys
      STALE_CACHE_KEYS.forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });

      // 4. Force Hard Reload
      window.location.reload();
    }
  } catch (err) {
    console.error('[Global Force-Update Exception]:', err);
  }
}

/** Persist current version to localStorage */
function stampCurrentVersion() {
  try { localStorage.setItem(LS_VERSION_KEY, CURRENT_APP_VERSION); } catch {}
}

/** Tell Service Worker to delete all caches */
export async function commandSWCachePurge() {
  if (!navigator.serviceWorker?.controller) return;
  try {
    navigator.serviceWorker.controller.postMessage({
      type: 'PURGE_ALL_CACHES',
      version: CURRENT_APP_VERSION,
    });
  } catch (err) {
    console.warn('[VersionManager] SW purge notice:', err);
  }
}

/** Broadcast reload command to all open tabs */
function broadcastReload(newVersion: string) {
  const ch = getChannel();
  if (ch) {
    ch.postMessage({ type: 'VERSION_UPDATE', version: newVersion });
  }
}

/** Force hard reload stripping query caches with strict 60s loop protection */
function forceHardReload() {
  try {
    const lastReloadStr = localStorage.getItem(LS_FORCE_REFRESH_KEY);
    const lastReload = lastReloadStr ? parseInt(lastReloadStr, 10) : 0;
    const now = Date.now();

    if (now - lastReload < 60_000) {
      console.warn('[VersionManager] Reload suppressed: page was already refreshed within the last 60s.');
      return;
    }

    localStorage.setItem(LS_FORCE_REFRESH_KEY, now.toString());
  } catch {}

  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// ── Update callback registry ──────────────────────────────────────────────────
type UpdateCallback = (newVersion: string) => void;
const _listeners: Set<UpdateCallback> = new Set();

export function onUpdateAvailable(cb: UpdateCallback) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

function notifyListeners(newVersion: string) {
  _listeners.forEach(cb => cb(newVersion));
}

// ── Remote version fetch ──────────────────────────────────────────────────────
let _latestDetectedVersion: string | null = null;

async function fetchRemoteVersion(): Promise<string | null> {
  try {
    const res = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return typeof json?.version === 'string' ? json.version : null;
  } catch {
    return null;
  }
}

// ── Main init ─────────────────────────────────────────────────────────────────
let _initialized = false;

function purgeCorruptedRawStreamsFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('juristech_global_contract_state');
    if (raw && (raw.includes('PDF-1.') || raw.includes('595.2799') || raw.includes('841.8899') || raw.includes('cprt mluc') || raw.includes('bTRC'))) {
      console.warn('[VersionManager] Corrupted raw stream detected in localStorage. Purging juristech_global_contract_state...');
      localStorage.removeItem('juristech_global_contract_state');
    }
  } catch {}
}

export function initVersionManager() {
  if (_initialized) return;
  _initialized = true;

  // Immediately purge any stale corrupted PDF raw stream from localStorage
  purgeCorruptedRawStreamsFromStorage();

  // Run Global Force-Update Protocol first
  enforceGlobalForceUpdate();

  stampCurrentVersion();

  // Listen for reload broadcasts from other tabs
  const ch = getChannel();
  if (ch) {
    ch.onmessage = (event) => {
      if (event.data?.type === 'VERSION_UPDATE') {
        const newVer = event.data.version as string;
        if (newVer && newVer !== CURRENT_APP_VERSION) {
          console.info('[VersionManager] Cross-tab update broadcast received →', newVer);
          notifyListeners(newVer);
          setTimeout(forceHardReload, 1000);
        }
      }
    };
  }

  // Start polling loop for new remote deployments
  const poll = async () => {
    const remote = await fetchRemoteVersion();
    if (!remote) return;

    const stored = getStoredVersion();

    if (remote !== stored && remote !== CURRENT_APP_VERSION && remote !== _latestDetectedVersion) {
      _latestDetectedVersion = remote;
      console.info(`[VersionManager] Remote deployment update detected: ${stored} → ${remote}`);

      await commandSWCachePurge();
      notifyListeners(remote);
      broadcastReload(remote);
      stampCurrentVersion();
      setTimeout(forceHardReload, 1000);
    }
  };

  setTimeout(poll, 10_000);
  setInterval(poll, CHECK_INTERVAL_MS);

  console.info(`[VersionManager] Initialized — version ${CURRENT_APP_VERSION}, polling every ${CHECK_INTERVAL_MS / 1000}s`);
}

export async function triggerImmediateUpdate() {
  await commandSWCachePurge();
  broadcastReload(CURRENT_APP_VERSION);
  setTimeout(forceHardReload, 500);
}
