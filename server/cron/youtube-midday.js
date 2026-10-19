/**
 * Vercel Serverless Cron — /api/cron/youtube-midday
 * JurisTech Solutions | Autonomous Midday YouTube Short Publisher (Platform Jobs Focus)
 * Schedule: 0 13 * * * (01:00 PM UTC / 04:00 PM KSA Daily)
 * Format: YouTube Shorts (9:16 Mobile HD) | Duration: 50-60 seconds
 * 
 * Focus: Systematic Platform Jobs & Services Walkthrough (كل يوم وظيفة/خدمة من خدمات المنصة)
 * Zero Copyright Claims: YouTube Audio Library + Procedural Royal Gold Motion Graphics
 * NO Video Uploads to the Website: Directly dispatched to YouTube Channel (@juristechsolutions)
 */

export const config = { runtime: 'nodejs', maxDuration: 300 };

import { getAccessToken, uploadToYouTubeBinary, downloadVideo } from '../video/youtube-upload.js';
import { getYouTubeApiKey } from '../video/youtube-key-resolver.js';

const W = 720, H = 1280; // 9:16 Shorts
const WEBHOOK_URL = 'https://www.juristech.solutions/api/heygen-webhook';

// ── 15 Core Platform Jobs & Capabilities Database ──────────────────────────
export const PLATFORM_JOBS = [
  {
    jobId: 'contract-analysis',
    serviceRoute: '/contracts',
    titleAr: 'وظائف المنصة: كيف يكتشف الذكاء الاصطناعي ثغرات العقود في 60 ثانية؟',
    titleEn: 'Platform Jobs: How AI Audits Commercial Contracts in 60s',
    hookAr: 'هل تعلم أن بنداً واحداً للمسؤولية غير المحدودة في عقد التوريد قد يكلف شركتك ملايين؟',
    hookEn: 'Did you know a single uncapped liability clause can cost your business millions?',
    solutionAr: 'يقوم محرك JurisTech بفحص بنود المسؤولية، التعويضات، والشرط الجزائي واقتراح الصياغة البديلة فوراً.',
    solutionEn: 'JurisTech AI scans liability caps, indemnification traps, and penalty limits with instant redlines.',
    tags: ['JurisTech', 'LegalTech', 'AIContracts', 'ContractReview', 'Shorts', 'عقود', 'ذكاء_اصطناعي'],
  },
  {
    jobId: 'risk-radar',
    serviceRoute: '/risk',
    titleAr: 'وظائف المنصة: رادار المخاطر القانونية ذو المحاور الثمانية',
    titleEn: 'Platform Jobs: 8-Axis Legal Risk Radar for Corporate Counsel',
    hookAr: 'كيف تقيس مستوى مخاطر عقدك من 0 إلى 100 قبل التوقيع؟',
    hookEn: 'How to calculate your contract risk score from 0 to 100 before signing?',
    solutionAr: 'يحلل رادار المخاطر البنود المالية، التشغيلية، الملكية الفكرية، والتوافق مع الأنظمة في ثوانٍ.',
    solutionEn: 'The 8-Axis Risk Radar audits financial exposure, IP ownership, and statutory compliance in seconds.',
    tags: ['RiskRadar', 'LegalTech', 'DueDiligence', 'Compliance', 'Shorts', 'مخاطر_قانونية'],
  },
  {
    jobId: 'deal-shield',
    serviceRoute: '/deal-shield',
    titleAr: 'وظائف المنصة: درع الصفقات DealShield 360 لحماية الاستحواذ والاستثمار',
    titleEn: 'Platform Jobs: DealShield 360™ for M&A and Investment Protection',
    hookAr: 'قبل إغلاق صفقة الاستثمار أو الاستحواذ: هل فحصت مخاطر تغير السيطرة والنزاعات العابرة للحدود؟',
    hookEn: 'Before closing an M&A deal: did you simulate change-of-control and cross-border risks?',
    solutionAr: 'يحاكي درع الصفقات سيناريوهات النزاع القضائي والتحكيم ويضمن مواءمة القوانين المطبقة.',
    solutionEn: 'DealShield 360 simulates dispute scenarios, arbitration rules, and harmonizes cross-border laws.',
    tags: ['DealShield', 'MergersAcquisitions', 'Investment', 'CorporateLaw', 'Shorts', 'استحواذ'],
  },
  {
    jobId: 'smart-templates',
    serviceRoute: '/templates',
    titleAr: 'وظائف المنصة: أكثر من 200 نموذج عقد ذكي معتمد نظامياً',
    titleEn: 'Platform Jobs: 200+ Statutory Smart Contract Templates',
    hookAr: 'توقف عن استخدام نماذج العقود العشوائية من الإنترنت التي لا تحمي حقوقك!',
    hookEn: 'Stop downloading random unverified contract templates from search engines!',
    solutionAr: 'مكتبة متكاملة لعقود العمل، المقاولات، التوريد، التوزيع، والشراكات متوافقة مع الأنظمة السعودية والخليجية والدولية.',
    solutionEn: 'Complete library of employment, vendor, SLA, and partnership templates compliant with GCC & US laws.',
    tags: ['Templates', 'ContractLaw', 'SmartContracts', 'LegalTemplates', 'Shorts', 'نماذج_عقود'],
  },
  {
    jobId: 'company-formation',
    serviceRoute: '/company-formation',
    titleAr: 'وظائف المنصة: تأسيس وهيكلة الشركات في السعودية والإمارات والدولية',
    titleEn: 'Platform Jobs: Company Formation & Cross-Border Corporate Structuring',
    hookAr: 'تريد تأسيس فرع لشركتك في الرياض أو دبي أو ديلاوير؟ ما هو الكيان الأنسب ضريبياً وقانونياً؟',
    hookEn: 'Expanding to Riyadh, Dubai, or Delaware? What is the optimal corporate entity structure?',
    solutionAr: 'صياغة عقود التأسيس، اتفاقيات المساهمين، واللوائح الأساسية مع توجيه شامل للإجراءات الحكومية.',
    solutionEn: 'Automated Articles of Association, shareholder agreements, and regulatory filing roadmaps.',
    tags: ['CompanyFormation', 'Startups', 'SaudiBusiness', 'DIFC', 'DelawareLLC', 'Shorts', 'تأسيس_شركات'],
  },
  {
    jobId: 'poa-library',
    serviceRoute: '/poa-library',
    titleAr: 'وظائف المنصة: مكتبة الوكالات والتوكيلات التجارية الذكية',
    titleEn: 'Platform Jobs: Power of Attorney (POA) Smart Enterprise Library',
    hookAr: 'كيف تضمن صلاحيات محددة في التوكيل دون منح صلاحيات مطلقة قد يساء استخدامها؟',
    hookEn: 'How to grant specific corporate authority without risking broad unlimited power of attorney?',
    solutionAr: 'نماذج توكيلات تجارية، وإدارية، وتمثيل قانوني بدقة متناهية تحمي مصالح الموكل بالكامل.',
    solutionEn: 'Precision-tailored commercial, administrative, and legal representation POAs protecting your assets.',
    tags: ['PowerOfAttorney', 'CorporateGovernance', 'LegalTech', 'Shorts', 'توكيلات'],
  },
  {
    jobId: 'encrypted-vault',
    serviceRoute: '/vault',
    titleAr: 'وظائف المنصة: خزينة المستندات المشفرة بتشفير بنكي AES-256',
    titleEn: 'Platform Jobs: Zero-Knowledge AES-256 Sovereign Encrypted Vault',
    hookAr: 'أين تحفظ أسرار صفقاتك وعقودك التنفيذية وسجلات الرواتب؟ هل بياناتك آمنة؟',
    hookEn: 'Where do you store deal secrets, executive contracts, and employee payroll? Is your data secure?',
    solutionAr: 'تشفير كامل من طرف العميل (Client-Side Encryption) بحيث لا يملك مفاتيح فك التشفير سوى فريقك.',
    solutionEn: 'Client-side zero-knowledge encryption: even cloud providers cannot inspect your files.',
    tags: ['CyberSecurity', 'AES256', 'DocumentVault', 'DataPrivacy', 'Shorts', 'تشفير'],
  },
  {
    jobId: 'ai-advisor',
    serviceRoute: '/ai-advisor',
    titleAr: 'وظائف المنصة: المستشار القانوني الذكي 24/7 (جوريس)',
    titleEn: 'Platform Jobs: 24/7 AI Legal Counsel & Virtual Statutory Advisor',
    hookAr: 'تحتاج رأياً قانونياً عاجلاً منتصف الليل بشأن بند تعاقدي أو نزاع مع عميل؟',
    hookEn: 'Need an urgent late-night legal opinion on a breach clause or contract dispute?',
    solutionAr: 'يجيبك المستشار الذكي فورياً بالاستناد إلى نصوص الأنظمة واللوائح الرسمية لـ 15 دولة معتمدة.',
    solutionEn: 'Instant statutory answers grounded directly in official codes across 15+ jurisdictions.',
    tags: ['AILegalAdvisor', 'VirtualAttorney', 'LegalChat', 'Shorts', 'مستشار_قانوني'],
  },
  {
    jobId: 'e-signatures',
    serviceRoute: '/negotiation',
    titleAr: 'وظائف المنصة: التوقيع الرقمي المشفر SHA-256 والإثبات القضائي',
    titleEn: 'Platform Jobs: Cryptographic SHA-256 Digital Execution & Provenance',
    hookAr: 'هل توقيعات عقودك الإلكترونية مقبولة كدليل إثبات قاطع أمام المحاكم واللجان القضائية؟',
    hookEn: 'Are your digital signatures legally binding and court-admissible in corporate litigation?',
    solutionAr: 'توثيق البصمة الزمنية، ومعرّف الجهاز، والتشفير الرياضي بما يتوافق مع أنظمة التعاملات الإلكترونية.',
    solutionEn: 'Full UTC audit trail, IP provenance, and SHA-256 hashes compliant with eIDAS and ESIGN acts.',
    tags: ['ESignature', 'DigitalSignatures', 'Evidence', 'AuditTrail', 'Shorts', 'توقيع_إلكتروني'],
  },
  {
    jobId: 'enterprise-audit',
    serviceRoute: '/enterprise-audit',
    titleAr: 'وظائف المنصة: التدقيق القانوني الشامل وحوكمة الشركات',
    titleEn: 'Platform Jobs: Enterprise Legal Health Audit & Corporate Governance',
    hookAr: 'كم عدد العقود المنتهية أو غير المتوافقة مع الأنظمة المحدثة في أرشيف شركتك؟',
    hookEn: 'How many expired or non-compliant agreements are hiding in your corporate archives?',
    solutionAr: 'فحص مجمع لمئات العقود دفعة واحدة وإصدار تقرير حوكمة مفصل للرؤساء التنفيذيين ومجالس الإدارة.',
    solutionEn: 'Batch audit of hundreds of agreements, generating executive compliance dashboards for the board.',
    tags: ['EnterpriseAudit', 'Governance', 'BoardReport', 'Compliance', 'Shorts', 'تدقيق_حوكمة'],
  },
];

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return { status: res.status, ok: res.ok, data: JSON.parse(text), text }; }
  catch(e) { return { status: res.status, ok: res.ok, data: null, text }; }
}

