/**
 * Vercel Serverless API Route — /api/youtube-upload
 * JurisTech Solutions | YouTube Data API v3 Automated Publishing Service
 *
 * Project ID: gen-lang-client-0627816917
 * Redirect URI: https://www.juristech.solutions/youtube-studio
 *
 * Environment Variables Required in Vercel:
 *   YOUTUBE_CLIENT_ID       — Google OAuth2 Client ID
 *   YOUTUBE_CLIENT_SECRET   — Google OAuth2 Client Secret
 *   YOUTUBE_REFRESH_TOKEN   — Long-lived refresh token (obtained via /exchange_code)
 *
 * Actions:
 *   GET  ?action=get_auth_url  — Returns Google OAuth consent URL
 *   POST { action: 'exchange_code', code }   — Exchanges auth code for tokens
 *   POST { action: 'refresh_token' }         — Refreshes access token using refresh token
 *   POST { action: 'publish_video', ...data } — Publishes video metadata to YouTube
 *   GET  ?action=channel_stats               — Fetches live channel statistics
 */

import youtubeMorningHandler from '../cron/youtube-morning.js';
import youtubeEveningHandler from '../cron/youtube-evening.js';

export const config = { runtime: 'nodejs' };

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

const GOOGLE_CLIENT_ID     = process.env.YOUTUBE_CLIENT_ID     || '420720999238-8hcb6ng6802jukmi9088uu8k5950etn5.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const YOUTUBE_REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN || '';
const REDIRECT_URI         = 'https://www.juristech.solutions/youtube-studio';

const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');

/** Refresh the OAuth access token using the stored refresh token with full telemetry */
async function getAccessTokenDetails() {
  const missing = {
    clientId: !GOOGLE_CLIENT_ID,
    clientSecret: !GOOGLE_CLIENT_SECRET,
    refreshToken: !YOUTUBE_REFRESH_TOKEN,
  };
  if (missing.clientId || missing.clientSecret || missing.refreshToken) {
    return { token: null, error: 'MISSING_ENV_VARS', details: missing };
  }
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: YOUTUBE_REFRESH_TOKEN,
        grant_type:    'refresh_token',
      }),
    });
    const data = await res.json();
    if (data.error) {
      console.error('[YouTube API] Token refresh failed:', data.error_description || data.error);
      return { token: null, error: data.error, errorDescription: data.error_description || data.error, status: res.status };
    }
    return { token: data.access_token || null, error: null };
  } catch (err) {
    console.error('[YouTube API] Token refresh network error:', err.message);
    return { token: null, error: 'NETWORK_ERROR', errorDescription: err.message };
  }
}

export async function downloadVideo(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download video from ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getAccessToken() {
  const res = await getAccessTokenDetails();
  return res.token;
}

/** Insert video metadata into YouTube (without actual video file upload) */
export async function insertVideoMetadata(accessToken, videoData) {
  const { title, description, tags, categoryId = '27' } = videoData;
  const res = await fetch(
    'https://www.googleapis.com/youtube/v3/videos?part=snippet,status',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        snippet: {
          title:                title?.substring(0, 100) || 'JurisTech Solutions',
          description:          description?.substring(0, 5000) || 'JurisTech Solutions — AI Legal Intelligence Platform\nhttps://www.juristech.solutions',
          tags:                 (tags || []).slice(0, 30),
          categoryId:           categoryId,
          defaultLanguage:      'ar',
          defaultAudioLanguage: 'ar',
        },
        status: {
          privacyStatus:              'public',
          selfDeclaredMadeForKids:    false,
          madeForKids:                false,
          embeddable:                 true,
          publicStatsViewable:        true,
          license:                    'youtube',
        },
      }),
    }
  );
  return res.json();
}

/** Upload actual binary MP4 video to YouTube via Google Resumable Upload */
export async function uploadToYouTubeBinary(accessToken, videoBuffer, metadata) {
  const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Upload-Content-Type': 'video/mp4',
      'X-Upload-Content-Length': videoBuffer.length.toString(),
    },
    body: JSON.stringify(metadata),
  });

  if (!initRes.ok) {
    const errText = await initRes.text();
    throw new Error(`YouTube resumable init failed (${initRes.status}): ${errText}`);
  }
  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) throw new Error('YouTube did not return upload location URL');

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.length.toString(),
    },
    body: videoBuffer,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(`YouTube binary upload failed (${uploadRes.status}): ${JSON.stringify(uploadData)}`);
  }

  const videoId = uploadData.id;
  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    shortsUrl: `https://www.youtube.com/shorts/${videoId}`,
  };
}

/** Get live YouTube channel statistics */
async function getChannelStats(accessToken) {
  const res = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true',
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );
  return res.json();
}

