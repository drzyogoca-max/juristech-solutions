/**
 * api/paddle/webhook.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Dedicated Paddle Webhook Route Adapter (Option B)
 * Preserves exact raw HTTP request body bytes for HMAC-SHA256 signature verification.
 * Delegates database atomic transaction, idempotency, & state machine to api/webhooks/payment.js.
 */

import paymentHandler from '../webhooks/payment.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf-8');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'JurisTech Dedicated Paddle Webhook Endpoint v1.0',
      status: 'ONLINE',
      provider: 'paddle',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Capture exact raw HTTP request body string before JSON parsing
    const rawBody = await getRawBody(req);

    // 2. Validate presence of Paddle-Signature header
    const signature = req.headers['paddle-signature'] || req.headers['x-paddle-signature'] || '';
    if (!signature) {
      return res.status(400).json({ error: 'Missing Paddle-Signature header' });
    }

    // 3. Parse body for payload inspection while preserving rawBody intact
    let parsedBody = {};
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    // 4. Attach rawBody and parsedBody to req for delegation to shared handler
    req.rawBody = rawBody;
    req.body = parsedBody;
    req.query = { ...req.query, provider: 'paddle' };

    // 5. Delegate to atomic payment engine in api/webhooks/payment.js
    return await paymentHandler(req, res);
  } catch (error) {
    console.error('[Paddle Webhook Adapter Error]:', error.message);
    return res.status(500).json({ error: 'Internal server error processing Paddle webhook' });
  }
}
