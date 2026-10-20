/**
 * Vercel Serverless Cron — /api/cron/youtube-morning
 * JurisTech Solutions | Autonomous Morning YouTube Short Publisher
 * Schedule: 0 12 * * * (08:00 AM US Eastern / 12:00 UTC Daily)
 * Format: YouTube Shorts (9:16 Mobile HD) | Duration: 45-55 seconds
 * 
 * Engine: High-Impact Contract Dilemma (Two-Character Dialogue)
 * Focus: Platform Core Services (Risk Radar, Auto-Redlining, Smart Templates, Vault)
 * Alternating Schedule:
 *   - Odd Days: Arabic Gulf Short (رادار المخاطر التعاقدية ونظام المعاملات المدنية)
 *   - Even Days: English Global Short (AI Contract Risk Radar & Enterprise Redlining)
 */

export const config = { runtime: 'nodejs', maxDuration: 300 };

import { getAccessToken, uploadToYouTubeBinary, downloadVideo } from '../video/youtube-upload.js';
import { generateJurisTechVideo } from '../video/veo2-pipeline.js';

const W = 720, H = 1280; // 9:16 Shorts
const WEBHOOK_URL = 'https://www.juristech.solutions/api/heygen-webhook';

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return { status: res.status, ok: res.ok, data: JSON.parse(text), text }; }
  catch(e) { return { status: res.status, ok: res.ok, data: null, text }; }
}

