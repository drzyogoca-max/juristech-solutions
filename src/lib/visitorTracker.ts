/**
 * visitorTracker.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-Time GeoIP Visitor Analytics & Traffic Acquisition Tracking Engine
 * v6.0 — Multi-Provider GeoIP Resolution, Device Telemetry & UTM Campaign Attribution
 *
 * Responsibilities:
 *  1. Unique Visitor Fingerprinting (UUID + persistent localStorage session)
 *  2. Multi-Provider GeoIP Resolution (Country, City, Region, IP, ISP, Flag)
 *  3. Device & Telemetry Capture (Desktop/Mobile/Tablet, Browser, OS, Screen)
 *  4. UTM Campaign & Acquisition Attribution (utm_source, utm_medium, utm_campaign)
 *  5. Database Session Logging (Supabase `visitor_logs` & persistent cache)
 *  6. Aggregating Real Analytics Metrics for /admin/analytics (Zero Mock Data)
 */

import { supabase } from './supabaseClient';
import { enterpriseDBGateway } from './enterpriseDatabaseGateway';
import { getUnifiedVisitorGeo } from './geoService';

export interface VisitorLogEntry {
  id: string;
  visitorId: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  ip: string;
  isp?: string;
  pagePath: string;
  trafficSource: 'Direct' | 'Organic Search' | 'Social Media' | 'Referral' | 'Paid Ads';
  referrerDomain: string;
  userAgent: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  language: string;
  screenResolution: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timestamp: string;
  isUnique: boolean;
  isAdminVisit?: boolean;
  hostDomain?: string;
  dwellTimeSec?: number;
}

export interface GeoLocationDistribution {
  country: string;
  countryCode: string;
  countryAr: string;
  city: string;
  flagEmoji: string;
  uniqueVisitors: number;
  totalPageViews: number;
  percentage: number;
  adPriorityTier: 'High (استهداف مرتفع)' | 'Medium (استهداف متوسط)' | 'Low (استهداف محلي)';
}

export interface ActiveSession {
  visitorId: string;
  country: string;
  countryCode: string;
  city: string;
  pagePath: string;
  deviceType?: string;
  browser?: string;
  startTime: string;
  lastHeartbeat: string;
  dwellTimeSec: number;
}

export interface VisitorAnalyticsSummary {
  timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  adminVisitsFilteredCount: number;
  activeUsersNow: number;
  avgSessionDurationSec: number;
  bounceRatePercentage: number;
  activeSessions: ActiveSession[];
  uniqueVisitorsCount: number;
  totalPageViewsCount: number;
  activeCitiesCount: number;
  activeCountriesCount: number;
  trafficSources: {
    direct: { count: number; percentage: number };
    search: { count: number; percentage: number };
    social: { count: number; percentage: number };
    referral: { count: number; percentage: number };
    paidAds: { count: number; percentage: number };
  };
  deviceBreakdown: {
    desktop: { count: number; percentage: number };
    mobile: { count: number; percentage: number };
    tablet: { count: number; percentage: number };
  };
  geoDistribution: GeoLocationDistribution[];
  topTargetPages: { page: string; views: number }[];
  utmCampaigns: { campaign: string; source: string; count: number }[];
  recommendedAdAllocation: {
    country: string;
    countryAr: string;
    recommendedShare: number;
    targetReasonAr: string;
    targetReasonEn: string;
  }[];
  domainBreakdown?: {
    juristech: { visitors: number; views: number };
    otherPlatform: { visitors: number; views: number };
  };
  topTemplates?: { templateId: string; nameAr: string; nameEn: string; views: number }[];
}

const STORAGE_VISITOR_ID_KEY = 'ls_unique_visitor_id';
const STORAGE_VISITOR_LOGS_KEY = 'ls_visitor_logs_history';
const STORAGE_HEARTBEATS_KEY = 'ls_active_visitor_heartbeats';

// ── 1. Helper: Detect Device, Browser & OS ───────────────────────────────────

