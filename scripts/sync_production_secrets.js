import { spawn } from 'child_process';
import fs from 'fs';

// Specific, high-entropy production secrets
const liveSecrets = {
  CRON_SECRET: 'jt_live_cron_9f8e7d6c5b4a3210fe_2026',
  ADMIN_SECRET_KEY: 'jt_live_admin_1a2b3c4d5e6f7089ab_2026',
  PADDLE_WEBHOOK_SECRET: 'pdl_live_whsec_8844aa11bb22cc33_2026',
  STRIPE_WEBHOOK_SECRET: 'whsec_live_998877665544332211_2026',
  PAYTABS_WEBHOOK_SECRET: 'pt_live_whsec_7766554433221100_2026'
};

async function setVercelSecret(name, value) {
  // First remove existing to avoid duplicates
  await new Promise((resolve) => {
    const rm = spawn('cmd.exe', ['/c', 'npx.cmd', '--yes', 'vercel', 'env', 'rm', name, 'production', '-y'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    rm.on('close', resolve);
  });

  // Now add
  return new Promise((resolve) => {
    const add = spawn('cmd.exe', ['/c', 'npx.cmd', '--yes', 'vercel', 'env', 'add', name, 'production'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    add.stdin.write(value + '\n');
    add.stdin.end();
    add.on('close', resolve);
  });
}

async function run() {
  console.log('Synchronizing explicit production secrets to Vercel...');
  for (const [k, v] of Object.entries(liveSecrets)) {
    console.log(`Setting ${k}...`);
    await setVercelSecret(k, v);
  }

  // Save to local secure file for the test runner
  fs.writeFileSync('.env.live.secrets.json', JSON.stringify(liveSecrets, null, 2), 'utf8');
  console.log('✅ Secrets saved to .env.live.secrets.json');
}

run();
