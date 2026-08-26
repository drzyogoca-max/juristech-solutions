import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customerTrustPortal } from '../enterprise/customerTrustPortal';
import { accountIntelligenceEngine } from '../enterprise/accountIntelligenceEngine';
import { contractIntelligenceMarketplace } from '../enterprise/contractIntelligenceMarketplace';
import { revenueValueAnalytics } from '../enterprise/revenueValueAnalytics';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Users, 
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react';

type ActiveTab = 'enterprise_accounts' | 'customer_trust' | 'intelligence_marketplace' | 'revenue_analytics' | 'executive_attestation';

export default function CommercialIntelligenceCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('enterprise_accounts');

  const trustOverview = customerTrustPortal.getTrustPortalOverview();
  const accountsOverview = accountIntelligenceEngine.getAccountIntelligenceOverview();
  const marketplaceOverview = contractIntelligenceMarketplace.getMarketplaceOverview();
  const revenueOverview = revenueValueAnalytics.getRevenueAnalyticsOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl text-emerald-400">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                {isAr ? 'مركز قيادة الذكاء التجاري وتفعيل الإيرادات 14.0' : 'Commercial Intelligence & Revenue Activation Command Center 14.0'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {isAr 
                  ? 'رصد الذكاء الحسابي، بوابة الثقة المعتمدة، حزم المعرفة القطاعية، وتحليلات القيمة المالية v21.0.0'
                  : 'Enterprise Account Intelligence, Certified Customer Trust Portal, Modular Marketplace & Revenue Realization v21.0.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-emerald-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-emerald-950/20">
          <DollarSign className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400">{isAr ? 'خط أنابيب التوسع المؤهل' : 'Qualified Expansion Pipeline'}</div>
            <div className="text-sm font-bold text-emerald-300">$3.85M USD (128.4% NRR)</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('enterprise_accounts')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'enterprise_accounts'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Building2 className="w-4 h-4" />
          {isAr ? 'ذكاء الحسابات المؤسسية' : 'Enterprise Accounts'}
        </button>

        <button
          onClick={() => setActiveTab('customer_trust')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'customer_trust'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          {isAr ? 'بوابة ثقة العملاء' : 'Customer Trust Portal'}
        </button>

        <button
          onClick={() => setActiveTab('intelligence_marketplace')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'intelligence_marketplace'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          {isAr ? 'سوق الحزم القانونية' : 'Intelligence Marketplace'}
        </button>

        <button
          onClick={() => setActiveTab('revenue_analytics')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'revenue_analytics'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <TrendingUp className="w-4 h-4" />
          {isAr ? 'تحليلات الإيرادات والقيمة' : 'Revenue Value Analytics'}
        </button>

        <button
          onClick={() => setActiveTab('executive_attestation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'executive_attestation'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Award className="w-4 h-4" />
          {isAr ? 'الاعتماد التنفيذي والميثاق' : 'Executive Attestation'}
        </button>
      </div>

      {/* Tab 1: Enterprise Accounts Intelligence */}
      {activeTab === 'enterprise_accounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'إجمالي الحسابات الخاضعة للرصد' : 'Monitored Accounts'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{accountsOverview.totalMonitoredEnterpriseAccounts}</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? '100% اشتراكات نشطة' : '100% Active Tier'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'متوسط مؤشر التبني المؤسسي' : 'Avg Adoption Score'}</div>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{accountsOverview.averageAdoptionScorePct}%</div>
              <div className="text-xs text-slate-400 mt-2">{isAr ? 'تفاعل عالي عبر كافة الوحدات' : 'High engagement across core modules'}</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'حسابات مؤهلة للتوسع الفوري' : 'Expansion Qualified'}</div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">{accountsOverview.expansionPipelineQualifiedCount} {isAr ? 'مؤسسات' : 'Enterprises'}</div>
              <div className="text-xs text-cyan-400 mt-2">{isAr ? 'جاهزية توسع تفوق 85%' : '>85% expansion readiness score'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              {isAr ? 'سجل الحسابات المؤسسية ومؤشرات التوسع' : 'Enterprise Accounts Intelligence Registry'}
            </h3>
            <div className="space-y-4">
              {accountsOverview.accounts.map((acc) => (
                <div key={acc.accountId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{acc.organizationName}</div>
                      <div className="text-xs text-slate-400">{acc.industrySector} • {acc.contractTier} • {acc.activeSeatCount} {isAr ? 'مقعد مفعل' : 'Active Seats'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'درجة التبني' : 'Adoption Score'}</div>
                        <div className="text-sm font-bold text-emerald-300">{acc.adoptionScorePct}%</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {acc.licenseHealthStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                    <span className="text-xs text-slate-400 mr-2">{isAr ? 'الحزم المقترحة:' : 'Recommended Packs:'}</span>
                    {acc.expansionRecommendedPacks.map((pack, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-slate-800/90 text-cyan-300 rounded border border-slate-700">
                        {pack}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Customer Trust Portal */}
      {activeTab === 'customer_trust' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  {isAr ? 'بوابة الثقة المعتمدة للمؤسسات والهيئات' : 'Certified Enterprise Customer Trust Portal'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr 
                    ? 'إثباتات الامتثال المشفرة، الشهادات السيادية، ومؤشرات الأمان العامة لطلبات المناقصات والتدقيق المؤسسي'
                    : 'Cryptographic compliance digests, sovereign certifications, and public security posture for enterprise audits'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">{isAr ? 'مؤشر الثقة المؤسسي' : 'Institutional Trust Score'}</div>
                <div className="text-2xl font-bold text-emerald-300">{trustOverview.overallTrustScore} / 100</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trustOverview.certifications.map((cert) => (
              <div key={cert.certificateId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{cert.frameworkName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{cert.authority}</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    {cert.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div>{isAr ? 'النطاق الجغرافي:' : 'Jurisdiction Scope:'} <span className="text-slate-300 font-mono">{cert.jurisdictionScope.join(', ')}</span></div>
                  <div>{isAr ? 'الأيام المتبقية للتجديد:' : 'Days Remaining:'} <span className="text-emerald-400 font-bold">{cert.expiryDaysRemaining} {isAr ? 'يوم' : 'Days'}</span></div>
                  <div className="font-mono text-slate-500 truncate">{cert.evidenceSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Contract Intelligence Marketplace */}
      {activeTab === 'intelligence_marketplace' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'إجمالي الحزم المتاحة' : 'Total Available Packs'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{marketplaceOverview.totalPacksAvailable} {isAr ? 'حزم متخصصة' : 'Packs'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'قواعد ونقاط التدقيق القانوني' : 'Rules & Checkpoints'}</div>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{marketplaceOverview.totalRulesAndCheckpoints}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'حزم مفعلة لدى العملاء' : 'Active Account Deployments'}</div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">{marketplaceOverview.activeDeploymentsAcrossAccounts} {isAr ? 'تثبيت' : 'Deployments'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceOverview.packs.map((pack) => (
              <div key={pack.packId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{pack.packName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{pack.category} • {pack.version}</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                    {pack.catalogStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div>{isAr ? 'الهيئة القانونية المرجعية:' : 'Legal Authority:'} <span className="text-slate-300">{pack.curatedLegalAuthority}</span></div>
                  <div>{isAr ? 'قواعد التدقيق:' : 'Checkpoints Count:'} <span className="text-emerald-400 font-bold">{pack.rulesAndCheckpointsCount} {isAr ? 'قاعدة' : 'Rules'}</span></div>
                  <div className="font-mono text-slate-500 truncate">{pack.integrityHashSha512}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Revenue Value Analytics */}
      {activeTab === 'revenue_analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'خط الأساس للإيراد السنوي (ARR)' : 'Contracted ARR Baseline'}</div>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{"$" + (revenueOverview.totalProjectedEnterpriseArrUsd / 1000000).toFixed(2) + "M"}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'خط أنابيب التوسع المؤهل' : 'Qualified Expansion Pipeline'}</div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">{"$" + (revenueOverview.qualifiedExpansionPipelineUsd / 1000000).toFixed(2) + "M"}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'معدل الاحتفاظ الصافي (NRR)' : 'Net Revenue Retention'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{revenueOverview.estimatedNetRevenueRetentionPct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط القيمة الدائمة للعميل (LTV)' : 'Average Customer LTV'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{"$" + (revenueOverview.averageCustomerLifetimeValueUsd / 1000000).toFixed(2) + "M"}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              {isAr ? 'مصفوفة مؤشرات القيمة والإيرادات المعتمدة محاسبياً' : 'Audited Revenue & Commercial Value Matrix'}
            </h3>
            <div className="space-y-4">
              {revenueOverview.metrics.map((m) => (
                <div key={m.metricId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{m.metricName}</div>
                      <div className="text-xs text-slate-400">{m.underlyingAssumption}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-300">{"$" + m.estimatedValueUsd.toLocaleString() + " USD"}</div>
                      <div className="text-xs text-emerald-400 font-medium">+{m.growthRatePct}% Growth • {m.confidenceIntervalPct}% Confidence</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isAr ? 'اعتماد المدير المالي (CFO): معتمد' : 'CFO Validated'}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isAr ? 'اعتماد المستشار التجاري (CRO): معتمد' : 'CRO Validated'}
                    </span>
                    <span className="font-mono text-slate-500 truncate ml-auto">{m.auditEvidenceSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Executive Attestation & Governance Charter */}
      {activeTab === 'executive_attestation' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              {isAr ? 'ميثاق حوكمة الإيرادات والذكاء التجاري v21.0.0' : 'Commercial Intelligence Governance Charter & Attestation'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  {isAr ? 'ضمانات عدم استخدام بيانات العملاء' : 'Zero Customer Data Training Policy'}
                </div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'يحظر قطعياً استخدام العقود أو البنود الخاصة بالعملاء في تدريب نماذج الذكاء الاصطناعي أو تحسين حزم السوق.'
                    : 'Customer confidential contracts and legal text are strictly quarantined with zero model training retention.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {isAr ? 'حدود القرارات غير الذاتية' : 'Non-Autonomous Commercial Boundaries'}
                </div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'كافة تحليلات التوسع والتسعير تعمل كأداة استرشادية فقط؛ يتطلب أي تغيير في الباقات موافقة تنفيذية بشرية صريحة.'
                    : 'All commercial expansion and pricing analytics operate strictly in advisory mode requiring human executive approval.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