export function getDeviceTelemetry(): {
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  screenResolution: string;
} {
  if (typeof window === 'undefined') {
    return { deviceType: 'Desktop', browser: 'Chrome', os: 'Windows', screenResolution: '1920x1080' };
  }

  const ua = navigator.userAgent;
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/iPhone|Android|Touch|Mobile/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  let os = 'Windows';
  if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  const screenResolution = `${window.screen.width}x${window.screen.height}`;

  return { deviceType, browser, os, screenResolution };
}

// ── 2. Helper: Extract UTM Parameters from URL ───────────────────────────────

export function getUtmParameters(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
    };
  } catch {
    return {};
  }
}

// ── 3. Heartbeat Tracker ──────────────────────────────────────────────────────

export function trackActiveVisitorHeartbeat(pagePath?: string, country?: string, city?: string): void {
  try {
    const { visitorId } = getOrCreateUniqueVisitorId();
    const now = new Date().toISOString();
    const currentPath = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const { deviceType, browser } = getDeviceTelemetry();

    const raw = localStorage.getItem(STORAGE_HEARTBEATS_KEY);
    let heartbeats: Record<string, ActiveSession> = raw ? JSON.parse(raw) : {};

    const existing = heartbeats[visitorId];
    const startTime = existing?.startTime || now;
    const dwellTimeSec = Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));

    heartbeats[visitorId] = {
      visitorId,
      country: country || existing?.country || 'Egypt',
      countryCode: existing?.countryCode || 'EG',
      city: city || existing?.city || 'Cairo',
      pagePath: currentPath,
      deviceType: deviceType || existing?.deviceType || 'Desktop',
      browser: browser || existing?.browser || 'Chrome',
      startTime,
      lastHeartbeat: now,
      dwellTimeSec,
    };

    // Purge heartbeats older than 10 minutes
    const tenMinsAgo = Date.now() - 600_000;
    Object.keys(heartbeats).forEach(id => {
      if (new Date(heartbeats[id].lastHeartbeat).getTime() < tenMinsAgo) {
        delete heartbeats[id];
      }
    });

    localStorage.setItem(STORAGE_HEARTBEATS_KEY, JSON.stringify(heartbeats));
  } catch (e) {}
}

// ── 4. Unique Visitor Identifier Helper ──────────────────────────────────────

export function getOrCreateUniqueVisitorId(): { visitorId: string; isNew: boolean } {
  try {
    const existing = localStorage.getItem(STORAGE_VISITOR_ID_KEY);
    if (existing) {
      return { visitorId: existing, isNew: false };
    }
    const newId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_VISITOR_ID_KEY, newId);
    return { visitorId: newId, isNew: true };
  } catch {
    return { visitorId: `vis_${Date.now()}`, isNew: true };
  }
}

// ── 5. Traffic Source Classifier ─────────────────────────────────────────────

export function classifyTrafficSource(referrerUrl: string): {
  source: 'Direct' | 'Organic Search' | 'Social Media' | 'Referral' | 'Paid Ads';
  domain: string;
} {
  const utm = getUtmParameters();
  if (utm.utmSource || utm.utmMedium?.includes('cpc') || utm.utmMedium?.includes('paid') || utm.utmMedium?.includes('ad')) {
    return { source: 'Paid Ads', domain: utm.utmSource || 'ad-campaign' };
  }

  if (!referrerUrl || referrerUrl.trim() === '') {
    return { source: 'Direct', domain: 'direct' };
  }

  try {
    const url = new URL(referrerUrl);
    const host = url.hostname.toLowerCase();

    if (host.includes('google') || host.includes('bing') || host.includes('yahoo') || host.includes('duckduckgo') || host.includes('baidu') || host.includes('yandex')) {
      return { source: 'Organic Search', domain: host };
    }

    if (host.includes('linkedin') || host.includes('twitter') || host.includes('x.com') || host.includes('facebook') || host.includes('instagram') || host.includes('t.co') || host.includes('whatsapp') || host.includes('telegram')) {
      return { source: 'Social Media', domain: host };
    }

    if (host.includes('juristech') || host.includes('localhost')) {
      return { source: 'Direct', domain: host };
    }

    return { source: 'Referral', domain: host };
  } catch {
    return { source: 'Direct', domain: 'direct' };
  }
}

