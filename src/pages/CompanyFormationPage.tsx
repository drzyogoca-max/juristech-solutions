import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, CheckCircle2, Globe, Shield, ShieldCheck, FileText,
  Scale, Zap, ArrowRight, AlertCircle, Mail, Loader2, Lock, BadgeCheck, Sparkles,
  Printer, Copy, Download, RefreshCw, Layers, Check, ExternalLink, HelpCircle, FileCheck
} from 'lucide-react';
import SEO from '../components/SEO';
import { generateAndDownloadWordDocument } from '../utils/export-utils';
import {
  JURISDICTIONS_DATA,
  US_STATES_DATA,
  ENTITY_TYPES_DATA,
  CHECKLIST_ITEMS_DATA,
  FormationJurisdiction,
  USState,
  FormationEntityType,
  FormationChecklistItem,
  VerificationStatus
} from '../data/companyFormationData';

export interface CompanyFormationForm {
  jurisdictionCode: string;
  stateCode: string;
  entityTypeCode: string;
  companyName: string;
  businessCategory: string;
  estimatedCapital: string;
  founderRole: string;
  ownershipCount: string;
}

export default function CompanyFormationPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const l = (ar: string, en: string) => (isRtl ? ar : en);

  // ─── Step State (0: Jurisdiction, 1: Entity Type, 2: Business Profile, 3: Generated Checklist)
  const [step, setStep] = useState<number>(0);

  const [form, setForm] = useState<CompanyFormationForm>({
    jurisdictionCode: 'SA',
    stateCode: 'US-DE',
    entityTypeCode: 'SA_LLC',
    companyName: '',
    businessCategory: 'Software & Technology Services',
    estimatedCapital: '100,000',
    founderRole: 'Founder / Managing Director',
    ownershipCount: '1-5',
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Selected Data Observers
  const currentJurisdiction: FormationJurisdiction =
    JURISDICTIONS_DATA.find(j => j.code === form.jurisdictionCode) || JURISDICTIONS_DATA[0];

  const currentUSState: USState | undefined =
    form.jurisdictionCode === 'US'
      ? US_STATES_DATA.find(s => s.code === form.stateCode) || US_STATES_DATA[0]
      : undefined;

  const availableEntityTypes: FormationEntityType[] = ENTITY_TYPES_DATA.filter(
    e => e.jurisdictionCode === form.jurisdictionCode
  );

  const currentEntityType: FormationEntityType =
    availableEntityTypes.find(e => e.code === form.entityTypeCode) || availableEntityTypes[0] || ENTITY_TYPES_DATA[0];

  // Checklist Generation Items
  const checklistItems: FormationChecklistItem[] = CHECKLIST_ITEMS_DATA.filter(
    item => item.jurisdictionCode === form.jurisdictionCode
  );

  const requiredDocs = checklistItems.filter(i => i.category === 'REQUIRED_DOC');
  const formationSteps = checklistItems.filter(i => i.category === 'FORMATION_STEP');
  const complianceReqs = checklistItems.filter(i => i.category === 'COMPLIANCE_REQUIREMENT');

  // Handle Jurisdiction Switch
  const handleJurisdictionSelect = (code: string) => {
    const defaultEntity = ENTITY_TYPES_DATA.find(e => e.jurisdictionCode === code)?.code || '';
    setForm(f => ({
      ...f,
      jurisdictionCode: code,
      entityTypeCode: defaultEntity,
    }));
  };

  // Step Validation Check
  const canProceed = () => {
    if (step === 0) {
      if (form.jurisdictionCode === 'US' && !form.stateCode) return false;
      return !!form.jurisdictionCode;
    }
    if (step === 1) return !!form.entityTypeCode;
    if (step === 2) return form.companyName.trim().length >= 2;
    return true;
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const summaryText = `
============================================================
JURISTECH B2B LEADTECH — FORMATION & COMPLIANCE RESEARCH
============================================================
Generated Date: ${new Date().toISOString().split('T')[0]}
Jurisdiction: ${isRtl ? currentJurisdiction.nameAr : currentJurisdiction.nameEn} ${currentUSState ? `(${isRtl ? currentUSState.nameAr : currentUSState.nameEn})` : ''}
Entity Type: ${isRtl ? currentEntityType.nameAr : currentEntityType.nameEn}
Target Company Name: ${form.companyName || 'N/A'}
Authority: ${isRtl ? currentJurisdiction.regulatoryAuthorityAr : currentJurisdiction.regulatoryAuthorityEn}
Statute Source: ${currentJurisdiction.sourceReference}

------------------------------------------------------------
REQUIRED DOCUMENTS & INFORMATION:
------------------------------------------------------------
${requiredDocs.map((d, i) => `${i + 1}. ${isRtl ? d.titleAr : d.titleEn} [${d.verificationStatus}]\n   ${isRtl ? d.descriptionAr : d.descriptionEn}`).join('\n\n')}

------------------------------------------------------------
STEP-BY-STEP FORMATION PROCESS:
------------------------------------------------------------
${formationSteps.map((s, i) => `${i + 1}. ${isRtl ? s.titleAr : s.titleEn}\n   ${isRtl ? s.descriptionAr : s.descriptionEn}`).join('\n\n')}

------------------------------------------------------------
STATUTORY COMPLIANCE CHECKLIST:
------------------------------------------------------------
${complianceReqs.map((c, i) => `${i + 1}. ${isRtl ? c.titleAr : c.titleEn}\n   ${isRtl ? c.descriptionAr : c.descriptionEn}`).join('\n\n')}

============================================================
LEGAL DISCLAIMER:
JurisTech is a B2B Legal Technology SaaS platform. This tool provides automated research and organizational checklists for informational purposes. Requirements may change and should be verified against current official sources. JurisTech does not provide legal advice, legal representation, or human consulting services.
============================================================
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Export to DOCX
  const handleExportDOCX = async () => {
    setIsExporting(true);
    try {
      const docTitle = `${l('تقرير الفحص والتأسيس', 'Formation & Compliance Checklist')} - ${form.companyName || 'Company'}`;
      const docContent = `
${l('تقرير الفحص والامتثال الإجرائي لتأسيس المنشآت', 'Company Formation & Compliance Research Report')}
${l('تاريخ التوليد:', 'Generated Date:')} ${new Date().toISOString().split('T')[0]}

${l('بيانات الكيان والولاية القضائية:', 'Entity & Jurisdiction Profile:')}
- ${l('الدولة / الاختصاص:', 'Jurisdiction:')} ${isRtl ? currentJurisdiction.nameAr : currentJurisdiction.nameEn} ${currentUSState ? `(${isRtl ? currentUSState.nameAr : currentUSState.nameEn})` : ''}
- ${l('نوع الكيان التجاري:', 'Entity Structure:')} ${isRtl ? currentEntityType.nameAr : currentEntityType.nameEn}
- ${l('اسم المنشأة المستهدفة:', 'Company Name:')} ${form.companyName}
- ${l('الجهة التنظيمية المسؤولة:', 'Regulatory Body:')} ${isRtl ? currentJurisdiction.regulatoryAuthorityAr : currentJurisdiction.regulatoryAuthorityEn}
- ${l('مرجع النظام واللوائح:', 'Statute Reference:')} ${currentJurisdiction.sourceReference}

============================================================
1. ${l('الوثائق والمعلومات المطلوبة (Required Documents)', '1. Required Documents & Information')}
============================================================
${requiredDocs.map((d, i) => `${i + 1}. ${isRtl ? d.titleAr : d.titleEn}\n${l('الوصف:', 'Description:')} ${isRtl ? d.descriptionAr : d.descriptionEn}\n${l('المصدر:', 'Source:')} ${d.source} [${d.verificationStatus}]`).join('\n\n')}

============================================================
2. ${l('خطوات وإجراءات التأسيس (Formation Steps)', '2. Step-by-Step Formation Process')}
============================================================
${formationSteps.map((s, i) => `${i + 1}. ${isRtl ? s.titleAr : s.titleEn}\n${l('الوصف:', 'Description:')} ${isRtl ? s.descriptionAr : s.descriptionEn}\n${l('المصدر:', 'Source:')} ${s.source}`).join('\n\n')}

============================================================
3. ${l('قائمة الالتزام والمتطلبات النظامية (Compliance Checklist)', '3. Statutory Compliance Checklist')}
============================================================
${complianceReqs.map((c, i) => `${i + 1}. ${isRtl ? c.titleAr : c.titleEn}\n${l('الوصف:', 'Description:')} ${isRtl ? c.descriptionAr : c.descriptionEn}\n${l('المصدر:', 'Source:')} ${c.source}`).join('\n\n')}

============================================================
${l('تنويه وإخلاء مسؤولية قانوني:', 'Legal Disclaimer:')}
${l(
  'منصة JurisTech Solutions هي منصة برمجية للذكاء الاصطناعي والتكنولوجيا القانونية B2B SaaS. توفر هذه الأداة أبحاثاً آلية وقوائم تدقيق تنظيمية لأغراض استرشادية وتنظيمية فقط. قد تتغير المتطلبات ويجب التحقق منها مقابل المصادر الرسمية الحالية. منصة JurisTech لا تقدم استشارات قانونية بشرية، ولا تمثيلاً قانونياً، ولا خدمات تعقيب أو تأسيس مرخصة.',
  'JurisTech is a B2B Legal Technology SaaS platform. This tool provides automated research and organizational checklists for informational purposes. Requirements may change and should be verified against current official sources. JurisTech does not provide legal advice, legal representation, or human consulting services.'
)}
      `.trim();

      await generateAndDownloadWordDocument(docTitle, docContent, isRtl ? 'ar' : 'en');
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const statusBadgeClass = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED_SOURCE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'USER_PROVIDED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'INTERNAL_REFERENCE':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO
        title={l(
          'أداة بحث وقوائم تدقيق تأسيس الشركات والامتثال B2B | JurisTech Solutions',
          'B2B Company Formation & Compliance Research Tool | JurisTech Solutions'
        )}
        description={l(
          'برنامج بحث آلي وقوائم تدقيق تنظيمية لتأسيس المنشآت والشركات في السعودية والإمارات ومصر والولايات المتحدة بوضوح وشفافية تامتين.',
          'SaaS automated research & checklist engine for corporate formation & compliance across KSA, UAE, Egypt, and US states.'
        )}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* ── Top Page Header ─────────────────────────────────────────────── */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              {l('أداة بحث برمجية B2B', 'B2B Software Research Tool')}
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {l('قوائم تدقيق محددة المصدر', 'Verified Checklist Engine')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {l('أداة بحث وقوائم تدقيق تأسيس المنشآت (Company Formation & Compliance Research)', 'Company Formation & Compliance Research Tool')}
          </h1>

          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            {l(
              'أداة برمجية ذكية لتصفح المتطلبات الإجرائية، الوثائق الإلزامية، وقوائم تدقيق الامتثال المنظمة لتأسيس المنشآت والشركات التجارية في السعودية، الإمارات، مصر، والولايات المتحدة.',
              'Software research tool to generate structured statutory checklists, document requirements, and procedural steps for business formation across key jurisdictions.'
            )}
          </p>
        </div>

        {/* ── Explicit B2B SaaS Disclaimer Banner ──────────────────────── */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{l('تنويه وإخلاء مسؤولية النطاق البرمجي للخدمة:', 'Platform Legal & Scope Disclaimer:')}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {l(
              'منصة JurisTech Solutions هي منصة تكنولوجيا قانونية B2B LegalTech SaaS. تقدم هذه الأداة أبحاثاً آلية وقوائم تنظيمية لأغراض استرشادية وتخطيطية فقط، ولا تُعد شركة محاماة أو خدمة تعقيب أو تمثيلاً قانونياً أو بديلاً عن المستشار القانوني المرخص.',
              'JurisTech is a B2B Legal Technology SaaS platform. This tool provides automated research and organizational checklists for informational purposes. Requirements may change and should be verified against current official sources. JurisTech does not provide legal advice, legal representation, or human consulting services.'
            )}
          </p>
        </div>

        {/* ── Wizard Progress Bar ─────────────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, titleAr: 'الاختصاص القضائي', titleEn: 'Jurisdiction' },
              { num: 2, titleAr: 'نوع الكيان', titleEn: 'Entity Type' },
              { num: 3, titleAr: 'ملف المنشأة', titleEn: 'Business Profile' },
              { num: 4, titleAr: 'قائمة البحث والامتثال', titleEn: 'Research Checklist' },
            ].map((s, idx) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition ${
                    idx < step
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : idx === step
                      ? 'bg-sky-500 border-sky-400 text-slate-950 shadow-lg shadow-sky-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {idx < step ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <div
                  className={`text-[11px] font-bold truncate ${
                    idx === step ? 'text-sky-400 font-extrabold' : idx < step ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {l(s.titleAr, s.titleEn)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WIZARD STEP CONTENTS ────────────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">

          {/* ── STEP 1: Jurisdiction & State Selection ─────────────────────── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <span>{l('١. اختر دولة أو اختصاص التأسيس', '1. Select Target Jurisdiction')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {l('تختلف اللوائح والجهات المنظمة باختلاف الدولة والولاية القضائية.', 'Rules and regulatory bodies vary by jurisdiction.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {JURISDICTIONS_DATA.map(j => {
                  const isSelected = form.jurisdictionCode === j.code;
                  return (
                    <button
                      key={j.code}
                      onClick={() => handleJurisdictionSelect(j.code)}
                      className={`p-5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <span className="text-2xl">{j.flag}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {j.code}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white">{l(j.nameAr, j.nameEn)}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{l(j.regulatoryAuthorityAr, j.regulatoryAuthorityEn)}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{l('تاريخ مراجعة المرجع:', 'Last Verified:')} {j.lastReviewedDate}</span>
                        <span className="text-sky-400 font-bold">{l('مرجع نظامي', 'Statutory Source')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* US State Selector (Required ONLY if United States is selected) */}
              {form.jurisdictionCode === 'US' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>{l('تنبيه هام للولايات المتحدة: يجب تحديد الولاية بشكل منفصل', 'State Selection Required for US Entities:')}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {l(
                      'لا توجد لوائح تأسيس موحدة لجميع الولايات الأمريكية. لكل ولاية قوانينها وضريبة الامتياز (Franchise Tax) والجهة المنظمة الخاصة بها.',
                      'US business formation is regulated strictly at the state level. Delaware, Wyoming, California, etc., maintain distinct statutes.'
                    )}
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      {l('اختر ولاية التأسيس الأمريكية *', 'Select US State *')}
                    </label>
                    <select
                      value={form.stateCode}
                      onChange={e => setForm({ ...form, stateCode: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      {US_STATES_DATA.map(st => (
                        <option key={st.code} value={st.code}>
                          {l(st.nameAr, st.nameEn)} — {st.filingAgencyEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentUSState && (
                    <div className="p-3 rounded-xl bg-slate-900 text-[11px] text-amber-300/90 space-y-1 font-mono border border-slate-800">
                      <div>📌 {l('الجهة المنظمة:', 'Filing Agency:')} {currentUSState.filingAgencyEn}</div>
                      <div>⚠️ {l('ملاحظة ضريبة الامتياز:', 'Franchise Tax Notice:')} {l(currentUSState.franchiseTaxNoticeAr, currentUSState.franchiseTaxNoticeEn)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Entity Type Selection ───────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <span>{l('٢. اختر نوع الكيان القانوني المدعوم', '2. Select Supported Entity Structure')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {l('يتم عرض الأشكال القانونية المدعومة ببيانات وقوائم تدقيق موثقة فقط.', 'Showing supported entity structures with verified datasets.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableEntityTypes.map(e => {
                  const isSelected = form.entityTypeCode === e.code;
                  return (
                    <button
                      key={e.code}
                      onClick={() => setForm(f => ({ ...f, entityTypeCode: e.code }))}
                      className={`p-5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-2 inline-block">
                          {e.code}
                        </span>
                        <h3 className="font-extrabold text-base text-white">{l(e.nameAr, e.nameEn)}</h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{l(e.descAr, e.descEn)}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{l('حماية الذمة:', 'Liability Shield:')}</span>
                          <span className="font-semibold text-emerald-400">{l(e.liabilityProtectionAr, e.liabilityProtectionEn)}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">{l('الحد الأدنى للشركاء:', 'Min Shareholders:')}</span>
                          <span className="font-mono">{e.minShareholders}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: Business Profile & Inputs ────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  <span>{l('٣. أدخل بيانات ملف المنشأة المستهدفة', '3. Enter Target Business Profile')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {l('تخصيص البيانات لتوليد قائمة المراجعة والوثائق الإلزامية بدقة.', 'Tailor research inputs to generate exact checklist outputs.')}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {l('اسم الشركة أو الكيان التجاري المقترح *', 'Proposed Company Name *')}
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={e => setForm({ ...form, companyName: e.target.value })}
                    placeholder="e.g. Apex Legal Technology LLC"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('فئة النشاط التجاري / الصناعي', 'Business / Activity Category')}
                    </label>
                    <input
                      type="text"
                      value={form.businessCategory}
                      onChange={e => setForm({ ...form, businessCategory: e.target.value })}
                      placeholder="e.g. SaaS & AI Legaltech Services"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('رأس المال التقديري (بالعملة المحلية)', 'Estimated Share Capital')}
                    </label>
                    <input
                      type="text"
                      value={form.estimatedCapital}
                      onChange={e => setForm({ ...form, estimatedCapital: e.target.value })}
                      placeholder="100,000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('الصفة الإدارية للمؤسس', 'Founder / Manager Role')}
                    </label>
                    <input
                      type="text"
                      value={form.founderRole}
                      onChange={e => setForm({ ...form, founderRole: e.target.value })}
                      placeholder="e.g. Managing Director / CEO"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('عدد الشركاء أو المالكين التقديري', 'Estimated Shareholder Count')}
                    </label>
                    <select
                      value={form.ownershipCount}
                      onChange={e => setForm({ ...form, ownershipCount: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="1">1 Sole Owner (شركة شخص واحد)</option>
                      <option value="1-5">1-5 Partners (شركاء مؤسسون)</option>
                      <option value="5-20">5-20 Venture Partners</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: GENERATED RESEARCH CHECKLIST REPORT ──────────────────── */}
          {step === 3 && (
            <div className="space-y-8">
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                    {l('تقرير فحص وتأسيس محدد المصدر', 'Verified Research Report Output')}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    {form.companyName || l('تقرير التأسيس والامتثال', 'Formation & Compliance Report')}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {l('تاريخ الاستخراج والتوليد:', 'Generated Timestamp:')} {new Date().toISOString().split('T')[0]} | {currentJurisdiction.code} {currentUSState ? `- ${currentUSState.code}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    <Printer className="w-4 h-4 text-sky-400" />
                    <span>{l('طباعة / PDF', 'Print / Save PDF')}</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                    <span>{copied ? l('تم النسخ!', 'Copied!') : l('نسخ التلخيص', 'Copy Summary')}</span>
                  </button>

                  <button
                    onClick={handleExportDOCX}
                    disabled={isExporting}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Download className="w-4 h-4 text-slate-950" />}
                    <span>{l('تصدير Word (.docx)', 'Export Word Package')}</span>
                  </button>
                </div>
              </div>

              {/* Formation Summary Card */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-base text-sky-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{l('ملخص الكيان والجهة المنظمة', 'Formation Profile Summary')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">{l('الاختصاص القضائي:', 'Jurisdiction:')}</span>
                    <span className="font-bold text-white block">{isRtl ? currentJurisdiction.nameAr : currentJurisdiction.nameEn}</span>
                    {currentUSState && <span className="text-[10px] text-amber-400 block font-mono">({currentUSState.nameEn})</span>}
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">{l('نوع الكيان التجاري:', 'Entity Structure:')}</span>
                    <span className="font-bold text-white block">{isRtl ? currentEntityType.nameAr : currentEntityType.nameEn}</span>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">{l('الجهة التنظيمية المسؤولة:', 'Regulatory Body:')}</span>
                    <span className="font-bold text-emerald-400 block">{isRtl ? currentJurisdiction.regulatoryAuthorityAr : currentJurisdiction.regulatoryAuthorityEn}</span>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">{l('المرجع واللائحة التنفيذية:', 'Statute Reference:')}</span>
                    <span className="font-semibold text-slate-300 block text-[11px] leading-snug">{currentJurisdiction.sourceReference}</span>
                  </div>
                </div>
              </div>

              {/* Section A: Required Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileCheck className="w-5 h-5 text-sky-400" />
                  <span>{l('أ. الوثائق والمعلومات الواجب تقديمها (Required Documents)', 'A. Required Documents & Information')}</span>
                </h3>

                <div className="space-y-3">
                  {requiredDocs.map((doc, i) => (
                    <div key={doc.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono flex items-center justify-center border border-sky-500/20">
                            {i + 1}
                          </span>
                          <span>{l(doc.titleAr, doc.titleEn)}</span>
                        </h4>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeClass(doc.verificationStatus)}`}>
                          [{doc.verificationStatus}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pr-8">{l(doc.descriptionAr, doc.descriptionEn)}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900 pr-8">
                        <span>{l('المصدر الرسمى:', 'Official Source:')} <strong className="text-slate-400">{doc.source}</strong></span>
                        <span>{l('آخر مراجعة للمصدر:', 'Verified Date:')} <strong className="font-mono text-slate-400">{doc.lastVerified}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Formation Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>{l('ب. الخطوات الإجرائية والتسلسل الزمني (Formation Process)', 'B. Step-by-Step Formation Process')}</span>
                </h3>

                <div className="space-y-3">
                  {formationSteps.map((st, i) => (
                    <div key={st.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono flex items-center justify-center border border-amber-500/20">
                            {i + 1}
                          </span>
                          <span>{l(st.titleAr, st.titleEn)}</span>
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                          {st.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pr-8">{l(st.descriptionAr, st.descriptionEn)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C: Compliance Checklist */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>{l('ج. قائمة تدقيق الامتثال والربط الضريبي الإجباري (Statutory Compliance)', 'C. Statutory Compliance Checklist')}</span>
                </h3>

                <div className="space-y-3">
                  {complianceReqs.map((cm, i) => (
                    <div key={cm.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono flex items-center justify-center border border-emerald-500/20">
                            {i + 1}
                          </span>
                          <span>{l(cm.titleAr, cm.titleEn)}</span>
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                          {l('إلتزام دوري سنوي', 'Statutory Compliance')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pr-8">{l(cm.descriptionAr, cm.descriptionEn)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification & Official Sources Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                <div className="text-sky-400 font-bold">{l('🔗 مراجع ومصادر البيانات الرسمية المعتمدة:', 'Official Data Sources & Verification References:')}</div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <div>• {currentJurisdiction.sourceReference}</div>
                  {currentJurisdiction.sourceUrl && (
                    <div>• {l('رابط البوابة الرسمية:', 'Official Portal:')} <a href={currentJurisdiction.sourceUrl} target="_blank" rel="noreferrer" className="text-sky-400 underline">{currentJurisdiction.sourceUrl}</a></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Wizard Navigation Controls ─────────────────────────────────── */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
              >
                {l('السابق', 'Previous')}
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition disabled:opacity-40"
              >
                <span>{step === 2 ? l('توليد تقرير الفحص والامتثال', 'Generate Research Report') : l('التالي', 'Next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep(0)}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                <span>{l('فحص جديد', 'New Research Search')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
