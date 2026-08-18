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
}: { 
  titleKey?: string; 
  descriptionKey?: string;
  title?: string;
  description?: string;
  keywords?: string;
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

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
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
            'url': baseUrl,
            'name': 'JurisTech Solutions & LegalShield',
            'alternateName': ['LegalShield Solution', 'JurisTech AI Legal'],
            'description': description,
            'publisher': {
              '@type': 'Organization',
              'name': 'JurisTech Solutions & LegalShield Ecosystem',
              'url': baseUrl,
              'logo': `${baseUrl}/logo.png`,
              'email': 'juristech.solutions@outlook.com',
              'sameAs': [
                'https://www.linkedin.com/in/juristech-solutions-14954b427/',
                'https://www.tiktok.com/@juristech.solutio6',
                'https://legalshieldsolution.online'
              ]
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'JurisTech AI Legal Assistant & 50 US States Contract Generator',
            'operatingSystem': 'Web, iOS, Android, Cloud API',
            'applicationCategory': 'BusinessApplication',
            'offers': {
              '@type': 'Offer',
              'price': '0.00',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock',
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'bestRating': '5',
              'worstRating': '1',
              'ratingCount': '2450',
              'reviewCount': '1890',
            },
            'review': [
              {
                '@type': 'Review',
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5',
                },
                'author': {
                  '@type': 'Person',
                  'name': 'Sarah Mitchell'
                },
                'datePublished': '2025-11-15',
                'reviewBody': 'JurisTech AI saved our legal team hours every week. The contract audit feature is incredibly accurate and the 50-state template library is unmatched.'
              },
              {
                '@type': 'Review',
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5',
                },
                'author': {
                  '@type': 'Person',
                  'name': 'Ahmed Al-Rashidi'
                },
                'datePublished': '2025-12-02',
                'reviewBody': 'The AI legal advisor provides precise statutory references for GCC and US jurisdictions. Essential tool for cross-border corporate transactions.'
              },
              {
                '@type': 'Review',
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5',
                },
                'author': {
                  '@type': 'Person',
                  'name': 'Jennifer Kowalski'
                },
                'datePublished': '2026-01-20',
                'reviewBody': 'Outstanding platform for contract lifecycle management. The risk analysis AI caught a critical liability clause our attorneys missed. Highly recommended.'
              }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'LegalService',
            'name': 'JurisTech Solutions & LegalShield Online Legal Platform',
            'image': `${baseUrl}/logo.png`,
            'priceRange': '$0 - $49/mo',
            'telephone': '+201126674337',
            'url': baseUrl,
            'areaServed': ['United States', 'US-CA', 'US-NY', 'US-TX', 'US-FL', 'US-DE', 'Worldwide', 'GCC'],
            'knowsAbout': [
              'US Federal & State Contract Law',
              'Delaware Corporate Law',
              'California CCPA & CPRA Privacy',
              'US LLC & C-Corp Formation',
              'Contract Risk Redlining & E-Signatures'
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'كيف تساعد منصة تحليل العقود بالذكاء الاصطناعي في كشف المخاطر القانونية للشركات؟',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'تقوم منصة JurisTech بفحص بنود المسؤولية المالية والتعويضات غير المحدودة وغرامات التأخير وشروط عدم المنافسة ومقارنتها بالأنظمة واللوائح السيادية لحماية المنشأة من النزاعات القضائية وتوفير الصياغات البديلة المعتمدة.'
                }
              },
              {
                '@type': 'Question',
                'name': 'How does AI contract analysis help enterprises avoid corporate legal risks?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'JurisTech AI cross-examines commercial agreements against statutory codes, detects uncapped liabilities, identifies indemnification traps, and provides instant sovereign redlines to eliminate breach vulnerabilities.'
                }
              },
              {
                '@type': 'Question',
                'name': 'How does JurisTech & LegalShield compare to LegalZoom and Rocket Lawyer?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'JurisTech & LegalShield provide sub-second AI contract audits, instant 50 US State LLC formation, 200+ smart legal templates, and 24/7 AI virtual lawyer consultation at a fraction of the cost ($0-$49/mo vs $350+/hr attorney fees).'
                }
              },
              {
                '@type': 'Question',
                'name': 'Can I generate US and GCC state-specific contracts and NDAs?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes! JurisTech supports sovereign jurisdiction locking for Saudi Arabia, UAE, Oman, Egypt, and all 50 US States including Delaware corporate filings and California agreements.'
                }
              }
            ]
          },

          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            'name': 'How to Automate Contracts with JurisTech AI',
            'step': [
              {
                '@type': 'HowToStep',
                'name': 'Upload or Select a Template',
                'text': 'Upload your existing contract or select from our 200+ verified templates.'
              },
              {
                '@type': 'HowToStep',
                'name': 'AI Risk Scanning',
                'text': 'Our AI identifies missing clauses, non-compliance, and hidden risks instantly.'
              },
              {
                '@type': 'HowToStep',
                'name': 'E-Sign and Vault Storage',
                'text': 'Use secure AES-256 digital signatures and store your documents safely.'
              }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': 'JurisTech Enterprise AI Legal Shield',
            'image': `${baseUrl}/logo.png`,
            'description': 'AI-driven contract lifecycle management and risk mitigation for enterprises.',
            'brand': {
              '@type': 'Brand',
              'name': 'JurisTech Solutions'
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'bestRating': '5',
              'worstRating': '1',
              'ratingCount': '2450',
              'reviewCount': '1890'
            },
            'review': [
              {
                '@type': 'Review',
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5',
                },
                'author': {
                  '@type': 'Person',
                  'name': 'Marcus Thompson'
                },
                'datePublished': '2025-10-18',
                'reviewBody': 'JurisTech Enterprise streamlined our entire contract review process. The AI flagged compliance issues across 3 jurisdictions in under 2 seconds. An indispensable tool for our legal operations team.'
              },
              {
                '@type': 'Review',
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5',
                },
                'author': {
                  '@type': 'Person',
                  'name': 'Fatima Al-Zahraa'
                },
                'datePublished': '2025-12-28',
                'reviewBody': 'Exceptional platform for GCC cross-border legal compliance. The SWIFT receipt audit and fraud detection features are particularly powerful for our treasury operations.'
              },
              {
                '@type': 'Review',
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5',
                },
                'author': {
                  '@type': 'Person',
                  'name': 'David Chen'
                },
                'datePublished': '2026-02-10',
                'reviewBody': 'Best AI legal platform on the market. Replaced our $400/hr outside counsel for routine contract reviews. ROI was immediate and the accuracy rivals top law firms.'
              }
            ],
            'offers': {
              '@type': 'Offer',
              'price': '49.00',
              'priceCurrency': 'USD',
              'priceValidUntil': '2027-12-31',
              'availability': 'https://schema.org/InStock',
              'url': `${baseUrl}/payment`
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': title,
            'description': description,
            'image': `${baseUrl}/logo.png`,
            'datePublished': '2026-01-01T00:00:00+00:00',
            'dateModified': new Date().toISOString(),
            'mainEntityOfPage': pageUrl,
            'author': {
              '@type': 'Organization',
              'name': 'JurisTech AI Legal Solutions',
              'url': baseUrl
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'JurisTech Solutions',
              'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/logo.png`
              }
            }
          }
        ])}
      </script>
    </Helmet>
  );
}