async function ingestAudioToShotstack(audioBuf, apiKey) {
  if (!audioBuf || audioBuf.length === 0) return null;
  try {
    let upRes = await fetchJSON('https://api.shotstack.io/ingest/v1/upload', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
    });
    if (!upRes.ok && (upRes.status === 403 || upRes.status === 401)) {
      upRes = await fetchJSON('https://api.shotstack.io/ingest/stage/upload', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
      });
    }
    if (!upRes.ok || !upRes.data?.data?.attributes?.url) {
      console.warn('Shotstack ingest upload URL failed, falling back to ambient track');
      return null;
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

    if (!putRes.ok) return null;

    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const sRes = await fetchJSON(`https://api.shotstack.io/ingest/v1/sources/${sourceId}`, {
        headers: { 'x-api-key': apiKey }
      });
      if (sRes.data?.data?.attributes?.status === 'ready') {
        return sRes.data.data.attributes.source;
      }
    }
    return null;
  } catch (err) {
    console.warn('[Shotstack Audio Ingest] Error:', err.message);
    return null;
  }
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
  try {
    if (!apiKey) return null;
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
    if (!res.ok) {
      console.warn('[ElevenLabs] TTS quota/status:', res.status);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.warn('[ElevenLabs] TTS error:', err.message);
    return null;
  }
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
    genElevenVoice(VOICE_FOUNDER, "Our vendor contract has an uncapped consequential damages clause, and the client wants it signed today! What do we do?", elevenKey),
    genElevenVoice(VOICE_ADVISOR, "Don't sign blind! Upload the PDF right now to JurisTech Solutions. Risk Radar flags uncapped liability in seconds.", elevenKey),
    genElevenVoice(VOICE_FOUNDER, "One click on Auto-Redline capped our liability to 12 months fees and aligned governing law with Delaware standards. Ready for signature!", elevenKey),
    genElevenVoice(VOICE_ADVISOR, "Protect your enterprise contracts before you sign. Visit juristech.solutions and start free.", elevenKey)
  ]);

  const voiceParts = [p1, p2, p3, p4].filter(p => p && Buffer.isBuffer(p));
  const audioBuf = voiceParts.length > 0 ? Buffer.concat(voiceParts) : null;

  const slides = [
    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:18px">
        <img src="https://www.juristech.solutions/avatars/global_ceo.jpg" style="width:100px;height:100px;border-radius:50%;border:3px solid #D4AF37;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.6);" />
        <div style="text-align:left">
          <div style="font-family:Arial Black;font-size:22px;color:#D4AF37">David Vance</div>
          <div style="font-family:Arial;font-size:15px;color:#94a3b8">Chief Executive Officer</div>
          <div style="background:rgba(239,68,68,0.2);color:#ef4444;border-radius:12px;padding:3px 10px;font-size:13px;font-weight:bold;margin-top:4px;display:inline-block">URGENT CONTRACT REVIEW</div>
        </div>
      </div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:20px;padding:30px;text-align:center;margin-bottom:24px">
        <div style="font-family:Arial Black;font-size:26px;color:#ef4444">THE VENDOR LIABILITY TRAP</div>
        <div style="font-family:Arial;font-size:20px;color:#cbd5e1;margin-top:14px;line-height:1.4">"Our vendor contract has an uncapped consequential indemnity hidden in Section 14. Outside legal review will take two weeks!"</div>
      </div>
      <div style="background:#142847;border-radius:14px;padding:16px;text-align:center;font-family:Arial;font-size:18px;color:#f59e0b">⏳ Urgent Signature Requested Today</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 0, 8),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:18px">
        <img src="https://www.juristech.solutions/avatars/global_counsel.jpg" style="width:100px;height:100px;border-radius:50%;border:3px solid #10B981;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.6);" />
        <div style="text-align:left">
          <div style="font-family:Arial Black;font-size:22px;color:#10B981">Marcus Sterling</div>
          <div style="font-family:Arial;font-size:15px;color:#94a3b8">General Counsel &amp; Legal Architect</div>
          <div style="background:rgba(16,185,129,0.2);color:#10B981;border-radius:12px;padding:3px 10px;font-size:13px;font-weight:bold;margin-top:4px;display:inline-block">AI RISK RADAR ACTIVE</div>
        </div>
      </div>
      <div style="background:#0D1F3C;border:2px solid #ef4444;border-radius:20px;padding:30px;text-align:center">
        <div style="font-family:Arial;font-size:18px;color:#94a3b8">JURISTECH RISK RADAR</div>
        <div style="font-family:Arial Black;font-size:78px;color:#ef4444;margin:8px 0">84<span style="font-size:32px;color:#64748b">/100</span></div>
        <div style="background:rgba(239,68,68,0.2);color:#ef4444;border-radius:20px;padding:6px 18px;font-family:Arial;font-size:16px;font-weight:700;display:inline-block">HAZARDS DETECTED</div>
        <div style="margin-top:20px;background:#142847;padding:14px;border-radius:10px;text-align:left;font-family:Arial;font-size:17px;color:#ffffff">🚩 Clause 14: Unlimited Consequential Liability</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 8, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:18px">
        <div style="text-align:center">
          <img src="https://www.juristech.solutions/avatars/global_ceo.jpg" style="width:72px;height:72px;border-radius:50%;border:2px solid #D4AF37;object-fit:cover;" />
          <div style="font-family:Arial;font-size:12px;color:#D4AF37;margin-top:4px">David (CEO)</div>
        </div>
        <div style="font-size:22px;color:#10B981;font-weight:bold">⚡ AI Redline ⚡</div>
        <div style="text-align:center">
          <img src="https://www.juristech.solutions/avatars/global_counsel.jpg" style="width:72px;height:72px;border-radius:50%;border:2px solid #10B981;object-fit:cover;" />
          <div style="font-family:Arial;font-size:12px;color:#10B981;margin-top:4px">Marcus (Counsel)</div>
        </div>
      </div>
      <div style="background:#0D1F3C;border:2px solid #10B981;border-radius:20px;padding:30px;text-align:center">
        <div style="font-family:Arial;font-size:18px;color:#10B981;font-weight:700;margin-bottom:10px">AUTO-REDLINE EXECUTED</div>
        <div style="background:rgba(239,68,68,0.15);padding:12px;border-radius:8px;font-family:Arial;font-size:15px;color:#fca5a5;text-decoration:line-through;margin-bottom:12px">❌ Unlimited liability clause removed</div>
        <div style="background:rgba(16,185,129,0.15);padding:12px;border-radius:8px;font-family:Arial;font-size:15px;color:#6ee7b7">✅ Capped at 12 months fees</div>
        <div style="margin-top:16px;font-family:Arial Black;font-size:20px;color:#D4AF37">⚡ Ready for E-Signature in 60s</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 20, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;text-align:center">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;gap:16px;margin-bottom:20px">
        <img src="https://www.juristech.solutions/avatars/global_ceo.jpg" style="width:68px;height:68px;border-radius:50%;border:2px solid #D4AF37;object-fit:cover;" />
        <img src="https://www.juristech.solutions/avatars/global_counsel.jpg" style="width:68px;height:68px;border-radius:50%;border:2px solid #10B981;object-fit:cover;" />
      </div>
      <div style="font-family:Arial Black;font-size:38px;color:#D4AF37;line-height:1.2">Protect Your Deals Before You Sign</div>
      <div style="font-family:Arial Black;font-size:30px;color:#10B981;margin-top:16px">juristech.solutions</div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:30px;padding:14px 28px;font-family:Arial;font-size:19px;color:#ffffff;font-weight:700;margin-top:24px">🚀 Start Free Trial Now</div>
      <div style="font-family:Arial;font-size:17px;color:#94a3b8;margin-top:20px">founder@juristech.solutions</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 32, 10)
  ];

  return {
    audioBuf,
    slides,
    title: 'AI Contract Risk Radar: How Executives Audit Vendor Clauses in 60s #Shorts',
    desc: 'Never sign a commercial agreement blind. Watch how JurisTech AI catches unlimited liability traps and generates institutional redlines in seconds.\n\nWebsite: https://www.juristech.solutions\n#Shorts #LegalTech #Contracts #BusinessLaw #RiskRadar',
    tags: ['Shorts', 'Contract Review', 'LegalTech', 'AI Contracts', 'Business Law', 'JurisTech', 'Risk Radar'],
    lang: 'en'
  };
}

