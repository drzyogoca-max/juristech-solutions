/**
 * lib/security/sovereign-guard.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sovereign Contract Generation Guard & Tier Quota Enforcement
 * Sprint 04C Phase 2B: Strict Authentication & Fail-Closed Contract Quotas
 *
 * ARCHITECTURE:
 *   Verified JWT Context (backendAuthGuard)
 *   → verifyAdminOrEnforcePaywall(verifiedUser)
 *   → resolveUserSubscription(verifiedUser) via subscriptionResolver
 *   → Canonical Contract Tier Quota:
 *       • Free Trial: 2 lifetime (period_key: 'lifetime')
 *       • Startup: 10 per month (period_key: UTC 'YYYY-MM')
 *       • SMEs / Pro: 50 per month (period_key: UTC 'YYYY-MM')
 *       • Enterprise: Unlimited (bypasses RPC limiter)
 *       • Admin / Lawyer: Unlimited (bypasses RPC limiter)
 *   → Atomic PostgreSQL RPC: check_and_increment_usage(p_user_id, 'contracts_created', limit, period_key)
 *   → If Denied / Infrastructure Failure: Fail closed with HTTP 429 or 500 (BEFORE Gemini/model execution)
 *   → If Allowed: Proceed to Sovereign Contract Generation
 */

import { resolveUserSubscription } from './subscriptionResolver.js';

export const CONTRACT_LIMITS = {
  'Free Trial': 2,
  'Startup': 10,
  'SMEs': 50,
  'Pro': 50,
  'Enterprise': null, // Unlimited
};

export const CONTRACT_PERIODS = {
  'Free Trial': 'lifetime',
  'Startup': 'monthly',
  'SMEs': 'monthly',
  'Pro': 'monthly',
  'Enterprise': 'unlimited',
};

const CORS_HEADERS_DEFAULT = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
};

/**
 * Computes canonical UTC month string (YYYY-MM) for monthly contract quotas
 * @param {Date | number} [date]
 * @returns {string}
 */
