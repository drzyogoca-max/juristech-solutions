/**
 * JurisTech Solutions — Visit Tracker API
 * /api/track-visit
 *
 * Called from the frontend on every page load to record visitor.
 * Captures: page path, session ID, device type, geo from Vercel headers.
 * Does NOT store raw IP addresses (only hashed).
 */

export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Simple hash function for IP anonymization
async function hashIp(ip) {
  if (!ip) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'jt-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.juristech.solutions',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, pagePath, referrer, deviceType, browser, os, screenRes, isAdmin, utmSource, utmMedium, utmCampaign } = body;

    if (!sessionId || !pagePath) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Admin visits should not pollute analytics
    if (isAdmin === true) {
      return new Response(JSON.stringify({ ok: true, skipped: 'admin' }), { status: 200 });
    }

    // Get geo from Vercel Edge headers (real GeoIP, free)
    const country = req.headers.get('x-vercel-ip-country') || body.country || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || body.city || '';
    const region = req.headers.get('x-vercel-ip-country-region') || '';
    const rawIp = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || '';
    const ipHash = await hashIp(rawIp);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ ok: true, warn: 'Supabase not configured' }), { status: 200 });
    }

    const payload = {
      visitor_id: String(sessionId).slice(0, 255),
      page_path: String(pagePath || '/').slice(0, 255),
      country: decodeURIComponent(country || 'Unknown').slice(0, 255),
      country_code: (req.headers.get('x-vercel-ip-country') || '').slice(0, 10) || null,
      city: decodeURIComponent(city || '').slice(0, 255) || null,
      region: String(region || '').slice(0, 255) || null,
      device_type: String(deviceType || 'Desktop').slice(0, 100),
      browser: String(browser || '').slice(0, 100) || null,
      os: String(os || '').slice(0, 100) || null,
      traffic_source: referrer ? 'Referral' : 'Direct',
      referrer_domain: referrer ? String(referrer).slice(0, 255) : null,
      utm_source: utmSource ? String(utmSource).slice(0, 255) : null,
      utm_campaign: utmCampaign ? String(utmCampaign).slice(0, 255) : null,
    };

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/visitor_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error('[track-visit] Insert failed:', errText);
      return new Response(JSON.stringify({ ok: false, error: 'DB write failed', detail: errText }), { status: 200 }); // 200 to not break frontend
    }

    return new Response(JSON.stringify({ ok: true, country, city }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    console.error('[track-visit] Error:', err);
    return new Response(JSON.stringify({ ok: false }), { status: 200 }); // Always 200 to not break the site
  }
}
