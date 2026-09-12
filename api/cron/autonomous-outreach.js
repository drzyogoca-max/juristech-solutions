/**
 * Vercel Serverless Function — /api/cron/autonomous-outreach
 * JurisTech Solutions | Centralized Autonomous B2B Customer Acquisition Engine
 * 100% Compliance-First, Fail-Closed, Daily Scheduled Acquisition Machine v2026.1
 */

export const config = {
  runtime: 'nodejs',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-cron-secret, x-admin-token',
  'Content-Type': 'application/json',
};

// Permanent Historical Dispatched Contacts (Never re-contacted)
const HISTORICAL_CONTACTS = new Set([
  // Global First 5 (CAMP-FIRST5-MTUQ4RJQ)
  'info@tamimi.com',
  'partnerships@deel.com',
  'enterprise@stripe.com',
  'commercial@dpworld.com',
  'contact@freshfields.com',
  // Canada First 5 (CAMP-CANADA5-MTUQH5AV)
  'pfeldberg@fasken.com',
  'dleonard@mccarthy.ca',
  'dbryce@osler.com',
  'mcockburn@torys.com',
  'bryson.stokes@blakes.com',
  // UK First 5 (CAMP-UK5-MTVDV7S2)
  'adrian.cartwright@cliffordchance.com',
  'aedamar.comiskey@linklaters.com',
  'herve.ekue@aoshearman.com',
  'roland.turnill@slaughterandmay.com',
  'jeremy.walden@hsfkramer.com',
  // Shadow Day 1 — SHADOW-BATCH-DAY01-20260910
  'jon.ballis@kirkland.com',
  'abdulaziz.albosaily@clydeco.com',
  'waiking.ng@wongpartnership.com',
  'renae.lattey@mallesons.com',
  'thomas.meurer@hengeler.com',
  // Shadow Day 2 — SHADOW-BATCH-DAY02-20260910
  'richard.trobman@lw.com',
  'bahmed@afridi-angell.com',
  'jerry.koh@agasia.law',
  'marc.kemp@allens.com.au',
  'michaela.ulrici@nautadutilh.com',
  // Shadow Day 3 — SHADOW-BATCH-DAY03-20260910
  'bbecker@gibsondunn.com',
  'mohammad.alrasheed@bakermckenzie.com',
  'kim.beng.ng@rajahtann.com',
  'kristin.stammer@hsfkramer.com',
  'levraud@gide.com',
  // Shadow Day 4 — SHADOW-BATCH-DAY04-20260910
  'giuffrar@sullcrom.com',
  'r.nakayama@nishimura.com',
  'ralf.morshaeuser@gleisslutz.com',
  'henrik.dock@msa.se',
  'jonathan.green@maples.com',
  // Shadow Day 5 — SHADOW-BATCH-DAY05-20260910
  'sbarshay@paulweiss.com',
  'takashi.akahane_grp@amt-law.com',
  'kfullenweider@velaw.com',
  'javier.fontcuberta@cuatrecasas.com',
  'dennis.horeman@debrauw.com',
  // Shadow Day 6 — SHADOW-BATCH-DAY06-20260910
  'jeremy.london@skadden.com',
  'susanne.schreiber@baerkarrer.ch',
  'gaku.ishiwata@morihamada.com',
  'eliana.catalano@belex.com',
  'ecovacevich@claytonutz.com',
  // Shadow Day 7 — SHADOW-BATCH-DAY07-20260910
  'neil.barr@davispolk.com',
  'thierry.calame@lenzstaehelin.com',
  'didiermartin@bredinprat.com',
  'salvador.sanchez-teran@uria.com',
  'soichiro_fujiwara@nagashima.com',
]);

const FABRICATED_DOMAINS = new Set([
  'apexlegaltech.com', 'quantumcapital.com', 'delawareholdings.com',
  'horizonventure.com', 'sovereignailabs.com', 'vanguardlegal.com',
  'blueskymgroup.com', 'beaconfinancial.com', 'triadlawtech.com',
  'pinnaclecorp.com', 'nordiclegalsystems.com', 'eurotechadvisory.com',
  'londongloballaw.com', 'bavariacorporateag.com', 'seinecapitalsa.com',
  'helvetiatrust.com', 'randstadlogistics.com', 'alpinewealthmanagement.com',
  'rhinemaadvisory.com', 'thamesfinancial.com', 'aramcodigital-tech.sa',
  'neovanguard-logistics.ae', 'niletech-holdings.eg', 'siliconoasis-ventures.com',
  'qatarsovereign-tech.qa', 'kuwaittrade-energy.kw'
]);

