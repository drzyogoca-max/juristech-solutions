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
  if (req.rawBody) return req.rawBody;
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf-8');

  if (req.readableEnded || req.complete) {
    return typeof req.body === 'object' ? JSON.stringify(req.body) : '';
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const result = Buffer.concat(chunks).toString('utf-8');
    if (result) return result;
  } catch (e) {
    console.warn('[Paddle Webhook Adapter Stream Warning]:', e.message);
  }

  return typeof req.body === 'object' ? JSON.stringify(req.body) : '';
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
    // 1. Validate presence of Paddle-Signature header FIRST
    const signature = req.headers['paddle-signature'] || req.headers['x-paddle-signature'] || '';
    if (!signature) {
      return res.status(400).json({ error: 'Missing Paddle-Signature header' });
    }

    // 2. Capture exact raw HTTP request body string before JSON parsing
    const rawBody = await getRawBody(req);

    // 3. Parse body for payload inspection while preserving rawBody intact
    let parsedBody = {};
    if (rawBody && typeof rawBody === 'string' && rawBody.trim().length > 0) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    } else if (req.body && typeof req.body === 'object') {
      parsedBody = req.body;
    }

    // 4. Attach rawBody and parsedBody to req for delegation to shared handler
    req.rawBody = rawBody;
    req.body = parsedBody;
    req.query = { ...(req.query || {}), provider: 'paddle' };

    // 5. Delegate to atomic payment engine in api/webhooks/payment.js
    const delegateFn = typeof paymentHandler === 'function' ? paymentHandler : paymentHandler?.default;
    if (typeof delegateFn === 'function') {
      return await delegateFn(req, res);
    }

    return res.status(500).json({ error: 'Webhook handler function resolution failed' });
  } catch (error) {
    console.error('[Paddle Webhook Adapter Error]:', error.message || error);
    return res.status(500).json({ error: 'Internal server error processing Paddle webhook' });
  }
}
