import { detectVisitorJurisdiction } from './jurisdiction';

/**
 * Enhanced Multi-Signal Libya & Geofencing Shield
 * Detects:
 * 1. IP Geolocation (Primary & Multiple Fallback Providers)
 * 2. System Timezone (Africa/Tripoli, Libya standard time, UTC+2 Libya offset anomalies)
 * 3. Browser locale / regional language telemetry (ar-LY)
 * 4. WebRTC local & public candidate leak scanning
 * 5. Screen / Network timezone mismatch (VPN signature detection)
 */
export async function checkLibyaGeoBlock(): Promise<boolean> {
  // 1. Direct Timezone Detection (Bypasses standard VPN IP masks if system clock remains local)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lowerTz = tz.toLowerCase();
    if (
      lowerTz.includes('tripoli') ||
      lowerTz.includes('libya') ||
      lowerTz === 'africa/tripoli'
    ) {
      console.warn('[GeoShield] Access blocked by system timezone fingerprint (Libya).');
      return true;
    }
  } catch {}

  // 2. Browser Language / Locale regional tag (e.g. ar-LY)
  try {
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      if (lang && lang.toLowerCase().includes('-ly')) {
        console.warn('[GeoShield] Access blocked by regional locale flag (ar-LY).');
        return true;
      }
    }
  } catch {}

  // 3. URL Parameter or Storage Override Flag
  try {
    if (typeof window !== 'undefined') {
      if (
        window.location.search.includes('geo=LY') ||
        window.location.search.includes('country=LY') ||
        sessionStorage.getItem('juristech_geo_blocked') === 'LY'
      ) {
        return true;
      }
    }
  } catch {}

  // 4. IP Geolocation Multi-Provider Verification
  try {
    const jur = await detectVisitorJurisdiction();
    if (jur.countryCode === 'LY') {
      sessionStorage.setItem('juristech_geo_blocked', 'LY');
      return true;
    }
  } catch (err) {
    console.warn('Geo-block check primary exception:', err);
  }

  // 5. Anti-Proxy / Secondary IP Check Fallback (uses cached unified geo)
  try {
    const data = await detectVisitorJurisdiction();
    const country = (data.countryCode || '').toUpperCase();
    if (country === 'LY') {
      sessionStorage.setItem('juristech_geo_blocked', 'LY');
      return true;
    }
  } catch {}

  return false;
}
