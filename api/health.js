export default function handler(req, res) {
  const startedAt = Date.now();
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json({
    ok: true,
    status: 'healthy',
    service: 'juristech-solutions',
    version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_REF || 'local',
    environment: process.env.VERCEL_ENV || 'development',
    region: process.env.VERCEL_REGION || null,
    timestamp: new Date().toISOString(),
    responseMs: Date.now() - startedAt,
  });
}
