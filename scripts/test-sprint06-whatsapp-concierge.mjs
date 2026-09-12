import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log(' SPRINT 06 — PRIORITY #2: PLAN-AWARE WHATSAPP CONCIERGE TEST SUITE');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── Read Target Source Files ──────────────────────────────────────────────────
const paymentPagePath = path.join(rootDir, 'src', 'pages', 'PaymentPage.tsx');
const payTabsModalPath = path.join(rootDir, 'src', 'components', 'PayTabsReviewModal.tsx');

assert(fs.existsSync(paymentPagePath), 'PaymentPage.tsx exists');
assert(fs.existsSync(payTabsModalPath), 'PayTabsReviewModal.tsx exists');

const paymentPageCode = fs.readFileSync(paymentPagePath, 'utf8');
const payTabsModalCode = fs.readFileSync(payTabsModalPath, 'utf8');

// ── 1. Official WhatsApp Number & URL Formatting ─────────────────────────────
console.log('\n--- 1. Official WhatsApp Configuration ---');
const EXPECTED_NUMBER = '+201126674337';
const EXPECTED_URL_PREFIX = 'https://wa.me/201126674337';

assert(payTabsModalCode.includes(`OFFICIAL_WHATSAPP_NUMBER = '${EXPECTED_NUMBER}'`), 'PayTabsReviewModal defines official number +201126674337');
assert(payTabsModalCode.includes(EXPECTED_URL_PREFIX), 'PayTabsReviewModal generates wa.me/201126674337 links');
assert(paymentPageCode.includes(EXPECTED_URL_PREFIX), 'PaymentPage includes wa.me/201126674337 link in executive strip');

// ── 2. PaymentPage Concierge CTA ──────────────────────────────────────────────
console.log('\n--- 2. PaymentPage Concierge Integration ---');
assert(paymentPageCode.includes("l('مساعدة فورية عبر واتساب الإدارة التنفيذية', 'WhatsApp Executive Concierge')"), 'PaymentPage has exact bilingual Concierge CTA');
assert(paymentPageCode.includes('whatsapp-concierge-'), 'PaymentPage cards have test IDs for plan concierge CTA');
assert(paymentPageCode.includes('data-testid="whatsapp-executive-contact-strip"'), 'PaymentPage executive contact strip has test ID');
assert(paymentPageCode.includes('buildWhatsAppConciergeUrl(plan, isRtl)'), 'PaymentPage calls plan-aware buildWhatsAppConciergeUrl');

// ── 3. PayTabsReviewModal Concierge CTA ───────────────────────────────────────
console.log('\n--- 3. PayTabsReviewModal Concierge Integration ---');
assert(payTabsModalCode.includes('data-testid="whatsapp-paytabs-modal-concierge"'), 'PayTabsReviewModal contains dedicated test ID');
assert(payTabsModalCode.includes("l('المسار المباشر: مساعدة الإدارة التنفيذية في السداد والتفعيل', 'Direct Path: Executive Assisted Payment & Activation')"), 'PayTabsReviewModal displays direct-path banner');
assert(payTabsModalCode.includes("l('مساعدة فورية عبر واتساب الإدارة التنفيذية', 'WhatsApp Executive Concierge')"), 'PayTabsReviewModal has exact bilingual Concierge CTA');
assert(payTabsModalCode.includes('buildWhatsAppConciergeUrl(selectedPlan, isAr)'), 'PayTabsReviewModal preserves selectedPlan context in WhatsApp URL');

// ── 4. Canonical Plan Pricing Alignment ───────────────────────────────────────
console.log('\n--- 4. Canonical Pricing Verification ---');
assert(paymentPageCode.includes('price: 49'), 'PaymentPage Startup price is canonically $49');
assert(paymentPageCode.includes('price: 139'), 'PaymentPage SMEs price is canonically $139');
assert(paymentPageCode.includes('price: 349'), 'PaymentPage Enterprise price is canonically $349');

// ── 5. Dynamic URL & Message Formatting (Truthful Wording) ───────────────────
console.log('\n--- 5. Dynamic URL & Message Formatting ---');
function testBuildWhatsAppConciergeUrl(plan, isAr) {
  const planName = plan ? (isAr ? (plan.nameAr || 'باقة الاشتراك') : (plan.nameEn || 'Subscription Plan')) : (isAr ? 'باقة الاشتراك' : 'Subscription Plan');
  const priceSuffix = plan?.price ? ` ($${plan.price}${isAr ? '/شهرياً' : '/month'})` : '';
  const message = isAr
    ? `مرحباً د. محمد مصطفى، أرغب في المساعدة في إتمام الدفع وتفعيل الاشتراك للباقة: ${planName}${priceSuffix}. يرجى تزويدي بإجراءات السداد والتفعيل.`
    : `Hello Dr. Mohammad Mustafa, I would like assisted checkout & payment assistance to activate the ${planName}${priceSuffix}. Please provide payment and activation steps.`;
  return `https://wa.me/201126674337?text=${encodeURIComponent(message)}`;
}

