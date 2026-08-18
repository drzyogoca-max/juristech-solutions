/**
 * Vercel Serverless & Edge API Route — /api/send
 * JurisTech Solutions | Production Email Dispatch Service Alias
 */

import handler, { POST as handlePost, GET as handleGet } from './send-email.js';

export const config = {
  runtime: 'nodejs',
};

export default handler;
export { handlePost as POST, handleGet as GET };
