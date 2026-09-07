/**
 * lib/security/subscriptionResolver.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Server-Side Subscription & Usage Enforcement
 * Sprint 04C Phase 1C: Fail-Closed Security Hardening
 *
 * ARCHITECTURE:
 *   Verified JWT Context
 *   → resolveUserSubscription(userContext)
 *   → Canonical Tier (Free Trial: 0, Startup: 1, SMEs: 2, Enterprise: 3)
 *   → Server-Computed Metric ('ai_queries_executed') + Limit + UTC Period ('YYYY-MM-DD')
 *   → Atomic service_role RPC: check_and_increment_usage(p_user_id, p_metric, p_limit, p_period_key)
 *   → If Denied / Infrastructure Failure: Fail closed with HTTP 429 or 500 (BEFORE AI model execution)
 *   → If Allowed: Proceed to AI generation
 *
 * STRICT FAIL-CLOSED GUARANTEES:
 *   • Missing service_role key -> Returns AUTHORIZATION_SERVICE_ERROR (HTTP 500), NEVER Free Trial.
 *   • Subscription DB lookup failure -> Returns AUTHORIZATION_SERVICE_ERROR (HTTP 500), NEVER Free Trial.
 *   • Malformed DB response -> Returns AUTHORIZATION_SERVICE_ERROR (HTTP 500), NEVER Free Trial.
 *   • Free Trial returned ONLY when DB query successfully executes and confirms no active subscription.
 *   • Enterprise tier and Admin/Lawyer roles receive unlimited access strictly from trusted claims.
 *   • Completely ignores client-supplied plan/tier/limit/period/role from req.body.
 *   • Zero logging of tokens or service_role credentials.
 */

export const TIER_WEIGHTS = {
  'Free Trial': 0,
  'Startup': 1,
  'SMEs': 2,
  'Pro': 2,
  'Enterprise': 3,
};

export const DAILY_AI_LIMITS = {
  'Free Trial': 5,
  'Startup': 50,
  'SMEs': 150,
  'Pro': 150,
  'Enterprise': null, // Unlimited
};

const CORS_HEADERS_DEFAULT = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
};

/**
 * Computes canonical UTC date string (YYYY-MM-DD) for daily query quotas
 * @param {Date | number} [date]
 * @returns {string}
 */
