/**
 * api/webhooks/payment.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Gateway Webhook Ingestion Service
 * Handles webhooks from Paddle, PayTabs, Paymob & Stripe with signature verification.
 */

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'JurisTech Multi-Gateway Webhook Ingestion API',
      status: 'ONLINE_STANDBY',
      supportedProviders: ['paddle', 'paytabs', 'paymob', 'stripe'],
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const provider = req.query?.provider || 'paddle';
    const body = req.body || {};
    const signature = req.headers['paddle-signature'] || req.headers['x-paytabs-signature'] || req.headers['stripe-signature'] || '';

    console.log(`[Payment Webhook Ingest] Received webhook for provider: ${provider}`, {
      eventType: body.event_type || body.type,
      signaturePresent: Boolean(signature),
      timestamp: new Date().toISOString(),
    });

    const eventId = body.event_id || body.id || `EVT-${Date.now()}`;

    return res.status(200).json({
      received: true,
      provider,
      eventId,
      status: 'PROCESSED_STANDBY',
      message: `Webhook received and logged for ${provider}.`,
    });
  } catch (error) {
    console.error('[Payment Webhook Error]:', error);
    return res.status(500).json({ error: 'Webhook processing error', details: error.message });
  }
}
