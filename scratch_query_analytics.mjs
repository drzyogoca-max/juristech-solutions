// scratch_query_analytics.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wavqqcbssukoxzkegozv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdnFxY2Jzc3Vrb3h6a2Vnb3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMTk5NDksImV4cCI6MjA5ODc5NTk0OX0.ZE5U7El3wSIYb8E34Xpc-V6tV3QewBaQ_MnP4PyRgoY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAnalyticsData() {
  console.log('[Analytics Query] Fetching visitor and chat metrics for today...');

  try {
    // 1. Chat Messages
    const { data: chatData, error: chatError } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (chatError) console.warn('Chat Query Warning:', chatError.message);
    console.log('[Chat Messages Count]:', chatData?.length || 0);
    if (chatData && chatData.length > 0) {
      console.log('[Sample Chat Data]:', JSON.stringify(chatData.slice(0, 5), null, 2));
    }
  } catch (e) {
    console.error('Analytics Fetch Error:', e.message);
  }
}

getAnalyticsData();
