export const config = { runtime: 'nodejs' };

export async function generateHeyGenVideo({ script, language, format, webhookUrl, apiKey }) {
  const dimension = format === 'short' ? { width: 720, height: 1280 } : { width: 1920, height: 1080 };
  const voiceId = language === 'ar' ? '1bd001e7e50f421d891986aad5158bc8' : '2d5b0e6cf36f460aa7fc47e3eee4ba54';
  
  const payload = {
    video_inputs: [{
      character: { type: 'avatar', avatar_id: 'Wayne_20240711', avatar_style: 'normal' },
      voice: { type: 'text', input_text: script.substring(0, 1500), voice_id: voiceId, speed: language === 'ar' ? 0.95 : 1.0 },
      background: { type: 'color', value: '#020B1A' },
    }],
    dimension,
    test: false,
    caption: true,
    callback_url: webhookUrl,
  };

  const res = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`HeyGen error: ${JSON.stringify(data.error || data)}`);
  return data.data || data;
}

export async function checkHeyGenVideoStatus(videoId, apiKey) {
  const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { 'X-Api-Key': apiKey }
  });
  const data = await res.json();
  return data.data || data;
}

export async function listHeyGenAvatars(apiKey) {
  const res = await fetch('https://api.heygen.com/v2/avatars', {
    headers: { 'X-Api-Key': apiKey }
  });
  const data = await res.json();
  return data.data || data;
}

export async function listHeyGenVoices(apiKey) {
  const res = await fetch('https://api.heygen.com/v2/voices', {
    headers: { 'X-Api-Key': apiKey }
  });
  const data = await res.json();
  return data.data || data;
}

export default function handler(req, res) {
  return res.status(200).json({
    service: 'HeyGen Integration API',
    endpoints: ['generateHeyGenVideo', 'checkHeyGenVideoStatus', 'listHeyGenAvatars', 'listHeyGenVoices']
  });
}
