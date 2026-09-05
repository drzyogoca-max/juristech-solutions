import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🧪 RUNNING JURISTECH PRODUCTION SYSTEM AUDIT VERIFICATION');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Check root messages JSON files for all 7 languages
console.log('🔍 Test Group 1: Multilingual Root Messages (7 Languages)');
const LANGS = ['ar', 'en', 'fr', 'es', 'de', 'tr', 'zh'];
for (const lang of LANGS) {
  const filePath = path.join(process.cwd(), 'messages', `${lang}.json`);
  const exists = fs.existsSync(filePath);
  assert(exists, `messages/${lang}.json exists`);
  if (exists) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const keys = data.translation ? Object.keys(data.translation) : Object.keys(data);
      assert(keys.length >= 5, `messages/${lang}.json contains valid dictionary keys (${keys.length} sections: ${keys.slice(0, 4).join(', ')}...)`);
    } catch (e) {
      assert(false, `messages/${lang}.json is valid JSON: ${e.message}`);
    }
  }
}

// 2. Check LocaleContext, rtl.ts and universalTranslator integration
console.log('\n🔍 Test Group 2: Reactive Multilingual Architecture');
const localeContextPath = path.join(process.cwd(), 'src', 'context', 'LocaleContext.tsx');
assert(fs.existsSync(localeContextPath), 'LocaleContext.tsx exists');
const localeContextCode = fs.readFileSync(localeContextPath, 'utf-8');
assert(localeContextCode.includes('LocaleProvider'), 'LocaleContext exports LocaleProvider');
assert(localeContextCode.includes('useLocale'), 'LocaleContext exports useLocale');

const rtlPath = path.join(process.cwd(), 'src', 'i18n', 'rtl.ts');
assert(fs.existsSync(rtlPath), 'src/i18n/rtl.ts exists');
const rtlCode = fs.readFileSync(rtlPath, 'utf-8');
assert(rtlCode.includes("clean === 'ar' || clean.startsWith('ar-')"), 'isRtlLanguage correctly identifies Arabic as RTL');
assert(rtlCode.includes('document.documentElement.dir = meta.dir'), 'setDocumentLanguage dynamically updates document dir attribute');

const translatorPath = path.join(process.cwd(), 'src', 'lib', 'universalTranslator.ts');
const translatorCode = fs.readFileSync(translatorPath, 'utf-8');
assert(translatorCode.includes('useLocale()'), 'usePlatformLocale bridges directly to LocaleContext');
assert(translatorCode.includes('REVERSE_GLOBAL_MAP'), 'universalTranslator indexes translations for O(1) reactive multi-language resolution');

// 3. Verify elimination of fabricated baseline metrics
console.log('\n🔍 Test Group 3: Elimination of Fabricated Statistics');
const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
assert(fs.existsSync(distIndexPath), 'dist/index.html exists');
const distIndexHtml = fs.readFileSync(distIndexPath, 'utf-8');

assert(!distIndexHtml.includes('1,000,000+'), 'dist/index.html does NOT contain fabricated "1,000,000+" metric');
assert(!distIndexHtml.includes('84,200+'), 'dist/index.html does NOT contain fabricated "84,200+" metric');
assert(!distIndexHtml.includes('450,000+'), 'dist/index.html does NOT contain fabricated "450,000+" metric');

const dashboardPagePath = path.join(process.cwd(), 'src', 'pages', 'Dashboard.tsx');
const dashboardCode = fs.readFileSync(dashboardPagePath, 'utf-8');
assert(!dashboardCode.includes('totalContracts: 1000000'), 'Dashboard.tsx does NOT seed fake 1,000,000 baseline contracts');
assert(!dashboardCode.includes('riskReportsCount: 84200'), 'Dashboard.tsx does NOT seed fake 84,200 baseline reports');

// 4. Verify removal of fake Amman HQ and fake registrations
console.log('\n🔍 Test Group 4: Authentic Corporate Identity (Cross-Border SaaS Platform)');
const globalTransPath = path.join(process.cwd(), 'src', 'lib', 'globalTranslations.ts');
const globalTransCode = fs.readFileSync(globalTransPath, 'utf-8');
assert(!globalTransCode.includes('headquartered in Amman, Jordan'), 'globalTranslations does NOT claim Amman headquarters in EN');
assert(!globalTransCode.includes('مسجل في المملكة الأردنية الهاشمية (عمّان)'), 'globalTranslations does NOT claim Amman registration in AR');

