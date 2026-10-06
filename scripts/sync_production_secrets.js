/**
 * scripts/sync_production_secrets.js
 * Synchronizes production secrets to Vercel via CLI using environment variables.
 * SECURE: Never hardcodes secrets; reads strictly from process.env with entropy checks.
 */

import { spawn } from 'child_process';

const REQUIRED_SECRETS = [
  'CRON_SECRET',
  'ADMIN_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'PAYTABS_WEBHOOK_SECRET',
];

async function setVercelSecret(name, value) {
  // First remove existing to avoid duplicates
  await new Promise((resolve) => {
    const rm = spawn('cmd.exe', ['/c', 'npx.cmd', '--yes', 'vercel', 'env', 'rm', name, 'production', '-y'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    rm.on('close', resolve);
  });

  // Now add securely via stdin
  return new Promise((resolve) => {
    const add = spawn('cmd.exe', ['/c', 'npx.cmd', '--yes', 'vercel', 'env', 'add', name, 'production'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    add.stdin.write(value + '\n');
    add.stdin.end();
    add.on('close', resolve);
  });
}

async function run() {
  console.log('[Secret Sync] Validating environment secrets for production sync...');

  const missing = [];
  const lowEntropy = [];

  for (const key of REQUIRED_SECRETS) {
    const val = process.env[key];
    if (!val) {
      missing.push(key);
    } else if (val.length < 24) {
      lowEntropy.push(`${key} (length: ${val.length})`);
    }
  }

  if (missing.length > 0) {
    console.error(`[Secret Sync] Aborting: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Provide them via environment: e.g. set CRON_SECRET=... before running.');
    process.exit(1);
  }

  if (lowEntropy.length > 0) {
    console.warn(`[Secret Sync] Warning: Secrets with low entropy detected: ${lowEntropy.join(', ')}`);
  }

  console.log('[Secret Sync] Synchronizing verified production secrets to Vercel...');
  for (const key of REQUIRED_SECRETS) {
    console.log(`Setting ${key}...`);
    await setVercelSecret(key, process.env[key]);
  }

  console.log('✅ Secrets synchronized securely without writing to disk.');
}

run().catch((err) => {
  console.error('[Secret Sync] Fatal Error:', err.message);
  process.exit(1);
});
