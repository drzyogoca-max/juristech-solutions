import https from 'https';

async function checkSite(url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'JurisTech-HealthCheck/1.0' } });
    const elapsed = Date.now() - start;
    const text = await res.text();
    return {
      url,
      status: res.status,
      ok: res.ok,
      elapsedMs: elapsed,
      vercelId: res.headers.get('x-vercel-id'),
      vercelCache: res.headers.get('x-vercel-cache'),
      contentType: res.headers.get('content-type'),
      htmlLength: text.length,
      hasLightClass: text.includes('class="light"'),
      hasSovereignTitle: text.includes('JurisTech'),
    };
  } catch (err) {
    return { url, error: err.message, elapsedMs: Date.now() - start };
  }
}

async function run() {
  console.log('Testing live deployment endpoints...');
  const urls = [
    'https://www.juristech.solutions',
    'https://www.juristech.solutions/version.json',
    'https://www.juristech.solutions/contracts',
    'https://www.juristech.solutions/ar',
    'https://www.juristech.solutions/dashboard',
  ];

  for (const u of urls) {
    const r = await checkSite(u);
    console.log(JSON.stringify(r, null, 2));
  }
}

run();
