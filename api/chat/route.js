/**
 * Next.js / Vercel App Router Edge Route — /api/chat/route.js
 * JurisTech Solutions | Ultra-Fast AI Legal Advisor & Global Knowledge RAG Engine
 */

import handler from '../chat.js';

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

export async function POST(req) {
  return handler(req);
}

export async function GET(req) {
  return Response.json({ status: 'ok', service: 'JurisTech AI Legal Advisor Engine' });
}