/** Get recent videos from the channel */
async function getRecentVideos(accessToken) {
  const chRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  const chData = await chRes.json();
  const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];
  const plRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=10&playlistId=${uploadsId}`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  const plData = await plRes.json();
  return (plData.items || []).map(item => ({
    id: item.snippet?.resourceId?.videoId,
    title: item.snippet?.title,
    description: item.snippet?.description,
    publishedAt: item.snippet?.publishedAt,
    url: `https://youtu.be/${item.snippet?.resourceId?.videoId}`,
    privacyStatus: item.status?.privacyStatus,
    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
  }));
}

export default async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const rawBody = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
    const queryAction = req.query?.subaction || req.query?.op || (req.query?.action !== 'youtube-upload' ? req.query?.action : null);
    const action = queryAction || rawBody?.action || 'status';

    // ── 1. OAuth Consent URL ───────────────────────────────────────────────────
    if (action === 'get_auth_url' || (req.method === 'GET' && action === 'status')) {
      const isConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
      const isAuthorized = Boolean(YOUTUBE_REFRESH_TOKEN);

      const authUrl = isConfigured
        ? `https://accounts.google.com/o/oauth2/auth?` + new URLSearchParams({
            client_id:     GOOGLE_CLIENT_ID,
            redirect_uri:  REDIRECT_URI,
            response_type: 'code',
            scope:         YOUTUBE_SCOPES,
            access_type:   'offline',
            prompt:        'consent',
            state:         'juristech_youtube_auth',
          }).toString()
        : null;

      return res.status(200).json({
        success:       true,
        status:        isAuthorized ? 'FULLY_AUTHORIZED' : isConfigured ? 'OAUTH_CONFIGURED' : 'NEEDS_CREDENTIALS',
        isConfigured,
        isAuthorized,
        authUrl,
        projectId:     'gen-lang-client-0627816917',
        redirectUri:   REDIRECT_URI,
        instructions:  isAuthorized
          ? 'YouTube automation is fully active. Videos publish automatically at 09:00 and 18:00 UTC.'
          : 'Add YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET to Vercel env, then visit the authUrl to authorize.',
      });
    }

    // ── 2. Exchange Auth Code → Tokens ────────────────────────────────────────
    if (action === 'exchange_code' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { code } = body || {};
      if (!code) return res.status(400).json({ success: false, error: 'Missing OAuth code' });

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id:     GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri:  REDIRECT_URI,
          grant_type:    'authorization_code',
        }),
      });
      const tokens = await tokenRes.json();

      if (tokens.error) {
        return res.status(400).json({ success: false, error: tokens.error_description || tokens.error });
      }

      return res.status(200).json({
        success:              true,
        status:               'TOKENS_RECEIVED',
        accessToken:          tokens.access_token ? '***RECEIVED***' : null,
        refreshToken:         tokens.refresh_token || null,
        expiresIn:            tokens.expires_in,
        NEXT_STEP:            tokens.refresh_token
          ? `Add YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token} to Vercel Environment Variables, then redeploy.`
          : 'No refresh token received. Revoke app access in Google Account and try again.',
      });
    }

    // ── 3. Publish Video Metadata to YouTube ──────────────────────────────────
    if (action === 'publish_video' && req.method === 'POST') {
      const authSecret = req.headers['x-cron-secret'] || req.query?.secret || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
      const expectedSecrets = [process.env.CRON_SECRET, process.env.ADMIN_SECRET_KEY].filter(Boolean);
      if (expectedSecrets.length > 0 && !expectedSecrets.includes(authSecret)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: CRON_SECRET or ADMIN_SECRET_KEY required.' });
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, tags, categoryId, slot } = body || {};

      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({
          success: false,
          status:  'NOT_AUTHORIZED',
          error:   'YouTube not authorized. Add YOUTUBE_REFRESH_TOKEN to Vercel env vars.',
        });
      }

      const ytRes = await insertVideoMetadata(accessToken, { title, description, tags, categoryId });

      if (ytRes.error) {
        return res.status(400).json({ success: false, error: ytRes.error, details: ytRes });
      }

      console.log(`[YouTube] Published: ${ytRes.id} | ${title} | Slot: ${slot}`);
      return res.status(200).json({
        success:       true,
        status:        'METADATA_PUBLISHED',
        youtubeVideoId: ytRes.id,
        youtubeUrl:    ytRes.id ? `https://youtu.be/${ytRes.id}` : null,
        title,
        slot,
        note:          'Metadata published. For full video upload, use resumable upload endpoint with video file.',
      });
    }

    // ── 3b. Direct Binary Video Upload (Resumable MP4 Upload) ────────────────
    if ((action === 'upload_binary' || action === 'upload_short' || action === 'upload_from_url') && req.method === 'POST') {
      const authSecret = req.headers['x-cron-secret'] || req.query?.secret;
      const expectedSecrets = [process.env.CRON_SECRET, process.env.ADMIN_SECRET_KEY].filter(Boolean);
      if (expectedSecrets.length > 0 && !expectedSecrets.includes(authSecret)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, tags, isShort = true, videoUrl, videoBase64 } = body || {};

      let videoBuffer = null;
      if (videoBase64) {
        videoBuffer = Buffer.from(videoBase64, 'base64');
      } else if (videoUrl) {
        const fetchRes = await fetch(videoUrl);
        if (!fetchRes.ok) return res.status(400).json({ success: false, error: `Failed to fetch video from ${videoUrl}: ${fetchRes.statusText}` });
        const arr = await fetchRes.arrayBuffer();
        videoBuffer = Buffer.from(arr);
      } else {
        return res.status(400).json({ success: false, error: 'Missing videoBase64 or videoUrl' });
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({ success: false, error: 'YouTube token unavailable. Channel not authorized.' });
      }

      const finalTitle = (title || 'AI Contract Risk Radar: Audit Commercial Deals in 60s #Shorts').substring(0, 95);
      const finalDesc = (description || 'Never sign a commercial agreement blind. Watch how JurisTech AI catches unlimited liability traps and generates institutional redlines in seconds.\n\nWebsite: https://www.juristech.solutions\n#Shorts #LegalTech #Contracts #BusinessLaw #RiskRadar #JurisTech');
      const finalTags = (tags || ['Shorts', 'LegalTech', 'Contract Law', 'AI', 'JurisTech', 'Business Law', 'Risk Radar']).slice(0, 30);

      const metadata = {
        snippet: {
          title: finalTitle,
          description: finalDesc,
          tags: finalTags,
          categoryId: '27',
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
          madeForKids: false,
        }
      };

      const result = await uploadToYouTubeBinary(accessToken, videoBuffer, metadata);
      console.log(`[YouTube Direct Upload] Published: ${result.videoId} | ${finalTitle}`);
      return res.status(200).json({
        success: true,
        status: 'VIDEO_PUBLISHED_TO_YOUTUBE',
        ...result
      });
    }

    // ── 4. Live Channel Stats ─────────────────────────────────────────────────
    if (action === 'channel_stats' && req.method === 'GET') {
      const details = await getAccessTokenDetails();
      if (!details.token) {
        return res.status(503).json({
          success: false,
          error: 'YouTube not authorized',
          authDiagnostics: {
            oauthError: details.error,
            oauthDescription: details.errorDescription,
            status: details.status,
            clientIdConfigured: Boolean(GOOGLE_CLIENT_ID),
            clientSecretConfigured: Boolean(GOOGLE_CLIENT_SECRET),
            refreshTokenConfigured: Boolean(YOUTUBE_REFRESH_TOKEN),
          }
        });
      }
      const stats = await getChannelStats(details.token);
      const channel = stats.items?.[0];
      return res.status(200).json({
        success:       true,
        channelId:     channel?.id,
        channelTitle:  channel?.snippet?.title,
        subscribers:   channel?.statistics?.subscriberCount,
        totalViews:    channel?.statistics?.viewCount,
        videoCount:    channel?.statistics?.videoCount,
      });
    }

    // ── 5. List Recent Channel Videos ─────────────────────────────────────────
    if (action === 'list_videos' || action === 'recent_videos') {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({ success: false, error: 'YouTube not authorized' });
      }
      const videos = await getRecentVideos(accessToken);
      return res.status(200).json({
        success:   true,
        channelId: 'UC6gOnr7IeX5XRbpi3Oy-KvQ',
        count:     videos.length,
        videos,
      });
    }

    // ── 6. On-Demand Enterprise Workflow Publishing ────────────────────────────
    if (action === 'publish_workflow_now' || action === 'publish_evening') {
      return youtubeEveningHandler(req, res);
    }
    if (action === 'publish_morning') {
      return youtubeMorningHandler(req, res);
    }

    // ── 7. Delete Video by ID ────────────────────────────────────────────────
    if ((action === 'delete_video' || req.query?.action === 'delete_video') && (req.method === 'POST' || req.method === 'DELETE')) {
      const authSecret = req.headers['x-cron-secret'] || req.query?.secret;
      const expectedSecrets = [process.env.CRON_SECRET, process.env.ADMIN_SECRET_KEY].filter(Boolean);
      if (expectedSecrets.length > 0 && !expectedSecrets.includes(authSecret)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const videoId = body?.videoId || req.query?.videoId;
      if (!videoId) return res.status(400).json({ success: false, error: 'Missing videoId' });
      const accessToken = await getAccessToken();
      const delRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.status(delRes.status === 204 ? 200 : delRes.status).json({ success: delRes.status === 204, status: delRes.status });
    }

    return res.status(200).json({
      success:   true,
      status:    'YOUTUBE_SERVICE_READY',
      projectId: 'gen-lang-client-0627816917',
      actions:   ['get_auth_url', 'exchange_code', 'publish_video', 'channel_stats', 'list_videos', 'publish_workflow_now', 'publish_morning', 'publish_evening', 'delete_video'],
    });

  } catch (err) {
    console.error('[/api/youtube-upload] Error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}
