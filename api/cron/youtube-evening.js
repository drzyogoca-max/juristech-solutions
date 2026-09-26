/**
 * Vercel Serverless Cron — /api/cron/youtube-evening
 * JurisTech Solutions | Autonomous Evening YouTube Video Publisher
 * Schedule: 0 18 * * * (18:00 UTC Daily)
 * Format: Full HD 1080p 16:9 | Duration: 4-5 minutes
 * Languages: Arabic + English (Alternating sections)
 * Copyright-Safe: AI-generated avatars, ElevenLabs TTS, YouTube Audio Library
 */

export const config = { runtime: 'nodejs' };

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || '';
const SUPABASE_URL   = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WEBHOOK_URL    = 'https://www.juristech.solutions/api/heygen-webhook';

const TOPICS = [
  'Full Platform Demo (Dashboard, Contracts, Risk, Templates, Vault, etc.)',
  'AI Contract Analysis deep dive',
  'Legal compliance walkthrough',
  'Company formation step-by-step',
  'Enterprise security and encryption',
  'Pricing and ROI explanation',
  'Case studies (fictional/composite)',
  'Weekly legal tech news'
];

const HASHTAGS_AR = '#عقود #ذكاء_اصطناعي #قانون_الأعمال #تأسيس_شركات #JurisTech #تحليل_عقود #مخاطر_قانونية #تقنية_قانونية';
const HASHTAGS_EN = '#LegalTech #AIContracts #ContractLaw #BusinessLaw #JurisTech #ContractAnalysis #LegalAI #Compliance #EnterpriseSoftware';

async function generateVideoScript(topic, apiKey) {
  const prompt = `You are the AI Director of JurisTech Solutions YouTube channel.
Generate a comprehensive 4-5 minute YouTube video script.
Target Audience: C-Suite professionals (CEOs, CFOs, Legal Counsels, Founders).
Topic: ${topic}

The video must be bilingual, alternating between Arabic and English sections smoothly.

Format your response as JSON:
{
  "titleAr": "Arabic title (max 80 chars)",
  "titleEn": "English title (max 80 chars)",
  "descriptionAr": "Arabic description with CTA (500 chars)",
  "descriptionEn": "English description with CTA (500 chars)",
  "scriptBilingual": "Full bilingual voiceover script (4.5 minutes)",
  "storyboard": [
    {"time": "0:00-0:30", "visual": "Opening scene description", "text": "Text overlay"},
    {"time": "0:30-1:00", "visual": "Scene description", "text": "Key point"},
    {"time": "1:00-2:00", "visual": "Scene description", "text": "Key point"},
    {"time": "2:00-3:00", "visual": "Scene description", "text": "Key point"},
    {"time": "3:00-4:00", "visual": "Scene description", "text": "Key point"},
    {"time": "4:00-4:30", "visual": "Closing with contact info", "text": "Visit juristech.solutions"}
  ],
  "tags": ["tag1", "tag2", ...15 tags]
}

IMPORTANT:
- Use AI avatar as presenter (no real people)
- Include CTA to juristech.solutions
- Contact: founder@juristech.solutions | +201126674337
- No copyrighted content references`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    }),
  });
  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

async function publishToYouTube(videoData, accessToken) {
  const metadata = {
    snippet: {
      title: `${videoData.titleEn} | ${videoData.titleAr}`,
      description: `${videoData.descriptionEn}\n\n${videoData.descriptionAr}\n\n${HASHTAGS_EN}\n${HASHTAGS_AR}\n\nJurisTech Solutions | https://www.juristech.solutions\nEmail: founder@juristech.solutions | WhatsApp: +201126674337`,
      tags: [...(videoData.tags || []), 'JurisTech', 'Legal Tech', 'AI', 'Contracts', 'Bilingual'],
      categoryId: '27', // Education
      defaultLanguage: 'en',
      defaultAudioLanguage: 'en',
    },
    status: {
      privacyStatus: 'public',
      selfDeclaredMadeForKids: false,
      madeForKids: false,
    },
  };
  return { scheduled: true, metadata, message: 'Video metadata prepared for upload' };
}

async function getAccessToken() {
  const directToken = process.env.YOUTUBE_ACCESS_TOKEN;
  if (directToken) return directToken;

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error('[YouTube Evening Cron] Token refresh failed:', err);
    return null;
  }
}

async function submitToHeyGen(script, language, format, apiKey) {
  if (!apiKey) return null;
  const dimension = format === 'short' ? { width: 720, height: 1280 } : { width: 1920, height: 1080 };
  const voiceId = language === 'ar' ? '1bd001e7e50f421d891986aad5158bc8' : '2d5b0e6cf36f460aa7fc47e3eee4ba54';
  const payload = {
    video_inputs: [{
      character: { type: 'avatar', avatar_id: 'Wayne_20240711', avatar_style: 'normal' },
      voice: { type: 'text', input_text: script.substring(0, 1500), voice_id: voiceId, speed: language === 'ar' ? 0.95 : 1.0 },
      background: { type: 'color', value: '#020B1A' },
    }],
    dimension,
    test: false,
    caption: true,
    callback_url: WEBHOOK_URL,
  };
  const res = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`HeyGen error: ${JSON.stringify(data.error || data)}`);
  return data.data?.video_id || data.video_id;
}

