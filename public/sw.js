/**
 * sw.js — LegalShield Solution Smart Service Worker v2.7.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Strategy Matrix:
 *   • Static assets (JS/CSS/fonts/images) → Cache-First (fast, then revalidate)
 *   • HTML navigation requests            → Network-First (always fresh shell)
 *   • API & Supabase calls                → Network-Only (never cache)
 *   • /version.json                       → Network-Only (version polling)
 *
 * Cache Invalidation:
 *   • PURGE_ALL_CACHES message from app → delete ALL caches + skipWaiting
 *   • Version key in cache name forces purge on every deploy
 *   • Stale-while-revalidate for static chunks
 */

const APP_VERSION = '2026.08.22-LIVE-1787380518675';
const STATIC_CACHE     = `ls-static-v${APP_VERSION}`;
const RUNTIME_CACHE    = `ls-runtime-v${APP_VERSION}`;
const FONT_CACHE       = `ls-fonts-v${APP_VERSION}`;

const ALL_CACHES       = [STATIC_CACHE, RUNTIME_CACHE, FONT_CACHE];

// Assets to pre-cache on install (app shell)
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/version.json',
];

// Hosts that must never be cached
const BYPASS_HOSTS = [
  'supabase.co',
  'supabase.com',
  'googleapis.com',         // Maps / Fonts API calls
  'openai.com',
  'api.openai.com',
  'vercel-insights.com',
];

// ─────────────────────────────────────────────────────────────────────────────
// INSTALL — Pre-cache app shell
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log(`[SW ${APP_VERSION}] Installing...`);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        // Non-fatal — some precache URLs may not exist yet
        console.warn('[SW] Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())   // Activate immediately
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVATE — Purge all caches from previous versions
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log(`[SW ${APP_VERSION}] Activated. Purging old caches...`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !ALL_CACHES.includes(name))
          .map((name) => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())  // Take control of all open tabs
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE — Handle commands from app (PURGE_ALL_CACHES, SKIP_WAITING)
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  const { type, version } = event.data || {};

  if (type === 'PURGE_ALL_CACHES') {
    console.info(`[SW] PURGE_ALL_CACHES received — triggered by version ${version}`);
    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(cacheNames.map((name) => caches.delete(name)))
      ).then(() => {
        console.info('[SW] All caches purged. Claiming clients...');
        return self.clients.claim();
      }).then(() => {
        // Notify all clients to reload
        return self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'CACHES_PURGED', version });
        });
      })
    );
  }

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// FETCH — Request interception & caching strategy
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ── 1. Ignore non-GET requests
  if (request.method !== 'GET') return;

  // ── 2. BYPASS: API / Supabase / Analytics hosts → Network-Only
  const isBypass = BYPASS_HOSTS.some((host) => url.hostname.includes(host));
  if (isBypass) return;

  // ── 3. BYPASS: version.json → always fresh
  if (url.pathname === '/version.json') {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => new Response('{}', { status: 503 }))
    );
    return;
  }

  // ── 4. HTML navigation → Network-First (fresh app shell always)
  const isNavigation = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((res) => {
          // Clone and cache shell for offline fallback
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── 5. Google Fonts → Cache-First (static, versioned by Google)
  if (url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        cache.put(request, fresh.clone());
        return fresh;
      })
    );
    return;
  }

  // ── 6. Static assets (JS, CSS, images, icons) → Network-First (guarantees latest deployed code)
  const isStatic = /\.(js|css|woff2?|png|jpg|jpeg|svg|ico|webp|gif|avif)$/.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      fetch(request)
        .then((fresh) => {
          const clone = fresh.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          return fresh;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── 7. Default → Network with cache fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
