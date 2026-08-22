import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Users, Target, Send, ShieldCheck, FileText, Download, CheckCircle, Clock, Bot, Zap } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import Forbidden403Page from '../Forbidden403Page';
import AdminNavSubbar from '../../components/AdminNavSubbar';
import { crmService } from '../../services/crmService';
import { sendOfficialEmail, EmailLead, EmailTemplate } from '../../services/marketingEmailEngine';
import { autonomousCSuiteOutreachEngine, AutoMachineState } from '../../services/autonomousCSuiteOutreachEngine';
import { callAI } from '../../lib/api';

export interface AuditLog {
  id: string;
  timestamp: string;
  type: 'Email Campaign' | 'System Alert' | 'Payment Receipt' | 'Lead Generation';
  action: string;
  actor: string;
  details: string;
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-001', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'Lead Generation', action: 'Lead Captured', actor: 'Autonomous CRM', details: 'Captured lead vis_riyadh_01 from landing page.' },
  { id: 'aud-002', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'Email Campaign', action: 'Campaign Dispatched', actor: 'Admin', details: 'Sent introduction email template to a.almutairi@saudicorp.com.' },
  { id: 'aud-003', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), type: 'Payment Receipt', action: 'Receipt Uploaded', actor: 'Guest User', details: 'Uploaded receipt of bank wire for SME Plan ($139).' },
  { id: 'aud-004', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'System Alert', action: 'WAF Rule Triggered', actor: 'Edge WAF', details: 'Blocked XSS attempt payload in /contracts.' },
  { id: 'aud-005', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'Lead Generation', action: 'Lead Upgraded', actor: 'System CRM', details: 'Lead h.hadid@dubaitrade.ae marked as Warm.' },
  { id: 'aud-006', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), type: 'Email Campaign', action: 'Followup Sent', actor: 'Autonomous CRM', details: 'Dispatched automated 3-day follow-up to info@egyptianlogisticshub.eg.' }
];

