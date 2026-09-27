/**
 * Vercel Serverless Function — /api/partnerships/sponsor-mediacube
 * JurisTech Solutions | Strategic Partnership & Sponsorship Outreach to Mediacube (MC Pay)
 *
 * Targets:
 *   - Primary: partners@mcpay.io
 *   - CC/Secondary: bd@mediacube.co, support@mcpay.io
 *   - Executive Sender: Dr. Mohammad Mustafa <founder@juristech.solutions>
 */

import { processEmailDispatch } from '../send-email.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-cron-secret, x-admin-token',
  'Content-Type': 'application/json',
};

export const MEDIACUBE_PARTNERSHIP_PROPOSAL = {
  recipient: 'partners@mcpay.io',
  ccRecipients: ['bd@mediacube.co', 'support@mcpay.io'],
  companyName: 'Mediacube / MC Pay',
  referralLink: 'http://link.mcpay.io/HPouWTt',
  website: 'https://mcpay.io',
  subject: 'Strategic Partnership & Platform Sponsorship Proposal: JurisTech Solutions ⚖️ × Mediacube (MC Pay)',
  textBody: `Dear Mediacube & MC Pay Leadership Team,

I am writing to you directly on behalf of JurisTech Solutions (https://www.juristech.solutions), the sovereign AI legal intelligence and contract engineering platform.

We have closely observed Mediacube and MC Pay's rapid ascent as the premier international financial technology and payout ecosystem for digital creators, YouTube partners, and global media enterprises. Your instant multi-currency payout infrastructure (USDT, SWIFT, SEPA) is setting the benchmark for the creator economy.

As JurisTech Solutions expands its institutional footprint across 15+ legal frameworks (United States Delaware/UCC, UK/EU GDPR, UAE DIFC/ADGM, and Saudi Arabia), we work directly with corporate entities, agencies, production houses, and high-earning digital creators on multi-jurisdictional contract risk, IP licensing, and financial security.

We are formally proposing a Strategic Partnership & Platform Sponsorship between JurisTech Solutions and Mediacube (MC Pay), featuring the following high-visibility sponsorship formats:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GLOBAL PLATFORM & NAVIGATION HEADER CO-SPONSOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Exclusive placement as the "Official FinTech & Creator Payout Partner" in the top header and navigation bar of the JurisTech platform (https://www.juristech.solutions).
• Prominent co-branded badge visible across all high-traffic tools: AI Contract Analysis, Deal Shield, Legal Risk Radar, and Encrypted Document Vault.
• Direct click-through integration guiding enterprise clients, international agencies, and creators directly to MC Pay onboarding (http://link.mcpay.io/HPouWTt).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CO-BRANDED DEAL SHIELD & CREATOR ESCROW PROTECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Integration of MC Pay inside JurisTech's proprietary Deal Shield module as the recommended financial escrow and payout channel for media, talent representation, and advertising agreements.
• Joint protection: JurisTech audits and validates contract terms, while MC Pay secures the settlement and multi-currency payout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. EXECUTIVE VIDEO HUB & PRODUCTION SPONSORSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Dedicated sponsor credits across our daily automated video productions (Morning YouTube Shorts & Evening Platform Masterclasses) reaching global business audiences and creators.
• Special co-branded feature spotlighting MC Pay's cross-border financial advantages for international creators.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We are prepared to immediately deploy your branding across our portal and welcome the opportunity to discuss custom terms, rev-share co-marketing, or tier specifications that best align with Mediacube's Q4 2026 expansion goals.

Would your business development or partnerships leadership be available for a brief 15-minute introductory video call this week?

Respectfully yours,

Dr. Mohammad Mustafa
Founder & Chairman | AI Risk Architect
JurisTech Solutions
Executive Desk: founder@juristech.solutions
Official Portal: https://www.juristech.solutions
Direct Line / WhatsApp: +201126674337

---
JurisTech Solutions | Sovereign Multi-Jurisdictional AI Legal Technology
Global Offices: DIFC (Dubai) | Riyadh | Delaware | London
Confidential Partnership Inquiry`,

  htmlBody: `
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
  `,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-cron-secret, x-admin-token');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const timestamp = new Date().toISOString();
  const proposal = MEDIACUBE_PARTNERSHIP_PROPOSAL;

  try {
    console.log(`[Partnership Outreach] Initiating formal sponsorship proposal to ${proposal.recipient}...`);

    // 1. Dispatch to primary partnership email
    const dispatchResult = await processEmailDispatch(
      proposal.recipient,
      proposal.subject,
      proposal.textBody,
      proposal.htmlBody,
      'founder@juristech.solutions',
      true // forceSend for authorized high-priority strategic outreach
    );

    // 2. Dispatch copies to secondary BD contacts
    const ccResults = [];
    for (const ccEmail of proposal.ccRecipients) {
      try {
        const ccRes = await processEmailDispatch(
          ccEmail,
          `[PARTNERSHIP PROPOSAL] ${proposal.subject}`,
          proposal.textBody,
          proposal.htmlBody,
          'founder@juristech.solutions',
          true
        );
        ccResults.push({ email: ccEmail, success: ccRes.success, provider: ccRes.provider });
      } catch (ccErr) {
        ccResults.push({ email: ccEmail, success: false, error: ccErr.message });
      }
    }

    // 3. Log into Supabase if configured
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/crm_leads`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            company_name: 'Mediacube / MC Pay',
            client_name: 'Partnerships & Business Development',
            contact_email: proposal.recipient,
            jurisdiction: 'Cyprus / International',
            status: 'PROPOSAL SENT',
            outreach_status: 'SENT',
            notes: 'Strategic Platform Sponsorship & Co-Branding proposal dispatched with 3 available tiers.',
            last_contact_date: timestamp,
          }),
        });
      } catch (dbErr) {
        console.warn('[Partnership Outreach] Supabase CRM log notice:', dbErr.message);
      }
    }

    const responsePayload = {
      success: true,
      service: 'JurisTech Strategic Partnership & Sponsorship Outreach',
      targetCompany: 'Mediacube (MC Pay)',
      recipient: proposal.recipient,
      ccRecipients: proposal.ccRecipients,
      subject: proposal.subject,
      primaryDispatch: dispatchResult,
      ccDispatches: ccResults,
      tiersOffered: [
        'Tier 1: Global Platform & Navigation Header Co-Sponsor',
        'Tier 2: Co-Branded Deal Shield & Creator Escrow Protection',
        'Tier 3: Executive Video Hub & Production Sponsorship',
      ],
      trackingContact: 'founder@juristech.solutions',
      timestamp,
    };

    console.log('[Partnership Outreach] Completed successfully:', JSON.stringify(responsePayload));
    return res.status(200).json(responsePayload);
  } catch (err) {
    console.error('[Partnership Outreach Exception]:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      timestamp,
    });
  }
}
