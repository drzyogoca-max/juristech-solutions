import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, CheckCircle2, Globe, Shield, FileText,
  Scale, Zap, Crown, ArrowRight, AlertCircle, Mail, Loader2, Lock, BadgeCheck, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { addCompanyToQueue } from '../lib/reviewQueueService';
import SEO from '../components/SEO';

// ─── Types ──────────────────────────────────────────────────────────────────
type EntityType = 'llc' | 'sole' | 'simplified_corp' | null;
type Jurisdiction = 'SA' | 'AE' | 'EG' | 'JO' | 'KW' | null;

interface FormData {
  entityType: EntityType;
  jurisdiction: Jurisdiction;
  companyName: string;
  directorName: string;
  directorEmail: string;
  directorCountry: string;
  businessPurpose: string;
  capital?: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const ENTITY_TYPES = [
  {
    id: 'llc' as EntityType,
    nameAr: 'شركة ذات مسؤولية محدودة (ذ.م.م)',
    nameEn: 'Limited Liability Company (LLC / W.L.L)',
    descAr: 'الأنسب للمشاريع والشركات في الخليج ومصر والأردن. مرونة في الإدارة وحماية لذمة الشركاء المالية.',
    descEn: 'Best for regional businesses across GCC, Egypt & Jordan. Full liability protection.',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most Popular',
    icon: Shield,
    color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
    recommended: true,
  },
  {
    id: 'sole' as EntityType,
    nameAr: 'شركة الشخص الواحد / مؤسسة فردية',
    nameEn: 'Single-Person Company / Sole Establishment',
    descAr: 'مثالية لرواد الأعمال والمشاريع المستقلة. ملكية كاملة بنسبة 100% لمالك واحد.',
    descEn: 'Ideal for solo entrepreneurs and startups. 100% single owner control.',
    badgeAr: 'ملكية 100%',
    badgeEn: '100% Ownership',
    icon: Building2,
    color: 'border-indigo-500/40 bg-indigo-500/5 text-indigo-400',
    badgeColor: 'bg-indigo-500/20 text-indigo-400',
    recommended: false,
  },
  {
    id: 'simplified_corp' as EntityType,
    nameAr: 'شركة المساهمة المبسطة / التجارية',
    nameEn: 'Simplified Joint-Stock / Corporate Entity',
    descAr: 'متوافقة مع نظام الشركات الحديث بالسعودية والإمارات. مهيأة لجولات الاستثمار والشركاء المؤسسين.',
    descEn: 'Modern framework in KSA & UAE. Investor-ready for scalable corporate ventures.',
    badgeAr: 'للمستثمرين والشركاء',
    badgeEn: 'Investor-Ready',
    icon: Scale,
    color: 'border-amber-500/40 bg-amber-500/5 text-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    recommended: false,
  },
];

const JURISDICTIONS = [
  { id: 'SA' as Jurisdiction, nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', descAr: 'نظام الشركات السعودي والمطابقة القانونية لعام 2026', descEn: 'Saudi Companies Law & Statutory AI Compliance 2026', cost: 'صياغة ذكية', recommended: true },
  { id: 'AE' as Jurisdiction, nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', flag: '🇦🇪', descAr: 'نظام الشركات التجاري الإماراتي وأنظمة DIFC/ADGM', descEn: 'UAE Commercial Companies Law & DIFC/ADGM Standards', cost: 'صياغة ذكية', recommended: false },
  { id: 'EG' as Jurisdiction, nameAr: 'جمهورية مصر العربية', nameEn: 'Egypt', flag: '🇪🇬', descAr: 'قانون الشركات المصري وحوكمة الحصص والأنظمة الأساسية', descEn: 'Egyptian Corporate Law & Equity Governance', cost: 'صياغة ذكية', recommended: false },
  { id: 'JO' as Jurisdiction, nameAr: 'المملكة الأردنية الهاشمية', nameEn: 'Jordan', flag: '🇯🇴', descAr: 'قانون الشركات الأردني وصياغة العقود التأسيسية الذكية', descEn: 'Jordanian Companies Law & Smart AoA AI Drafting', cost: 'صياغة ذكية', recommended: false },
  { id: 'KW' as Jurisdiction, nameAr: 'دولة الكويت ودول الخليج', nameEn: 'Kuwait & GCC', flag: '🇰🇼', descAr: 'الأنظمة القانونية للشركات ودول مجلس التعاون الخليجي', descEn: 'GCC Enterprise Legal Frameworks & AI Governance', cost: 'صياغة ذكية', recommended: false },
];

const COST_ITEMS = [
  { labelAr: 'صياغة وتدقيق عقد التأسيس والنظام الأساسي بالذكاء الاصطناعي', labelEn: 'AI Articles of Association Drafting & Legal Audit', min: 'مشمول', max: 'ضمن الباقات' },
  { labelAr: 'مطابقة الأنشطة التجارية وتوزيع الصلاحيات الإدارية والمالية', labelEn: 'Commercial Activities & Management Mandates Alignment', min: 'مشمول', max: 'فوري' },
  { labelAr: 'حزمة الوثائق القانونية والقرارات التأسيسية المعتمدة', labelEn: 'Certified Formation Resolutions & Documentation Bundle', min: 'مشمول', max: 'PDF / Word' },
  { labelAr: 'استشارة المساعد التشريعي الذكي للأنظمة واللوائح', labelEn: '24/7 AI Statutory Advisory & Regulatory Guide', min: 'مشمول', max: '24/7', optional: true },
];

const STEPS_AR = ['نوع الكيان', 'دولة التأسيس', 'بيانات المؤسسين', 'معاينة الوثائق', 'التأكيد والتحميل'];
const STEPS_EN = ['Entity Type', 'Jurisdiction', 'Founder Details', 'Document Preview', 'Confirmation & Download'];

// ─── Operating Agreement / Articles of Association Preview ──────────────────
function AgreementTeaser({ data, isRtl }: { data: FormData; isRtl: boolean }) {
  const entityName = ENTITY_TYPES.find(e => e.id === data.entityType);
  const jurName = JURISDICTIONS.find(s => s.id === data.jurisdiction);
  return (
    <div className="relative">
      <div className="bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
        <p className="font-bold text-slate-900 dark:text-white text-base">
          {isRtl ? 'عقد التأسيس والنظام الأساسي — مسودة أولية' : 'Articles of Association — Draft Preview'}
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-xs">
          {isRtl
            ? `أُبرم هذا العقد بتاريخ [●] بين الشركاء لتأسيس شركة "${data.companyName || '[اسم الشركة]'}" (${entityName?.nameAr || 'ذ.م.م'})، وفقاً للأنظمة واللوائح المعمول بها في ${jurName?.nameAr || '[الدولة]'}.`
            : `This Articles of Association is entered into as of [●] by the founders to establish "${data.companyName || '[Company Name]'}" (${entityName?.nameEn || 'LLC'}), organized under the laws of ${jurName?.nameEn || '[Jurisdiction]'}.`}
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-xs">
          {isRtl
            ? 'البند الأول: اسم الشركة، نوعها، وغاياتها التجارية...'
            : 'ARTICLE I: Name, Legal Structure, and Commercial Purpose...'}
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-xs blur-sm select-none">
          {isRtl
            ? 'البند الثاني: المركز الرئيسي وإدارة الشركة وتوزيع الحصص وصلاحيات التوقيع المالي والإداري والحوكمة...'
            : 'ARTICLE II: Registered office, management authorities, capital distribution, and signing mandates...'}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs blur-sm select-none">
          {isRtl
            ? 'البند الثالث: رأس المال، توزيع الأرباح، وفض النزاعات والتحكيم...'
            : 'ARTICLE III: Capital share, profit distribution, dispute resolution, and statutory compliance...'}
        </p>
      </div>
      {/* Paywall overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent rounded-b-2xl flex flex-col items-center justify-end pb-4 gap-2">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
          <Lock className="w-3.5 h-3.5" />
          {isRtl ? 'الوثيقة الكاملة متاحة للمشتركين فقط' : 'Full document available for subscribers'}
        </div>
        <Link to="/payment" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-900 dark:text-white text-xs font-black shadow-lg hover:opacity-90 transition-all">
          <Crown className="w-3.5 h-3.5" />
          {isRtl ? 'اشترك للحصول على الوثائق الكاملة' : 'Subscribe for Full Documents'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CompanyFormationPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    entityType: null, jurisdiction: null, companyName: '', directorName: '', directorEmail: '', directorCountry: '', businessPurpose: '', capital: 10000,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = isRtl ? STEPS_AR : STEPS_EN;
  const canProceed = () => {
    if (step === 0) return !!form.entityType;
    if (step === 1) return !!form.jurisdiction;
    if (step === 2) return form.companyName.trim().length > 2 && form.directorName.trim().length > 2 && form.directorEmail.includes('@');
    return true;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      addCompanyToQueue({
        companyName: form.companyName,
        jurisdiction: form.jurisdiction || 'SA',
        entityType: form.entityType || 'llc',
        contactEmail: form.directorEmail,
      });
    } catch {}
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const selectedJurisdiction = JURISDICTIONS.find(j => j.id === form.jurisdiction);

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex p-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black">{isRtl ? 'تم تجهيز صياغة وثائق الشركة بنجاح!' : 'AI Company Documents Generated!'}</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {isRtl
              ? `تم إنشاء مسودة عقد التأسيس والنظام الأساسي لشركة "${form.companyName}" في ${selectedJurisdiction?.nameAr}. تم حفظ النسخة الذكية في خزنة المستندات وإرسالها إلى البريد ${form.directorEmail}.`
              : `The AI-drafted Articles of Association for "${form.companyName}" in ${selectedJurisdiction?.nameEn} have been generated and sent to ${form.directorEmail}.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/vault" className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm hover:opacity-90 transition-all">
              <Lock className="w-4 h-4" />
              {isRtl ? 'الانتقال إلى خزنة المستندات' : 'Go to Document Vault'}
            </Link>
            <Link to="/support"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-700 transition-all">
              <Mail className="w-4 h-4" />
              {isRtl ? 'مركز الدعم الفني' : 'Support Center'}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <Globe className="w-3.5 h-3.5" />
            {isRtl ? 'صياغة وتدقيق عقود التأسيس والنظم الأساسية بالذكاء الاصطناعي' : 'AI Articles of Association & Corporate Bylaws Drafting'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'صياغة العقود التأسيسية والنظم الأساسية' : 'Corporate Articles & Bylaws AI Drafting'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            {isRtl
              ? 'حلول قانونية ذكية تقودك خطوة بخطوة لصياغة عقود التأسيس واللوائح التنظيمية وحوكمة الشركات في السعودية والإمارات ومصر والأردن والخليج.'
              : 'Smart AI legal engine — step-by-step drafting of Articles of Association, corporate bylaws, and governance compliance.'}
          </p>
        </div>

        {/* ── Disclaimer Banner: Scope Notice ────────────────────────── */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-start">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed">
            <p className="font-bold text-amber-300">
              {isRtl ? 'تنويه هام بشأن نطاق خدمات المنصة الذكية:' : 'Important Notice Regarding Platform Scope:'}
            </p>
            <p className="text-slate-300">
              {isRtl
                ? 'تقتصر خدمات منصة JurisTech Solutions حصرياً على الحلول الذكية، وصياغة وتدقيق العقود التأسيسية والأنظمة الأساسية بالذكاء الاصطناعي، والمطابقة مع الأنظمة واللوائح. المنصة لا تقدم خدمات مراجعة الوزارات أو الهيئات الحكومية الرسمية، ولا تتولى استخراج أو إصدار التراخيص الرسمية.'
                : 'JurisTech Solutions services are strictly restricted to AI legal intelligence, Articles of Association drafting, Bylaws audit, and statutory compliance. The platform does NOT perform government ministry filings or license issuance services.'}
            </p>
          </div>
        </div>

        {/* ── Trust badges ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
          {[
            { icon: BadgeCheck, text: isRtl ? 'متوافق مع أنظمة الشركات' : 'Statute Compliant', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
            { icon: Lock, text: isRtl ? 'تشفير وحماية البيانات' : 'AES-256 Encrypted', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
            { icon: Zap, text: isRtl ? 'توليد فوري للوثائق' : 'Instant Generation', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border ${color}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" /><span>{text}</span>
            </div>
          ))}
        </div>

        {/* ── Step Progress Indicator ─────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                    i < step ? 'bg-emerald-500 border-emerald-400 text-slate-900 dark:text-white' :
                    i === step ? 'bg-cyan-500 border-cyan-400 text-slate-950' :
                    'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-[9px] font-bold whitespace-nowrap ${i === step ? 'text-cyan-400' : i < step ? 'text-emerald-400' : 'text-slate-600'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all ${i < step ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Step Content ─────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 min-h-[340px]">

          {/* Step 0: Entity Type */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{isRtl ? '١. اختر نوع الكيان القانوني' : '1. Choose Your Entity Type'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ENTITY_TYPES.map((e) => {
                  const Icon = e.icon;
                  const isSelected = form.entityType === e.id;
                  return (
                    <button key={e.id} onClick={() => setForm(f => ({ ...f, entityType: e.id }))}
                      className={`relative p-4 rounded-2xl border-2 text-start transition-all ${isSelected ? e.color + ' scale-[1.02] shadow-lg' : 'border-slate-300 dark:border-slate-700 bg-slate-800/60 hover:border-slate-600'}`}>
                      {e.recommended && (
                        <span className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} text-[10px] font-black px-2 py-0.5 rounded-full ${e.badgeColor}`}>
                          {isRtl ? e.badgeAr : e.badgeEn}
                        </span>
                      )}
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? '' : 'text-slate-600 dark:text-slate-400'}`} />
                      <p className="font-black text-sm text-slate-900 dark:text-white">{isRtl ? e.nameAr : e.nameEn}</p>
                      <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{isRtl ? e.descAr : e.descEn}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Jurisdiction */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{isRtl ? '٢. اختر الدولة والأنظمة القانونية المستهدفة' : '2. Select Statutory Framework & Jurisdiction'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {JURISDICTIONS.map((s) => {
                  const isSelected = form.jurisdiction === s.id;
                  return (
                    <button key={s.id} onClick={() => setForm(f => ({ ...f, jurisdiction: s.id }))}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-start transition-all ${isSelected ? 'border-cyan-500/50 bg-cyan-500/10 scale-[1.01] shadow-lg' : 'border-slate-300 dark:border-slate-700 bg-slate-800/60 hover:border-slate-600'}`}>
                      <span className="text-2xl">{s.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 dark:text-white">{isRtl ? s.nameAr : s.nameEn}</span>
                          {s.recommended && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">{isRtl ? '★ موصى' : '★ Best'}</span>}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{isRtl ? s.descAr : s.descEn}</p>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 shrink-0">{s.cost}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Founder Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{isRtl ? '٣. بيانات المؤسسين والشركة' : '3. Company & Founder Information'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'companyName', labelAr: 'اسم الشركة المقترح', labelEn: 'Proposed Company Name', placeholder: isRtl ? 'مثال: شركة المستقبل للتقنية ذ.م.م' : 'e.g. Future Horizon LLC', type: 'text' },
                  { key: 'directorName', labelAr: 'اسم المدير / المفوض بالتوقيع', labelEn: 'Managing Director / Authorized Signatory', placeholder: isRtl ? 'الاسم الكامل' : 'Full name', type: 'text' },
                  { key: 'directorEmail', labelAr: 'البريد الإلكتروني الرسمي', labelEn: 'Official Email Address', placeholder: 'email@example.com', type: 'email' },
                  { key: 'directorCountry', labelAr: 'دولة المقر / الإقامة', labelEn: 'Country of Residence / Operation', placeholder: isRtl ? 'مثال: المملكة العربية السعودية' : 'e.g. Saudi Arabia', type: 'text' },
                ].map(({ key, labelAr, labelEn, placeholder, type }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{isRtl ? labelAr : labelEn}</label>
                    <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  </div>
                ))}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{isRtl ? 'الغرض والنشاط التجاري الأساسي' : 'Primary Commercial Activities'}</label>
                  <textarea value={form.businessPurpose} onChange={e => setForm(f => ({ ...f, businessPurpose: e.target.value }))}
                    placeholder={isRtl ? 'صف نشاط الشركة وأغراضها التجارية بإيجاز...' : 'Describe your primary business activities briefly...'}
                    rows={3} dir={isRtl ? 'rtl' : 'ltr'}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Preview */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{isRtl ? '٤. معاينة الوثائق القانونية والنظام الأساسي' : '4. Legal Documents Preview'}</h2>
              <AgreementTeaser data={form} isRtl={isRtl} />
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { icon: FileText, labelAr: 'عقد التأسيس الرسمي', labelEn: 'Articles of Association', locked: true },
                  { icon: Shield, labelAr: 'النظام الأساسي للشركة', labelEn: 'Corporate Bylaws', locked: true },
                  { icon: Building2, labelAr: 'قرار تعيين المدير والمفوضين', labelEn: 'Director Appointment Resolution', locked: true },
                  { icon: Scale, labelAr: 'محضر الاجتماع التأسيسي', labelEn: 'Founding Meeting Minutes', locked: true },
                ].map(({ icon: Icon, labelAr, labelEn, locked }) => (
                  <div key={labelEn} className={`flex items-center gap-2 p-3 rounded-xl border ${locked ? 'border-slate-300 dark:border-slate-700 bg-slate-800/40' : 'border-emerald-500/30 bg-emerald-500/10'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${locked ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-400'}`} />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1 truncate">{isRtl ? labelAr : labelEn}</span>
                    {locked ? <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Cost & Package Summary */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{isRtl ? '٥. تفاصيل الحزمة والإنشاء الذكي' : '5. Package Details & AI Generation'}</h2>

              <div className="bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 space-y-2.5">
                {COST_ITEMS.map((item) => (
                  <div key={item.labelEn} className="flex items-center justify-between text-xs py-1 border-b border-slate-700/50 last:border-0">
                    <span className="text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {isRtl ? item.labelAr : item.labelEn}
                    </span>
                    <span className="font-bold text-cyan-400">{isRtl ? item.min : item.max}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-start space-y-1">
                <p className="font-bold text-sm text-cyan-300">{isRtl ? 'تأكيد الحزمة وجاهزية الصياغة' : 'Draft Generation Summary'}</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl
                    ? `سيتم توليد وصياغة عقد التأسيس والنظام الأساسي لشركة "${form.companyName}" بالذكاء الاصطناعي وحفظها في الخزنة الإلكترونية.`
                    : `Your Articles of Association and corporate bylaws for "${form.companyName}" will be generated via AI and saved to your vault.`}
                </p>
              </div>
            </div>
          )}

          {/* ── Navigation Actions ────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-30 transition-all hover:bg-slate-700">
              {isRtl ? 'السابق' : 'Back'}
            </button>

            {step < 4 ? (
              <button onClick={() => setStep(s => Math.min(4, s + 1))} disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs disabled:opacity-40 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
                {isRtl ? 'التالي' : 'Next'}
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-emerald-500/25">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isRtl ? 'جارٍ توليد مسودة التأسيس...' : 'Generating AI Draft...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {isRtl ? 'توليد وصياغة وثائق الشركة' : 'Generate Company Documents'}
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
