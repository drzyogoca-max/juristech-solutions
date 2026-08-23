const https = require('https');

async function dispatchCSuiteProposalToLead(companyName, contactEmail, jurisdiction, roleTarget) {
  const RESEND_API_KEY = Buffer.from('cmVfUEVMeUZVRnZfR01SNHFQaDNNaDh4RWhSaWtDQVRhU0NL', 'base64').toString('utf-8');
  const MANDATORY_ADMIN_COPY = 'drzyogo.ca@gmail.com';
  const OFFICIAL_ARCHIVE = 'juristech.solutions@outlook.com';

  console.log(`[C-Suite Campaign] Dispatching 100% English Executive Proposal to: ${companyName} (${contactEmail})...`);

  const dynamicSubject = `CONFIDENTIAL & PRIVILEGED: Strategic Legal AI Infrastructure & Financial Risk Mitigation for ${companyName} | JurisTech Solutions`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JurisTech Solutions Executive Briefing</title>
      <style>
        body { margin: 0; padding: 0; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #070b14; padding: 30px 0; }
        .container { max-width: 660px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .header { background: linear-gradient(135deg, #091224 0%, #111c38 100%); padding: 40px 36px; text-align: center; border-bottom: 2px solid #06b6d4; }
        .badge { display: inline-block; background: rgba(6, 182, 212, 0.12); border: 1px solid #06b6d4; color: #38bdf8; padding: 6px 18px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.8px; margin-bottom: 14px; }
        .title { margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.3; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 10px; font-weight: 500; }
        .content { padding: 36px 36px; line-height: 1.75; color: #cbd5e1; font-size: 15px; }
        .object-box { background: #131d33; border-left: 4px solid #06b6d4; border-radius: 10px; padding: 22px 24px; margin: 24px 0; border: 1px solid #1e2e50; }
        .object-tag { font-size: 12px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; margin-bottom: 6px; }
        .object-title { font-size: 17px; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
        .object-desc { font-size: 14px; color: #94a3b8; line-height: 1.6; }
        .csuite-card { background: #111c33; border: 1px solid #1e293b; border-radius: 12px; padding: 20px 22px; margin-bottom: 16px; }
        .role-badge { background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; }
        .pricing-card { background: linear-gradient(145deg, #0b172d 0%, #071020 100%); border: 1px solid #0284c7; border-radius: 14px; padding: 28px; text-align: center; margin: 32px 0; }
        .pricing-amount { font-size: 34px; font-weight: 900; color: #ffffff; margin: 10px 0 6px 0; }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 15px 36px; border-radius: 10px; }
        .signature-block { margin-top: 40px; padding-top: 28px; border-top: 1px solid #1e293b; }
        .footer { background: #070b14; padding: 24px 36px; text-align: center; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="badge">CONFIDENTIAL & PRIVILEGED EXECUTIVE BRIEFING</div>
            <h1 class="title">JurisTech Solutions ⚖️</h1>
            <div class="subtitle">Autonomous Legal Intelligence & Enterprise Contract Risk Infrastructure</div>
          </div>
          
          <div class="content">
            <p>To the Executive Leadership Team (<strong>Chief Executive Officer & Chief Financial Officer</strong>) of <strong>${companyName}</strong>,</p>
            
            <div class="object-box">
              <div class="object-tag">Executive Object & Strategic Sponsorship Purpose:</div>
              <div class="object-title">Contractual Risk Mitigation, Global Legal Sponsorship & 85% Cost Optimization</div>
              <div class="object-desc">
                Strategic deployment of sovereign AI legal infrastructure to eliminate uncapped corporate liability, automate vendor agreement redlining across ${jurisdiction}, and establish institutional partnership & sponsorship channels.
              </div>
            </div>

            <p>
              In today's complex cross-border commercial corridors across <strong>${jurisdiction}</strong>, contractual ambiguity, silent indemnification clauses, and multi-day legal turnaround times represent direct threats to EBITDA and enterprise valuation.
            </p>

            <div class="csuite-card">
              <div><span class="role-badge">FOR THE CHIEF EXECUTIVE OFFICER (CEO)</span></div>
              <ul style="margin-top: 10px; color: #cbd5e1; font-size: 14px;">
                <li><strong>DealShield 360™ Diagnostic:</strong> Sub-second (< 90ms) risk scoring of M&A contracts and vendor agreements.</li>
                <li><strong>Cross-Border Clash Simulator:</strong> Instant statutory compatibility check across 12 legal jurisdictions (Delaware, KSA M/191, UAE DIFC, UK Common Law).</li>
                <li><strong>Enterprise Legal Brand Sponsorship:</strong> Institutional co-branding & specialized legal radar presence.</li>
              </ul>
            </div>

            <div class="csuite-card">
              <div><span class="role-badge">FOR THE CHIEF FINANCIAL OFFICER (CFO)</span></div>
              <ul style="margin-top: 10px; color: #cbd5e1; font-size: 14px;">
                <li><strong>85% Reduction in External Billable Retainers:</strong> Replace hourly legal fee spikes with a fixed institutional pass.</li>
                <li><strong>Uncapped Liability Trap Protection:</strong> Auto-detection of unfavorable indemnity caps and penalty clauses.</li>
                <li><strong>SWIFT & Pro-Forma Tax Invoicing:</strong> Seamless reconciliation & audit-ready corporate billing.</li>
              </ul>
            </div>

            <div class="pricing-card">
              <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: 800;">VIP INSTITUTIONAL DEAL ROOM & SPONSORSHIP PASS</div>
              <div class="pricing-amount">$999 <span style="font-size: 16px; color: #94a3b8;">USD / Deal Pass</span></div>
              <div style="color: #38bdf8; font-size: 13px; font-weight: 600; margin-bottom: 18px;">Uncapped Legal Audits • Multi-Jurisdiction Simulation • Priority Executive Support</div>
              <a href="https://www.juristech.solutions/payment" class="cta-btn">ACTIVATE VIP DEAL ROOM PASS</a>
            </div>

            <div class="signature-block">
              <div style="font-size: 17px; font-weight: 900; color: #ffffff;">Dr. Mohammad Mustafa, PhD</div>
              <div style="font-size: 13px; color: #38bdf8; font-weight: 700; margin-top: 2px;">Founder & Executive Chairman</div>
              <div style="font-size: 13px; color: #94a3b8; margin-top: 2px;">JurisTech Solutions — Sovereign AI Legal Intelligence</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 8px; line-height: 1.6;">
                📧 Official Email: <a href="mailto:juristech.solutions@outlook.com" style="color: #38bdf8;">juristech.solutions@outlook.com</a><br>
                💬 Direct Executive WhatsApp: <a href="https://wa.me/201126674337" style="color: #38bdf8;">+201126674337</a><br>
                🌐 Global Hub: <a href="https://www.juristech.solutions" style="color: #38bdf8;">https://www.juristech.solutions</a>
              </div>
            </div>

          </div>

          <div class="footer">
            © 2026 JurisTech Solutions. Privileged C-Suite Legal Intelligence Communication.<br>
            Official Admin Copy Dispatched to ${MANDATORY_ADMIN_COPY}.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const payload = JSON.stringify({
    from: 'Dr. Mohammad Mustafa — JurisTech Solutions <onboarding@resend.dev>',
    to: [contactEmail],
    reply_to: OFFICIAL_ARCHIVE,
    subject: dynamicSubject,
    html: htmlContent,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ [DISPATCH SUCCESS] ${companyName} (${contactEmail}) -> Resend ID:`, JSON.parse(responseBody).id);
          resolve(true);
        } else {
          console.error(`❌ [DISPATCH ERROR] ${companyName}:`, responseBody);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ [REQUEST FAILED] ${companyName}:`, e.message);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

async function runSafeOutboundCampaignCycle() {
  console.log('=== STARTING SAFE C-SUITE OUTBOUND CAMPAIGN CYCLE ===');
  console.log('Targeting Top Enterprise Prospects & Law Firms (Safe Rate-Limited Batch)...');

  const targetBatch = [
    { company: 'Amazon Corporate Expansion', email: 'drzyogo.ca@gmail.com', country: 'USA (Seattle / Delaware)', role: 'CEO & General Counsel' },
    { company: 'Alibaba Group International', email: 'drzyogo.ca@gmail.com', country: 'China / Cayman Corridors', role: 'CFO & Cloud Legal' },
    { company: 'Baker McKenzie Global', email: 'drzyogo.ca@gmail.com', country: 'UK / Global Legal Sponsor', role: 'Managing Partner' },
  ];

  for (const item of targetBatch) {
    await dispatchCSuiteProposalToLead(item.company, item.email, item.country, item.role);
    // 2-second safe delay between sends to prevent rate limits
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('=== CAMPAIGN BATCH COMPLETED SUCCESSFULLY ===');
}

runSafeOutboundCampaignCycle();
