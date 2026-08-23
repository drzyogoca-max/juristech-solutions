/**
 * YouTube Channel Launch Campaign — Enterprise Email Marketing Blast
 * Multi-Gateway Delivery: Resend API + Outlook SMTP
 * 
 * Target: Global C-Suite, Law Firms, Corporate Governance Officers
 */
const nodemailer = require('nodemailer');

const RESEND_KEY = Buffer.from('cmVfUEVMeUZVRnZfR01SNHFQaDNNaDh4RWhSaWtDQVRhU0NL', 'base64').toString('utf-8');

const SMTP_CONFIG = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'juristech.solutions@outlook.com',
    pass: 'otqubqoyxyvkfceb',
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
};

const CHANNEL_URL = 'https://www.youtube.com/@JurisTechSolutions?sub_confirmation=1';
const STUDIO_URL = 'https://www.juristech.solutions/youtube-studio';
const WEBSITE_URL = 'https://www.juristech.solutions';

function buildYouTubeLaunchEmail(recipientName, recipientCompany) {
  return {
    subject: `🔴 Official Launch: JurisTech Solutions YouTube Channel — AI Legal Intelligence for ${recipientCompany}`,
    html: `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <div style="max-width:680px;margin:0 auto;padding:32px 24px;">
    
    <!-- Header Banner -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%);border:1px solid #334155;border-radius:24px;padding:40px 32px;text-align:center;margin-bottom:24px;">
      <div style="font-size:42px;margin-bottom:8px;">🎬</div>
      <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 8px 0;letter-spacing:-0.5px;">
        JurisTech Solutions YouTube Channel
      </h1>
      <p style="color:#22d3ee;font-size:14px;font-weight:700;margin:0;text-transform:uppercase;letter-spacing:2px;">
        OFFICIAL LAUNCH — SOVEREIGN AI LEGAL INTELLIGENCE
      </p>
    </div>

    <!-- Greeting -->
    <div style="background:#1e293b;border:1px solid #334155;border-radius:20px;padding:28px;margin-bottom:20px;">
      <p style="color:#94a3b8;font-size:14px;margin:0 0 12px 0;">Dear <strong style="color:#ffffff;">${recipientName}</strong>,</p>
      <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0 0 16px 0;">
        We are pleased to announce the <strong style="color:#22d3ee;">official launch of the JurisTech Solutions YouTube Channel</strong> — 
        your new daily source for AI-powered legal intelligence, contract risk analysis, and cross-border compliance insights.
      </p>
      <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;">
        As a leader at <strong style="color:#ffffff;">${recipientCompany}</strong>, you will find our content directly relevant to:
      </p>
    </div>

    <!-- Value Propositions -->
    <div style="display:grid;gap:12px;margin-bottom:20px;">
      <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:20px;">
        <div style="font-size:20px;float:left;margin-right:12px;">⚡</div>
        <div>
          <h3 style="color:#f59e0b;font-size:15px;font-weight:800;margin:0 0 4px 0;">Sub-90ms AI Contract Audit</h3>
          <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.6;">Watch live demonstrations of our sovereign AI engine scanning and red-lining commercial contracts in under 90 milliseconds.</p>
        </div>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:20px;">
        <div style="font-size:20px;float:left;margin-right:12px;">🌍</div>
        <div>
          <h3 style="color:#22d3ee;font-size:15px;font-weight:800;margin:0 0 4px 0;">Cross-Border Statutory Clash Simulator</h3>
          <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.6;">See how we detect conflicts between US Delaware DGCL, Saudi Civil Code M/191, UAE DIFC, and 45+ other jurisdictions instantly.</p>
        </div>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:20px;">
        <div style="font-size:20px;float:left;margin-right:12px;">💰</div>
        <div>
          <h3 style="color:#10b981;font-size:15px;font-weight:800;margin:0 0 4px 0;">85% Legal Cost Optimization for C-Suite</h3>
          <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.6;">Daily executive briefings showing CEOs and CFOs how to eliminate uncapped liability traps and reduce external legal retainer costs.</p>
        </div>
      </div>
    </div>

    <!-- CTA Buttons -->
    <div style="text-align:center;margin:28px 0;">
      <a href="${CHANNEL_URL}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;padding:16px 40px;border-radius:16px;margin:6px;box-shadow:0 8px 24px rgba(220,38,38,0.3);">
        🔔 Subscribe to Channel Now
      </a>
      <a href="${WEBSITE_URL}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#0891b2,#06b6d4);color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;padding:16px 40px;border-radius:16px;margin:6px;box-shadow:0 8px 24px rgba(6,182,212,0.3);">
        🌐 Visit JurisTech Platform
      </a>
    </div>

    <!-- Schedule Info -->
    <div style="background:#0f172a;border:1px solid #334155;border-radius:16px;padding:24px;text-align:center;margin-bottom:20px;">
      <p style="color:#f59e0b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px 0;">
        📅 Daily Publishing Schedule
      </p>
      <p style="color:#cbd5e1;font-size:14px;margin:0;">
        <strong>Morning Briefing</strong> — 9:00 AM UTC &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Evening Executive Edition</strong> — 6:00 PM UTC
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #334155;padding-top:24px;text-align:center;">
      <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;">
        <strong style="color:#94a3b8;">JurisTech Solutions</strong> — Sovereign AI Legal Intelligence<br>
        Official Email: juristech.solutions@outlook.com | WhatsApp: +201126674337<br>
        <a href="${WEBSITE_URL}" style="color:#22d3ee;text-decoration:none;">www.juristech.solutions</a>
        &nbsp;|&nbsp;
        <a href="${CHANNEL_URL}" style="color:#ef4444;text-decoration:none;">YouTube @JurisTechSolutions</a>
      </p>
      <p style="color:#475569;font-size:11px;margin:12px 0 0 0;">
        Founded & Supervised by Dr. Mohammad Mustafa, PhD — Risk Management & Strategic Business Development Expert
      </p>
    </div>
  </div>
</body>
</html>`
  };
}

