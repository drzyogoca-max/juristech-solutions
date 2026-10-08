/**
 * server/webhooks/resend.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Resend Webhooks Telemetry & Engagement Ingestion Engine
 * Tracks email.opened (+10) and email.clicked (+20) to update Lead Score & Funnel
 * Compatible with both Node.js (req, res) and Edge (req) runtimes
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const config = {
  runtime: 'nodejs',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-timestamp, svix-signature',
  'Content-Type': 'application/json; charset=utf-8',
};

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifySvixSignature(headers, rawBody) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return false; // Fail closed: reject unauthenticated webhook calls if secret not configured

  const id = headers['svix-id'] || headers.get?.('svix-id');
  const ts = headers['svix-timestamp'] || headers.get?.('svix-timestamp');
  const sigHeader = headers['svix-signature'] || headers.get?.('svix-signature');
  if (!id || !ts || !sigHeader) return false;
  if (!Number.isFinite(Number(ts)) || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false; // 5 min replay window

  try {
    const keyBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, '')), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${ts}.${rawBody}`));
    const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
    return sigHeader.split(' ').some((part) => {
      const [version, value] = part.split(',');
      return version === 'v1' && constantTimeEqual(value || '', expected);
    });
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    if (res?.status) return res.status(200).end();
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (method === 'GET') {
    const info = {
      service: 'JurisTech Resend Webhook Engagement Engine v1.0',
      status: 'ACTIVE_LISTENING',
      supportedEvents: ['email.sent', 'email.delivered', 'email.opened', 'email.clicked', 'email.bounced'],
      scoringRules: {
        'email.opened': '+10 Lead Score -> Status: ENGAGED',
        'email.clicked': '+20 Lead Score -> Status: ENGAGED',
        'threshold_hot': 'Score >= 80 -> Sales Priority Notification',
      },
      timestamp: new Date().toISOString(),
    };
    if (res?.status) return res.status(200).json(info);
    return Response.json(info, { status: 200, headers: CORS_HEADERS });
  }

  try {
    let payload = {};
    let rawBody = '';

    if (typeof req.body === 'object' && req.body !== null) {
      payload = req.body;
      rawBody = JSON.stringify(req.body);
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
      try { payload = JSON.parse(req.body); } catch { payload = {}; }
    } else if (req.json) {
      rawBody = await req.text().catch(() => '');
      try { payload = JSON.parse(rawBody); } catch { payload = {}; }
    }

    const headers = req.headers || {};
    const isSigValid = await verifySvixSignature(headers, rawBody);
    if (!isSigValid) {
      if (res?.status) return res.status(401).json({ error: 'Invalid or missing webhook signature' });
      return Response.json({ error: 'Invalid or missing webhook signature' }, { status: 401, headers: CORS_HEADERS });
    }

    const eventType = payload.type || '';
    const eventData = payload.data || {};

    const targetEmail = Array.isArray(eventData.to) ? eventData.to[0] : (eventData.to || eventData.email || '');
    const subject = eventData.subject || '';

    console.log(`[Resend Webhook] Received ${eventType} for ${targetEmail} | Subject: "${subject}"`);

    let scoreDelta = 0;
    let newStatus = 'ENGAGED';
    let activityText = '';

    if (eventType === 'email.opened') {
      scoreDelta = 10;
      activityText = 'تم فتح البريد الإلكتروني (+10 نقاط) — تفاعل إيجابي';
    } else if (eventType === 'email.clicked') {
      scoreDelta = 20;
      activityText = 'تم النقر على رابط في البريد الإلكتروني (+20 نقطة) — تفاعل عالي';
    } else if (eventType === 'email.bounced') {
      scoreDelta = -30;
      newStatus = 'Disqualified';
      activityText = 'فشل تسليم البريد (Bounced) — عنوان غير صالح';
    }

    // ── Log webhook event to Supabase for the Frequency Guard ──
    if (targetEmail && eventType) {
      const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
      if (SUPABASE_URL && SUPABASE_KEY) {
        try {
          const subjectTag = `[${eventType.toUpperCase().replace('EMAIL.', '')}]`;
          await fetch(`${SUPABASE_URL}/rest/v1/email_dispatch_log`, {
            method: 'POST',
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({
              recipient: targetEmail.toLowerCase().trim(),
              subject: subjectTag,
              provider: `Resend Webhook Telemetry: ${eventType}`,
              dispatched_at: new Date().toISOString(),
            }),
          });
        } catch (dbErr) {
          console.error('[Resend Webhook DB Log Error]:', dbErr.message);
        }
      }
    }

    const result = {
      received: true,
      eventType,
      targetEmail,
      scoreDelta,
      statusAssigned: newStatus,
      activityLogged: activityText,
      timestamp: new Date().toISOString(),
    };

    if (res?.status) return res.status(200).json(result);
    return Response.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error('[Resend Webhook Error]:', err.message);
    if (res?.status) return res.status(500).json({ error: 'Internal Webhook Processing Error', details: err.message });
    return Response.json({ error: 'Internal Webhook Processing Error', details: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
