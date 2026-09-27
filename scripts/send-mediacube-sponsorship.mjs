/**
 * scripts/send-mediacube-sponsorship.mjs
 * JurisTech Solutions | Direct Executive Sponsorship Dispatch to Mediacube (MC Pay)
 */

import nodemailer from 'nodemailer';

async function dispatchMediacubeSponsorship() {
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('🚀 JurisTech Solutions | Mediacube (MC Pay) Strategic Sponsorship Dispatch');
  console.log('─────────────────────────────────────────────────────────────────────────────');

  const recipients = ['partners@mcpay.io'];
  const ccRecipients = ['bd@mediacube.co', 'support@mcpay.io'];
  const adminBcc = ['drzyogo.ca@gmail.com', 'founder@juristech.solutions'];

  console.log(`Primary Recipient: ${recipients.join(', ')}`);
  console.log(`CC Recipient: ${ccRecipients.join(', ')}`);
  console.log(`BCC Admin Copy: ${adminBcc.join(', ')}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'drzyogo.ca@gmail.com',
      pass: 'orkbylzntvfecrmk',
    },
  });

  const subject = '⚖️ Strategic Partnership & Platform Sponsorship Proposal: JurisTech Solutions × Mediacube (MC Pay)';

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #020B1A; color: #f8fafc; padding: 36px; border-radius: 14px; max-width: 720px; margin: 0 auto; border: 1px solid rgba(212,175,55,0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
      <!-- Header -->
      <div style="border-bottom: 2px solid rgba(212,175,55,0.4); padding-bottom: 22px; margin-bottom: 28px; text-align: center;">
        <span style="font-size: 26px; font-weight: 900; color: #D4AF37; letter-spacing: 1.5px;">JurisTech Solutions ⚖️</span>
        <div style="display: inline-block; margin-left: 10px; padding: 2px 8px; border-radius: 4px; background: rgba(16,185,129,0.2); color: #10B981; font-size: 11px; font-weight: 700;">STRATEGIC PARTNERSHIP</div>
        <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0;">Sovereign AI Legal Intelligence & Multi-Jurisdictional Contract Architecture</p>
      </div>

      <!-- Body Content -->
      <div style="font-size: 15px; line-height: 1.75; color: #e2e8f0;">
        <p style="margin-top: 0;">Dear <strong>Mediacube & MC Pay Leadership Team</strong>,</p>
        
        <p>I am writing to you directly on behalf of <a href="https://www.juristech.solutions" style="color: #D4AF37; font-weight: bold; text-decoration: none;">JurisTech Solutions</a>, the sovereign AI legal intelligence and contract engineering platform.</p>
        
        <p>We have closely followed Mediacube and MC Pay's impressive leadership in creator fintech, offering creators and digital enterprises rapid multi-currency payouts (USDT, SWIFT, SEPA) and innovative financial tools. Your ecosystem represents the gold standard for creator economy payments.</p>

        <p>As JurisTech Solutions expands across 15+ legal frameworks (including US Delaware/UCC, UK/EU GDPR, UAE DIFC/ADGM, and Saudi Arabia), we serve enterprise clients, corporate legal teams, agencies, and high-earning digital creators managing cross-border transactions and contract security.</p>

        <div style="background: rgba(212,175,55,0.08); border-left: 4px solid #D4AF37; padding: 18px 22px; border-radius: 8px; margin: 24px 0;">
          <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 17px;">Formal Sponsorship & Strategic Partnership Proposal</h3>
          <p style="margin: 0; color: #cbd5e1; font-size: 14px;">We are formally inviting Mediacube (MC Pay) to become a Premier Official Sponsor of the JurisTech Solutions platform, connecting your financial services directly with our corporate and international creator audience.</p>
        </div>

        <h4 style="color: #10B981; margin: 24px 0 12px 0; font-size: 16px;">Available Sponsorship Formats:</h4>

        <!-- Tier 1 -->
        <div style="background: #0D1F3C; border: 1px solid rgba(212,175,55,0.25); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #D4AF37; font-size: 15px;">Tier 1: Global Platform & Navigation Header Co-Sponsor</strong>
            <span style="background: #D4AF37; color: #020B1A; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">HIGH IMPACT</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #cbd5e1; line-height: 1.6;">
            <li>Prominent "Official FinTech & Payout Partner" badge in the main site header across the platform (<a href="https://www.juristech.solutions" style="color: #38bdf8;">www.juristech.solutions</a>).</li>
            <li>Dedicated placement across all high-traffic tools: Contract Analysis, Deal Shield, Legal Risk Radar, and Vault.</li>
            <li>Direct tracking button directing users to MC Pay onboarding (<a href="http://link.mcpay.io/HPouWTt" style="color: #38bdf8;">link.mcpay.io/HPouWTt</a>).</li>
          </ul>
        </div>

        <!-- Tier 2 -->
        <div style="background: #0D1F3C; border: 1px solid rgba(16,185,129,0.25); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #10B981; font-size: 15px;">Tier 2: Co-Branded Deal Shield & Creator Escrow Protection</strong>
            <span style="background: #10B981; color: #020B1A; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">FINTECH EMBED</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #cbd5e1; line-height: 1.6;">
            <li>Integration inside JurisTech's Deal Shield contract audit module as the recommended international payout and secure settlement provider.</li>
            <li>Co-branded protection for influencer contracts, agency deals, and talent agreements.</li>
          </ul>
        </div>

        <!-- Tier 3 -->
        <div style="background: #0D1F3C; border: 1px solid rgba(56,189,248,0.25); border-radius: 10px; padding: 18px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #38bdf8; font-size: 15px;">Tier 3: Executive Video Hub & Production Sponsorship</strong>
            <span style="background: #38bdf8; color: #020B1A; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">MEDIA REACH</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #cbd5e1; line-height: 1.6;">
            <li>Dedicated sponsor credit in our daily automated morning & evening video releases on YouTube and social networks.</li>
            <li>Feature spotlights highlighting MC Pay's instant crypto and fiat payout benefits.</li>
          </ul>
        </div>

        <p>We are prepared to immediately deploy your branding across our portal and welcome the opportunity to discuss custom terms, rev-share co-marketing, or tier specifications that best align with Mediacube's Q4 2026 expansion goals.</p>

        <p>Would your business development or partnerships leadership be available for a brief 15-minute introductory video call this week?</p>

        <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #1e293b;">
          <p style="margin-bottom: 4px;">Respectfully yours,</p>
          <p style="margin-top: 0; color: #D4AF37; font-weight: 800; font-size: 17px;">Dr. Mohammad Mustafa</p>
          <p style="margin-top: -6px; font-size: 13.5px; color: #94a3b8; line-height: 1.5;">
            Founder & Chairman | AI Risk Architect<br/>
            <strong>JurisTech Solutions</strong> — <a href="https://www.juristech.solutions" style="color: #10B981; text-decoration: none;">www.juristech.solutions</a><br/>
            Executive Desk: <a href="mailto:founder@juristech.solutions" style="color: #93c5fd;">founder@juristech.solutions</a><br/>
            Direct Line / WhatsApp: <strong>+201126674337</strong>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 18px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
        JurisTech Solutions ⚖️ | Sovereign Multi-Jurisdictional AI Legal Technology<br/>
        Global Hubs: DIFC Dubai • Riyadh • Delaware • London<br/>
        Confidential Institutional Partnership Inquiry — All Rights Reserved 2026
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Dr. Mohammad Mustafa — JurisTech Solutions" <drzyogo.ca@gmail.com>',
      to: recipients.join(', '),
      cc: ccRecipients.join(', '),
      bcc: adminBcc.join(', '),
      replyTo: 'founder@juristech.solutions',
      subject: subject,
      html: htmlContent,
    });

    console.log('✅ DISPATCH SUCCESSFUL!');
    console.log('Message ID:', info.messageId);
    console.log('Accepted Recipients:', info.accepted);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ DISPATCH ERROR:', err.message);
  }
}

dispatchMediacubeSponsorship();
