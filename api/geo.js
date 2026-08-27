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
    US: 'United States',
    GB: 'United Kingdom',
    DE: 'Germany',
    FR: 'France',
  };

  const countryName = countryNames[countryCode] || 'International';

  return new Response(
    JSON.stringify({
      countryCode,
      countryName,
      city,
      region,
      ip,
      timezone,
    }),
    { status: 200, headers: CORS_HEADERS }
  );
}
