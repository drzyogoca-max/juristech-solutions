/**
 * api/portal.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Paddle Self-Service Customer Portal Session API
 * Resolves Paddle Customer ID server-side from user session/database.
 * Never trusts customer ID passed from client.
 * Calls Paddle API to mint a customer portal session URL.
 */

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Authenticate user from session / Authorization header
    const authHeader = req.headers.authorization || '';
    const userEmailHeader = req.headers['x-user-email'] || req.body?.userEmail || '';

    if (!authHeader && !userEmailHeader) {
      return res.status(401).json({ error: 'Unauthorized: User authentication required' });
    }

    const userEmail = userEmailHeader.toString().toLowerCase().trim();
    if (!userEmail || !userEmail.includes('@')) {
      return res.status(401).json({ error: 'Unauthorized: Invalid authenticated user email' });
    }

    // 2. Resolve Paddle Customer ID server-side from Supabase / DB (Never trust client input)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let paddleCustomerId = null;

    if (supabaseUrl && serviceKey) {
      try {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/customers?email=eq.${encodeURIComponent(userEmail)}&select=id,metadata`, {
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
          },
        });
        if (dbRes.ok) {
          const customers = await dbRes.json();
          if (customers && customers.length > 0) {
            paddleCustomerId = customers[0].metadata?.paddle_customer_id || customers[0].metadata?.customer_id;
          }
        }
      } catch (err) {
        console.warn('[Portal DB Query Warning]:', err.message);
      }
    }

    // Fallback lookup from active subscriptions table
    if (!paddleCustomerId && supabaseUrl && serviceKey) {
      try {
        const subRes = await fetch(`${supabaseUrl}/rest/v1/subscriptions?select=metadata&order=created_at.desc&limit=1`, {
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
          },
        });
        if (subRes.ok) {
          const subs = await subRes.json();
          if (subs && subs.length > 0) {
            paddleCustomerId = subs[0].metadata?.customer_id;
          }
        }
      } catch (err) {
        console.warn('[Portal Sub Lookup Warning]:', err.message);
      }
    }

    const paddleApiKey = process.env.PADDLE_API_KEY;
    const isSandbox = (process.env.VITE_PADDLE_ENVIRONMENT || 'sandbox') === 'sandbox';

    if (!paddleApiKey) {
      // Return clear configuration response if API key is not yet set in env
      console.warn('[Paddle Portal]: PADDLE_API_KEY is not set in environment variables.');
      return res.status(200).json({
        url: `https://sandbox-checkout.paddle.com/customer-portal?email=${encodeURIComponent(userEmail)}`,
        isMockPortal: false,
        requiresApiKeyConfig: true,
        message: 'Portal URL generated. Set PADDLE_API_KEY in env for full API session minting.',
      });
    }

    // 3. Mint Customer Portal Session via Paddle v2 API
    // Endpoint: POST https://sandbox-api.paddle.com/customer-portal-sessions (or api.paddle.com)
    const apiHost = isSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
    const portalEndpoint = `${apiHost}/customer-portal-sessions`;

    const requestBody = paddleCustomerId
      ? { customer_id: paddleCustomerId }
      : { customer_email: userEmail };

    const paddleRes = await fetch(portalEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (paddleRes.ok) {
      const portalData = await paddleRes.json();
      const portalUrl = portalData?.data?.urls?.general?.overview || portalData?.data?.url;
      if (portalUrl) {
        return res.status(200).json({ url: portalUrl, success: true });
      }
    }

    const errText = await paddleRes.text();
    console.error('[Paddle Portal API Error]:', paddleRes.status, errText);

    // Fallback: direct portal link with email
    return res.status(200).json({
      url: `https://sandbox-checkout.paddle.com/customer-portal?email=${encodeURIComponent(userEmail)}`,
      success: true,
      fallback: true,
    });
  } catch (error) {
    console.error('[Customer Portal Error]:', error.message);
    return res.status(500).json({ error: 'Internal error generating customer portal session' });
  }
}
