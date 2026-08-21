import https from 'https';

const HOSTS = ['www.juristech.solutions'];
const KEY = 'e150aa89123c4cd6347c50daa068323be9b523a7ac68930ac50c81bd7d4219ed2258d952fb83a7ed6e5fef505ed6cc5811fd08bcc883ba57acacf49a55261b80';


const PATHS = [
  '/',
  '/dashboard',
  '/repository',
  '/contracts',
  '/risk',
  '/chat',
  '/vault',
  '/templates',
  '/legal-compliance',
  '/company-formation',
  '/negotiation',
  '/enterprise-audit',
  '/lead-radar',
  '/sovereign-ai-hub',
  '/video-hub',
  '/marketing',
  '/reports',
  '/payment',
  '/support',
  '/about',
  '/b2b-proposals',
  '/privacy',
  '/terms',
  '/legal/terms-of-service.html',
  '/legal/privacy-policy.html',
];

const ENGINES = [
  { hostname: 'api.indexnow.org', name: 'IndexNow (Bing, Yandex, Naver, Seznam)' },
  { hostname: 'www.bing.com', name: 'Bing Direct' },
  { hostname: 'yandex.com', name: 'Yandex Direct' },
];

async function pingEngineForHost(engine, host) {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => { if (!settled) { settled = true; resolve(); } };

    const urlList = PATHS.map((p) => `https://${host}${p}`);
    const keyLocation = `https://${host}/validation-key.txt`;

    const payload = JSON.stringify({
      host,
      key: KEY,
      keyLocation,
      urlList,
    });

    const options = {
      hostname: engine.hostname,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 6000,
    };

    const req = https.request(options, (res) => {
      console.log(`[IndexNow → ${engine.name} (${host})] Status: ${res.statusCode} ${res.statusMessage}`);
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log(`✅ [${engine.name} → ${host}] Instant Index Refresh Triggered!`);
      }
      res.resume();
      res.on('end', done);
    });

    req.on('error', (e) => {
      console.warn(`[IndexNow → ${engine.name} (${host})] Ping warning: ${e.message}`);
      done();
    });

    req.on('timeout', () => {
      console.warn(`[IndexNow → ${engine.name} (${host})] Timeout — skipping.`);
      req.destroy();
      done();
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log(`\n[IndexNow Global Publisher] Submitting URLs across all production domains (${HOSTS.join(', ')}) to ${ENGINES.length} search engines...\n`);

  for (const host of HOSTS) {
    await Promise.all(ENGINES.map((e) => pingEngineForHost(e, host)));
  }

  console.log('\n🏁 [SEO & Global IndexNow] All global website index notifications published successfully.\n');
}

main();
