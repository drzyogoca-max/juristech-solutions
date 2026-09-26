/**
 * Vercel Serverless Cron — /api/cron/youtube-morning
 * JurisTech Solutions | Autonomous Morning YouTube Short Publisher
 * Schedule: 0 9 * * * (09:00 UTC Daily)
 * Format: YouTube Shorts (9:16 Mobile HD) | Duration: 45-55 seconds
 * 
 * Engine: High-Impact Contract Dilemma (Two-Character Dialogue)
 * Alternating Schedule:
 *   - Odd Days: Arabic Gulf Short (ثغرة العقود الكارثية في السعودية والإمارات)
 *   - Even Days: English Global Short (The $500k Contract Trap: How AI Saves The Deal)
 */

export const config = { runtime: 'nodejs', maxDuration: 300 };

const W = 720, H = 1280; // 9:16 Shorts
const WEBHOOK_URL = 'https://www.juristech.solutions/api/heygen-webhook';

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return { status: res.status, ok: res.ok, data: JSON.parse(text), text }; }
  catch(e) { return { status: res.status, ok: res.ok, data: null, text }; }
}

async function ingestAudioToShotstack(audioBuf, apiKey) {
  const upRes = await fetchJSON('https://api.shotstack.io/ingest/v1/upload', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
  });
  if (!upRes.ok || !upRes.data?.data?.attributes?.url) {
    throw new Error('Shotstack ingest upload URL failed: ' + upRes.text);
  }

  const signedUrl = upRes.data.data.attributes.url;
  const sourceId  = upRes.data.data.id;

  const putRes = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'x-amz-acl': 'public-read',
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuf.length.toString()
    },
    body: audioBuf
  });

  if (!putRes.ok) throw new Error('S3 PUT failed: ' + putRes.status);

  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const sRes = await fetchJSON(`https://api.shotstack.io/ingest/v1/sources/${sourceId}`, {
      headers: { 'x-api-key': apiKey }
    });
    if (sRes.data?.data?.attributes?.status === 'ready') {
      return sRes.data.data.attributes.source;
    }
  }
  throw new Error('Timed out waiting for audio ingest');
}

async function saveToQueue(item) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const res = await fetch(`${url}/rest/v1/youtube_queue`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(item)
  });
  const rows = await res.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

async function genElevenVoice(voiceId, text, apiKey) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.55, similarity_boost: 0.85 }
    })
  });
  if (!res.ok) throw new Error('ElevenLabs failed: ' + await res.text());
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function shortClip(content, s, len, trans = { in: 'fade', out: 'fade' }) {
  return {
    asset: { type: 'html', html: content, width: W, height: H },
    start: s, length: len, position: 'center',
    ...(trans ? { transition: trans } : {})
  };
}