const startupArUrl = testBuildWhatsAppConciergeUrl({ nameAr: 'حزمة الشركات الصغرى والناشئة', price: 49 }, true);
const startupEnUrl = testBuildWhatsAppConciergeUrl({ nameEn: 'Micro / Startup Tier', price: 49 }, false);
const smeArUrl = testBuildWhatsAppConciergeUrl({ nameAr: 'حزمة الشركات المتوسطة والنمو', price: 139 }, true);
const enterpriseEnUrl = testBuildWhatsAppConciergeUrl({ nameEn: 'Enterprise Sovereign Package', price: 349 }, false);

assert(startupArUrl.includes('201126674337'), 'Arabic URL targets +201126674337');
assert(decodeURIComponent(startupArUrl).includes('حزمة الشركات الصغرى والناشئة ($49/شهرياً)'), 'Arabic Startup message contains plan name and $49/شهرياً');
assert(decodeURIComponent(startupArUrl).includes('المساعدة في إتمام الدفع وتفعيل الاشتراك'), 'Arabic message states assisted checkout clearly');
assert(decodeURIComponent(startupArUrl).includes('إجراءات السداد والتفعيل'), 'Arabic message uses truthful wording: إجراءات السداد والتفعيل');
assert(!decodeURIComponent(startupArUrl).includes('التفعيل الفوري'), 'Arabic message avoids promising instant activation');

assert(decodeURIComponent(startupEnUrl).includes('Micro / Startup Tier ($49/month)'), 'English Startup message contains plan name and $49/month');
assert(decodeURIComponent(startupEnUrl).includes('assisted checkout & payment assistance'), 'English message states assisted checkout clearly');
assert(decodeURIComponent(startupEnUrl).includes('payment and activation steps'), 'English message uses truthful wording: payment and activation steps');
assert(!decodeURIComponent(startupEnUrl).includes('instant activation'), 'English message avoids promising instant activation');

assert(decodeURIComponent(smeArUrl).includes('حزمة الشركات المتوسطة والنمو ($139/شهرياً)'), 'SME Arabic message contains $139/شهرياً');
assert(decodeURIComponent(enterpriseEnUrl).includes('Enterprise Sovereign Package ($349/month)'), 'Enterprise English message contains $349/month');

const fallbackUrl = testBuildWhatsAppConciergeUrl(null, false);
assert(decodeURIComponent(fallbackUrl).includes('Subscription Plan'), 'Fallback handles null plan gracefully without crash');

// ── 6. Security & Credential Isolation ────────────────────────────────────────
console.log('\n--- 6. Security & Credential Isolation ---');
const sensitivePatterns = [
  'eyJ',
  'service_role',
  'SUPABASE_SERVICE_ROLE_KEY',
  'api_key',
  'sk_live',
  'user.email',
  'password',
  'token',
];

for (const pat of sensitivePatterns) {
  assert(!startupArUrl.includes(pat), `WhatsApp URL does not leak sensitive pattern: ${pat}`);
  assert(!startupEnUrl.includes(pat), `WhatsApp URL does not leak sensitive pattern: ${pat}`);
}

// ── 7. Payment Truth & Provider Integrity ──────────────────────────────────────
console.log('\n--- 7. Payment Truth & Provider Integrity ---');
assert(paymentPageCode.includes('PayTabs — قيد المراجعة') || paymentPageCode.includes('PayTabs — Under Review'), 'PaymentPage keeps PayTabs explicitly Under Review');
assert(payTabsModalCode.includes('PayTabs Card Checkout — Under Merchant Review'), 'PayTabsReviewModal keeps Under Merchant Review title');
assert(payTabsModalCode.includes('قيد مراجعة الحساب'), 'PayTabsReviewModal keeps Arabic Under Review title');

assert(paymentPageCode.includes('Binance Pay') && paymentPageCode.includes('SWIFT Wire') && paymentPageCode.includes('InstaPay') && paymentPageCode.includes('Proforma Invoice'), 'Direct channels remain active on PaymentPage');
assert(payTabsModalCode.includes('wire') && payTabsModalCode.includes('binance') && payTabsModalCode.includes('instapay') && payTabsModalCode.includes('proforma'), 'Direct channels remain available in PayTabsReviewModal');

assert(!payTabsModalCode.includes('card_instant_charge'), 'No false automated card charging logic introduced');

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` Summary: ${passedTests} passed, ${failedTests} failed out of ${totalTests} assertions`);
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (failedTests > 0) {
  console.error('❌ VERDICT: BLOCKED');
  process.exit(1);
} else {
  console.log('🎉 VERDICT: READY FOR REVIEW');
  process.exit(0);
}
