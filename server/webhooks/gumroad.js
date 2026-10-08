/**
 * server/webhooks/gumroad.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Gumroad Sovereign Webhook / Ping Handler
 * Automatically processes Gumroad sales and activates paid subscriptions.
 * Zero company registration required (Gumroad MoR architecture).
 */

import crypto from 'crypto';
import { processEmailDispatch } from '../send-email.js';

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

    // Dispatch Official Confirmation & Receipt to Customer
    try {
      const emailSubject = `[JurisTech Solutions] Official Receipt & License Activation (${planTier.toUpperCase()})`;
      const emailText = `Your Gumroad payment of $${amountUSD} USD for the ${planTier.toUpperCase()} Plan has been verified and your subscription is active. Sale ID: ${saleId}.`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 25px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #D4AF37;">
          <h2 style="color: #D4AF37; margin-top: 0;">JurisTech Solutions ⚖️</h2>
          <h3 style="color: #10B981;">Official Payment Receipt & Subscription Activation</h3>
          <p>Thank you for subscribing to <strong>JurisTech Solutions</strong> via Gumroad.</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 15px 0;" />
          <p><strong>Plan:</strong> ${planTier.toUpperCase()}</p>
          <p><strong>Amount:</strong> $${amountUSD} USD</p>
          <p><strong>Sale Reference ID:</strong> ${saleId}</p>
          <p><strong>Account:</strong> ${customerEmail}</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 15px 0;" />
          <p style="font-size: 13px; color: #94a3b8;">
            Access your sovereign legal tools: <a href="https://www.juristech.solutions/dashboard" style="color: #D4AF37;">Dashboard</a><br/>
            Contact: founder@juristech.solutions
          </p>
        </div>
      `;
      await processEmailDispatch(customerEmail, emailSubject, emailText, emailHtml, 'founder@juristech.solutions', true);
      console.log(`[Gumroad Receipt Sent] Dispatched official confirmation to ${customerEmail}`);
    } catch (emailErr) {
      console.warn('[Gumroad Receipt Warning] Could not dispatch confirmation email:', emailErr.message);
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
