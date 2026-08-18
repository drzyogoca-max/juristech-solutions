/**
 * Vercel Edge Serverless Function — /api/leads/dispatch-approved
 * Human 1-Click Approve & Dispatch Proposal Action
 */

import { approveAndSendProposal } from './staging-pipeline.js';

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

export async function POST(req) {
  try {
    const { stagedId } = await req.json();

    if (!stagedId) {
      return Response.json({ error: 'Missing staged proposal ID' }, { status: 400, headers: CORS_HEADERS });
    }

    const result = await approveAndSendProposal(stagedId);
    return Response.json(result, { headers: CORS_HEADERS });

  } catch (error) {
    return Response.json({ error: error.message || 'Dispatch action bottleneck' }, { status: 500, headers: CORS_HEADERS });
  }
}

export default async function handler(req) {
  return POST(req);
}
