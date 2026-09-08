import React from 'react';
import { Sparkles, Shield, Lock, ArrowRight, Scale, AlertTriangle, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import type { SupportedAILang, UserTier } from '../../ai/types';

export interface QuotaInfo {
  remaining: number | null;
  limit: number;
  used: number | null;
  loading: boolean;
}

interface AIAdvisorHeaderProps {
  lang: SupportedAILang;
  isRtl: boolean;
  userTier: UserTier;
  onUpgradeClick: () => void;
  quota?: QuotaInfo;
}

export const AIAdvisorHeader: React.FC<AIAdvisorHeaderProps> = ({
  lang,
  isRtl,
  userTier,
  onUpgradeClick,
  quota,
}) => {
  const isAr = lang === 'ar';

  const tierLabels: Record<UserTier, { label: string; color: string }> = {
    free: { label: isAr ? 'الباقة التجريبية' : 'Free Trial', color: 'bg-slate-800 text-slate-400 border-slate-700' },
    startup: { label: isAr ? 'باقة الشركات الناشئة' : 'Startup Tier', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
    sme: { label: isAr ? 'باقة الشركات المتوسطة' : 'SME Tier', color: 'bg-indigo-950 text-indigo-400 border-indigo-800' },
    pro: { label: isAr ? 'الباقة الاحترافية Pro' : 'Pro Tier', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
    enterprise: { label: isAr ? 'باقة المؤسسات الكبرى' : 'Enterprise Tier', color: 'bg-amber-950 text-amber-400 border-amber-800' },
    lawyer: { label: isAr ? 'حساب المستشار المعتمد' : 'Verified Counsel', color: 'bg-purple-950 text-purple-400 border-purple-800' },
    admin: { label: isAr ? 'المسؤول السيادي' : 'Master Sovereign', color: 'bg-rose-950 text-rose-400 border-rose-800' },
  };

  const currentTierInfo = tierLabels[userTier] || tierLabels.free;
  const isTrial = userTier === 'free';
  const isLoadingQuota = !quota || quota.loading;
  const remaining = quota && !quota.loading && typeof quota.remaining === 'number' ? quota.remaining : null;
  const limit = quota && !quota.loading && typeof quota.limit === 'number' ? quota.limit : null;
  const isQuotaLoaded = !isLoadingQuota && remaining !== null && limit !== null;

  // Determine progress color
  const getProgressColor = () => {
    if (remaining === null) return 'bg-slate-700';
    if (remaining >= 3) return 'bg-emerald-500';
    if (remaining === 2) return 'bg-amber-500';
    if (remaining === 1) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
            <Scale className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {isAr ? 'المستشار القانوني الذكي الموحد' : 'Unified AI Legal Advisor'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                P0 LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'منظومة استشارية تشريعية مدعومة بـ 15 ولاية قضائية وتوثيق نظامي معتمد'
                : 'Enterprise statutory legal intelligence across 15 jurisdictions with verified citations'}
            </p>
          </div>
        </div>

        {/* Status, Quota Meter & Contextual Upgrade CTA */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          {/* Tier Badge */}
          <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${currentTierInfo.color}`}>
            <Shield className="w-3.5 h-3.5" />
            {currentTierInfo.label}
          </span>

          {/* AUTHORITATIVE TRIAL QUOTA METER (Free Trial Users Only) */}
          {isTrial && (
            <div
              data-testid="trial-quota-meter"
              className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs shadow-inner"
              title={isAr ? 'الحصة اليومية المعتمدة من النظام' : 'Authoritative daily usage from ledger'}
            >
              {/* Segmented Dots Indicator */}
              <div className="flex items-center gap-1" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((step) => {
                  const isAvailable = isQuotaLoaded && remaining !== null && step <= remaining;
                  return (
                    <span
                      key={step}
                      className={`w-1.5 h-3.5 rounded-full transition-all duration-300 ${
                        isAvailable
                          ? getProgressColor()
                          : isQuotaLoaded
                          ? 'bg-slate-800 border border-slate-700/50 opacity-40'
                          : 'bg-slate-800/80 animate-pulse'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Text Counter */}
              <span className="font-mono text-[11px] font-bold text-slate-300">
                {!isQuotaLoaded ? (
                  <span className="text-slate-400 font-sans text-[10px] flex items-center gap-1.5" data-testid="quota-loading-indicator">
                    <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                    <span>{isAr ? 'جاري التحقق من الحصة...' : 'Checking quota...'}</span>
                  </span>
                ) : (
                  <>
                    <span className={remaining <= 1 ? 'text-amber-400 font-black' : 'text-cyan-400 font-black'}>
                      {remaining}
                    </span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-slate-400">{limit}</span>
                    <span className="text-slate-400 font-sans mr-1 text-[10px]">
                      {isAr ? ' استشارات متبقية اليوم' : ' queries remaining today'}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}

          {/* CONTEXTUAL UPGRADE CTA (Free Trial Users Only) */}
          {isTrial && (
            <>
              {(!isQuotaLoaded || (typeof remaining === 'number' && remaining > 2)) && (
                <button
                  onClick={onUpgradeClick}
                  data-testid="upgrade-cta-standard"
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'ترقية الباقة' : 'Upgrade Plan'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}

              {isQuotaLoaded && remaining === 2 && (
                <button
                  onClick={onUpgradeClick}
                  data-testid="upgrade-cta-warning-2"
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'ترقية الباقة ($49)' : 'Upgrade Plan ($49)'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}

              {isQuotaLoaded && remaining === 1 && (
                <button
                  onClick={onUpgradeClick}
                  data-testid="upgrade-cta-warning-1"
                  className="px-3.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 animate-pulse cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isAr ? 'استشارة واحدة متبقية — ترقية الآن' : '1 Query Left — Upgrade Now'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}

              {isQuotaLoaded && remaining === 0 && (
                <button
                  onClick={onUpgradeClick}
                  data-testid="upgrade-cta-exhausted"
                  className="px-3.5 py-1 rounded-lg text-xs font-black bg-rose-500 hover:bg-rose-400 text-white transition-all flex items-center gap-1.5 shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>{isAr ? 'نفدت الحصة — ترقية للمتابعة' : 'Quota Reached — Upgrade'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
