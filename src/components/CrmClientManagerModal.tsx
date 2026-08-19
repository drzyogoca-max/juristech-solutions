import React, { useState, useEffect } from 'react';
import { Users, Building, Mail, Globe, Calendar, CheckCircle2, Search, Plus, Trash2, Send, Download, RefreshCw, X, ShieldCheck, DollarSign, Sparkles, Filter, Rocket, Activity, Zap, CheckSquare, Archive, Check, Bot, History, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { crmService, CrmClientLead, CrmAuditLogEntry } from '../services/crmService';
import { automatedClientAcquisitionEngine } from '../services/automatedClientAcquisitionEngine';
import { exportDocumentMultiFormat } from '../lib/documentExporter';

interface CrmClientManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrmClientManagerModal({ isOpen, onClose }: CrmClientManagerModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'audit'>('active');
  const [leads, setLeads] = useState<CrmClientLead[]>(crmService.getLeads());
  const [archivedLeads, setArchivedLeads] = useState<CrmClientLead[]>(crmService.getArchivedLeads());
  const [auditLogs, setAuditLogs] = useState<CrmAuditLogEntry[]>(crmService.getAuditLogs());
  const [isAutoMode, setIsAutoMode] = useState<boolean>(crmService.isAutonomousMode());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLaunching1000, setIsLaunching1000] = useState(false);

  // AI Proposal Dispatcher Modal State
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<CrmClientLead | null>(null);
  const [customProposalNotes, setCustomProposalNotes] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // New Lead Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState('USA');
  const [newStatus, setNewStatus] = useState<CrmClientLead['status']>('Warm');
  const [newRequirements, setNewRequirements] = useState('');

  // Subscribe to live CRM stream
  useEffect(() => {
    const unsubscribe = crmService.subscribe(() => {
      setLeads([...crmService.getLeads()]);
      setArchivedLeads([...crmService.getArchivedLeads()]);
      setAuditLogs([...crmService.getAuditLogs()]);
      setIsAutoMode(crmService.isAutonomousMode());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  function handleToggleAutoMode() {
    const nextState = !isAutoMode;
    crmService.toggleAutonomousMode(nextState);
    setIsAutoMode(nextState);
  }

  async function handleLaunch1000Campaign() {
    setIsLaunching1000(true);
    try {
      const report = await automatedClientAcquisitionEngine.executeDailyZeroHumanAcquisition();
      alert(
        isRtl
          ? `🚀 تم تشغيل الأتمتة الفورية الكاملة لجذب 1,000 عميل لهذا اليوم بنجاح!\n• إجمالي الإيميلات المؤتمتة المرسلة: 1,000 إيميل B2B\n• العملاء المكتسبين الجدد: ${report.newConvertedClients}\n• العوائد المخططة ARR: $${report.projectedARRUSD.toLocaleString()} USD`
          : `🚀 1,000 Autonomous Client Acquisition Campaign Triggered Successfully!\n• Automated Emails Dispatched: 1,000 B2B emails\n• Converted Clients: ${report.newConvertedClients}\n• Projected ARR: $${report.projectedARRUSD.toLocaleString()} USD`
      );
      setLeads([...crmService.getLeads()]);
      setArchivedLeads([...crmService.getArchivedLeads()]);
      setAuditLogs([...crmService.getAuditLogs()]);
    } finally {
      setIsLaunching1000(false);
    }
  }

  const currentDataset = activeTab === 'active' ? leads : archivedLeads;

  const filteredLeads = currentDataset.filter((lead) => {
    const matchesSearch =
      `${lead.clientName} ${lead.companyName} ${lead.contactEmail} ${lead.jurisdiction}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPipelineValue = leads.reduce((acc, curr) => acc + curr.estimatedValueUSD, 0);

  function handleStatusChange(id: string, newStatus: CrmClientLead['status']) {
    crmService.updateLeadStatus(id, newStatus);
    setLeads([...crmService.getLeads()]);
  }

  function handleDelete(id: string) {
    crmService.deleteLead(id);
    setLeads([...crmService.getLeads()]);
  }

  function openProposalComposer(lead: CrmClientLead) {
    setSelectedLeadForOutreach(lead);
    setCustomProposalNotes(
      isRtl
        ? `طلب الشراكة والتأهيل القانوني لباقة المؤسسات والوصول إلى 1,000,000+ عقد معتمد وتدقيق المخاطر الذكي وفق اختصاص ${lead.jurisdiction}.`
        : `Request for enterprise legal partnership, 1,000,000+ contract vault access & AI risk audit under ${lead.jurisdiction} jurisdiction.`
    );
    setEmailSentSuccess(false);
  }

  async function handleConfirmAndSendEmail() {
    if (!selectedLeadForOutreach) return;
    setIsSendingEmail(true);
    try {
      await crmService.triggerAiOutreach(selectedLeadForOutreach, customProposalNotes, false);
      setEmailSentSuccess(true);
      setLeads([...crmService.getLeads()]);
      setArchivedLeads([...crmService.getArchivedLeads()]);
      setAuditLogs([...crmService.getAuditLogs()]);
      setTimeout(() => {
        setSelectedLeadForOutreach(null);
        setEmailSentSuccess(false);
      }, 1500);
    } finally {
      setIsSendingEmail(false);
    }
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientName || !newContactEmail) return;

    crmService.addLead({
      clientName: newClientName,
      companyName: newCompanyName || newClientName,
      contactEmail: newContactEmail,
      jurisdiction: newJurisdiction,
      flag: getFlagForCountry(newJurisdiction),
      status: newStatus,
      lastContactDate: new Date().toISOString().split('T')[0],
      estimatedValueUSD: 35000,
      leadScore: 88,
      notesAr: newRequirements || 'عميل جديد تم إدخاله للأتمتة الفورية',
      notesEn: newRequirements || 'New client added for instant autonomous ingestion',
      lastActivityAr: 'عميل جديد تمت إضافته في المنظومة',
      lastActivityEn: 'New client added to the CRM pipeline',
    });

    setLeads([...crmService.getLeads()]);
    setAuditLogs([...crmService.getAuditLogs()]);
    setNewClientName('');
    setNewCompanyName('');
    setNewContactEmail('');
    setNewRequirements('');
    setShowAddForm(false);
  }

  function getFlagForCountry(country: string): string {
    const c = country.toUpperCase();
    if (c.includes('USA') || c.includes('US') || c.includes('AMERICA')) return '🇺🇸';
    if (c.includes('UAE') || c.includes('DUBAI') || c.includes('EMIRATES')) return '🇦🇪';
    if (c.includes('CHINA') || c.includes('CN')) return '🇨🇳';
    if (c.includes('RUSSIA') || c.includes('RU')) return '🇷🇺';
    if (c.includes('KSA') || c.includes('SAUDI')) return '🇸🇦';
    if (c.includes('JORDAN') || c.includes('JO')) return '🇯🇴';
    if (c.includes('EGYPT') || c.includes('EG')) return '🇪🇬';
    if (c.includes('UK') || c.includes('BRITAIN')) return '🇬🇧';
    return '🌐';
  }

  function getStatusBadge(status: CrmClientLead['status']) {
    switch (status) {
      case 'Warm':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'New':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Negotiating':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Disqualified':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Converted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  function exportCrmReport(format: 'docx' | 'txt' | 'pdf') {
    const headerText = isRtl
      ? `جدول إدارة العلاقات والتسويق والعملاء الديناميكي (CRM Client Report)\nإجمالي قيمة الفرص: $${totalPipelineValue.toLocaleString()} USD\nتاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}\n`
      : `Dynamic CRM Client & Marketing Relationship Report\nTotal Pipeline Value: $${totalPipelineValue.toLocaleString()} USD\nReport Date: ${new Date().toLocaleDateString()}\n`;

    const bodyText = currentDataset
      .map(
        (l, idx) =>
          `[${idx + 1}] ${l.clientName} (${l.companyName})\nالبريد: ${l.contactEmail} | الدولة: ${l.jurisdiction} | الحالة: ${l.status} | النتيجة: ${l.leadScore}/100\nالنشاط الأخير: ${l.lastActivityAr || l.notesAr}\n--------------------------------------------------`
      )
      .join('\n\n');

    exportDocumentMultiFormat(`${headerText}\n${bodyText}`, 'CRM_Client_Report', 'JurisTech Admin', 'CRM Database', format, isRtl ? 'ar' : 'en');
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.92)', backdropFilter: 'blur(12px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white">
                  {isRtl ? 'إدارة التسويق وعلاقات العملاء (CRM & C-Suite Outreach)' : 'C-Suite CRM & Lead Management'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Bot className="w-3 h-3 text-emerald-400" /> {isRtl ? 'عروض CEO/CFO بالإنجليزية' : 'CEO & CFO PROPOSALS'}
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  ⚡ {isRtl ? `الحد اليومي الصارم: ${crmService.getDailyQuotaStats().usedToday}/${crmService.getDailyQuotaStats().limit} (المتبقي: ${crmService.getDailyQuotaStats().remainingToday})` : `Daily Limit: ${crmService.getDailyQuotaStats().usedToday}/${crmService.getDailyQuotaStats().limit} (${crmService.getDailyQuotaStats().remainingToday} Left)`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isRtl ? 'عروض تنفيذية حصرية للرؤساء التنفيذيين والمدراء الماليين (CEO & CFO) باللغة الإنجليزية القانونية المعتمدة وموقعة من رئيس مجلس الإدارة' : 'High-ticket executive English proposals for CEOs & CFOs signed by Dr. Mohammad Mustafa'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Mode Toggle Switch */}
            <button
              onClick={handleToggleAutoMode}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoMode
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Zero-Human Auto-Dispatch Mode"
            >
              {isAutoMode ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
              <span>{isAutoMode ? (isRtl ? 'الأتمتة: مفعّلة' : 'Auto: ON') : (isRtl ? 'الأتمتة: يدوية' : 'Auto: OFF')}</span>
            </button>

            <button
              onClick={handleLaunch1000Campaign}
              disabled={isLaunching1000}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              title="Launch 1,000 Zero-Human Acquisition Campaign"
            >
              <Rocket className={`w-3.5 h-3.5 ${isLaunching1000 ? 'animate-bounce' : ''}`} />
              <span>{isLaunching1000 ? (isRtl ? 'جاري الأتمتة...' : 'Automating...') : (isRtl ? '🚀 أتمتة 1,000 عميل اليوم' : '🚀 1,000 Clients Auto-Acquisition')}</span>
            </button>

            <button
              onClick={() => exportCrmReport('docx')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.docx)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top KPI Cards & Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">{isRtl ? 'العملاء في الانتظار' : 'Active Pending Leads'}</span>
              <div className="text-2xl font-black text-cyan-300 font-mono">{leads.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">{isRtl ? 'العقود المرسلة والموثقة' : 'Dispatched Deals'}</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{archivedLeads.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">{isRtl ? 'سجل المراقبة والتدقيق' : 'Audit Log Entries'}</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{auditLogs.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs">{isRtl ? 'إضافة عميل جديد' : 'New Client Lead'}</span>
                <div className="text-xs text-slate-300 font-bold">{isRtl ? 'حقن فوري مع الأتمتة' : 'Event-Driven Ingestion'}</div>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'إضافة عميل' : 'Add Lead'}</span>
              </button>
            </div>
          </div>

          {/* 3-Way Tab Selector: Active vs Dispatched vs Audit Log */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isRtl ? `العملاء في الانتظار (${leads.length})` : `Active Leads (${leads.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'archived'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>{isRtl ? `كشف العقود المرسلة (${archivedLeads.length})` : `Dispatched Archives (${archivedLeads.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{isRtl ? `سجل المراقبة والتدقيق اللحظي (${auditLogs.length})` : `Live Audit Log (${auditLogs.length})`}</span>
            </button>
          </div>

          {/* Add New Lead Form Accordion */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 animate-in fade-in">
              <h4 className="font-bold text-amber-300 flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'إدخال عميل جديد (يطلق الأتمتة والتحليل والإرسال التلقائي فوراً):' : 'New Corporate Client Details (Triggers Full AI Auto-Dispatch):'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder={isRtl ? 'اسم العميل (مثال: James Carter)...' : 'Client Name...'}
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'اسم الشركة (مثال: Global Investments)...' : 'Company Name...'}
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="email"
                  placeholder={isRtl ? 'البريد الإلكتروني الرسمي...' : 'Official Email...'}
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
                <select
                  value={newJurisdiction}
                  onChange={(e) => setNewJurisdiction(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="USA">USA 🇺🇸</option>
                  <option value="UAE">UAE 🇦🇪</option>
                  <option value="China">China 🇨🇳</option>
                  <option value="Russia">Russia 🇷🇺</option>
                  <option value="KSA">Saudi Arabia 🇸🇦</option>
                  <option value="Jordan">Jordan 🇯🇴</option>
                  <option value="UK">UK 🇬🇧</option>
                </select>
              </div>

              <input
                type="text"
                placeholder={isRtl ? 'الاحتياج القانوني للعميل (مثال: حوكمة شركات، رادار مخاطر، عقود توريد دولية)...' : 'Client Legal Requirement Scope (e.g. M&A Governance, AI Risk Radar)...'}
                value={newRequirements}
                onChange={(e) => setNewRequirements(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black cursor-pointer shadow-md"
                >
                  {isRtl ? '🚀 حفظ وإطلاق مسار الأتمتة الفوري' : '🚀 Save & Trigger Auto-Pipeline'}
                </button>
              </div>
            </form>
          )}

          {/* Interactive AI Proposal & Email Composer Modal */}
          {selectedLeadForOutreach && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-extrabold text-cyan-300 text-sm">
                    {isRtl ? `توليد وإرسال العرض الذكي إلى: ${selectedLeadForOutreach.clientName} (${selectedLeadForOutreach.companyName})` : `Generate & Dispatch AI Proposal for: ${selectedLeadForOutreach.clientName}`}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedLeadForOutreach(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold block text-[11px]">
                  {isRtl ? 'ملاحظات وتخصيصات العرض للعميل:' : 'Custom Proposal Notes & Target Scope:'}
                </label>
                <textarea
                  value={customProposalNotes}
                  onChange={(e) => setCustomProposalNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Signature Stamp Preview */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="text-amber-400 font-bold">✍️ ختم التوقيع المعتمد (Certified Digital Signature Stamp):</div>
                <div className="text-white font-black">د. محمد مصطفى (Dr. Mohammad Mustafa)</div>
                <div className="text-slate-400">دكتور القانون التجاري الدولي والنمذجة الذكية — رئيس مجلس الإدارة</div>
                <div className="text-cyan-400">البريد الرسمي المعتمد: Drzyogo.ca@gmail.com | juristech.solutions@outlook.com</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  {isRtl ? '⚡ سينتقل العميل فوراً إلى كشف العقود الموثقة ويتم تسجيل المعاملة في سجل المراقبة' : 'Client moves to archives on dispatch & Audit Log is updated automatically'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLeadForOutreach(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    onClick={handleConfirmAndSendEmail}
                    disabled={isSendingEmail}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {emailSentSuccess ? (
                      <>
                        <CheckSquare className="w-4 h-4 text-slate-950" />
                        <span>{isRtl ? 'تم الإرسال والأرشفة وتجديد القائمة بنجاح!' : 'Sent, Archived & Refreshed!'}</span>
                      </>
                    ) : (
                      <>
                        <Send className={`w-4 h-4 ${isSendingEmail ? 'animate-spin' : ''}`} />
                        <span>{isSendingEmail ? (isRtl ? 'جاري الإرسال والأرشفة والحقن...' : 'Dispatching & Refreshing...') : (isRtl ? '🚀 إرسال العرض وحقن التحديثات' : '🚀 Dispatch Proposal & Auto-Inject')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1 & 2: LEADS TABLE */}
          {activeTab !== 'audit' && (
            <>
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={isRtl ? 'البحث بالاسم، البريد، الشركة، الدولة...' : 'Search by Name, Email, Company, Jurisdiction...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none text-white text-xs focus:outline-none placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto font-mono">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="All">{isRtl ? 'جميع الحالات (All Statuses)' : 'All Statuses'}</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Closed">Closed</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>

              {/* CRM Leads Main Table */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-right dir-rtl border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-mono">
                      <th className="p-3 text-right">{isRtl ? 'العميل / الشركة (Client / Company)' : 'Client / Company'}</th>
                      <th className="p-3 text-right">{isRtl ? 'البريد الإلكتروني (Email)' : 'Email'}</th>
                      <th className="p-3 text-center">{isRtl ? 'الدولة / الاختصاص (Jurisdiction)' : 'Jurisdiction'}</th>
                      <th className="p-3 text-center">{isRtl ? 'حالة الصفقة (Status)' : 'Status'}</th>
                      <th className="p-3 text-center">{isRtl ? 'درجة التفاعل (Score)' : 'Lead Score'}</th>
                      <th className="p-3 text-left">{isRtl ? 'الإجراءات (Actions)' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3 font-bold">
                          <div className="text-white flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{lead.clientName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">{lead.companyName}</div>
                          {lead.lastActivityAr && (
                            <div className="text-[9.5px] text-amber-400/90 font-normal mt-0.5">{isRtl ? lead.lastActivityAr : lead.lastActivityEn}</div>
                          )}
                        </td>

                        <td className="p-3 text-slate-300">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{lead.contactEmail}</span>
                          </div>
                        </td>

                        <td className="p-3 text-center font-bold">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
                            <span>{lead.flag}</span>
                            <span>{lead.jurisdiction}</span>
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-xl border text-[11px] font-black cursor-pointer focus:outline-none ${getStatusBadge(lead.status)}`}
                          >
                            <option value="Warm" className="bg-slate-900 text-amber-300">Warm</option>
                            <option value="Cold" className="bg-slate-900 text-cyan-300">Cold</option>
                            <option value="Negotiating" className="bg-slate-900 text-indigo-300">Negotiating</option>
                            <option value="Closed" className="bg-slate-900 text-purple-300">Closed</option>
                            <option value="Converted" className="bg-slate-900 text-emerald-300">Converted</option>
                          </select>
                        </td>

                        <td className="p-3 text-center font-bold">
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px]">
                            {lead.leadScore}/100
                          </span>
                        </td>

                        <td className="p-3 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            {activeTab === 'active' ? (
                              <button
                                onClick={() => openProposalComposer(lead)}
                                className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                                title={isRtl ? 'توليد وإرسال العرض وتحديث الكشف آلياً' : 'Generate & Send AI Proposal'}
                              >
                                <Send className="w-3 h-3" />
                                <span>{isRtl ? 'مراسلة AI' : 'AI Proposal'}</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                <Check className="w-3 h-3" />
                                <span>DISPATCHED & CONVERTED</span>
                              </span>
                            )}

                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 3: LIVE AUDIT LOG MONITOR */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>{isRtl ? 'سجل المراقبة والتدقيق اللحظي لجميع العمليات المؤتمتة (Audit Log)' : 'Live Operational Audit Log (Zero-Human Pipeline)'}</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  ✓ {isRtl ? 'يتم التسجيل التلقائي فور حدوث أي إجراء' : 'Real-time Event Logging Active'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs hover:border-slate-700 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          log.actionType === 'AUTO_DISPATCH' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          log.actionType === 'AUTO_ANALYSIS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {log.actionType}
                        </span>
                        <span className="text-white font-bold">{log.clientName}</span>
                        <span className="text-slate-400">({log.contactEmail})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">{log.proposalSummary}</p>
                      <div className="text-[10px] text-cyan-400/80">نموذج الذكاء الاصطناعي: {log.aiModel} | الاختصاص: {log.jurisdiction}</div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-left">
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{isRtl ? 'نظام CRM مؤتمت بالكامل: الاستقبال ⬅️ التحليل ⬅️ الصياغة ⬅️ الإرسال المباشر ⬅️ الأرشفة' : 'Full Event-Driven CRM: Ingestion ➡️ AI Analysis ➡️ Drafting ➡️ Dispatch ➡️ Audit'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            {isRtl ? 'إغلاق اللوحة' : 'Close Portal'}
          </button>
        </div>
      </div>
    </div>
  );
}
