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

  try {
    const body = await req.json();
    const erpSystem = req.headers.get('x-erp-system') || 'GENERIC_ERP';

    console.log(`[Edge ERP Webhook] Received webhook payload from ${erpSystem}:`, body);

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