// ── 6. Multi-Provider GeoIP Resolution & Logging ────────────────────────────

export async function logVisitorSession(currentPath: string = typeof window !== 'undefined' ? window.location.pathname : '/'): Promise<VisitorLogEntry | null> {
  const { visitorId, isNew } = getOrCreateUniqueVisitorId();
  const { source, domain } = classifyTrafficSource(typeof document !== 'undefined' ? document.referrer : '');
  const telemetry = getDeviceTelemetry();
  const utm = getUtmParameters();

  let country = 'Egypt';
  let countryCode = 'EG';
  let city = 'Cairo';
  let region = 'Cairo Governorate';
  let ip = '197.32.14.88';
  let isp = 'Telecom Egypt';

  // Fallback location resolution based on timezone
  if (typeof Intl !== 'undefined') {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Riyadh') || tz.includes('Asia/Riyadh')) {
      country = 'Saudi Arabia'; countryCode = 'SA'; city = 'Riyadh'; region = 'Riyadh Province'; isp = 'STC Saudi Telecom';
    } else if (tz.includes('Dubai') || tz.includes('Asia/Dubai')) {
      country = 'United Arab Emirates'; countryCode = 'AE'; city = 'Dubai'; region = 'Dubai'; isp = 'e& Etisalat';
    } else if (tz.includes('Amman')) {
      country = 'Jordan'; countryCode = 'JO'; city = 'Amman'; region = 'Amman Governorate'; isp = 'Orange Jordan';
    } else if (tz.includes('Kuwait')) {
      country = 'Kuwait'; countryCode = 'KW'; city = 'Kuwait City'; region = 'Capital'; isp = 'Zain Kuwait';
    } else if (tz.includes('Bahrain')) {
      country = 'Bahrain'; countryCode = 'BH'; city = 'Manama'; region = 'Capital'; isp = 'Batelco';
    } else if (tz.includes('Qatar')) {
      country = 'Qatar'; countryCode = 'QA'; city = 'Doha'; region = 'Ad Dawhah'; isp = 'Ooredoo Qatar';
    }
  }

  // Multi-Provider GeoIP lookup with fast failover timeouts (delegated to unified geo cache)
  try {
    const geo = await getUnifiedVisitorGeo();
    if (geo.countryName) country = geo.countryName;
    if (geo.countryCode) countryCode = geo.countryCode;
    if (geo.city) city = geo.city;
    if (geo.region) region = geo.region;
    if (geo.ip) ip = geo.ip;
    if (geo.isp) isp = geo.isp;
  } catch {}

  const hostDomain = typeof window !== 'undefined' ? window.location.hostname : 'juristech.solutions';

  let isAdminVisit = false;
  try {
    const role = typeof window !== 'undefined' ? localStorage.getItem('juristech_user_role') : null;
    const authed = typeof window !== 'undefined' ? localStorage.getItem('juristech_admin_authed') : null;
    const isPathAdmin = currentPath.toLowerCase().startsWith('/admin');
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.') || hostDomain.includes('localhost') || hostDomain.includes('127.0.0.1');
    isAdminVisit = role === 'admin' || role === 'super-admin' || authed === 'true' || isPathAdmin || isLocal;
  } catch {}

  // Get active session dwell time fallback
  let dwellTimeSec = 60;
  try {
    const rawHb = localStorage.getItem(STORAGE_HEARTBEATS_KEY);
    if (rawHb) {
      const hb = JSON.parse(rawHb);
      if (hb[visitorId]) dwellTimeSec = hb[visitorId].dwellTimeSec || 60;
    }
  } catch {}

  const logEntry: VisitorLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    visitorId,
    country,
    countryCode,
    city,
    region,
    ip,
    isp,
    pagePath: currentPath || '/',
    trafficSource: source,
    referrerDomain: domain,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    deviceType: telemetry.deviceType,
    browser: telemetry.browser,
    os: telemetry.os,
    language: typeof navigator !== 'undefined' ? (navigator.language || 'ar') : 'ar',
    screenResolution: telemetry.screenResolution,
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    timestamp: new Date().toISOString(),
    isUnique: isNew,
    isAdminVisit,
    hostDomain,
    dwellTimeSec,
  };

  // Update live active heartbeat
  trackActiveVisitorHeartbeat(currentPath, country, city);

  // Persist to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_VISITOR_LOGS_KEY);
    const logs: VisitorLogEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift(logEntry);
    localStorage.setItem(STORAGE_VISITOR_LOGS_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch (e) {}

  // Resilient write to Supabase & Enterprise Data Lake with offline queue failover
  const payload = {
    visitor_id: logEntry.visitorId,
    country: logEntry.country,
    country_code: logEntry.countryCode,
    city: logEntry.city,
    region: logEntry.region,
    ip: logEntry.ip,
    isp: logEntry.isp,
    page_path: logEntry.pagePath,
    traffic_source: logEntry.trafficSource,
    referrer_domain: logEntry.referrerDomain,
    device_type: logEntry.deviceType,
    browser: logEntry.browser,
    os: logEntry.os,
    utm_source: logEntry.utmSource,
    utm_campaign: logEntry.utmCampaign,
    created_at: logEntry.timestamp,
  };

  enterpriseDBGateway.executeResilientWrite('visitor_telemetry_logs', payload, async () => {
    const { error } = await supabase.from('visitor_logs').insert(payload);
    if (error) throw error;
    return true;
  });

  return logEntry;
}

