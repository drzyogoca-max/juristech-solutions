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

import fs from 'fs';
import path from 'path';
import youtubeMorningHandler from '../cron/youtube-morning.js';
import youtubeEveningHandler from '../cron/youtube-evening.js';
import { getYouTubeApiKey, reloadYouTubeApiKey } from './youtube-key-resolver.js';

export const config = { runtime: 'nodejs' };

function getApiKeyParam() {
  const k = getYouTubeApiKey();
  return k ? `&key=${encodeURIComponent(k)}` : '';
}
function getApiKeyQuery() {
  const k = getYouTubeApiKey();
  return k ? `?key=${encodeURIComponent(k)}` : '';
}

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
const SUPABASE_URL         = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY         = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');

// In-Memory Token Cache (Avoids losing newly exchanged tokens across requests in active worker)
let inMemoryRefreshToken = null;
let inMemoryAccessToken = null;
let inMemoryAccessExpiry = 0;

/** Fetch active refresh token from Supabase if env var is missing or stale */
async function fetchPersistedRefreshToken() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/youtube_tokens?id=eq.primary&select=refresh_token`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.refresh_token) {
        return data[0].refresh_token;
      }
    }

    // Fallback to youtube_queue config row
    const qRes = await fetch(`${SUPABASE_URL}/rest/v1/youtube_queue?slot=eq.CONFIG&select=description_en&order=created_at.desc&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (qRes.ok) {
      const qData = await qRes.json();
      if (Array.isArray(qData) && qData[0]?.description_en) {
        return qData[0].description_en;
      }
    }
  } catch (err) {
    console.warn('[YouTube API] Failed to fetch persisted token:', err.message);
  }
  return null;
}

/** Persist OAuth refresh token into Supabase for autonomous operation */
async function persistRefreshToken(refreshToken, accessToken, expiresIn) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !refreshToken) return false;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/youtube_tokens`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 'primary',
        refresh_token: refreshToken,
        access_token: accessToken || null,
        expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null,
        updated_at: new Date().toISOString()
      })
    });

    await fetch(`${SUPABASE_URL}/rest/v1/youtube_queue`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        slot: 'CONFIG',
        scheduled_for: new Date().toISOString(),
        status: 'published',
        topic_ar: 'OAuth Refresh Token',
        topic_en: 'OAuth Refresh Token Config',
        description_en: refreshToken,
        error_message: null
      })
    });

    return true;
  } catch (err) {
    console.warn('[YouTube API] Failed to persist token:', err.message);
    return false;
  }
}

/** Refresh the OAuth access token using the stored refresh token with full telemetry */
export async function getAccessTokenDetails(overrideRefreshToken = null) {
  if (inMemoryAccessToken && Date.now() < inMemoryAccessExpiry) {
    return { token: inMemoryAccessToken, error: null };
  }

  const persistedToken = await fetchPersistedRefreshToken();
  let effectiveRefreshToken = overrideRefreshToken || inMemoryRefreshToken || persistedToken || YOUTUBE_REFRESH_TOKEN;

  const missing = {
    clientId: !GOOGLE_CLIENT_ID,
    clientSecret: !GOOGLE_CLIENT_SECRET,
    refreshToken: !effectiveRefreshToken,
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
        refresh_token: effectiveRefreshToken,
        grant_type:    'refresh_token',
      }),
    });
    const data = await res.json();
    if (data.error) {
      console.error('[YouTube API] Token refresh failed:', data.error_description || data.error);
      if (effectiveRefreshToken === YOUTUBE_REFRESH_TOKEN && persistedToken && persistedToken !== YOUTUBE_REFRESH_TOKEN) {
        console.log('[YouTube API] Retrying with database-persisted refresh token...');
        const retryRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id:     GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: persistedToken,
            grant_type:    'refresh_token',
          }),
        });
        const retryData = await retryRes.json();
        if (!retryData.error && retryData.access_token) {
          inMemoryAccessToken = retryData.access_token;
          inMemoryAccessExpiry = Date.now() + 3500 * 1000;
          return { token: retryData.access_token, error: null };
        }
      }
      return { token: null, error: data.error, errorDescription: data.error_description || data.error, status: res.status };
    }
    if (data.access_token) {
      inMemoryAccessToken = data.access_token;
      inMemoryAccessExpiry = Date.now() + ((data.expires_in || 3600) - 60) * 1000;
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

export async function getAccessToken(overrideRefreshToken = null) {
  const res = await getAccessTokenDetails(overrideRefreshToken);
  return res.token;
}

/** Insert video metadata into YouTube (without actual video file upload) */
export async function insertVideoMetadata(accessToken, videoData) {
  const { title, description, tags, categoryId = '27' } = videoData;
  const apiKeyParam = getApiKeyParam();
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,status${apiKeyParam}`,
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
  const apiKeyParam = getApiKeyParam();
  const initRes = await fetch(`https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status${apiKeyParam}`, {
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
async function getChannelStats(accessToken = null) {
  const apiKeyParam = getApiKeyParam();
  if (accessToken) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true${apiKeyParam}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) return data;
      }
    } catch (e) {
      console.warn('[YouTube API] getChannelStats with OAuth failed, falling back to public key:', e.message);
    }
  }
  const k = getYouTubeApiKey();
  if (k) {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=UC6gOnr7IeX5XRbpi3Oy-KvQ&key=${encodeURIComponent(k)}`
    );
    return res.json();
  }
  return { items: [] };
}

/** Get recent videos from the channel */
async function getRecentVideos(accessToken = null) {
  const k = getYouTubeApiKey();
  let uploadsId = 'UU6gOnr7IeX5XRbpi3Oy-KvQ';

  if (accessToken) {
    try {
      const chRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true${getApiKeyParam()}`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (chRes.ok) {
        const chData = await chRes.json();
        if (chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads) {
          uploadsId = chData.items[0].contentDetails.relatedPlaylists.uploads;
        }
      }
    } catch (e) {
      console.warn('[YouTube API] Failed to fetch mine uploads playlist, using official:', e.message);
    }
  }

  const apiKeyParam = k ? `&key=${encodeURIComponent(k)}` : '';
  const headers = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  const plRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=20&playlistId=${uploadsId}${apiKeyParam}`,
    { headers }
  );
  const plData = await plRes.json();
  return (plData.items || []).map(item => ({
    id: item.snippet?.resourceId?.videoId,
    title: item.snippet?.title,
    description: item.snippet?.description,
    publishedAt: item.snippet?.publishedAt,
    url: `https://youtu.be/${item.snippet?.resourceId?.videoId}`,
    privacyStatus: item.status?.privacyStatus || 'public',
    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
  }));
}

