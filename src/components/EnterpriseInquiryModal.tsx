import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ShieldCheck, Send, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { analyticsConnector } from '../services/analyticsConnector';
import { crmService } from '../services/crmService';

interface EnterpriseInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseInquiryModal({ isOpen, onClose }: EnterpriseInquiryModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [industry, setIndustry] = useState('Law Firm');
  const [needs, setNeeds] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Basic Validation & Spam Guard
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanCompany = companyName.trim();

    if (!cleanEmail || !cleanCompany || !cleanName) {
      setErrorMessage('يرجى ملء جميع الحقول الإلزامية للمؤسسة.');
      return;
    }

    if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
      setErrorMessage('يرجى إدخال عنوان بريد إلكتروني صالح للمؤسسة.');
      return;
    }

    // 2. Rate Limiting Check (Max 3 submissions per hour per browser)
    const rateKey = 'juristech_rfp_submissions_rate';
    const recentSubmissions = JSON.parse(localStorage.getItem(rateKey) || '[]');
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;
    const validRecent = recentSubmissions.filter((t: number) => t > oneHourAgo);

    if (validRecent.length >= 3) {
      setErrorMessage('تم استقبال عدة طلبات مؤخراً. يرجى الانتظار أو التواصل مباشرة عبر البريد الرسمي.');
      return;
    }

    setLoading(true);

    try {
      // 3. Ingest into CRM as real inbound lead
      crmService.addLead({
        source_type: 'REAL',
        verification_status: 'VERIFIED',
        created_at: new Date().toISOString(),
        clientName: cleanName,
        companyName: cleanCompany,
        contactEmail: cleanEmail,
        jurisdiction: country,
        flag: country === 'Saudi Arabia' ? '🇸🇦' : country === 'UAE' ? '🇦🇪' : country === 'Egypt' ? '🇪🇬' : '🌐',
        status: 'New',
        lastContactDate: new Date().toISOString().split('T')[0],
        estimatedValueUSD: 5000,
        leadScore: 95,
        notesAr: `طلب استفسار مؤسسي: ${industry} | هاتف: ${phone || 'غير محدد'} | متطلبات: ${needs || 'استشارة حوكمة وتدقيق'}`,
        notesEn: `Enterprise Inquiry: ${industry} | Phone: ${phone || 'N/A'} | Scope: ${needs || 'Governance & Audit'}`,
      });

      // 4. Save rate limit record
      validRecent.push(now);
      localStorage.setItem(rateKey, JSON.stringify(validRecent));

      // 5. Track analytics conversion event
      analyticsConnector.trackEvent({
        eventName: 'enterprise_inquiry_sent',
        amountUSD: 5000,
        userRole: 'Enterprise Buyer',
        metadata: { companyName: cleanCompany, country, industry },
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label={isRtl ? 'إغلاق' : 'Close'}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {isRtl ? 'تم استلام طلبكم المؤسسي بنجاح' : 'Enterprise Request Received Successfully'}
            </h3>
            <p className="text-sm text-slate-300">
              {isRtl
                ? 'سيقوم مستشار الحوكمة المؤسسية والذكاء القانوني بالتواصل معكم وتجهيز العرض التجريبي المخصص لشركتكم.'
                : 'Our corporate governance & legal counsel team will reach out to configure your tailored enterprise deployment.'}
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isRtl ? 'طلب استشارة وعرض مؤسسي (Enterprise RFP)' : 'Request Enterprise RFP & Demo'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'لمكاتب المحاماة، الشركات المساهمة، وصناديق الاستثمار' : 'For law firms, corporations, and investment funds'}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'الاسم الكامل / الصفة *' : 'Full Name / Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isRtl ? 'د. المستشار القانوني / الرئيس التنفيذي' : 'e.g. General Counsel / Managing Partner'}
                  className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'اسم المؤسسة / الشركة *' : 'Organization / Company Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isRtl ? 'مكتب المحاماة أو اسم الشركة' : 'Law firm or corporate entity'}
                  className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isRtl ? 'البريد الإلكتروني للعمل *' : 'Work Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="legal@company.com"
                    className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isRtl ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 / +971 / +20"
                    className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isRtl ? 'الدولة / النطاق القضائي' : 'Jurisdiction / Country'}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Saudi Arabia">{isRtl ? 'المملكة العربية السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦'}</option>
                    <option value="UAE">{isRtl ? 'الإمارات العربية المتحدة 🇦🇪' : 'United Arab Emirates 🇦🇪'}</option>
                    <option value="Egypt">{isRtl ? 'جمهورية مصر العربية 🇪🇬' : 'Egypt 🇪🇬'}</option>
                    <option value="Qatar">{isRtl ? 'دولة قطر 🇶🇦' : 'Qatar 🇶🇦'}</option>
                    <option value="Kuwait">{isRtl ? 'دولة الكويت 🇰🇼' : 'Kuwait 🇰🇼'}</option>
                    <option value="Jordan">{isRtl ? 'المملكة الأردنية 🇯🇴' : 'Jordan 🇯🇴'}</option>
                    <option value="International">{isRtl ? 'دولية / أخرى 🌐' : 'International / Global 🌐'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isRtl ? 'القطاع' : 'Industry Sector'}
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Law Firm">{isRtl ? 'مكتب محاماة واستشارات' : 'Law Firm & Advisory'}</option>
                    <option value="Corporation">{isRtl ? 'شركة تجارية / صناعية' : 'Corporate / Enterprise'}</option>
                    <option value="Investment Fund">{isRtl ? 'صندوق استثماري / M&A' : 'Investment Fund / PE'}</option>
                    <option value="Government & Compliance">{isRtl ? 'جهة حوكمة وامتثال' : 'Governance & Compliance'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'نطاق المتطلبات القانونية المطلوبة' : 'Scope of Legal Requirements'}
                </label>
                <textarea
                  rows={2}
                  value={needs}
                  onChange={(e) => setNeeds(e.target.value)}
                  placeholder={isRtl ? 'مثال: فحص وتدقيق عقود المقاولات أو صفقات دمج واستحواذ أو الربط عبر الـ API' : 'e.g. M&A contract auditing, cross-border compliance, or CLM API integration'}
                  className="w-full px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-cyan-600/20 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال طلب العرض المؤسسي المخصص' : 'Submit Enterprise RFP')}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? 'حماية البيانات والسرية المهنية مشفرة وفق معايير الحوكمة المؤسسية' : 'Encrypted enterprise compliance & NDA protected'}</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