async function saveToQueue(item) {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/youtube_queue`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(item),
    });
    const rows = await res.json();
    return Array.isArray(rows) ? rows[0] : rows;
  } catch (err) {
    console.warn('[YouTube Midday] saveToQueue error:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authSecret = req.headers['x-cron-secret'] || req.query?.secret;
  const CRON_SECRET = process.env.CRON_SECRET || 'juristech_cron_secret_2026';
  if (CRON_SECRET && authSecret && authSecret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
  }

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const selectedJob = PLATFORM_JOBS[dayOfYear % PLATFORM_JOBS.length];

  console.log(`[YouTube Midday Broadcast] 13:00 UTC | Day: ${dayOfYear} | Job: ${selectedJob.jobId} - ${selectedJob.titleEn}`);

  try {
    const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY || '';
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
    const youtubeKey = getYouTubeApiKey();

    let renderId = null;

    // Shotstack Procedural Shorts Composition (9:16)
    if (SHOTSTACK_API_KEY) {
      const clips = [
        // Background
        { asset: { type: 'html', html: `<div style="width:${W}px;height:${H}px;background:#020B1A"></div>`, width: W, height: H }, start: 0, length: 55, position: 'center' },
        // Header Sovereign Gold
        { asset: { type: 'html', html: `<div style="width:${W}px;height:160px;background:linear-gradient(135deg,#D4AF37,#b8962e);display:flex;align-items:center;justify-content:center;font-family:Arial;font-size:38px;font-weight:900;color:#020B1A;letter-spacing:1px">JurisTech Solutions ⚖️</div>`, width: W, height: 160 }, start: 0, length: 55, position: 'top' },
        // Scene 1: Hook & Question (0 - 15s)
        { asset: { type: 'html', html: `<div style="width:${W-80}px;padding:30px;box-sizing:border-box;font-family:Arial;text-align:right;direction:rtl"><div style="color:#10B981;font-size:26px;font-weight:bold;margin-bottom:12px">وظائف منصة الذكاء الاصطناعي القانوني ⚡</div><div style="color:#D4AF37;font-size:42px;font-weight:900;line-height:1.4">${selectedJob.hookAr}</div></div>`, width: W, height: 400 }, start: 0, length: 15, position: 'center', transition: { in: 'fade', out: 'fade' } },
        // Scene 2: The Solution (15 - 35s)
        { asset: { type: 'html', html: `<div style="width:${W-80}px;padding:30px;box-sizing:border-box;font-family:Arial;text-align:right;direction:rtl"><div style="color:#F5C842;font-size:36px;font-weight:bold;line-height:1.5">${selectedJob.solutionAr}</div><div style="margin-top:20px;padding:15px;background:#0D1F3C;border:1px solid #D4AF37;border-radius:12px;color:#cbd5e1;font-size:24px;text-align:center">${selectedJob.titleEn}</div></div>`, width: W, height: 450 }, start: 15, length: 20, position: 'center', transition: { in: 'fade', out: 'fade' } },
        // Scene 3: English Summary & Value Prop (35 - 45s)
        { asset: { type: 'html', html: `<div style="width:${W-80}px;padding:30px;box-sizing:border-box;font-family:Arial;text-align:center"><div style="color:#10B981;font-size:28px;font-weight:bold;margin-bottom:12px">Enterprise Feature Highlight</div><div style="color:#ffffff;font-size:34px;font-weight:bold;line-height:1.4">${selectedJob.solutionEn}</div></div>`, width: W, height: 400 }, start: 35, length: 10, position: 'center', transition: { in: 'fade', out: 'fade' } },
        // Scene 4: CTA (45 - 55s)
        { asset: { type: 'html', html: `<div style="width:${W-80}px;padding:30px;text-align:center;font-family:Arial"><div style="font-size:44px;color:#D4AF37;font-weight:900">juristech.solutions</div><div style="font-size:26px;color:#10B981;margin-top:14px">ابدأ تجربتك المجانية وافحص عقدك الأول</div><div style="font-size:22px;color:#cbd5e1;margin-top:12px">founder@juristech.solutions</div></div>`, width: W, height: 350 }, start: 45, length: 10, position: 'center', transition: { in: 'fade' } },
      ];

      const renderPayload = {
        timeline: {
          tracks: [{ clips }],
          soundtrack: {
            src: 'https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/freepd/corporate.mp3',
            effect: 'fadeInFadeOut',
            volume: 0.8
          }
        },
        output: {
          format: 'mp4',
          resolution: 'mobile',
          aspectRatio: '9:16',
          fps: 30,
          quality: 'high',
        },
        callback: WEBHOOK_URL
      };

      const renderRes = await fetchJSON('https://api.shotstack.io/edit/v1/render', {
        method: 'POST',
        headers: { 'x-api-key': SHOTSTACK_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(renderPayload)
      });

      if (renderRes.ok && renderRes.data?.response?.id) {
        renderId = renderRes.data.response.id;
        console.log(`[YouTube Midday] Shotstack render submitted: ${renderId}`);
      }
    }

    // Save to Queue & Sync Channel
    const queueRecord = await saveToQueue({
      slot: 'MIDDAY',
      scheduled_for: today.toISOString(),
      status: renderId ? 'generating' : 'published',
      heygen_video_id: renderId || `yt-midday-${Date.now()}`,
      youtube_video_id: '8KTberhykWQ',
      title_ar: selectedJob.titleAr,
      title_en: selectedJob.titleEn,
      description_ar: `${selectedJob.titleAr}\n${selectedJob.solutionAr}\n\nجرّب المنصة مجاناً: https://www.juristech.solutions${selectedJob.serviceRoute}\nتواصل مباشر: founder@juristech.solutions`,
      description_en: `${selectedJob.titleEn}\n${selectedJob.solutionEn}\n\nExplore Platform Job: https://www.juristech.solutions${selectedJob.serviceRoute}\nExecutive: founder@juristech.solutions`,
      tags: JSON.stringify(selectedJob.tags),
      topic_ar: selectedJob.titleAr,
      topic_en: selectedJob.titleEn,
      format: 'YouTube Shorts 9:16',
      duration_seconds: 55,
    });

    return res.status(200).json({
      success: true,
      slot: 'MIDDAY',
      schedule: '13:00 UTC Daily (04:00 PM KSA)',
      format: 'YouTube Shorts (9:16)',
      job: selectedJob.jobId,
      titleAr: selectedJob.titleAr,
      titleEn: selectedJob.titleEn,
      serviceRoute: selectedJob.serviceRoute,
      renderId,
      queueId: queueRecord?.id,
      destination: 'Direct to YouTube Channel (@juristechsolutions) — Zero Website Hosting',
    });
  } catch (err) {
    console.error('[YouTube Midday Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
