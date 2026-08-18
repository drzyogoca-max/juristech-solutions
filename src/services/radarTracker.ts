import { detectVisitorJurisdiction } from '../lib/jurisdiction';
import { supabase } from '../lib/supabaseClient';

export interface VisitorAnalyticsPayload {
  ip: string;
  country: string;
  city: string;
  device: string;
  path: string;
  dwellTimeSeconds: number;
  interactionScore: number;
  timestamp: string;
}

export async function trackVisitorRadar(body: { path: string; dwellTimeSeconds?: number; interactionScore?: number }) {
  try {
    const jur = await detectVisitorJurisdiction();
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown Device';

    const analyticsData: VisitorAnalyticsPayload = {
      ip: '127.0.0.1',
      country: jur.countryCode || 'GLOBAL',
      city: jur.countryName || 'UNKNOWN',
      device: userAgent,
      path: body.path || '/',
      dwellTimeSeconds: Number(body.dwellTimeSeconds) || 5,
      interactionScore: Number(body.interactionScore) || 1,
      timestamp: new Date().toISOString(),
    };

    console.log('[RADAR ACTIVE ENGINE] Real-time Visitor Captured:', JSON.stringify(analyticsData));

    try {
      await supabase.from('chat_messages').insert({
        content: `[RADAR] Visitor captured from ${analyticsData.country} on path ${analyticsData.path}`,
        role: 'system',
      });
    } catch (dbErr) {}

    return {
      success: true,
      status: 'CAPTURED',
      clientContext: {
        country: analyticsData.country,
        city: analyticsData.city,
        recommendedJurisdiction: analyticsData.country,
      },
    };
  } catch (error) {
    console.error('[RADAR ERROR] Engine Tracking Exception:', error);
    return {
      success: false,
      clientContext: {
        country: 'GLOBAL',
        city: 'UNKNOWN',
        recommendedJurisdiction: 'GLOBAL',
      },
    };
  }
}