export function getUtcMonthlyPeriodKey(date = new Date()) {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Verifies verified admin or privileged lawyer context.
 * FAIL-CLOSED: Missing, null, unverified, or client-spoofed context is NEVER granted privileged access.
 *
 * @param {Object} verifiedUser - Verified user object from backendAuthGuard
 * @returns {{
 *   authorized: boolean,
 *   accessType: string,
 *   paywallActive: boolean,
 *   message: string
 * }}
 */
export function verifyAdminOrEnforcePaywall(verifiedUser) {
  // Fail-closed: missing or non-object context is strictly rejected
  if (!verifiedUser || typeof verifiedUser !== 'object' || !verifiedUser.id) {
    return {
      authorized: false,
      accessType: 'UNAUTHENTICATED_OR_INVALID',
      paywallActive: true,
      message: 'غير مصرح: يجب توثيق الهوية عبر جلسة معتمدة.'
    };
  }

  // Trusted privileged roles derived exclusively from verified backendAuthGuard context
  const isPrivileged = Boolean(verifiedUser.isAdmin || verifiedUser.isLawyer);

  if (isPrivileged) {
    return {
      authorized: true,
      accessType: 'PRIVILEGED_ADMIN_UNRESTRICTED',
      paywallActive: false,
      message: 'صلاحيات إدارية معتمدة: وصول كامل وموثق 100%.'
    };
  }

  // Standard verified user
  return {
    authorized: false,
    accessType: 'STANDARD_USER_AUTHENTICATED',
    paywallActive: false,
    message: 'مستخدم موثق بنجاح.'
  };
}

/**
 * Creates structured 429 Quota Exceeded Response for contracts
 */
export function createContractQuotaExceededResponse(tier, currentUsage, limit, customHeaders = {}) {
  const headers = {
    ...CORS_HEADERS_DEFAULT,
    'Retry-After': '3600',
    ...customHeaders,
  };

  const periodDesc = tier === 'Free Trial' ? 'lifetime' : 'monthly';

  return new Response(
    JSON.stringify({
      error: 'RATE_LIMIT_EXCEEDED',
      code: 'QUOTA_EXCEEDED',
      message: `Contract generation limit reached (${currentUsage}/${limit} ${periodDesc}) for ${tier} plan. Please upgrade your subscription at /billing for higher capacity.`,
      tier,
      current_usage: currentUsage,
      limit,
      metric: 'contracts_created',
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
export function createContractServiceErrorResponse(code, message, status = 500, customHeaders = {}) {
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
 * Enforces atomic contract generation quota for verified user.
 * Guaranteed fail-closed on any authentication or infrastructure failure.
 *
 * @param {Object} verifiedUser - Verified user object from backendAuthGuard
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
export async function enforceContractQuota(verifiedUser, options = {}) {
  const corsHeaders = options.corsHeaders || CORS_HEADERS_DEFAULT;

  if (!verifiedUser || !verifiedUser.id) {
    const code = 'UNAUTHORIZED';
    const message = 'Authentication required to generate contracts.';
    return {
      allowed: false,
      code,
      error: { error: 'UNAUTHORIZED', code, message },
      response: createContractServiceErrorResponse(code, message, 401, corsHeaders),
    };
  }

  // 1. Privileged Role Bypass (Admin or Lawyer verified from backendAuthGuard)
  if (verifiedUser.isAdmin || verifiedUser.isLawyer) {
    return {
      allowed: true,
      tier: 'Enterprise',
      currentUsage: null,
      limit: null,
      periodKey: 'unlimited',
      metric: 'contracts_created',
      unlimited: true,
    };
  }

  // 2. Resolve Subscription Tier (Fail-Closed)
  const subState = await resolveUserSubscription(verifiedUser, options);

  if (!subState.success || subState.error) {
    const code = subState.error?.code || 'AUTHORIZATION_SERVICE_ERROR';
    const message = subState.error?.message || 'Authorization service failure.';
    return {
      allowed: false,
      code,
      error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
      response: createContractServiceErrorResponse(code, message, 500, corsHeaders),
    };
  }

  const tier = subState.tier || 'Free Trial';

  // 3. Enterprise Plan Bypass
  if (tier === 'Enterprise' || subState.isPrivileged) {
    return {
      allowed: true,
      tier: 'Enterprise',
      currentUsage: null,
      limit: null,
      periodKey: 'unlimited',
      metric: 'contracts_created',
      unlimited: true,
    };
  }

  // 4. Server-computed limits & periods
  let limit = 2;
  let periodKey = 'lifetime';

  if (tier === 'Startup') {
    limit = 10;
    periodKey = options.customPeriodKey || getUtcMonthlyPeriodKey();
  } else if (tier === 'SMEs' || tier === 'Pro') {
    limit = 50;
    periodKey = options.customPeriodKey || getUtcMonthlyPeriodKey();
  } else {
    // Free Trial or unrecognized tier defaults to Free Trial quota
    limit = 2;
    periodKey = options.customPeriodKey || 'lifetime';
  }

  // 5. Mock RPC handler override for testing if provided
  if (typeof options.mockRpcHandler === 'function') {
    const rpcResult = await options.mockRpcHandler({
      p_user_id: verifiedUser.id,
      p_metric: 'contracts_created',
      p_limit: limit,
      p_period_key: periodKey,
    });

    if (!rpcResult.allowed) {
      const code = 'QUOTA_EXCEEDED';
      return {
        allowed: false,
        code,
        tier,
        currentUsage: rpcResult.current_usage,
        limit,
        periodKey,
        metric: 'contracts_created',
        error: {
          error: 'RATE_LIMIT_EXCEEDED',
          code,
          message: `Contract generation limit reached (${rpcResult.current_usage}/${limit}) for ${tier} plan. Please upgrade your subscription at /billing for higher capacity.`,
          tier,
          current_usage: rpcResult.current_usage,
          limit,
        },
        response: createContractQuotaExceededResponse(tier, rpcResult.current_usage, limit, corsHeaders),
      };
    }

    return {
      allowed: true,
      tier,
      currentUsage: rpcResult.current_usage,
      limit,
      periodKey,
      metric: 'contracts_created',
      unlimited: false,
    };
  }

  // 6. Supabase Credentials for real environment
  const supabaseUrl =
    options.customSupabaseUrl ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://slhxqshdvivvsdifbsxo.supabase.co';

  const serviceKey =
    options.customServiceKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.error('[sovereign-guard] Fail-closed: missing SUPABASE_SERVICE_ROLE_KEY for contract quota RPC');
    const code = 'AUTHORIZATION_SERVICE_ERROR';
    const message = 'Contract quota verification service is temporarily unconfigured.';
    return {
      allowed: false,
      code,
      error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
      response: createContractServiceErrorResponse(code, message, 500, corsHeaders),
    };
  }

  // 7. Invoke Atomic PostgreSQL RPC check_and_increment_usage
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
        p_user_id: verifiedUser.id,
        p_metric: 'contracts_created',
        p_limit: limit,
        p_period_key: periodKey,
      }),
    });

    if (!rpcRes.ok) {
      console.error('[sovereign-guard] Fail-closed: check_and_increment_usage returned HTTP', rpcRes.status);
      const code = 'AUTHORIZATION_SERVICE_ERROR';
      const message = 'Failed to execute atomic contract usage verification.';
      return {
        allowed: false,
        code,
        error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
        response: createContractServiceErrorResponse(code, message, 500, corsHeaders),
      };
    }

    let rpcData;
    try {
      rpcData = await rpcRes.json();
    } catch (parseErr) {
      console.error('[sovereign-guard] Fail-closed: malformed JSON from contract quota RPC');
      const code = 'AUTHORIZATION_SERVICE_ERROR';
      const message = 'Invalid usage response format from authority.';
      return {
        allowed: false,
        code,
        error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
        response: createContractServiceErrorResponse(code, message, 500, corsHeaders),
      };
    }

    if (!rpcData || rpcData.allowed === undefined) {
      const code = 'AUTHORIZATION_SERVICE_ERROR';
      const message = 'Invalid usage response format from authority.';
      return {
        allowed: false,
        code,
        error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
        response: createContractServiceErrorResponse(code, message, 500, corsHeaders),
      };
    }

    if (!rpcData.allowed) {
      const code = 'QUOTA_EXCEEDED';
      return {
        allowed: false,
        code,
        tier,
        currentUsage: rpcData.current_usage,
        limit,
        periodKey,
        metric: 'contracts_created',
        error: {
          error: 'RATE_LIMIT_EXCEEDED',
          code,
          message: `Contract generation limit reached (${rpcData.current_usage}/${limit}) for ${tier} plan. Please upgrade your subscription at /billing for higher capacity.`,
          tier,
          current_usage: rpcData.current_usage,
          limit,
        },
        response: createContractQuotaExceededResponse(tier, rpcData.current_usage, limit, corsHeaders),
      };
    }

    return {
      allowed: true,
      tier,
      currentUsage: rpcData.current_usage,
      limit,
      periodKey,
      metric: 'contracts_created',
      unlimited: false,
    };
  } catch (rpcErr) {
    console.error('[sovereign-guard] Fail-closed: atomic RPC network error:', rpcErr?.message || rpcErr);
    const code = 'AUTHORIZATION_SERVICE_ERROR';
    const message = 'Contract usage verification service unavailable.';
    return {
      allowed: false,
      code,
      error: { error: 'AUTHORIZATION_SERVICE_ERROR', code, message },
      response: createContractServiceErrorResponse(code, message, 500, corsHeaders),
    };
  }
}
