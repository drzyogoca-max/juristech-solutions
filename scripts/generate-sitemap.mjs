import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.juristech.solutions';
const TODAY = new Date().toISOString().split('T')[0];

const PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/dashboard', priority: '0.95', changefreq: 'daily' },
  { url: '/chat', priority: '0.95', changefreq: 'daily' },
  { url: '/contracts', priority: '0.95', changefreq: 'daily' },
  { url: '/repository', priority: '1.0', changefreq: 'daily' },
  { url: '/templates', priority: '0.95', changefreq: 'daily' },
  { url: '/vault', priority: '0.95', changefreq: 'daily' },
  { url: '/risk', priority: '0.95', changefreq: 'daily' },
  { url: '/negotiation', priority: '0.90', changefreq: 'weekly' },
  { url: '/company-formation', priority: '0.95', changefreq: 'weekly' },
  { url: '/legal-compliance', priority: '0.95', changefreq: 'weekly' },
  { url: '/enterprise-audit', priority: '0.90', changefreq: 'weekly' },
  { url: '/deal-shield', priority: '0.98', changefreq: 'daily' },
  { url: '/acquisition', priority: '0.90', changefreq: 'weekly' },
  { url: '/sovereign-ai-hub', priority: '0.90', changefreq: 'daily' },
  { url: '/lead-radar', priority: '0.85', changefreq: 'daily' },
  { url: '/b2b-proposals', priority: '0.85', changefreq: 'weekly' },
  { url: '/payment', priority: '0.95', changefreq: 'daily' },
  { url: '/support', priority: '0.90', changefreq: 'weekly' },
  { url: '/about', priority: '0.85', changefreq: 'monthly' },
  { url: '/video-hub', priority: '0.80', changefreq: 'weekly' },
  { url: '/marketing', priority: '0.80', changefreq: 'weekly' },
  { url: '/reports', priority: '0.80', changefreq: 'weekly' },
  { url: '/privacy', priority: '0.80', changefreq: 'monthly' },
  { url: '/terms', priority: '0.80', changefreq: 'monthly' },

  // Static Legal HTML Pages
  { url: '/legal/terms-of-service.html', priority: '0.90', changefreq: 'monthly' },
  { url: '/legal/privacy-policy.html', priority: '0.90', changefreq: 'monthly' },
];

const LANGS = ['ar-SA', 'ar-AE', 'ar-EG', 'ar-KW', 'ar-QA', 'en-US', 'en-EU', 'de-DE', 'fr-FR', 'es-ES', 'zh-CN', 'tr-TR', 'x-default'];

export function generateSitemap() {
  const xmlEntries = PAGES.map((p) => {
    const hreflangs = LANGS.map(
      (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${p.url}"/>`
    ).join('\n');

    return `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
\n${hreflangs}
  </url>`;
  }).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries}
</urlset>
`;

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf-8');
  console.log(`[SEO] Standard sitemap.xml generated successfully with ${PAGES.length} clean canonical routes at ${new Date().toISOString()}.`);
}

generateSitemap();
