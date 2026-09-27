/**
 * Vercel Serverless Cron Gateway — /api/cron
 * Consolidated cron gateway for autonomous operations, YouTube broadcasts, and outreach.
 */

import youtubeMorningHandler from '../server/cron/youtube-morning.js';
import youtubeEveningHandler from '../server/cron/youtube-evening.js';
import outreachHandler from '../server/cron/autonomous-outreach.js';
import dailyAuditHandler from '../server/cron/daily-audit.js';
import spiderLinkedinHandler from '../server/cron/spider-linkedin.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 300,
};

export default async function handler(req, res) {
  const url = req.url || '';
  const searchParams = new URL(url, 'http://localhost').searchParams;
  const task = searchParams.get('task') || '';

  if (task === 'youtube-morning' || url.includes('youtube-morning')) {
    return youtubeMorningHandler(req, res);
  }

  if (task === 'youtube-evening' || url.includes('youtube-evening')) {
    return youtubeEveningHandler(req, res);
  }

  if (task === 'autonomous-outreach' || url.includes('autonomous-outreach')) {
    return outreachHandler(req, res);
  }

  if (task === 'daily-audit' || url.includes('daily-audit')) {
    return dailyAuditHandler(req, res);
  }

  if (task === 'spider-linkedin' || url.includes('spider-linkedin')) {
    return spiderLinkedinHandler(req, res);
  }

  // Default status
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    service: 'JurisTech Unified Cron Engine',
    availableTasks: ['youtube-morning', 'youtube-evening', 'autonomous-outreach', 'daily-audit', 'spider-linkedin'],
    timestamp: new Date().toISOString(),
  });
}