// ── English Shorts Edition (9:16) ─────────────────────────────────────────────
async function buildEnglishShorts(elevenKey) {
  const VOICE_FOUNDER = 'nPczCjzI2devNBz1zQrb';
  const VOICE_ADVISOR = 'pqHfZKP75CvOlQylNhV4';

  const [p1, p2, p3, p4] = await Promise.all([
    genElevenVoice(VOICE_FOUNDER, "I have a half-million dollar contract on my desk, and the client needs it signed today! What do I do?", elevenKey),
    genElevenVoice(VOICE_ADVISOR, "Don't sign blind! Upload the PDF right now to JurisTech Solutions. Risk Radar flags uncapped liability in seconds.", elevenKey),
    genElevenVoice(VOICE_FOUNDER, "One click on Auto-Redline replaced the toxic clause with standard protection. Ready for e-signature in under 60 seconds!", elevenKey),
    genElevenVoice(VOICE_ADVISOR, "Protect your enterprise deal today. Visit juristech.solutions and start free.", elevenKey)
  ]);

  const audioBuf = Buffer.concat([p1, p2, p3, p4]);

  const slides = [
    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:20px;padding:36px;text-align:center;margin-bottom:30px">
        <div style="font-size:52px;margin-bottom:12px">⚠️</div>
        <div style="font-family:Arial Black;font-size:32px;color:#ef4444">THE $500k CONTRACT TRAP</div>
        <div style="font-family:Arial;font-size:24px;color:#cbd5e1;margin-top:16px;line-height:1.4">"Client demands signature TODAY on a 45-page agreement. Outside legal needs 2 weeks!"</div>
      </div>
      <div style="background:#142847;border-radius:14px;padding:20px;text-align:center;font-family:Arial;font-size:20px;color:#f59e0b">⏳ 4 Hours Left on Offer</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 0, 8),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="background:#0D1F3C;border:2px solid #ef4444;border-radius:20px;padding:36px;text-align:center">
        <div style="font-family:Arial;font-size:20px;color:#94a3b8">JURISTECH RISK RADAR</div>
        <div style="font-family:Arial Black;font-size:84px;color:#ef4444;margin:10px 0">84<span style="font-size:36px;color:#64748b">/100</span></div>
        <div style="background:rgba(239,68,68,0.2);color:#ef4444;border-radius:20px;padding:8px 20px;font-family:Arial;font-size:18px;font-weight:700;display:inline-block">HAZARDS DETECTED</div>
        <div style="margin-top:24px;background:#142847;padding:16px;border-radius:10px;text-align:left;font-family:Arial;font-size:18px;color:#ffffff">🚩 Clause 14: Unlimited Consequential Liability</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 8, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="background:#0D1F3C;border:2px solid #10B981;border-radius:20px;padding:36px;text-align:center">
        <div style="font-family:Arial;font-size:20px;color:#10B981;font-weight:700;margin-bottom:12px">AUTO-REDLINE EXECUTED</div>
        <div style="background:rgba(239,68,68,0.15);padding:14px;border-radius:8px;font-family:Arial;font-size:16px;color:#fca5a5;text-decoration:line-through;margin-bottom:14px">❌ Unlimited liability clause removed</div>
        <div style="background:rgba(16,185,129,0.15);padding:14px;border-radius:8px;font-family:Arial;font-size:16px;color:#6ee7b7">✅ Capped at 12 months fees</div>
        <div style="margin-top:20px;font-family:Arial Black;font-size:22px;color:#D4AF37">⚡ Ready for E-Signature in 60s</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 20, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;text-align:center">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="font-family:Arial Black;font-size:42px;color:#D4AF37;line-height:1.2">Protect Your Deals Before You Sign</div>
      <div style="font-family:Arial Black;font-size:32px;color:#10B981;margin-top:20px">juristech.solutions</div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:30px;padding:14px 30px;font-family:Arial;font-size:20px;color:#ffffff;font-weight:700;margin-top:30px">🚀 Start Free Trial Now</div>
      <div style="font-family:Arial;font-size:18px;color:#94a3b8;margin-top:24px">founder@juristech.solutions</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 32, 10)
  ];

  return {
    audioBuf,
    slides,
    title: 'The $500k Contract Trap: How AI Saves The Deal #Shorts',
    desc: 'Never sign a contract blind. Watch how JurisTech AI catches unlimited liability traps and generates compliant redlines in seconds.\n\nWebsite: https://www.juristech.solutions\n#Shorts #LegalTech #Contracts #BusinessLaw',
    tags: ['Shorts', 'Contract Review', 'LegalTech', 'AI Contracts', 'Business Law', 'JurisTech'],
    lang: 'en'
  };
}

