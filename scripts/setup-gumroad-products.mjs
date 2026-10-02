#!/usr/bin/env node
/**
 * scripts/setup-gumroad-products.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Autonomous Gumroad Product Setup & Link Provisioning
 * Automatically creates sovereign subscription tiers on Gumroad via REST API.
 * Merchant of Record (MoR) — Zero Company Registration Required.
 *
 * Usage:
 *   node scripts/setup-gumroad-products.mjs <GUMROAD_ACCESS_TOKEN>
 *   or set GUMROAD_ACCESS_TOKEN in your environment.
 */

const token = process.argv[2] || process.env.GUMROAD_ACCESS_TOKEN;

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log(' 👑 JurisTech Solutions — Gumroad Sovereign Products Automation');
console.log('    100% Real Live MoR Card Checkout (Visa/Mastercard/Amex/Apple Pay)');
console.log('    Zero Company Registration Required');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (!token) {
  console.log(`ℹ️  No Gumroad Access Token provided.`);
  console.log(`
To automatically create all 3 products via API in 5 seconds:
─────────────────────────────────────────────────────────────────────────────
1. Log in to your Gumroad account: https://gumroad.com
2. Go to: Settings -> Advanced -> Applications (https://gumroad.com/settings/advanced#application-form)
3. Under "OAuth Applications" or "Access Token", generate an access token with scope:
   [edit_products, view_profile]
4. Run this command:
   node scripts/setup-gumroad-products.mjs YOUR_GUMROAD_ACCESS_TOKEN

Or Create Products Manually on Gumroad Dashboard (Takes 2 minutes):
─────────────────────────────────────────────────────────────────────────────
• Product 1: "JurisTech Solutions — Startup Plan"
  - Price: $49 (Monthly membership or one-time)
  - Custom permalink: "startup" (or "juristech-startup")
  
• Product 2: "JurisTech Solutions — SMEs & Growth Package"
  - Price: $139 (Monthly membership or one-time)
  - Custom permalink: "sme" (or "juristech-sme")

• Product 3: "JurisTech Solutions — Enterprise Sovereign Plan"
  - Price: $349 (Monthly membership or one-time)
  - Custom permalink: "enterprise" (or "juristech-enterprise")

Webhook / Ping Configuration:
─────────────────────────────────────────────────────────────────────────────
In Gumroad Dashboard -> Settings -> Advanced -> Ping:
Set Ping URL: https://www.juristech.solutions/api/webhooks?provider=gumroad
(This automatically activates customer subscriptions upon payment!)
`);
  process.exit(0);
}

const PRODUCTS = [
  {
    planKey: 'startup',
    name: 'JurisTech Solutions — Startup Sovereign Plan',
    priceInCents: 4900,
    permalink: 'juristech-startup',
    description: 'JurisTech Solutions Sovereign AI Contract Review, Statutory Risk & Penalty Detection, Certified PDF/Word Document Export, and DealShield 360 diagnostics.',
  },
  {
    planKey: 'sme',
    name: 'JurisTech Solutions — SMEs & Growth Package',
    priceInCents: 13900,
    permalink: 'juristech-sme',
    description: 'Autonomous AI Negotiation, Virtual Litigation Simulation, 8-Axis Risk Audit, Multi-Jurisdiction Clash Harmonization across GCC and US legal systems.',
  },
  {
    planKey: 'enterprise',
    name: 'JurisTech Solutions — Enterprise Sovereign Tier',
    priceInCents: 34900,
    permalink: 'juristech-enterprise',
    description: 'Predictive M&A Intelligence, Forensic Stylometric Fraud Detection, Cross-Border Statutory Compliance (GDPR, PDPL, EU AI Act), Dedicated Sovereign Vault.',
  },
];

async function createProduct(prod) {
  const params = new URLSearchParams();
  params.append('name', prod.name);
  params.append('price', String(prod.priceInCents));
  params.append('description', prod.description);
  params.append('currency', 'usd');
  params.append('custom_permalink', prod.permalink);
  params.append('access_token', token);

  try {
    const res = await fetch('https://api.gumroad.com/v2/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error(`❌ Failed to create ${prod.name}:`, data.message || data);
      return null;
    }

    const created = data.product;
    console.log(`✅ [CREATED] ${created.name}`);
    console.log(`   Short URL: ${created.short_url}`);
    console.log(`   Price: $${created.price / 100} USD`);
    return { planKey: prod.planKey, url: created.short_url };
  } catch (err) {
    console.error(`❌ Error creating ${prod.name}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('🚀 Connecting to Gumroad REST API to create Sovereign Subscription Tiers...\n');
  const results = [];
  for (const prod of PRODUCTS) {
    const res = await createProduct(prod);
    if (res) results.push(res);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log(' 🎉 Gumroad Products Created Successfully!');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
  console.log('Add these environment variables to your .env or Vercel dashboard:');
  for (const r of results) {
    console.log(`VITE_GUMROAD_${r.planKey.toUpperCase()}_URL=${r.url}`);
  }
  console.log('\nPing Webhook URL to register in Gumroad Settings -> Advanced -> Ping:');
  console.log('https://www.juristech.solutions/api/webhooks?provider=gumroad\n');
}

run();
