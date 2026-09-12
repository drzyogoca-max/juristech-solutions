import { createClient } from '@supabase/supabase-js';
import { retryWithBackoff } from './health';
import { monitoring } from './monitoring';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'anon-key-placeholder';

// ── Resilient Circuit Breaker & Fail-Open Gateway ──────────────────────────────
let circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
let consecutiveFailures = 0;
let lastFailureTime = 0;
const CIRCUIT_BREAKER_RESET_MS = 60_000;      // 60s backoff probe
const CIRCUIT_BREAKER_MAX_FAILURES = 2;       // Trip after 2 failures
const REQUEST_TIMEOUT_MS = 1500;              // Strict 1.5s abort timeout

function createMockResponse(url: string): Response {
  let body = '[]';
  const headers = new Headers({
    'Content-Type': 'application/json',
    'content-range': '0-0/0',
  });

  if (url.includes('/auth/v1/')) {
    body = JSON.stringify({ user: null, session: null, error: null });
  } else if (url.includes('select=*') || url.includes('/rest/v1/')) {
    body = '[]';
  } else {
    body = JSON.stringify({ data: null, error: null });
  }

  return new Response(body, {
    status: 200,
    statusText: 'OK (Circuit Breaker Offline Fallback)',
    headers,
  });
}

export function resetSupabaseCircuitBreaker() {
  circuitState = 'CLOSED';
  consecutiveFailures = 0;
  lastFailureTime = 0;
}

const resilientFetch: typeof fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;

  // 1. Circuit Breaker Check: Trip if offline to eliminate 44 DNS resolution storms
  if (circuitState === 'OPEN') {
    if (Date.now() - lastFailureTime > CIRCUIT_BREAKER_RESET_MS) {
      circuitState = 'HALF_OPEN';
    } else {
      return createMockResponse(url);
    }
  }

  // 2. Perform Fetch with strict 1.5s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const fetchInit: RequestInit = {
      ...init,
      signal: controller.signal,
    };
    const response = await fetch(input, fetchInit);
    clearTimeout(timeoutId);

    if (circuitState === 'HALF_OPEN') {
      circuitState = 'CLOSED';
      consecutiveFailures = 0;
    }
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);
    consecutiveFailures++;

    if (consecutiveFailures >= CIRCUIT_BREAKER_MAX_FAILURES) {
      circuitState = 'OPEN';
      lastFailureTime = Date.now();
      console.warn('[Supabase Circuit Breaker] Endpoint unreachable or DNS failed. Non-critical database requests isolated (fail-open mode active).');
    }

    return createMockResponse(url);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: resilientFetch,
    headers: {
      'x-application-name': 'Juristech-Solutions-Enterprise',
    },
  },
  db: {
    schema: 'public',
  },
});

// Client-side query cache to reduce latency for repeated reads
const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds cache

/**
 * Execute any Supabase DB or Auth operation with exponential retry & telemetry logging.
 */
export async function executeSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  cacheKey?: string
): Promise<T> {
  if (cacheKey && queryCache.has(cacheKey)) {
    const cached = queryCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }
  }

  // If circuit breaker is open, do not retry
  if (circuitState === 'OPEN') {
    return queryFn();
  }

  try {
    const result = await retryWithBackoff(queryFn, {
      maxRetries: 1, // Reduced to 1 to eliminate retry storms on failure
      baseDelayMs: 200,
      maxDelayMs: 1000,
    });

    if (cacheKey) {
      queryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return result;
  } catch (error) {
    monitoring.captureError(error, { context: 'executeSupabaseQuery', cacheKey });
    throw error;
  }
}

/**
 * Invalidate cached query entries
 */
export function invalidateCache(cacheKey?: string) {
  if (cacheKey) {
    queryCache.delete(cacheKey);
  } else {
    queryCache.clear();
  }
}
