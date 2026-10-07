/**
 * Vercel Serverless Gateway — /api/video
 * Consolidated gateway routing YouTube upload, video generation, and HeyGen webhooks.
 */

import youtubeUploadHandler from '../server/video/youtube-upload.js';
import heygenWebhookHandler from '../server/video/heygen-webhook.js';
import heygenGenerateHandler from '../server/video/heygen-generate.js';
import videoGenerateHandler from '../server/video/video-generate.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 300,
};

export default async function handler(req, res) {
  const url = req.url || '';
  const searchParams = new URL(url, 'http://localhost').searchParams;
  const action = searchParams.get('action') || '';

  if (
    action === 'youtube-upload' ||
    action === 'upload_short' ||
    action === 'upload_binary' ||
    action === 'upload_from_url' ||
    url.includes('youtube-upload') ||
    url.includes('upload_short')
  ) {
    return youtubeUploadHandler(req, res);
  }

  if (action === 'heygen-webhook' || url.includes('heygen-webhook')) {
    return heygenWebhookHandler(req, res);
  }

  if (action === 'heygen-generate' || url.includes('heygen-generate')) {
    return heygenGenerateHandler(req, res);
  }

  if (action === 'video-generate' || url.includes('video-generate')) {
    return videoGenerateHandler(req, res);
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    service: 'JurisTech Video & Media Gateway',
    timestamp: new Date().toISOString(),
  });
}
