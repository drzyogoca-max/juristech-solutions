export const config = { runtime: 'nodejs', maxDuration: 300 };

async function getYouTubeAccessToken() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) throw new Error('Missing YouTube credentials');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to refresh YouTube token');
  return data.access_token;
}

async function getQueueItem(heygenVideoId) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${url}/rest/v1/youtube_queue?heygen_video_id=eq.${heygenVideoId}&select=*`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  return data && data.length > 0 ? data[0] : null;
}

async function updateQueueItem(id, updates) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  await fetch(`${url}/rest/v1/youtube_queue?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(updates)
  });
}

async function downloadVideo(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToYouTube(accessToken, videoBuffer, metadata) {
  const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Upload-Content-Type': 'video/mp4',
      'X-Upload-Content-Length': videoBuffer.length.toString()
    },
    body: JSON.stringify(metadata)
  });

  if (!initRes.ok) throw new Error(`YouTube init failed: ${await initRes.text()}`);
  const uploadUrl = initRes.headers.get('location');

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.length.toString()
    },
    body: videoBuffer
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(`YouTube upload failed: ${JSON.stringify(uploadData)}`);

  const videoId = uploadData.id;
  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    shortsUrl: `https://www.youtube.com/shorts/${videoId}`
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const body = req.body;
    const eventType = body.event_type || body.eventType;
    if (eventType !== 'video.completed' && eventType !== 'completed') {
      return res.status(200).json({ status: 'ignored', reason: 'Not a completed event' });
    }

    const videoId = body.data?.video_id || body.video_id;
    const videoUrl = body.data?.video_url || body.video_url;

    if (!videoId || !videoUrl) {
      return res.status(400).json({ error: 'Missing video_id or video_url' });
    }

    const queueItem = await getQueueItem(videoId);
    if (!queueItem) {
      return res.status(404).json({ error: 'Queue item not found' });
    }

    await updateQueueItem(queueItem.id, { status: 'uploading' });

    const videoBuffer = await downloadVideo(videoUrl);
    const accessToken = await getYouTubeAccessToken();

    let tags = [];
    try { tags = typeof queueItem.tags === 'string' ? JSON.parse(queueItem.tags) : queueItem.tags; } catch (e) {}
    if (!Array.isArray(tags)) tags = [];
    tags.push('JurisTech', 'Legal Tech', 'AI', 'Contracts', 'Arabic', 'UAE Law', 'Saudi Arabia');
    if (queueItem.slot === 'MORNING') tags.push('Shorts');

    const descAr = queueItem.description_ar || '';
    const descEn = queueItem.description_en || '';
    const description = `${descEn}\n\n${descAr}\n\nContact: founder@juristech.solutions | +201126674337\n\n#JurisTech #LegalTech #AI`;

    const metadata = {
      snippet: {
        title: queueItem.title_ar || queueItem.title_en || 'JurisTech AI Video',
        description: description,
        tags: tags,
        categoryId: '27',
        defaultLanguage: 'ar'
      },
      status: {
        privacyStatus: 'public',
        madeForKids: false
      }
    };

    const uploadResult = await uploadToYouTube(accessToken, videoBuffer, metadata);

    await updateQueueItem(queueItem.id, {
      status: 'published',
      youtube_video_id: uploadResult.videoId,
      video_url: queueItem.slot === 'MORNING' ? uploadResult.shortsUrl : uploadResult.url,
      published_at: new Date().toISOString()
    });

    return res.status(200).json({ success: true, youtube: uploadResult });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
