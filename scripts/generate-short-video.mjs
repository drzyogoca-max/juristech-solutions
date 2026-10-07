import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { spawn } from 'child_process';

const W = 720;
const H = 1280;

const outputDir = path.resolve('public', 'videos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const slide1Svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#b8962e"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Header -->
  <rect x="60" y="60" width="${W - 120}" height="70" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="105" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>
  
  <!-- Warning Card -->
  <rect x="40" y="240" width="${W - 80}" height="480" rx="24" fill="#0D1F3C" stroke="#ef4444" stroke-width="3"/>
  <text x="${W / 2}" y="340" font-family="Arial, sans-serif" font-size="70" text-anchor="middle">⚠️</text>
  <text x="${W / 2}" y="420" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#ef4444" text-anchor="middle">THE CONTRACT TRAP</text>
  <text x="${W / 2}" y="480" font-family="Arial, sans-serif" font-size="22" fill="#cbd5e1" text-anchor="middle">"Uncapped Consequential Liability</text>
  <text x="${W / 2}" y="515" font-family="Arial, sans-serif" font-size="22" fill="#cbd5e1" text-anchor="middle">Hidden in Section 14"</text>
  
  <rect x="70" y="570" width="${W - 140}" height="90" rx="14" fill="#142847" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="${W / 2}" y="625" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#f59e0b" text-anchor="middle">⏳ Signature Requested in 2 Hours</text>
  
  <!-- Bottom teaser -->
  <rect x="40" y="780" width="${W - 80}" height="220" rx="20" fill="#0D1F3C" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
  <text x="${W / 2}" y="850" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">Can AI Audit It Before You Sign?</text>
  <text x="${W / 2}" y="920" font-family="Arial, sans-serif" font-size="42" font-weight="900" fill="#10B981" text-anchor="middle">IN UNDER 60 SECONDS ⚡</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

const slide2Svg = `
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
  <rect x="60" y="60" width="${W - 120}" height="70" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="105" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Risk Score Card -->
  <rect x="40" y="190" width="${W - 80}" height="560" rx="24" fill="#0D1F3C" stroke="#ef4444" stroke-width="3"/>
  <text x="${W / 2}" y="260" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#94a3b8" text-anchor="middle">STATUTORY RISK RADAR</text>
  
  <text x="${W / 2}" y="380" font-family="Arial, sans-serif" font-size="110" font-weight="900" fill="#ef4444" text-anchor="middle">88<tspan font-size="45" fill="#64748b">/100</tspan></text>
  
  <rect x="180" y="420" width="${W - 360}" height="45" rx="22" fill="rgba(239,68,68,0.2)"/>
  <text x="${W / 2}" y="450" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ef4444" text-anchor="middle">HIGH RISK — DO NOT SIGN</text>
  
  <!-- Detected Hazards -->
  <rect x="70" y="495" width="${W - 140}" height="80" rx="12" fill="#142847"/>
  <text x="95" y="542" font-family="Arial, sans-serif" font-size="19" fill="#ffffff">🚩 Section 14: Unlimited Consequential Damages</text>

  <rect x="70" y="590" width="${W - 140}" height="80" rx="12" fill="#142847"/>
  <text x="95" y="638" font-family="Arial, sans-serif" font-size="19" fill="#ffffff">🚩 Section 22: Uncapped Indemnity Obligation</text>

  <rect x="70" y="685" width="${W - 140}" height="45" rx="10" fill="#142847"/>
  <text x="95" y="715" font-family="Arial, sans-serif" font-size="16" fill="#cbd5e1">Benchmark: Delaware DGCL / Saudi M/191 / UK Law</text>

  <!-- Bottom CTA -->
  <rect x="40" y="800" width="${W - 80}" height="200" rx="20" fill="#0D1F3C" stroke="#D4AF37" stroke-width="1.5"/>
  <text x="${W / 2}" y="870" font-family="Arial, sans-serif" font-size="24" fill="#cbd5e1" text-anchor="middle">Auto-Remediation in Progress...</text>
  <text x="${W / 2}" y="930" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#D4AF37" text-anchor="middle">INSTANT 1-CLICK REDLINE ⚡</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

const slide3Svg = `
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
  <rect x="60" y="60" width="${W - 120}" height="70" rx="16" fill="#0D1F3C" stroke="#D4AF37" stroke-width="2"/>
  <text x="${W / 2}" y="105" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#D4AF37" text-anchor="middle">⚖️ JURISTECH SOLUTIONS</text>

  <!-- Solution Card -->
  <rect x="40" y="190" width="${W - 80}" height="570" rx="24" fill="#0D1F3C" stroke="#10B981" stroke-width="3"/>
  <text x="${W / 2}" y="260" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#10B981" text-anchor="middle">AUTO-REDLINE EXECUTED ✅</text>
  
  <!-- Struck Clause -->
  <rect x="70" y="300" width="${W - 140}" height="95" rx="14" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1"/>
  <text x="95" y="340" font-family="Arial, sans-serif" font-size="18" fill="#fca5a5" text-decoration="line-through">❌ Clause 14: Contractor liable without cap</text>
  <text x="95" y="370" font-family="Arial, sans-serif" font-size="18" fill="#fca5a5" text-decoration="line-through">for indirect and consequential losses.</text>

  <!-- Substituted Safe Clause -->
  <rect x="70" y="415" width="${W - 140}" height="145" rx="14" fill="rgba(16,185,129,0.15)" stroke="#10B981" stroke-width="1.5"/>
  <text x="95" y="455" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#6ee7b7">✅ Substituted Safe Clause:</text>
  <text x="95" y="488" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">"Total liability strictly capped at 100%</text>
  <text x="95" y="515" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">of fees paid in previous 12 months."</text>
  <text x="95" y="542" font-family="Arial, sans-serif" font-size="14" fill="#10B981">Aligned with UCC Art 2 &amp; KSA M/191</text>

  <rect x="70" y="580" width="${W - 140}" height="80" rx="14" fill="#142847"/>
  <text x="${W / 2}" y="630" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="#D4AF37" text-anchor="middle">⚡ READY TO SIGN IN 60s</text>

  <!-- Features list -->
  <rect x="40" y="800" width="${W - 80}" height="200" rx="20" fill="#0D1F3C" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
  <text x="${W / 2}" y="860" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">SOVEREIGN AI ENGINE</text>
  <text x="${W / 2}" y="910" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">Zero Data Retention • AES-256 Vault</text>
  <text x="${W / 2}" y="955" font-family="Arial, sans-serif" font-size="18" fill="#10B981" text-anchor="middle">15+ Jurisdictions Supported</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

const slide4Svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#020B1A"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
  
  <!-- Main CTA Card -->
  <rect x="40" y="160" width="${W - 80}" height="680" rx="24" fill="#0D1F3C" stroke="#D4AF37" stroke-width="3"/>
  <text x="${W / 2}" y="240" font-family="Arial, sans-serif" font-size="60" text-anchor="middle">⚖️</text>
  
  <text x="${W / 2}" y="320" font-family="Arial, sans-serif" font-size="40" font-weight="900" fill="#D4AF37" text-anchor="middle">JurisTech Solutions</text>
  <text x="${W / 2}" y="365" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Sovereign Legal Intelligence Platform</text>
  
  <text x="${W / 2}" y="440" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">PROTECT YOUR DEALS</text>
  <text x="${W / 2}" y="480" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#10B981" text-anchor="middle">BEFORE YOU SIGN</text>

  <rect x="70" y="530" width="${W - 140}" height="90" rx="45" fill="#D4AF37"/>
  <text x="${W / 2}" y="585" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="#020B1A" text-anchor="middle">🚀 START FREE AUDIT NOW</text>

  <text x="${W / 2}" y="670" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#10B981" text-anchor="middle">juristech.solutions</text>
  <text x="${W / 2}" y="720" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">founder@juristech.solutions</text>
  <text x="${W / 2}" y="755" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">WhatsApp: +201126674337</text>

  <rect x="40" y="880" width="${W - 80}" height="140" rx="16" fill="#142847"/>
  <text x="${W / 2}" y="930" font-family="Arial, sans-serif" font-size="18" fill="#cbd5e1" text-anchor="middle">GCC • USA • UK • GERMANY</text>
  <text x="${W / 2}" y="965" font-family="Arial, sans-serif" font-size="16" fill="#10B981" text-anchor="middle">Saudi M/191 • UAE DIFC • Delaware UCC</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
</svg>`;

async function buildVideo() {
  console.log('[VideoGen] Step 1: Converting SVG slides to high-res PNG...');
  
  const tmpDir = path.resolve('public', 'videos', 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  await sharp(Buffer.from(slide1Svg)).png().toFile(path.join(tmpDir, 'slide1.png'));
  await sharp(Buffer.from(slide2Svg)).png().toFile(path.join(tmpDir, 'slide2.png'));
  await sharp(Buffer.from(slide3Svg)).png().toFile(path.join(tmpDir, 'slide3.png'));
  await sharp(Buffer.from(slide4Svg)).png().toFile(path.join(tmpDir, 'slide4.png'));
  console.log('[VideoGen] Slides generated successfully.');

  console.log('[VideoGen] Step 2: Generating harmonic ambient soundtrack...');
  const audioPath = path.join(tmpDir, 'soundtrack.mp3');
  
  // 32 seconds of rich harmonic corporate audio
  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', [
      '-f', 'lavfi',
      '-i', 'aevalsrc=sin(220*2*PI*t)*0.1+sin(330*2*PI*t)*0.08+sin(440*2*PI*t)*0.06+sin(550*2*PI*t)*0.04:s=44100:d=32',
      '-y', audioPath
    ]);
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg audio failed: ${code}`)));
  });
  console.log('[VideoGen] Audio generated successfully.');

  console.log('[VideoGen] Step 3: Stitching slides and audio into 9:16 Short MP4...');
  const outputMp4 = path.resolve('public', 'videos', 'contract-risk-radar-short.mp4');

  // Slide durations: 8s + 8s + 8s + 8s = 32s
  // Using ffmpeg concat with crossfade filter
  const filterComplex = [
    '[0:v]loop=loop=240:size=1:start=0,setpts=PTS-STARTPTS[v0];',
    '[1:v]loop=loop=240:size=1:start=0,setpts=PTS-STARTPTS[v1];',
    '[2:v]loop=loop=240:size=1:start=0,setpts=PTS-STARTPTS[v2];',
    '[3:v]loop=loop=240:size=1:start=0,setpts=PTS-STARTPTS[v3];',
    '[v0][v1]xfade=transition=fade:duration=0.5:offset=7.5[x0];',
    '[x0][v2]xfade=transition=fade:duration=0.5:offset=15.0[x1];',
    '[x1][v3]xfade=transition=fade:duration=0.5:offset=22.5[v]'
  ].join('');

  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', [
      '-loop', '1', '-t', '8', '-i', path.join(tmpDir, 'slide1.png'),
      '-loop', '1', '-t', '8', '-i', path.join(tmpDir, 'slide2.png'),
      '-loop', '1', '-t', '8', '-i', path.join(tmpDir, 'slide3.png'),
      '-loop', '1', '-t', '8', '-i', path.join(tmpDir, 'slide4.png'),
      '-i', audioPath,
      '-filter_complex', filterComplex,
      '-map', '[v]',
      '-map', '4:a',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      '-crf', '24',
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-t', '30.5',
      '-y', outputMp4
    ]);
    p.stderr.on('data', (d) => process.stdout.write(d.toString()));
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg video encode failed: ${code}`)));
  });

  const stat = fs.statSync(outputMp4);
  console.log(`\n[VideoGen] SUCCESS! Output video created: ${outputMp4}`);
  console.log(`[VideoGen] Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

buildVideo().catch(err => {
  console.error('[VideoGen] Error:', err);
  process.exit(1);
});
