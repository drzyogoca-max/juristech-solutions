/**
 * Vercel Edge Serverless Function — /api/leads/get-staged
 * Fetch pending human-in-the-loop proposals waiting for admin 1-click approval
 */

import { getStagingQueue } from './staging-pipeline.js';

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const adminToken = req.headers.get('x-admin-token') || '';

    const OFFICIAL_ADMIN_EMAILS = ['drzyogo.ca@gmail.com', 'juristech.solutions@outlook.com', 'admin@juristech.solutions'];
    let isAuthorized = false;

    const serverSecret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (serverSecret && (authHeader === `Bearer ${serverSecret}` || adminToken === serverSecret)) {
      isAuthorized = true;
    } else if (authHeader.startsWith('Bearer ')) {
      const jwt = authHeader.replace('Bearer ', '').trim();
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
      if (supabaseUrl && anonKey && jwt) {
        try {
          const uRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: { 'Authorization': `Bearer ${jwt}`, 'apikey': anonKey }
          });
          if (uRes.ok) {
            const uData = await uRes.json();
            if (uData?.email && OFFICIAL_ADMIN_EMAILS.includes(uData.email.toLowerCase().trim())) {
              isAuthorized = true;
            }
          }
        } catch (e) {}
      }
    }

    if (!isAuthorized) {
      return Response.json({ error: 'Unauthorized: Sovereign administrative authorization required' }, { status: 401, headers: CORS_HEADERS });
    }

    const proposals = await getStagingQueue();
    return Response.json({
      success: true,
      proposals: proposals || []
    }, { headers: CORS_HEADERS });
  } catch (error) {
    return Response.json({ proposals: [] }, { status: 500, headers: CORS_HEADERS });
  }
}

export default async function handler(req) {
  return GET(req);
}
