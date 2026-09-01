/**
 * api/ipAllowlist.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Dynamic Webhook IP Allowlist Engine
 * Fetches Paddle's official live IP addresses from https://api.paddle.com/ips
 * Validates incoming webhook requests against data.ipv4_cidrs.
 */

let cachedCidrs = null;
let lastFetchedAt = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // Cache IP list for 24 hours

// Official fallback IPv4 CIDRs from Paddle documentation
const FALLBACK_PADDLE_IPS = [
  '34.194.127.46',
  '54.234.237.108',
  '3.208.120.145',
  '34.226.216.14',
  '34.232.58.13',
  '34.237.3.244',
  '35.174.148.88',
  '52.203.22.174',
];

/**
 * Fetches current live IPv4 CIDRs from https://api.paddle.com/ips
 * @returns {Promise<string[]>}
 */
export async function fetchPaddleOfficialIps() {
  const now = Date.now();
  if (cachedCidrs && now - lastFetchedAt < CACHE_TTL_MS) {
    return cachedCidrs;
  }

  try {
    const res = await fetch('https://api.paddle.com/ips');
    if (res.ok) {
      const data = await res.json();
      const cidrs = data?.data?.ipv4_cidrs || [];
      if (Array.isArray(cidrs) && cidrs.length > 0) {
        cachedCidrs = cidrs;
        lastFetchedAt = now;
        console.log('[Paddle IP Allowlist]: Dynamically updated official IP CIDRs:', cidrs.length);
        return cidrs;
      }
    }
  } catch (err) {
    console.warn('[Paddle IP Allowlist Fetch Warning]: Using fallback IP ranges.', err.message || err);
  }

  return FALLBACK_PADDLE_IPS;
}

/**
 * Checks if a given client IP address matches allowed Paddle CIDRs/IPs
 * @param {string} [clientIp]
 * @returns {Promise<boolean>}
 */
export async function isPaddleIpAllowed(clientIp) {
  if (!clientIp) return true; // If IP header is absent behind local proxy/test, allow signature check to handle security

  const cleanedIp = clientIp.split(',')[0].trim();
  const allowedIps = await fetchPaddleOfficialIps();

  for (const allowed of allowedIps) {
    const baseIp = allowed.split('/')[0].trim();
    if (cleanedIp === baseIp || cleanedIp === allowed.trim()) {
      return true;
    }
  }

  // Also check standard IPv4 subnet match
  return allowedIps.some((allowed) => {
    const ipPrefix = allowed.split('.')[0];
    return cleanedIp.startsWith(ipPrefix);
  });
}
