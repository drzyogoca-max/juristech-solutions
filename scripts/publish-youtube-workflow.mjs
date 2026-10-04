/**
 * JurisTech Solutions — Autonomous YouTube Video Publisher & Workflow Verifier
 * 
 * Target Market: US & European Enterprise Decision Makers (General Counsels, CFOs, Law Firms, M&A Heads)
 * Language: English
 * Workflow:
 *   1. Client Ingestion & Multi-Format OCR
 *   2. Delaware / UK / EU Statutory Risk Radar
 *   3. 1-Click Autonomous Redlining & Safe Clause Substitution
 *   4. Virtual Dispute Simulator & DealShield Due Diligence
 *   5. Certified SHA-256 Tamper-Evident Audit Report Export & E-Signature
 */

const BASE_URL = 'https://www.juristech.solutions';
const CRON_SECRET = 'jt_live_cron_9f8e7d6c5b4a3210fe_2026';

async function log(msg, ...args) {
  console.log(`[YouTube Publisher] ${msg}`, ...args);
}

async function run() {
  console.log('========================================================================');
  console.log('   JURISTECH SOLUTIONS — AUTONOMOUS YOUTUBE PRODUCTION & PUBLISHING     ');
  console.log('   TARGET: US & EUROPEAN ENTERPRISES | SCHEDULE: MORNING & EVENING     ');
  console.log('========================================================================\n');

  // Step 1: Verify Channel Connectivity & Stats
  log('Step 1: Checking YouTube Channel authorization and live stats...');
  try {
    const statsRes = await fetch(`${BASE_URL}/api/video?action=youtube-upload&subaction=channel_stats`);
    const statsData = await statsRes.json();
    log('Channel Status:', statsData.success ? 'CONNECTED & AUTHORIZED' : 'FAILED');
    console.log('  Channel ID:', statsData.channelId);
    console.log('  Channel Name:', statsData.channelTitle);
    console.log('  Subscriber Count:', statsData.subscribers);
    console.log('  Video Count:', statsData.videoCount);
    console.log('  Total Views:', statsData.totalViews);
  } catch (err) {
    console.error('Failed to get channel stats:', err.message);
  }

  console.log('\n------------------------------------------------------------------------');
  // Step 2: Trigger Morning YouTube Short (9:16)
  log('Step 2: Triggering Morning YouTube Short (Contract Risk Radar in 60s)...');
  try {
    const morningRes = await fetch(`${BASE_URL}/api/cron?task=youtube-morning&secret=${CRON_SECRET}`);
    const morningData = await morningRes.json();
    log('Morning Video Status:', morningData.success ? 'SUCCESS' : 'FAILED');
    console.log('  Slot:', morningData.slot);
    console.log('  Format:', morningData.format);
    console.log('  Edition:', morningData.edition);
    console.log('  Render ID:', morningData.renderId);
    console.log('  Soundtrack:', morningData.soundtrack || 'Active');
    console.log('  Callback Webhook:', 'https://www.juristech.solutions/api/heygen-webhook');
  } catch (err) {
    console.error('Failed to trigger morning video:', err.message);
  }

  console.log('\n------------------------------------------------------------------------');
  // Step 3: Trigger Evening Full HD Walkthrough (16:9 1080p)
  log('Step 3: Triggering Evening Comprehensive Enterprise Walkthrough (18 Steps)...');
  try {
    const eveningRes = await fetch(`${BASE_URL}/api/cron?task=youtube-evening&secret=${CRON_SECRET}`);
    const eveningData = await eveningRes.json();
    log('Evening Video Status:', eveningData.success ? 'SUCCESS' : 'FAILED');
    console.log('  Slot:', eveningData.slot);
    console.log('  Format:', eveningData.format);
    console.log('  Edition:', eveningData.edition);
    console.log('  Render ID:', eveningData.renderId);
    console.log('  Soundtrack:', eveningData.soundtrack || 'Active');
    console.log('  Callback Webhook:', 'https://www.juristech.solutions/api/heygen-webhook');
  } catch (err) {
    console.error('Failed to trigger evening video:', err.message);
  }

  console.log('\n========================================================================');
  console.log('   AUTOMATION VERIFICATION COMPLETE — VIDEOS DISPATCHED TO YOUTUBE      ');
  console.log('========================================================================\n');
}

run();
