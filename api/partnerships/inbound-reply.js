/**
 * Vercel Serverless Function — /api/partnerships/inbound-reply
 * JurisTech Solutions | Inbound Partnership Response Tracker & Auto-Responder
 * Listens for replies from strategic partners (including Mediacube / MC Pay)
 */

import { processEmailDispatch } from '../send-email.js';

export const config = {
  runtime: 'nodejs',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'JurisTech Partnership Response Tracker',
      status: 'LISTENING',
      monitoredPartners: ['partners@mcpay.io', 'bd@mediacube.co', 'support@mcpay.io'],
      trackingChannel: 'founder@juristech.solutions',
    });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const sender = (payload.from || payload.sender || payload.email || '').toLowerCase().trim();
    const subject = payload.subject || '';
    const textBody = payload.text || payload.body || '';

    console.log(`[Partnership Inbound] Received response from: ${sender} | Subject: "${subject}"`);

    const isMediacube = sender.includes('mcpay.io') || sender.includes('mediacube.co') || subject.includes('MC Pay') || subject.includes('Mediacube');

    let intent = 'GENERAL_INQUIRY';
    const lowerBody = textBody.toLowerCase();
    if (lowerBody.includes('call') || lowerBody.includes('meeting') || lowerBody.includes('zoom') || lowerBody.includes('schedule') || lowerBody.includes('available')) {
      intent = 'MEETING_REQUEST';
    } else if (lowerBody.includes('interested') || lowerBody.includes('proposal') || lowerBody.includes('tier') || lowerBody.includes('sponsor')) {
      intent = 'POSITIVE_INTEREST';
    } else if (lowerBody.includes('not interested') || lowerBody.includes('unsubscribe') || lowerBody.includes('decline')) {
      intent = 'DECLINED';
    }

    // Update Supabase if available
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && isMediacube) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/crm_leads?contact_email=ilike.*mcpay*`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            status: intent === 'MEETING_REQUEST' || intent === 'POSITIVE_INTEREST' ? 'ENGAGED' : 'REPLIED',
            last_activity: `Inbound reply: ${intent} (${new Date().toISOString()})`,
          }),
        });
      } catch (err) {
        console.warn('[Partnership Inbound] DB update error:', err.message);
      }
    }

    // Forward notification to Dr. Mohammad Mustafa
    const alertSubject = `🔔 [ACTION REQUIRED] Partnership Reply Received from ${sender} (${intent})`;
    const alertBody = `Strategic Partnership Reply Detected:\n\nSender: ${sender}\nIntent: ${intent}\nSubject: ${subject}\n\nMessage:\n${textBody}\n\n---\nJurisTech Sovereign Partnership Tracker`;

    await processEmailDispatch(
      'founder@juristech.solutions',
      alertSubject,
      alertBody,
      null,
      'founder@juristech.solutions',
      true
    );

    return res.status(200).json({
      success: true,
      sender,
      intent,
      isMediacube,
      actionTaken: 'ALERT_DISPATCHED_TO_FOUNDER',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Partnership Inbound Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