async function saveToQueue(item) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/youtube_queue`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=representation',
    },
    body: JSON.stringify(item),
  });
  const rows = await res.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const cronSecret = req.headers['x-cron-secret'] || req.query?.secret;
  const CRON_SECRET = process.env.CRON_SECRET || '';
  if (CRON_SECRET && cronSecret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
  const YT_ACCESS_TOKEN = await getAccessToken();

  try {
    const today = new Date();
    const dayIndex = today.getDay(); // 0=Sun, 6=Sat
    const topic = TOPICS[dayIndex % TOPICS.length];

    console.log(`[YouTube Evening Cron] ${today.toISOString()} | Topic: ${topic}`);

    let script = null;
    if (OPENAI_KEY) {
      script = await generateVideoScript(topic, OPENAI_KEY);
    } else {
      script = {
        titleAr: `منصة JurisTech - ${topic}`,
        titleEn: `JurisTech Platform - ${topic}`,
        descriptionAr: `اكتشف كيف تغير JurisTech Solutions مستقبل التكنولوجيا القانونية. تفضل بزيارة www.juristech.solutions أو تواصل معنا على founder@juristech.solutions`,
        descriptionEn: `Discover how JurisTech Solutions is changing the future of legal tech. Visit www.juristech.solutions or contact founder@juristech.solutions`,
        scriptBilingual: `Welcome to JurisTech Solutions. أهلاً بكم في جيريس تك للحلول. Today we will explore ${topic}. اليوم سنستكشف ${topic}. Visit juristech.solutions today.`,
        storyboard: [
          { time: '0:00-0:30', visual: 'Professional corporate intro with JurisTech branding', text: 'JurisTech Solutions' },
          { time: '0:30-1:30', visual: 'High-level dashboard overview for C-Suite', text: 'Executive Dashboard' },
          { time: '1:30-2:30', visual: 'Deep dive into feature set', text: 'Advanced AI Features' },
          { time: '2:30-3:30', visual: 'Compliance and Security showcase', text: 'Bank-Grade Security' },
          { time: '3:30-4:15', visual: 'ROI and Value Proposition', text: 'Maximize Efficiency' },
          { time: '4:15-4:30', visual: 'Closing with contact details for enterprise sales', text: 'juristech.solutions' },
        ],
        tags: ['JurisTech', 'LegalTech', 'AI', 'Contracts', 'Law', 'Business', 'Arabic', 'Enterprise', 'C-Suite', 'Bilingual'],
      };
    }

    // ── Submit to HeyGen for real AI video generation ──────────────────
    let heygenVideoId = null;
    let heygenStatus = 'not_configured';
    if (HEYGEN_API_KEY && script) {
      try {
        const scriptText = script.scriptBilingual || topic;
        heygenVideoId = await submitToHeyGen(scriptText, 'en', 'landscape', HEYGEN_API_KEY);
        heygenStatus = 'generating';
        console.log(`[YouTube Evening] HeyGen video queued: ${heygenVideoId}`);
      } catch (heyErr) {
        console.error('[YouTube Evening] HeyGen error:', heyErr.message);
        heygenStatus = 'heygen_error';
      }
    }

    // ── Save to Supabase queue ─────────────────────────────────────────
    const queueItem = await saveToQueue({
      slot: 'EVENING', scheduled_for: today.toISOString(),
      status: heygenVideoId ? 'generating' : 'pending',
      heygen_video_id: heygenVideoId,
      title_ar: script?.titleAr || topic, title_en: script?.titleEn || topic,
      description_ar: script?.descriptionAr || '', description_en: script?.descriptionEn || '',
      tags: JSON.stringify(script?.tags || []),
      topic_ar: topic, topic_en: topic,
      format: 'landscape', duration_seconds: 270,
    });

    const result = {
      success: true, slot: 'EVENING',
      scheduledDate: today.toISOString().split('T')[0], publishTime: '18:00 UTC',
      format: 'landscape', durationSeconds: 270,
      topic, titleAr: script?.titleAr, titleEn: script?.titleEn,
      scriptGenerated: Boolean(script),
      heygenVideoId, heygenStatus, queueItemId: queueItem?.id,
      webhookUrl: WEBHOOK_URL,
      avatarType: 'AI-Generated Avatar (Wayne_20240711) — Copyright Safe',
      message: heygenVideoId
        ? 'Video generation started — will auto-upload to YouTube when ready'
        : 'Script generated. Add HEYGEN_API_KEY to Vercel to enable video.',
    };
    console.log('[YouTube Evening Cron] Completed:', JSON.stringify(result));
    return res.status(200).json(result);
  } catch (err) {
    console.error('[YouTube Evening Cron] Error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}