// ── Arabic Gulf Shorts Edition (9:16) ─────────────────────────────────────────
async function buildArabicShorts(elevenKey) {
  const VOICE_CEO     = 'nPczCjzI2devNBz1zQrb';
  const VOICE_COUNSEL = 'pqHfZKP75CvOlQylNhV4';

  const [p1, p2, p3, p4] = await Promise.all([
    genElevenVoice(VOICE_CEO, "عقد توريد وشراكة بـ 10 ملايين ريال، ومطلوب التوقيع فوراً! هل نوقع أم ننتظر المراجعة التقليدية؟", elevenKey),
    genElevenVoice(VOICE_COUNSEL, "إياك أن توقع قبل الفحص الآلي! رادار المخاطر في JurisTech يكشف المسؤولية غير المحدودة والشروط الجزائية في ثوانٍ.", elevenKey),
    genElevenVoice(VOICE_COUNSEL, "وبنقرة واحدة، ميزة Auto-Redline تعيد صياغة البنود وفق نظام المعاملات المدنية السعودي لتأمين الصفقة.", elevenKey),
    genElevenVoice(VOICE_CEO, "احمِ استثماراتك قبل التوقيع. تفضل بزيارة juristech.solutions وابدأ مجاناً اليوم.", elevenKey)
  ]);

  const audioBuf = Buffer.concat([p1, p2, p3, p4]);

  const slides = [
    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:right">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:20px;padding:36px;text-align:center;margin-bottom:30px">
        <div style="font-size:52px;margin-bottom:12px">⚠️</div>
        <div style="font-family:Arial Black,Arial;font-size:32px;color:#ef4444">فخ عقود الصفقات المليونية</div>
        <div style="font-family:Arial;font-size:24px;color:#cbd5e1;margin-top:16px;line-height:1.4">"عقد شراكة بـ 10 ملايين ريال في الرياض ودبي، ومطلوب التوقيع اليوم قبل ضياع الصفقة!"</div>
      </div>
      <div style="background:#142847;border-radius:14px;padding:20px;text-align:center;font-family:Arial;font-size:20px;color:#f59e0b">⏳ التوقيع مطلوب خلال ساعات</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 0, 8),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:right">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="background:#0D1F3C;border:2px solid #ef4444;border-radius:20px;padding:36px;text-align:center">
        <div style="font-family:Arial;font-size:20px;color:#94a3b8">رادار مخاطر العقود الفوري</div>
        <div style="font-family:Arial Black,Arial;font-size:84px;color:#ef4444;margin:10px 0">88<span style="font-size:36px;color:#64748b">/100</span></div>
        <div style="background:rgba(239,68,68,0.2);color:#ef4444;border-radius:20px;padding:8px 20px;font-family:Arial;font-size:18px;font-weight:700;display:inline-block">مخاطر حرجة تمنع التوقيع</div>
        <div style="margin-top:24px;background:#142847;padding:16px;border-radius:10px;text-align:right;font-family:Arial;font-size:18px;color:#ffffff">🚩 البند 18: مسؤولية غير محدودة عن أضرار غير مباشرة</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 8, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:right">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="background:#0D1F3C;border:2px solid #10B981;border-radius:20px;padding:36px;text-align:center">
        <div style="font-family:Arial;font-size:20px;color:#10B981;font-weight:700;margin-bottom:12px">الصياغة البديلة بنقرة واحدة</div>
        <div style="background:rgba(239,68,68,0.15);padding:14px;border-radius:8px;font-family:Arial;font-size:16px;color:#fca5a5;text-decoration:line-through;margin-bottom:14px">❌ شطب بند المسؤولية غير المحدودة</div>
        <div style="background:rgba(16,185,129,0.15);padding:14px;border-radius:8px;font-family:Arial;font-size:16px;color:#6ee7b7">✅ صياغة متوافقة مع نظام المعاملات المدنية</div>
        <div style="margin-top:20px;font-family:Arial Black,Arial;font-size:22px;color:#D4AF37">⚡ جاهز للتوقيع في دقيقة واحدة</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 20, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:center">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="font-family:Arial Black,Arial;font-size:38px;color:#D4AF37;line-height:1.3">احمِ استثماراتك في الخليج قبل التوقيع</div>
      <div style="font-family:Arial Black,Arial;font-size:32px;color:#10B981;margin-top:20px">juristech.solutions</div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:30px;padding:14px 30px;font-family:Arial;font-size:20px;color:#ffffff;font-weight:700;margin-top:30px">🚀 ابدأ التجربة المجانية الآن</div>
      <div style="font-family:Arial;font-size:18px;color:#94a3b8;margin-top:24px">founder@juristech.solutions</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 32, 10)
  ];

  return {
    audioBuf,
    slides,
    title: 'فخ عقود الصفقات المليونية: كيف يحميك الذكاء الاصطناعي #Shorts',
    desc: 'لا توقع أي عقد تجاري قبل الفحص الآلي. اكتشف كيف تحلل منصة JurisTech ثغرات العقود ونظام المعاملات المدنية في ثوانٍ.\n\nالموقع: https://www.juristech.solutions\n#عقود #ذكاء_اصطناعي #Shorts #السعودية #الإمارات',
    tags: ['Shorts', 'عقود', 'تحليل العقود', 'ذكاء اصطناعي', 'نظام المعاملات المدنية', 'JurisTech'],
    lang: 'ar'
  };
}

