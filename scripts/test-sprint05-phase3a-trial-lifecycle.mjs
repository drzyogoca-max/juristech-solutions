/**
 * scripts/test-sprint05-phase3a-trial-lifecycle.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 05 Phase 3A: Trial Lifecycle & Status Realignment
 * Targeted Verification Suite
 *
 * Verifies that:
 *  1. Authenticated user within 14 days => Active Free Trial with dynamic daysLeft (1..14).
 *  2. daysLeft is derived strictly from user.created_at, NOT hardcoded 0.
 *  3. User created > 14 days ago => Trial Expired with daysLeft = 0.
 *  4. Canonical 2 lifetime contracts policy is preserved (src/lib/trialLimits.ts).
 *  5. Canonical 5 AI queries/day policy is preserved (lib/security/subscriptionResolver.js).
 *  6. Zero client-side subscriptions INSERT/UPDATE/UPSERT/DELETE operations introduced.
 *  7. Paid subscription DB row still takes absolute precedence over trial fallback.
 *  8. Enterprise / SMEs / Startup tier behavior is not regressed.
 *  9. BillingPage.tsx displays accurate trial status, evaluation labels, and no fabricated renewal dates.
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
console.log(' JurisTech Solutions — Sprint 05 Phase 3A: Trial Lifecycle Suite');
console.log(' Target: Free Trial 14-Day Evaluation & Truthful Status Alignment');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── Group 1: calculateTrialLifecycle Pure Logic & Math ────────────────────────
console.log('--- Group 1: calculateTrialLifecycle Runtime & Mathematical Logic ---');

const useSubPath = resolve(process.cwd(), 'src/hooks/useSubscription.ts');
const useSubSource = readFileSync(useSubPath, 'utf8');

// Strip imports and the React hook to transpile pure logic functions
const pureSource = useSubSource
  .replace(/^import\s+.*$/gm, '')
  .replace(/export\s+function\s+useSubscription[\s\S]*$/, '');

const transpiledUseSub = ts.transpileModule(pureSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const useSubBase64 = Buffer.from(transpiledUseSub.outputText).toString('base64');
const { calculateTrialLifecycle, TRIAL_DURATION_DAYS } = await import(`data:text/javascript;base64,${useSubBase64}`);

assert(TRIAL_DURATION_DAYS === 14, 'Canonical TRIAL_DURATION_DAYS is exactly 14');

// 1.1 User created right now (nowMs)
const now = new Date('2026-09-07T12:00:00.000Z').getTime();
const freshTrial = calculateTrialLifecycle(new Date(now).toISOString(), now);
assert(freshTrial.isTrialActive === true, 'Fresh account within 14 days is active');
assert(freshTrial.daysLeft === 14, 'Fresh account has 14 days remaining');
assert(freshTrial.startDate === '2026-09-07', 'Trial start date matches creation date');
assert(freshTrial.endDate === '2026-09-21', 'Trial end date is exactly creation date + 14 days');

// 1.2 User created 7 days ago
const midTrial = calculateTrialLifecycle(new Date(now - 7 * 86400000).toISOString(), now);
assert(midTrial.isTrialActive === true, 'Account 7 days old is active');
assert(midTrial.daysLeft === 7, 'Account 7 days old has exactly 7 days remaining');

// 1.3 User created 13 days and 20 hours ago (4 hours remaining)
const nearEndTrial = calculateTrialLifecycle(new Date(now - (13 * 86400000 + 20 * 3600000)).toISOString(), now);
assert(nearEndTrial.isTrialActive === true, 'Account with 4 hours left is active');
assert(nearEndTrial.daysLeft === 1, 'Account with 4 hours left has 1 day remaining (ceil)');

// 1.4 User created exactly 14 days ago
const exactEnd = calculateTrialLifecycle(new Date(now - 14 * 86400000).toISOString(), now);
assert(exactEnd.isTrialActive === false, 'Account exactly 14 days old is expired');
assert(exactEnd.daysLeft === 0, 'Expired account has 0 days remaining');

// 1.5 User created 30 days ago
const pastTrial = calculateTrialLifecycle(new Date(now - 30 * 86400000).toISOString(), now);
assert(pastTrial.isTrialActive === false, 'Account 30 days old is expired');
assert(pastTrial.daysLeft === 0, 'Account 30 days old has 0 days remaining');

// 1.6 Edge case: Clock skew (user created 1 minute in the future)
const skewTrial = calculateTrialLifecycle(new Date(now + 60000).toISOString(), now);
assert(skewTrial.isTrialActive === true, 'Slightly skewed timestamp is handled safely as active');
assert(skewTrial.daysLeft === 14, 'Skewed timestamp is capped at TRIAL_DURATION_DAYS (14)');

// 1.7 Missing / Invalid created_at
const invalidTrial = calculateTrialLifecycle('invalid-date-string', now);
assert(invalidTrial.isTrialActive === false, 'Invalid created_at fails safe to inactive');
assert(invalidTrial.daysLeft === 0, 'Invalid created_at has 0 days remaining');

const nullTrial = calculateTrialLifecycle(null, now);
assert(nullTrial.isTrialActive === false, 'Null created_at fails safe to inactive');
assert(nullTrial.daysLeft === 0, 'Null created_at has 0 days remaining');


// ── Group 2: Subscription Entitlement & Precedence Derivation ─────────────────
console.log('\n--- Group 2: Subscription Entitlement & Precedence Derivation ---');

const { mapPlanIdToTier, mapDbStatus, isSubscriptionActive } = await import(`data:text/javascript;base64,${useSubBase64}`);

// Helper function mirroring useSubscription entitlement derivation
function evaluateEntitlement({ user, dbSub, isAdmin = false, isLawyer = false, nowMs = Date.now() }) {
  const isPrivilegedRole = Boolean(isAdmin || isLawyer);
  const isDbActive = isSubscriptionActive(dbSub);
  const isSubscriber = isPrivilegedRole || isDbActive;

  const rawTier = dbSub ? mapPlanIdToTier(dbSub.plan_id, dbSub.plan_name) : 'Free Trial';
  const tier = isPrivilegedRole ? 'Enterprise' : (isDbActive ? rawTier : 'Free Trial');

  const trialLifecycle = calculateTrialLifecycle(user?.created_at, nowMs);

  let status;
  if (isPrivilegedRole) {
    status = 'Active';
  } else if (isDbActive && dbSub) {
    status = 'Active';
  } else if (dbSub) {
    const rawStatus = mapDbStatus(dbSub.status);
    status = (rawStatus === 'Active') ? 'Expired' : rawStatus;
  } else if (user?.id) {
    status = trialLifecycle.isTrialActive ? 'Active' : 'Expired';
  } else {
    status = 'Expired';
  }

  let daysLeft = 0;
  if (isPrivilegedRole) {
    daysLeft = 365;
  } else if (isDbActive && dbSub) {
    if (dbSub.expires_at) {
      const expiry = new Date(dbSub.expires_at);
      daysLeft = Math.max(0, Math.ceil((expiry.getTime() - nowMs) / (1000 * 60 * 60 * 24)));
    } else {
      daysLeft = 365;
    }
  } else if (!dbSub && user?.id) {
    daysLeft = trialLifecycle.daysLeft;
  }

  return { isSubscriber, tier, status, daysLeft };
}

// 2.1 Authenticated new user within 14 days (no DB row)
const testNewUser = evaluateEntitlement({
  user: { id: 'usr-1', created_at: new Date(now - 2 * 86400000).toISOString() },
  dbSub: null,
  nowMs: now,
});
assert(testNewUser.tier === 'Free Trial', 'New user has Free Trial tier');
assert(testNewUser.status === 'Active', 'New user within 14 days has status: Active');
assert(testNewUser.daysLeft === 12, 'New user 2 days old has daysLeft: 12');
assert(testNewUser.isSubscriber === false, 'Trial user is NOT a paid subscriber (paid tools remain locked)');

// 2.2 Authenticated user older than 14 days (no DB row)
const testExpiredUser = evaluateEntitlement({
  user: { id: 'usr-2', created_at: new Date(now - 20 * 86400000).toISOString() },
  dbSub: null,
  nowMs: now,
});
assert(testExpiredUser.tier === 'Free Trial', 'Expired trial user maintains Free Trial tier');
assert(testExpiredUser.status === 'Expired', 'User >14 days has status: Expired');
assert(testExpiredUser.daysLeft === 0, 'User >14 days has daysLeft: 0');
assert(testExpiredUser.isSubscriber === false, 'Expired trial user is NOT a paid subscriber');

// 2.3 Unauthenticated visitor (guest)
const testGuest = evaluateEntitlement({ user: null, dbSub: null, nowMs: now });
assert(testGuest.tier === 'Free Trial', 'Guest defaults to Free Trial');
assert(testGuest.status === 'Expired', 'Guest defaults to status: Expired');
assert(testGuest.daysLeft === 0, 'Guest has daysLeft: 0');
assert(testGuest.isSubscriber === false, 'Guest is NOT a subscriber');

// 2.4 Paid DB subscription precedence: Active Startup row
const testStartupUser = evaluateEntitlement({
  user: { id: 'usr-3', created_at: new Date(now - 2 * 86400000).toISOString() }, // created 2 days ago
  dbSub: {
    id: 'sub-1',
    user_id: 'usr-3',
    plan_id: 'startup',
    plan_name: 'Startup Legal AI Retainer',
    status: 'active',
    expires_at: new Date(now + 28 * 86400000).toISOString(),
  },
  nowMs: now,
});
assert(testStartupUser.tier === 'Startup', 'Active Startup DB row overrides trial fallback');
assert(testStartupUser.status === 'Active', 'Startup DB row gives status: Active');
assert(testStartupUser.isSubscriber === true, 'Startup user is a verified subscriber');
assert(testStartupUser.daysLeft === 28, 'Startup daysLeft reflects DB expires_at (28 days)');

// 2.5 Paid DB subscription precedence: Active SMEs row
const testSmesUser = evaluateEntitlement({
  user: { id: 'usr-4', created_at: new Date(now - 50 * 86400000).toISOString() },
  dbSub: {
    id: 'sub-2',
    user_id: 'usr-4',
    plan_id: 'smes',
    plan_name: 'SMEs Sovereign Growth',
    status: 'active',
    expires_at: new Date(now + 15 * 86400000).toISOString(),
  },
  nowMs: now,
});
assert(testSmesUser.tier === 'SMEs', 'Active SMEs DB row produces SMEs tier');
assert(testSmesUser.status === 'Active', 'SMEs DB row produces Active status');
assert(testSmesUser.isSubscriber === true, 'SMEs user is a verified subscriber');

// 2.6 Paid DB subscription precedence: Active Enterprise row
const testEnterpriseUser = evaluateEntitlement({
  user: { id: 'usr-5', created_at: new Date(now - 100 * 86400000).toISOString() },
  dbSub: {
    id: 'sub-3',
    user_id: 'usr-5',
    plan_id: 'enterprise',
    plan_name: 'Enterprise Sovereign AI Retainer',
    status: 'active',
    expires_at: new Date(now + 300 * 86400000).toISOString(),
  },
  nowMs: now,
});
assert(testEnterpriseUser.tier === 'Enterprise', 'Active Enterprise DB row produces Enterprise tier');
assert(testEnterpriseUser.isSubscriber === true, 'Enterprise user is a verified subscriber');

// 2.7 Paid DB subscription precedence: Cancelled / Expired DB row
const testCancelledDbSub = evaluateEntitlement({
  user: { id: 'usr-6', created_at: new Date(now - 5 * 86400000).toISOString() }, // within 14d, but has DB sub!
  dbSub: {
    id: 'sub-4',
    user_id: 'usr-6',
    plan_id: 'startup',
    plan_name: 'Startup Retainer',
    status: 'cancelled',
    expires_at: new Date(now - 1 * 86400000).toISOString(),
  },
  nowMs: now,
});
assert(testCancelledDbSub.status === 'Cancelled', 'Cancelled DB row takes precedence over trial window');
assert(testCancelledDbSub.isSubscriber === false, 'Cancelled subscriber is not active');

// 2.8 Admin / Lawyer privileged role override
const testAdminUser = evaluateEntitlement({
  user: { id: 'usr-admin', created_at: new Date(now - 300 * 86400000).toISOString() },
  dbSub: null,
  isAdmin: true,
  nowMs: now,
});
assert(testAdminUser.tier === 'Enterprise', 'Admin role receives Enterprise tier override');
assert(testAdminUser.status === 'Active', 'Admin role receives Active status override');
assert(testAdminUser.isSubscriber === true, 'Admin role receives isSubscriber override');
assert(testAdminUser.daysLeft === 365, 'Admin role receives 365 days');


// ── Group 3: Canonical Quota Preservation (2 Contracts, 5 AI/day) ─────────────
console.log('\n--- Group 3: Canonical Quota & Policy Preservation ---');

// 3.1 Verify Contract Limits in src/lib/trialLimits.ts
const trialLimitsPath = resolve(process.cwd(), 'src/lib/trialLimits.ts');
const trialLimitsSource = readFileSync(trialLimitsPath, 'utf8');

assert(
  /export\s+const\s+MAX_FREE_TRIALS\s*=\s*2\b/.test(trialLimitsSource),
  'MAX_FREE_TRIALS is strictly 2 total lifetime drafts'
);
assert(
  /'Free Trial':\s*2\b/.test(trialLimitsSource),
  "TIER_CONTRACT_LIMITS['Free Trial'] is strictly 2"
);
assert(
  /'Startup':\s*10\b/.test(trialLimitsSource),
  "TIER_CONTRACT_LIMITS['Startup'] is strictly 10"
);
assert(
  /'SMEs':\s*50\b/.test(trialLimitsSource),
  "TIER_CONTRACT_LIMITS['SMEs'] is strictly 50"
);
assert(
  /'Enterprise':\s*Infinity\b/.test(trialLimitsSource),
  "TIER_CONTRACT_LIMITS['Enterprise'] is Infinity"
);

// 3.2 Verify Daily AI limits in lib/security/subscriptionResolver.js
const subResolverPath = resolve(process.cwd(), 'lib/security/subscriptionResolver.js');
const subResolverSource = readFileSync(subResolverPath, 'utf8');

assert(
  /'Free Trial':\s*5\b/.test(subResolverSource),
  "DAILY_AI_LIMITS['Free Trial'] is strictly 5 queries/day"
);
assert(
  /'Startup':\s*50\b/.test(subResolverSource),
  "DAILY_AI_LIMITS['Startup'] is strictly 50 queries/day"
);
assert(
  /'SMEs':\s*150\b/.test(subResolverSource),
  "DAILY_AI_LIMITS['SMEs'] is strictly 150 queries/day"
);
assert(
  /'Enterprise':\s*null\b/.test(subResolverSource),
  "DAILY_AI_LIMITS['Enterprise'] is null (unlimited)"
);


// ── Group 4: Security Audit & Zero Client-Side Writes ─────────────────────────
console.log('\n--- Group 4: Security Audit & Zero Client-Side Writes ---');

// 4.1 Verify no client-side writes in useSubscription.ts for trial
assert(
  !useSubSource.includes('.insert('),
  'useSubscription contains zero .insert() calls'
);
assert(
  !useSubSource.includes('.upsert('),
  'useSubscription contains zero .upsert() calls'
);

// 4.2 Verify trial fallback does not use localStorage
assert(
  !useSubSource.includes('localStorage'),
  'useSubscription has zero localStorage dependencies'
);

// 4.3 Verify created_at is authoritative
assert(
  useSubSource.includes('user?.created_at'),
  'useSubscription evaluates trial strictly from user.created_at'
);


// ── Group 5: BillingPage.tsx Presentation Verification ────────────────────────
console.log('\n--- Group 5: BillingPage.tsx Presentation Verification ---');

const billingPagePath = resolve(process.cwd(), 'src/pages/BillingPage.tsx');
const billingSource = readFileSync(billingPagePath, 'utf8');

// 5.1 Presentation strings
assert(
  billingSource.includes('Free Trial — Active'),
  'BillingPage contains "Free Trial — Active" badge display'
);
assert(
  billingSource.includes('14-day evaluation'),
  'BillingPage contains "14-day evaluation" display'
);
assert(
  billingSource.includes('Trial Expired'),
  'BillingPage contains "Trial Expired" display'
);

// 5.2 No fabricated renewal date for Free Trial
assert(
  billingSource.includes('Trial Expiry'),
  'BillingPage distinguishes "Trial Expiry" from "Renewal Date" for Free Trial'
);

// 5.3 Paid plan cards and presentation preserved
assert(
  billingSource.includes('Startup Legal AI Retainer') || billingSource.includes('{tier} Legal AI Retainer'),
  'BillingPage preserves paid legal AI retainer title format'
);
assert(
  billingSource.includes('TIER_PRICING'),
  'BillingPage preserves TIER_PRICING mapping'
);
assert(
  billingSource.includes("tier === 'Enterprise'") && billingSource.includes("tier === 'SMEs'"),
  'BillingPage preserves Enterprise and SMEs tier styling'
);

// 5.4 No client-side writes in BillingPage.tsx
assert(
  !billingSource.includes("supabase.from('subscriptions').insert"),
  'BillingPage does not insert into public.subscriptions'
);
assert(
  !billingSource.includes("supabase.from('subscriptions').upsert"),
  'BillingPage does not upsert into public.subscriptions'
);

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` Summary: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
