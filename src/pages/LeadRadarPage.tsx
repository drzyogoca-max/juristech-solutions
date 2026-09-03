import { useState, useEffect } from 'react';
import {
  Users, Globe, Building2, Zap, RefreshCw, Send,
  CheckCircle2, Loader2, Sparkles, Database, Plus, Eye, Activity,
  Download, Search, Filter, Trash2, Edit3, ShieldCheck, ChevronDown, Check,
  AlertCircle, Briefcase, Tag, Target, ArrowUpDown
} from 'lucide-react';
import SmartRadarDashboard from '../components/SmartRadarDashboard';
import SEO from '../components/SEO';
import { usePlatformLocale } from '../lib/universalTranslator';
import { supabase } from '../lib/supabaseClient';

export interface UserTargetLead {
  id: string;
  user_id?: string;
  company_name: string;
  website?: string;
  industry: string;
  country: string;
  company_size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  target_role: string;
  lead_source: 'LinkedIn' | 'Direct' | 'Organic' | 'Referral' | 'Event';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  score_tier: 'HOT' | 'WARM' | 'COLD';
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'REPLIED' | 'MEETING' | 'OPPORTUNITY' | 'WON' | 'LOST';
  notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Deterministic JurisTech Lead Intelligence Score (0 - 100)
 */
export function calculateJurisTechLeadScore(lead: Partial<UserTargetLead>): { score: number; tier: 'HOT' | 'WARM' | 'COLD' } {
  let score = 0;

  // 1. Company Size Weight (max 25 pts)
  switch (lead.company_size) {
    case '500+': score += 25; break;
    case '201-500': score += 20; break;
    case '51-200': score += 15; break;
    case '11-50': score += 10; break;
    case '1-10': score += 5; break;
    default: score += 10;
  }

  // 2. Target Role Relevance Weight (max 25 pts)
  const role = (lead.target_role || '').toLowerCase();
  if (role.includes('counsel') || role.includes('legal') || role.includes('attorney') || role.includes('lawyer')) score += 25;
  else if (role.includes('ceo') || role.includes('founder') || role.includes('director') || role.includes('president')) score += 20;
  else if (role.includes('cfo') || role.includes('procurement') || role.includes('vp') || role.includes('head')) score += 15;
  else score += 10;

  // 3. Strategic Priority Weight (max 25 pts)
  switch (lead.priority) {
    case 'HIGH': score += 25; break;
    case 'MEDIUM': score += 15; break;
    case 'LOW': score += 5; break;
    default: score += 15;
  }

  // 4. Profile Completeness & Region Weight (max 25 pts)
  if (lead.website && lead.website.trim().length > 3) score += 10;
  if (lead.industry && lead.industry.trim().length > 2) score += 5;
  if (lead.notes && lead.notes.trim().length > 3) score += 5;
  if (lead.country) score += 5;

  const finalScore = Math.min(Math.max(score, 0), 100);
  let tier: 'HOT' | 'WARM' | 'COLD' = 'COLD';
  if (finalScore >= 70) tier = 'HOT';
  else if (finalScore >= 40) tier = 'WARM';

  return { score: finalScore, tier };
}

const LOCAL_STORAGE_KEY = 'juristech_user_target_workspace_v1';

function getDefaultLeads(): UserTargetLead[] {
  return [
    {
      id: 'LEAD-101',
      company_name: 'Aramco Energy Solutions',
      website: 'https://aramco.com',
      industry: 'Energy & Heavy Industry',
      country: 'Saudi Arabia',
      company_size: '500+',
      target_role: 'General Counsel',
      lead_source: 'Direct',
      priority: 'HIGH',
      score: 95,
      score_tier: 'HOT',
      status: 'QUALIFIED',
      notes: 'Targeting automated M&A contract auditing and PDPL statutory compliance.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'LEAD-102',
      company_name: 'Mubadala Investment Group',
      website: 'https://mubadala.ae',
      industry: 'Financial Services & Private Equity',
      country: 'United Arab Emirates',
      company_size: '500+',
      target_role: 'VP Legal & Governance',
      lead_source: 'LinkedIn',
      priority: 'HIGH',
      score: 88,
      score_tier: 'HOT',
      status: 'CONTACTED',
      notes: 'Reviewed cross-border DIFC & Saudi Civil Code templates.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'LEAD-103',
      company_name: 'El-Sewedy Electric Corp',
      website: 'https://elsewedyelectric.com',
      industry: 'Manufacturing & Infrastructure',
      country: 'Egypt',
      company_size: '201-500',
      target_role: 'Chief Legal Officer',
      lead_source: 'Referral',
      priority: 'MEDIUM',
      score: 72,
      score_tier: 'HOT',
      status: 'NEW',
      notes: 'Requires automated supply chain & EPC agreement redlining.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'LEAD-104',
      company_name: 'Acme Software Solutions',
      website: 'https://acme-soft.io',
      industry: 'Software & Technology',
      country: 'USA',
      company_size: '51-200',
      target_role: 'CEO & Founder',
      lead_source: 'Organic',
      priority: 'LOW',
      score: 45,
      score_tier: 'WARM',
      status: 'NEW',
      notes: 'Evaluated Delaware LLC to Saudi regional HQ expansion templates.',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

export default function LeadRadarPage() {
  const { isRtl, l } = usePlatformLocale();

  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'DEMO'>('WORKSPACE');
  const [leads, setLeads] = useState<UserTargetLead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'SCORE_ASC' | 'COMPANY_ASC' | 'DATE_DESC'>('SCORE_DESC');

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    industry: 'Legal Services & Technology',
    country: 'Saudi Arabia',
    company_size: '51-200' as UserTargetLead['company_size'],
    target_role: 'General Counsel',
    lead_source: 'LinkedIn' as UserTargetLead['lead_source'],
    priority: 'HIGH' as UserTargetLead['priority'],
    notes: '',
  });

  // Load User Leads from Local Storage & Supabase Sync
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        setLeads(JSON.parse(raw));
      } else {
        const initial = getDefaultLeads();
        setLeads(initial);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch {
      setLeads(getDefaultLeads());
    }

    // Attempt Supabase Sync for Authenticated Users
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user?.id) {
        const userId = data.session.user.id;
        supabase
          .from('user_target_leads')
          .select('*')
          .eq('user_id', userId)
          .then(({ data: remoteData }) => {
            if (remoteData && remoteData.length > 0) {
              setLeads(remoteData as UserTargetLead[]);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteData));
            }
          });
      }
    });
  }, []);

  const saveWorkspaceLeads = (updatedLeads: UserTargetLead[]) => {
    setLeads(updatedLeads);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLeads));
    } catch (e) {
      console.error('Save error:', e);
    }

    // Async push to Supabase if authenticated
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user?.id) {
        const userId = data.session.user.id;
        const payload = updatedLeads.map(l => ({ ...l, user_id: userId }));
        supabase.from('user_target_leads').upsert(payload);
      }
    });
  };

  const handleOpenAddModal = () => {
    setEditingLeadId(null);
    setFormData({
      company_name: '',
      website: '',
      industry: 'Legal Services & Technology',
      country: 'Saudi Arabia',
      company_size: '51-200',
      target_role: 'General Counsel',
      lead_source: 'LinkedIn',
      priority: 'HIGH',
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (lead: UserTargetLead) => {
    setEditingLeadId(lead.id);
    setFormData({
      company_name: lead.company_name,
      website: lead.website || '',
      industry: lead.industry,
      country: lead.country,
      company_size: lead.company_size,
      target_role: lead.target_role,
      lead_source: lead.lead_source,
      priority: lead.priority,
      notes: lead.notes || '',
    });
    setShowModal(true);
  };

  const handleSaveLead = () => {
    if (!formData.company_name.trim()) return;

    // Sanitize website URL
    let cleanWebsite = formData.website.trim();
    if (cleanWebsite && !cleanWebsite.startsWith('http://') && !cleanWebsite.startsWith('https://')) {
      cleanWebsite = 'https://' + cleanWebsite;
    }

    const { score, tier } = calculateJurisTechLeadScore({
      company_size: formData.company_size,
      target_role: formData.target_role,
      priority: formData.priority,
      website: cleanWebsite,
      industry: formData.industry,
      notes: formData.notes,
      country: formData.country,
    });

    if (editingLeadId) {
      const updated = leads.map(l =>
        l.id === editingLeadId
          ? {
              ...l,
              company_name: formData.company_name.trim(),
              website: cleanWebsite,
              industry: formData.industry,
              country: formData.country,
              company_size: formData.company_size,
              target_role: formData.target_role,
              lead_source: formData.lead_source,
              priority: formData.priority,
              score,
              score_tier: tier,
              notes: formData.notes,
              updated_at: new Date().toISOString(),
            }
          : l
      );
      saveWorkspaceLeads(updated);
    } else {
      const newLead: UserTargetLead = {
        id: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
        company_name: formData.company_name.trim(),
        website: cleanWebsite,
        industry: formData.industry,
        country: formData.country,
        company_size: formData.company_size,
        target_role: formData.target_role,
        lead_source: formData.lead_source,
        priority: formData.priority,
        score,
        score_tier: tier,
        status: 'NEW',
        notes: formData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newLead, ...leads];
      saveWorkspaceLeads(updated);
    }

    setShowModal(false);
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm(isRtl ? 'هل أنت تأكد من إزالة هذا الحساب المستهدف؟' : 'Are you sure you want to delete this target account?')) {
      const updated = leads.filter(l => l.id !== id);
      saveWorkspaceLeads(updated);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: UserTargetLead['status']) => {
    const updated = leads.map(l => (l.id === id ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l));
    saveWorkspaceLeads(updated);
  };

  const handleExportCSV = () => {
    const targetData = filteredLeads;
    if (targetData.length === 0) return;

    const headers = [
      'Company Name',
      'Website',
      'Industry',
      'Country',
      'Company Size',
      'Target Role',
      'Lead Source',
      'Priority',
      'JurisTech Score',
      'Score Tier',
      'Status',
      'Notes',
      'Created At',
    ];

    const rows = targetData.map(l => [
      `"${(l.company_name || '').replace(/"/g, '""')}"`,
      `"${(l.website || '').replace(/"/g, '""')}"`,
      `"${(l.industry || '').replace(/"/g, '""')}"`,
      `"${(l.country || '').replace(/"/g, '""')}"`,
      `"${l.company_size}"`,
      `"${(l.target_role || '').replace(/"/g, '""')}"`,
      `"${l.lead_source}"`,
      `"${l.priority}"`,
      l.score,
      `"${l.score_tier}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.created_at}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JurisTech_B2B_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Sort Logic
  const filteredLeads = leads
    .filter(l => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.company_name.toLowerCase().includes(q) ||
        l.industry.toLowerCase().includes(q) ||
        l.target_role.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q);

      const matchTier = selectedTier === 'ALL' || l.score_tier === selectedTier;
      const matchStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
      const matchPriority = selectedPriority === 'ALL' || l.priority === selectedPriority;

      return matchSearch && matchTier && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'SCORE_DESC') return b.score - a.score;
      if (sortBy === 'SCORE_ASC') return a.score - b.score;
      if (sortBy === 'COMPANY_ASC') return a.company_name.localeCompare(b.company_name);
      if (sortBy === 'DATE_DESC') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  // Summary Metrics
  const totalCount = leads.length;
  const hotCount = leads.filter(l => l.score_tier === 'HOT').length;
  const warmCount = leads.filter(l => l.score_tier === 'WARM').length;
  const coldCount = leads.filter(l => l.score_tier === 'COLD').length;
  const oppCount = leads.filter(l => l.status === 'OPPORTUNITY' || l.status === 'WON' || l.status === 'MEETING').length;

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-900 text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO
        title={l(
          'مساحة عمل تقييم وإدارة الشركات المستهدفة B2B | JurisTech Lead Intelligence Workspace',
          'B2B Lead Intelligence Workspace & Corporate Portfolio Engine | JurisTech Solutions'
        )}
        description={l(
          'مساحة عمل متكاملة لإدخال وتنظيم وتقييم الشركات المستهدفة وتتبع درجات التقييم وتصدير البيانات بصيغة CSV بدون ادعاءات سحب وهمي.',
          'Enterprise workspace to enter, score, organize, and manage target corporate accounts with CSV export and zero fake scraping claims.'
        )}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Workspace Top Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  {l('مساحة العمل المؤسسية B2B', 'Enterprise Lead Workspace')}
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {l('تقييم حتمي محمي 100%', '100% Secure & Deterministic')}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {l('مساحة عمل إدارة وتقييم الشركات المستهدفة (B2B Lead Intelligence)', 'B2B Lead Intelligence Workspace')}
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
                {l(
                  'أداة برمجية لإدارة وتنظيم وقوانين التقييم الحتمي للشركات المستهدفة، تتبع حالات التواصل، وتصدير البيانات بصيغة CSV بثقة تامة.',
                  'Self-service SaaS workspace to manage, score, filter, and track target corporate accounts with CSV export capabilities.'
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm flex items-center gap-2 transition shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>{l('إضافة شركة مستهدفة', 'Add Target Account')}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{l('تصدير CSV', 'Export CSV')}</span>
              </button>
            </div>
          </div>

          {/* Mode Tabs (My Workspace vs Demo Observatory) */}
          <div className="flex items-center gap-4 border-t border-slate-800 pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('WORKSPACE')}
              className={`pb-2 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'WORKSPACE'
                  ? 'border-sky-500 text-sky-400 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{l('🏢 مساحة عمل الشركات الخاصة بي', '🏢 My Target Leads Workspace')}</span>
            </button>

            <button
              onClick={() => setActiveTab('DEMO')}
              className={`pb-2 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'DEMO'
                  ? 'border-amber-500 text-amber-400 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{l('⚡ ذكاء الفرص التعاقدية B2B — نسخة تجريبية', '⚡ B2B Lead Intelligence — Demo')}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WORKSPACE VIEW */}
        {activeTab === 'WORKSPACE' && (
          <div className="space-y-8">
            {/* Summary Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{l('إجمالي الشركات', 'Total Accounts')}</div>
                <div className="text-2xl font-black text-white">{totalCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">{l('حسابات مسجلة', 'Registered Leads')}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">{l('شركات ذات أولوية قصوى (HOT)', 'HOT Leads (70-100)')}</div>
                <div className="text-2xl font-black text-red-400">{hotCount}</div>
                <div className="text-[11px] text-red-300/80 mt-1">{l('تقييم حتمي مرتفع', 'High Strategy Fit')}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">{l('شركات متوسطة (WARM)', 'WARM Leads (40-69)')}</div>
                <div className="text-2xl font-black text-amber-400">{warmCount}</div>
                <div className="text-[11px] text-amber-300/80 mt-1">{l('فرص واعدة', 'Promising Pipeline')}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">{l('شركات اعتيادية (COLD)', 'COLD Leads (0-39)')}</div>
                <div className="text-2xl font-black text-sky-400">{coldCount}</div>
                <div className="text-[11px] text-sky-300/80 mt-1">{l('ملفات مبدئية', 'Standard Profiles')}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">{l('فرص نشطة (Opportunities)', 'Active Opportunities')}</div>
                <div className="text-2xl font-black text-emerald-400">{oppCount}</div>
                <div className="text-[11px] text-emerald-300/80 mt-1">{l('اجتماعات ومفاوضات', 'In Engagement Stage')}</div>
              </div>
            </div>

            {/* Controls Bar: Search, Filters, Sorting */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={l('بحث باسم الشركة، القطاع، الدور، أو الملاحظات...', 'Search by company, industry, role, or notes...')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                </div>

                {/* Score Tier Filter */}
                <div className="md:col-span-2">
                  <select
                    value={selectedTier}
                    onChange={e => setSelectedTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition"
                  >
                    <option value="ALL">{l('جميع درجات التقييم', 'All Score Tiers')}</option>
                    <option value="HOT">🔥 HOT (70 - 100)</option>
                    <option value="WARM">⚡ WARM (40 - 69)</option>
                    <option value="COLD">❄️ COLD (0 - 39)</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-2">
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition"
                  >
                    <option value="ALL">{l('جميع الحالات', 'All Lead Statuses')}</option>
                    <option value="NEW">NEW (جديد)</option>
                    <option value="QUALIFIED">QUALIFIED (مؤهل)</option>
                    <option value="CONTACTED">CONTACTED (تم التواصل)</option>
                    <option value="REPLIED">REPLIED (تم الرد)</option>
                    <option value="MEETING">MEETING (اجتماع)</option>
                    <option value="OPPORTUNITY">OPPORTUNITY (فرصة)</option>
                    <option value="WON">WON (صفقة ناجحة)</option>
                    <option value="LOST">LOST (مغلق)</option>
                  </select>
                </div>

                {/* Sort dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition"
                  >
                    <option value="SCORE_DESC">{l('الترتيب: التقييم الأنتقائي (الأعلى أولاً)', 'Sort: Score (Highest First)')}</option>
                    <option value="SCORE_ASC">{l('الترتيب: التقييم الأنتقائي (الأقل أولاً)', 'Sort: Score (Lowest First)')}</option>
                    <option value="COMPANY_ASC">{l('الترتيب: اسم الشركة (أ - ي)', 'Sort: Company Name (A-Z)')}</option>
                    <option value="DATE_DESC">{l('الترتيب: تاريخ الإضافة (الأحدث)', 'Sort: Date Added (Newest)')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Target Leads Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">{l('اسم الشركة والمنشأة', 'Company & Website')}</th>
                      <th className="p-4">{l('القطاع والدولة', 'Industry & Country')}</th>
                      <th className="p-4">{l('الحجم والدور المستهدف', 'Size & Target Role')}</th>
                      <th className="p-4">{l('درجة تقييم JurisTech', 'JurisTech Score')}</th>
                      <th className="p-4">{l('الأولوية', 'Priority')}</th>
                      <th className="p-4">{l('حالة التواصل', 'Lead Status')}</th>
                      <th className="p-4 text-center">{l('إجراءات', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                          {l('لا توجد شركات مستهدفة تطابق معايير البحث الحالية.', 'No target accounts match your search filters.')}
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                          {/* Company Name & Link */}
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{lead.company_name}</div>
                            {lead.website ? (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>{lead.website.replace('https://', '').replace('http://', '')}</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500">{l('غير محدد', 'No website')}</span>
                            )}
                          </td>

                          {/* Industry & Country */}
                          <td className="p-4">
                            <div className="text-slate-200 font-semibold">{lead.industry}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{lead.country}</div>
                          </td>

                          {/* Size & Target Role */}
                          <td className="p-4">
                            <div className="text-slate-200 font-semibold">{lead.target_role}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {l('الحجم:', 'Size:')} {lead.company_size}
                            </div>
                          </td>

                          {/* Score & Tier Badge */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                  lead.score_tier === 'HOT'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                    : lead.score_tier === 'WARM'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                    : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                }`}
                              >
                                {lead.score_tier} ({lead.score}/100)
                              </span>
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                lead.priority === 'HIGH'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  : lead.priority === 'MEDIUM'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </td>

                          {/* Inline Status Dropdown */}
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={e => handleUpdateStatus(lead.id, e.target.value as any)}
                              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
                            >
                              <option value="NEW">NEW (جديد)</option>
                              <option value="QUALIFIED">QUALIFIED (مؤهل)</option>
                              <option value="CONTACTED">CONTACTED (تم التواصل)</option>
                              <option value="REPLIED">REPLIED (تم الرد)</option>
                              <option value="MEETING">MEETING (اجتماع)</option>
                              <option value="OPPORTUNITY">OPPORTUNITY (فرصة)</option>
                              <option value="WON">WON (صفقة ناجحة)</option>
                              <option value="LOST">LOST (مغلق)</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditModal(lead)}
                                title={l('تعديل البيانات', 'Edit Lead')}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setExpandedNotesId(expandedNotesId === lead.id ? null : lead.id)}
                                title={l('عرض الملاحظات', 'Toggle Notes')}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                title={l('حذف الحساب', 'Delete Lead')}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Inline Expanded Notes */}
                            {expandedNotesId === lead.id && (
                              <div className="mt-2 p-2.5 bg-slate-950 rounded-xl text-[11px] text-slate-300 text-right font-sans border border-slate-800 leading-relaxed">
                                <strong className="text-sky-400 block mb-1">{l('ملاحظات خاصة:', 'Notes:')}</strong>
                                {lead.notes || l('لا توجد ملاحظات مسجلة.', 'No notes recorded.')}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEMO OBSERVATORY VIEW */}
        {activeTab === 'DEMO' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-4 rounded-2xl text-xs leading-relaxed flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {l(
                  'تنبيه شفافية: هذه البيانات المعروضة أدناه هي سكريبتات محاكاة تجريبية (Demo Data) لتجربة واجهة الرادار واستعراض هيكلية السحب والتوزيع، وليست بيانات حية مسحوبة من أسواق خارجية.',
                  'Transparency Disclaimer: The records displayed below are mock demo data for platform evaluation and do not represent live scraped external market intelligence.'
                )}
              </span>
            </div>

            <SmartRadarDashboard />
          </div>
        )}
      </div>

      {/* ADD / EDIT LEAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-white">
                {editingLeadId ? l('تعديل بيانات الشركة المستهدفة', 'Edit Target Account') : l('إضافة شركة مستهدفة جديدة', 'Add New Target Account')}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {l('اسم الشركة أو المنشأة *', 'Company Name *')}
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Saudi National Bank (SNB)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {l('الموقع الإلكتروني (اختياري)', 'Website (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {l('القطاع الصناعي / التجاري', 'Industry / Sector')}
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Energy & Infrastructure"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {l('الدولة المقيمة', 'Country')}
                  </label>
                  <select
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Saudi Arabia">Saudi Arabia (المملكة العربية السعودية)</option>
                    <option value="United Arab Emirates">United Arab Emirates (الإمارات)</option>
                    <option value="Egypt">Egypt (جمهورية مصر العربية)</option>
                    <option value="USA">USA (الولايات المتحدة الأمريكية)</option>
                    <option value="United Kingdom">United Kingdom (المملكة المتحدة)</option>
                    <option value="Germany">Germany (ألمانيا)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {l('حجم المنشأة', 'Company Size')}
                  </label>
                  <select
                    value={formData.company_size}
                    onChange={e => setFormData({ ...formData, company_size: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500+">500+ Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {l('الدور / المنصب المستهدف', 'Target Role')}
                  </label>
                  <input
                    type="text"
                    value={formData.target_role}
                    onChange={e => setFormData({ ...formData, target_role: e.target.value })}
                    placeholder="e.g. General Counsel / VP Legal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {l('الأولوية الاستراتيجية', 'Strategic Priority')}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="HIGH">🔥 HIGH Priority</option>
                    <option value="MEDIUM">⚡ MEDIUM Priority</option>
                    <option value="LOW">❄️ LOW Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {l('ملاحظات وسجل التواصل', 'Notes & Strategic Context')}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={l('أدخل أي ملاحظات استراتيجية حول متطلبات الشركة التعاقدية...', 'Enter strategic notes, contract requirements, or notes...')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {l('إلغاء', 'Cancel')}
              </button>
              <button
                onClick={handleSaveLead}
                disabled={!formData.company_name.trim()}
                className="px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg disabled:opacity-50"
              >
                {editingLeadId ? l('حفظ التعديلات', 'Save Changes') : l('إضافة الحساب المستهدف', 'Add Account')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
