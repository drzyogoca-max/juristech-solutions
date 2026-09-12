import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getPageSEO } from '../lib/seo';

/**
 * SEO component – injects meta tags, Open Graph, Twitter Cards, hreflang, and canonical URL.
 * Automatically resolves title and description using route-based metadata from src/lib/seo.ts
 */
export default function SEO({ 
  titleKey, 
  descriptionKey,
  title: customTitle,
  description: customDesc,
  keywords: customKeywords,
  noIndex = false,
}: { 
  titleKey?: string; 
  descriptionKey?: string;
  title?: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language || 'en';

  const defaultSEO = getPageSEO(location.pathname, lang);

  const title = customTitle || (titleKey ? t(titleKey) : defaultSEO.title);
  const description = customDesc || (descriptionKey ? t(descriptionKey) : defaultSEO.description);
  const keywords = customKeywords || defaultSEO.keywords;

  const baseUrl = 'https://www.juristech.solutions';
  // Strip trailing slashes and tracking query params to ensure clean canonical domain matching
  const cleanPath = location.pathname.replace(/\/$/, '') || '/';
  const pageUrl = `${baseUrl}${cleanPath}`;

  // Enforce single canonical tag in DOM to prevent duplicate canonical warnings from search engines
  React.useEffect(() => {
    try {
      const canonicals = document.querySelectorAll("link[rel='canonical']");
      if (canonicals.length > 1) {
        canonicals.forEach((el, index) => {
          if (index > 0) el.remove();
        });
      }
      const primary = document.querySelector("link[rel='canonical']");
      if (primary && primary.getAttribute('href') !== pageUrl) {
        primary.setAttribute('href', pageUrl);
      }
    } catch (e) {}
  }, [pageUrl]);

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="google-site-verification" content="Csa-WN6QHwEIlH3lycEdcdsy5CznqwYzyJOq-PbjIpg" />
      <meta name="google-site-verification" content="Lnl_lvzcGvsmAArfcu_BajDGVmtf6XRUnMt1WWsSSyU" />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />

      {/* ─── Multi-regional hreflang: 7 base langs + 17 regional variants ─── */}
      {/* Arabic regions */}
      <link rel="alternate" hrefLang="ar" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-SA" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-EG" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-AE" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-KW" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-QA" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-BH" href={pageUrl} />
      <link rel="alternate" hrefLang="ar-JO" href={pageUrl} />
      {/* English regions */}
      <link rel="alternate" hrefLang="en" href={pageUrl} />
      <link rel="alternate" hrefLang="en-US" href={pageUrl} />
      <link rel="alternate" hrefLang="en-GB" href={pageUrl} />
      <link rel="alternate" hrefLang="en-CA" href={pageUrl} />
      <link rel="alternate" hrefLang="en-AU" href={pageUrl} />
      {/* French regions */}
      <link rel="alternate" hrefLang="fr" href={pageUrl} />
      <link rel="alternate" hrefLang="fr-FR" href={pageUrl} />
      <link rel="alternate" hrefLang="fr-BE" href={pageUrl} />
      <link rel="alternate" hrefLang="fr-CH" href={pageUrl} />
      {/* German regions */}
      <link rel="alternate" hrefLang="de" href={pageUrl} />
      <link rel="alternate" hrefLang="de-DE" href={pageUrl} />
      <link rel="alternate" hrefLang="de-AT" href={pageUrl} />
      <link rel="alternate" hrefLang="de-CH" href={pageUrl} />
      {/* Spanish regions */}
      <link rel="alternate" hrefLang="es" href={pageUrl} />
      <link rel="alternate" hrefLang="es-ES" href={pageUrl} />
      <link rel="alternate" hrefLang="es-MX" href={pageUrl} />
      <link rel="alternate" hrefLang="es-US" href={pageUrl} />
      <link rel="alternate" hrefLang="es-AR" href={pageUrl} />
      {/* Chinese regions */}
      <link rel="alternate" hrefLang="zh" href={pageUrl} />
      <link rel="alternate" hrefLang="zh-CN" href={pageUrl} />
      <link rel="alternate" hrefLang="zh-SG" href={pageUrl} />
      <link rel="alternate" hrefLang="zh-HK" href={pageUrl} />
      {/* Turkish */}
      <link rel="alternate" hrefLang="tr" href={pageUrl} />
      <link rel="alternate" hrefLang="tr-TR" href={pageUrl} />
      {/* x-default fallback for unmatched regions */}
      <link rel="alternate" hrefLang="x-default" href={pageUrl} />

      {/* JSON-LD Structured Data for Google Rich Search Snippets */}
      <script type="application/ld+json">
        {JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': baseUrl + '/#website',
            'url': baseUrl + '/',
            'name': 'JurisTech Solutions',
            'description': description,
            'inLanguage': lang,
            'publisher': { '@id': baseUrl + '/#organization' }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': baseUrl + '/#organization',
            'name': 'JurisTech Solutions',
            'url': baseUrl + '/',
            'logo': baseUrl + '/logo.png'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            '@id': baseUrl + '/#software',
            'name': 'JurisTech Solutions',
            'url': baseUrl + '/',
            'applicationCategory': 'BusinessApplication',
            'operatingSystem': 'Web',
            'description': description,
            'featureList': [
              'AI-assisted contract drafting',
              'Contract and clause risk analysis',
              'Jurisdiction-aware legal research',
              'Legal and contract template repository',
              'Company formation and compliance workflows',
              'Enterprise legal workflow support'
            ],
            'publisher': { '@id': baseUrl + '/#organization' }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': pageUrl + '#webpage',
            'url': pageUrl,
            'name': title,
            'description': description,
            'inLanguage': lang,
            'isPartOf': { '@id': baseUrl + '/#website' }
          }
        ])}
      </script>
    </Helmet>
  );
}
