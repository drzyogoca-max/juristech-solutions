/**
 * src/config/paddle.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strict Paddle Environment Configuration
 * Reads environment settings from env vars and fails loudly if unset.
 */

const envMode = import.meta.env.VITE_PADDLE_ENVIRONMENT;
const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

if (!envMode) {
  throw new Error(
    '[FATAL]: VITE_PADDLE_ENVIRONMENT environment variable is missing! ' +
    'You must explicitly set VITE_PADDLE_ENVIRONMENT="sandbox" or "live".'
  );
}

if (envMode !== 'sandbox' && envMode !== 'live') {
  throw new Error(
    `[FATAL]: Invalid VITE_PADDLE_ENVIRONMENT value: "${envMode}". ` +
    'Allowed values are strictly "sandbox" or "live".'
  );
}

if (!clientToken) {
  throw new Error(
    '[FATAL]: VITE_PADDLE_CLIENT_TOKEN environment variable is missing! ' +
    'Please provide a client-side token (e.g. test_... for sandbox).'
  );
}

export const PADDLE_ENV = {
  environment: envMode as 'sandbox' | 'live',
  clientToken: clientToken as string,
  isSandbox: envMode === 'sandbox',
};