export default function AdminMarketingCRMPage() {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const isRtl = i18n.language === 'ar';

  const [leads, setLeads] = React.useState<EmailLead[]>(() => {
    const active = crmService.getLeads();
    return active.map((l) => ({
      id: l.id,
      name: l.clientName,
      email: l.contactEmail,
      company: l.companyName,
      jurisdiction: l.jurisdiction,
      status: l.status === 'Converted' ? 'Closed' : l.status === 'Disqualified' ? 'Cold' : l.status,
      lastContactDate: l.lastContactDate,
    }));
  });

  React.useEffect(() => {
    const updateLeads = () => {
      const active = crmService.getLeads();
      setLeads(
        active.map((l) => ({
          id: l.id,
          name: l.clientName,
          email: l.contactEmail,
          company: l.companyName,
          jurisdiction: l.jurisdiction,
          status: l.status === 'Converted' ? 'Closed' : l.status === 'Disqualified' ? 'Cold' : l.status,
          lastContactDate: l.lastContactDate,
        }))
      );
    };

    return crmService.subscribe(updateLeads);
  }, []);

  const handleDiscoverFreshB2B = () => {
    const added = crmService.discoverFreshB2BLeads(5);
    alert(
      isRtl
        ? `🚀 تم اكتشاف وإضافة ${added.length} عميل مؤسسي تجاري جديد إلى خط أنابيب الـ CRM بنجاح!`
        : `🚀 Discovered and ingested ${added.length} new unique B2B enterprise leads into CRM pipeline!`
    );
  };
  const [activeTab, setActiveTab] = useState<'pipeline' | 'campaign' | 'magnet' | 'audit'>('pipeline');
  
  // Email Campaign State
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Lead Magnet State
  const [magnetTopic, setMagnetTopic] = useState<string>('AI M&A Due Diligence');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [timeFilter, setTimeFilter] = useState<'all' | '24h' | '7d'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Email Campaign' | 'System Alert' | 'Payment Receipt' | 'Lead Generation'>('all');
  
  const [csuiteState, setCsuiteState] = useState<AutoMachineState>(autonomousCSuiteOutreachEngine.getState());
  const [isLaunching20, setIsLaunching20] = useState(false);

  const handleTrigger20Batch = async () => {
    setIsLaunching20(true);
    try {
      const result = await autonomousCSuiteOutreachEngine.autoRunDailyBatch();
      setCsuiteState(autonomousCSuiteOutreachEngine.getState());
      alert(
        isRtl
          ? `🚀 تم إرسال ${result.successCount} عروض تنفيذية للـ CEO والـ CFO بنجاح!\nالمتبقي اليوم: ${result.remainingQuota}/20\nالمرسل الرسمي: juristech.solutions@outlook.com بتوقيع د. محمد مصطفى.`
          : `🚀 Dispatched ${result.successCount} executive proposals to CEOs & CFOs!\nRemaining today: ${result.remainingQuota}/20\nOfficial Sender: juristech.solutions@outlook.com signed by Dr. Mohammad Mustafa.`
      );
    } finally {
      setIsLaunching20(false);
    }
  };

  if (!isAdmin) {
    return <Forbidden403Page />;
  }

  const handleSendEmail = async () => {
    if (!selectedLeadId || !emailSubject || !emailBody) return;
    setIsSending(true);
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead) {
      await sendOfficialEmail(lead.email, { subject: emailSubject, body: emailBody });
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    }
    setIsSending(false);
  };

  const handleGenerateMagnet = async () => {
    if (!magnetTopic) return;
    setIsGenerating(true);
    const prompt = `Generate a highly professional, B2B Case Study / Whitepaper on the topic of "${magnetTopic}" targeting enterprise clients. Format it in Markdown. Make it sound like it comes from JurisTech Solutions using our advanced Sovereign AI Engine. Focus on risk reduction, compliance, and automation.`;
    
    try {
      const result = await callAI(prompt, i18n.language);
      setGeneratedContent(result);
    } catch (e) {
      setGeneratedContent('Error generating whitepaper.');
    }
    setIsGenerating(false);
  };

  const statusColors = {
    New: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Cold: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    Warm: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Negotiating: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Closed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      <AdminNavSubbar />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isRtl ? 'إدارة التسويق وعلاقات العملاء (CRM)' : 'Marketing & CRM Engine'}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isRtl ? 'قناة الاتصال الرسمية: juristech.solutions@outlook.com' : 'Official Channel: juristech.solutions@outlook.com'}
            </p>
          </div>
        </div>

        {/* ── 20 Daily C-Suite Auto-Machine Banner ── */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Bot className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-white text-base sm:text-lg">
                  {isRtl ? '🤖 ماكينة الإرسال المؤتمتة للإدارة العليا (20 إيميل / اليوم لـ CEO و CFO)' : '🤖 20 Daily C-Suite Autonomous Outreach Machine'}
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase">
                  {isRtl ? 'بدون أي مجهود يدوي (Autopilot: ON)' : 'Autopilot: 100% Active'}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {isRtl
                  ? `تقوم الماكينة آلياً باختيار وتدقيق وإرسال 20 عرضاً استراتيجياً يومياً للرؤساء التنفيذيين (CEOs) والمدراء الماليين (CFOs) في كبرى الشركات العالمية والخليجية بتوقيع واعتماد د. محمد مصطفى.`
                  : `Fully autonomous pipeline that selects and dispatches 20 tailored legal AI infrastructure proposals daily to global & GCC CEOs & CFOs signed by Dr. Mohammad Mustafa.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 block font-mono">{isRtl ? 'إرساليات اليوم' : 'Sent Today'}</span>
              <span className="text-base font-black text-cyan-300 font-mono">
                {csuiteState.dispatchedTodayCount} / {csuiteState.dailyQuota}
              </span>
            </div>

            <button
              type="button"
              onClick={handleTrigger20Batch}
              disabled={isLaunching20}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/25 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isLaunching20 ? 'animate-spin' : ''}`} />
              <span>
                {isLaunching20
                  ? (isRtl ? 'جاري الإرسال التلقائي...' : 'Dispatching 20 Emails...')
                  : (isRtl ? 'تشغيل دفعة اليوم الآن (20 إيميل)' : 'Run Daily 20 C-Suite Batch')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDiscoverFreshB2B}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>
                {isRtl ? '🚀 اكتشاف عملاء B2B جدد' : '🚀 Discover Fresh B2B Leads'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            {isRtl ? 'مسار العملاء المحتملين (Pipeline)' : 'Lead Pipeline'}
          </button>
          <button
            onClick={() => setActiveTab('campaign')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'campaign'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            {isRtl ? 'حملات البريد الآلية (Email Campaigns)' : 'Email Campaigns'}
          </button>
          <button
            onClick={() => setActiveTab('magnet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'magnet'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            {isRtl ? 'توليد تقارير الجذب (Lead Magnets)' : 'Lead Magnet Generator'}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isRtl ? 'سجلات المراقبة والتدقيق (Audit Logs)' : 'Audit Logs Stream'}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pipeline' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Enterprise Leads CRM</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Client / Company</th>
                    <th className="py-3 px-4 font-bold">Email</th>
                    <th className="py-3 px-4 font-bold">Jurisdiction</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Last Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{lead.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{lead.company}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {lead.email}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300">
                        {lead.jurisdiction}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider ${statusColors[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                        {lead.lastContactDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'campaign' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Send Official Email Campaign</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Select Lead</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select a target...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.email})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="JurisTech Solutions: Proposal"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Email Body</label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Write your email body here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Sending as: <span className="text-slate-900 dark:text-white">juristech.solutions@outlook.com</span>
                  <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    BCC: drzyogo.ca@gmail.com
                  </span>
                </div>

                <button
                  onClick={handleSendEmail}
                  disabled={isSending || !selectedLeadId || !emailSubject || !emailBody}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 transition-colors"
                >
                  {isSending ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : sendSuccess ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSending ? 'Sending...' : sendSuccess ? 'Sent Successfully' : 'Send Official Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'magnet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">AI Whitepaper Generator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Research Topic</label>
                  <input
                    type="text"
                    value={magnetTopic}
                    onChange={(e) => setMagnetTopic(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <button
                  onClick={handleGenerateMagnet}
                  disabled={isGenerating || !magnetTopic}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? <Clock className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {isGenerating ? 'Generating Whitepaper...' : 'Generate Case Study'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm relative overflow-hidden flex flex-col h-[500px]">
              <div className="absolute top-0 right-0 p-4">
                <button
                  disabled={!generatedContent || isGenerating}
                  className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50"
                  title="Download PDF (Simulated)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-white mb-4">Preview</h2>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-slate-300 text-sm whitespace-pre-wrap font-mono">
                {isGenerating ? (
                  <div className="animate-pulse text-emerald-400">JurisTech Sovereign AI is synthesizing institutional data...</div>
                ) : generatedContent ? (
                  generatedContent
                ) : (
                  <div className="text-slate-600 flex items-center justify-center h-full">No content generated yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs Stream */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'سجل مراقبة وتدقيق العمليات (Audit Logs Stream)' : 'Audit Logs & Operations Stream'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'مراقبة وتوثيق كافة العمليات والحملات البريدية والتهديدات الأمنية لحظياً.' : 'Real-time auditing of B2B campaigns, leads captured, and security logs.'}
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = ['ID', 'Timestamp', 'Type', 'Action', 'Actor', 'Details'];
                  const rows = auditLogs
                    .filter(log => {
                      if (typeFilter !== 'all' && log.type !== typeFilter) return false;
                      if (timeFilter === '24h') {
                        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                        if (new Date(log.timestamp).getTime() < oneDayAgo) return false;
                      } else if (timeFilter === '7d') {
                        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                        if (new Date(log.timestamp).getTime() < sevenDaysAgo) return false;
                      }
                      return true;
                    })
                    .map(log => [
                      log.id,
                      log.timestamp,
                      log.type,
                      log.action,
                      log.actor,
                      log.details
                    ]);
                  
                  const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `juristech_audit_logs_${new Date().toISOString().slice(0,10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                {isRtl ? 'تصدير السجلات (CSV)' : 'Export CSV'}
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4 mb-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'الوقت:' : 'Timeframe:'}</span>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="all">{isRtl ? 'الكل' : 'All time'}</option>
                  <option value="24h">{isRtl ? 'آخر 24 ساعة' : 'Last 24 hours'}</option>
                  <option value="7d">{isRtl ? 'آخر 7 أيام' : 'Last 7 days'}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'نوع العملية:' : 'Action Type:'}</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="all">{isRtl ? 'الكل' : 'All Types'}</option>
                  <option value="Email Campaign">{isRtl ? 'حملات البريد' : 'Email Campaigns'}</option>
                  <option value="System Alert">{isRtl ? 'تنبيهات النظام' : 'System Alerts'}</option>
                  <option value="Payment Receipt">{isRtl ? 'إيصالات الدفع' : 'Payment Receipts'}</option>
                  <option value="Lead Generation">{isRtl ? 'استقطاب العملاء' : 'Lead Generation'}</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">{isRtl ? 'المعرف' : 'Log ID'}</th>
                    <th className="py-3 px-4 font-bold">{isRtl ? 'التاريخ والوقت' : 'Timestamp'}</th>
                    <th className="py-3 px-4 font-bold">{isRtl ? 'النوع' : 'Type'}</th>
                    <th className="py-3 px-4 font-bold">{isRtl ? 'العملية' : 'Action'}</th>
                    <th className="py-3 px-4 font-bold">{isRtl ? 'المسؤول' : 'Actor'}</th>
                    <th className="py-3 px-4 font-bold">{isRtl ? 'التفاصيل' : 'Details'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {auditLogs
                    .filter(log => {
                      if (typeFilter !== 'all' && log.type !== typeFilter) return false;
                      if (timeFilter === '24h') {
                        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                        if (new Date(log.timestamp).getTime() < oneDayAgo) return false;
                      } else if (timeFilter === '7d') {
                        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                        if (new Date(log.timestamp).getTime() < sevenDaysAgo) return false;
                      }
                      return true;
                    })
                    .length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-500 font-mono">
                        {isRtl ? 'لا توجد سجلات مطابقة للخيارات المحددة.' : 'No audit records match your filters.'}
                      </td>
                    </tr>
                  ) : (
                    auditLogs
                      .filter(log => {
                        if (typeFilter !== 'all' && log.type !== typeFilter) return false;
                        if (timeFilter === '24h') {
                          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                          if (new Date(log.timestamp).getTime() < oneDayAgo) return false;
                        } else if (timeFilter === '7d') {
                          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                          if (new Date(log.timestamp).getTime() < sevenDaysAgo) return false;
                        }
                        return true;
                      })
                      .map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs font-mono">
                          <td className="py-4 px-4 font-bold text-slate-500">{log.id}</td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              log.type === 'Email Campaign' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              log.type === 'System Alert' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              log.type === 'Payment Receipt' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{log.action}</td>
                          <td className="py-4 px-4 text-slate-700 dark:text-slate-350">{log.actor}</td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={log.details}>
                            {log.details}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
