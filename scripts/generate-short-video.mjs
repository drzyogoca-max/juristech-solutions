import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { spawn, execSync } from 'child_process';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const W = 720;
const H = 1280;

const outputDir = path.resolve('public', 'videos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Creates a rounded rectangular mask buffer of given dimensions and corner radius.
 */
function createRoundedMask(width, height, radius) {
  return Buffer.from(
    `<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#ffffff"/>
    </svg>`
  );
}

/**
 * Loads an image from disk, crops/resizes it to (w, h), applies rounded corners,
 * and adds an SVG border overlay.
 */
async function prepareAvatar(imagePath, width, height, radius, borderColor = '#D4AF37', borderWidth = 3) {
  const mask = createRoundedMask(width, height, radius);
  const borderOverlay = Buffer.from(
    `<svg width="${width}" height="${height}">
      <rect x="${borderWidth / 2}" y="${borderWidth / 2}" width="${width - borderWidth}" height="${height - borderWidth}" rx="${radius}" ry="${radius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"/>
    </svg>`
  );

  const rounded = await sharp(imagePath)
    .resize(width, height, { fit: 'cover', position: 'top' })
    .composite([
      { input: mask, blend: 'dest-in' },
      { input: borderOverlay, blend: 'over' }
    ])
    .png()
    .toBuffer();

  return rounded;
}

/**
 * Slide 1: Executive Dilemma (CEO Avatar)
 */
async function renderSlide1(isArabic) {
  const avatarFile = isArabic ? 'public/avatars/gulf_ceo.jpg' : 'public/avatars/global_ceo.jpg';
  const avatarBuffer = await prepareAvatar(avatarFile, 240, 240, 24, '#D4AF37', 4);

  const svgContent = isArabic ? `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- CEO Label Card -->
  <rect x="180" y="380" width="${W - 360}" height="42" rx="12" fill="#0D1F3C" stroke="#D4AF37" stroke-width="1.5"/>
  <text x="${W / 2}" y="408" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#D4AF37" text-anchor="middle">طارق المنصور • الرئيس التنفيذي</text>

  <!-- Warning Dialogue Box -->
  <rect x="40" y="445" width="${W - 80}" height="470" rx="24" fill="#0D1F3C" stroke="#ef4444" stroke-width="3"/>
  <text x="${W / 2}" y="515" font-family="Arial, sans-serif" font-size="50" text-anchor="middle">⚠️</text>
  <text x="${W / 2}" y="575" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ef4444" text-anchor="middle">فخ العقود التجارية الخطير</text>
  <text x="${W / 2}" y="630" font-family="Arial, sans-serif" font-size="22" fill="#cbd5e1" text-anchor="middle">"المورد يطلب التوقيع خلال ساعتين!"</text>
  <text x="${W / 2}" y="668" font-family="Arial, sans-serif" font-size="20" fill="#fca5a5" text-anchor="middle">البند 14 يخفي مسؤولية تبعية غير محدودة</text>

  <rect x="70" y="715" width="${W - 140}" height="80" rx="16" fill="#142847" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="${W / 2}" y="762" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#f59e0b" text-anchor="middle">⏳ هل يستطيع الذكاء الاصطناعي كشفها فوراً؟</text>

  <rect x="70" y="815" width="${W - 140}" height="65" rx="14" fill="#10B981"/>
  <text x="${W / 2}" y="856" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#020B1A" text-anchor="middle">⚡ في أقل من 60 ثانية</text>

  <!-- Bottom Bar -->
  <rect x="40" y="950" width="${W - 80}" height="180" rx="20" fill="#0D1F3C" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
  <text x="${W / 2}" y="1015" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">فحص سيادي ذكي بنسبة 100%</text>
  <text x="${W / 2}" y="1065" font-family="Arial, sans-serif" font-size="20" fill="#10B981" text-anchor="middle">أنظمة السعودية • مركز دبي المالي DIFC • مصر</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>` : `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- CEO Label Card -->
  <rect x="160" y="380" width="${W - 320}" height="42" rx="12" fill="#0D1F3C" stroke="#D4AF37" stroke-width="1.5"/>
  <text x="${W / 2}" y="408" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#D4AF37" text-anchor="middle">DAVID VANCE • CHIEF EXECUTIVE OFFICER</text>

  <!-- Warning Dialogue Box -->
  <rect x="40" y="445" width="${W - 80}" height="470" rx="24" fill="#0D1F3C" stroke="#ef4444" stroke-width="3"/>
  <text x="${W / 2}" y="515" font-family="Arial, sans-serif" font-size="50" text-anchor="middle">⚠️</text>
  <text x="${W / 2}" y="575" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ef4444" text-anchor="middle">THE CONTRACT LIABILITY TRAP</text>
  <text x="${W / 2}" y="630" font-family="Arial, sans-serif" font-size="22" fill="#cbd5e1" text-anchor="middle">"Vendor demands signature by 5 PM!"</text>
  <text x="${W / 2}" y="668" font-family="Arial, sans-serif" font-size="20" fill="#fca5a5" text-anchor="middle">Section 14 conceals uncapped liability.</text>

  <rect x="70" y="715" width="${W - 140}" height="80" rx="16" fill="#142847" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="${W / 2}" y="762" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#f59e0b" text-anchor="middle">⏳ Can AI Audit It Before You Sign?</text>

  <rect x="70" y="815" width="${W - 140}" height="65" rx="14" fill="#10B981"/>
  <text x="${W / 2}" y="856" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#020B1A" text-anchor="middle">⚡ IN UNDER 60 SECONDS</text>

  <!-- Bottom Bar -->
  <rect x="40" y="950" width="${W - 80}" height="180" rx="20" fill="#0D1F3C" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
  <text x="${W / 2}" y="1015" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">Multi-Jurisdictional AI Risk Radar</text>
  <text x="${W / 2}" y="1065" font-family="Arial, sans-serif" font-size="20" fill="#10B981" text-anchor="middle">Delaware UCC • UK Common Law • Saudi M/191</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

  const bg = await sharp(Buffer.from(svgContent)).png().toBuffer();
  const finalImage = await sharp(bg)
    .composite([
      { input: avatarBuffer, top: 125, left: (W - 240) / 2 }
    ])
    .png()
    .toBuffer();

  return finalImage;
}

/**
 * Slide 2: General Counsel / Risk Radar (Counsel Avatar)
 */
async function renderSlide2(isArabic) {
  const avatarFile = isArabic ? 'public/avatars/gulf_counsel.jpg' : 'public/avatars/global_counsel.jpg';
  const avatarBuffer = await prepareAvatar(avatarFile, 240, 240, 24, '#ef4444', 4);

  const svgContent = isArabic ? `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Counsel Label Card -->
  <rect x="160" y="380" width="${W - 320}" height="42" rx="12" fill="#0D1F3C" stroke="#ef4444" stroke-width="1.5"/>
  <text x="${W / 2}" y="408" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#ef4444" text-anchor="middle">نورة الهاشمي • المستشارة القانونية والمدير المالي</text>

  <!-- Risk Radar Card -->
  <rect x="40" y="445" width="${W - 80}" height="480" rx="24" fill="#0D1F3C" stroke="#ef4444" stroke-width="3"/>
  <text x="${W / 2}" y="495" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#94a3b8" text-anchor="middle">رادار المخاطر النظامية — STATUTORY RADAR</text>
  
  <text x="${W / 2}" y="595" font-family="Arial, sans-serif" font-size="95" font-weight="900" fill="#ef4444" text-anchor="middle">88<tspan font-size="40" fill="#64748b">/100</tspan></text>
  
  <rect x="180" y="620" width="${W - 360}" height="42" rx="21" fill="rgba(239,68,68,0.2)"/>
  <text x="${W / 2}" y="648" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ef4444" text-anchor="middle">مستوى خطورة حرج — لا توقّع العقد</text>

  <rect x="65" y="685" width="${W - 130}" height="65" rx="12" fill="#142847"/>
  <text x="${W / 2}" y="725" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">🚩 البند 14: مسؤولية تبعية مطلقة بلا سقف تعويض</text>

  <rect x="65" y="765" width="${W - 130}" height="65" rx="12" fill="#142847"/>
  <text x="${W / 2}" y="805" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">🚩 البند 22: تعويض غير مشروط عن أضرار الطرف الثالث</text>

  <rect x="65" y="845" width="${W - 130}" height="55" rx="12" fill="#142847" stroke="#D4AF37" stroke-width="1"/>
  <text x="${W / 2}" y="880" font-family="Arial, sans-serif" font-size="16" fill="#D4AF37" text-anchor="middle">مخالفة صريحة لنظام المعاملات المدنية م/191 وقوانين DIFC</text>

  <!-- Bottom CTA -->
  <rect x="40" y="955" width="${W - 80}" height="175" rx="20" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="1015" font-family="Arial, sans-serif" font-size="22" fill="#cbd5e1" text-anchor="middle">الحل الفوري عبر الذكاء الاصطناعي السيادي</text>
  <text x="${W / 2}" y="1075" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#D4AF37" text-anchor="middle">صياغة بديلة فورية بنقرة واحدة ⚡</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>` : `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Counsel Label Card -->
  <rect x="140" y="380" width="${W - 280}" height="42" rx="12" fill="#0D1F3C" stroke="#ef4444" stroke-width="1.5"/>
  <text x="${W / 2}" y="408" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#ef4444" text-anchor="middle">SARAH JENKINS • GENERAL COUNSEL &amp; CFO</text>

  <!-- Risk Radar Card -->
  <rect x="40" y="445" width="${W - 80}" height="480" rx="24" fill="#0D1F3C" stroke="#ef4444" stroke-width="3"/>
  <text x="${W / 2}" y="495" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#94a3b8" text-anchor="middle">STATUTORY RISK RADAR AUDIT</text>
  
  <text x="${W / 2}" y="595" font-family="Arial, sans-serif" font-size="95" font-weight="900" fill="#ef4444" text-anchor="middle">88<tspan font-size="40" fill="#64748b">/100</tspan></text>
  
  <rect x="180" y="620" width="${W - 360}" height="42" rx="21" fill="rgba(239,68,68,0.2)"/>
  <text x="${W / 2}" y="648" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ef4444" text-anchor="middle">CRITICAL RISK — DO NOT SIGN</text>

  <rect x="65" y="685" width="${W - 130}" height="65" rx="12" fill="#142847"/>
  <text x="${W / 2}" y="725" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">🚩 Section 14: Unlimited Consequential Damages</text>

  <rect x="65" y="765" width="${W - 130}" height="65" rx="12" fill="#142847"/>
  <text x="${W / 2}" y="805" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">🚩 Section 22: Uncapped Third-Party Indemnity</text>

  <rect x="65" y="845" width="${W - 130}" height="55" rx="12" fill="#142847" stroke="#D4AF37" stroke-width="1"/>
  <text x="${W / 2}" y="880" font-family="Arial, sans-serif" font-size="16" fill="#D4AF37" text-anchor="middle">Violates Standard Doctrine: Delaware UCC &amp; Saudi M/191</text>

  <!-- Bottom CTA -->
  <rect x="40" y="955" width="${W - 80}" height="175" rx="20" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="1015" font-family="Arial, sans-serif" font-size="22" fill="#cbd5e1" text-anchor="middle">Autonomous Remediation in Real Time</text>
  <text x="${W / 2}" y="1075" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#D4AF37" text-anchor="middle">INSTANT 1-CLICK REDLINE ⚡</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

  const bg = await sharp(Buffer.from(svgContent)).png().toBuffer();
  const finalImage = await sharp(bg)
    .composite([
      { input: avatarBuffer, top: 125, left: (W - 240) / 2 }
    ])
    .png()
    .toBuffer();

  return finalImage;
}

/**
 * Slide 3: Dialogue Meeting Scene & 1-Click Auto-Redline
 */
async function renderSlide3(isArabic) {
  const dialogueFile = isArabic ? 'public/avatars/gulf_dialogue.jpg' : 'public/avatars/global_dialogue.jpg';
  // 16:9 meeting scene image: 640 x 360
  const sceneBuffer = await prepareAvatar(dialogueFile, 640, 360, 20, '#D4AF37', 3);

  const svgContent = isArabic ? `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Executive Dialogue Overlay -->
  <rect x="40" y="500" width="${W - 80}" height="100" rx="16" fill="#0D1F3C" stroke="#10B981" stroke-width="2"/>
  <text x="${W / 2}" y="540" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#D4AF37" text-anchor="middle">الرئيس التنفيذي: "هل يمكن تعديله فوراً دون خسارة الصفقة؟"</text>
  <text x="${W / 2}" y="575" font-family="Arial, sans-serif" font-size="19" font-weight="bold" fill="#10B981" text-anchor="middle">المستشارة: "تم بنقرة واحدة عبر الذكاء الاصطناعي السيادي!"</text>

  <!-- Redline Solution Box -->
  <rect x="40" y="625" width="${W - 80}" height="350" rx="24" fill="#0D1F3C" stroke="#10B981" stroke-width="3"/>
  <text x="${W / 2}" y="675" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#10B981" text-anchor="middle">تم تنفيذ الصياغة البديلة بنجاح ✅</text>
  
  <!-- Struck Clause -->
  <rect x="65" y="700" width="${W - 130}" height="75" rx="12" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.5"/>
  <text x="${W / 2}" y="732" font-family="Arial, sans-serif" font-size="16" fill="#fca5a5" text-anchor="middle" text-decoration="line-through">❌ البند 14 ملغي: يتحمل الطرف الأول أي أضرار غير مباشرة</text>
  <text x="${W / 2}" y="756" font-family="Arial, sans-serif" font-size="15" fill="#fca5a5" text-anchor="middle" text-decoration="line-through">أو خسائر تبعية دون أي سقف تعويض</text>

  <!-- Substituted Safe Clause -->
  <rect x="65" y="790" width="${W - 130}" height="110" rx="12" fill="rgba(16,185,129,0.15)" stroke="#10B981" stroke-width="2"/>
  <text x="${W / 2}" y="825" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#6ee7b7" text-anchor="middle">✅ الصياغة المعتمدة الجديدة:</text>
  <text x="${W / 2}" y="855" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">"يقتصر الحد الأقصى للمسؤولية على 100% من الرسوم المدفوعة"</text>
  <text x="${W / 2}" y="882" font-family="Arial, sans-serif" font-size="15" fill="#10B981" text-anchor="middle">متوافق نظاماً مع المادة 191 معاملات مدنية والقواعد الدولية</text>

  <rect x="65" y="915" width="${W - 130}" height="45" rx="10" fill="#142847"/>
  <text x="${W / 2}" y="945" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#D4AF37" text-anchor="middle">⚡ العقد جاهز للتوقيع الآمن في 60 ثانية</text>

  <!-- Bottom Badges -->
  <rect x="40" y="1000" width="${W - 80}" height="135" rx="20" fill="#0D1F3C" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
  <text x="${W / 2}" y="1050" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">خزينة مشفرة AES-256 • سيادة بيانات مطلقة</text>
  <text x="${W / 2}" y="1095" font-family="Arial, sans-serif" font-size="18" fill="#10B981" text-anchor="middle">فحص وتدقيق وتوقيع إلكتروني مؤتمت</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>` : `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Executive Dialogue Overlay -->
  <rect x="40" y="500" width="${W - 80}" height="100" rx="16" fill="#0D1F3C" stroke="#10B981" stroke-width="2"/>
  <text x="${W / 2}" y="540" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#D4AF37" text-anchor="middle">CEO: "Can we fix it without losing the deal?"</text>
  <text x="${W / 2}" y="575" font-family="Arial, sans-serif" font-size="19" font-weight="bold" fill="#10B981" text-anchor="middle">Counsel: "Executed in 60s with JurisTech 1-Click Redline."</text>

  <!-- Redline Solution Box -->
  <rect x="40" y="625" width="${W - 80}" height="350" rx="24" fill="#0D1F3C" stroke="#10B981" stroke-width="3"/>
  <text x="${W / 2}" y="675" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#10B981" text-anchor="middle">AUTO-REDLINE EXECUTED ✅</text>
  
  <!-- Struck Clause -->
  <rect x="65" y="700" width="${W - 130}" height="75" rx="12" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.5"/>
  <text x="${W / 2}" y="732" font-family="Arial, sans-serif" font-size="16" fill="#fca5a5" text-anchor="middle" text-decoration="line-through">❌ Clause 14: Contractor liable without cap</text>
  <text x="${W / 2}" y="756" font-family="Arial, sans-serif" font-size="15" fill="#fca5a5" text-anchor="middle" text-decoration="line-through">for indirect, punitive, or consequential losses.</text>

  <!-- Substituted Safe Clause -->
  <rect x="65" y="790" width="${W - 130}" height="110" rx="12" fill="rgba(16,185,129,0.15)" stroke="#10B981" stroke-width="2"/>
  <text x="${W / 2}" y="825" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#6ee7b7" text-anchor="middle">✅ Substituted Safe Clause:</text>
  <text x="${W / 2}" y="855" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">"Total liability strictly capped at 100% of fees paid."</text>
  <text x="${W / 2}" y="882" font-family="Arial, sans-serif" font-size="15" fill="#10B981" text-anchor="middle">Aligned with UCC Art 2, Delaware DGCL &amp; Saudi M/191</text>

  <rect x="65" y="915" width="${W - 130}" height="45" rx="10" fill="#142847"/>
  <text x="${W / 2}" y="945" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#D4AF37" text-anchor="middle">⚡ READY TO SIGN IN 60 SECONDS</text>

  <!-- Bottom Badges -->
  <rect x="40" y="1000" width="${W - 80}" height="135" rx="20" fill="#0D1F3C" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
  <text x="${W / 2}" y="1050" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">Zero Data Retention • AES-256 Vault</text>
  <text x="${W / 2}" y="1095" font-family="Arial, sans-serif" font-size="18" fill="#10B981" text-anchor="middle">15+ Jurisdictions Supported Globally</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

  const bg = await sharp(Buffer.from(svgContent)).png().toBuffer();
  const finalImage = await sharp(bg)
    .composite([
      { input: sceneBuffer, top: 125, left: (W - 640) / 2 }
    ])
    .png()
    .toBuffer();

  return finalImage;
}

/**
 * Slide 4: Closing Endorsement & Sovereign Audit Call to Action
 */
async function renderSlide4(isArabic) {
  const ceoFile = isArabic ? 'public/avatars/gulf_ceo.jpg' : 'public/avatars/global_ceo.jpg';
  const counselFile = isArabic ? 'public/avatars/gulf_counsel.jpg' : 'public/avatars/global_counsel.jpg';

  const ceoMini = await prepareAvatar(ceoFile, 150, 150, 75, '#D4AF37', 3);
  const counselMini = await prepareAvatar(counselFile, 150, 150, 75, '#10B981', 3);

  const svgContent = isArabic ? `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Endorsement Badge -->
  <text x="${W / 2}" y="325" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#D4AF37" text-anchor="middle">موثوق من كبرى الشركات والإدارات القانونية الدولية</text>

  <!-- Main CTA Card -->
  <rect x="40" y="360" width="${W - 80}" height="560" rx="24" fill="#0D1F3C" stroke="#D4AF37" stroke-width="3"/>
  <text x="${W / 2}" y="425" font-family="Arial, sans-serif" font-size="50" text-anchor="middle">⚖️</text>
  
  <text x="${W / 2}" y="495" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="#D4AF37" text-anchor="middle">JurisTech Solutions</text>
  <text x="${W / 2}" y="535" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">المنصة السيادية للذكاء الاصطناعي القانوني</text>
  
  <text x="${W / 2}" y="605" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">احمِ صفقاتك وعقودك التجارية</text>
  <text x="${W / 2}" y="645" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#10B981" text-anchor="middle">قبل أن توقّع</text>

  <!-- Button -->
  <rect x="70" y="685" width="${W - 140}" height="80" rx="40" fill="#D4AF37"/>
  <text x="${W / 2}" y="736" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#020B1A" text-anchor="middle">🚀 ابدأ الفحص الذكي المجاني</text>

  <text x="${W / 2}" y="810" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#10B981" text-anchor="middle">juristech.solutions</text>
  <text x="${W / 2}" y="855" font-family="Arial, sans-serif" font-size="18" fill="#cbd5e1" text-anchor="middle">founder@juristech.solutions</text>
  <text x="${W / 2}" y="890" font-family="Arial, sans-serif" font-size="18" fill="#D4AF37" text-anchor="middle">واتساب: 201126674337+</text>

  <!-- Jurisdiction Coverage -->
  <rect x="40" y="955" width="${W - 80}" height="180" rx="20" fill="#142847"/>
  <text x="${W / 2}" y="1015" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">تغطية قانونية شاملة</text>
  <text x="${W / 2}" y="1060" font-family="Arial, sans-serif" font-size="18" fill="#D4AF37" text-anchor="middle">السعودية • الإمارات DIFC • مصر • بريطانيا • أمريكا</text>
  <text x="${W / 2}" y="1098" font-family="Arial, sans-serif" font-size="15" fill="#10B981" text-anchor="middle">مواءمة كاملة مع الأنظمة القضائية والتحكيم الدولي</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>` : `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="50" y="45" width="${W - 100}" height="65" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="88" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Endorsement Badge -->
  <text x="${W / 2}" y="325" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#D4AF37" text-anchor="middle">Trusted by Global C-Suite &amp; Enterprise Legal Teams</text>

  <!-- Main CTA Card -->
  <rect x="40" y="360" width="${W - 80}" height="560" rx="24" fill="#0D1F3C" stroke="#D4AF37" stroke-width="3"/>
  <text x="${W / 2}" y="425" font-family="Arial, sans-serif" font-size="50" text-anchor="middle">⚖️</text>
  
  <text x="${W / 2}" y="495" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="#D4AF37" text-anchor="middle">JurisTech Solutions</text>
  <text x="${W / 2}" y="535" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Sovereign Legal Intelligence Platform</text>
  
  <text x="${W / 2}" y="605" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">PROTECT YOUR DEALS</text>
  <text x="${W / 2}" y="645" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#10B981" text-anchor="middle">BEFORE YOU SIGN</text>

  <!-- Button -->
  <rect x="70" y="685" width="${W - 140}" height="80" rx="40" fill="#D4AF37"/>
  <text x="${W / 2}" y="736" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#020B1A" text-anchor="middle">🚀 START FREE AUDIT NOW</text>

  <text x="${W / 2}" y="810" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#10B981" text-anchor="middle">juristech.solutions</text>
  <text x="${W / 2}" y="855" font-family="Arial, sans-serif" font-size="18" fill="#cbd5e1" text-anchor="middle">founder@juristech.solutions</text>
  <text x="${W / 2}" y="890" font-family="Arial, sans-serif" font-size="18" fill="#D4AF37" text-anchor="middle">WhatsApp: +201126674337</text>

  <!-- Jurisdiction Coverage -->
  <rect x="40" y="955" width="${W - 80}" height="180" rx="20" fill="#142847"/>
  <text x="${W / 2}" y="1015" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">MULTI-JURISDICTIONAL RADAR</text>
  <text x="${W / 2}" y="1060" font-family="Arial, sans-serif" font-size="18" fill="#D4AF37" text-anchor="middle">GCC • USA • UK • GERMANY • EGYPT</text>
  <text x="${W / 2}" y="1098" font-family="Arial, sans-serif" font-size="15" fill="#10B981" text-anchor="middle">Saudi M/191 • UAE DIFC • Delaware UCC • English Law</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

  const bg = await sharp(Buffer.from(svgContent)).png().toBuffer();
  const finalImage = await sharp(bg)
    .composite([
      { input: ceoMini, top: 140, left: (W / 2) - 165 },
      { input: counselMini, top: 140, left: (W / 2) + 15 }
    ])
    .png()
    .toBuffer();

  return finalImage;
}

async function buildVideo() {
  const isArabic = process.argv.includes('--ar') || process.argv.includes('--lang=ar');
  const voiceName = isArabic ? 'ar-SA-HamedNeural' : 'en-US-ChristopherNeural';

  console.log(`[VideoGen] Step 1: Generating high-resolution composite slides with photorealistic avatars...`);
  console.log(`[VideoGen] Mode: ${isArabic ? 'Arabic (Gulf Avatars & Localization)' : 'English (Global Avatars & Localization)'}`);
  
  const tmpDir = path.resolve('public', 'videos', isArabic ? 'tmp_ar' : 'tmp_en');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const s1Buffer = await renderSlide1(isArabic);
  const s2Buffer = await renderSlide2(isArabic);
  const s3Buffer = await renderSlide3(isArabic);
  const s4Buffer = await renderSlide4(isArabic);

  fs.writeFileSync(path.join(tmpDir, 'slide1.png'), s1Buffer);
  fs.writeFileSync(path.join(tmpDir, 'slide2.png'), s2Buffer);
  fs.writeFileSync(path.join(tmpDir, 'slide3.png'), s3Buffer);
  fs.writeFileSync(path.join(tmpDir, 'slide4.png'), s4Buffer);

  console.log('[VideoGen] 4 photorealistic slides composited successfully.');

  console.log(`[VideoGen] Step 2: Generating studio neural voiceover via ${voiceName}...`);
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const scriptsEn = [
    'Before you sign that high-stakes commercial deal, watch out. Hidden in Section 14 is uncapped consequential liability. Can AI audit it before you sign? In under sixty seconds.',
    'JurisTech Statutory Risk Radar detects a critical 88 out of 100 risk score. Benchmarked against Delaware, UK, and Saudi laws, it flags dangerous uncapped indemnities instantly.',
    'Can we fix it without losing the deal? Done! In sixty seconds JurisTech struck the uncapped penalty and injected an institutional liability cap. Encrypted, sovereign, and ready to sign.',
    'Protect your enterprise before you sign. Visit juristech.solutions to start your free sovereign legal audit today.'
  ];

  const scriptsAr = [
    'قبل أن توقّع أي عقد تجاري عالي القيمة، احذر! في البند الرابع عشر، قد تختبئ مخاطر مسؤولية غير محدودة. هل يستطيع الذكاء الاصطناعي فحصها في ثوانٍ؟',
    'نظام رادار المخاطر من جوريستك سوليوشنز يكشف درجة خطورة تصل إلى ثمانية وثمانين في المائة، متوافقاً مع الأنظمة السعودية وقوانين مركز دبي المالي.',
    'هل يمكن تعديل العقد فوراً دون خسارة الصفقة؟ تم بنقرة واحدة! ألغى الذكاء الاصطناعي المسؤولية المطلقة ووضع سقفاً آمناً متوافقاً مع الأنظمة.',
    'احمِ شركتك قبل أن توقّع. تفضل بزيارة موقعنا juristech.solutions وابدأ الفحص الذكي مجاناً.'
  ];

  const scripts = isArabic ? scriptsAr : scriptsEn;
  const segments = [];

  for (let i = 0; i < scripts.length; i++) {
    const clipDir = path.join(tmpDir, `clip_${i}`);
    if (!fs.existsSync(clipDir)) fs.mkdirSync(clipDir, { recursive: true });
    
    await tts.toFile(clipDir, scripts[i]);
    const audioPath = path.join(clipDir, 'audio.mp3');

    // Get exact audio duration
    const durStr = execSync(`ffprobe -i "${audioPath}" -show_entries format=duration -v quiet -of csv=p=0`).toString().trim();
    const audioDur = parseFloat(durStr) || 8.0;
    const segDur = audioDur + 0.6; // 0.6s natural pause
    console.log(`[VideoGen] Segment ${i + 1}: voice duration = ${audioDur.toFixed(2)}s, segment duration = ${segDur.toFixed(2)}s`);

    const slideImg = path.join(tmpDir, `slide${i + 1}.png`);
    const segMp4 = path.join(tmpDir, `seg_${i}.mp4`);

    // Render segment video with padded audio
    await new Promise((resolve, reject) => {
      const p = spawn('ffmpeg', [
        '-loop', '1', '-t', segDur.toString(), '-i', slideImg,
        '-i', audioPath,
        '-filter_complex', `[1:a]apad=pad_dur=0.6[a]`,
        '-map', '0:v',
        '-map', '[a]',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        '-crf', '19',
        '-preset', 'fast',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-t', segDur.toString(),
        '-y', segMp4
      ]);
      p.on('close', (code) => code === 0 ? resolve() : reject(new Error(`Segment ${i} ffmpeg failed with code ${code}`)));
    });

    segments.push(segMp4);
  }

  console.log('[VideoGen] Step 3: Concatenating video segments into broadcast MP4...');
  const concatList = path.join(tmpDir, 'concat.txt');
  const listContent = segments.map(s => `file '${s.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatList, listContent);

  const outputMp4 = path.resolve('public', 'videos', isArabic ? 'contract-risk-radar-short-ar.mp4' : 'contract-risk-radar-short.mp4');

  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', [
      '-f', 'concat',
      '-safe', '0',
      '-i', concatList,
      '-c', 'copy',
      '-y', outputMp4
    ]);
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error(`Concat ffmpeg failed with code ${code}`)));
  });

  const stat = fs.statSync(outputMp4);
  const totalDurStr = execSync(`ffprobe -i "${outputMp4}" -show_entries format=duration -v quiet -of csv=p=0`).toString().trim();
  console.log(`\n[VideoGen] ========================================================`);
  console.log(`[VideoGen] SUCCESS! BROADCAST SHORT CREATED: ${outputMp4}`);
  console.log(`[VideoGen] Duration: ${parseFloat(totalDurStr).toFixed(2)} seconds`);
  console.log(`[VideoGen] Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`[VideoGen] Visuals: 100% Photorealistic Dialogue Avatars (Sharp Composited)`);
  console.log(`[VideoGen] Voice: ${voiceName} (Studio Quality Neural Audio)`);
  console.log(`[VideoGen] ========================================================\n`);
}

buildVideo().catch(err => {
  console.error('[VideoGen] Error:', err);
  process.exit(1);
});
