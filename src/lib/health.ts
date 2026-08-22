/**
 * health.ts — JurisTech Solutions
 * Health-check utilities for Supabase, AI gateway, and network endpoints.
 * Provides: retryWithBackoff, checkSupabaseHealth, checkAIHealth
 */

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

// ─── Retry with Exponential Back-off ─────────────────────────────────────────
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    jitter?: boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 400,
    maxDelayMs = 8000,
    jitter = true,
  } = options;

  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;

      const exponential = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const delay = jitter ? exponential * (0.7 + Math.random() * 0.6) : exponential;
      console.warn(`[JurisTech Health] Retry ${attempt}/${maxRetries} in ${Math.round(delay)}ms`, err);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// ─── Health Check Results ─────────────────────────────────────────────────────
export interface HealthStatus {
  supabase: 'ok' | 'degraded' | 'down';
  ai: 'ok' | 'degraded' | 'down';
  lastChecked: string;
  latencyMs: { supabase?: number; ai?: number };
}

let cachedStatus: HealthStatus | null = null;
let lastCheckTime = 0;
const CACHE_TTL_MS = 30_000; // Re-check every 30s max

// ─── Check Supabase Health ────────────────────────────────────────────────────
export async function checkSupabaseHealth(): Promise<'ok' | 'degraded' | 'down'> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return 'down';
  const t0 = Date.now();
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - t0;
    if (res.ok || res.status === 200) return latency < 2000 ? 'ok' : 'degraded';
    return 'degraded';
  } catch {
    return 'down';
  }
}

// ─── Check AI Gateway Health ──────────────────────────────────────────────────
export async function checkAIHealth(): Promise<'ok' | 'degraded' | 'down'> {
  const t0 = Date.now();
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'ping', lang: 'en' }),
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - t0;
    if (res.ok) return latency < 4000 ? 'ok' : 'degraded';
    return 'degraded';
  } catch {
    // Fallback: check Supabase edge function
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return 'down';
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ prompt: 'ping', lang: 'en' }),
        signal: AbortSignal.timeout(8000),
      });
      return res.ok ? 'degraded' : 'down'; // degraded = fallback worked
    } catch {
      return 'down';
    }
  }
}

// ─── Full Platform Health Check (cached) ─────────────────────────────────────
export async function getPlatformHealth(forceRefresh = false): Promise<HealthStatus> {
  const now = Date.now();
  if (!forceRefresh && cachedStatus && now - lastCheckTime < CACHE_TTL_MS) {
    return cachedStatus;
  }

  const [supabase, ai] = await Promise.allSettled([
    checkSupabaseHealth(),
    checkAIHealth(),
  ]);

  const status: HealthStatus = {
    supabase: supabase.status === 'fulfilled' ? supabase.value : 'down',
    ai: ai.status === 'fulfilled' ? ai.value : 'down',
    lastChecked: new Date().toISOString(),
    latencyMs: {},
  };

  cachedStatus = status;
  lastCheckTime = now;
  return status;
}