// Enterprise Prospect List — High-Value Targets
const PROSPECTS = [
  { name: 'Chief Legal Officer', company: 'Amazon Legal', email: 'drzyogo.ca@gmail.com' },
  { name: 'Executive Chairman', company: 'JurisTech Global', email: 'drzyogo.ca@gmail.com' },
];

async function dispatchEmail(prospect) {
  const email = buildYouTubeLaunchEmail(prospect.name, prospect.company);
  
  // 1. Try Resend API (Instant High-Deliverability Gateway)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: 'JurisTech Solutions <onboarding@resend.dev>',
        to: [prospect.email],
        subject: email.subject,
        html: email.html,
      }),
    });
    const data = await res.json();
    if (res.ok && data.id) {
      return { success: true, method: 'Resend API', id: data.id };
    }
  } catch (e) {
    // fallback to SMTP
  }

  // 2. Fallback to Outlook SMTP
  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    const info = await transporter.sendMail({
      from: '"JurisTech Solutions — YouTube Channel" <juristech.solutions@outlook.com>',
      to: prospect.email,
      subject: email.subject,
      html: email.html,
    });
    return { success: true, method: 'Outlook SMTP', id: info.messageId };
  } catch (smtpErr) {
    return { success: false, error: smtpErr.message };
  }
}

async function launchYouTubeEmailCampaign() {
  console.log('\\n🎬 ═══════════════════════════════════════════════════════');
  console.log('   JURISTECH SOLUTIONS — YouTube Channel Launch Campaign');
  console.log('   Channel: https://www.youtube.com/@JurisTechSolutions');
  console.log('═══════════════════════════════════════════════════════\\n');

  let sentCount = 0;
  for (const prospect of PROSPECTS) {
    const result = await dispatchEmail(prospect);
    if (result.success) {
      sentCount++;
      console.log(`✅ [${sentCount}/${PROSPECTS.length}] Dispatched to ${prospect.name} (${prospect.company}) → ${prospect.email} via ${result.method} (ID: ${result.id})`);
    } else {
      console.error(`❌ Failed: ${prospect.email} — ${result.error}`);
    }
  }

  console.log(`\\n🏁 YouTube Channel Launch Campaign Complete: ${sentCount}/${PROSPECTS.length} emails dispatched.`);
  console.log('🔴 Channel: https://www.youtube.com/@JurisTechSolutions?sub_confirmation=1');
  process.exit(0);
}

launchYouTubeEmailCampaign();
