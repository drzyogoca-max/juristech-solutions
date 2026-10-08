/**
 * JurisTech Solutions — Live Outreach Dispatcher
 * Dispatches 20 B2B emails across Canada, USA, UK, KSA, Kuwait, Oman, Bahrain, and Wing Assistant
 */

import handler from '../server/cron/autonomous-outreach.js';

async function execute() {
  console.log('========================================================================');
  console.log('  STARTING LIVE 20 B2B OUTREACH DISPATCH ACROSS TARGET JURISDICTIONS     ');
  console.log('  CANADA • USA • UK • KSA • KUWAIT • OMAN • BAHRAIN • WING ASSISTANT    ');
  console.log('========================================================================\n');

  const req = {
    method: 'POST',
    headers: {
      'x-cron-secret': process.env.CRON_SECRET || '',
      'authorization': process.env.ADMIN_SECRET_KEY ? `Bearer ${process.env.ADMIN_SECRET_KEY}` : '',
    },
    query: {
      targetBatch: 'CANADA_USA_UK_KSA_KUWAIT_OMAN_BAHRAIN_WING',
      countries: 'canada,usa,uk,ksa,kuwait,oman,bahrain,wing',
    },
    body: {
      targetBatch: 'CANADA_USA_UK_KSA_KUWAIT_OMAN_BAHRAIN_WING',
    },
  };

  let responseData = null;

  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      responseData = data;
      console.log('Dispatch Status:', this.statusCode);
      console.log('Success:', data.success);
      console.log('Mode:', data.mode);
      console.log('Dispatched Count:', data.dispatchedCount);
      console.log('Campaign ID:', data.report?.campaignId);
      console.log('\n------------------------------------------------------------------------');
      console.log('  DETAILED DISPATCH AUDIT LOG                                            ');
      console.log('------------------------------------------------------------------------');
      if (data.report?.results) {
        data.report.results.forEach((r, i) => {
          console.log(`[${(i + 1).toString().padStart(2, ' ')}] ${r.account}`);
          console.log(`     Country: ${r.targetCountry || r.market}`);
          console.log(`     Contact: ${r.recipientName} <${r.recipient}>`);
          console.log(`     Status:  ${r.status} (${r.provider || 'Active'})`);
          console.log('');
        });
      }
      return this;
    }
  };

  await handler(req, res);
  return responseData;
}

execute().catch(console.error);
