const fs = require('fs');
const path = require('path');

const VITE_SUPABASE_URL = "https://wavqqcbssukoxzkegozv.supabase.co";
const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdnFxY2Jzc3Vrb3h6a2Vnb3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMTk5NDksImV4cCI6MjA5ODc5NTk0OX0.ZE5U7El3wSIYb8E34Xpc-V6tV3QewBaQ_MnP4PyRgoY";

async function main() {
  try {
    const res = await fetch(`${VITE_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    fs.writeFileSync(path.join(__dirname, 'supabase_schema.json'), JSON.stringify(data, null, 2));
    console.log("Success! Saved schema to supabase_schema.json");
    if (data.paths) {
      console.log("Exposed Tables/Endpoints:");
      Object.keys(data.paths).forEach(p => {
        if (p !== '/' && !p.includes('/rpc/')) {
          console.log(`- ${p}`);
        }
      });
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