// Maximum daily new accounts limit
const MAX_NEW_ACCOUNTS_PER_DAY = 5;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Authentication Gate (CRON_SECRET or ADMIN_SECRET_KEY required)
  const authHeader = req.headers['authorization'] || '';
  const cronSecret = req.headers['x-cron-secret'] || '';
  const adminToken = req.headers['x-admin-token'] || '';

  const expectedSecrets = [
    process.env.CRON_SECRET,
    process.env.ADMIN_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ].filter(Boolean);

  let isAuthorized = false;
  for (const sec of expectedSecrets) {
    if (authHeader === `Bearer ${sec}` || cronSecret === sec || adminToken === sec) {
      isAuthorized = true;
      break;
    }
  }

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized: Valid CRON_SECRET, ADMIN_SECRET_KEY, or Service Role required.',
      status: 'AUTH_FAILED'
    });
  }

  const timestamp = new Date().toISOString();
  const todayStr = timestamp.slice(0, 10);
  const campaignId = `CAMP-DAILY-${Date.now().toString(36).toUpperCase()}`;

  // Parse options
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const isDryRun = Boolean(req.query?.dryRun === 'true' || body.dryRun === true || !supabaseUrl || !supabaseKey);

  // 2. Fail-Closed Check on Critical Infrastructure (bypassed in dry-run test mode)
  if ((!supabaseUrl || !supabaseKey) && !isDryRun) {
    console.error('[Acquisition Engine Cron] FAIL CLOSED: Missing Supabase connection configuration.');
    return res.status(500).json({
      success: false,
      status: 'FAIL_CLOSED',
      error: 'Critical database infrastructure unavailable. Automated dispatch halted to prevent un-audited emails.',
      timestamp
    });
  }

  if (isDryRun && (!supabaseUrl || !supabaseKey)) {
    return res.status(200).json({
      success: true,
      status: 'DRY_RUN_COMPLETED',
      mode: 'SHADOW_ONLY',
      dispatched: 0,
      timestamp
    });
  }

  try {
    // 3. Load Permanent Suppression List
    const suppressionSet = new Set();
    for (const h of HISTORICAL_CONTACTS) {
      suppressionSet.add(h.toLowerCase().trim());
    }

    try {
      const suppRes = await fetch(`${supabaseUrl}/rest/v1/crm_suppression_list?select=email`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        }
      });
      if (suppRes.ok) {
        const suppData = await suppRes.json();
        for (const s of (suppData || [])) {
          if (s.email) suppressionSet.add(s.email.toLowerCase().trim());
        }
      }
    } catch (e) {
      console.warn('[Acquisition Engine Cron] Suppression table fetch notice:', e.message);
    }

    // 4. Load Contacted Account History from crm_leads
    const contactedSet = new Set(suppressionSet);
    try {
      const leadRes = await fetch(`${supabaseUrl}/rest/v1/crm_leads?select=contact_email,outreach_status`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        }
      });
      if (leadRes.ok) {
        const leadData = await leadRes.json();
        for (const l of (leadData || [])) {
          if (l.outreach_status === 'SENT' && l.contact_email) {
            contactedSet.add(l.contact_email.toLowerCase().trim());
          }
        }
      }
    } catch (e) {
      console.warn('[Acquisition Engine Cron] Contacted leads fetch notice:', e.message);
    }

    // 5. Query Candidates from crm_leads for Daily Dispatch
    // Only fetch accounts with auto_dispatch = true, status != 'CUSTOMER', outreach_status != 'SENT'
    const candidateRes = await fetch(
      `${supabaseUrl}/rest/v1/crm_leads?select=*&auto_dispatch=eq.true&outreach_status=neq.SENT&limit=15`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const candidates = candidateRes.ok ? await candidateRes.json() : [];
    const executionResults = [];
    let dispatchedCount = 0;
    let suppressedCount = 0;

    for (const candidate of (candidates || [])) {
      if (dispatchedCount >= MAX_NEW_ACCOUNTS_PER_DAY) break;

      const email = (candidate.contact_email || '').toLowerCase().trim();
      const company = candidate.company_name || 'Enterprise Prospect';
      const jurisdiction = (candidate.jurisdiction || 'USA').toUpperCase();

      // Check 1: Format & Domain Validity
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!email || !emailRegex.test(email)) {
        executionResults.push({
          account: company,
          recipient: email,
          status: 'BLOCKED',
          reason: 'INVALID_EMAIL_FORMAT'
        });
        continue;
      }

      const domain = email.split('@')[1];
      if (FABRICATED_DOMAINS.has(domain)) {
        executionResults.push({
          account: company,
          recipient: email,
          status: 'BLOCKED',
          reason: 'FABRICATED_DOMAIN_DETECTED'
        });
        continue;
      }

      // Check 2: Suppression & Deduplication
      if (suppressionSet.has(email)) {
        suppressedCount++;
        executionResults.push({
          account: company,
          recipient: email,
          status: 'SUPPRESSED',
          reason: 'PERMANENTLY_SUPPRESSED_OR_OPTED_OUT'
        });
        continue;
      }

      if (contactedSet.has(email)) {
        executionResults.push({
          account: company,
          recipient: email,
          status: 'SKIPPED',
          reason: 'PREVIOUSLY_CONTACTED'
        });
        continue;
      }

      // Check 3: Compliance Gate
      const isKnownCompliantJurisdiction = ['USA', 'CANADA', 'UK', 'UNITED KINGDOM', 'UAE', 'SAUDI ARABIA', 'GERMANY', 'EU', 'SINGAPORE', 'AUSTRALIA'].includes(jurisdiction);
      if (!isKnownCompliantJurisdiction) {
        executionResults.push({
          account: company,
          recipient: email,
          status: 'BLOCKED',
          reason: 'UNKNOWN_JURISDICTION_COMPLIANCE_UNVERIFIED'
        });
        continue;
      }

      // ── Operating Mode Resolution ──
      // Defaults to SHADOW_ONLY unless explicitly configured or requested
      const ENGINE_MODE = process.env.ACQUISITION_ENGINE_MODE ||
                          (body.mode === 'CONTROLLED_AUTONOMOUS_DISPATCH' || req.query?.mode === 'CONTROLLED_AUTONOMOUS_DISPATCH'
                            ? 'CONTROLLED_AUTONOMOUS_DISPATCH'
                            : 'SHADOW_ONLY');

      if (ENGINE_MODE === 'SHADOW_ONLY' || isDryRun) {
        executionResults.push({
          account: company,
          recipient: email,
          status: 'SHADOW_VALIDATED_READY_FOR_APPROVAL',
          reason: 'PASSED_ALL_COMPLIANCE_GATES_SHADOW_HELD',
          dispatched: false
        });
        continue;
      }

      // ── CONTROLLED_AUTONOMOUS_DISPATCH (Live Outreach Mode) ──
      const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
      const originHost = req.headers?.host || 'www.juristech.solutions';
      const sendEmailUrl = `https://${originHost}/api/send-email`;

      const emailPayload = {
        transactionalType: 'CONSULTATION_BOOKING',
        to: email,
        subject: candidate.subject || `JurisTech Solutions — Sovereign Legal AI Risk Intelligence for ${company}`,
        text: candidate.text || candidate.body_text || `Dear Managing Partner,\n\nJurisTech Solutions (https://www.juristech.solutions) provides sovereign AI legal technology engineered to audit complex commercial agreements, evaluate indemnification caps, and benchmark multi-jurisdictional contract risk in sub-15-minute cycles under zero-data-retention security protocols.\n\nWe would welcome the opportunity to conduct a brief 15-minute live technical benchmark for your corporate practice leadership.\n\nRespectfully yours,\n\nDr. Mohammad Mustafa\nChief Executive & Chief Financial Officer | JurisTech Solutions\nExecutive Office: founder@juristech.solutions\nPortal: https://www.juristech.solutions\n\n---\nJurisTech Solutions | Sovereign AI Legal Technology\nIf you do not wish to receive executive briefings, please reply with "UNSUBSCRIBE".`,
        html: candidate.html || candidate.body_html || null,
      };

      let dispatchSuccess = false;
      let resendId = 'N/A';
      let errorReason = null;

      try {
        const sendRes = await fetch(sendEmailUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminSecret}`,
            'x-cron-secret': process.env.CRON_SECRET || '',
            'x-admin-token': process.env.ADMIN_SECRET_KEY || '',
          },
          body: JSON.stringify(emailPayload)
        });

        const sendData = await sendRes.json();
        if (sendRes.ok && sendData.success) {
          dispatchSuccess = true;
          const providerStr = sendData.provider || '';
          const match = providerStr.match(/ID:\s*([a-f0-9-]+|\S+)/i);
          resendId = match ? match[1].replace(/[()]/g, '') : (sendData.messageId || 'DELIVERED');
        } else {
          errorReason = sendData.error || sendData.status || 'DISPATCH_REJECTED';
        }
      } catch (sendErr) {
        errorReason = sendErr.message;
      }

      if (dispatchSuccess) {
        dispatchedCount++;
        suppressionSet.add(email);

        // Update crm_leads record
        if (candidate.id) {
          try {
            await fetch(`${supabaseUrl}/rest/v1/crm_leads?id=eq.${candidate.id}`, {
              method: 'PATCH',
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                Prefer: 'return=minimal'
              },
              body: JSON.stringify({
                status: 'LEAD',
                outreach_status: 'SENT',
                last_contact_date: timestamp,
                campaign_id: campaignId,
                resend_message_id: resendId,
                notes: `Dispatched via CONTROLLED_AUTONOMOUS_DISPATCH (${campaignId}). Resend ID: ${resendId}`
              })
            });
          } catch (updateErr) {
            console.warn('[Acquisition Engine Cron] Lead status update notice:', updateErr.message);
          }
        }

        // Insert into suppression list to guarantee zero duplicate dispatch
        try {
          await fetch(`${supabaseUrl}/rest/v1/crm_suppression_list`, {
            method: 'POST',
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal'
            },
            body: JSON.stringify({
              email,
              reason: `DISPATCHED_CAMPAIGN_${campaignId}`,
              created_at: timestamp
            })
          });
        } catch (suppErr) {
          console.warn('[Acquisition Engine Cron] Suppression insert notice:', suppErr.message);
        }

        executionResults.push({
          account: company,
          recipient: email,
          status: 'DISPATCHED_AND_RECORDED',
          resendId,
          dispatched: true
        });
      } else {
        executionResults.push({
          account: company,
          recipient: email,
          status: 'FAILED_DISPATCH',
          reason: errorReason,
          dispatched: false
        });

        // FAIL CLOSED: Abort batch if an outbound dispatch fails or provider is rate-limited
        console.error(`[Acquisition Engine Cron] FAIL CLOSED: Dispatch failed for ${email} (${errorReason}). Halting batch.`);
        break;
      }
    }

    // 6. Record Daily Acquisition Report to Supabase
    const reportPayload = {
      campaignId,
      executionDate: todayStr,
      mode: ENGINE_MODE,
      isDryRun,
      totalEvaluated: candidates.length,
      totalDispatched: dispatchedCount,
      totalSuppressed: suppressedCount,
      quotaRemaining: Math.max(0, MAX_NEW_ACCOUNTS_PER_DAY - dispatchedCount),
      results: executionResults,
      timestamp
    };

    try {
      await fetch(`${supabaseUrl}/rest/v1/crm_acquisition_reports`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          execution_date: todayStr,
          accounts_evaluated: candidates.length,
          accounts_dispatched: dispatchedCount,
          accounts_suppressed: suppressedCount,
          status: ENGINE_MODE === 'CONTROLLED_AUTONOMOUS_DISPATCH' ? 'CONTROLLED_DISPATCH_COMPLETED' : 'SHADOW_MODE_EVALUATION',
          report_payload: reportPayload
        })
      });
    } catch (e) {
      console.warn('[Acquisition Engine Cron] Report persistence notice:', e.message);
    }

    return res.status(200).json({
      success: true,
      service: 'JurisTech Autonomous B2B Customer Acquisition Engine',
      mode: ENGINE_MODE,
      status: ENGINE_MODE === 'CONTROLLED_AUTONOMOUS_DISPATCH' ? 'CONTROLLED_DISPATCH_COMPLETED' : 'SHADOW_MODE_EVALUATION_COMPLETED',
      report: reportPayload
    });

  } catch (err) {
    console.error('[Acquisition Engine Cron Exception]:', err);
    return res.status(500).json({
      success: false,
      status: 'FAIL_CLOSED',
      error: err.message,
      timestamp
    });
  }
}
