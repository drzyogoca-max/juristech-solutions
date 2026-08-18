/**
 * middleware.ts — Vercel Edge Middleware (Vite SPA compatible)
 * ─────────────────────────────────────────────────────────────
 * 1. Automatic 301 Permanent Canonical Domain Redirection:
 *    All traffic from Legal Solution / legalshieldsolution.online / legalsolution
 *    is immediately and permanently routed to https://www.juristech.solutions
 * 2. RBAC Route Guard: protects /admin/* from unauthorized access.
 */

export const config = {
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

  // 2. Protect API backend endpoints strictly
  if (pathname.startsWith('/api/admin')) {
    const cookie = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || '';

    const hasAdminToken =
      cookie.includes('juristech_admin_token=true') ||
      authHeader.startsWith('Bearer ');

    if (!hasAdminToken) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Sovereign Admin Authentication Required' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return undefined; // pass through
}