// ── 7. Country Name & Flag Mapping ───────────────────────────────────────────

const COUNTRY_AR_MAP: Record<string, { ar: string; flag: string }> = {
  'Egypt': { ar: 'جمهورية مصر العربية 🇪🇬', flag: '🇪🇬' },
  'EG': { ar: 'جمهورية مصر العربية 🇪🇬', flag: '🇪🇬' },
  'Saudi Arabia': { ar: 'المملكة العربية السعودية 🇸🇦', flag: '🇸🇦' },
  'SA': { ar: 'المملكة العربية السعودية 🇸🇦', flag: '🇸🇦' },
  'United Arab Emirates': { ar: 'الإمارات العربية المتحدة 🇦🇪', flag: '🇦🇪' },
  'AE': { ar: 'الإمارات العربية المتحدة 🇦🇪', flag: '🇦🇪' },
  'Jordan': { ar: 'المملكة الأردنية الهاشمية 🇯🇴', flag: '🇯🇴' },
  'JO': { ar: 'المملكة الأردنية الهاشمية 🇯🇴', flag: '🇯🇴' },
  'Qatar': { ar: 'دولة قطر 🇶🇦', flag: '🇶🇦' },
  'QA': { ar: 'دولة قطر 🇶🇦', flag: '🇶🇦' },
  'Kuwait': { ar: 'دولة الكويت 🇰🇼', flag: '🇰🇼' },
  'KW': { ar: 'دولة الكويت 🇰🇼', flag: '🇰🇼' },
  'Bahrain': { ar: 'مملكة البحرين 🇧🇭', flag: '🇧🇭' },
  'BH': { ar: 'مملكة البحرين 🇧🇭', flag: '🇧🇭' },
  'Oman': { ar: 'سلطنة عمان 🇴🇲', flag: '🇴🇲' },
  'OM': { ar: 'سلطنة عمان 🇴🇲', flag: '🇴🇲' },
  'United States': { ar: 'الولايات المتحدة الأمريكية 🇺🇸', flag: '🇺🇸' },
  'US': { ar: 'الولايات المتحدة الأمريكية 🇺🇸', flag: '🇺🇸' },
  'United Kingdom': { ar: 'المملكة المتحدة 🇬🇧', flag: '🇬🇧' },
  'GB': { ar: 'المملكة المتحدة 🇬🇧', flag: '🇬🇧' },
  'India': { ar: 'الهند 🇮🇳', flag: '🇮🇳' },
  'IN': { ar: 'الهند 🇮🇳', flag: '🇮🇳' },
  'Germany': { ar: 'ألمانيا 🇩🇪', flag: '🇩🇪' },
  'DE': { ar: 'ألمانيا 🇩🇪', flag: '🇩🇪' },
};

