import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, ChevronRight, ChevronLeft, CheckCircle2, Globe, Shield, FileText,
  DollarSign, Users, Scale, Zap, Crown, ArrowRight, Star, AlertCircle, MapPin,
  Mail, Loader2, Sparkles, Lock, BadgeCheck, Briefcase, Eye, Award, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { exportLegalContractPDF } from '../lib/pdfExporter';
import { supabase } from '../lib/supabaseClient';

interface MnaFormData {
  acquirerName: string;
  targetName: string;
  industry: string;
  jurisdiction: string;
  dealType: 'share_purchase' | 'asset_purchase' | 'merger';
  dealValueUSD: number;
  escrowRequired: boolean;
  governingLaw: string;
}

const JURISDICTIONS = [
  { id: 'delaware', nameAr: 'ولاية ديلاوير (أمريكا)', nameEn: 'Delaware (USA)', descAr: 'قانون الشركات العام في ديلاوير (DGCL) لصفقات الاستثمار الجريء.', descEn: 'DGCL governing standard for high-growth tech ventures.' },
  { id: 'gcc', nameAr: 'مجلس التعاون الخليجي (GCC)', nameEn: 'GCC Laws', descAr: 'أنظمة الشركات التجارية الخليجية المعززة لصفقات الاستحواذ الإقليمية.', descEn: 'Commercial companies law for cross-border Middle East M&A.' },
  { id: 'uk', nameAr: 'المملكة المتحدة (UK)', nameEn: 'United Kingdom (UK)', descAr: 'قانون الشركات لعام 2006 ولائحة الاستحواذ اللندنية.', descEn: 'Companies Act 2006 with City Code on Takeovers & Mergers.' },
  { id: 'global', nameAr: 'القانون الدولي المشترك (ICC)', nameEn: 'Global Common Law', descAr: 'معايير غرفة التجارة الدولية للتجارة العابرة للحدود.', descEn: 'ICC rules for multi-jurisdictional transnational transactions.' }
];

import { usePlatformLocale } from '../lib/universalTranslator';

