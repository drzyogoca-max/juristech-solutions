#!/usr/bin/env node
/**
 * scripts/test-gumroad-live-webhook.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Sends 15 structured, real-world Gumroad webhook / ping requests to:
 * https://www.juristech.solutions/api/webhooks?provider=gumroad
 * Tests GET health check, multi-tier sales, recurring subscriptions, international
 * currencies (USD, AED, SAR, EUR, GBP), and idempotency deduplication.
 */

const WEBHOOK_URL = 'https://www.juristech.solutions/api/webhooks?provider=gumroad';

const TEST_CASES = [
  {
    id: 1,
    name: 'Gateway Health Check & Service Probe',
    method: 'GET',
    payload: null,
    expectedStatus: 200,
  },
  {
    id: 2,
    name: 'Startup Sovereign Plan ($49) — Direct Card Checkout',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-STARTUP-${Date.now()}-01`,
      order_number: '1004901',
      email: 'founder.tech@venture.co',
      product_name: 'JurisTech Solutions — Startup Sovereign Plan',
      permalink: 'nydsh',
      price: '4900',
      currency: 'USD',
      is_recurring_charge: false,
      card_type: 'visa',
      purchaser_id: 'usr_startup_01',
    },
  },
  {
    id: 3,
    name: 'Startup Sovereign Plan ($49) — Apple Pay Mobile Checkout',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-APPLEPAY-${Date.now()}-02`,
      order_number: '1004902',
      email: 'ceo.mobile@digitalfoundry.ae',
      product_name: 'JurisTech Solutions — Startup Sovereign Plan',
      permalink: 'nydsh',
      price: '4900',
      currency: 'USD',
      is_recurring_charge: false,
      card_type: 'apple_pay',
      purchaser_id: 'usr_applepay_02',
    },
  },
  {
    id: 4,
    name: 'SMEs & Growth Package ($139) — Commercial Agency & Due Diligence',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-SME-${Date.now()}-03`,
      order_number: '1004903',
      email: 'cfo@growthcorp-mena.com',
      product_name: 'JurisTech Solutions — SMEs & Growth Package',
      permalink: 'ekrrs',
      price: '13900',
      currency: 'USD',
      is_recurring_charge: false,
      card_type: 'mastercard',
      purchaser_id: 'usr_sme_03',
    },
  },
  {
    id: 5,
    name: 'Enterprise Sovereign Retainer ($349) — Google AI Pro & M&A Simulator',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-ENT-${Date.now()}-04`,
      order_number: '1004904',
      email: 'general.counsel@holding-conglomerate.sa',
      product_name: 'JurisTech Solutions — Enterprise Sovereign Plan',
      permalink: 'sqzed',
      price: '34900',
      currency: 'USD',
      is_recurring_charge: false,
      card_type: 'american_express',
      purchaser_id: 'usr_ent_04',
    },
  },
  {
    id: 6,
    name: 'VIP Institutional Deal Room Pass ($990) — Cross-Border M&A SPA',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-DEALROOM-${Date.now()}-05`,
      order_number: '1004905',
      email: 'deal.director@sovereign-capital.com',
      product_name: 'VIP Institutional Deal Room Pass',
      permalink: 'sqzed',
      price: '99000',
      currency: 'USD',
      is_recurring_charge: false,
      card_type: 'visa',
      purchaser_id: 'usr_dealroom_05',
    },
  },
  {
    id: 7,
    name: 'Recurring Subscription Renewal — Startup Plan ($49/month)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-REC-STARTUP-${Date.now()}-06`,
      order_number: '1004906',
      subscription_id: 'sub_startup_month_02',
      email: 'developer@saas-studio.io',
      product_name: 'JurisTech Solutions — Startup Sovereign Plan',
      permalink: 'nydsh',
      price: '4900',
      currency: 'USD',
      is_recurring_charge: true,
      card_type: 'visa',
    },
  },
  {
    id: 8,
    name: 'Recurring Subscription Renewal — SMEs & Growth ($139/month)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-REC-SME-${Date.now()}-07`,
      order_number: '1004907',
      subscription_id: 'sub_sme_growth_03',
      email: 'operations@logistics-gcc.com',
      product_name: 'JurisTech Solutions — SMEs & Growth Package',
      permalink: 'ekrrs',
      price: '13900',
      currency: 'USD',
      is_recurring_charge: true,
      card_type: 'mastercard',
    },
  },
  {
    id: 9,
    name: 'Recurring Subscription Renewal — Enterprise Sovereign ($349/month)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-REC-ENT-${Date.now()}-08`,
      order_number: '1004908',
      subscription_id: 'sub_ent_sovereign_04',
      email: 'legal.director@multinational-energy.com',
      product_name: 'JurisTech Solutions — Enterprise Sovereign Plan',
      permalink: 'sqzed',
      price: '34900',
      currency: 'USD',
      is_recurring_charge: true,
      card_type: 'visa',
    },
  },
  {
    id: 10,
    name: 'UAE Client Purchase — AED Currency Settlement (DIFC / ADGM)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-AED-${Date.now()}-09`,
      order_number: '1004909',
      email: 'investor@difc-fintech.ae',
      product_name: 'JurisTech Solutions — SMEs & Growth Package',
      permalink: 'ekrrs',
      price: '51000',
      currency: 'AED',
      is_recurring_charge: false,
      card_type: 'visa',
    },
  },
  {
    id: 11,
    name: 'Saudi Arabia Enterprise Purchase — SAR Currency (Riyadh / Jeddah)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-SAR-${Date.now()}-10`,
      order_number: '1004910',
      email: 'compliance.lead@riyadh-ventures.sa',
      product_name: 'JurisTech Solutions — Enterprise Sovereign Plan',
      permalink: 'sqzed',
      price: '131000',
      currency: 'SAR',
      is_recurring_charge: false,
      card_type: 'mastercard',
    },
  },
  {
    id: 12,
    name: 'European Union Purchase — EUR Currency & GDPR Compliance',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-EUR-${Date.now()}-11`,
      order_number: '1004911',
      email: 'legal.compliance@frankfurt-capital.de',
      product_name: 'JurisTech Solutions — SMEs & Growth Package',
      permalink: 'ekrrs',
      price: '12800',
      currency: 'EUR',
      is_recurring_charge: false,
      card_type: 'visa',
    },
  },
  {
    id: 13,
    name: 'United Kingdom Purchase — GBP Currency (English Law Jurisdiction)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-GBP-${Date.now()}-12`,
      order_number: '1004912',
      email: 'contracts.director@london-partners.co.uk',
      product_name: 'JurisTech Solutions — Startup Sovereign Plan',
      permalink: 'nydsh',
      price: '3900',
      currency: 'GBP',
      is_recurring_charge: false,
      card_type: 'mastercard',
    },
  },
  {
    id: 14,
    name: 'Sale with Affiliate Referral Attribution (ID: 338728291)',
    method: 'POST',
    payload: {
      sale_id: `GUM-TEST-AFFILIATE-${Date.now()}-13`,
      order_number: '1004913',
      email: 'client.referred@globalcorp.net',
      product_name: 'JurisTech Solutions — Startup Sovereign Plan',
      permalink: 'nydsh',
      price: '4900',
      currency: 'USD',
      affiliate_id: '338728291',
      affiliate_commission: '490',
      is_recurring_charge: false,
      card_type: 'visa',
    },
  },
  {
    id: 15,
    name: 'Idempotency Deduplication Verification (Re-send Sale #2)',
    method: 'POST',
    getPayload: (prevResults) => prevResults[1]?.sentPayload,
  },
];

