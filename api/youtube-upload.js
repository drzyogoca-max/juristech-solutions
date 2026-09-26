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
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ');

/** Refresh the OAuth access token using the stored refresh token */
async function getAccessToken() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    return null;
  }
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
    return null;
  }
  return data.access_token || null;
}

/** Insert video metadata into YouTube (without actual video file upload) */
async function insertVideoMetadata(accessToken, videoData) {
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

export default async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const action = req.query?.action || (typeof req.body === 'object' ? req.body?.action : null) || 'status';

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

    // ── 4. Live Channel Stats ─────────────────────────────────────────────────
    if (action === 'channel_stats' && req.method === 'GET') {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({ success: false, error: 'YouTube not authorized' });
      }
      const stats = await getChannelStats(accessToken);
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

    return res.status(200).json({
      success:   true,
      status:    'YOUTUBE_SERVICE_READY',
      projectId: 'gen-lang-client-0627816917',
      actions:   ['get_auth_url', 'exchange_code', 'publish_video', 'channel_stats'],
    });

  } catch (err) {
    console.error('[/api/youtube-upload] Error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}
