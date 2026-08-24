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

    // Enforce server-side authorization: Reject unauthenticated public requests
    const expectedSecret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const isAuthorized = (expectedSecret && (authHeader.includes(expectedSecret) || adminToken === expectedSecret)) || (process.env.NODE_ENV !== 'production' && authHeader.startsWith('Bearer juristech_admin_'));

    if (!isAuthorized && process.env.NODE_ENV === 'production') {
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
