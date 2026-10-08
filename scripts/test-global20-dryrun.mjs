import handler from '../server/cron/autonomous-outreach.js';

async function test() {
  console.log('Testing Global 20 Batch Candidate Selection (Canada, USA, UK, KSA, Kuwait, Oman, Bahrain, Wing Assistant)...');

  const req = {
    method: 'GET',
    headers: {
      'x-cron-secret': 'test',
    },
    query: {
      dryRun: 'true',
      targetBatch: 'CANADA_USA_UK_KSA_KUWAIT_OMAN_BAHRAIN_WING',
      countries: 'canada,usa,uk,ksa,kuwait,oman,bahrain,wing',
    },
    body: {
      dryRun: true,
      targetBatch: 'CANADA_USA_UK_KSA_KUWAIT_OMAN_BAHRAIN_WING',
    },
  };

  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      console.log('Response Status:', this.statusCode);
      console.log('Success:', data.success);
      console.log('Mode:', data.mode);
      console.log('Dispatched Count:', data.dispatchedCount);
      console.log('\nSelected 20 Candidates:');
      const byCountry = {};
      data.report.results.forEach((r, i) => {
        const c = r.targetCountry || r.market;
        byCountry[c] = (byCountry[c] || 0) + 1;
        console.log(`  ${(i + 1).toString().padStart(2, ' ')}. [${c}] ${r.account} <${r.recipient}> — ${r.recipientName}`);
      });
      console.log('\nBreakdown by Country:', byCountry);
      return this;
    }
  };

  await handler(req, res);
}

test().catch(console.error);
