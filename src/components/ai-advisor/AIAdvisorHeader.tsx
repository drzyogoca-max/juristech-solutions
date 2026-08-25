import React from 'react';
import { Sparkles, Shield, Lock, ArrowRight } from 'lucide-react';
import type { SupportedAILang, UserTier } from '../../ai/types';

interface AIAdvisorHeaderProps {
  lang: SupportedAILang;
  isRtl: boolean;
  userTier: UserTier;
  onUpgradeClick: () => void;
}

export const AIAdvisorHeader: React.FC<AIAdvisorHeaderProps> = ({
  lang,
  isRtl,
  userTier,
  onUpgradeClick,
}) => {
  const isAr = lang === 'ar';

  const tierLabels: Record<UserTier, { label: string; color: string }> = {
    free: { label: isAr ? 'الباقة المجانية' : 'Free Tier', color: 'bg-slate-800 text-slate-400 border-slate-700' },
    startup: { label: isAr ? 'باقة الشركات الناشئة' : 'Startup Tier', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
    sme: { label: isAr ? 'باقة الشركات المتوسطة' : 'SME Tier', color: 'bg-indigo-950 text-indigo-400 border-indigo-800' },
    pro: { label: isAr ? 'الباقة الاحترافية Pro' : 'Pro Tier', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
    enterprise: { label: isAr ? 'باقة المؤسسات الكبرى' : 'Enterprise Tier', color: 'bg-amber-950 text-amber-400 border-amber-800' },
    lawyer: { label: isAr ? 'حساب المستشار المعتمد' : 'Verified Counsel', color: 'bg-purple-950 text-purple-400 border-purple-800' },
    admin: { label: isAr ? 'المسؤول السيادي' : 'Master Sovereign', color: 'bg-rose-950 text-rose-400 border-rose-800' },
  };

  const currentTierInfo = tierLabels[userTier] || tierLabels.free;

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

        {/* Tier Status & Upgrade CTA */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${currentTierInfo.color}`}>
            <Shield className="w-3.5 h-3.5" />
            {currentTierInfo.label}
          </span>

          {userTier === 'free' && (
            <button
              onClick={onUpgradeClick}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? 'ترقية الباقة' : 'Upgrade Plan'}
              <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
import { Scale } from 'lucide-react';
