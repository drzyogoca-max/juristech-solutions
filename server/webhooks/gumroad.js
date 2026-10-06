/**
 * server/webhooks/gumroad.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Gumroad Sovereign Webhook / Ping Handler
 * Automatically processes Gumroad sales and activates paid subscriptions.
 * Zero company registration required (Gumroad MoR architecture).
 */

import crypto from 'crypto';

export const config = {
  runtime: 'nodejs',
};

// Layer 1: In-memory idempotency deduplication cache
const processedGumroadSales = new Set();

export const GUMROAD_TIER_MAPPING = {
  startup: { tier: 'Startup', price: 49.00 },
  sme: { tier: 'SMEs', price: 139.00 },
  enterprise: { tier: 'Enterprise', price: 349.00 },
  dealroom: { tier: 'Enterprise', price: 990.00 },
};

/**
 * Maps Gumroad sale data to JurisTech plan tier
 */
function resolvePlanTier(productName = '', permalink = '', priceInCents = 4900) {
  const combined = `${productName} ${permalink}`.toLowerCase();
  const priceUSD = priceInCents / 100;

  if (combined.includes('sqzed') || combined.includes('dealroom') || combined.includes('enterprise') || priceUSD >= 250) {
    return 'enterprise';
  }
  if (combined.includes('ekrrs') || combined.includes('sme') || combined.includes('growth') || priceUSD >= 100) {
    return 'sme';
  }
  if (combined.includes('nydsh') || combined.includes('startup') || priceUSD <= 70) {
    return 'startup';
  }
  return 'startup';
}

/**
 * Activates subscription in Supabase or records transaction
 */
async function recordGumroadSale({
  saleId,
  customerEmail,
  planTier,
  amountUSD,
  currency,
  isRecurring,
  payload,
}) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(`[Gumroad Database Not Configured] Sale ${saleId} NOT recorded. Failing closed so Gumroad retries.`);
    return { success: false, isDatabaseBacked: false, error: 'DATABASE_NOT_CONFIGURED' };
  }

  try {
    // 1. Try atomic stored procedure if available
    const endpoint = `${supabaseUrl}/rest/v1/rpc/process_payment_webhook_atomic`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_provider: 'gumroad',
        p_event_id: saleId,
        p_event_type: 'sale.completed',
        p_customer_email: customerEmail,
        p_plan_tier: planTier,
        p_amount_usd: amountUSD,
        p_currency: currency,
        p_provider_sub_id: payload.subscription_id || null,
        p_provider_payment_id: saleId,
        p_payload: payload,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, isDatabaseBacked: true, ...data };
    }

    // 2. Direct fallback to insert into transactions / user_subscriptions if RPC differs
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/billing_transactions`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        invoice_id: `GUM-${saleId.substring(0, 12)}`,
        user_email: customerEmail,
        plan_id: planTier,
        amount_usd: amountUSD,
        payment_method: 'Gumroad MoR (Card / Apple Pay)',
        status: 'Paid',
        sha256_hash: crypto.createHash('sha256').update(`${saleId}:${customerEmail}`).digest('hex'),
      }),
    });

    return { success: insertRes.ok, isDatabaseBacked: true };
  } catch (err) {
    console.error('[Gumroad Database Error]:', err.message);
    return { success: false, isDatabaseBacked: false, error: 'DATABASE_CONNECTION_ERROR' };
  }
}

export default async function gumroadWebhookHandler(req, res) {
  const timestamp = new Date().toISOString();

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'JurisTech Gumroad Sovereign Payment Gateway Webhook',
      status: 'ONLINE',
      mode: 'MERCHANT_OF_RECORD',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'AED', 'SAR'],
      acceptedMethods: ['Credit Card (Visa/Mastercard/AMEX)', 'Apple Pay', 'Google Pay', 'PayPal'],
      requiresCompanyRegistration: false,
      timestamp,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};

    // If body was parsed as string or urlencoded
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Parse urlencoded
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    const saleId = body.sale_id || body.order_number || body.id;
    if (!saleId) {
      return res.status(400).json({ error: 'Missing Gumroad sale_id or order_number' });
    }

    const customerEmail = (body.email || body.purchaser_email)?.toLowerCase().trim();
    if (!customerEmail) {
      return res.status(400).json({ error: 'Missing customer email' });
    }

    const productName = body.product_name || '';
    const permalink = body.permalink || '';
    const priceInCents = parseInt(body.price || '4900', 10);
    const amountUSD = priceInCents / 100;
    const currency = (body.currency || 'USD').toUpperCase();
    const isRecurring = body.is_recurring_charge === 'true' || body.is_recurring_charge === true;
    const isRefunded = body.refunded === 'true' || body.refunded === true;

    // Layer 1 Idempotency Check
    if (processedGumroadSales.has(saleId)) {
      console.warn(`[Gumroad Idempotency] Duplicate sale ${saleId} skipped.`);
      return res.status(200).json({ received: true, duplicate: true, saleId });
    }

    const planTier = resolvePlanTier(productName, permalink, priceInCents);

    console.log(`[Gumroad Sale Event] ID: ${saleId} | Email: ${customerEmail} | Tier: ${planTier} | $${amountUSD} ${currency}`);

    const result = await recordGumroadSale({
      saleId,
      customerEmail,
      planTier,
      amountUSD,
      currency,
      isRecurring,
      payload: body,
    });

    if (!result.success) {
      console.error(`[Gumroad Webhook Failed] Sale ${saleId} failed to record: ${result.error}. Responding with 500 for retry.`);
      return res.status(500).json({
        success: false,
        provider: 'gumroad',
        saleId,
        error: result.error || 'Failed to record transaction',
      });
    }

    processedGumroadSales.add(saleId);
    if (processedGumroadSales.size > 2000) {
      const first = processedGumroadSales.values().next().value;
      processedGumroadSales.delete(first);
    }

    return res.status(200).json({
      success: true,
      provider: 'gumroad',
      saleId,
      planTier,
      customerEmail,
      amountUSD,
      subscriptionActivated: true,
      timestamp,
    });
  } catch (err) {
    console.error('[Gumroad Webhook Error]:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