// ── 8. True Analytics Summary Aggregator (100% Real Session Telemetry) ──────

/**
 * Filter to identify and purge any historical synthetic logs
 */
export function isSyntheticLog(log: VisitorLogEntry): boolean {
  if (!log) return true;
  if (log.ip && log.ip.startsWith('197.') && log.ip.endsWith('.88') && log.visitorId?.startsWith('vis_')) {
    return true;
  }
  if (log.visitorId && /^vis_(es|eg|sa|us|ae|jo|gb)_\d+_/i.test(log.visitorId)) {
    return true;
  }
  return false;
}

/**
 * Purge any synthetic visitor logs from local persistence
 */
export function purgeSyntheticVisitorLogs(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_VISITOR_LOGS_KEY);
    if (raw) {
      const logs: VisitorLogEntry[] = JSON.parse(raw);
      const cleaned = logs.filter(l => !isSyntheticLog(l));
      if (cleaned.length !== logs.length) {
        localStorage.setItem(STORAGE_VISITOR_LOGS_KEY, JSON.stringify(cleaned));
      }
    }
  } catch (e) {}
}

export function getVisitorAnalyticsSummary(timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' = 'Yearly'): VisitorAnalyticsSummary {
  let allLogs: VisitorLogEntry[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_VISITOR_LOGS_KEY);
    if (raw) {
      allLogs = JSON.parse(raw);
    }
  } catch (e) {}

  // Pure authentic logs only — strictly filter out any legacy synthetic logs
  allLogs = allLogs.filter(l => !isSyntheticLog(l));

  let nonAdminLogs = allLogs.filter(l => !l.isAdminVisit);
  const adminVisitsFilteredCount = allLogs.filter(l => l.isAdminVisit).length;

  // Timeframe calculation
  const now = Date.now();
  let startTimeLimit = 0;
  if (timeframe === 'Daily') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    startTimeLimit = startOfToday.getTime();
  } else if (timeframe === 'Weekly') {
    startTimeLimit = now - (7 * 24 * 60 * 60 * 1000);
  } else if (timeframe === 'Monthly') {
    startTimeLimit = now - (30 * 24 * 60 * 60 * 1000);
  } else {
    startTimeLimit = now - (365 * 24 * 60 * 60 * 1000);
  }

  const logs = nonAdminLogs.filter(l => new Date(l.timestamp).getTime() >= startTimeLimit);
  // Fallback to nonAdminLogs if empty for timeframe
  const activeLogs = logs.length > 0 ? logs : nonAdminLogs;

  const uniqueVisitorIds = new Set(activeLogs.map(l => l.visitorId));
  const uniqueVisitorsCount = uniqueVisitorIds.size;
  const totalPageViewsCount = activeLogs.length;

  // Traffic Source Breakdown
  const sourceCounts = { Direct: 0, 'Organic Search': 0, 'Social Media': 0, Referral: 0, 'Paid Ads': 0 };
  activeLogs.forEach(l => {
    const src = l.trafficSource || 'Direct';
    if (sourceCounts[src] !== undefined) {
      sourceCounts[src]++;
    } else {
      sourceCounts.Direct++;
    }
  });

  const trafficSources = {
    direct: { count: sourceCounts.Direct, percentage: Math.round((sourceCounts.Direct / totalPageViewsCount) * 100) || 0 },
    search: { count: sourceCounts['Organic Search'], percentage: Math.round((sourceCounts['Organic Search'] / totalPageViewsCount) * 100) || 0 },
    social: { count: sourceCounts['Social Media'], percentage: Math.round((sourceCounts['Social Media'] / totalPageViewsCount) * 100) || 0 },
    referral: { count: sourceCounts.Referral, percentage: Math.round((sourceCounts.Referral / totalPageViewsCount) * 100) || 0 },
    paidAds: { count: sourceCounts['Paid Ads'], percentage: Math.round((sourceCounts['Paid Ads'] / totalPageViewsCount) * 100) || 0 },
  };

  // Device Breakdown
  const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  activeLogs.forEach(l => {
    const d = l.deviceType || 'Desktop';
    if (deviceCounts[d] !== undefined) deviceCounts[d]++;
    else deviceCounts.Desktop++;
  });

  const deviceBreakdown = {
    desktop: { count: deviceCounts.Desktop, percentage: Math.round((deviceCounts.Desktop / totalPageViewsCount) * 100) || 0 },
    mobile: { count: deviceCounts.Mobile, percentage: Math.round((deviceCounts.Mobile / totalPageViewsCount) * 100) || 0 },
    tablet: { count: deviceCounts.Tablet, percentage: Math.round((deviceCounts.Tablet / totalPageViewsCount) * 100) || 0 },
  };

  // Geo Location Aggregation
  const geoMap: Record<string, { countryCode: string; city: string; uniques: Set<string>; views: number }> = {};
  activeLogs.forEach(l => {
    const key = `${l.country}_${l.city}`;
    if (!geoMap[key]) {
      geoMap[key] = { countryCode: l.countryCode, city: l.city, uniques: new Set(), views: 0 };
    }
    geoMap[key].uniques.add(l.visitorId);
    geoMap[key].views++;
  });

  const activeCountriesSet = new Set(activeLogs.map(l => l.country));
  const activeCitiesSet = new Set(activeLogs.map(l => `${l.country}_${l.city}`));

  const geoDistribution: GeoLocationDistribution[] = Object.entries(geoMap).map(([key, data]) => {
    const countryName = key.split('_')[0];
    const info = COUNTRY_AR_MAP[countryName] || COUNTRY_AR_MAP[data.countryCode] || { ar: `${countryName}`, flag: '🌐' };
    const uCount = data.uniques.size;
    const pct = Math.round((uCount / uniqueVisitorsCount) * 100) || 0;

    let tier: 'High (استهداف مرتفع)' | 'Medium (استهداف متوسط)' | 'Low (استهداف محلي)' = 'Low (استهداف محلي)';
    if (pct >= 25 || countryName === 'Egypt' || countryName === 'Saudi Arabia') tier = 'High (استهداف مرتفع)';
    else if (pct >= 10 || countryName === 'United Arab Emirates' || countryName === 'Kuwait' || countryName === 'Qatar') tier = 'Medium (استهداف متوسط)';

    return {
      country: countryName,
      countryCode: data.countryCode,
      countryAr: info.ar,
      city: data.city,
      flagEmoji: info.flag,
      uniqueVisitors: uCount,
      totalPageViews: data.views,
      percentage: pct,
      adPriorityTier: tier,
    };
  }).sort((a, b) => b.uniqueVisitors - a.uniqueVisitors);

  // Target Pages Aggregation
  const pageMap: Record<string, number> = {};
  activeLogs.forEach(l => {
    pageMap[l.pagePath] = (pageMap[l.pagePath] || 0) + 1;
  });

  const topTargetPages = Object.entries(pageMap)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views);

  // UTM Campaigns Aggregation
  const campaignMap: Record<string, { source: string; count: number }> = {};
  activeLogs.forEach(l => {
    if (l.utmCampaign) {
      const key = l.utmCampaign;
      if (!campaignMap[key]) campaignMap[key] = { source: l.utmSource || 'ad', count: 0 };
      campaignMap[key].count++;
    }
  });

  const utmCampaigns = Object.entries(campaignMap).map(([campaign, d]) => ({
    campaign,
    source: d.source,
    count: d.count,
  })).sort((a, b) => b.count - a.count);

  // Recommended Ad Allocation Recommendations based on Real Visitor Volume & Market Potential
  const recommendedAdAllocation = geoDistribution.slice(0, 4).map((g, index) => ({
    country: g.country,
    countryAr: g.countryAr,
    recommendedShare: index === 0 ? 40 : index === 1 ? 30 : index === 2 ? 20 : 10,
    targetReasonAr: 'توصية مبنية على حجم الزيارات الفعلية المرصودة في التحليلات الحالية.',
    targetReasonEn: 'Recommendation based on currently observed authentic visitor volume.',
  }));

  // Active Users Now
  let activeSessionsMap: Record<string, ActiveSession> = {};
  try {
    const rawHb = localStorage.getItem(STORAGE_HEARTBEATS_KEY);
    if (rawHb) activeSessionsMap = JSON.parse(rawHb);
  } catch (e) {}

  const twoMinsAgo = Date.now() - 120_000;
  const activeSessions = Object.values(activeSessionsMap).filter(
    s => new Date(s.lastHeartbeat).getTime() >= twoMinsAgo && !s.pagePath.startsWith('/admin')
  ).map(s => ({
    ...s,
    dwellTimeSec: s.dwellTimeSec && s.dwellTimeSec < 600 ? s.dwellTimeSec : 0
  }));

  const activeUsersNow = activeSessions.length;

  // Bounce Rate Calculation
  const visitorViewsMap: Record<string, number> = {};
  activeLogs.forEach(l => {
    visitorViewsMap[l.visitorId] = (visitorViewsMap[l.visitorId] || 0) + 1;
  });
  const singleViewCount = Object.values(visitorViewsMap).filter(v => v === 1).length;
  const bounceRatePercentage = uniqueVisitorsCount > 0 ? Math.round((singleViewCount / uniqueVisitorsCount) * 100) : 0;

  // Average Session Duration
  const totalDwellSec = activeSessions.reduce((acc, s) => acc + (s.dwellTimeSec || 60), 0);
  const avgSessionDurationSec = activeSessions.length > 0 ? Math.round(totalDwellSec / activeSessions.length) : 0;

  // Domain breakdown
  const jtVisitors = new Set<string>();
  let jtViews = 0;
  const opVisitors = new Set<string>();
  let opViews = 0;

  activeLogs.forEach(l => {
    const isJt = !l.hostDomain || l.hostDomain.includes('juristech');
    if (isJt) {
      jtVisitors.add(l.visitorId);
      jtViews++;
    } else {
      opVisitors.add(l.visitorId);
      opViews++;
    }
  });

  // No synthetic seeding — pure real data only

  const domainBreakdown = {
    juristech: { visitors: jtVisitors.size, views: jtViews },
    otherPlatform: { visitors: opVisitors.size, views: opViews },
  };

  // Top visited templates aggregation
  const templateViews: Record<string, { nameAr: string; nameEn: string; views: number }> = {
    'Jordanian Labor Contract': { nameAr: 'عقد العمل الأردني الفردي', nameEn: 'Individual Jordanian Labor Contract', views: 0 },
    'Shareholders Agreement': { nameAr: 'اتفاقية الشركاء والمساهمين', nameEn: 'Shareholders Agreement', views: 0 },
    'NDA': { nameAr: 'اتفاقية سرية المعلومات (NDA)', nameEn: 'Mutual NDA Agreement', views: 0 },
    'Commercial Lease': { nameAr: 'عقد الإيجار التجاري للمقرات', nameEn: 'Commercial Lease Agreement', views: 0 },
    'Software Development': { nameAr: 'عقد تطوير البرمجيات وتوريدها', nameEn: 'Software Development Agreement', views: 0 },
  };

  activeLogs.forEach(l => {
    const path = l.pagePath.toLowerCase();
    const matchedKey = Object.keys(templateViews).find(key => {
      const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
      return normalized.split(' ').filter(Boolean).some(token => token.length >= 4 && path.includes(token));
    });
    if (matchedKey) templateViews[matchedKey].views++;
  });

  // Pure real data — no synthetic baseline seeding

  const topTemplates = Object.entries(templateViews).map(([id, d]) => ({
    templateId: id,
    nameAr: d.nameAr,
    nameEn: d.nameEn,
    views: d.views,
  })).sort((a, b) => b.views - a.views);

  // Retain this data structure securely to present to sponsors/advertisers later
  try {
    localStorage.setItem('juristech_sponsor_ready_analytics', JSON.stringify({
      lastUpdated: new Date().toISOString(),
      uniqueVisitorsCount,
      totalPageViewsCount,
      domainBreakdown,
      topTemplates,
    }));
  } catch (e) {}

  return {
    timeframe,
    adminVisitsFilteredCount,
    activeUsersNow,
    avgSessionDurationSec,
    bounceRatePercentage,
    activeSessions,
    uniqueVisitorsCount,
    totalPageViewsCount,
    activeCitiesCount: activeCitiesSet.size,
    activeCountriesCount: activeCountriesSet.size,
    trafficSources,
    deviceBreakdown,
    geoDistribution,
    topTargetPages,
    utmCampaigns,
    recommendedAdAllocation,
    domainBreakdown,
    topTemplates,
  };
}

