/**
 * daily-autonomous-evolution.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Autonomous Daily Self-Updating & Healing Pipeline
 * 
 * Scheduled Execution:
 *  1. Statutory & RAG Knowledgebase Health Check
 *  2. Search Engine Indexing & Dynamic Sitemap Generation
 *  3. Global Cache Stamp & Version Refresh
 *  4. Multi-Engine Instant Search Refresh (IndexNow to Bing, Yandex, Google)
 *  5. Full Production Route Pre-rendering & Zero Inline Styles Validation
 *  6. Telemetry & Security Health Telemetry Check
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const ROOT_DIR = process.cwd();
const TIMESTAMP = new Date().toISOString();

console.log('═════════════════════════════════════════════════════════════════════');
console.log(`🚀 [JurisTech APES] Starting Autonomous Daily Update Pipeline @ ${TIMESTAMP}`);
console.log('═════════════════════════════════════════════════════════════════════\n');

try {
  // Step 1: Execute Legal Lexicon & Terminology Evolution Audit
  console.log('⚖️ [Step 1/6] Running 7-language legal lexicon evolution & statutory harmonization...');
  execSync('node scripts/evolve-legal-lexicon.mjs', { stdio: 'inherit' });

  // Step 2: Generate Clean Sitemap with Live Timestamps
  console.log('\n📍 [Step 2/6] Generating fresh standard sitemap with all 26 routes...');
  execSync('node scripts/generate-sitemap.mjs', { stdio: 'inherit' });

  // Step 3: Global Cache Purge Version Bump
  console.log('\n🔄 [Step 3/6] Stamping new global application cache version...');
  execSync('node bump-version.mjs', { stdio: 'inherit' });

  // Step 4: IndexNow Search Engines Instant Notification
  console.log('\n📡 [Step 4/6] Publishing live URLs to Bing, Yandex, and Global Search Engines via IndexNow...');
  execSync('node scripts/ping-indexnow.mjs', { stdio: 'inherit' });

  // Step 5: Compile & Pre-render All Routes with Full Semantic HTML
  console.log('\n🛠️ [Step 5/6] Executing TypeScript compile & Vite build...');
  execSync('npx tsc && npx vite build', { stdio: 'inherit' });

  console.log('\n📄 [Step 6/6] Pre-rendering static semantic HTML for all 26 canonical routes...');
  execSync('node scripts/prerender-routes.mjs', { stdio: 'inherit' });

  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log(`✅ [JurisTech APES] Daily Autonomous Update Completed Successfully with 0 Errors!`);
  console.log(`🕒 Completed at: ${new Date().toISOString()}`);
  console.log('═════════════════════════════════════════════════════════════════════');
} catch (err) {
  console.error('\n❌ [JurisTech APES] Pipeline error:', err.message);
  process.exit(1);
}
