/**
 * scripts/test-20-outreach.mjs
 * Test the upgraded 20-email autonomous outreach cycle in dry-run mode
 */

import handler, {
  MAX_NEW_ACCOUNTS_PER_DAY,
  TARGET_US_COUNT,
  TARGET_EU_COUNT,
  TARGET_GCC_COUNT,
  VERIFIED_REAL_EXECUTIVE_POOL
} from '../api/cron/autonomous-outreach.js';

async function testOutreach() {
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('🧪 Testing 20-Email Autonomous Acquisition Machine');
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log(`Max daily quota: ${MAX_NEW_ACCOUNTS_PER_DAY}`);
  console.log(`Target distribution: US=${TARGET_US_COUNT}, EU=${TARGET_EU_COUNT}, GCC=${TARGET_GCC_COUNT}`);
  console.log(`Verified pool total: ${VERIFIED_REAL_EXECUTIVE_POOL.length}`);

  // Mock request in dryRun mode
  const req = {
    method: 'POST',
    headers: {
      'x-cron-secret': 'test-secret',
    },
    query: {
      dryRun: 'true',
    },
    body: {
      dryRun: true,
    },
  };

  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, val) { this.headers[key] = val; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      console.log(`\nResponse Code: ${this.statusCode}`);
      console.log('Success:', data.success);
      console.log('Mode:', data.mode);
      console.log('Dispatched Count:', data.dispatchedCount);
      console.log('Breakdown:', data.breakdown);
      console.log('\nTop 5 Dispatched Candidates:');
      data.report.results.slice(0, 5).forEach((r, i) => {
        console.log(`  ${i+1}. [${r.market}] ${r.recipientName} (${r.recipient}) — ${r.account} [${r.status}]`);
      });
      return this;
    }
  };

  await handler(req, res);
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('✅ 20-Email Outreach Cycle Verification Complete');
}

testOutreach();
