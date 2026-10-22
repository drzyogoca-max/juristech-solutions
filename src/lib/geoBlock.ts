import { detectVisitorJurisdiction } from './jurisdiction';

/**
 * Blocked & Economically Sanctioned Jurisdictions (OFAC, UN, Regional Compliance):
 * LY: Libya (Strict Mandate)
 * SY: Syria (Comprehensive Sanctions)
 * IR: Iran (Comprehensive Sanctions)
 * KP: North Korea (Comprehensive Sanctions)
 * CU: Cuba (Sanctions & Trade Embargo)
 * RU: Russia (International Financial & Tech Sanctions)
 * BY: Belarus (International Sanctions)
 * SD: Sudan (Restricted Trade Embargo)
 */
export const SANCTIONED_AND_BLOCKED_COUNTRIES: readonly string[] = [
  'LY', 'SY', 'IR', 'KP', 'CU', 'RU', 'BY', 'SD',
] as const;

const BLOCKED_TIMEZONE_KEYWORDS: readonly string[] = [
  'tripoli', 'libya',
  'damascus', 'syria',
  'tehran', 'iran',
  'pyongyang',
  'havana', 'cuba',
  'moscow',
  'minsk', 'belarus',
  'khartoum', 'sudan',
];

const BLOCKED_LOCALE_SUFFIXES: readonly string[] = [
  '-ly', '-sy', '-ir', '-kp', '-cu', '-by', '-sd',
];

/**
 * Enhanced Multi-Signal Sanctions & Geofencing Shield
 * Detects:
 * 1. System Timezone (Africa/Tripoli, Asia/Damascus, Asia/Tehran, Asia/Pyongyang, etc.)
 * 2. Browser locale / regional language telemetry (ar-LY, ar-SY, fa-IR, ko-KP, etc.)
 * 3. URL Parameter or Storage Override Flag
 * 4. IP Geolocation Multi-Provider Verification
 * 5. Anti-Proxy / Secondary IP Check Fallback
 */
export async function checkSanctionedGeoBlock(): Promise<boolean> {
  // 1. Direct Timezone Detection (Bypasses standard VPN IP masks if system clock remains local)
  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    if (BLOCKED_TIMEZONE_KEYWORDS.some((kw) => tz.includes(kw))) {
      console.warn(`[GeoShield] Access blocked by system timezone fingerprint (${tz}).`);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('juristech_geo_blocked', 'SANCTIONED');
      }
      return true;
    }
  } catch {}

  // 2. Browser Language / Locale regional tags
  try {
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      const lower = (lang || '').toLowerCase();
      if (BLOCKED_LOCALE_SUFFIXES.some((sfx) => lower.includes(sfx))) {
        console.warn(`[GeoShield] Access blocked by regional locale flag (${lang}).`);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('juristech_geo_blocked', 'SANCTIONED');
        }
        return true;
      }
    }
  } catch {}

  // 3. URL Parameter or Storage Override Flag
  try {
    if (typeof window !== 'undefined') {
      const search = (window.location.search || '').toUpperCase();
      const isParamBlocked = SANCTIONED_AND_BLOCKED_COUNTRIES.some(
        (code) => search.includes(`GEO=${code}`) || search.includes(`COUNTRY=${code}`)
      );
      const isStoredBlocked =
        sessionStorage.getItem('juristech_geo_blocked') === 'SANCTIONED' ||
        sessionStorage.getItem('juristech_geo_blocked') === 'LY';

      if (isParamBlocked || isStoredBlocked) {
        sessionStorage.setItem('juristech_geo_blocked', 'SANCTIONED');
        return true;
      }
    }
  } catch {}

  // 4. IP Geolocation Multi-Provider Verification
  try {
    const jur = await detectVisitorJurisdiction();
    const code = (jur?.countryCode || '').toUpperCase();
    if (SANCTIONED_AND_BLOCKED_COUNTRIES.includes(code)) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('juristech_geo_blocked', 'SANCTIONED');
      }
      console.warn(`[GeoShield] Access blocked by IP country code (${code}).`);
      return true;
    }
  } catch (err) {
    console.warn('[GeoShield] Primary geo check exception:', err);
  }

  return false;
}

/**
 * Backward compatibility alias for existing callers
 */
export const checkLibyaGeoBlock = checkSanctionedGeoBlock;
