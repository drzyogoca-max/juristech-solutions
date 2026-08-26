import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { partnerFederationCollaborationEngine } from '../enterprise/partnerFederationCollaborationEngine';
import { enterpriseTrustMarketplaceEngine } from '../enterprise/enterpriseTrustMarketplaceEngine';
import { regulatoryHorizonRadarEngine } from '../enterprise/regulatoryHorizonRadarEngine';
import { aiGovernanceCertificationCenter } from '../enterprise/aiGovernanceCertificationCenter';
import { 
  Globe2, 
  Network, 
  ShieldCheck, 
  Radar, 
  Cpu, 
  CheckCircle2, 
  BadgeCheck, 
  Award, 
  Layers, 
  Lock, 
  TrendingUp, 
  Building2, 
  FileCheck,
  Scale,
  Sparkles
} from 'lucide-react';

type ActiveTab = 'partner_federation' | 'trust_marketplace' | 'regulatory_horizon' | 'ai_governance_certification' | 'ecosystem_attestation_registry';

export default function GlobalEcosystemCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('partner_federation');

  const federationOverview = partnerFederationCollaborationEngine.getPartnerFederationOverview();
  const marketplaceOverview = enterpriseTrustMarketplaceEngine.getEnterpriseTrustMarketplaceOverview();
  const radarOverview = regulatoryHorizonRadarEngine.getRegulatoryHorizonRadarOverview();
  const certOverview = aiGovernanceCertificationCenter.getAIGovernanceCertificationOverview();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-blue-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Globe2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-blue-300 bg-clip-text text-transparent">
                  {isAr ? 'مركز قيادة المنظومة القانونية العالمية 18.0' : 'Global Legal Ecosystem Command Center 18.0'}
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isAr ? 'اليوبيل الفضي v25.0.0' : 'Silver Jubilee v25.0.0'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {isAr 
                  ? 'اتحاد مكاتب المحاماة العالمية، سوق الثقة المؤسسي، رادار الأفق التشريعي، ومركز شهادات حوكمة الذكاء الاصطناعي'
                  : 'Law Firm Federation, Trust Marketplace, Regulatory Horizon Radar & AI Governance Certification'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Ecosystem Health Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-emerald-500/30 rounded-xl px-4 py-2.5 shadow-lg shadow-emerald-950/20">
          <Award className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs text-slate-400">{isAr ? 'مؤشر الثقة البيئي الكلي' : 'Ecosystem Trust Index'}</div>
            <div className="text-sm font-bold text-emerald-300">{federationOverview.averageTrustIndexPct} / 100 ({isAr ? 'سيادي معتمد' : 'Sovereign Certified'})</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('partner_federation')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'partner_federation'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Network className="w-4 h-4" />
          {isAr ? 'اتحاد الشركاء ومكاتب المحاماة' : 'Partner Federation'}
        </button>

        <button
          onClick={() => setActiveTab('trust_marketplace')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'trust_marketplace'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <BadgeCheck className="w-4 h-4" />
          {isAr ? 'سوق الثقة والاعتمادات' : 'Trust Marketplace'}
        </button>

        <button
          onClick={() => setActiveTab('regulatory_horizon')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'regulatory_horizon'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Radar className="w-4 h-4" />
          {isAr ? 'رادار الأفق التشريعي' : 'Regulatory Radar'}
        </button>

        <button
          onClick={() => setActiveTab('ai_governance_certification')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'ai_governance_certification'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <Cpu className="w-4 h-4" />
          {isAr ? 'شهادات حوكمة الذكاء الاصطناعي' : 'AI Certification'}
        </button>

        <button
          onClick={() => setActiveTab('ecosystem_attestation_registry')}
          className={'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
            activeTab === 'ecosystem_attestation_registry'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          )}
        >
          <FileCheck className="w-4 h-4" />
          {isAr ? 'سجل الأختام والميثاق العالمي' : 'Charter & Registry'}
        </button>
      </div>

      {/* Tab 1: Partner Federation */}
      {activeTab === 'partner_federation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'الشركاء ومكاتب المحاماة المعتمدة' : 'Certified Partners'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{federationOverview.totalCertifiedPartnersCount} {isAr ? 'كيانات معتمدة' : 'Entities'}</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? 'عزل كامل لبيانات العملاء (Zero Client Data Exposure)' : 'Zero Client Data Exposure Enforced'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'متوسط مؤشر الثقة' : 'Avg Trust Index'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{federationOverview.averageTrustIndexPct}%</div>
              <div className="text-xs text-slate-400 mt-2">{isAr ? 'اعتماد مؤسسي سنوي موثق' : 'Annual Audit Verified'}</div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-medium">{isAr ? 'الاعتماد البشري المزدوج' : 'Dual Human Approval'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'إلزامي 100%' : '100% Enforced'}</div>
              <div className="text-xs text-indigo-400 mt-2">{isAr ? 'لا تعاقد آلي مع الشركاء' : 'No Autonomous Engagement'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              {isAr ? 'سجل شبكة الشركاء المعتمدين ونطاقات التعاون المحددة' : 'Certified Partner Network & Scope Limitations'}
            </h3>
            <div className="space-y-4">
              {federationOverview.partners.map((p) => (
                <div key={p.partnerId} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{p.partnerName}</div>
                      <div className="text-xs text-slate-400">{p.partnerType} • {isAr ? 'الولاية:' : 'Jurisdiction:'} <span className="text-slate-300 font-mono">{p.primaryJurisdiction}</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{isAr ? 'مؤشر الثقة' : 'Trust Index'}</div>
                        <div className="text-sm font-bold text-emerald-400">{p.trustIndexPct}%</div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {p.accreditationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 font-medium">{isAr ? 'نطاق التعاون المصرح:' : 'Authorized Scope:'}</span> {p.collaborationScopeLimit}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'انتهاء الصلاحية:' : 'Permission Expiry:'} {new Date(p.permissionExpiryTimestamp).toLocaleDateString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{p.partnerSealHashSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trust Marketplace */}
      {activeTab === 'trust_marketplace' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الخدمات المعتمدة في السوق' : 'Accredited Services'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{marketplaceOverview.totalAccreditedServicesCount} {isAr ? 'خدمات معيارية' : 'Services'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط تقييم الكفاءة' : 'Avg Competence Rating'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{marketplaceOverview.averageCompetenceRating}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الشفافية وانعدام الإقصاء الآلي' : 'Non-Discriminatory Ranking'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'مضمونة 100%' : '100% Guaranteed'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceOverview.services.map((s) => (
              <div key={s.serviceId} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{s.serviceTitle}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.domainCategory}</div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                    {s.accreditedBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {isAr ? s.ratingExplanationAr : s.ratingExplanationEn}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>{isAr ? 'النزاعات النشطة:' : 'Active Disputes:'} <span className="text-emerald-400 font-bold">{s.activeDisputeCount}</span></span>
                  <span className="font-mono text-slate-500 truncate max-w-xs">{s.credentialProofSha512}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Regulatory Horizon Radar */}
      {activeTab === 'regulatory_horizon' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'التنبيهات التشريعية النشطة' : 'Active Horizon Alerts'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{radarOverview.activeHorizonAlertsCount} {isAr ? 'تنبيهات استشرافية' : 'Alerts'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'السجلات والجرائد الرسمية الممسوحة' : 'Scanned Registries'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{radarOverview.scannedOfficialRegistriesCount} {isAr ? 'سجلات دولية' : 'Registries'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'طبيعة التنبيهات' : 'Alert Nature'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'استرشادية فقط' : 'Advisory Only'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Radar className="w-5 h-5 text-emerald-400" />
              {isAr ? 'رادار التغيرات التشريعية العالمية والإنذار المبكر' : 'Global Legislative Early Warning Radar'}
            </h3>
            <div className="space-y-4">
              {radarOverview.alerts.map((alt) => (
                <div key={alt.alertId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{alt.statutoryTopic}</div>
                      <div className="text-xs text-slate-400">{alt.sourceGazette} • ({alt.jurisdictionCode}) • {alt.verifiedSourceCount} {isAr ? 'مصادر رسمية موثقة' : 'Verified Sources'}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                      {alt.impactLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 pt-1">
                    {isAr ? alt.summaryAr : alt.summaryEn}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'تاريخ السريان:' : 'Effective Date:'} {alt.effectiveDate}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{alt.sourceAuthenticitySealSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Governance Certification */}
      {activeTab === 'ai_governance_certification' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'الأنظمة الذكية المعتمدة' : 'Certified AI Systems'}</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{certOverview.totalCertifiedSystemsCount} {isAr ? 'أنظمة مؤسسية' : 'Systems'}</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'متوسط الشفافية والحد من التحيز' : 'Transparency & Fairness'}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{certOverview.averageTransparencyScorePct}%</div>
            </div>
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">{isAr ? 'إصدار الشهادات' : 'Issuance Protocol'}</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">{isAr ? 'اعتماد بشري تنفيذي' : 'Human Signed Only'}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              {isAr ? 'سجل شهادات حوكمة الذكاء الاصطناعي التشفيرية (ISO 42001 / EU AI Act / SDAIA)' : 'Cryptographic AI Governance Certifications Ledger'}
            </h3>
            <div className="space-y-4">
              {certOverview.certificates.map((cert) => (
                <div key={cert.certificateId} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-200">{cert.systemName}</div>
                      <div className="text-xs text-slate-400">{cert.governanceStandard} • {isAr ? 'المعتمد:' : 'Officer:'} {cert.certifyingOfficer}</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      {cert.certificationStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{isAr ? 'صالح حتى:' : 'Valid Until:'} {new Date(cert.validUntilTimestamp).toLocaleDateString()}</span>
                    <span className="font-mono text-slate-500 truncate max-w-sm">{cert.cryptographicSealSha512}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Ecosystem Attestation Registry & Charter */}
      {activeTab === 'ecosystem_attestation_registry' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              {isAr ? 'الميثاق العالمي للمنظومة القانونية وسجل الأختام التشفيرية v25.0.0' : 'Global Legal Ecosystem Charter & Sealed Attestations'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-emerald-300">{isAr ? 'المبدأ الحاكم: انعدام استغلال بيانات العملاء' : 'Principle: Zero Client Data Exposure'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'الربط مع الشركاء ومكاتب المحاماة العالمية يتم عبر عقود ذكية مشفرة ونطاقات معتمدة دون كشف نصوص العقود أو مستندات العملاء السرية.'
                    : 'Partner federation strictly utilizes zero client data exposure with cryptographic scoping.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                <div className="font-bold text-emerald-300">{isAr ? 'المبدأ الحاكم: عدم الإصدار التلقائي لشهادات الذكاء الاصطناعي' : 'Principle: No Automated Certification Issuance'}</div>
                <p className="text-slate-400">
                  {isAr 
                    ? 'جميع شهادات حوكمة الذكاء الاصطناعي الصادرة تتطلب مراجعة واعتماداً بشرياً تنفيذياً من المستشار العام ومسؤولي الأمن والمخاطر.'
                    : 'All AI governance certificates mandate verifiable human executive approval and dual countersignatures.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
