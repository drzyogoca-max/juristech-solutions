/**
 * api/erp/webhook-handler.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Vercel / Edge Serverless Webhook Endpoint for Incoming ERP Events (SAP, Odoo, Salesforce, Oracle)
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-ERP-Signature',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('authorization') || '';
  const erpSecret = req.headers.get('x-erp-signature') || req.headers.get('x-webhook-secret') || '';
  const expectedSecret = process.env.ERP_WEBHOOK_SECRET || process.env.ADMIN_SECRET_KEY || '';

  if (!expectedSecret) {
    return new Response(JSON.stringify({ error: 'Service Unavailable: ERP webhook secret not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;
  const isValid = bearer === expectedSecret || erpSecret === expectedSecret;
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Unauthorized: invalid or missing ERP webhook credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await req.json();
    const erpSystem = req.headers.get('x-erp-system') || 'GENERIC_ERP';

    const sanitized = { ...body };
    ['password', 'secret', 'token', 'apiKey', 'creditCard', 'ssn'].forEach((k) => {
      if (sanitized[k]) sanitized[k] = '[REDACTED]';
    });

    console.log(`[Edge ERP Webhook] Received webhook payload from ${erpSystem}:`, JSON.stringify(sanitized));

    return new Response(
      JSON.stringify({
        success: true,
        receivedAt: new Date().toISOString(),
        erpSystem,
        status: 'PROCESSED_BY_JURISTECH_EDGE',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON payload', details: err.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
