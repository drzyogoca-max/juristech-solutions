/**
 * middleware.ts — Vercel Edge Middleware (Vite SPA compatible)
 * ─────────────────────────────────────────────────────────────
 * 1. Automatic 301 Permanent Canonical Domain Redirection:
 *    All traffic from Legal Solution / legalshieldsolution.online / legalsolution
 *    is immediately and permanently routed to https://www.juristech.solutions
 * 2. RBAC Route Guard: protects /api/admin/* and administrative endpoints from unauthorized access.
 */

export const config = {
  runtime: 'nodejs',
  matcher: ['/:path*'],
};

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);
  const { pathname, hostname, search } = url;

  // 1. Permanent 301 Redirect from legalshield / legalsolution domains to canonical https://www.juristech.solutions
  const lowerHost = hostname.toLowerCase();
  if (
    lowerHost.includes('legalshield') ||
    lowerHost.includes('legalsolution') ||
    lowerHost === 'legalshieldsolution.online' ||
    lowerHost === 'www.legalshieldsolution.online' ||
    lowerHost === 'juristech.solutions' // Redirect apex to www canonical
  ) {
    const targetUrl = `https://www.juristech.solutions${pathname}${search}`;
    return Response.redirect(targetUrl, 301);
  }

  // 2. Protect administrative API backend endpoints strictly
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/leads/dispatch-real-prospects')) {
    const authHeader = request.headers.get('authorization') || '';
    const adminKeyHeader = request.headers.get('x-admin-key') || request.headers.get('x-admin-token') || '';
    const cronSecretHeader = request.headers.get('x-cron-secret') || '';

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    const validAdminSecrets = [
      process.env.ADMIN_SECRET_KEY,
      process.env.CRON_SECRET,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ].filter(Boolean) as string[];

    const isAuthorized = validAdminSecrets.length > 0 && validAdminSecrets.some(
      (secret) => secret === token || secret === adminKeyHeader || secret === cronSecretHeader
    );

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized: Valid Sovereign Admin Authentication Key Required',
          status: 401,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return undefined; // pass through
}
