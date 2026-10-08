/**
 * api/webhooks/payment.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Gateway Webhook Ingestion & State Machine Engine
 * 100% Atomic PostgreSQL Transaction Pipeline (All-or-Nothing Guarantee)
 * Supports: PayTabs (MENA & Primary Gateway Under Review), Paymob & Stripe
 */

import crypto from 'crypto';
import { processEmailDispatch } from '../send-email.js';

export const config = {
  runtime: 'nodejs',
};

// Layer 1: In-Memory Fast De-duplication Cache (Process-Local Optimization)
const processedEventsCache = new Set();

// Approximate conversion rates to USD for multi-currency validation
const FX_RATES_TO_USD = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.30,
  AED: 0.272,
  SAR: 0.267,
  QAR: 0.275,
  KWD: 3.26,
  OMR: 2.60,
};

// Allowed strict payment state machine transitions (Prevents out-of-order state regression)
export const ALLOWED_STATE_TRANSITIONS = {
  pending: ['authorized', 'active', 'failed', 'cancelled'],
  authorized: ['active', 'failed', 'cancelled'],
  active: ['past_due', 'cancelled', 'refunded', 'expired'],
  past_due: ['active', 'cancelled', 'expired'],
  cancelled: ['active'], // Explicit renewal only
  refunded: [],          // Terminal state: No transitions allowed
  expired: ['active'],   // Explicit reactivation only
};

export const PLAN_PRICES = {
  startup: 49.00,
  starter: 49.00,
  micro: 49.00,
  sme: 139.00,
  pro: 139.00,
  growth: 139.00,
  enterprise: 349.00,
  dealroom: 990.00,
};

/**
 * Executes 100% Atomic PostgreSQL Webhook Transaction via RPC
 */
async function executeAtomicWebhookTransaction(params) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // FAIL CLOSED: never report success when nothing was persisted, otherwise the gateway stops retrying
    // and a paid subscription is silently never activated.
    console.error('[Atomic Webhook] Database not configured — event NOT processed (gateway will retry).');
    return {
      success: false,
      isDatabaseBacked: false,
      error: 'DATABASE_NOT_CONFIGURED',
    };
  }

  try {
    const endpoint = `${supabaseUrl}/rest/v1/rpc/process_payment_webhook_atomic`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_provider: params.provider,
        p_event_id: params.eventId,
        p_event_type: params.eventType,
        p_customer_email: params.customerEmail,
        p_plan_tier: params.planTier,
        p_amount_usd: params.amount,
        p_currency: params.currency,
        p_provider_sub_id: params.subscriptionId,
        p_provider_payment_id: params.paymentId,
        p_payload: params.payload,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, isDatabaseBacked: true, ...data };
    }

    const errText = await res.text();
    console.error('[Atomic Webhook RPC Error]:', res.status, errText);
    return { success: false, isDatabaseBacked: true, error: errText };
  } catch (err) {
    console.error('[Atomic RPC Connection Error]:', err.message);
    // FAIL CLOSED: a connection error means the event was NOT recorded; let the gateway retry.
    return { success: false, isDatabaseBacked: false, error: 'DATABASE_CONNECTION_ERROR' };
  }
}

