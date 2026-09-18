/**
 * lib/security/backendAuthGuard.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Universal Server-Side Authentication Guard
 * Sprint 04C Phase 1B-1
 *
 * PURPOSE:
 *   Verifies Supabase JWT access tokens on backend Edge and Node.js routes.
 *   Provides an impenetrable server-side authentication perimeter for AI endpoints.
 *
 * GUARANTEES:
 *   • Strictly extracts Authorization: Bearer <token>.
 *   • Fails closed (401 Unauthorized) on missing, malformed, or invalid tokens.
 *   • Zero fallback to anonymous mode.
 *   • Cryptographically validates tokens against Supabase Auth endpoint (/auth/v1/user).
 *   • Derives identity ONLY from verified token claims (never from client request bodies).
 *   • Zero logging of raw tokens or secret keys.
 *   • Zero service_role exposure.
 */

const CORS_HEADERS_DEFAULT = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
};

const OFFICIAL_ADMIN_EMAILS = [
  'drzyogo.ca@gmail.com',
  'founder@juristech.solutions',
  'admin@juristech.solutions'
];

/**
 * Extracts the Bearer token string from standard Web Request or Node.js req
 * @param {Request | import('http').IncomingMessage | Object} req
 * @returns {string | null}
 */
export function extractBearerToken(req) {
  if (!req) return null;

  let authHeader = '';

  // Edge / Web Standard Request (req.headers.get)
  if (typeof req.headers?.get === 'function') {
    authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
  }
  // Node.js IncomingMessage (req.headers['authorization'])
  else if (req.headers && typeof req.headers === 'object') {
    authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  }

  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const trimmed = authHeader.trim();
  if (!trimmed.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  const token = trimmed.slice(7).trim();
  return token.length > 0 ? token : null;
}

/**
 * Helper to build standard structured 401 JSON Response
 * @param {string} code
 * @param {string} message
 * @param {Object} [customHeaders]
 * @returns {Response}
 */
export function createUnauthorizedResponse(code, message, customHeaders = {}) {
  const headers = {
    ...CORS_HEADERS_DEFAULT,
    ...customHeaders,
  };

  return new Response(
    JSON.stringify({
      error: 'UNAUTHORIZED',
      code,
      message,
    }),
    {
      status: 401,
      headers,
    }
  );
}

/**
 * Authenticates an incoming request using verified Supabase Auth token
 *
 * @param {Request | import('http').IncomingMessage | Object} req - The incoming HTTP request
 * @param {Object} [options]
 * @param {Object} [options.corsHeaders] - Custom CORS headers for response
 * @param {string} [options.customSupabaseUrl] - Optional URL override for testing
 * @param {string} [options.customAnonKey] - Optional Anon Key override for testing
 * @returns {Promise<{
 *   authenticated: boolean,
 *   user?: {
 *     id: string,
 *     email: string,
 *     role: string,
 *     isAdmin: boolean,
 *     isLawyer: boolean,
 *     createdAt?: string
 *   },
 *   error?: { error: string, code: string, message: string },
 *   response?: Response
 * }>}
 */
export async function authenticateRequest(req, options = {}) {
  const corsHeaders = options.corsHeaders || CORS_HEADERS_DEFAULT;

  // 1. Inspect Authorization Header Existence
  let rawAuthHeader = '';
  if (typeof req?.headers?.get === 'function') {
    rawAuthHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
  } else if (req?.headers && typeof req.headers === 'object') {
    rawAuthHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  }

  if (!rawAuthHeader || typeof rawAuthHeader !== 'string' || !rawAuthHeader.trim()) {
    const code = 'MISSING_AUTHORIZATION_TOKEN';
    const message = 'Authentication required. Missing Authorization header with Bearer token.';
    return {
      authenticated: false,
      error: { error: 'UNAUTHORIZED', code, message },
      response: createUnauthorizedResponse(code, message, corsHeaders),
    };
  }

  // 2. Validate Bearer Token Formatting
  const token = extractBearerToken(req);
  if (!token) {
    const code = 'MALFORMED_AUTHORIZATION_HEADER';
    const message = 'Invalid Authorization header format. Must be "Bearer <access_token>".';
    return {
      authenticated: false,
      error: { error: 'UNAUTHORIZED', code, message },
      response: createUnauthorizedResponse(code, message, corsHeaders),
    };
  }

  // 3. Resolve Supabase Environment Credentials
  const DEFAULT_SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';
  const DEFAULT_ANON_KEY = 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO';

  const supabaseUrl =
    options.customSupabaseUrl ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const anonKey =
    options.customAnonKey ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    DEFAULT_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('[backendAuthGuard] Server misconfiguration: missing Supabase environment variables');
    const code = 'AUTH_CONFIGURATION_ERROR';
    const message = 'Authentication service is temporarily unavailable due to server configuration.';
    return {
      authenticated: false,
      error: { error: 'UNAUTHORIZED', code, message },
      response: new Response(
        JSON.stringify({ error: 'UNAUTHORIZED', code, message }),
        { status: 401, headers: corsHeaders }
      ),
    };
  }

  // 4. Verify Token with Supabase Auth Verification Endpoint
  try {
    const authEndpoint = `${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`;
    const verifyRes = await fetch(authEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': anonKey,
      },
    });

    if (!verifyRes.ok) {
      const code = 'INVALID_OR_EXPIRED_TOKEN';
      const message = 'The provided access token is invalid, expired, or revoked.';
      return {
        authenticated: false,
        error: { error: 'UNAUTHORIZED', code, message },
        response: createUnauthorizedResponse(code, message, corsHeaders),
      };
    }

    const userData = await verifyRes.json();

    if (!userData || !userData.id) {
      const code = 'INVALID_USER_RECORD';
      const message = 'Unable to resolve trusted user identity from token claims.';
      return {
        authenticated: false,
        error: { error: 'UNAUTHORIZED', code, message },
        response: createUnauthorizedResponse(code, message, corsHeaders),
      };
    }

    // 5. Derive Verified User Identity (Ignore all client-supplied role/email bodies)
    const verifiedId = userData.id;
    const verifiedEmail = (userData.email || '').toLowerCase().trim();

    const appRole = userData.app_metadata?.role;
    const userRole = userData.user_metadata?.role;
    const resolvedRole = appRole || userRole || 'authenticated';

    const isOfficialAdmin = OFFICIAL_ADMIN_EMAILS.includes(verifiedEmail);
    const isAdmin = isOfficialAdmin || appRole === 'admin' || appRole === 'super-admin' || userRole === 'admin';
    const isLawyer = appRole === 'lawyer' || userRole === 'lawyer';

    return {
      authenticated: true,
      user: {
        id: verifiedId,
        email: verifiedEmail,
        role: resolvedRole,
        isAdmin: Boolean(isAdmin),
        isLawyer: Boolean(isLawyer),
        createdAt: userData.created_at,
      },
    };
  } catch (netErr) {
    console.error('[backendAuthGuard] Network verification exception:', netErr?.message || netErr);
    const code = 'TOKEN_VERIFICATION_FAILED';
    const message = 'Failed to verify token against authentication authority.';
    return {
      authenticated: false,
      error: { error: 'UNAUTHORIZED', code, message },
      response: createUnauthorizedResponse(code, message, corsHeaders),
    };
  }
}
