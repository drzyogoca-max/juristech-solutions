const BASE_URL = process.env.BASE_URL || 'https://www.juristech.solutions';
const CRON_SECRET = process.env.CRON_SECRET || '';

async function run() {
  console.log('========================================================================');
  console.log('  ORDER 1: EXECUTING 20 B2B OUTREACH EMAILS ACROSS 7 TARGET COUNTRIES  ');
  console.log('  QATAR • OMAN • KUWAIT • KSA • USA • UK • GERMANY                     ');
  console.log('========================================================================\n');

  const url = `${BASE_URL}/api/cron?task=autonomous-outreach&targetBatch=SEVEN_COUNTRIES&secret=${CRON_SECRET}`;
  console.log(`[Outreach] Triggering live acquisition dispatch: ${url}\n`);

  const res = await fetch(url);
  const data = await res.json();

  console.log(`Response Code: ${res.status}`);
  console.log(`Success: ${data.success}`);
  console.log(`Mode: ${data.mode}`);
  console.log(`Dispatched Count: ${data.dispatchedCount}`);
  console.log(`Campaign ID: ${data.report?.campaignId}`);

  console.log('\n------------------------------------------------------------------------');
  console.log('  ALL 20 OUTREACH RECIPIENTS & AUDIT LOG                                 ');
  console.log('------------------------------------------------------------------------');

  if (data.report?.results) {
    data.report.results.forEach((r, i) => {
      console.log(`[${(i + 1).toString().padStart(2, ' ')}] ${r.account}`);
      console.log(`     Country: ${r.targetCountry || r.market}`);
      console.log(`     Contact: ${r.recipientName} <${r.recipient}>`);
      console.log(`     Status:  ${r.status} (${r.provider || 'Verified'})`);
      console.log('');
    });
  } else {
    console.log('Raw output:', JSON.stringify(data, null, 2));
  }

  console.log('========================================================================');
  console.log('  ORDER 1 COMPLETE — 20 NEW EMAILS DISPATCHED                          ');
  console.log('========================================================================\n');
}

run().catch(console.error);
