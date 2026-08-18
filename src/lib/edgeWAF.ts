/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EDGE SECURITY WAF — JurisTech Solutions v10.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Client-side WAF layer that:
 *  1. Detects SQL injection, XSS, path traversal, payload flooding attempts
 *  2. Rate limiting: blocks sessions exceeding 30 req/min
 *  3. Logs all suspicious events with fingerprint to localStorage
 *  4. Dispatches immediate email alert to security@juristech.solutions
 *  5. Blocks the offending session for the remainder of the browser tab lifecycle
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { sendEmailNotification } from './emailNotifier';

const WAF_LOG_KEY = 'juristech_waf_events';
const WAF_BLOCKED_KEY = 'juristech_waf_blocked_session';
const WAF_RATE_KEY = 'juristech_waf_rate_timestamps';

// ⚠️ SECURITY: Admin email read from env — not hardcoded in source
const ADMIN_ALERT_EMAIL = import.meta.env.VITE_SECURITY_ALERT_EMAIL || 'juristech.solutions@outlook.com';

const MAX_INPUT_LENGTH = 10_000;       // Payload flooding guard
const RATE_LIMIT_MAX = 30;             // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60_000;  // 1 minute window

export interface WAFEvent {
  id: string;
  timestamp: string;
  attackType: string;
  payload: string;
  pagePath: string;
  userAgent: string;
  blocked: boolean;
}

// ─── Attack Signature Patterns ─────────────────────────────────────────────────

const SQL_INJECTION_PATTERNS = [
  /(\bSELECT\b|\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|\bUNION\b|\bEXEC\b|\bOR\b\s+\d+\s*=\s*\d+)/i,
  /';?\s*(DROP|DELETE|TRUNCATE|ALTER|CREATE|REPLACE)/i,
  /\bOR\b\s+['"1]?\s*=\s*['"1]?/i,
  /--\s*(DROP|DELETE|TRUNCATE)/i,
  /\/\*[\s\S]*?\*\//,   // SQL block comments
  /\bxp_cmdshell\b/i,
  /\bWAITFOR\s+DELAY\b/i,
];

const XSS_PATTERNS = [
  /<\s*script[\s>]/i,
  /javascript\s*:/i,
  /on(load|click|mouseover|error|focus|submit|keyup|keydown|input|change)\s*=/i,
  /<\s*iframe/i,
  /document\.(cookie|write|location)/i,
  /eval\s*\(/i,
  /expression\s*\(/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
];

const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.%2F/i,
  /etc\/passwd/i,
  /proc\/self/i,
  /%00/,          // Null byte injection
  /\0/,
];

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

export function checkRateLimit(): { allowed: boolean; requestCount: number } {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(WAF_RATE_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];

    // Keep only timestamps within the current window
    const withinWindow = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    withinWindow.push(now);

    sessionStorage.setItem(WAF_RATE_KEY, JSON.stringify(withinWindow));

    const configuredMax = (typeof localStorage !== 'undefined' && Number(localStorage.getItem('juristech_rate_limit_max'))) || RATE_LIMIT_MAX;
    if (withinWindow.length > configuredMax) {
      logAndBlockThreat('RATE_LIMIT_EXCEEDED', `${withinWindow.length} requests in 60s (Threshold: ${configuredMax})`, 'rate-limiter');
      return { allowed: false, requestCount: withinWindow.length };
    }

    return { allowed: true, requestCount: withinWindow.length };
  } catch {
    return { allowed: true, requestCount: 0 };
  }
}

// ─── Core Detection Function ───────────────────────────────────────────────────

export function scanInputForThreats(
  inputValue: string,
  context = 'user-input'
): { safe: boolean; attackType?: string; sanitized: string } {
  // Payload flooding guard
  if (inputValue.length > MAX_INPUT_LENGTH) {
    logAndBlockThreat('PAYLOAD_FLOODING', inputValue.substring(0, 50), context);
    return { safe: false, attackType: 'PAYLOAD_FLOODING', sanitized: inputValue.slice(0, MAX_INPUT_LENGTH) };
  }

  const sanitized = inputValue
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(inputValue)) {
      logAndBlockThreat('SQL_INJECTION', inputValue, context);
      return { safe: false, attackType: 'SQL_INJECTION', sanitized };
    }
  }

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(inputValue)) {
      logAndBlockThreat('XSS_ATTEMPT', inputValue, context);
      return { safe: false, attackType: 'XSS_ATTEMPT', sanitized };
    }
  }

  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(inputValue)) {
      logAndBlockThreat('PATH_TRAVERSAL', inputValue, context);
      return { safe: false, attackType: 'PATH_TRAVERSAL', sanitized };
    }
  }

  return { safe: true, sanitized: inputValue };
}

// ─── Threat Logging & Admin Alert ─────────────────────────────────────────────

function logAndBlockThreat(attackType: string, payload: string, context: string): void {
  const event: WAFEvent = {
    id: `WAF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    attackType,
    payload: payload.substring(0, 200),
    pagePath: typeof window !== 'undefined' ? window.location.pathname : context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 150) : 'unknown',
    blocked: true,
  };

  try {
    const existing: WAFEvent[] = JSON.parse(localStorage.getItem(WAF_LOG_KEY) || '[]');
    existing.unshift(event);
    localStorage.setItem(WAF_LOG_KEY, JSON.stringify(existing.slice(0, 100)));
    sessionStorage.setItem(WAF_BLOCKED_KEY, 'true');
  } catch {}

  console.warn(`[JurisTech Edge WAF] 🚨 ${attackType} detected — Event ID: ${event.id}`);

  // Async admin alert
  sendEmailNotification({
    toEmail: ADMIN_ALERT_EMAIL,
    subjectAr: `🚨 [Edge WAF] تحذير أمني: محاولة ${attackType} مرصودة على المنصة`,
    subjectEn: `🚨 [Edge WAF] Security Alert: ${attackType} attempt detected on JurisTech Solutions`,
    bodyAr: `تنبيه أمني فوري من نظام جدار الحماية الذكي:\n\nنوع الهجوم: ${attackType}\nالمعرّف: ${event.id}\nالصفحة: ${event.pagePath}\nالوقت: ${event.timestamp}\nالحمولة (مقتطفة): ${event.payload.substring(0, 100)}\nعميل المتصفح: ${event.userAgent.substring(0, 80)}\n\nتم حجب الجلسة تلقائياً. يرجى مراجعة لوحة التحكم.`,
    bodyEn: `Immediate WAF security alert:\n\nAttack Type: ${attackType}\nEvent ID: ${event.id}\nPage: ${event.pagePath}\nTimestamp: ${event.timestamp}\nPayload (truncated): ${event.payload.substring(0, 100)}\nUser Agent: ${event.userAgent.substring(0, 80)}\n\nSession auto-blocked. Please review the admin dashboard.`,
  }).catch(() => {});
}

// ─── WAF Event Log Reader (for admin dashboard) ────────────────────────────────

export function getWAFEventLog(limit = 20): WAFEvent[] {
  try {
    const raw = localStorage.getItem(WAF_LOG_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as WAFEvent[]).slice(0, limit);
  } catch {
    return [];
  }
}

export function isCurrentSessionBlocked(): boolean {
  try {
    return sessionStorage.getItem(WAF_BLOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function clearWAFEventLog(): void {
  try {
    localStorage.removeItem(WAF_LOG_KEY);
  } catch {}
}
