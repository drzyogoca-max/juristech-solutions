/**
 * fetch_today_visitors_direct.cjs
 * Uses built-in fetch to query Supabase REST API directly
 */

const SUPABASE_URL = 'https://wavqqcbssukoxzkegozv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdnFxY2Jzc3Vrb3h6a2Vnb3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMTk5NDksImV4cCI6MjA5ODc5NTk0OX0.ZE5U7El3wSIYb8E34Xpc-V6tV3QewBaQ_MnP4PyRgoY';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

const now = new Date();
const startOfToday = new Date();
startOfToday.setUTCHours(0, 0, 0, 0);
const todayIso = startOfToday.toISOString();

async function queryTable(table, queryParams = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${queryParams}`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const err = await res.text();
      return { error: `${res.status} ${err}` };
    }
    return { data: await res.json() };
  } catch (e) {
    return { error: e.message };
  }
}

async function run() {
  console.log('=== DATA FETCH START ===');
  
  // 1. All visitor logs today or recent
  const vRes = await queryTable('visitor_logs', `order=created_at.desc&limit=100`);
  console.log('VISITOR_LOGS:', JSON.stringify(vRes));

  // 2. Chat messages
  const cRes = await queryTable('chat_messages', `order=created_at.desc&limit=100`);
  console.log('CHAT_MESSAGES:', JSON.stringify(cRes));

  // 3. Radar Leads
  const lRes = await queryTable('radar_leads', `order=detected_at.desc&limit=50`);
  console.log('RADAR_LEADS:', JSON.stringify(lRes));

  // 4. Contracts / Risk Assessments / Payments
  const pRes = await queryTable('payments', `order=created_at.desc&limit=20`);
  console.log('PAYMENTS:', JSON.stringify(pRes));
}

run();
