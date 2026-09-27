/**
 * Vercel Serverless Gateway — /api/leads
 * Consolidated gateway routing lead staging, approvals, and partnership dispatches.
 */

import { GET as handleGetStaged } from '../server/leads/get-staged.js';
import { POST as handleDispatchApproved } from '../server/leads/dispatch-approved.js';
import { POST as handleDispatchProposal } from '../server/leads/dispatch-real-proposal.js';

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET(req) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || '';

  if (action === 'get-staged' || url.pathname.includes('get-staged')) {
    return handleGetStaged(req);
  }

  return Response.json({ status: 'ok', service: 'JurisTech Leads Gateway' }, { headers: CORS_HEADERS });
}

export async function POST(req) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || '';

  if (action === 'dispatch-approved' || url.pathname.includes('dispatch-approved')) {
    return handleDispatchApproved(req);
  }

  if (action === 'dispatch-real-proposal' || url.pathname.includes('dispatch-real-proposal')) {
    return handleDispatchProposal(req);
  }

  // Default to dispatch approved if unspecified
  return handleDispatchApproved(req);
}
