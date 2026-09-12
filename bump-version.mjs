/**
 * bump-version.mjs
 * Pre-build script — stamps dynamic timestamped version into versionManager.ts, public/sw.js, and public/version.json
 * Forces instant cache destruction and immediate global client update
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const versionFile = resolve(__dirname, 'public', 'version.json');
const vmFile = resolve(__dirname, 'src', 'lib', 'versionManager.ts');
const swFile = resolve(__dirname, 'public', 'sw.js');

const todayDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
const newVersion = `${todayDateStr}-LIVE-${Date.now()}`;
const buildTime = new Date().toISOString();

// 1. Update versionManager.ts
try {
  let vmContent = readFileSync(vmFile, 'utf-8');
  vmContent = vmContent.replace(/CURRENT_APP_VERSION\s*=\s*'([^']+)'/, `CURRENT_APP_VERSION = '${newVersion}'`);
  writeFileSync(vmFile, vmContent);
} catch (e) {
  console.warn('[bump-version] Warning updating versionManager.ts:', e.message);
}

// 2. Update public/sw.js
try {
  let swContent = readFileSync(swFile, 'utf-8');
  swContent = swContent.replace(/APP_VERSION\s*=\s*'([^']+)'/, `APP_VERSION = '${newVersion}'`);
  writeFileSync(swFile, swContent);
} catch (e) {
  console.warn('[bump-version] Warning updating sw.js:', e.message);
}

// 3. Write public/version.json
const updated = {
  version: newVersion,
  buildTime,
  forcePurge: true,
};

let written = false;
for (let attempt = 0; attempt < 5; attempt++) {
  try {
    writeFileSync(versionFile, JSON.stringify(updated, null, 2));
    written = true;
    break;
  } catch (e) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
  }
}
if (!written) {
  console.warn('[bump-version] Could not write version.json after retries');
}

console.log(`\n🚀 [bump-version] GLOBAL APP CACHE PURGE STAMPED → ${newVersion} @ ${buildTime}\n`);
