import { callAI } from '../lib/api';
import { dispatchReceiptEmail } from '../lib/emailNotifier';
import { dispatchWhatsAppNotification } from './engine-ai';
import { supabase } from '../lib/supabaseClient';

export interface B2BLead {
  id: string;
  companyName: string;
  contactEmail: string;
  country: string;
  sectorInterest: string;
  leadScore: number;
  nativeLanguage: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';
  status: 'New' | 'Outreach_Sent' | 'Converted' | 'Disqualified';
}

export interface ClientDataPayload {
  name: string;
  requirement: string;
  language: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr' | string;
  email: string;
  jurisdiction?: string;
}

/**
 * AI Autonomous Proposal Generator & Multi-Target Dispatcher Engine
 * Developed for JurisTech Solutions (https://juristech.solutions)
 * 100% English Executive Proposals with Dynamic Needs Synthesis & Official Seal
 * Zero-Human Intervention Autonomous Outreach
 */
/**
 * AI Autonomous Proposal Generator & Multi-Target Dispatcher Engine
 * Developed for JurisTech Solutions (https://www.juristech.solutions)
 * 100% Pure Corporate English Executive Proposals for CEOs & CFOs
 * Zero-Human Intervention Autonomous Outreach
 */
export const generateAndDispatchOffer = async (clientData: ClientDataPayload): Promise<{ success: boolean; generatedHtml: string; messageId?: string }> => {
  const { name, requirement, email, jurisdiction } = clientData;
  console.log(`[AI Dispatcher Engine] 🚀 Triggering C-Suite executive proposal for: ${name} (${email}) | Jurisdiction: ${jurisdiction || 'Global'}`);

  // 1. Executive Subject Line for CEO & CFO
  const dynamicSubject = `CONFIDENTIAL & PRIVILEGED: Strategic Legal AI Infrastructure & Financial Risk Mitigation for ${name} | JurisTech Solutions`;

  // 2. Pure Corporate English Executive Proposal (CEO & CFO Focus)
  const buildLuxuryProposalHtml = (clientName: string, req: string, targetJurisdiction: string) => `
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
        
        .csuite-grid { margin: 28px 0; }
        .csuite-card { background: #111c33; border: 1px solid #1e293b; border-radius: 12px; padding: 20px 22px; margin-bottom: 16px; }
        .csuite-card-header { display: flex; align-items: center; margin-bottom: 10px; }
        .role-badge { background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; margin-right: 10px; }
        .card-heading { font-size: 15px; font-weight: 700; color: #ffffff; }
        .csuite-list { margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; color: #cbd5e1; }
        .csuite-list li { margin-bottom: 8px; }
        
        .pricing-card { background: linear-gradient(145deg, #0b172d 0%, #071020 100%); border: 1px solid #0284c7; border-radius: 14px; padding: 28px; text-align: center; margin: 32px 0; box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.25); }
        .pricing-title { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; }
        .pricing-amount { font-size: 34px; font-weight: 900; color: #ffffff; margin: 10px 0 6px 0; }
        .pricing-sub { color: #38bdf8; font-size: 13px; font-weight: 600; margin-bottom: 18px; }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 15px 36px; border-radius: 10px; letter-spacing: 0.5px; box-shadow: 0 4px 18px rgba(6, 182, 212, 0.45); }
        
        .signature-block { margin-top: 40px; padding-top: 28px; border-top: 1px solid #1e293b; }
        .sig-name { font-size: 17px; font-weight: 900; color: #ffffff; letter-spacing: -0.3px; }
        .sig-title { font-size: 13px; color: #38bdf8; font-weight: 700; margin-top: 2px; }
        .sig-org { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        .sig-contact { font-size: 13px; color: #64748b; margin-top: 8px; line-height: 1.6; }
        
        .seal-box { display: inline-block; border: 1.5px dashed #06b6d4; border-radius: 8px; padding: 12px 18px; color: #38bdf8; font-size: 11px; font-family: monospace; letter-spacing: 1.2px; margin-top: 18px; background: rgba(6, 182, 212, 0.04); }
        .footer { background: #070b14; padding: 24px 36px; text-align: center; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          
          <!-- Header -->
          <div class="header">
            <div class="badge">CONFIDENTIAL & PRIVILEGED EXECUTIVE BRIEFING</div>
            <h1 class="title">JurisTech Solutions ⚖️</h1>
            <div class="subtitle">Autonomous Legal Intelligence & Enterprise Contract Risk Infrastructure</div>
          </div>
          
          <!-- Content Body -->
          <div class="content">
            <p>To the Executive Leadership Team (<strong>Chief Executive Officer & Chief Financial Officer</strong>) of <strong>${clientName}</strong>,</p>
            
            <!-- Strategic Object / Objective -->
            <div class="object-box">
              <div class="object-tag">Executive Object & Purpose:</div>
              <div class="object-title">Contractual Risk Mitigation & 85% Legal Cost Optimization</div>
              <div class="object-desc">
                Strategic deployment of sovereign AI legal infrastructure to eliminate uncapped corporate liability, automate vendor agreement redlining, and replace unpredictable external billable retainers with a predictable institutional annual pass.
              </div>
            </div>

            <p>
              In today's complex regulatory environment across <strong>${targetJurisdiction || 'Global Commercial Corridors'}</strong>, contractual ambiguity, silent indemnification clauses, and multi-day legal turnaround times represent direct threats to enterprise enterprise EBITDA and shareholder value.
            </p>
            
            <p>
              <strong>JurisTech Solutions</strong> equips your C-Suite and internal counsel with an elite, sovereign AI legal co-pilot engineered to address the specific mandates of your C-level officers:
            </p>

            <!-- C-Suite Value Proposition Grid -->
            <div class="csuite-grid">
              
              <!-- CEO Value -->
              <div class="csuite-card">
                <div class="csuite-card-header">
                  <span class="role-badge">For the CEO & Board</span>
                  <span class="card-heading">Governance & Rapid Deal Execution</span>
                </div>
                <ul class="csuite-list">
                  <li><strong>Instant Deal Velocity:</strong> Review, audit, and negotiate complex commercial agreements and M&A terms in seconds instead of weeks.</li>
                  <li><strong>Total Governance Assurance:</strong> Comprehensive statutory compliance across US Delaware, UK Common Law, EU Regulations, Saudi Civil Transactions Law, UAE DIFC/ADGM, Egypt, and Jordan.</li>
                  <li><strong>24/7 AI Strategic Negotiation Co-Pilot:</strong> Game-theoretic counter-offer synthesis ensuring maximum bargaining leverage in all cross-border transactions.</li>
                </ul>
              </div>

              <!-- CFO Value -->
              <div class="csuite-card">
                <div class="csuite-card-header">
                  <span class="role-badge" style="background: #10b981;">For the CFO & Finance</span>
                  <span class="card-heading">Liability Elimination & 85% Cost Reduction</span>
                </div>
                <ul class="csuite-list">
                  <li><strong>Strict Liability Capping:</strong> Automated detection and neutral redlining of uncapped indemnities, one-sided warranties, and silent financial penalties.</li>
                  <li><strong>Direct P&L Impact:</strong> Replaces $350–$850/hr external legal retainer fees with an all-inclusive institutional subscription.</li>
                  <li><strong>Mega-Repository Asset:</strong> Immediate unrestricted access to over 1,000,000+ verified, enforceable bilingual contract templates and governance instruments.</li>
                </ul>
              </div>

            </div>

            <!-- Pricing & Executive Onboarding Tier -->
            <div class="pricing-card">
              <div class="pricing-title">Institutional Enterprise Partnership Tier</div>
              <div class="pricing-amount">$5,000 – $10,000 <span style="font-size: 16px; color: #94a3b8; font-weight: normal;">/ Annual Enterprise Pass</span></div>
              <div class="pricing-sub">✓ Unlimited C-Suite Seats • Complete 1M+ Contract Vault • Instant Autonomous Audits</div>
              <a href="https://www.juristech.solutions" class="cta-btn">Access Enterprise Infrastructure & Deploy AI &rarr;</a>
            </div>

            <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">
              To discuss institutional integration or arrange a private demonstration for your executive committee, you may reply directly to this communication or contact our executive office.
            </p>

            <!-- Formal Executive Signature Block signed by Dr. Mohammad CFO -->
            <div class="signature-block">
              <div class="sig-name">Dr. Mohammad Mustafa</div>
              <div class="sig-title">Chief Executive & Chief Financial Officer (CEO / CFO)</div>
              <div class="sig-org">JurisTech Solutions | Sovereign AI Legal & Risk Infrastructure</div>
              <div class="sig-contact">
                <strong>Executive Contact:</strong> <a href="mailto:drzyogo.ca@gmail.com" style="color: #38bdf8; text-decoration: none;">drzyogo.ca@gmail.com</a> | <a href="mailto:juristech.solutions@outlook.com" style="color: #38bdf8; text-decoration: none;">juristech.solutions@outlook.com</a><br>
                <strong>Official Portal:</strong> <a href="https://www.juristech.solutions" style="color: #38bdf8; text-decoration: none;">https://www.juristech.solutions</a>
              </div>
              
              <div class="seal-box">
                OFFICIAL DIGITAL CERTIFICATE: JTS-CFO-AUTH-2026<br>
                STATUS: DIGITALLY AUTHENTICATED & SIGNED BY DR. MOHAMMAD MUSTAFA (CFO / CEO)
              </div>
            </div>

          </div>
          
          <!-- Footer -->
          <div class="footer">
            &copy; ${new Date().getFullYear()} JurisTech Solutions. All rights reserved.<br>
            Privileged & confidential executive communication intended exclusively for the addressed entity.
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  let finalHtml = buildLuxuryProposalHtml(name, requirement, jurisdiction || 'Global Commercial Corridor');

  try {
    // 1. Direct HTTP Dispatch via /api/send-email with mandatory Admin BCC copy
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        bcc: ['drzygo.ca@gmail.com', 'juristech.solutions@outlook.com'],
        adminCopy: 'drzygo.ca@gmail.com',
        replyTo: 'juristech.solutions@outlook.com',
        subject: dynamicSubject,
        text: `CONFIDENTIAL EXECUTIVE PROPOSAL FOR ${name.toUpperCase()}\n\nOBJECT: Strategic Legal AI Infrastructure & Financial Risk Mitigation\n\nAddressed to: Chief Executive Officer & Chief Financial Officer\nOffered by: Dr. Mohammad Mustafa, Chairman & Chief Legal Architect | JurisTech Solutions\n\nExecutive Inquiries: juristech.solutions@outlook.com\nOfficial Portal: https://www.juristech.solutions`,
        html: finalHtml,
      }),
    });


    // 2. Audit Logging in Supabase
    try {
      await supabase.from('chat_messages').insert({
        content: `[C-SUITE EXECUTIVE OUTREACH] Dispatched to CEO/CFO of ${name} (${email}) | Subject: ${dynamicSubject}`,
        role: 'system',
      });
    } catch (e) {}

    // 3. WhatsApp Executive Notification
    await dispatchWhatsAppNotification({
      eventType: 'HIGH_TICKET_PROPOSAL',
      clientEmail: email,
      planOrService: `C-Suite Proposal to CEO/CFO of ${name} ($5K-$10K ARR)`,
      amountUSD: 5000,
      referenceId: `EXEC-OUT-${Date.now().toString().slice(-6)}`,
    });

    return {
      success: res.ok,
      generatedHtml: finalHtml,
      messageId: `MSG-EXEC-${Date.now()}`,
    };
  } catch (err) {
    console.error('[AI Dispatcher Engine] Error during executive offer dispatch:', err);
    return {
      success: false,
      generatedHtml: finalHtml,
    };
  }
};

/**
 * Automates B2B Proposal Generation & Email Dispatch via AI
 */
export async function triggerAutomatedB2BOutreach(lead: B2BLead): Promise<boolean> {
  const result = await generateAndDispatchOffer({
    name: lead.companyName,
    requirement: lead.sectorInterest,
    language: 'en',
    email: lead.contactEmail,
    jurisdiction: lead.country,
  });

  return result.success;
}