export function getUtcDailyPeriodKey(date = new Date()) {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes database plan_id / plan_name to canonical application plan tier
 * @param {string | null} [planId]
 * @param {string | null} [planName]
 * @returns {'Free Trial' | 'Startup' | 'SMEs' | 'Enterprise'}
 */
export function mapPlanNameToTier(planId, planName) {
  const combined = `${planId || ''} ${planName || ''}`.trim().toLowerCase();
  if (!combined) return 'Free Trial';
  if (combined.includes('enterprise') || combined.includes('مؤسسات') || combined.includes('كبرى')) return 'Enterprise';
  if (combined.includes('sme') || combined.includes('متوسطة') || combined.includes('pro') || combined.includes('احترافي')) return 'SMEs';
  if (combined.includes('startup') || combined.includes('ناشئة') || combined.includes('صغرى') || combined.includes('رواد')) return 'Startup';
  return 'Startup';
}

/**
 * Checks whether a database subscription record is active and unexpired
 * @param {Object | null} sub
 * @returns {boolean}
 */
export function isSubscriptionRecordActive(sub) {
  if (!sub || typeof sub !== 'object') return false;
  if ((sub.status || '').trim().toLowerCase() !== 'active') return false;
  if (!sub.expires_at) return true; // Null expires_at represents indefinite active term
  const expiry = new Date(sub.expires_at).getTime();
  if (isNaN(expiry)) return false;
  return expiry > Date.now();
}

/**
 * Creates structured 429 Quota Exceeded Response
 */
export function createQuotaExceededResponse(tier, currentUsage, limit, customHeaders = {}) {
  const headers = {
    ...CORS_HEADERS_DEFAULT,
    'Retry-After': '3600',
    ...customHeaders,
  };

  return new Response(
    JSON.stringify({
      error: 'RATE_LIMIT_EXCEEDED',
      code: 'QUOTA_EXCEEDED',
      message: `Daily AI query limit reached (${currentUsage}/${limit}) for ${tier} plan. Please upgrade your subscription at /billing for higher daily limits.`,
      tier,
      current_usage: currentUsage,
      limit,
    }),
    {
      status: 429,
      headers,
    }
  );
}

/**
 * Creates structured Authorization/Service Error Response
 */
export function createServiceErrorResponse(code, message, status = 500, customHeaders = {}) {
  const headers = {
    ...CORS_HEADERS_DEFAULT,
    ...customHeaders,
  };

  return new Response(
    JSON.stringify({
      error: 'AUTHORIZATION_SERVICE_ERROR',
      code,
      message,
    }),
    {
      status,
      headers,
    }
  );
}

/**
 * Resolves user's active subscription tier from database
 * Strictly fails closed on any infrastructure or query error.
 *
 * @param {Object} userContext - Verified user object from backendAuthGuard
 * @param {Object} [options]
 * @returns {Promise<{
 *   success: boolean,
 *   tier?: 'Free Trial' | 'Startup' | 'SMEs' | 'Enterprise',
 *   tierWeight?: number,
 *   isSubscriber?: boolean,
 *   isPrivileged?: boolean,
 *   dailyLimit?: number | null,
 *   periodKey?: string,
 *   metric?: string,
 *   error?: { code: string, message: string }
 * }>}
 */
export async function resolveUserSubscription(userContext, options = {}) {
  if (!userContext || !userContext.id) {
    return {
      success: false,
      error: { code: 'INVALID_USER_CONTEXT', message: 'User context is missing or invalid' }
    };
  }

  const periodKey = options.customPeriodKey || getUtcDailyPeriodKey();
  const metric = 'ai_queries_executed';

  // 1. Admin & Lawyer Role Bypass (Enterprise privilege from trusted verified auth context)
  if (userContext.isAdmin || userContext.isLawyer) {
    return {
      success: true,
      tier: 'Enterprise',
      tierWeight: TIER_WEIGHTS['Enterprise'],
      isSubscriber: true,
      isPrivileged: true,
      dailyLimit: null, // Unlimited
      periodKey,
      metric,
    };
  }

  // 2. Mock subscription override for testing if provided
  if (options.mockSubscription !== undefined) {
    const mockSub = options.mockSubscription;
    if (isSubscriptionRecordActive(mockSub)) {
      const tier = mapPlanNameToTier(mockSub.plan_id, mockSub.plan_name);
      return {
        success: true,
        tier,
        tierWeight: TIER_WEIGHTS[tier] || 1,
        isSubscriber: true,
        isPrivileged: false,
        dailyLimit: DAILY_AI_LIMITS[tier],
        periodKey,
        metric,
      };
    }
    // Explicit null or expired mock subscription -> legitimate Free Trial
    return {
      success: true,
      tier: 'Free Trial',
      tierWeight: TIER_WEIGHTS['Free Trial'],
      isSubscriber: false,
      isPrivileged: false,
      dailyLimit: DAILY_AI_LIMITS['Free Trial'],
      periodKey,
      metric,
    };
  }

  // 3. Resolve Supabase Service Credentials
  const supabaseUrl =
    options.customSupabaseUrl ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://slhxqshdvivvsdifbsxo.supabase.co';

  const serviceKey =
    options.customServiceKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  // FAIL CLOSED: Missing service_role key must NEVER be downgraded to Free Trial
  if (!serviceKey) {
    console.error('[subscriptionResolver] Fail-closed: missing SUPABASE_SERVICE_ROLE_KEY');
    return {
      success: false,
      error: {
        code: 'AUTHORIZATION_SERVICE_ERROR',
        message: 'Server authorization infrastructure is unconfigured (missing service authority).'
      }
    };
  }

  // 4. Query public.subscriptions table using service_role authority
  try {
    const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userContext.id)}&order=created_at.desc&limit=1`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
    });

    // FAIL CLOSED: Non-200 responses from database must NEVER be downgraded to Free Trial
    if (!res.ok) {
      console.error('[subscriptionResolver] Fail-closed: subscription query returned HTTP', res.status);
      return {
        success: false,
        error: {
          code: 'AUTHORIZATION_SERVICE_ERROR',
          message: `Subscription authority check failed with HTTP ${res.status}.`
        }
      };
    }

    let rows;
    try {
      rows = await res.json();
    } catch (parseErr) {
      console.error('[subscriptionResolver] Fail-closed: malformed JSON from subscriptions table');
      return {
        success: false,
        error: {
          code: 'AUTHORIZATION_SERVICE_ERROR',
          message: 'Invalid subscription response received from database.'
        }
      };
    }

    // FAIL CLOSED: Malformed response structure
    if (!Array.isArray(rows)) {
      console.error('[subscriptionResolver] Fail-closed: expected array of subscriptions from database');
      return {
        success: false,
        error: {
          code: 'AUTHORIZATION_SERVICE_ERROR',
          message: 'Malformed subscription records structure.'
        }
      };
    }

    // 5. Query succeeded: empty array indicates user legitimately has no subscription -> Free Trial
    if (rows.length === 0) {
      return {
        success: true,
        tier: 'Free Trial',
        tierWeight: TIER_WEIGHTS['Free Trial'],
        isSubscriber: false,
        isPrivileged: false,
        dailyLimit: DAILY_AI_LIMITS['Free Trial'],
        periodKey,
        metric,
      };
    }

    const sub = rows[0];
    if (isSubscriptionRecordActive(sub)) {
      const tier = mapPlanNameToTier(sub.plan_id, sub.plan_name);
      return {
        success: true,
        tier,
        tierWeight: TIER_WEIGHTS[tier] || 1,
        isSubscriber: true,
        isPrivileged: false,
        dailyLimit: DAILY_AI_LIMITS[tier],
        periodKey,
        metric,
      };
    }

    // 6. Query succeeded: subscription record exists but is expired/cancelled/non-active -> Free Trial
    return {
      success: true,
      tier: 'Free Trial',
      tierWeight: TIER_WEIGHTS['Free Trial'],
      isSubscriber: false,
      isPrivileged: false,
      dailyLimit: DAILY_AI_LIMITS['Free Trial'],
      periodKey,
      metric,
    };
  } catch (err) {
    console.error('[subscriptionResolver] Fail-closed: subscription query network error:', err?.message || err);
    return {
      success: false,
      error: {
        code: 'AUTHORIZATION_SERVICE_ERROR',
        message: 'Network connection to subscription database authority failed.'
      }
    };
  }
}

/**
 * Enforces atomic daily AI query quota for verified user
 * Guaranteed fail-closed on any authentication or infrastructure failure.
 *
 * @param {Object} userContext - Verified user object from backendAuthGuard
 * @param {Object} [options]
 * @returns {Promise<{
 *   allowed: boolean,
 *   tier?: string,
 *   currentUsage?: number | null,
 *   limit?: number | null,
 *   periodKey?: string,
 *   metric?: string,
 *   unlimited?: boolean,
 *   code?: string,
 *   error?: Object,
 *   response?: Response
 * }>}
 */
export async function enforceUsageQuota(userContext, options = {}) {
  const corsHeaders = options.corsHeaders || CORS_HEADERS_DEFAULT;

  // 1. Resolve Tier & Canonical Limit
  const subState = await resolveUserSubscription(userContext, options);

  // FAIL CLOSED: If subscription resolution failed, deny request with HTTP 500 immediately
  if (!subState.success || subState.error) {
    const code = subState.error?.code || 'AUTHORIZATION_SERVICE_ERROR';
    const message = subState.error?.message || 'Authorization service failure.';
    return {
      allowed: false,
      code,
      error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
      response: createServiceErrorResponse(code, message, 500, corsHeaders),
    };
  }

  // 2. Enterprise or Privileged Unlimited Access
  if (subState.dailyLimit === null || subState.isPrivileged || subState.tier === 'Enterprise') {
    return {
      allowed: true,
      tier: subState.tier,
      currentUsage: null,
      limit: null,
      periodKey: subState.periodKey,
      metric: subState.metric,
      unlimited: true,
    };
  }

  // 3. Resolve Supabase Service Credentials
  const supabaseUrl =
    options.customSupabaseUrl ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://slhxqshdvivvsdifbsxo.supabase.co';

  const serviceKey =
    options.customServiceKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 4. Mock RPC override for testing if provided
  if (typeof options.mockRpcHandler === 'function') {
    const rpcResult = await options.mockRpcHandler({
      p_user_id: userContext.id,
      p_metric: subState.metric,
      p_limit: subState.dailyLimit,
      p_period_key: subState.periodKey,
    });

    if (!rpcResult.allowed) {
      const code = 'QUOTA_EXCEEDED';
      return {
        allowed: false,
        code,
        tier: subState.tier,
        currentUsage: rpcResult.current_usage,
        limit: subState.dailyLimit,
        periodKey: subState.periodKey,
        metric: subState.metric,
        error: {
          error: 'RATE_LIMIT_EXCEEDED',
          code,
          message: `Daily AI query limit reached (${rpcResult.current_usage}/${subState.dailyLimit}) for ${subState.tier} plan. Please upgrade your subscription at /billing for higher capacity.`,
          tier: subState.tier,
          current_usage: rpcResult.current_usage,
          limit: subState.dailyLimit,
        },
        response: createQuotaExceededResponse(subState.tier, rpcResult.current_usage, subState.dailyLimit, corsHeaders),
      };
    }

    return {
      allowed: true,
      tier: subState.tier,
      currentUsage: rpcResult.current_usage,
      limit: subState.dailyLimit,
      periodKey: subState.periodKey,
      metric: subState.metric,
      unlimited: false,
    };
  }

  // FAIL CLOSED: Missing serviceKey in real environment
  if (!serviceKey) {
    console.error('[subscriptionResolver] Fail-closed: missing SUPABASE_SERVICE_ROLE_KEY for usage RPC invocation');
    const code = 'AUTHORIZATION_SERVICE_ERROR';
    const message = 'Usage metering service is temporarily unconfigured.';
    return {
      allowed: false,
      code,
      error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
      response: createServiceErrorResponse(code, message, 500, corsHeaders),
    };
  }

  // 5. Invoke Atomic PostgreSQL RPC check_and_increment_usage
  try {
    const rpcEndpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/check_and_increment_usage`;
    const rpcRes = await fetch(rpcEndpoint, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_user_id: userContext.id,
        p_metric: subState.metric,
        p_limit: subState.dailyLimit,
        p_period_key: subState.periodKey,
      }),
    });

    // FAIL CLOSED: RPC execution failure
    if (!rpcRes.ok) {
      console.error('[subscriptionResolver] Fail-closed: check_and_increment_usage returned HTTP', rpcRes.status);
      const code = 'AUTHORIZATION_SERVICE_ERROR';
      const message = 'Failed to execute atomic usage verification.';
      return {
        allowed: false,
        code,
        error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
        response: createServiceErrorResponse(code, message, 500, corsHeaders),
      };
    }

    let rpcData;
    try {
      rpcData = await rpcRes.json();
    } catch (parseErr) {
      console.error('[subscriptionResolver] Fail-closed: malformed JSON from RPC');
      const code = 'AUTHORIZATION_SERVICE_ERROR';
      const message = 'Invalid usage response format from authority.';
      return {
        allowed: false,
        code,
        error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
        response: createServiceErrorResponse(code, message, 500, corsHeaders),
      };
    }

    if (!rpcData || rpcData.allowed === undefined) {
      const code = 'AUTHORIZATION_SERVICE_ERROR';
      const message = 'Invalid usage response format from authority.';
      return {
        allowed: false,
        code,
        error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
        response: createServiceErrorResponse(code, message, 500, corsHeaders),
      };
    }

    if (!rpcData.allowed) {
      const code = 'QUOTA_EXCEEDED';
      return {
        allowed: false,
        code,
        tier: subState.tier,
        currentUsage: rpcData.current_usage,
        limit: subState.dailyLimit,
        periodKey: subState.periodKey,
        metric: subState.metric,
        error: {
          error: 'RATE_LIMIT_EXCEEDED',
          code,
          message: `Daily AI query limit reached (${rpcData.current_usage}/${subState.dailyLimit}) for ${subState.tier} plan. Please upgrade your subscription at /billing for higher capacity.`,
          tier: subState.tier,
          current_usage: rpcData.current_usage,
          limit: subState.dailyLimit,
        },
        response: createQuotaExceededResponse(subState.tier, rpcData.current_usage, subState.dailyLimit, corsHeaders),
      };
    }

    return {
      allowed: true,
      tier: subState.tier,
      currentUsage: rpcData.current_usage,
      limit: subState.dailyLimit,
      periodKey: subState.periodKey,
      metric: subState.metric,
      unlimited: false,
    };
  } catch (rpcErr) {
    console.error('[subscriptionResolver] Fail-closed: atomic RPC network error:', rpcErr?.message || rpcErr);
    const code = 'AUTHORIZATION_SERVICE_ERROR';
    const message = 'Usage verification service unavailable.';
    return {
      allowed: false,
      code,
      error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
      response: createServiceErrorResponse(code, message, 500, corsHeaders),
    };
  }
}
