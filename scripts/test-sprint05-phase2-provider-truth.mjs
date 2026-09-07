/**
 * scripts/test-sprint05-phase2-provider-truth.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 05 Phase 2: Payment Provider Truth Alignment
 * Targeted Verification Suite
 *
 * Verifies that:
 *  1. Stripe status is explicitly declared as NOT AVAILABLE — NO STRIPE ACCOUNT.
 *  2. PayTabs card checkout status remains UNDER REVIEW (Merchant KYC).
 *  3. Active direct payment channels (SWIFT, Binance Pay, InstaPay, Proforma) remain LIVE.
 *  4. No customer-facing or adapter code presents Stripe as active, live, or ready.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import ts from 'typescript';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log(' JurisTech Solutions — Sprint 05 Phase 2: Payment Provider Truth Suite');
console.log(' Target: Eliminate Misleading Stripe Presentation & Enforce Real Status');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── Group 1: paymentProviderAdapter Runtime Provider Status ───────────────────
console.log('--- Group 1: paymentProviderAdapter Runtime Provider Status ---');

const adapterPath = resolve(process.cwd(), 'src/services/paymentProviderAdapter.ts');
const adapterSource = readFileSync(adapterPath, 'utf8');

// Transpile TypeScript module in memory to evaluate runtime behavior
const transpiled = ts.transpileModule(adapterSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const base64 = Buffer.from(transpiled.outputText).toString('base64');
const { paymentProviderAdapter } = await import(`data:text/javascript;base64,${base64}`);

// 1. Stripe Status
const stripeStatus = paymentProviderAdapter.getProviderStatus('stripe');
assert(
  stripeStatus.provider === 'stripe',
  'Stripe provider identifier confirmed'
);
assert(
  stripeStatus.isConnected === false,
  'Stripe isConnected is strictly false'
);
assert(
  stripeStatus.isAvailable === false,
  'Stripe isAvailable is strictly false'
);
assert(
  stripeStatus.mode === 'NOT_CONFIGURED',
  'Stripe mode is NOT_CONFIGURED'
);
assert(
  stripeStatus.statusLabelEn === 'NOT AVAILABLE — NO STRIPE ACCOUNT',
  'Stripe statusLabelEn is "NOT AVAILABLE — NO STRIPE ACCOUNT"'
);
assert(
  stripeStatus.statusLabelAr === 'غير متاح — لا يوجد حساب Stripe حالياً',
  'Stripe statusLabelAr is "غير متاح — لا يوجد حساب Stripe حالياً"'
);
assert(
  stripeStatus.missingRequirements.includes('NO_STRIPE_ACCOUNT') &&
  stripeStatus.missingRequirements.includes('NOT_AVAILABLE'),
  'Stripe missingRequirements explicitly documents NO_STRIPE_ACCOUNT & NOT_AVAILABLE'
);

// 2. PayTabs Status (Preserved Under Review)
const paytabsStatus = paymentProviderAdapter.getProviderStatus('paytabs');
assert(
  paytabsStatus.provider === 'paytabs',
  'PayTabs provider identifier confirmed'
);
assert(
  paytabsStatus.isConnected === false,
  'PayTabs isConnected is false (under review)'
);
assert(
  paytabsStatus.isAvailable === false,
  'PayTabs isAvailable is false'
);
assert(
  paytabsStatus.statusLabelEn === 'UNDER REVIEW',
  'PayTabs statusLabelEn is "UNDER REVIEW"'
);
assert(
  paytabsStatus.statusLabelAr.includes('PayTabs'),
  'PayTabs statusLabelAr correctly identifies PayTabs'
);

// 3. Active Direct Channels Preserved
const swiftStatus = paymentProviderAdapter.getProviderStatus('manual_swift');
assert(
  swiftStatus.isConnected === true && swiftStatus.isAvailable === true && swiftStatus.mode === 'LIVE',
  'SWIFT Wire Transfer remains LIVE and available'
);

const binanceStatus = paymentProviderAdapter.getProviderStatus('binance_pay');
assert(
  binanceStatus.isConnected === true && binanceStatus.isAvailable === true && binanceStatus.mode === 'LIVE',
  'Binance Pay remains LIVE and available'
);

// ── Group 2: Checkout Session Behavior for Inactive vs Active Gateways ─────────
console.log('\n--- Group 2: Checkout Session Behavior ---');

const stripeCheckout = await paymentProviderAdapter.createCheckout({
  planId: 'startup',
  customerEmail: 'customer@example.com',
  customerName: 'Customer Name',
  provider: 'stripe',
});

assert(
  stripeCheckout.provider === 'stripe',
  'Stripe checkout result identifies provider as stripe'
);
assert(
  stripeCheckout.providerConfigStatus === 'NOT_CONNECTED',
  'Stripe providerConfigStatus is NOT_CONNECTED'
);
assert(
  !stripeCheckout.instructions.includes('adapter ready') && !stripeCheckout.instructions.includes('LIVE'),
  'Stripe instructions contain ZERO misleading "adapter ready" or "LIVE" claims'
);
assert(
  stripeCheckout.instructions.includes('Stripe is not available') &&
  stripeCheckout.instructions.includes('active Stripe account'),
  'Stripe instructions clearly state Stripe is not available due to no active account'
);
assert(
  stripeCheckout.instructions.includes('SWIFT') && stripeCheckout.instructions.includes('Binance Pay'),
  'Stripe instructions guide customer to active verified channels (SWIFT, Binance Pay)'
);

const paytabsCheckout = await paymentProviderAdapter.createCheckout({
  planId: 'startup',
  customerEmail: 'customer@example.com',
  customerName: 'Customer Name',
  provider: 'paytabs',
});
assert(
  paytabsCheckout.providerConfigStatus === 'NOT_CONNECTED',
  'PayTabs providerConfigStatus is NOT_CONNECTED'
);
assert(
  paytabsCheckout.instructions.includes('compliance review') || paytabsCheckout.instructions.includes('merchant'),
  'PayTabs checkout instructions reflect active compliance review'
);

const swiftCheckout = await paymentProviderAdapter.createCheckout({
  planId: 'startup',
  customerEmail: 'customer@example.com',
  customerName: 'Customer Name',
  provider: 'manual_swift',
});
assert(
  swiftCheckout.status === 'READY' && swiftCheckout.providerConfigStatus === 'LIVE',
  'SWIFT Wire checkout is READY and LIVE'
);

// ── Group 3: Payment Verification & Adapter Hardening ─────────────────────────
console.log('\n--- Group 3: Payment Verification Hardening ---');

const stripeVerify = await paymentProviderAdapter.verifyPayment('TX_TEST_123', 'stripe');
assert(
  stripeVerify.isVerified === false,
  'Stripe verifyPayment returns isVerified: false'
);
assert(
  stripeVerify.status === 'FAILED',
  'Stripe verifyPayment returns status: FAILED'
);
assert(
  JSON.stringify(stripeVerify.rawResponse).includes('NOT_AVAILABLE') ||
  JSON.stringify(stripeVerify.rawResponse).includes('no active Stripe account'),
  'Stripe verifyPayment explicitly reports NOT_AVAILABLE / no active account'
);

// ── Group 4: Customer-Facing UI Presentation Audit (PaymentPage.tsx) ──────────
console.log('\n--- Group 4: Customer-Facing UI Presentation Audit (PaymentPage.tsx) ---');

const paymentPagePath = resolve(process.cwd(), 'src/pages/PaymentPage.tsx');
const paymentPageSource = readFileSync(paymentPagePath, 'utf8');

assert(
  !paymentPageSource.includes('Stripe Checkout') && !paymentPageSource.includes('Pay with Stripe'),
  'PaymentPage.tsx does NOT render any working "Stripe Checkout" button'
);
assert(
  paymentPageSource.includes('PayTabs — Under Review') || paymentPageSource.includes('PayTabs — قيد المراجعة'),
  'PaymentPage.tsx presents PayTabs Card Checkout as Under Review'
);
assert(
  paymentPageSource.includes('Binance Pay') &&
  paymentPageSource.includes('SWIFT Wire') &&
  paymentPageSource.includes('InstaPay') &&
  paymentPageSource.includes('Proforma Invoice'),
  'PaymentPage.tsx preserves all active payment methods (Binance Pay, SWIFT Wire, InstaPay, Proforma Invoice)'
);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` Results: ${passed} Passed, ${failed} Failed`);
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
