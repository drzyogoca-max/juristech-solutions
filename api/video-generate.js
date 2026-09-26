/**
 * JurisTech Solutions — Free AI Video Generator
 * /api/video-generate
 *
 * Pipeline (100% Free Tier):
 *   1. ElevenLabs TTS → Arabic/English voiceover (free: 10,000 chars/month)
 *   2. Shotstack API  → Professional slide video (free: 50 renders/month)
 *   3. YouTube Upload → Resumable upload with real MP4
 *
 * Environment Variables:
 *   ELEVENLABS_API_KEY  — ElevenLabs API key (free at elevenlabs.io)
 *   SHOTSTACK_API_KEY   — Shotstack API key (free at shotstack.io)
 *   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 */

export const config = { runtime: 'nodejs', maxDuration: 300 };

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';
const SHOTSTACK_BASE  = 'https://api.shotstack.io/edit/v1';

// ElevenLabs free Arabic voice ID
const VOICE_IDS = {
  arabic:  'pqHfZKP75CvOlQylNhV4', // Arabic - Bill (free)
  english: 'EXAVITQu4vr4xnSDxMaL',  // English - Bella (free)
};

// ─── ElevenLabs TTS ────────────────────────────────────────────────────────
async function generateVoiceover(text, language = 'ar', apiKey) {
  if (!apiKey) return null;
  const voiceId = VOICE_IDS[language] || VOICE_IDS.arabic;
  const res = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text: text.substring(0, 2500),
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[ElevenLabs] Error:', err);
    return null;
  }
  const audioBuffer = await res.arrayBuffer();
  // Return as base64 data URL
  const base64 = Buffer.from(audioBuffer).toString('base64');
  return `data:audio/mpeg;base64,${base64}`;
}

// ─── Shotstack Video Generation ────────────────────────────────────────────
async function createShotstackVideo({ titleAr, titleEn, descriptionAr, descriptionEn, audioUrl, isShort, apiKey }) {
  if (!apiKey) return null;

  const width  = isShort ? 720  : 1920;
  const height = isShort ? 1280 : 1080;
  const duration = isShort ? 60 : 270;

  // Build slides
  const clips = [
    // Slide 1: Logo + Brand (0-8s)
    {
      asset: { type: 'html', html: `<div style="width:${width}px;height:200px;background:linear-gradient(135deg,#D4AF37,#b8962e);display:flex;align-items:center;justify-content:center;font-family:Arial;font-size:52px;font-weight:900;color:#020B1A;letter-spacing:2px">JurisTech Solutions</div>`, width, height: 200, position: 'center' },
      start: 0, length: 8, position: 'center',
    },
    // Background: deep navy throughout
    {
      asset: { type: 'html', html: `<div style="width:${width}px;height:${height}px;background:#020B1A"></div>`, width, height, position: 'center' },
      start: 0, length: duration, position: 'center',
    },
    // Arabic title (8-20s)
    {
      asset: { type: 'html', html: `<div style="width:${width}px;padding:40px;font-family:Arial;font-size:${isShort?48:64}px;font-weight:700;color:#D4AF37;text-align:right;direction:rtl;line-height:1.4">${titleAr}</div>`, width, height: 200, position: 'center' },
      start: 8, length: 12, position: 'center',
      transition: { in: 'fade', out: 'fade' },
    },
    // English title (20-32s)
    {
      asset: { type: 'html', html: `<div style="width:${width}px;padding:40px;font-family:Arial;font-size:${isShort?42:56}px;font-weight:700;color:#10B981;text-align:center;line-height:1.4">${titleEn}</div>`, width, height: 200, position: 'center' },
      start: 20, length: 12, position: 'center',
      transition: { in: 'fade', out: 'fade' },
    },
    // CTA (last 10s)
    {
      asset: { type: 'html', html: `<div style="width:${width}px;padding:40px;font-family:Arial;text-align:center;color:#fff"><div style="font-size:${isShort?36:48}px;color:#D4AF37;font-weight:900">juristech.solutions</div><div style="font-size:${isShort?28:36}px;color:#10B981;margin-top:20px">AI Legal Intelligence Platform</div><div style="font-size:${isShort?22:28}px;color:#aaa;margin-top:16px">founder@juristech.solutions</div></div>`, width, height: 300, position: 'center' },
      start: duration - 10, length: 10, position: 'center',
      transition: { in: 'fade' },
    },
  ];

  const timeline = { tracks: [{ clips }] };
  if (audioUrl) {
    timeline.soundtrack = { src: audioUrl, effect: 'fadeInFadeOut', volume: 1 };
  }

  const payload = {
    timeline,
    output: {
      format: 'mp4',
      resolution: isShort ? 'mobile' : 'hd',
      aspectRatio: isShort ? '9:16' : '16:9',
      fps: 30,
      quality: 'high',
    },
    callback: 'https://www.juristech.solutions/api/heygen-webhook',
  };

  const res = await fetch(`${SHOTSTACK_BASE}/render`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.response?.id) {
    console.error('[Shotstack] Error:', JSON.stringify(data));
    return null;
  }
  return { render_id: data.response.id, status: data.response.status };
}

// ─── Get YouTube Access Token ──────────────────────────────────────────────
async function getYouTubeAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.YOUTUBE_CLIENT_ID || '',
      client_secret: process.env.YOUTUBE_CLIENT_SECRET || '',
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN || '',
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  return data.access_token || null;
}

// ─── Main Handler ──────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || '';
  const SHOTSTACK_KEY  = process.env.SHOTSTACK_API_KEY  || '';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { titleAr, titleEn, descriptionAr, descriptionEn, scriptAr, scriptEn, isShort = true } = body;

    // Step 1: Generate Arabic voiceover
    console.log('[VideoGen] Step 1: Generating voiceover...');
    let audioUrl = null;
    if (ELEVENLABS_KEY && scriptAr) {
      audioUrl = await generateVoiceover(scriptAr, 'ar', ELEVENLABS_KEY);
      console.log('[VideoGen] Voiceover generated:', audioUrl ? 'success' : 'failed');
    }

    // Step 2: Create video via Shotstack
    console.log('[VideoGen] Step 2: Submitting to Shotstack...');
    let renderResult = null;
    if (SHOTSTACK_KEY) {
      renderResult = await createShotstackVideo({
        titleAr, titleEn, descriptionAr, descriptionEn, audioUrl, isShort, apiKey: SHOTSTACK_KEY
      });
    }

    return res.status(200).json({
      success: true,
      voiceoverGenerated: Boolean(audioUrl),
      shotstackRender: renderResult,
      services: {
        elevenlabs: Boolean(ELEVENLABS_KEY),
        shotstack:  Boolean(SHOTSTACK_KEY),
        youtube:    Boolean(process.env.YOUTUBE_REFRESH_TOKEN),
      },
      message: renderResult
        ? `Video rendering started (render_id: ${renderResult.render_id}). Will auto-upload to YouTube via webhook.`
        : 'Add ELEVENLABS_API_KEY and SHOTSTACK_API_KEY to Vercel to enable free video generation.',
    });
  } catch (err) {
    console.error('[VideoGen] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