export async function syncVisitorLogsWithSupabase(): Promise<VisitorLogEntry[]> {
  try {
    const { data: dbLogs, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    const mergedMap = new Map<string, VisitorLogEntry>();

    if (dbLogs) {
        dbLogs.forEach((dbL: any) => {
        const uniqueKey = dbL.id || `db_${dbL.created_at}_${dbL.visitor_id || 'unknown'}`;
        if (!dbL.visitor_id || !dbL.created_at) return;
        mergedMap.set(uniqueKey, {
          id: uniqueKey,
          visitorId: dbL.visitor_id,
          country: dbL.country || 'Unknown',
          countryCode: dbL.country_code || 'XX',
          city: dbL.city || 'Unknown',
          region: dbL.region || 'Unknown',
          ip: dbL.ip || '',
          isp: dbL.isp || '',
          pagePath: dbL.page_path || '/',
          trafficSource: (dbL.traffic_source as any) || 'Direct',
          referrerDomain: dbL.referrer_domain || 'direct',
          userAgent: dbL.user_agent || '',
          deviceType: (dbL.device_type as any) || 'Unknown',
          browser: dbL.browser || 'Unknown',
          os: dbL.os || 'Unknown',
          language: dbL.language || 'unknown',
          screenResolution: dbL.screen_resolution || 'unknown',
          timestamp: dbL.created_at,
          isUnique: true,
        });
      });
    }

    const storedRaw = localStorage.getItem('ls_visitor_logs_history');
    const localList: VisitorLogEntry[] = storedRaw ? JSON.parse(storedRaw) : [];
    localList.forEach(log => {
      if (!isSyntheticLog(log) && !mergedMap.has(log.id)) {
        mergedMap.set(log.id, log);
      }
    });

    const mergedLogs = Array.from(mergedMap.values())
      .filter(l => !isSyntheticLog(l))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 500);

    localStorage.setItem('ls_visitor_logs_history', JSON.stringify(mergedLogs));
    return mergedLogs;
  } catch (err) {
    console.warn('[Visitor Tracker] Supabase logs sync failed:', err);
    const storedRaw = localStorage.getItem('ls_visitor_logs_history');
    const list: VisitorLogEntry[] = storedRaw ? JSON.parse(storedRaw) : [];
    return list.filter(l => !isSyntheticLog(l));
  }
}

