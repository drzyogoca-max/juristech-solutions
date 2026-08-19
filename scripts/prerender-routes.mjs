import fs from 'fs';
import path from 'path';
import { PAGE_SEO } from '../src/lib/seo.js';

const DIST_DIR = path.join(process.cwd(), 'dist');
const BASE_URL = 'https://www.juristech.solutions';

const LANGS = [
  'ar', 'ar-SA', 'ar-EG', 'ar-AE', 'ar-KW', 'ar-QA', 'ar-BH', 'ar-JO',
  'en', 'en-US', 'en-GB', 'en-CA', 'en-AU',
  'fr', 'fr-FR', 'fr-BE', 'fr-CH',
  'de', 'de-DE', 'de-AT', 'de-CH',
  'es', 'es-ES', 'es-MX', 'es-US', 'es-AR',
  'zh', 'zh-CN', 'zh-SG', 'zh-HK',
  'tr', 'tr-TR', 'x-default'
];

export function prerenderRoutes() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[Prerender] Error: dist/index.html does not exist.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  Object.entries(PAGE_SEO).forEach(([routePath, seo]) => {
    if (routePath === '/') return; // root index.html is already created

    const cleanRoute = routePath.replace(/^\//, '');
    const routeDir = path.join(DIST_DIR, cleanRoute);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const canonicalUrl = `${BASE_URL}${routePath}`;
    const pageTitle = `${seo.titleAr} | ${seo.titleEn}`;
    const pageDesc = `${seo.descriptionAr} ${seo.descriptionEn}`;

    // Build hreflang tags
    const hreflangTags = LANGS.map(
      (lang) => `<link rel="alternate" hreflang="${lang}" href="${canonicalUrl}" />`
    ).join('\n    ');

    // Canonical & SEO tags replacement
    let routeHtml = baseHtml;

    // Replace Title
    routeHtml = routeHtml.replace(
      /<title>.*?<\/title>/gi,
      `<title>${pageTitle}</title>`
    );

    // Replace or Inject Description
    if (routeHtml.includes('<meta name="description"')) {
      routeHtml = routeHtml.replace(
        /<meta name="description".*?>/gi,
        `<meta name="description" content="${pageDesc}" />`
      );
    } else {
      routeHtml = routeHtml.replace(
        '</head>',
        `  <meta name="description" content="${pageDesc}" />\n</head>`
      );
    }

    // Inject/Replace Canonical and Hreflang Tags right in <head>
    const canonicalAndHreflangBlock = `
    <!-- Pre-rendered Canonical & Regional Hreflangs for Google Search Console -->
    <link rel="canonical" href="${canonicalUrl}" />
    ${hreflangTags}
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDesc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${pageDesc}" />
`;

    routeHtml = routeHtml.replace('</head>', `${canonicalAndHreflangBlock}\n</head>`);

    const targetFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetFilePath, routeHtml, 'utf-8');
    console.log(`[Prerender SEO] Created pre-rendered HTML for ${routePath} -> ${targetFilePath}`);
  });

  console.log('[Prerender SEO] All public routes pre-rendered with canonical URLs successfully.');
}

prerenderRoutes();
