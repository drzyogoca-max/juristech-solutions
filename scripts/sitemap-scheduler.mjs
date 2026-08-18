/**
 * sitemap-scheduler.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Automated Dynamic XML Sitemap Generator & 24h Cron Runner
 * Domain: https://juristech.solutions
 */

import { generateSitemap } from './generate-sitemap.mjs';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

console.log('[Sitemap Scheduler] Initializing 24-hour automated sitemap update cycle...');

// 1. Initial immediate generation
try {
  generateSitemap();
} catch (err) {
  console.error('[Sitemap Scheduler] Initial sitemap generation failed:', err);
}

// 2. Schedule recurring 24-hour regeneration interval
setInterval(() => {
  console.log(`[Sitemap Scheduler] Running 24-hour scheduled sitemap regeneration...`);
  try {
    generateSitemap();
  } catch (err) {
    console.error('[Sitemap Scheduler] Scheduled sitemap generation failed:', err);
  }
}, TWENTY_FOUR_HOURS_MS);
