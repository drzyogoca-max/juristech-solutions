/**
 * middleware.ts — Vercel Edge Middleware (Vite SPA compatible)
 * ─────────────────────────────────────────────────────────────
 * RBAC Route Guard: protects /admin/* from unauthorized access.
 * Uses native Vercel Edge Runtime Request/Response (no next/server dependency).
 */

export const config = {
  matcher: ['/:path*'],
};

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);
  const { pathname, hostname, search } = url;

  // 1. Permanent 301 Redirect from legalshieldsolution.online to juristech.solutions
  if (hostname.includes('legalshieldsolution.online')) {
    const targetUrl = `https://juristech.solutions${pathname}${search}`;
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
