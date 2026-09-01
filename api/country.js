/**
 * api/country.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Server-side Country Detection API
 * Extracts visitor ISO 2-letter country code from platform headers (Vercel/CF).
 * Returns { country: "US" } or { country: null } if absent.
 */

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  const countryHeader = (
    req.headers['x-vercel-ip-country'] ||
    req.headers['cf-ipcountry'] ||
    req.headers['x-country-code'] ||
    ''
  ).toString().toUpperCase().trim();

  // Validate ISO 3166-1 alpha-2 format (e.g., "US", "DE", "GB", "SA")
  const isValidCountry = /^[A-Z]{2}$/.test(countryHeader);

  return res.status(200).json({
    country: isValidCountry ? countryHeader : null,
  });
}
