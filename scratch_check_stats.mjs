const VITE_SUPABASE_URL = "https://wavqqcbssukoxzkegozv.supabase.co";
const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdnFxY2Jzc3Vrb3h6a2Vnb3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMTk5NDksImV4cCI6MjA5ODc5NTk0OX0.ZE5U7El3wSIYb8E34Xpc-V6tV3QewBaQ_MnP4PyRgoY";

async function queryTable(table, query = '') {
  try {
    const res = await fetch(`${VITE_SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        'apikey': VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
        'Range': '0-100'
      }
    });
    if (!res.ok) {
      return { error: `HTTP ${res.status} ${res.statusText}`, data: null };
    }
    const data = await res.json();
    return { error: null, data };
  } catch (err) {
    return { error: err.message, data: null };
  }
}

async function main() {
  console.log('=== Supabase Analytics & CRM Live Inspection for 2026-08-22 ===\n');

  // 1. Discover all tables
  const schemaRes = await fetch(`${VITE_SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
    }
  });
  const schema = await schemaRes.json();
  const tables = Object.keys(schema.paths || {})
    .filter(p => p !== '/' && !p.includes('/rpc/'))
    .map(p => p.replace('/', ''));

  console.log('Available Tables in Database:', tables.join(', '), '\n');

  for (const table of tables) {
    const result = await queryTable(table, 'order=created_at.desc.nullslast&limit=20');
    if (result.data) {
      console.log(`\n--- TABLE: ${table} (Total fetched: ${result.data.length}) ---`);
      console.log(JSON.stringify(result.data.slice(0, 5), null, 2));
    } else {
      // Try without order
      const resNoOrder = await queryTable(table, 'limit=20');
      console.log(`\n--- TABLE: ${table} ---`, resNoOrder.error || JSON.stringify(resNoOrder.data?.slice(0, 5), null, 2));
    }
  }
}

main();
