/**
 * Vercel Serverless Gateway — /api/contracts
 * Consolidated gateway routing contract generation and e-signature requests.
 */

import generateEngineHandler from '../server/contracts/generate-engine.js';
import esignatureHandler from '../server/contracts/esignature.js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const url = req.url || '';
  const searchParams = new URL(url, 'http://localhost').searchParams;
  const action = searchParams.get('action') || '';

  if (action === 'esignature' || url.includes('/esignature')) {
    return esignatureHandler(req, res);
  }

  return generateEngineHandler(req, res);
}
