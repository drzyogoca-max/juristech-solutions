import handler from '../server/cron/autonomous-outreach.js';

async function test() {
  console.log('Testing 7-Country 20-Lead Candidate Selection in Dry-Run...');

  const req = {
    method: 'GET',
    headers: {
      'x-cron-secret': 'test',
    },
    query: {
      dryRun: 'true',
      targetBatch: 'SEVEN_COUNTRIES',
      targetCountries: 'qatar,oman,kuwait,ksa,usa,uk,germany',
    },
    body: {
      dryRun: true,
      targetBatch: 'SEVEN_COUNTRIES',
    },
  };

  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      console.log('Response Status:', this.statusCode);
      console.log('Mode:', data.mode);
      console.log('Dispatched Count:', data.dispatchedCount);
      console.log('\nSelected Candidates:');
      const byCountry = {};
      data.report.results.forEach((r, i) => {
        const c = r.targetCountry || r.market;
        byCountry[c] = (byCountry[c] || 0) + 1;
        console.log(`  ${(i + 1).toString().padStart(2, ' ')}. [${r.targetCountry || r.market}] ${r.account} (${r.recipient}) — ${r.recipientName}`);
      });
      console.log('\nBreakdown by Country:', byCountry);
      return this;
    }
  };

  await handler(req, res);
}

test().catch(console.error);
