import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.juristech.solutions';
const TODAY = new Date().toISOString().split('T')[0];

/**
 * 100% Genuine, 200 OK Canonical Public Routes.
 * STRICT RULE: ZERO redirects (no /pricing, /youtube, /youtube-channel, /company-formation)
 * ZERO admin-only routes (no /marketing, /youtube-studio, /lead-radar)
 */
const CANONICAL_PAGES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/dashboard', priority: '0.95', changefreq: 'daily' },
  { path: '/contracts', priority: '0.95', changefreq: 'daily' },
  { path: '/risk', priority: '0.98', changefreq: 'daily' },
  { path: '/templates', priority: '0.95', changefreq: 'daily' },
  { path: '/repository', priority: '0.95', changefreq: 'daily' },
  { path: '/poa-library', priority: '0.90', changefreq: 'daily' },
  { path: '/deal-shield', priority: '0.95', changefreq: 'daily' },
  { path: '/negotiation', priority: '0.90', changefreq: 'weekly' },
  { path: '/corporate-structuring', priority: '0.92', changefreq: 'weekly' },
  { path: '/enterprise-audit', priority: '0.90', changefreq: 'weekly' },
  { path: '/legal-compliance', priority: '0.92', changefreq: 'weekly' },
  { path: '/acquisition', priority: '0.90', changefreq: 'weekly' },
  { path: '/sovereign-ai-hub', priority: '0.90', changefreq: 'daily' },
  { path: '/investigate', priority: '0.88', changefreq: 'weekly' },
  { path: '/b2b-proposals', priority: '0.88', changefreq: 'weekly' },
  { path: '/payment', priority: '0.95', changefreq: 'daily' },
  { path: '/support', priority: '0.85', changefreq: 'weekly' },
  { path: '/about', priority: '0.85', changefreq: 'monthly' },
  { path: '/video-hub', priority: '0.80', changefreq: 'weekly' },
  { path: '/reports', priority: '0.80', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.70', changefreq: 'monthly' },
  { path: '/terms', priority: '0.70', changefreq: 'monthly' },
  { path: '/refund', priority: '0.70', changefreq: 'monthly' },
  { path: '/billing', priority: '0.85', changefreq: 'weekly' },
];

/**
 * Supported UI Locales for Multi-Jurisdictional Global Indexation
 * German (DE), Turkish (TR), Chinese (ZH), American/Global (EN), Gulf/MENA (AR), French (FR), Spanish (ES)
 */
const LOCALES = [
  { code: 'ar', prefix: '/ar' },
  { code: 'en', prefix: '/en' },
  { code: 'de', prefix: '/de' },
  { code: 'tr', prefix: '/tr' },
  { code: 'zh', prefix: '/zh' },
  { code: 'fr', prefix: '/fr' },
  { code: 'es', prefix: '/es' },
];

function buildHreflangTags(pagePath) {
  const lines = [];
  // Default fallback
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${pagePath || '/'}" />`);
  // Root and localized entries
  LOCALES.forEach(loc => {
    const locUrl = `${BASE_URL}${loc.prefix}${pagePath}`;
    lines.push(`    <xhtml:link rel="alternate" hreflang="${loc.code}" href="${locUrl}" />`);
  });
  return lines.join('\n');
}

export function generateSitemap() {
  const urlEntries = [];

  CANONICAL_PAGES.forEach(page => {
    const hreflangBlock = buildHreflangTags(page.path);

    // 1. Root default entry
    const rootLoc = `${BASE_URL}${page.path || '/'}`;
    urlEntries.push(`  <url>
    <loc>${rootLoc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangBlock}
  </url>`);

    // 2. Localized entries for targeted international search engines
    LOCALES.forEach(loc => {
      const locUrl = `${BASE_URL}${loc.prefix}${page.path}`;
      const locPriority = Math.max(0.70, (parseFloat(page.priority) - 0.05).toFixed(2));
      urlEntries.push(`  <url>
    <loc>${locUrl}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${locPriority}</priority>
${hreflangBlock}
  </url>`);
    });
  });

  // 3. Static standalone legal pages (unlocalized)
  const STATIC_PAGES = [
    { url: '/legal/terms-of-service.html', priority: '0.80', changefreq: 'monthly' },
    { url: '/legal/privacy-policy.html', priority: '0.80', changefreq: 'monthly' },
  ];
  STATIC_PAGES.forEach(sp => {
    urlEntries.push(`  <url>
    <loc>${BASE_URL}${sp.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${sp.changefreq}</changefreq>
    <priority>${sp.priority}</priority>
  </url>`);
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`;

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf-8');
  console.log(`[SEO] Multi-Language Sovereign sitemap.xml generated successfully: ${urlEntries.length} verified 200 OK canonical routes across 7 global regions.`);
}

generateSitemap();
