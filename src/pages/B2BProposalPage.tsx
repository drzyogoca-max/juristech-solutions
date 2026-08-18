import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Sparkles, Download, Copy, Check, DollarSign, Loader2, Shield } from 'lucide-react';
import { generateEnterpriseProposal, HighTicketProposal } from '../services/stealth-agents';
import { exportLegalContractPDF } from '../lib/pdfExporter';
import SEO from '../components/SEO';

export default function B2BProposalPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState(15);
  const [contractVolume, setContractVolume] = useState(50);
  const [jurisdiction, setJurisdiction] = useState('جمهورية مصر العربية / GCC');
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<HighTicketProposal | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerateProposal() {
    if (!companyName.trim() || loading) return;
    setLoading(true);

    try {
      const prop = await generateEnterpriseProposal({
        companyName,
        industry: industry || 'Tech & Corporate Commercial',
        teamSize,
        estimatedContractVolume: contractVolume,
        targetJurisdiction: jurisdiction,
      }, isRtl);

      setProposal(prop);
    } catch (err) {
      console.error('Error generating B2B proposal:', err);
    } finally {
      setLoading(false);
    }
  }

  function copyProposal() {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal.proposalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            <span>{isRtl ? 'مولد عروض الشركات والمؤسسات B2B' : 'Custom B2B Enterprise Proposal Engine'}</span>
          </div>
          <h1 className="text-3xl font-extrabold">{isRtl ? 'صياغة العروض الفاخرة المخصصة للشركات' : 'Generate High-Ticket B2B Proposals'}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {isRtl ? 'صياغة عروض قانونية واستثمارية متكاملة لـ CEOs ومكاتب المحاماة تعكس توفير 80% من التكاليف' : 'Tailor executive B2B proposals for C-suite clients highlighting 80% operational cost savings'}
          </p>
        </div>

        {/* Generator Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'اسم الشركة / المؤسسة' : 'Company Name'}</label>
              <input
                type="text"
                placeholder={isRtl ? 'مثال: مجموعة الفارس القابضة' : 'e.g. Al-Faris Holding Group'}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'قطاع العمل' : 'Industry Sector'}</label>
              <input
                type="text"
                placeholder={isRtl ? 'مثال: العقارات، الاستثمار، التكنولوجيا' : 'e.g. Real Estate, Tech, Legal'}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'عدد العقود الشهرية المتوقعة' : 'Monthly Contract Volume'}</label>
              <input
                type="number"
                value={contractVolume}
                onChange={(e) => setContractVolume(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{isRtl ? 'النظام التشريعي المعتمد' : 'Governing Jurisdiction'}</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateProposal}
            disabled={loading || !companyName.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? (isRtl ? 'جاري بناء العرض الفاخر...' : 'Building B2B Proposal...') : (isRtl ? 'إنشاء عرض الشركات ($1,000 - $5,000)' : 'Generate High-Ticket B2B Proposal')}</span>
          </button>
        </div>

        {/* Generated Proposal Output */}
        {proposal && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider block">{proposal.tier}</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{proposal.companyName}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-600 dark:text-slate-400 block">{isRtl ? 'التوفير السنوي المتوقع' : 'Estimated Annual Savings'}</span>
                  <span className="text-xl font-extrabold text-emerald-400">{proposal.estimatedAnnualSavings}</span>
                </div>
                <button
                  onClick={copyProposal}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => exportLegalContractPDF(proposal.proposalContent, 'B2B_Proposal', proposal.companyName, 'JurisTech Solutions', undefined, undefined, undefined, isRtl ? 'ar' : 'en')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{isRtl ? 'تصدير PDF' : 'Export PDF'}</span>
                </button>
              </div>
            </div>

            {/* Direct Instant Real Client Conversion Actions */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                  {isRtl ? 'تواصل مؤسسي مباشر مع المستشار المباشر' : 'Direct Executive Contact with Lead Counsel'}
                </span>
                <p className="text-xs font-bold text-white">
                  {isRtl ? 'إرسال العرض فورياً وحجز جلسة تعاقد وحصول على التخفيض الخاص' : 'Send proposal instantly for direct execution & corporate onboarding'}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/201126674337?text=${encodeURIComponent(isRtl ? `مرحباً د. محمد مصطفى، يرجي مراجعة طلب العرض المؤسسي الخاص بشركة: ${proposal.companyName}` : `Hello Dr. Mohammed Mostafa, please review B2B proposal for: ${proposal.companyName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span>💬 {isRtl ? 'تواصل عبر واتساب' : 'WhatsApp Direct'}</span>
                </a>
                <a
                  href={`mailto:Drzyogo.ca@gmail.com?cc=juristech.solutions@outlook.com&subject=${encodeURIComponent(`B2B Proposal Request - ${proposal.companyName}`)}&body=${encodeURIComponent(proposal.proposalContent.slice(0, 500))}`}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span>📧 {isRtl ? 'إرسال بالإيميل' : 'Email Direct'}</span>
                </a>
              </div>
            </div>


            <pre className="whitespace-pre-wrap font-sans text-xs bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed max-w-full overflow-x-auto">
              {proposal.proposalContent}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
