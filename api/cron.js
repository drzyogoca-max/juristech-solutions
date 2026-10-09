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

async function runSubHandler(handlerFn, req, queryOverrides = {}) {
  return new Promise((resolve) => {
    let statusCode = 200;
    let responseData = null;
    const url = req.url || '';
    const existingParams = Object.fromEntries(new URL(url, 'http://localhost').searchParams.entries());
    const mockReq = {
      ...req,
      query: { ...existingParams, ...(req.query || {}), ...queryOverrides },
      headers: req.headers || {},
      body: req.body || {},
      method: req.method || 'GET',
    };
    const mockRes = {
      setHeader: () => mockRes,
      status: (code) => { statusCode = code; return mockRes; },
      json: (data) => { responseData = data; resolve({ status: statusCode, data }); return mockRes; },
      end: () => { resolve({ status: statusCode, data: responseData }); return mockRes; },
    };
    try {
      const p = handlerFn(mockReq, mockRes);
      if (p && typeof p.then === 'function') {
        p.catch(err => resolve({ status: 500, error: err.message }));
      }
    } catch (err) {
      resolve({ status: 500, error: err.message });
    }
  });
}

export default async function handler(req, res) {
  const url = req.url || '';
  const searchParams = new URL(url, 'http://localhost').searchParams;
  const task = searchParams.get('task') || '';

  // ── Combined Morning Broadcast (YouTube Short + Morning 10 Outreach Emails) ─
  if (task === 'morning-broadcast' || url.includes('morning-broadcast')) {
    const ytResult = await runSubHandler(youtubeMorningHandler, req);
    const outreachResult = await runSubHandler(outreachHandler, req, { slot: 'morning' });
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      cycle: 'MORNING_BROADCAST_CYCLE',
      schedule: '09:00 UTC Daily',
      youtube: ytResult.data,
      outreach: outreachResult.data,
      timestamp: new Date().toISOString(),
    });
  }

  // ── Combined Evening Broadcast (YouTube Full HD + Evening 10 Outreach Emails)
  if (task === 'evening-broadcast' || url.includes('evening-broadcast')) {
    const ytResult = await runSubHandler(youtubeEveningHandler, req);
    const outreachResult = await runSubHandler(outreachHandler, req, { slot: 'evening' });
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      cycle: 'EVENING_BROADCAST_CYCLE',
      schedule: '18:00 UTC Daily',
      youtube: ytResult.data,
      outreach: outreachResult.data,
      timestamp: new Date().toISOString(),
    });
  }

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