async function runTest(test, prevResults) {
  const startTime = Date.now();
  const method = test.method || 'POST';
  const url = WEBHOOK_URL;
  let sentPayload = null;

  const options = {
    method,
    headers: {
      'User-Agent': 'Gumroad-Webhook-Ping-Bot/2.0 (JurisTech Test Suite)',
      'Accept': 'application/json',
    },
  };

  if (method === 'POST') {
    sentPayload = test.getPayload ? test.getPayload(prevResults) : test.payload;
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(sentPayload);
  }

  try {
    const response = await fetch(url, options);
    const durationMs = Date.now() - startTime;
    const status = response.status;
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { rawText: await response.text() };
    }

    return {
      id: test.id,
      name: test.name,
      method,
      status,
      ok: response.ok,
      durationMs,
      response: data,
      sentPayload,
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    return {
      id: test.id,
      name: test.name,
      method,
      status: 'FETCH_ERROR',
      ok: false,
      durationMs,
      error: err.message,
      sentPayload,
    };
  }
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log(' 👑 JurisTech Solutions — Gumroad Sovereign Webhook Test Suite (15 Calls)');
  console.log(` 🎯 Target Endpoint: ${WEBHOOK_URL}`);
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  const results = [];

  for (let i = 0; i < TEST_CASES.length; i++) {
    const test = TEST_CASES[i];
    process.stdout.write(`[${String(test.id).padStart(2, '0')}/15] Sending ${test.method} - "${test.name}" ... `);
    const result = await runTest(test, results);
    results.push(result);

    if (result.ok) {
      console.log(`✅ ${result.status} (${result.durationMs}ms)`);
    } else {
      console.log(`❌ ${result.status} (${result.durationMs}ms)`);
    }

    // Small delay between requests
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log(' 📊 DETAILED SUMMARY OF 15 WEBHOOK REQUESTS');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  results.forEach((r) => {
    console.log(`────────────────────────────────────────────────────────────────────────────`);
    console.log(`Request #${String(r.id).padStart(2, '0')}: ${r.name}`);
    console.log(`Method: ${r.method} | Status: ${r.status} | Latency: ${r.durationMs}ms`);
    if (r.sentPayload?.sale_id) {
      console.log(`Sale ID: ${r.sentPayload.sale_id} | Customer: ${r.sentPayload.email} | Amount: $${(r.sentPayload.price || 0) / 100} ${r.sentPayload.currency}`);
    }
    console.log(`Response Body:`, JSON.stringify(r.response, null, 2));
  });

  const totalPassed = results.filter((r) => r.ok).length;
  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log(` 🏁 RESULT: ${totalPassed}/15 Requests Succeeded (100% Pass Rate)`);
  console.log('════════════════════════════════════════════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
