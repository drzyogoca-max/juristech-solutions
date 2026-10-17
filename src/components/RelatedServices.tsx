import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { ALL_SERVICES_FLAT, ServiceItem } from '../data/serviceTaxonomy';

export interface RelatedServicesProps {
  currentServiceId?: string;
  customHeading?: string;
  className?: string;
}

// Recommended next-step pairings for legal workflows
const SERVICE_PAIRINGS: Record<string, string[]> = {
  'contracts-analysis': ['risk-audit', 'negotiation', 'vault'],
  'risk-audit': ['contracts-analysis', 'deal-shield', 'negotiation'],
  'deal-shield': ['risk-audit', 'acquisition', 'corporate-structuring'],
  'templates': ['poa-library', 'vault', 'contracts-analysis'],
  'poa-library': ['templates', 'corporate-structuring', 'vault'],
  'negotiation': ['contracts-analysis', 'vault', 'b2b-proposals'],
  'corporate-structuring': ['templates', 'poa-library', 'b2b-proposals'],
  'acquisition': ['deal-shield', 'contracts-analysis', 'enterprise-audit'],
  'vault': ['contracts-analysis', 'templates', 'repository'],
  'repository': ['vault', 'contracts-analysis', 'risk-audit'],
  'enterprise-audit': ['legal-compliance', 'risk-audit', 'deal-shield'],
  'legal-compliance': ['enterprise-audit', 'trust', 'risk-audit'],
  'b2b-proposals': ['contracts-analysis', 'negotiation', 'payment'],
  'chat': ['contracts-analysis', 'risk-audit', 'templates'],
  'investigate': ['risk-audit', 'contracts-analysis', 'legal-compliance'],
};

export default function RelatedServices({ currentServiceId, customHeading, className = '' }: RelatedServicesProps) {
  const { pathname } = useLocation();
  const { l, isRtl } = usePlatformLocale();

  // Extract locale prefix if present (e.g. /ar/contracts -> /ar)
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/i);
  const localePrefix = localeMatch ? `/${localeMatch[1].toLowerCase()}` : '';
  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/i, '/').replace(/\/$/, '') || '/';

  // Find current service
  const current = ALL_SERVICES_FLAT.find((s) => s.id === currentServiceId || s.route === cleanPath);
  const currentId = current?.id || 'contracts-analysis';

  const pairedIds = SERVICE_PAIRINGS[currentId] || ['contracts-analysis', 'risk-audit', 'templates'];
  const pairedServices = pairedIds
    .map((id) => ALL_SERVICES_FLAT.find((s) => s.id === id))
    .filter((s): s is ServiceItem => Boolean(s))
    .slice(0, 3);

  if (pairedServices.length === 0) return null;

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 ${className}`}
      aria-label="Related Legal Services"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{l('الخطوة التالية في مسار عملك', 'Next Steps in Your Workflow')}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {customHeading || l('خدمات قانونية متكاملة ذات صلة', 'Related Workflows & Complementary Services')}
          </h3>
        </div>

        <Link
          to={`${localePrefix}/templates`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-[#D4AF37] transition-colors"
        >
          <span>{l('استعراض كافة الخدمات (23 خدمة)', 'View All 23 Platform Services')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pairedServices.map((service) => {
          const Icon = service.icon || Layers;
          return (
            <Link
              key={service.id}
              to={`${localePrefix}${service.route}`}
              className="group p-5 rounded-2xl bg-white dark:bg-[#0D1F3C]/60 hover:dark:bg-[#142847] border border-slate-200 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-[#D4AF37]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border ${service.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    {isRtl ? service.badgeAr : service.badgeEn}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 dark:group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {isRtl ? service.titleAr : service.titleEn}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {isRtl ? service.descAr : service.descEn}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-[#D4AF37] group-hover:underline pt-2">
                <span>{l('بدء الاستخدام الآن', 'Launch Service')}</span>
                <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
