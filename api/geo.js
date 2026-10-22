/**
 * Vercel Edge Serverless Function — /api/geo
 * JurisTech Solutions | Instant 0ms Geolocation Resolver
 * Extracts geo metadata directly from Edge headers.
 */

export const config = {
  runtime: 'edge',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export default async function handler(req) {
  const headers = req.headers;
  const countryCode = headers.get('x-vercel-ip-country') || 'SA';
  const region = headers.get('x-vercel-ip-country-region') || 'Riyadh';
  const city = decodeURIComponent(headers.get('x-vercel-ip-city') || 'Riyadh');
  const ip = headers.get('x-real-ip') || headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const timezone = headers.get('x-vercel-ip-timezone') || 'Asia/Riyadh';

  const countryNames = {
    SA: 'Saudi Arabia',
    AE: 'United Arab Emirates',
    EG: 'Egypt',
    QA: 'Qatar',
    KW: 'Kuwait',
    BH: 'Bahrain',
    OM: 'Oman',
    JO: 'Jordan',
    LY: 'Libya',
    IQ: 'Iraq',
    LB: 'Lebanon',
    SD: 'Sudan',
    DZ: 'Algeria',
    TN: 'Tunisia',
    MA: 'Morocco',
    NG: 'Nigeria',
    KE: 'Kenya',
    ZA: 'South Africa',
    US: 'United States',
    CA: 'Canada',
    BR: 'Brazil',
    GB: 'United Kingdom',
    DE: 'Germany',
    FR: 'France',
    CH: 'Switzerland',
    NL: 'Netherlands',
    ES: 'Spain',
    IT: 'Italy',
    SE: 'Sweden',
    SG: 'Singapore',
    MY: 'Malaysia',
    IN: 'India',
    AU: 'Australia',
    JP: 'Japan',
    CN: 'China',
    KR: 'South Korea',
  };

  const countryName = countryNames[countryCode] || 'International';

  const SANCTIONED_AND_BLOCKED = ['LY', 'SY', 'IR', 'KP', 'CU', 'RU', 'BY', 'SD'];
  const isBlocked = SANCTIONED_AND_BLOCKED.includes(countryCode);

  return new Response(
    JSON.stringify({
      countryCode,
      countryName,
      city,
      region,
      ip,
      timezone,
      isBlocked,
    }),
    { status: 200, headers: CORS_HEADERS }
  );
}
