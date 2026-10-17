import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { ALL_SERVICES_FLAT, SERVICE_CATEGORIES } from '../data/serviceTaxonomy';

export interface BreadcrumbsProps {
  customTitle?: string;
  customCategory?: string;
  className?: string;
}

export default function Breadcrumbs({ customTitle, customCategory, className = '' }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const { l, isRtl } = usePlatformLocale();

  // Extract locale prefix if present (e.g. /ar/contracts -> /ar)
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/i);
  const localePrefix = localeMatch ? `/${localeMatch[1].toLowerCase()}` : '';
  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/i, '/').replace(/\/$/, '') || '/';

  // Do not render breadcrumbs on landing, dashboard, or protected admin routes
  if (cleanPath === '/' || cleanPath === '/dashboard' || cleanPath.startsWith('/admin')) {
    return null;
  }

  // Find matching service in taxonomy
  const currentService = ALL_SERVICES_FLAT.find((s) => s.route === cleanPath);
  const parentCategory = currentService
    ? SERVICE_CATEGORIES.find((c) => c.id === currentService.categoryId)
    : null;

  const pageTitle = customTitle || (currentService ? (isRtl ? currentService.titleAr : currentService.titleEn) : '');
  const categoryTitle = customCategory || (parentCategory ? (isRtl ? parentCategory.titleAr : parentCategory.titleEn) : '');

  // Static route fallbacks
  const fallbackTitles: Record<string, { ar: string; en: string }> = {
    '/about': { ar: 'عن المنصة', en: 'About Us' },
    '/privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    '/terms': { ar: 'شروط الخدمة', en: 'Terms of Service' },
    '/refund': { ar: 'سياسة الاسترداد', en: 'Refund Policy' },
    '/support': { ar: 'مركز الدعم', en: 'Support Desk' },
    '/payment': { ar: 'الاشتراكات والأسعار', en: 'Pricing & Subscriptions' },
    '/billing': { ar: 'إدارة الفواتير', en: 'Billing Management' },
  };

  const finalPageTitle = pageTitle || (fallbackTitles[cleanPath] ? (isRtl ? fallbackTitles[cleanPath].ar : fallbackTitles[cleanPath].en) : cleanPath.replace('/', ''));

  return (
    <nav
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label="Breadcrumb"
      className={`w-full py-2.5 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
        <Link
          to={localePrefix || '/'}
          className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-[#D4AF37] transition-colors font-medium"
        >
          <Home className="w-3.5 h-3.5 shrink-0" />
          <span>{l('الرئيسية', 'Home')}</span>
        </Link>

        {categoryTitle && (
          <>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[200px]">
              {categoryTitle}
            </span>
          </>
        )}

        {finalPageTitle && (
          <>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="text-amber-600 dark:text-[#D4AF37] font-bold truncate max-w-[240px]" aria-current="page">
              {finalPageTitle}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