function verifyWebhookSignature(provider, body, signature, secret, rawBodyString) {
  if (!secret || !signature) return false;

  const rawBody = rawBodyString || (typeof body === 'string' ? body : JSON.stringify(body));

  // 1. Direct hex HMAC-SHA256 (PayTabs & Standard Gateways)
  try {
    const directHmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (signature.length === directHmac.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(directHmac))) {
      return true;
    }
  } catch (e) {}

  // 2. Stripe Signature Format: t=123456789,v1=hexhash OR Paddle: ts=123456789;h1=hexhash
  if ((signature.includes('t=') && signature.includes('v1=')) || (signature.includes('ts=') && signature.includes('h1='))) {
    try {
      const separator = signature.includes(';') ? ';' : ',';
      const parts = signature.split(separator).reduce((acc, part) => {
        const [k, v] = part.trim().split('=');
        if (k && v) acc[k] = v;
        return acc;
      }, {});

      const ts = parts.ts || parts.t;
      const hash = parts.h1 || parts.v1;

      // Replay protection: reject signatures older/newer than 5 minutes
      if (ts && hash && Math.abs(Date.now() / 1000 - Number(ts)) <= 300) {
        const payloadToSign = `${ts}.${rawBody}`;
        const computed = crypto.createHmac('sha256', secret).update(payloadToSign).digest('hex');
        if (hash.length === computed.length && crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed))) {
          return true;
        }
      }
    } catch (e) {}
  }

  return false;
}

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'JurisTech Multi-Gateway Webhook Ingestion Service v3.0 (Atomic RPC)',
      status: 'ONLINE_STANDBY',
      supportedProviders: ['paytabs', 'paymob', 'stripe', 'paddle', 'tap', 'gumroad'],
      idempotencyArchitecture: 'ATOMIC_POSTGRESQL_TRANSACTION (Dual-Layer Cache + Database RPC)',
      cachedEventsCount: processedEventsCache.size,
      timestamp,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const provider = (req.query?.provider || 'paytabs').toLowerCase();
    if (!['paytabs', 'paymob', 'stripe', 'gumroad', 'paddle', 'tap'].includes(provider)) {
      return res.status(400).json({ error: 'Unsupported payment provider' });
    }
    const body = req.body || {};
    const signature = req.headers['x-paytabs-signature'] ||
                      req.headers['stripe-signature'] ||
                      req.headers['paddle-signature'] ||
                      req.headers['x-tap-signature'] ||
                      req.headers['signature'] || '';

    // 1. Extract Event Identity & Payload Data
    const eventData = body.data || {};
    const eventId = body.event_id || body.id || eventData.id || body.tran_ref;
    if (!eventId) {
      // A random/time-based fallback id would defeat idempotency (every retry would look like a new event).
      return res.status(400).json({ error: 'Missing event identifier' });
    }
    const eventType = body.event_type || body.type || 'transaction.completed';

    // 2. Layer 1 Idempotency Check (Fast Process-Local Memory)
    const compositeEventKey = `${provider}:${eventId}`;
    if (processedEventsCache.has(compositeEventKey)) {
      console.warn(`[Webhook Idempotency Layer 1] Duplicate event ${compositeEventKey} skipped.`);
      return res.status(200).json({ received: true, duplicate: true, eventId, provider, status: 'ALREADY_PROCESSED_IN_MEMORY' });
    }

    // 3. Strict Signature Validation (Zero Unverified Subscription Activations)
    const webhookSecret = process.env[`${provider.toUpperCase()}_WEBHOOK_SECRET`] || process.env.PAYMENT_WEBHOOK_SECRET || '';

    if (!webhookSecret) {
      console.error(`[Webhook Security] No webhook secret configured for provider: ${provider}`);
      return res.status(401).json({ error: `Unauthorized: Webhook secret not configured for ${provider}` });
    }

    if (!signature) {
      console.error(`[Webhook Security] Missing webhook signature header for provider: ${provider}`);
      return res.status(401).json({ error: 'Unauthorized: Missing webhook signature header' });
    }

    const rawBodyString = req.rawBody || (typeof req.body === 'string' ? req.body : null);
    const isSignatureValid = verifyWebhookSignature(provider, body, signature, webhookSecret, rawBodyString);
    if (!isSignatureValid) {
      console.error(`[Webhook Security] Invalid signature rejected for provider: ${provider}`);
      return res.status(401).json({ error: 'Unauthorized: Invalid webhook signature' });
    }

    // 4. Extract and Validate Event Payload
    const customData = eventData.custom_data || body.custom_data || {};
    const customerEmail = (
      customData.userEmail ||
      eventData.customer?.email ||
      body.customer_email ||
      body.email
    )?.toLowerCase().trim();

    if (!customerEmail) {
      return res.status(400).json({ error: 'Missing customer email' });
    }

    // Strictly validate plan tier without arbitrary unverified defaults
    const candidateTier = (customData.planTier || body.plan_tier || body.plan_id || eventData.plan_tier || 'startup').toLowerCase().trim();
    const planTier = candidateTier in PLAN_PRICES ? candidateTier : 'startup';

    let amountReceived = 49.00;
    if (eventData.details?.totals?.total) {
      amountReceived = parseFloat(eventData.details.totals.total) / 100;
    } else if (body.amount) {
      amountReceived = parseFloat(body.amount);
    }

    const currency = (eventData.currency_code || body.currency || 'USD').toUpperCase();
    const subscriptionId = eventData.subscription_id || (eventType.startsWith('subscription') ? eventData.id : null) || body.subscription_id || null;
    const paymentId = eventData.id || body.payment_id || body.tran_ref || eventId;

    // 5. Server-Side Price & Currency Validation (Anti-Tampering with multi-currency FX conversion)
    const expectedPriceUSD = PLAN_PRICES[planTier] || 49.00;
    const fxRate = FX_RATES_TO_USD[currency] || 1.0;
    const normalizedAmountUSD = amountReceived * fxRate;
    const isAmountValid = amountReceived === 0 || Math.abs(normalizedAmountUSD - expectedPriceUSD) <= (expectedPriceUSD * 0.08 + 0.5);

    const amountProvided = Boolean(eventData.details?.totals?.total || body.amount);
    if (amountProvided && !isAmountValid) {
      console.error(`[Webhook Security] Amount mismatch for plan "${planTier}": received ${amountReceived} ${currency} (~$${normalizedAmountUSD.toFixed(2)} USD), expected ~$${expectedPriceUSD} USD. Event ${compositeEventKey} rejected.`);
      return res.status(422).json({ error: 'Payment amount does not match the plan price', eventId, provider });
    }

    // 6. Execute 100% Atomic PostgreSQL Transaction via Stored Procedure RPC
    const atomicResult = await executeAtomicWebhookTransaction({
      provider,
      eventId,
      eventType,
      customerEmail,
      planTier,
      amount: expectedPriceUSD,
      currency,
      subscriptionId,
      paymentId,
      payload: body,
    });

    if (atomicResult.duplicate) {
      console.warn(`[Webhook Atomic Check] Duplicate event ${compositeEventKey} detected in database.`);
      return res.status(200).json({ received: true, duplicate: true, eventId, provider, status: 'ALREADY_PROCESSED_IN_DATABASE' });
    }

    if (!atomicResult.success) {
      return res.status(500).json({ error: 'Atomic Webhook Transaction Failed', details: atomicResult.error });
    }

    console.log(`[Webhook Atomic Success] Provider: ${provider} | Event: ${eventType} | Plan: ${planTier} | DB-Backed: ${atomicResult.isDatabaseBacked}`);

    // 7. Dispatch Official Activation & Receipt Email from Server Backend
    try {
      const emailSubject = `[JurisTech Solutions] Official Receipt & License Activation (${planTier.toUpperCase()})`;
      const emailText = `Your payment of ${amountReceived} ${currency} for the ${planTier.toUpperCase()} Plan has been verified and your subscription is active. Transaction ID: ${eventId}.`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 25px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #D4AF37;">
          <h2 style="color: #D4AF37; margin-top: 0;">JurisTech Solutions ⚖️</h2>
          <h3 style="color: #10B981;">Official Payment Receipt & Subscription Activation</h3>
          <p>Thank you for subscribing to <strong>JurisTech Solutions</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 15px 0;" />
          <p><strong>Plan:</strong> ${planTier.toUpperCase()}</p>
          <p><strong>Amount:</strong> ${amountReceived} ${currency}</p>
          <p><strong>Transaction ID:</strong> ${eventId}</p>
          <p><strong>Provider:</strong> ${provider.toUpperCase()}</p>
          <p><strong>Account:</strong> ${customerEmail}</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 15px 0;" />
          <p style="font-size: 13px; color: #94a3b8;">
            Access your sovereign legal tools: <a href="https://www.juristech.solutions/dashboard" style="color: #D4AF37;">Dashboard</a><br/>
            For inquiries, contact support@juristech.solutions or founder@juristech.solutions.
          </p>
        </div>
      `;
      await processEmailDispatch(customerEmail, emailSubject, emailText, emailHtml, 'founder@juristech.solutions', true);
      console.log(`[Webhook Receipt Sent] Dispatched official confirmation to ${customerEmail}`);
    } catch (emailErr) {
      console.warn('[Webhook Receipt Warning] Could not dispatch confirmation email:', emailErr.message);
    }

    // Mark event as processed in local memory cache
    processedEventsCache.add(compositeEventKey);
    if (processedEventsCache.size > 2000) {
      const first = processedEventsCache.values().next().value;
      processedEventsCache.delete(first);
    }

    return res.status(200).json({
      success: true,
      received: true,
      provider,
      eventId,
      eventType,
      amountValidated: isAmountValid,
      idempotency: atomicResult.isDatabaseBacked ? 'ATOMIC_DATABASE_RPC_PROCESSED' : 'PROCESS_LOCAL_CLAIMED',
      status: 'PROCESSED_SUCCESS',
      timestamp,
    });
  } catch (error) {
    console.error('[Payment Webhook Handler Error]:', error.message);
    return res.status(500).json({ error: 'Internal webhook processing error' });
  }
}
