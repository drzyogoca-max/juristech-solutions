/**
 * Vercel Serverless Gateway — /api/webhooks
 * Consolidated gateway routing payment webhooks, Resend events, and ERP callbacks.
 */

import paymentWebhookHandler from '../server/webhooks/payment.js';
import resendWebhookHandler from '../server/webhooks/resend.js';
import erpWebhookHandler from '../server/erp/webhook-handler.js';
import gumroadWebhookHandler from '../server/webhooks/gumroad.js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const url = req.url || '';
  const searchParams = new URL(url, 'http://localhost').searchParams;
  const provider = searchParams.get('provider') || '';

  if (provider === 'gumroad' || url.includes('/gumroad')) {
    return gumroadWebhookHandler(req, res);
  }

  if (provider === 'resend' || url.includes('/resend')) {
    return resendWebhookHandler(req, res);
  }

  if (provider === 'erp' || url.includes('/erp')) {
    return erpWebhookHandler(req, res);
  }

  // Default to payment gateway webhook
  return paymentWebhookHandler(req, res);
}