// ── Arabic Gulf Shorts Edition (9:16) ─────────────────────────────────────────
async function buildArabicShorts(elevenKey) {
  const VOICE_CEO     = 'nPczCjzI2devNBz1zQrb';
  const VOICE_COUNSEL = 'pqHfZKP75CvOlQylNhV4';

  const [p1, p2, p3, p4] = await Promise.all([
    genElevenVoice(VOICE_CEO, "أمامنا عقد خدمات وتوريد تجاري، والطرف الثاني يطلب التوقيع فوراً! كيف نفحص بنود المسؤولية والشرط الجزائي قبل التورط؟", elevenKey),
    genElevenVoice(VOICE_COUNSEL, "لا توقع أبداً قبل التدقيق الآلي! ارفع العقد إلى رادار المخاطر في JurisTech ليكشف بنود المسؤولية غير المحدودة وشروط التعويض في ثوانٍ.", elevenKey),
    genElevenVoice(VOICE_COUNSEL, "وبنقرة واحدة، ميزة Auto-Redline تعيد صياغة البنود وفق نظام المعاملات المدنية السعودي لتأمين التوازن التعاقدي.", elevenKey),
    genElevenVoice(VOICE_CEO, "احمِ شركتك وأعمالك قبل التوقيع. تفضل بزيارة juristech.solutions وابدأ تجربتك مجاناً اليوم.", elevenKey)
  ]);

  const voiceParts = [p1, p2, p3, p4].filter(p => p && Buffer.isBuffer(p));
  const audioBuf = voiceParts.length > 0 ? Buffer.concat(voiceParts) : null;

  const slides = [
    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:right">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:18px;direction:rtl">
        <img src="https://www.juristech.solutions/avatars/gulf_ceo.jpg" style="width:100px;height:100px;border-radius:50%;border:3px solid #D4AF37;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.6);" />
        <div style="text-align:right">
          <div style="font-family:Arial Black,Arial;font-size:22px;color:#D4AF37">سلطان الهاشمي</div>
          <div style="font-family:Arial;font-size:15px;color:#94a3b8">رئيس تنفيذي · مجموعة أعمال</div>
          <div style="background:rgba(239,68,68,0.2);color:#ef4444;border-radius:12px;padding:3px 10px;font-size:13px;font-weight:bold;margin-top:4px;display:inline-block">فحص تعاقدي عاجل</div>
        </div>
      </div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:20px;padding:30px;text-align:center;margin-bottom:24px">
        <div style="font-family:Arial Black,Arial;font-size:26px;color:#ef4444">فخ عقود التوريد والخدمات</div>
        <div style="font-family:Arial;font-size:20px;color:#cbd5e1;margin-top:14px;line-height:1.4">"بنود مسؤولية تعسفية وشرط جزائي غير عادل، والطرف الآخر يطلب التوقيع فوراً!"</div>
      </div>
      <div style="background:#142847;border-radius:14px;padding:16px;text-align:center;font-family:Arial;font-size:18px;color:#f59e0b">⏳ التوقيع مطلوب خلال ساعات</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 0, 8),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:right">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:18px;direction:rtl">
        <img src="https://www.juristech.solutions/avatars/gulf_counsel.jpg" style="width:100px;height:100px;border-radius:50%;border:3px solid #10B981;object-fit:cover;box-shadow:0 8px 24px rgba(0,0,0,0.6);" />
        <div style="text-align:right">
          <div style="font-family:Arial Black,Arial;font-size:22px;color:#10B981">المستشار فيصل المنصور</div>
          <div style="font-family:Arial;font-size:15px;color:#94a3b8">المستشار القانوني العام</div>
          <div style="background:rgba(16,185,129,0.2);color:#10B981;border-radius:12px;padding:3px 10px;font-size:13px;font-weight:bold;margin-top:4px;display:inline-block">رادار المخاطر التعاقدية</div>
        </div>
      </div>
      <div style="background:#0D1F3C;border:2px solid #ef4444;border-radius:20px;padding:30px;text-align:center">
        <div style="font-family:Arial;font-size:18px;color:#94a3b8">رادار مخاطر العقود الفوري</div>
        <div style="font-family:Arial Black,Arial;font-size:78px;color:#ef4444;margin:8px 0">88<span style="font-size:32px;color:#64748b">/100</span></div>
        <div style="background:rgba(239,68,68,0.2);color:#ef4444;border-radius:20px;padding:6px 18px;font-family:Arial;font-size:16px;font-weight:700;display:inline-block">مخاطر حرجة تمنع التوقيع</div>
        <div style="margin-top:20px;background:#142847;padding:14px;border-radius:10px;text-align:right;font-family:Arial;font-size:17px;color:#ffffff">🚩 البند 18: مسؤولية غير محدودة عن أضرار غير مباشرة</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 8, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:right">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:18px;direction:rtl">
        <div style="text-align:center">
          <img src="https://www.juristech.solutions/avatars/gulf_ceo.jpg" style="width:72px;height:72px;border-radius:50%;border:2px solid #D4AF37;object-fit:cover;" />
          <div style="font-family:Arial;font-size:12px;color:#D4AF37;margin-top:4px">سلطان (الرئيس)</div>
        </div>
        <div style="font-size:22px;color:#10B981;font-weight:bold">⚡ تشاور تنفيذي ⚡</div>
        <div style="text-align:center">
          <img src="https://www.juristech.solutions/avatars/gulf_counsel.jpg" style="width:72px;height:72px;border-radius:50%;border:2px solid #10B981;object-fit:cover;" />
          <div style="font-family:Arial;font-size:12px;color:#10B981;margin-top:4px">فيصل (المستشار)</div>
        </div>
      </div>
      <div style="background:#0D1F3C;border:2px solid #10B981;border-radius:20px;padding:30px;text-align:center">
        <div style="font-family:Arial;font-size:18px;color:#10B981;font-weight:700;margin-bottom:10px">الصياغة البديلة بنقرة واحدة</div>
        <div style="background:rgba(239,68,68,0.15);padding:12px;border-radius:8px;font-family:Arial;font-size:15px;color:#fca5a5;text-decoration:line-through;margin-bottom:12px">❌ شطب بند المسؤولية غير المحدودة</div>
        <div style="background:rgba(16,185,129,0.15);padding:12px;border-radius:8px;font-family:Arial;font-size:15px;color:#6ee7b7">✅ صياغة متوافقة مع نظام المعاملات المدنية</div>
        <div style="margin-top:16px;font-family:Arial Black,Arial;font-size:20px;color:#D4AF37">⚡ جاهز للتوقيع في دقيقة واحدة</div>
      </div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 20, 12),

    shortClip(`<div style="width:${W}px;height:${H}px;background:#020B1A;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;direction:rtl;text-align:center">
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#D4AF37,#10B981);position:absolute;top:0;left:0"></div>
      <div style="display:flex;gap:16px;margin-bottom:20px">
        <img src="https://www.juristech.solutions/avatars/gulf_ceo.jpg" style="width:68px;height:68px;border-radius:50%;border:2px solid #D4AF37;object-fit:cover;" />
        <img src="https://www.juristech.solutions/avatars/gulf_counsel.jpg" style="width:68px;height:68px;border-radius:50%;border:2px solid #10B981;object-fit:cover;" />
      </div>
      <div style="font-family:Arial Black,Arial;font-size:36px;color:#D4AF37;line-height:1.3">احمِ أعمالك وعقودك التجارية قبل التوقيع</div>
      <div style="font-family:Arial Black,Arial;font-size:32px;color:#10B981;margin-top:16px">juristech.solutions</div>
      <div style="background:#0D1F3C;border:2px solid #D4AF37;border-radius:30px;padding:14px 28px;font-family:Arial;font-size:19px;color:#ffffff;font-weight:700;margin-top:24px">🚀 ابدأ التجربة المجانية الآن</div>
      <div style="font-family:Arial;font-size:17px;color:#94a3b8;margin-top:20px">founder@juristech.solutions</div>
      <div style="width:100%;height:6px;background:linear-gradient(90deg,#10B981,#D4AF37);position:absolute;bottom:0;left:0"></div>
    </div>`, 32, 10)
  ];

  return {
    audioBuf,
    slides,
    title: 'رادار فحص العقود التجارية: كيف تكتشف البنود الخطرة في دقيقة؟ #Shorts',
    desc: 'لا توقع أي عقد تجاري قبل الفحص الآلي. اكتشف كيف يحلل رادار JurisTech ثغرات المسؤولية والشرط الجزائي ونظام المعاملات المدنية في ثوانٍ.\n\nالموقع: https://www.juristech.solutions\n#عقود #ذكاء_اصطناعي #Shorts #السعودية #الإمارات #قانون_الأعمال',
    tags: ['Shorts', 'عقود', 'تحليل العقود', 'ذكاء اصطناعي', 'نظام المعاملات المدنية', 'رادار المخاطر', 'JurisTech'],
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
  const SHOTSTACK_KEY = process.env.SHOTSTACK_API_KEY || process.env.SHOTSTACK_SANDBOX_KEY || '';

  try {
    const today = new Date();
    // ── Veo 2 Pipeline ─────────────────────────────────────────────────────
    const isArabicDay = req.query?.lang ? req.query.lang === 'ar' : (today.getDate() % 2 !== 0);
    const DAILY_TOPICS_AR = [
      'تحليل العقود التجارية بالذكاء الاصطناعي في 60 ثانية',
      '5 بنود تعاقدية خطيرة يجب أن تعرفها قبل التوقيع',
      'تأسيس شركة في الإمارات — دليل 2026 الكامل',
      'مخاطر عقود الموردين: كيف تكشفها قبل التوقيع',
      'نظام DIFC: دليل المستثمر الأجنبي في دبي',
      'عقود الشراكة: أهم 3 بنود تفاوضية',
      'الملكية الفكرية في عقود التقنية والبرمجيات',
    ];
    const DAILY_TOPICS_EN = [
      'AI Contract Analysis in 60 Seconds — JurisTech Demo',
      '5 Contract Clauses That Could Destroy Your Business',
      'Company Formation UAE 2026 — Complete Legal Guide',
      'Vendor Contract Risk Detection with AI',
      'DIFC Laws Explained for Foreign Investors',
      'M&A Due Diligence: 3 Points CFOs Miss',
      'IP Protection in Technology Contracts 2026',
    ];

    const dayIdx = today.getDay();
    const topic = isArabicDay
      ? DAILY_TOPICS_AR[dayIdx % DAILY_TOPICS_AR.length]
      : DAILY_TOPICS_EN[dayIdx % DAILY_TOPICS_EN.length];
    const lang = isArabicDay ? 'ar' : 'en';

    console.log(`[Morning Cron] Generating Veo 2 video — topic: ${topic}, lang: ${lang}`);
    const videoResult = await generateJurisTechVideo({ topic, format: 'short', language: lang });

    // Upload to YouTube if we have video
    let uploadResult = null;
    if (videoResult.videoBuffer) {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          uploadResult = await uploadToYouTubeBinary(
            accessToken,
            videoResult.videoBuffer,
            {
              title: videoResult.title,
              description: videoResult.description,
              tags: videoResult.tags,
              categoryId: '27', // Education
              privacyStatus: 'public',
              madeForKids: false,
              selfDeclaredMadeForKids: false,
              snippet: {
                title: (videoResult.title || 'JurisTech Solutions').substring(0, 95),
                description: videoResult.description || '',
                tags: (videoResult.tags || []).slice(0, 30),
                categoryId: '27',
                defaultLanguage: lang,
                defaultAudioLanguage: lang,
              },
              status: {
                privacyStatus: 'public',
                madeForKids: false,
                selfDeclaredMadeForKids: false,
              }
            }
          );
          console.log('[Morning Cron] ✅ YouTube upload:', uploadResult?.videoId);
        }
      } catch (uploadErr) {
        console.error('[Morning Cron] YouTube upload error:', uploadErr.message);
      }
    }

    // Save to queue
    const queueItem = await saveToQueue({
      slot: 'MORNING',
      scheduled_for: today.toISOString(),
      status: uploadResult?.videoId ? 'published' : (videoResult.videoBuffer ? 'ready' : 'pending'),
      youtube_video_id: uploadResult?.videoId || null,
      title_ar: videoResult.script?.titleAr,
      title_en: videoResult.script?.titleEn,
      description_ar: videoResult.script?.descriptionAr,
      description_en: videoResult.script?.descriptionEn,
      tags: JSON.stringify(videoResult.tags),
      topic_ar: isArabicDay ? topic : null,
      topic_en: isArabicDay ? null : topic,
      format: 'YouTube Shorts 9:16',
      duration_seconds: 60,
      video_url: uploadResult?.url || null,
    });

    return res.status(200).json({
      success: true,
      slot: 'MORNING',
      scheduledDate: today.toISOString().split('T')[0],
      topic,
      language: lang,
      engine: videoResult.engine,
      videoGenerated: Boolean(videoResult.videoBuffer),
      youtubeVideoId: uploadResult?.videoId || null,
      youtubeUrl: uploadResult?.url || null,
      queueItemId: queueItem?.id,
      title: videoResult.title,
      message: uploadResult?.videoId
        ? `✅ Video published to YouTube: https://youtu.be/${uploadResult.videoId}`
        : videoResult.videoBuffer
          ? '⚠️ Video generated but YouTube upload failed (check OAuth)'
          : '⚠️ No video generated (check GEMINI_API_KEY)',
    });
  } catch (err) {
    console.error('[YouTube Morning Cron] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
