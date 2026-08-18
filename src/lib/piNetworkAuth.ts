/**
 * piNetworkAuth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Pi Network Authentication Integration Module
 *
 * Client ID: J-otdMDilqsHH_MYHFh2HXhkZ6u5FQYP4ItZNoRv7NM
 * Redirect URI: https://juristech.solutions/auth/pi/callback
 */

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: unknown) => void
      ) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
        };
      }>;
    };
  }
}

export const PI_CLIENT_ID = 'J-otdMDilqsHH_MYHFh2HXhkZ6u5FQYP4ItZNoRv7NM';
export const PI_REDIRECT_URI = 'https://juristech.solutions/auth/pi/callback';

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

/**
 * Initializes the Pi SDK dynamically if opened inside Pi Browser
 */
export async function initPiSDK(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Load Pi SDK script dynamically if not present
  if (!window.Pi) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pi SDK'));
      document.head.appendChild(script);
    }).catch(() => {
      console.warn('[Pi SDK] Could not load SDK script script.minepi.com');
    });
  }

  if (window.Pi) {
    try {
      await window.Pi.init({ version: '2.0', sandbox: false });
      console.log('[Pi SDK] Initialized successfully with Client ID:', PI_CLIENT_ID);
      return true;
    } catch (err) {
      console.warn('[Pi SDK] Init warning:', err);
    }
  }

  return false;
}

/**
 * Trigger Pi Network Login Flow
 */
export async function loginWithPi(): Promise<PiUser | null> {
  try {
    const isReady = await initPiSDK();
    if (!isReady || !window.Pi) {
      console.warn('[Pi SDK] Pi Browser SDK not available. Using fallback web auth.');
      return null;
    }

    const auth = await window.Pi.authenticate(
      ['username', 'payments'],
      (payment) => {
        console.log('[Pi SDK] Found incomplete payment:', payment);
      }
    );

    const piUser: PiUser = {
      uid: auth.user.uid,
      username: auth.user.username,
      accessToken: auth.accessToken,
    };

    localStorage.setItem('pi_user', JSON.stringify(piUser));
    return piUser;
  } catch (err) {
    console.error('[Pi SDK] Authentication error:', err);
    return null;
  }
}
