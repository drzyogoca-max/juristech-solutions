import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'https://www.juristech.solutions';
const CRON_SECRET = process.env.CRON_SECRET || '';

async function run() {
  console.log('========================================================================');
  console.log('  ORDER 2: PUBLISHING SHORT VIDEO DIRECTLY TO YOUTUBE CHANNEL           ');
  console.log('  CHANNEL: JurisTech Solutions (UC6gOnr7IeX5XRbpi3Oy-KvQ)               ');
  console.log('========================================================================\n');

  const videoPath = path.resolve('public', 'videos', 'contract-risk-radar-short.mp4');
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found at ${videoPath}`);
  }

  const stat = fs.statSync(videoPath);
  console.log(`[YouTube Short] Video file: ${videoPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);

  const videoBase64 = fs.readFileSync(videoPath).toString('base64');
  console.log(`[YouTube Short] Encoded Base64 payload size: ${(videoBase64.length / 1024 / 1024).toFixed(2)} MB`);

  const payload = {
    title: 'AI Contract Risk Radar: How Executives Audit Commercial Deals in 60s #Shorts',
    description: 'Never sign a commercial agreement blind. Watch how JurisTech AI catches unlimited liability traps and generates institutional redlines in seconds.\n\nWebsite: https://www.juristech.solutions\nFounder Desk: founder@juristech.solutions\nWhatsApp: +201126674337\n\n#Shorts #LegalTech #Contracts #BusinessLaw #RiskRadar #JurisTech #ContractReview',
    tags: ['Shorts', 'LegalTech', 'Contract Law', 'AI', 'JurisTech', 'Business Law', 'Risk Radar', 'Contracts', 'General Counsel', 'Corporate Law'],
    isShort: true,
    videoUrl: `${BASE_URL}/videos/contract-risk-radar-short.mp4`,
    videoBase64,
  };

  const uploadEndpoint = `${BASE_URL}/api/video?action=youtube-upload&subaction=upload_short&secret=${CRON_SECRET}`;
  console.log(`[YouTube Short] Uploading directly to YouTube Data API v3 via: ${uploadEndpoint}`);

  const startTime = Date.now();
  const res = await fetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-cron-secret': CRON_SECRET,
    },
    body: JSON.stringify(payload),
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const data = await res.json();

  console.log(`\nUpload Response (${duration}s): Status ${res.status}`);
  console.log('Response Payload:', JSON.stringify(data, null, 2));

  if (data.success && data.videoId) {
    console.log('\n========================================================================');
    console.log('  ORDER 2 SUCCESS: VIDEO IS LIVE ON YOUTUBE!                             ');
    console.log('========================================================================');
    console.log(`  YouTube Video ID:  ${data.videoId}`);
    console.log(`  YouTube Watch URL: ${data.url}`);
    console.log(`  YouTube Short URL: ${data.shortsUrl}`);
    console.log('========================================================================\n');
  } else {
    console.error('\n[YouTube Short] Upload failed or returned unexpected payload:', data);
  }
}

run().catch(console.error);