// ── Main Handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const cronSecret = req.headers['x-cron-secret'] || req.query?.secret;
  const CRON_SECRET = process.env.CRON_SECRET || '';
  if (CRON_SECRET && cronSecret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ELEVEN_KEY   = process.env.ELEVENLABS_API_KEY || '';
  const SHOTSTACK_KEY = process.env.SHOTSTACK_API_KEY || '';

  if (!SHOTSTACK_KEY || !ELEVEN_KEY) {
    return res.status(500).json({ error: 'Missing SHOTSTACK_API_KEY or ELEVENLABS_API_KEY' });
  }

  try {
    const today = new Date();
    const isOddDay = today.getDate() % 2 === 1;

    console.log(`[YouTube Morning Cron] Executing at ${today.toISOString()} — Shorts Edition: ${isOddDay ? 'Arabic Gulf' : 'English Global'}`);

    const edition = isOddDay ? await buildArabicShorts(ELEVEN_KEY) : await buildEnglishShorts(ELEVEN_KEY);

    const audioUrl = await ingestAudioToShotstack(edition.audioBuf, SHOTSTACK_KEY);

    const renderPayload = {
      timeline: {
        background: '#020B1A',
        tracks: [{ clips: edition.slides }],
        soundtrack: { src: audioUrl, effect: 'fadeInFadeOut', volume: 1.0 }
      },
      output: {
        format: 'mp4',
        resolution: 'mobile',
        aspectRatio: '9:16',
        fps: 30,
        quality: 'high'
      },
      callback: WEBHOOK_URL
    };

    const renderRes = await fetchJSON('https://api.shotstack.io/edit/v1/render', {
      method: 'POST',
      headers: { 'x-api-key': SHOTSTACK_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(renderPayload)
    });

    if (!renderRes.ok || !renderRes.data?.response?.id) {
      throw new Error('Shotstack Shorts render failed: ' + renderRes.text);
    }

    const renderId = renderRes.data.response.id;

    const queueItem = await saveToQueue({
      slot: 'MORNING',
      scheduled_for: today.toISOString(),
      status: 'rendering',
      heygen_video_id: renderId,
      title_ar: edition.lang === 'ar' ? edition.title : '',
      title_en: edition.lang === 'en' ? edition.title : '',
      description_ar: edition.lang === 'ar' ? edition.desc : '',
      description_en: edition.lang === 'en' ? edition.desc : '',
      tags: JSON.stringify(edition.tags),
      topic_ar: isOddDay ? 'فخ عقود الصفقات المليونية' : 'The $500k Contract Trap',
      topic_en: isOddDay ? 'Arabic Gulf Contract Trap' : 'The $500k Contract Trap',
      format: 'YouTube Shorts 9:16',
      duration_seconds: 45
    });

    const result = {
      success: true,
      slot: 'MORNING',
      format: 'YouTube Shorts (9:16)',
      edition: isOddDay ? 'Arabic Gulf Shorts (السعودية والإمارات)' : 'English Global Shorts (US & Europe)',
      renderId,
      queueItemId: queueItem?.id,
      webhookCallback: WEBHOOK_URL,
      message: 'YouTube Short rendering initiated. Webhook will auto-publish to YouTube upon completion.'
    };

    console.log('[YouTube Morning Cron] Result:', JSON.stringify(result));
    return res.status(200).json(result);
  } catch (err) {
    console.error('[YouTube Morning Cron] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