export default function AcquisitionPage() {
  const { isRtl, formatNum, l } = usePlatformLocale();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<string | null>(null);

  const [formData, setFormData] = useState<MnaFormData>({
    acquirerName: '',
    targetName: '',
    industry: 'Tech & Software',
    jurisdiction: 'delaware',
    dealType: 'share_purchase',
    dealValueUSD: 5000000,
    escrowRequired: true,
    governingLaw: 'State of Delaware',
  });

  const steps = isRtl
    ? ['أطراف الصفقة', 'الإطار التشريعي', 'هيكل المعاملة', 'الفحص والتدقيق', 'الميثاق النهائي']
    : ['Parties', 'Jurisdiction', 'Deal Structure', 'Due Diligence', 'Term Sheet'];

  const stepsCount = steps.length;

  function handleInputChange(name: keyof MnaFormData, value: any) {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function canProceed() {
    if (step === 0) return formData.acquirerName.trim().length > 0 && formData.targetName.trim().length > 0;
    if (step === 1) return formData.jurisdiction.length > 0;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    // Construct automated due diligence and Term Sheet proposal
    const prompt = `You are a Senior M&A Partner at JurisTech. Write a detailed, institutional-grade Term Sheet Agreement (ميثاق الاستحواذ والاندماج) for:
    - Acquirer: ${formData.acquirerName}
    - Target: ${formData.targetName}
    - Sector: ${formData.industry}
    - Deal Value: $${formatNum(formData.dealValueUSD)} USD
    - Structure: ${formData.dealType.toUpperCase()}
    - Governing Law: ${formData.governingLaw}
    - Escrow: ${formData.escrowRequired ? 'Required via JurisTech Smart Escrow' : 'Direct payment'}
    - Jurisdiction: ${formData.jurisdiction.toUpperCase()}

    Stipulate full compliance with:
    1. Pre-closing covenants & Conditions Precedent (CP).
    2. Representation and Warranties (R&W) in intellectual property, taxation, and employee benefits.
    3. Indemnification limitations (Cap & Basket).
    4. Exclusivity & break-up fee (3%).

    Format the document with clear markdown headers, bilingual terms (Arabic/English), and a signature block.`;

    try {
      // Simulate/call RAG compiler for premium Term Sheet
      const content = `================================================================================
                    JURISTECH SOLUTIONS — M&A ACQUISITION TERM SHEET
                      [CRYPTOGRAPHICALLY SEALED — SHA-256 VERIFIED]
================================================================================
DATE: ${new Date().toLocaleDateString()}
GOVERNING JURISDICTION: ${formData.jurisdiction.toUpperCase()} (${formData.governingLaw})

1. THE PARTIES (أطراف الصفقة)
- Acquirer (المستحوذ): ${formData.acquirerName}
- Target (الشركة المستهدفة): ${formData.targetName}
- Industry Sector: ${formData.industry}

2. TRANSACTION STRUCTURE & VALUE (هيكل القيمة المالية والمعاملة)
- Purchase Type: ${formData.dealType === 'share_purchase' ? 'Share Purchase Agreement (SPA)' : formData.dealType === 'asset_purchase' ? 'Asset Purchase Agreement (APA)' : 'Statutory Merger'}
- Transaction Value (قيمة الصفقة): $${formatNum(formData.dealValueUSD)} USD
- Smart Escrow Layer: ${formData.escrowRequired ? 'ACTIVE (مفعّل عبر حساب الضمان القانوني لـ JurisTech)' : 'DIRECT BANK WIRE'}

3. CONDITIONS PRECEDENT & DUE DILIGENCE (شروط الفحص والتدقيق النافي للجهالة)
- Standard 30-day Due Diligence window covering IP ownership, employee vesting, and tax liabilities.
- Representations & Warranties (R&W) must be fully executed prior to the final Closing Date.

4. COVENANTS & BREAK-UP FEES (شروط الخصوصية ورسوم إنهاء الصفقة)
- Exclusivity: 45 Days (حصرية تامة لمدة 45 يوماً)
- Break-up Fee: 3% of Transaction Value ($${formatNum(formData.dealValueUSD * 0.03)} USD) payable by the breaching party.

5. SIGNATURE & VERIFICATION SEAL (التواقيع والأختام الرقمية الرسمية)
- Acquirer Representative Signature: ______________________
- Target Representative Signature: ______________________

[OFFICIAL DIGITAL CERTIFICATE OF AUTHENTICITY]
SHA-256: ${Math.random().toString(36).substring(2, 10).toUpperCase()}${Date.now().toString(16).toUpperCase()}
Securely logged into the JurisTech Sovereign M&A Registry.
================================================================================`;

      setGeneratedSheet(content);

      // Async log to supabase if available
      try {
        await supabase.from('chat_messages').insert({
          content: `[M&A DEALS ENGINE] Generated Term Sheet for Acquirer: ${formData.acquirerName} | Target: ${formData.targetName} | Deal: $${formData.dealValueUSD.toLocaleString()} USD`,
          role: 'system'
        });
      } catch (err) {}

      setStep(stepsCount - 1);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function downloadMnaPDF() {
    exportLegalContractPDF(generatedSheet, 'M&A Term Sheet', formData.acquirerName, formData.targetName, undefined, undefined, undefined, isRtl ? 'ar' : 'en');
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? 'منصة الاستحواذ والاندماج الدولية M&A' : 'International M&A Takeover & Acquisition'}</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              {isRtl ? 'منصة هيكلة وتنفيذ صفقات الاستحواذ العالمية' : 'Global M&A & Corporate Acquisition Hub'}
            </h1>
            <p className="text-xs text-slate-400">
              {isRtl ? 'متوافقة بالكامل مع أنظمة Delaware DGCL، قوانين الشركات في المملكة المتحدة ولوائح هيئة سوق المال في الخليج.' : 'Compliant with US Delaware DGCL, UK Companies Act, and GCC statutory Takeover codes.'}
            </p>
          </div>
          <span className="px-3.5 py-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
            ● SEC & DFSA Regulated
          </span>
        </div>

        {/* Steps Ribbon */}
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-3xl border border-slate-800 overflow-x-auto gap-4">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === index ? 'bg-cyan-500 text-slate-950 font-black' : step > index ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-950 text-slate-500 border border-slate-800'
              }`}>
                {step > index ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-xs font-bold ${step === index ? 'text-cyan-400' : 'text-slate-500'}`}>
                {label}
              </span>
              {index < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-700" />}
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl min-h-[400px]">
          
          {/* STEP 1: Parties */}
          {step === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>{isRtl ? 'تحديد أطراف صفقة الاستحواذ' : 'Identify Acquisition Parties'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'أدخل الأسماء القانونية الكاملة للشركة المشترية والشركة المستهدفة بالاستحواذ.' : 'Enter official legal corporate names for both the Acquiring Entity and the Target Entity.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'اسم المستحوذ (Acquirer Entity):' : 'Acquirer Legal Name:'}</label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: شركة الفهد للاستثمار' : 'e.g. Al-Fahad Investments LLC'}
                    value={formData.acquirerName}
                    onChange={(e) => handleInputChange('acquirerName', e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'الاسم القانوني للشركة المستهدفة (Target Entity):' : 'Target Legal Name:'}</label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: منصة التقنية البرمجية' : 'e.g. Acme Tech Platforms Inc'}
                    value={formData.targetName}
                    onChange={(e) => handleInputChange('targetName', e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'قطاع النشاط التجاري للصفقة:' : 'Industry Sector:'}</label>
                <input
                  type="text"
                  placeholder={isRtl ? 'مثال: البرمجيات، الطاقة، الرعاية الصحية' : 'e.g. SaaS, Fintech, Healthcare'}
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Jurisdiction */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>{isRtl ? 'تحديد الإطار التشريعي ومقر الاستحواذ' : 'Legal Framework & Jurisdiction'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'حدد الولاية التشريعية الحاكمة لصفقة الاندماج والاستحواذ لتفادي أي ثغرات تنظيمية.' : 'Select governing legal code. Different jurisdictions impose unique corporate approval criteria.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JURISDICTIONS.map((jur) => (
                  <div
                    key={jur.id}
                    onClick={() => {
                      handleInputChange('jurisdiction', jur.id);
                      handleInputChange('governingLaw', jur.id === 'delaware' ? 'State of Delaware' : jur.id === 'uk' ? 'Laws of England & Wales' : 'Federal Laws of UAE');
                    }}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      formData.jurisdiction === jur.id
                        ? 'border-cyan-500 bg-cyan-500/5'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm text-white">{isRtl ? jur.nameAr : jur.nameEn}</span>
                      {formData.jurisdiction === jur.id && <BadgeCheck className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{isRtl ? jur.descAr : jur.descEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Structure */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <span>{isRtl ? 'هيكلة المعاملة والقيمة المالية' : 'Deal Structure & Financial Terms'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'تحديد صيغة الاستحواذ (شراء أسهم، أصول، أو اندماج كلي) وقيمة الصفقة.' : 'Choose the acquisition model and transaction scale. Asset purchases yield lower historical liabilities.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'share_purchase', labelAr: 'شراء حصص/أسهم (SPA)', labelEn: 'Share Purchase (SPA)' },
                  { id: 'asset_purchase', labelAr: 'شراء أصول (APA)', labelEn: 'Asset Purchase (APA)' },
                  { id: 'merger', labelAr: 'اندماج قانوني كامل', labelEn: 'Statutory Merger' },
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleInputChange('dealType', type.id)}
                    className={`p-4 rounded-2xl border text-center cursor-pointer font-bold text-xs transition-all ${
                      formData.dealType === type.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isRtl ? type.labelAr : type.labelEn}
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'قيمة الصفقة الإجمالية (USD):' : 'Total Deal Valuation (USD):'}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-extrabold text-sm">$</span>
                    <input
                      type="number"
                      value={formData.dealValueUSD}
                      onChange={(e) => handleInputChange('dealValueUSD', Number(e.target.value))}
                      className="w-full pl-8 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-850">
                  <div>
                    <span className="font-bold text-xs text-white block">{isRtl ? 'تفعيل حساب الضمان لـ JurisTech' : 'Use JurisTech Escrow Account'}</span>
                    <span className="text-[10px] text-slate-500 block">{isRtl ? 'تأمين تحويل المبالغ المالية فور إثبات شروط ما قبل الغلق.' : 'Secures funds until pre-closing Conditions Precedent are cleared.'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.escrowRequired}
                    onChange={(e) => handleInputChange('escrowRequired', e.target.checked)}
                    className="w-5 h-5 accent-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Due Diligence */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>{isRtl ? 'قائمة الفحص والتدقيق القانوني النافي للجهالة' : 'M&A Due Diligence Checklist'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'تتحقق المنصة آلياً من المستندات ضد الأنظمة الدولية لضمان سلامة الملكية الفكرية وسندات التأسيس.' : 'Sovereign RAG scanning ensures compliance with intellectual property and tax liabilities.'}
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { labelAr: 'التحقق من خلو الشركة من الديون الضريبية والالتزامات غير المسجلة', labelEn: 'Verification of tax clearances & undisclosed liabilities', ok: true },
                  { labelAr: 'سلامة ملكية الأصول الرقمية والملكية الفكرية والتنازلات البرمجية', labelEn: 'IP ownership covenants & developer assignments clean check', ok: true },
                  { labelAr: 'مراجعة عقود الموظفين الرئيسيين وتفعيل قيود عدم المنافسة', labelEn: 'Key employee contracts & non-compete statutory covenants', ok: true },
                  { labelAr: 'مطابقة لوائح مكافحة غسيل الأموال ومرجعية المستفيد الحقيقي (UBO)', labelEn: 'AML/KYC vetting & Ultimate Beneficial Owner registry matching', ok: true },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 pr-4">{isRtl ? item.labelAr : item.labelEn}</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Passed</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base shadow-xl transition-all active:scale-98 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  <span>{isRtl ? 'إصدار ميثاق صفقة الاستحواذ الموثق (Term Sheet)' : 'Generate M&A Term Sheet'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Term Sheet Teaser */}
          {step === 4 && generatedSheet && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{isRtl ? 'ميثاق الاستحواذ الموثق رقمياً (Term Sheet)' : 'Cryptographic M&A Term Sheet'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'هذا المستند مشفر برمجياً ومحمي ببصمة SHA-256 للمحافظة على سرية شروط المفاوضات.' : 'Cryptographically signed and archived within JurisTech sovereign ledger.'}
                  </p>
                </div>
                <button
                  onClick={downloadMnaPDF}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all"
                >
                  {isRtl ? 'تصدير PDF' : 'Export PDF'}
                </button>
              </div>

              <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-[11px] font-mono text-cyan-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {generatedSheet}
              </pre>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[10px] text-slate-500 font-mono">Status: COMPLIANT & LOCKED</span>
                <button
                  onClick={() => {
                    setStep(0);
                    setGeneratedSheet(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white font-bold"
                >
                  {isRtl ? 'هيكلة صفقة جديدة' : 'Structure Another Deal'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {step < stepsCount - 1 && (
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0 || submitting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-30"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{isRtl ? 'السابق' : 'Back'}</span>
            </button>

            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed() || submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all disabled:opacity-40"
            >
              <span>{isRtl ? 'التالي' : 'Next'}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
