import { createClient } from '@supabase/supabase-js';
import { retryWithBackoff } from './health';
import { monitoring } from './monitoring';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
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

  try {
    const result = await retryWithBackoff(queryFn, {
      maxRetries: 3,
      baseDelayMs: 300,
      maxDelayMs: 3000,
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
