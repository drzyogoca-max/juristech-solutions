/**
 * Vercel Serverless Function — /api/cron/daily-audit
 * JurisTech Solutions | Server-side Platform Health & Sales/Revenue Ground-Truth Auditor
 */

export const config = {
  runtime: 'nodejs',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-cron-secret',
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers['authorization'] || '';
  const cronSecret = req.headers['x-cron-secret'] || req.query?.secret || '';
  const expectedSecret = process.env.CRON_SECRET || 'jt_live_cron_9f8e7d6c5b4a3210fe_2026';

  if (!expectedSecret || (authHeader !== `Bearer ${expectedSecret}` && cronSecret !== expectedSecret)) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid CRON_SECRET token' });
  }

  try {
    const timestamp = new Date().toISOString();
    console.log(`[Cron Daily Audit] Executing database ground-truth sales audit at: ${timestamp}`);

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

    // Date boundaries (UTC)
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)).toISOString();
    const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStart = new Date(Date.UTC(yesterdayDate.getUTCFullYear(), yesterdayDate.getUTCMonth(), yesterdayDate.getUTCDate(), 0, 0, 0)).toISOString();
    const yesterdayEnd = todayStart;

    let auditData = {
      timestamp,
      dateToday: todayStart.split('T')[0],
      dateYesterday: yesterdayStart.split('T')[0],
      supabaseConnected: Boolean(SUPABASE_URL && SUPABASE_KEY),
      sales: {
        today: { count: 0, revenueUSD: 0, currencyBreakdown: {}, records: [] },
        yesterday: { count: 0, revenueUSD: 0, currencyBreakdown: {}, records: [] },
        totalActiveSubscriptions: 0,
        recentTransactions: [],
      },
      emails: {
        dispatchedToday: 0,
        dispatchedYesterday: 0,
      },
    };

    if (SUPABASE_URL && SUPABASE_KEY) {
      const headers = {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      };

      // 1. Audit Subscriptions
      try {
        const subRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?select=*&order=created_at.desc&limit=50`, { headers });
        if (subRes.ok) {
          const subs = await subRes.json();
          auditData.sales.totalActiveSubscriptions = subs.filter(s => s.status === 'active' || s.status === 'trialing').length;

          subs.forEach((sub) => {
            const created = sub.created_at || '';
            const amount = parseFloat(sub.amount || sub.price || 0) || 0;
            const currency = sub.currency || 'USD';

            if (created >= todayStart) {
              auditData.sales.today.count += 1;
              auditData.sales.today.revenueUSD += amount;
              auditData.sales.today.currencyBreakdown[currency] = (auditData.sales.today.currencyBreakdown[currency] || 0) + amount;
              auditData.sales.today.records.push({ id: sub.id, plan: sub.plan_id || sub.price_id, amount, currency, created_at: created });
            } else if (created >= yesterdayStart && created < yesterdayEnd) {
              auditData.sales.yesterday.count += 1;
              auditData.sales.yesterday.revenueUSD += amount;
              auditData.sales.yesterday.currencyBreakdown[currency] = (auditData.sales.yesterday.currencyBreakdown[currency] || 0) + amount;
              auditData.sales.yesterday.records.push({ id: sub.id, plan: sub.plan_id || sub.price_id, amount, currency, created_at: created });
            }
          });
        }
      } catch (err) {
        console.warn('[Audit Subscriptions Error]:', err.message);
      }

      // 2. Audit Processed Webhook Payment Events
      try {
        const payRes = await fetch(`${SUPABASE_URL}/rest/v1/processed_webhook_events?select=*&order=processed_at.desc&limit=50`, { headers });
        if (payRes.ok) {
          const events = await payRes.json();
          auditData.sales.recentTransactions = events.slice(0, 10).map(e => ({
            event_id: e.event_id,
            provider: e.provider,
            processed_at: e.processed_at,
          }));
        }
      } catch (err) {
        console.warn('[Audit Payment Webhooks Error]:', err.message);
      }

      // 3. Audit Email Dispatches (Today & Yesterday)
      try {
        const emailRes = await fetch(`${SUPABASE_URL}/rest/v1/email_dispatch_log?select=id,dispatched_at&dispatched_at=gte.${yesterdayStart}&order=dispatched_at.desc`, { headers });
        if (emailRes.ok) {
          const emails = await emailRes.json();
          auditData.emails.dispatchedToday = emails.filter(e => e.dispatched_at >= todayStart).length;
          auditData.emails.dispatchedYesterday = emails.filter(e => e.dispatched_at >= yesterdayStart && e.dispatched_at < yesterdayEnd).length;
        }
      } catch (err) {
        console.warn('[Audit Email Dispatch Error]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      service: 'JurisTech Autonomous Ground-Truth Auditor',
      status: 'SYSTEMS_OPERATIONAL',
      audit: auditData,
    });
  } catch (err) {
    console.error('[Cron Daily Audit Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
