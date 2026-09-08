/**
 * scripts/test-sprint06-pricing-harmonization.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Verification test suite for Sprint 06 Priority #3:
 * Pricing & Billing Terminology Harmonization
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    process.exit(1);
  }
  passedAssertions++;
  console.log(`  ✅ [PASS] ${message}`);
}

console.log('\n🚀 Starting Sprint 06 Priority #3 Pricing Harmonization Verification...\n');

// ── 1. Canonical Global Configuration ────────────────────────────────────────
console.log('📌 [GROUP 1] Verifying canonical pricing single source of truth in globalConfig.ts...');
const globalConfigPath = resolve('src/config/globalConfig.ts');
assert(existsSync(globalConfigPath), 'globalConfig.ts exists');
const globalConfigContent = readFileSync(globalConfigPath, 'utf8');

assert(globalConfigContent.includes('priceMonthlyUSD: 49'), 'Canonical Startup price is $49/mo');
assert(globalConfigContent.includes('priceMonthlyUSD: 139'), 'Canonical SME price is $139/mo');
assert(globalConfigContent.includes('priceMonthlyUSD: 349'), 'Canonical Enterprise price is $349/mo');

// ── 2. AccessUpgradeModal.tsx Harmonization ──────────────────────────────────
console.log('\n📌 [GROUP 2] Verifying AccessUpgradeModal.tsx pricing harmonization...');
const accessUpgradeModalPath = resolve('src/components/ai-advisor/AccessUpgradeModal.tsx');
assert(existsSync(accessUpgradeModalPath), 'AccessUpgradeModal.tsx exists');
const accessUpgradeContent = readFileSync(accessUpgradeModalPath, 'utf8');

// Check canonical prices in tierMap
assert(
  accessUpgradeContent.includes("startup: { name: 'Startup Tier', price: '$49 / mo', planKey: 'startup' }"),
  'Startup in AccessUpgradeModal mapped to $49 / mo with planKey startup'
);
assert(
  accessUpgradeContent.includes("sme: { name: 'SME & Growth', price: '$139 / mo', planKey: 'sme' }"),
  'SME in AccessUpgradeModal mapped to $139 / mo with planKey sme'
);
assert(
  accessUpgradeContent.includes("pro: { name: 'SME & Growth', price: '$139 / mo', planKey: 'sme' }"),
  'Pro in AccessUpgradeModal mapped to SME & Growth $139 / mo with planKey sme'
);
assert(
  accessUpgradeContent.includes("enterprise: { name: 'Enterprise Sovereign', price: '$349 / mo', planKey: 'enterprise' }"),
  'Enterprise in AccessUpgradeModal mapped to $349 / mo with planKey enterprise'
);
assert(
  accessUpgradeContent.includes("lawyer: { name: 'SME & Growth', price: '$139 / mo', planKey: 'sme' }"),
  'Lawyer in AccessUpgradeModal mapped to SME & Growth $139 / mo with planKey sme'
);
assert(
  accessUpgradeContent.includes("admin: { name: 'Enterprise Sovereign', price: '$349 / mo', planKey: 'enterprise' }"),
  'Admin in AccessUpgradeModal mapped to Enterprise Sovereign $349 / mo with planKey enterprise'
);

// Verify no obsolete pricing remains in AccessUpgradeModal
assert(!accessUpgradeContent.includes('$19'), 'AccessUpgradeModal no longer contains $19');
assert(!accessUpgradeContent.includes('$99 / mo'), 'AccessUpgradeModal no longer contains $99 / mo');
assert(!accessUpgradeContent.includes('$299 / mo'), 'AccessUpgradeModal no longer contains $299 / mo');
assert(!accessUpgradeContent.includes("'Pro Counsel'"), 'AccessUpgradeModal no longer contains legacy "Pro Counsel"');
assert(!accessUpgradeContent.includes("planKey: 'pro'"), 'AccessUpgradeModal no longer routes users to non-existent planKey: pro');

// ── 3. ContractLibraryGate.tsx Harmonization ─────────────────────────────────
console.log('\n📌 [GROUP 3] Verifying ContractLibraryGate.tsx pricing harmonization...');
const contractGatePath = resolve('src/components/ContractLibraryGate.tsx');
assert(existsSync(contractGatePath), 'ContractLibraryGate.tsx exists');
const contractGateContent = readFileSync(contractGatePath, 'utf8');

assert(contractGateContent.includes('(من $49/شهرياً)'), 'ContractLibraryGate Arabic CTA updated to (من $49/شهرياً)');
assert(contractGateContent.includes('(From $49/mo)'), 'ContractLibraryGate English CTA updated to (From $49/mo)');
assert(!contractGateContent.includes('$29'), 'ContractLibraryGate no longer contains obsolete $29');

// ── 4. SEO.tsx PriceRange Harmonization ──────────────────────────────────────
console.log('\n📌 [GROUP 4] Verifying SEO.tsx priceRange harmonization...');
const seoPath = resolve('src/components/SEO.tsx');
assert(existsSync(seoPath), 'SEO.tsx exists');
const seoContent = readFileSync(seoPath, 'utf8');

assert(seoContent.includes("'priceRange': '$49 - $349/mo'"), 'SEO.tsx priceRange updated to $49 - $349/mo');
assert(!seoContent.includes("'priceRange': '$0 - $49/mo'"), 'SEO.tsx no longer contains $0 - $49/mo');

// ── 5. Backward Compatibility for Internal `pro` Type ────────────────────────
console.log('\n📌 [GROUP 5] Verifying internal `pro` type compatibility preserved...');
const typesPath = resolve('src/ai/types.ts');
assert(existsSync(typesPath), 'ai/types.ts exists');
const typesContent = readFileSync(typesPath, 'utf8');
assert(typesContent.includes("'pro'"), "ai/types.ts UserTier type retains 'pro' for backward compatibility");

const subHookPath = resolve('src/hooks/useSubscription.ts');
assert(existsSync(subHookPath), 'useSubscription.ts exists');
const subHookContent = readFileSync(subHookPath, 'utf8');
assert(subHookContent.includes("'Pro'"), "useSubscription.ts SubscriptionTier retains 'Pro' for legacy database records");
assert(subHookContent.includes("includes('pro')"), "useSubscription.ts mapPlanIdToTier handles legacy 'pro' subscriptions");

const billingPagePath = resolve('src/pages/BillingPage.tsx');
assert(existsSync(billingPagePath), 'BillingPage.tsx exists');
const billingContent = readFileSync(billingPagePath, 'utf8');
assert(billingContent.includes('Pro:'), "BillingPage.tsx TIER_PRICING handles legacy 'Pro' subscribers gracefully");

// ── 6. PaymentPage.tsx Integrity & VIP Deal Room Pass ───────────────────────
console.log('\n📌 [GROUP 6] Verifying PaymentPage.tsx canonical plans & VIP Deal Room pass intact...');
const paymentPagePath = resolve('src/pages/PaymentPage.tsx');
assert(existsSync(paymentPagePath), 'PaymentPage.tsx exists');
const paymentContent = readFileSync(paymentPagePath, 'utf8');

assert(paymentContent.includes("id: 'startup'"), 'PaymentPage includes startup plan');
assert(paymentContent.includes('price: 49'), 'PaymentPage startup price is 49');
assert(paymentContent.includes("id: 'sme'"), 'PaymentPage sme plan is present');
assert(paymentContent.includes('price: 139'), 'PaymentPage sme price is 139');
assert(paymentContent.includes("id: 'enterprise'"), 'PaymentPage enterprise plan is present');
assert(paymentContent.includes('price: 349'), 'PaymentPage enterprise price is 349');
assert(paymentContent.includes("id: 'dealroom'"), 'PaymentPage VIP Deal Room pass is present');
assert(paymentContent.includes('price: 999'), 'PaymentPage VIP Deal Room price is 999');

// ── 7. Zero Customer-Facing Paddle References ────────────────────────────────
console.log('\n📌 [GROUP 7] Verifying zero customer-facing Paddle references...');
assert(!billingContent.includes('Paddle'), 'BillingPage contains zero customer-facing Paddle references');
assert(!paymentContent.includes('Paddle'), 'PaymentPage contains zero customer-facing Paddle references');
assert(!accessUpgradeContent.includes('Paddle'), 'AccessUpgradeModal contains zero customer-facing Paddle references');
assert(!contractGateContent.includes('Paddle'), 'ContractLibraryGate contains zero customer-facing Paddle references');

console.log(`\n🎉 All ${passedAssertions}/${totalAssertions} Pricing Harmonization assertions PASSED successfully!\n`);
