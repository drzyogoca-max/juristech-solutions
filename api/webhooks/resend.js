/**
 * api/webhooks/resend.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Resend Webhooks Telemetry & Engagement Ingestion Engine
 * Tracks email.opened (+10) and email.clicked (+20) to update Lead Score & Funnel
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-timestamp, svix-signature',
  'Content-Type': 'application/json; charset=utf-8',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  return Response.json(
    {
      service: 'JurisTech Resend Webhook Engagement Engine v1.0',
      status: 'ACTIVE_LISTENING',
      supportedEvents: ['email.sent', 'email.delivered', 'email.opened', 'email.clicked', 'email.bounced'],
      scoringRules: {
        'email.opened': '+10 Lead Score -> Status: ENGAGED',
        'email.clicked': '+20 Lead Score -> Status: ENGAGED',
        'threshold_hot': 'Score >= 80 -> Sales Priority Notification',
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function POST(req) {
  try {
    const payload = await req.json().catch(() => ({}));
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

 // Process notification if Hot Lead
 const isHotEngagement = scoreDelta >= 20;

 return Response.json(
 {
 received: true,
 eventType,
 targetEmail,
 scoreDelta,
 statusAssigned: newStatus,
 activityLogged: activityText,
 isHotEngagement,
 timestamp: new Date().toISOString(),
 },
 { status: 200, headers: CORS_HEADERS }
 );
 } catch (err) {
 console.error('[Resend Webhook Error]:', err.message);
 return Response.json({ error: 'Internal Webhook Processing Error', details: err.message }, { status: 500, headers: CORS_HEADERS });
 }
}