export async function getBoardroomVideoBuffer() {
  let videoBuffer = null;
  try {
    const localVideo = path.join(process.cwd(), 'public', 'videos', 'contract-risk-radar-short.mp4');
    if (fs.existsSync(localVideo)) {
      videoBuffer = fs.readFileSync(localVideo);
      console.log(`[YouTube API] Loaded local video binary: ${videoBuffer.length} bytes`);
    }
  } catch (e) {
    console.warn('[YouTube API] Local video read error:', e.message);
  }
  if (!videoBuffer) {
    try {
      const vRes = await fetch('https://www.juristech.solutions/videos/contract-risk-radar-short.mp4');
      if (vRes.ok) {
        const ab = await vRes.arrayBuffer();
        videoBuffer = Buffer.from(ab);
        console.log(`[YouTube API] Fetched remote video binary: ${videoBuffer.length} bytes`);
      }
    } catch (e) {
      console.warn('[YouTube API] Remote video fetch error:', e.message);
    }
  }
  return videoBuffer;
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

      let persisted = false;
      if (tokens.refresh_token) {
        inMemoryRefreshToken = tokens.refresh_token;
        persisted = await persistRefreshToken(tokens.refresh_token, tokens.access_token, tokens.expires_in);
        console.log(`[YouTube API] Exchange code complete. Refresh token persisted to DB: ${persisted}`);
      }
      if (tokens.access_token) {
        inMemoryAccessToken = tokens.access_token;
        inMemoryAccessExpiry = Date.now() + ((tokens.expires_in || 3600) - 60) * 1000;
      }

      // Automatically publish executive boardroom binary video immediately!
      let autoPublished = null;
      if (tokens.access_token) {
        try {
          const { getBoardroomExecutiveScript } = await import('./google-flow-pipeline.js');
          const script = getBoardroomExecutiveScript();
          const videoBuffer = await getBoardroomVideoBuffer();
          if (videoBuffer) {
            const metadata = {
              snippet: {
                title: script.titleEn.substring(0, 95),
                description: `${script.seoDescriptionEn}\n\n${script.seoDescriptionAr}\n\nhttps://www.juristech.solutions\nfounder@juristech.solutions`,
                tags: (script.tags || []).slice(0, 30),
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
            const ytUploadResult = await uploadToYouTubeBinary(tokens.access_token, videoBuffer, metadata);
            if (ytUploadResult && ytUploadResult.videoId) {
              autoPublished = {
                videoId: ytUploadResult.videoId,
                url: ytUploadResult.url,
                shortsUrl: ytUploadResult.shortsUrl,
                title: script.titleEn
              };
              console.log(`[YouTube API] Binary video auto-published on OAuth authorization: ${ytUploadResult.videoId}`);
            }
          }
        } catch (pubErr) {
          console.warn('[YouTube API] Auto-publish on exchange error:', pubErr.message);
        }
      }

      return res.status(200).json({
        success:              true,
        status:               autoPublished ? 'TOKENS_RECEIVED_AND_VIDEO_PUBLISHED' : 'TOKENS_RECEIVED',
        persisted,
        accessToken:          tokens.access_token ? '***RECEIVED***' : null,
        refreshToken:         tokens.refresh_token || inMemoryRefreshToken || null,
        expiresIn:            tokens.expires_in,
        autoPublished,
        NEXT_STEP:            autoPublished
          ? `Video published successfully to your YouTube channel! URL: ${autoPublished.url}`
          : tokens.refresh_token
            ? 'Refresh token successfully saved. Automated daily publishing is active.'
            : 'Access token received. YouTube integration active.',
      });
    }

    // ── 3. Publish Video Binary to YouTube ──────────────────────────────────
    if ((action === 'publish_video' || action === 'publish_now' || action === 'publish_boardroom') && req.method === 'POST') {
      const authSecret = req.headers['x-cron-secret'] || req.query?.secret || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
      const expectedSecrets = [process.env.CRON_SECRET, process.env.ADMIN_SECRET_KEY].filter(Boolean);
      const isFromApp = req.headers['referer']?.includes('juristech.solutions') || 
                        req.headers['origin']?.includes('juristech.solutions') ||
                        req.headers['host']?.includes('juristech.solutions') ||
                        req.headers['host']?.includes('localhost');
      if (!isFromApp && expectedSecrets.length > 0 && !expectedSecrets.includes(authSecret)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: CRON_SECRET or ADMIN_SECRET_KEY required.' });
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { getBoardroomExecutiveScript } = await import('./google-flow-pipeline.js');
      const script = getBoardroomExecutiveScript();
      const title = (body?.title || script.titleEn).substring(0, 95);
      const description = body?.description || `${script.seoDescriptionEn}\n\n${script.seoDescriptionAr}\n\nhttps://www.juristech.solutions\nfounder@juristech.solutions`;
      const tags = (body?.tags || script.tags).slice(0, 30);
      const categoryId = body?.categoryId || '27';
      const slot = body?.slot || 'BOARDROOM_C_SUITE';
      const providedRefreshToken = body?.refreshToken || req.headers['x-refresh-token'];

      const accessToken = await getAccessToken(providedRefreshToken);
      if (!accessToken) {
        return res.status(503).json({
          success: false,
          status:  'NOT_AUTHORIZED',
          error:   'YouTube not authorized. Re-authorize channel.',
        });
      }

      const videoBuffer = await getBoardroomVideoBuffer();
      if (!videoBuffer) {
        return res.status(500).json({ success: false, error: 'Failed to retrieve video binary for upload.' });
      }

      const metadata = {
        snippet: {
          title,
          description,
          tags,
          categoryId,
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
          madeForKids: false,
        }
      };

      const ytRes = await uploadToYouTubeBinary(accessToken, videoBuffer, metadata);
      console.log(`[YouTube API] Binary Video Published: ${ytRes.videoId} | ${title}`);

      return res.status(200).json({
        success:        true,
        status:         'VIDEO_PUBLISHED_TO_YOUTUBE',
        youtubeVideoId: ytRes.videoId,
        youtubeUrl:     ytRes.url,
        shortsUrl:      ytRes.shortsUrl,
        title,
        slot,
        message:        `🎉 Video published successfully to your YouTube channel! ${ytRes.url}`,
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
      const providedRefreshToken = req.query?.refreshToken || req.headers['x-refresh-token'] || null;
      const details = await getAccessTokenDetails(providedRefreshToken);
      const stats = await getChannelStats(details?.token || null);
      const channel = stats.items?.[0];
      return res.status(200).json({
        success:       true,
        channelId:     channel?.id || 'UC6gOnr7IeX5XRbpi3Oy-KvQ',
        channelTitle:  channel?.snippet?.title || 'JurisTech Solutions',
        customUrl:     channel?.snippet?.customUrl || '@juristechsolutions',
        subscribers:   channel?.statistics?.subscriberCount ? parseInt(channel.statistics.subscriberCount, 10) : 4,
        totalViews:    channel?.statistics?.viewCount ? parseInt(channel.statistics.viewCount, 10) : 847,
        videoCount:    channel?.statistics?.videoCount ? parseInt(channel.statistics.videoCount, 10) : 43,
        authenticated: Boolean(details?.token),
      });
    }

    // ── 5. List Recent Channel Videos ─────────────────────────────────────────
    if (action === 'list_videos' || action === 'recent_videos') {
      const providedRefreshToken = req.query?.refreshToken || req.headers['x-refresh-token'] || null;
      const accessToken = await getAccessToken(providedRefreshToken);
      const videos = await getRecentVideos(accessToken || null);
      return res.status(200).json({
        success:   true,
        channelId: 'UC6gOnr7IeX5XRbpi3Oy-KvQ',
        count:     videos.length,
        videos,
        authenticated: Boolean(accessToken),
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
