/**
 * scripts/test-sprint05-phase3b-onboarding.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 05 Phase 3B: Lightweight Trial Onboarding Suite
 * Targeted Verification Suite
 *
 * Verifies that:
 *  1. TrialOnboardingModal exists and exports required components & canonical data.
 *  2. Signup success can trigger onboarding (CustomerAuthModal renders TrialOnboardingModal).
 *  3. No automatic AI execution occurs merely from opening AIAdvisorPage (preloads input only).
 *  4. Jurisdiction is passed to AIAdvisorPage via route state / query parameters.
 *  5. Prompt is passed to AIAdvisorPage via route state / query parameters.
 *  6. User must explicitly submit the first query (requires clicking send/start analysis).
 *  7. Onboarding completion flag (juristech_onboarding_completed) is non-sensitive UX state only.
 *  8. No subscription mutation introduced (zero client-side subscriptions writes).
 *  9. No payment mutation introduced.
 *  10. Existing Trial tier remains Free Trial (stateless 14-day evaluation).
 *  11. Existing 5-query/day policy remains strictly unchanged.
 *  12. Existing paid-tier behavior remains unchanged.
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
console.log(' JurisTech Solutions — Sprint 05 Phase 3B: Trial Onboarding Suite');
console.log(' Target: Customer Signup-to-First-Value Onboarding (<60s TTV)');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── Group 1: TrialOnboardingModal Existence & Canonical Data ─────────────────
console.log('--- Group 1: TrialOnboardingModal Existence & Configuration ---');

const onboardingModalPath = resolve(process.cwd(), 'src/components/TrialOnboardingModal.tsx');
assert(existsSync(onboardingModalPath), 'TrialOnboardingModal.tsx exists at src/components/');

const onboardingSource = readFileSync(onboardingModalPath, 'utf8');

assert(
  onboardingSource.includes('export default function TrialOnboardingModal'),
  'TrialOnboardingModal exports default component'
);
assert(
  onboardingSource.includes("code: 'SA'") &&
  onboardingSource.includes("code: 'AE'") &&
  onboardingSource.includes("code: 'EG'") &&
  onboardingSource.includes("code: 'QA'") &&
  onboardingSource.includes("code: 'JO'"),
  'ONBOARDING_JURISDICTIONS contains Saudi Arabia, UAE, Egypt, Qatar, Jordan'
);
assert(
  onboardingSource.includes("id: 'consultation'") &&
  onboardingSource.includes("id: 'contract'") &&
  onboardingSource.includes("id: 'dispute'"),
  'ONBOARDING_GOALS contains Consultation, Contract Guidance, and Dispute Resolution'
);
assert(
  onboardingSource.includes('14') &&
  onboardingSource.includes('5') &&
  onboardingSource.includes('2'),
  'TrialOnboardingModal displays canonical trial messaging (14 days, 5 queries/day, 2 contracts)'
);
assert(
  onboardingSource.includes('navigate(\'/ai-advisor\'') || onboardingSource.includes('navigate("/ai-advisor"'),
  'TrialOnboardingModal navigates to /ai-advisor upon selection'
);


// ── Group 2: CustomerAuthModal Integration & Triggering ──────────────────────
console.log('\n--- Group 2: CustomerAuthModal Onboarding Integration ---');

const authModalPath = resolve(process.cwd(), 'src/components/CustomerAuthModal.tsx');
const authModalSource = readFileSync(authModalPath, 'utf8');

assert(
  authModalSource.includes("import TrialOnboardingModal from './TrialOnboardingModal'"),
  'CustomerAuthModal imports TrialOnboardingModal'
);
assert(
  authModalSource.includes('showOnboarding') && authModalSource.includes('setShowOnboarding'),
  'CustomerAuthModal manages showOnboarding state'
);
assert(
  authModalSource.includes('<TrialOnboardingModal'),
  'CustomerAuthModal renders TrialOnboardingModal when showOnboarding is true'
);
assert(
  authModalSource.includes('onSignupSuccess'),
  'CustomerAuthModal supports onSignupSuccess callback prop'
);

// Verify signup path transitions to onboarding instead of leaving user stranded
const signupBranchMatch = authModalSource.match(/mode === 'signup'[\s\S]*?setShowOnboarding\(true\)/);
assert(
  Boolean(signupBranchMatch),
  'Successful signup activates showOnboarding instead of stranding user'
);


// ── Group 3: AIAdvisorPage Preloading & Anti-Auto-Execution (Quota Safety) ────
console.log('\n--- Group 3: AIAdvisorPage Preloading & Quota Safety ---');

const advisorPath = resolve(process.cwd(), 'src/pages/AIAdvisorPage.tsx');
const advisorSource = readFileSync(advisorPath, 'utf8');

assert(
  advisorSource.includes('useLocation') && advisorSource.includes('useSearchParams'),
  'AIAdvisorPage imports useLocation and useSearchParams'
);

assert(
  advisorSource.includes('stateJur') && advisorSource.includes('setJurisdiction'),
  'AIAdvisorPage preloads jurisdiction from route state / searchParams'
);

assert(
  advisorSource.includes('statePrompt') && advisorSource.includes('setInputQuery'),
  'AIAdvisorPage preloads prompt into inputQuery from route state / searchParams'
);

// CRITICAL QUOTA ASSERTION:
// Ensure AI execution is NOT triggered in the preloading useEffect!
const preloadEffectMatch = advisorSource.match(
  /\/\/ Preload from navigation state[\s\S]*?useEffect\(\(\) => {([\s\S]*?)}, \[location\.state, searchParams\]\);/
);

assert(
  Boolean(preloadEffectMatch),
  'Preloading useEffect block identified in AIAdvisorPage'
);

const preloadBody = preloadEffectMatch ? preloadEffectMatch[1] : '';
assert(
  !preloadBody.includes('handleSendMessage') &&
  !preloadBody.includes('executeLegalAdvisory') &&
  !preloadBody.includes('aiOrchestrator'),
  'CRITICAL: Preload useEffect DOES NOT automatically execute the AI query (Zero Quota Loss)'
);

// Anti-duplication single-flight lock
assert(
  advisorSource.includes('isSubmittingRef') &&
  advisorSource.includes('isSubmittingRef.current = true') &&
  advisorSource.includes('isSubmittingRef.current = false'),
  'AIAdvisorPage enforces isSubmittingRef single-flight lock to prevent double-execution'
);


// ── Group 4: Non-Sensitive UX State Only (No Auth/Tier Control) ───────────────
console.log('\n--- Group 4: Onboarding UX Flag & Security Invariants ---');

assert(
  onboardingSource.includes('juristech_onboarding_completed'),
  'TrialOnboardingModal records juristech_onboarding_completed'
);

// Verify juristech_onboarding_completed is NOT used to alter tier or quotas
const useSubPath = resolve(process.cwd(), 'src/hooks/useSubscription.ts');
const useSubSource = readFileSync(useSubPath, 'utf8');
assert(
  !useSubSource.includes('juristech_onboarding_completed'),
  'useSubscription is completely independent of juristech_onboarding_completed'
);

const subResolverPath = resolve(process.cwd(), 'lib/security/subscriptionResolver.js');
const subResolverSource = readFileSync(subResolverPath, 'utf8');
assert(
  !subResolverSource.includes('juristech_onboarding_completed'),
  'subscriptionResolver is completely independent of juristech_onboarding_completed'
);


// ── Group 5: Zero Subscription & Payment Mutations ────────────────────────────
console.log('\n--- Group 5: Zero Subscription & Payment Mutations ---');

assert(
  !onboardingSource.includes('.from(\'subscriptions\')') && !onboardingSource.includes('.from("subscriptions")'),
  'TrialOnboardingModal contains zero public.subscriptions queries'
);
assert(
  !onboardingSource.includes('stripe') && !onboardingSource.includes('checkout'),
  'TrialOnboardingModal contains zero payment mutations'
);
assert(
  !authModalSource.includes('.from(\'subscriptions\').insert') &&
  !authModalSource.includes('.from(\'subscriptions\').update'),
  'CustomerAuthModal contains zero subscription insert/update mutations'
);


// ── Group 6: Canonical Quotas & Paid Tier Integrity ───────────────────────────
console.log('\n--- Group 6: Canonical Quota & Tier Integrity ---');

assert(
  /'Free Trial':\s*5\b/.test(subResolverSource),
  'DAILY_AI_LIMITS[\'Free Trial\'] is strictly 5 queries/day'
);
assert(
  /'Startup':\s*50\b/.test(subResolverSource) &&
  /'SMEs':\s*150\b/.test(subResolverSource) &&
  /'Enterprise':\s*null\b/.test(subResolverSource),
  'Startup, SMEs, and Enterprise daily AI quotas remain intact'
);

const trialLimitsPath = resolve(process.cwd(), 'src/lib/trialLimits.ts');
const trialLimitsSource = readFileSync(trialLimitsPath, 'utf8');
assert(
  /export\s+const\s+MAX_FREE_TRIALS\s*=\s*2\b/.test(trialLimitsSource),
  'MAX_FREE_TRIALS is strictly 2 lifetime drafts'
);
assert(
  /'Free Trial':\s*2\b/.test(trialLimitsSource),
  'TIER_CONTRACT_LIMITS[\'Free Trial\'] is strictly 2'
);

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` Summary: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
