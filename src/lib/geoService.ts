/**
 * geoService.ts
 * JurisTech Solutions - Unified GeoIP & Visitor Location Singleton
 * Eliminates redundant external IP lookups across geoBlock, jurisdiction, and visitorTracker.
 */

export interface UnifiedGeoData {
  countryCode: string;
  countryName: string;
  city: string;
  region: string;
  ip: string;
  isp?: string;
  timezone?: string;
}

const DEFAULT_GEO: UnifiedGeoData = {
  countryCode: 'SA',
  countryName: 'Saudi Arabia',
  city: 'Riyadh',
  region: 'Riyadh',
  ip: '127.0.0.1',
  isp: 'STC',
  timezone: 'Asia/Riyadh',
};

const STORAGE_KEY = 'juristech_unified_geo_v1';
let memoryCache: UnifiedGeoData | null = null;
let inFlightPromise: Promise<UnifiedGeoData> | null = null;

export async function getUnifiedVisitorGeo(): Promise<UnifiedGeoData> {
  if (memoryCache) return memoryCache;

  // Check sessionStorage
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        memoryCache = JSON.parse(saved);
        return memoryCache!;
      }
    }
  } catch {}

  // Deduplicate in-flight network requests
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    // 1. Detect fast timezone hint
    let fallback = { ...DEFAULT_GEO };
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      fallback.timezone = tz;
      if (tz.includes('Cairo') || tz.includes('Africa/Cairo')) {
        fallback.countryCode = 'EG';
        fallback.countryName = 'Egypt';
        fallback.city = 'Cairo';
      } else if (tz.includes('Dubai') || tz.includes('Asia/Dubai')) {
        fallback.countryCode = 'AE';
        fallback.countryName = 'United Arab Emirates';
        fallback.city = 'Dubai';
      } else if (tz.includes('Amman')) {
        fallback.countryCode = 'JO';
        fallback.countryName = 'Jordan';
        fallback.city = 'Amman';
      } else if (tz.includes('Tripoli') || tz.includes('Libya')) {
        fallback.countryCode = 'LY';
        fallback.countryName = 'Libya';
      }
    } catch {}

    // 2. Single network fetch with 1.5s abort timeout
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeout = setTimeout(() => controller?.abort(), 1500);

      // Attempt 0ms Edge Geo endpoint first
      let res = await fetch('/api/geo', { signal: controller?.signal }).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('https://ipapi.co/json/', { signal: controller?.signal }).catch(() => null);
      }
      clearTimeout(timeout);

      if (res && res.ok) {
        const data = await res.json();
        const resolved: UnifiedGeoData = {
          countryCode: (data.countryCode || data.country_code || fallback.countryCode || 'SA').toUpperCase(),
          countryName: data.countryName || data.country_name || fallback.countryName,
          city: data.city || fallback.city,
          region: data.region || fallback.region,
          ip: data.ip || '127.0.0.1',
          isp: data.isp || data.org || fallback.isp,
          timezone: data.timezone || fallback.timezone,
        };
        memoryCache = resolved;
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
        } catch {}
        return resolved;
      }
    } catch {}

    memoryCache = fallback;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    } catch {}
    return fallback;
  })().finally(() => {
    inFlightPromise = null;
  });

  return inFlightPromise;
}