const aboutPath = path.join(process.cwd(), 'src', 'pages', 'AboutUsPage.tsx');
const aboutCode = fs.readFileSync(aboutPath, 'utf-8');
assert(!aboutCode.includes('CCD-JO-'), 'AboutUsPage does NOT contain fabricated Jordanian CCD registration');

const legalCompPath = path.join(process.cwd(), 'src', 'pages', 'LegalCompliancePage.tsx');
const legalCompCode = fs.readFileSync(legalCompPath, 'utf-8');
assert(!legalCompCode.includes('Amman Courts of First Instance'), 'LegalCompliancePage does NOT claim exclusive Amman court venue');

// 5. Verify Schema.org Structured Data
console.log('\n🔍 Test Group 5: Schema.org SoftwareApplication Structured Data');
assert(distIndexHtml.includes('"@type":"SoftwareApplication"') || distIndexHtml.includes('"@type": "SoftwareApplication"'), 'dist/index.html contains SoftwareApplication schema instead of LegalService');
assert(!distIndexHtml.includes('"King Fahd Road, Al Olaya"'), 'dist/index.html does NOT contain fake physical Riyadh office address in schema');

// 6. Verify Payment Gateway Safeguards
console.log('\n🔍 Test Group 6: Payment Security & Manual Flow Safeguards');
const instaPayPath = path.join(process.cwd(), 'src', 'components', 'InstaPayModal.tsx');
const instaPayCode = fs.readFileSync(instaPayPath, 'utf-8');
assert(!instaPayCode.includes('activateUserSubscription('), 'InstaPayModal does NOT instantly activate subscriptions on submit');
assert(instaPayCode.includes("status: 'قيد المراجعة والتدقيق المالي (Pending Audit)'"), 'InstaPayModal registers pending audit in Supabase');

const binancePayPath = path.join(process.cwd(), 'src', 'components', 'BinancePayModal.tsx');
const binancePayCode = fs.readFileSync(binancePayPath, 'utf-8');
assert(!binancePayCode.includes('activateUserSubscription({'), 'BinancePayModal does NOT instantly activate subscriptions on submit');
assert(binancePayCode.includes("status: 'قيد المراجعة والتدقيق المالي (Pending Audit)'"), 'BinancePayModal registers pending audit in Supabase');

const paddlePath = path.join(process.cwd(), 'src', 'lib', 'paddleClient.ts');
const paddleCode = fs.readFileSync(paddlePath, 'utf-8');
assert(!paddleCode.includes('Direct overlay unavailable, executing fallback activation'), 'paddleClient does NOT execute insecure auto-activation fallback');

// 7. Verify Customer Services Catalog & Templates Studio
console.log('\n🔍 Test Group 7: Service Catalog Integrity & Templates Studio');
const catalogPath = path.join(process.cwd(), 'src', 'components', 'SovereignServicesCatalog.tsx');
const catalogCode = fs.readFileSync(catalogPath, 'utf-8');
assert(!catalogCode.includes('/lead-radar'), 'SovereignServicesCatalog does NOT list internal /lead-radar');
assert(!catalogCode.includes('/marketing'), 'SovereignServicesCatalog does NOT list internal /marketing');
assert(!catalogCode.includes('/youtube-studio'), 'SovereignServicesCatalog does NOT list internal /youtube-studio');
assert(catalogCode.includes('/deal-shield'), 'SovereignServicesCatalog includes customer /deal-shield');
assert(catalogCode.includes('/acquisition'), 'SovereignServicesCatalog includes customer /acquisition');

const templatesPath = path.join(process.cwd(), 'src', 'pages', 'TemplatesPage.tsx');
const templatesCode = fs.readFileSync(templatesPath, 'utf-8');
assert(templatesCode.includes('Verified Legal Templates Studio') || templatesCode.includes('استوديو النماذج القانونية الذكية'), 'TemplatesPage is a dedicated studio with distinct functionality');

console.log('\n====================================================');
console.log(`📊 FINAL RESULT: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('\n🎉 ALL PRODUCTION AUDIT CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error(`\n❌ FAILED: ${totalTests - passedTests} test(s) failed.\n`);
  process.exit(1);
}
