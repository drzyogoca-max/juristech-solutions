import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Globe2, 
  KeyRound, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  Award,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { enterpriseAdoptionEngine } from '../enterprise/enterpriseAdoptionEngine';
import { regulatoryPassportSystem } from '../enterprise/regulatoryPassportSystem';
import { partnerGovernanceFabric } from '../enterprise/partnerGovernanceFabric';
import { globalExpansionAttestation } from '../enterprise/globalExpansionAttestation';

type ActiveTab = 'rfp_accelerator' | 'regulatory_passports' | 'partner_governance' | 'sovereignty_blueprints' | 'executive_attestation';

export default function EnterpriseAdoptionCommandCenterPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeTab, setActiveTab] = useState<ActiveTab>('rfp_accelerator');

  const adoptionOverview = enterpriseAdoptionEngine.getAdoptionOverview();
  const rfpTemplates = enterpriseAdoptionEngine.listRfpTemplates();
  const benchmarks = enterpriseAdoptionEngine.listBenchmarks();

  const passportOverview = regulatoryPassportSystem.getPassportOverview();
  const certificates = regulatoryPassportSystem.listCertificates();

  const fabricOverview = partnerGovernanceFabric.getFabricOverview();
  const vendors = partnerGovernanceFabric.listVendors();

  const expansionOverview = globalExpansionAttestation.getExpansionOverview();
  const blueprints = globalExpansionAttestation.listBlueprints();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                {isAr ? 'مركز التبني المؤسسي والجواز التنظيمي الدولي 12.0' : 'Enterprise Adoption & Regulatory Passport Hub 12.0'}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {isAr 
                  ? 'تسريع اعتماد العطاءات، الجواز التنظيمي للشهادات، وحوكمة الموردين عابرة للحدود' 
                  : 'RFP Acceleration, Unified Regulatory Passports & Multi-Jurisdiction Vendor Fabric'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Security Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            {isAr ? 'حماية Rule Zero: مغلقة 🔒' : 'Rule Zero: 100% Locked 🔒'}
          </span>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isAr ? 'اعتماد المستشار العام + CISO' : 'GC + CISO Dual Signature'}
          </span>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-full">
            v19.0.0 Live
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>{isAr ? 'استبيانات RFP المؤتمتة' : 'Automated RFP Templates'}</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {adoptionOverview.totalRfpTemplatesAvailable}
          </div>
          <div className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {adoptionOverview.averageAnswerAutomationPct}% {isAr ? 'نسبة الإجابة الآلية' : 'Answer Automation'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>{isAr ? 'الشهادات الدولية المعتمدة' : 'Active Regulatory Passports'}</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {passportOverview.totalActiveCertificates}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            ISO 27001 • SOC 2 • ISO 42001 • SDAIA
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>{isAr ? 'حوكمة الشركاء والموردين' : 'Partner Governance Fabric'}</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {fabricOverview.averageVendorAuditScorePct}%
          </div>
          <div className="text-xs text-blue-400 mt-1">
            {fabricOverview.compliantVendorsCount} / {fabricOverview.totalMonitoredVendors} {isAr ? 'موردون موثقون' : 'Verified Subprocessors'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>{isAr ? 'جاهزية التوسع الإقليمي' : 'Global Expansion Score'}</span>
            <Globe2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {expansionOverview.averageMarketReadinessPct}%
          </div>
          <div className="text-xs text-amber-400 mt-1">
            {expansionOverview.totalExpansionMarkets} {isAr ? 'أسواق سيادية معتمدة' : 'Sovereign Markets Ready'}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('rfp_accelerator')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'rfp_accelerator'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          {isAr ? 'مسرّع استبيانات RFP' : 'RFP Accelerator'}
        </button>

        <button
          onClick={() => setActiveTab('regulatory_passports')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'regulatory_passports'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          {isAr ? 'الجواز التنظيمي الموحد' : 'Regulatory Passports'}
        </button>

        <button
          onClick={() => setActiveTab('partner_governance')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'partner_governance'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          {isAr ? 'حوكمة الشركاء والموردين' : 'Partner Governance'}
        </button>

        <button
          onClick={() => setActiveTab('sovereignty_blueprints')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'sovereignty_blueprints'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          {isAr ? 'مخططات السيادة الإقليمية' : 'Sovereignty Blueprints'}
        </button>

        <button
          onClick={() => setActiveTab('executive_attestation')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'executive_attestation'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          {isAr ? 'الاعتمادات التشفيرية المزدوجة' : 'Executive Attestation'}
        </button>
      </div>

      {/* Tab 1: RFP Accelerator */}
      {activeTab === 'rfp_accelerator' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              {isAr ? 'مكتبة استبيانات الأمن والعطاءات المؤسسية' : 'Enterprise Security & RFP Questionnaire Library'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {isAr 
                ? 'إجابات مؤتمتة وموثقة تشفيرياً من واقع معمارية المنظومة دون الحاجة لإعادة التقييم اليدوي.' 
                : 'Automated, cryptographically anchored answers mapped directly from system security vaults.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rfpTemplates.map((template) => (
                <div key={template.templateId} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        {template.targetSector}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {template.automatedAnswerCoveragePct}% {isAr ? 'جاهز' : 'Covered'}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mt-2.5">
                      {isAr ? template.frameworkNameAr : template.frameworkNameEn}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {isAr ? 'عدد الأسئلة:' : 'Questions:'} {template.totalQuestionsCount} | {template.verificationEvidenceSource}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono truncate max-w-[200px]">{template.sha512ProfileHash}</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                      {isAr ? 'تصدير الحزمة' : 'Export Package'}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Regulatory Passports */}
      {activeTab === 'regulatory_passports' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              {isAr ? 'جواز السفر التنظيمي والشهادات الدولية المعتمدة' : 'Unified Regulatory Passport & Certifications'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {isAr 
                ? 'شهادات المطابقة والأمان المؤسسي المعترف بها دولياً والموثقة ببصمات SHA-512.' 
                : 'Internationally recognized compliance attestations verified with SHA-512 cryptographic digests.'}
            </p>

            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.certificateId} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cert.auditAttestationStatus}
                      </span>
                      <span className="text-xs text-slate-400">Valid through {cert.validThroughYear}</span>
                    </div>
                    <h4 className="text-base font-semibold text-white">
                      {isAr ? cert.standardNameAr : cert.standardNameEn}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'جهة الاعتماد:' : 'Certifying Body:'} {cert.certifyingBody}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Scope: {cert.issuanceScope}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-1.5">
                    <span className="text-xs text-emerald-400 font-semibold font-mono">
                      {cert.complianceConfidencePct}% {isAr ? 'ثقة الامتثال' : 'Confidence'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono truncate max-w-[220px]">
                      {cert.sha512AttestationHash}
                    </span>
                    <a
                      href={cert.publicVerificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium mt-1"
                    >
                      {isAr ? 'رابط التحقق العام' : 'Public Attestation'}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Partner Governance */}
      {activeTab === 'partner_governance' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              {isAr ? 'نسيج حوكمة الموردين وسلسلة التوريد التقنية' : 'Subprocessor & Partner Governance Fabric'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {isAr 
                ? 'مراقبة التزام معالجي البيانات الخارجيين باتفاقيات DPA وبنود SCCs دون أي تنفيذ حظر تلقائي.' 
                : 'Auditing third-party subprocessors against DPA and Standard Contractual Clauses (Audit Only).'}
            </p>

            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div key={vendor.vendorId} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {vendor.riskClassification}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{vendor.jurisdictionResidency}</span>
                    </div>
                    <h4 className="text-base font-semibold text-white">
                      {isAr ? vendor.vendorNameAr : vendor.vendorNameEn}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Category: {vendor.vendorCategory} | DPA Signed: {vendor.dpaSigned ? '✅' : '❌'} | SCC Enacted: {vendor.sccEnacted ? '✅' : '❌'}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-1">
                    <span className="text-sm font-bold text-white">{vendor.lastAuditScorePct}% {isAr ? 'درجة التدقيق' : 'Audit Score'}</span>
                    <span className="text-xs text-slate-500 font-mono truncate max-w-[220px]">{vendor.sha512AuditProofHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sovereignty Blueprints */}
      {activeTab === 'sovereignty_blueprints' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-amber-400" />
              {isAr ? 'مخططات السيادة الإقليمية والتوسع الدولي' : 'Regional Sovereignty & Global Market Blueprints'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {isAr 
                ? 'استراتيجيات استضافة البيانات والسيادة الرقمية عبر الأسواق الرئيسية.' 
                : 'In-country data sovereignty guarantees and compliance blueprints for target enterprise markets.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blueprints.map((blueprint) => (
                <div key={blueprint.marketId} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {blueprint.jurisdictionCode} • {blueprint.sovereigntyModel}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold font-mono">
                        {blueprint.marketReadinessScorePct}% {isAr ? 'جاهزية' : 'Ready'}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mt-2">
                      {isAr ? blueprint.regionNameAr : blueprint.regionNameEn}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {blueprint.dataResidencyLawEnforced}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isAr ? 'اعتماد مزدوج موثق' : 'Dual Signed'}
                    </span>
                    <span className="font-mono truncate max-w-[180px]">{blueprint.sha512BlueprintHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Executive Attestation */}
      {activeTab === 'executive_attestation' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-400" />
              {isAr ? 'سجل الاعتمادات التشفيرية المزدوجة (GC + CISO)' : 'Dual-Key Cryptographic Attestation Vault'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {isAr 
                ? 'التواقيع التشفيرية الإلزامية للمستشار العام ورئيس أمن المعلومات لإقرار الجاهزية والشهادات الدولية.' 
                : 'Mandatory cryptographic sign-offs from the General Counsel and CISO before regulatory dossier export.'}
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400 font-semibold uppercase">{isAr ? 'المفتاح الأول' : 'Key #1'}</div>
                  <div className="text-base font-bold text-white mt-1">{isAr ? 'المستشار العام (General Counsel)' : 'General Counsel (GC)'}</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    STATUS: DIGITALLY_SIGNED_SHA512
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400 font-semibold uppercase">{isAr ? 'المفتاح الثاني' : 'Key #2'}</div>
                  <div className="text-base font-bold text-white mt-1">{isAr ? 'رئيس قطاع أمن المعلومات (CISO)' : 'Chief Information Security Officer (CISO)'}</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    STATUS: DIGITALLY_SIGNED_SHA512
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-300">
                {isAr 
                  ? '🔒 تنبيه الحوكمة: التواقيع الرقمية مسجلة تشفيرياً، ويُمنع أي تعديل أو تجاوز تلقائي بدون موافقة صريحة من الهيئة التنفيذية.'
                  : '🔒 Governance Invariant: Digital signatures are cryptographically anchored. Autonomous policy override is prohibited.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
