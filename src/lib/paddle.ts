/**
 * src/lib/paddle.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Official Paddle.js v2 Frontend Integration
 * Handles Paddle.Initialize, Paddle.PricePreview(), and Paddle.Checkout.open().
 * Displays ONLY formattedTotals returned by Paddle without price math or re-formatting.
 */

import { PADDLE_ENV } from '../config/paddle';

export interface PricePreviewMap {
  [priceId: string]: string; // e.g. "pri_starter": "$49.00"
}

export interface CheckoutOptions {
  priceId: string;
  userEmail?: string;
  paddleCustomerId?: string;
  planName?: string;
  onSuccess?: () => void;
  onClosed?: () => void;
}

declare global {
  interface Window {
    Paddle?: any;
  }
}

let paddleInitPromise: Promise<any> | null = null;

/**
 * Dynamically loads Paddle.js v2 SDK from official CDN and initializes it.
 */
export function initializePaddle(paddleCustomerId?: string): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Paddle && window.Paddle.Status?.libraryVersion) {
    return Promise.resolve(window.Paddle);
  }
  if (paddleInitPromise) return paddleInitPromise;

  paddleInitPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]');
    
    const onScriptLoad = () => {
      if (window.Paddle) {
        try {
          // Explicitly set sandbox mode ONLY if in sandbox environment
          if (PADDLE_ENV.isSandbox) {
            window.Paddle.Environment.set('sandbox');
          }

          // Build initialization payload
          const initPayload: any = {
            token: PADDLE_ENV.clientToken,
            eventCallback: (event: any) => {
              if (event?.name === 'checkout.completed') {
                console.log('[Paddle Checkout Completed Event]', event);
                const successRedirectUrl = `${window.location.origin}/welcome`;
                window.location.href = successRedirectUrl;
              }
            },
          };

          // Paddle Retain integration: pass signed-in user's Paddle Customer ID (ctm_...)
          if (paddleCustomerId && typeof paddleCustomerId === 'string' && paddleCustomerId.startsWith('ctm_')) {
            initPayload.pwCustomer = {
              id: paddleCustomerId,
            };
            console.log('[Paddle Retain Active]: Configured pwCustomer for ID:', paddleCustomerId);
          }

          window.Paddle.Initialize(initPayload);
          console.log(`[Paddle.js v2] Successfully initialized in ${PADDLE_ENV.environment.toUpperCase()} mode.`);
          resolve(window.Paddle);
        } catch (err) {
          console.warn('[Paddle.js v2] Initialization warning:', err);
          resolve(window.Paddle);
        }
      } else {
        reject(new Error('Paddle.js script loaded but window.Paddle is unavailable.'));
      }
    };

    if (existingScript) {
      existingScript.addEventListener('load', onScriptLoad);
      if (window.Paddle) onScriptLoad();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = onScriptLoad;
    script.onerror = (err) => {
      paddleInitPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return paddleInitPromise;
}

/**
 * Fetches country-localized price previews via Paddle.PricePreview().
 * Returns ONLY Paddle's formattedTotals strings directly.
 * 
 * Rules:
 * - If countryCode is present and valid ISO (e.g. 'US', 'DE'), pass address: { countryCode }.
 * - If countryCode is missing/null/empty/sentinel ('OTHERS'), DO NOT pass address — Paddle auto-detects from IP.
 */
export async function fetchPricePreviews(
  priceIds: string[],
  countryCode?: string | null
): Promise<PricePreviewMap> {
  const paddle = await initializePaddle();
  const resultMap: PricePreviewMap = {};

  if (!paddle || typeof paddle.PricePreview !== 'function') {
    console.warn('[Paddle.js] PricePreview API unavailable.');
    return resultMap;
  }

  const items = priceIds.map((priceId) => ({ priceId, quantity: 1 }));

  // Build payload. Omit address entirely if countryCode is missing, null, or internal sentinel
  const isValidIsoCountry = countryCode && /^[A-Z]{2}$/i.test(countryCode) && countryCode.toUpperCase() !== 'OTHERS';
  
  const previewPayload: any = {
    items,
  };

  if (isValidIsoCountry) {
    previewPayload.address = {
      countryCode: countryCode.toUpperCase(),
    };
  }

  try {
    const previewResult = await paddle.PricePreview(previewPayload);
    const lineItems = previewResult?.data?.details?.lineItems || previewResult?.details?.lineItems || [];

    for (const item of lineItems) {
      const priceId = item.price?.id || item.priceId;
      // Extract formattedTotals.total directly from Paddle response (no custom math or rounding)
      const formattedTotal = item.formattedTotals?.total || item.totals?.formatted?.total || null;
      if (priceId && formattedTotal) {
        resultMap[priceId] = formattedTotal;
      }
    }
  } catch (err) {
    console.error('[Paddle.PricePreview Error]:', err);
  }

  return resultMap;
}

/**
 * Opens Paddle Checkout as a one-page overlay.
 * Settings: displayMode: 'overlay', variant: 'one-page', successUrl: '/welcome'.
 */
export async function openPaddleCheckout(options: CheckoutOptions): Promise<void> {
  const paddle = await initializePaddle(options.paddleCustomerId);
  const successUrl = `${window.location.origin}/welcome`;

  if (!paddle || !paddle.Checkout) {
    console.error('[Paddle.js] Checkout SDK is not loaded.');
    window.location.href = successUrl;
    return;
  }

  paddle.Checkout.open({
    items: [
      {
        priceId: options.priceId,
        quantity: 1,
      },
    ],
    customer: options.userEmail
      ? {
          email: options.userEmail,
        }
      : undefined,
    customData: {
      userEmail: options.userEmail || '',
      planName: options.planName || '',
    },
    settings: {
      displayMode: 'overlay',
      variant: 'one-page',
      theme: 'dark',
      successUrl,
    },
  });
}
