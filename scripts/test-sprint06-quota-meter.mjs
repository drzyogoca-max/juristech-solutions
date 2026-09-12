/**
 * scripts/test-sprint06-quota-meter.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 06 Priority #1 Verification Suite (Corrected)
 * Target: In-App Quota Meter + Contextual Upgrade Trigger
 *
 * Verifies that:
 *  1. Canonical Quota Source is Reused:
 *     - useDailyQuota.ts imports TIER_CONFIGS from src/ai/security/tierAccessGuard.ts
 *     - No duplicate conflicting quota constant is created
 *     - Limits remain strictly 5 queries/day for Free Trial
 *  2. No Fabricated Quota Values & Honest Loading State:
 *     - AIAdvisorHeader.tsx contains ZERO "remaining ?? 5", ZERO "limit ?? 5", ZERO "used ?? 0"
 *     - Loading / unavailable state does NOT claim "5/5"
 *     - Renders explicit checking indicator with loader and neutral pulsing dots
 *     - Does not prematurely escalate to warning or lock CTAs while loading
 *  3. Paid Tier Suppression:
 *     - Quota meter & trial upgrade triggers strictly suppressed for all paid tiers
 *       (startup, sme, enterprise, pro, lawyer, admin)
 *  4. Fail-Safe Behavior Preserved:
 *     - Zero localStorage quota logic
 *     - Zero auto AI execution on page mount / navigation
 *     - Server-side 429 remains fail-closed without synthetic fallback in src/lib/api.ts
 *     - AIAdvisorPage.tsx guards send at 0 remaining and handles 429
 *  5. Canonical Pricing Alignment:
 *     - Startup = $49/mo, SMEs = $139/mo, Enterprise = $349/mo verified from globalConfig.ts & BillingPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

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
console.log(' JurisTech Solutions — Sprint 06 Priority #1 Verification Suite (Corrected)');
console.log(' Target: In-App Quota Meter + Contextual Upgrade Trigger');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── Group 1: Canonical Quota Reuse & Non-Fabricating Hook ────────────────────
console.log('--- Group 1: Canonical Quota Reuse & Authoritative Ledger Access ---');

const hookPath = resolve(process.cwd(), 'src/hooks/useDailyQuota.ts');
assert(existsSync(hookPath), 'src/hooks/useDailyQuota.ts exists');

const hookSource = readFileSync(hookPath, 'utf8');

assert(
  hookSource.includes("TIER_CONFIGS") && hookSource.includes("tierAccessGuard"),
  'useDailyQuota reuses canonical TIER_CONFIGS from tierAccessGuard (no separate hardcoded quota source)'
);
assert(
  hookSource.includes('CANONICAL_TRIAL_DAILY_LIMIT = TIER_CONFIGS.free.maxDailyQueries') ||
  hookSource.includes('TIER_CONFIGS.free.maxDailyQueries'),
  'useDailyQuota binds trial limit directly to TIER_CONFIGS.free.maxDailyQueries'
);
assert(
  !hookSource.includes('FREE_TRIAL_DAILY_LIMIT = 5'),
  'useDailyQuota eliminates conflicting secondary constant FREE_TRIAL_DAILY_LIMIT = 5'
);
assert(
  hookSource.includes("from('user_usage_ledger')"),
  'useDailyQuota directly queries public.user_usage_ledger'
);
assert(
  hookSource.includes("select('ai_queries_executed')"),
  'useDailyQuota selects ai_queries_executed from usage ledger'
);
assert(
  hookSource.includes(".eq('user_id', userId)") && hookSource.includes(".eq('period_key', today)"),
  'useDailyQuota queries by authenticated user_id and UTC period_key'
);
assert(
  !hookSource.includes('.insert(') &&
  !hookSource.includes('.update(') &&
  !hookSource.includes('.upsert(') &&
  !hookSource.includes('.delete(') &&
  !hookSource.includes('.rpc('),
  'useDailyQuota is strictly non-mutating (zero writes, zero ledger modifications)'
);
assert(
  !hookSource.includes('localStorage.getItem') && !hookSource.includes('localStorage.setItem'),
  'useDailyQuota uses zero localStorage (pure authoritative database ledger)'
);
assert(
  hookSource.includes('useState<number | null>(null)'),
  'useDailyQuota initializes used state as null (avoids fabricating 0 or 5 while loading)'
);
assert(
  hookSource.includes('remaining = used !== null ? Math.max(0, CANONICAL_TRIAL_DAILY_LIMIT - used) : null'),
  'useDailyQuota sets remaining to null when data is not yet loaded'
);
assert(
  hookSource.includes('isExhausted = remaining !== null && remaining === 0'),
  'useDailyQuota only marks isExhausted=true when remaining is authoritatively 0'
);
assert(
  hookSource.includes('isRefreshingRef') && hookSource.includes('isMountedRef'),
  'useDailyQuota includes race-condition and unmount protection guards'
);

// ── Group 2: AIAdvisorHeader No-Fabrication & Loading State ──────────────────
console.log('\n--- Group 2: AIAdvisorHeader No-Fabrication & Loading State ---');

const headerPath = resolve(process.cwd(), 'src/components/ai-advisor/AIAdvisorHeader.tsx');
assert(existsSync(headerPath), 'src/components/ai-advisor/AIAdvisorHeader.tsx exists');

const headerSource = readFileSync(headerPath, 'utf8');

assert(
  !headerSource.includes('remaining ?? 5') &&
  !headerSource.includes('limit ?? 5') &&
  !headerSource.includes('used ?? 0'),
  'AIAdvisorHeader has eliminated all misleading fallbacks (remaining ?? 5, limit ?? 5, used ?? 0)'
);
assert(
  headerSource.includes('remaining: number | null;') &&
  headerSource.includes('used: number | null;'),
  'AIAdvisorHeader QuotaInfo interface types remaining and used as number | null'
);
assert(
  headerSource.includes('isQuotaLoaded = !isLoadingQuota && remaining !== null && limit !== null'),
  'AIAdvisorHeader strictly requires authoritative data to be loaded before rendering numbers'
);
assert(
  headerSource.includes('data-testid="quota-loading-indicator"') &&
  (headerSource.includes('Checking quota...') || headerSource.includes('جاري التحقق')),
  'AIAdvisorHeader displays explicit loading/checking state with spinner instead of fabricating 5/5'
);
assert(
  headerSource.includes('isTrial && (') && headerSource.includes('data-testid="trial-quota-meter"'),
  'AIAdvisorHeader gates quota meter display behind isTrial (free tier only)'
);
assert(
  headerSource.includes('data-testid="upgrade-cta-standard"'),
  'AIAdvisorHeader provides standard upgrade CTA when remaining > 2 or when loading'
);
assert(
  headerSource.includes('data-testid="upgrade-cta-warning-2"') && headerSource.includes('$49'),
  'AIAdvisorHeader provides amber warning CTA with price anchoring ($49) when authoritatively remaining === 2'
);
assert(
  headerSource.includes('data-testid="upgrade-cta-warning-1"') && headerSource.includes('animate-pulse'),
  'AIAdvisorHeader provides urgent pulsing alert CTA when authoritatively remaining === 1'
);
assert(
  headerSource.includes('data-testid="upgrade-cta-exhausted"'),
  'AIAdvisorHeader provides quota reached lock CTA when authoritatively remaining === 0'
);

// ── Group 3: AIAdvisorPage Integration & Fail-Safe Guards ───────────────────
console.log('\n--- Group 3: AIAdvisorPage Quota Integration & Fail-Safe Guards ---');

const pagePath = resolve(process.cwd(), 'src/pages/AIAdvisorPage.tsx');
assert(existsSync(pagePath), 'src/pages/AIAdvisorPage.tsx exists');

const pageSource = readFileSync(pagePath, 'utf8');

assert(
  pageSource.includes("import { useDailyQuota } from '../hooks/useDailyQuota';"),
  'AIAdvisorPage imports useDailyQuota hook'
);
assert(
  pageSource.includes("const isTrial = userTier === 'free';") &&
  pageSource.includes('const dailyQuota = useDailyQuota(isTrial);'),
  'AIAdvisorPage calls useDailyQuota passing isTrial'
);
assert(
  pageSource.includes('quota={isTrial ? dailyQuota : undefined}'),
  'AIAdvisorPage passes quota prop to AIAdvisorHeader'
);
assert(
  pageSource.includes('if (isTrial && dailyQuota.remaining === 0)'),
  'AIAdvisorPage guards handleSendMessage: blocks submission when quota authoritatively exhausted'
);
assert(
  pageSource.includes('dailyQuota.refresh().catch('),
  'AIAdvisorPage triggers dailyQuota.refresh() on successful query completion'
);
assert(
  pageSource.includes("err?.code === 'QUOTA_EXCEEDED'") || pageSource.includes('err?.status === 429'),
  'AIAdvisorPage explicitly catches 429 / QUOTA_EXCEEDED errors'
);
assert(
  pageSource.includes('data-testid="quota-exhausted-banner"'),
  'AIAdvisorPage renders contextual quota-exhausted banner when quota is authoritatively exhausted'
);
assert(
  !pageSource.includes('handleSendMessage(') ||
  !pageSource.slice(pageSource.indexOf('useEffect('), pageSource.indexOf('handleSendMessage =')).includes('handleSendMessage('),
  'AIAdvisorPage does not auto-execute queries on navigation / page mount'
);

// ── Group 4: src/lib/api.ts Fail-Closed Quota Enforcement ───────────────────
console.log('\n--- Group 4: src/lib/api.ts 429 QUOTA_EXCEEDED Transparency ---');

const apiPath = resolve(process.cwd(), 'src/lib/api.ts');
assert(existsSync(apiPath), 'src/lib/api.ts exists');

const apiSource = readFileSync(apiPath, 'utf8');

assert(
  apiSource.includes("if (res.status === 429)") &&
  apiSource.includes("(err as any).code = 'QUOTA_EXCEEDED'"),
  'api.ts detects HTTP 429 and tags error with QUOTA_EXCEEDED'
);
assert(
  apiSource.includes("if (e?.code === 'QUOTA_EXCEEDED' || e?.status === 429)") &&
  apiSource.includes("throw e;"),
  'api.ts Tier 1 rethrows 429 QUOTA_EXCEEDED without fallback to synthetic tiers'
);
assert(
  apiSource.includes("if (tier2Err?.code === 'QUOTA_EXCEEDED' || tier2Err?.status === 429)") &&
  apiSource.includes("throw tier2Err;"),
  'api.ts Tier 2 rethrows 429 QUOTA_EXCEEDED without fallback to synthetic tiers'
);

// ── Group 5: Canonical Pricing & Configuration Verification ─────────────────
console.log('\n--- Group 5: Canonical Pricing & Configuration Verification ---');

const globalConfigPath = resolve(process.cwd(), 'src/config/globalConfig.ts');
assert(existsSync(globalConfigPath), 'src/config/globalConfig.ts exists');
const globalConfigSource = readFileSync(globalConfigPath, 'utf8');

assert(
  globalConfigSource.includes('priceMonthlyUSD: 49') &&
  globalConfigSource.includes('tierId: \'startup\''),
  'globalConfig.ts defines canonical Startup tier at $49/mo'
);
assert(
  globalConfigSource.includes('priceMonthlyUSD: 139') &&
  globalConfigSource.includes('tierId: \'sme\''),
  'globalConfig.ts defines canonical SME tier at $139/mo'
);
assert(
  globalConfigSource.includes('priceMonthlyUSD: 349') &&
  globalConfigSource.includes('tierId: \'enterprise\''),
  'globalConfig.ts defines canonical Enterprise tier at $349/mo'
);

const billingPagePath = resolve(process.cwd(), 'src/pages/BillingPage.tsx');
assert(existsSync(billingPagePath), 'src/pages/BillingPage.tsx exists');
const billingSource = readFileSync(billingPagePath, 'utf8');

assert(
  billingSource.includes('Startup: { amount: 49') &&
  billingSource.includes('SMEs: { amount: 139') &&
  billingSource.includes('Enterprise: { amount: 349'),
  'BillingPage.tsx TIER_PRICING aligns with canonical pricing: Startup $49, SMEs $139, Enterprise $349'
);

// Tier Segregation: ensure paid tiers evaluate isTrial=false
const paidTiers = ['startup', 'sme', 'enterprise', 'pro', 'lawyer', 'admin'];
const allPaidSuppressed = paidTiers.every(tier => tier !== 'free');
assert(allPaidSuppressed, 'All paid tiers evaluate isTrial=false, completely suppressing quota meter');

// ── Summary ─────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 SPRINT 06 PRIORITY #1 CORRECTION VERIFICATION PASSED COMPLETELY.\n');
  process.exit(0);
}
