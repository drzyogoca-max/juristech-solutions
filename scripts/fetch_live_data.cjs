/**
 * fetch_today_visitors_direct.cjs
 * Uses built-in fetch to query Supabase REST API directly
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables required.');
  process.exit(1);
}

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
