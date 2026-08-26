/**
 * src/pages/EnterpriseCommandCenterPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise AI Command Center 2.0
 * Specification: Task 15.6
 *
 * Real-time operational cockpit for autonomous workflows, official gazette monitoring,
 * enterprise copilot metrics, global law firm dispatch, and multi-jurisdiction treaty networks.
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Cpu,
  Globe2,
  FileText,
  Users2,
  Lock,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
  BookOpen,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { checkAccess } from '../ai/security/accessControl';
import { globalLegalKnowledgeExpansion, GlobalJurisdictionProfile, InternationalTreatyRecord } from '../network/globalLegalKnowledgeExpansion';
import { externalLegalDataConnectors, GazetteConnector, RegulatoryFeedItem } from '../network/externalLegalDataConnectors';
import { autonomousLegalWorkflowEngine, AutonomousWorkflowInstance, WorkflowTriggerType } from '../network/autonomousLegalWorkflow';
import { enterpriseCopilotBridge, CopilotOptimizationResponse } from '../network/enterpriseCopilotBridge';
import { globalPartnerNetwork, VerifiedLegalPartner } from '../network/globalPartnerNetwork';
import type { UserTier } from '../ai/types';
import SEO from '../components/SEO';

type CommandCenterTab = 'workflows' | 'gazette' | 'copilot' | 'partners' | 'treaties';

export default function EnterpriseCommandCenterPage() {
  const { lang, isRtl } = usePlatformLocale();
  const isAr = lang === 'ar';
  const { isAdmin, isLawyer } = useAuth();
  const { tier: subTierName } = useSubscription();

  const userTier: UserTier = useMemo(() => {
    if (isAdmin) return 'admin';
    if (isLawyer) return 'lawyer';
    if (subTierName === 'Enterprise') return 'enterprise';
    if (subTierName === 'Pro') return 'pro';
    if (subTierName === 'SMEs') return 'sme';
    if (subTierName === 'Startup') return 'startup';
    return 'free';
  }, [isAdmin, isLawyer, subTierName]);

  const access = checkAccess('enterprise_command_center_v2', userTier);

  const [activeTab, setActiveTab] = useState<CommandCenterTab>('workflows');

  // Workflows state
  const [workflows, setWorkflows] = useState<AutonomousWorkflowInstance[]>(() =>
    autonomousLegalWorkflowEngine.listWorkflows()
  );
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>('CONTRACT_INGESTED');
  const [matterTitle, setMatterTitle] = useState('Cross-Border Technology Licensing Agreement ($320,000 USD)');

  // Gazette state
  const [gazetteConnectors] = useState<GazetteConnector[]>(() =>
    externalLegalDataConnectors.listConnectors()
  );
  const [feedItems] = useState<RegulatoryFeedItem[]>(() =>
    externalLegalDataConnectors.getLatestFeed(10)
  );

  // Copilot Bridge State
  const [copilotSnippet, setCopilotSnippet] = useState(
    'Vendor aggregate liability shall be unlimited for breach of SLA.'
  );
  const [copilotResponse, setCopilotResponse] = useState<CopilotOptimizationResponse | null>(() =>
    enterpriseCopilotBridge.optimizeClause({
      clientApp: 'MS_WORD',
      organizationId: 'org_enterprise_demo_01',
      clauseSnippet: 'Vendor aggregate liability shall be unlimited for breach of SLA.',
      clauseType: 'Limitation of Liability',
      jurisdiction: 'SA',
    })
  );

  // Partners state
  const [partners] = useState<VerifiedLegalPartner[]>(() =>
    globalPartnerNetwork.listPartners()
  );

  // Treaties state
  const [jurisdictions] = useState<GlobalJurisdictionProfile[]>(() =>
    globalLegalKnowledgeExpansion.listAllJurisdictions()
  );
  const [treaties] = useState<InternationalTreatyRecord[]>(() =>
    globalLegalKnowledgeExpansion.listTreaties()
  );

  const handleLaunchWorkflow = () => {
    const inst = autonomousLegalWorkflowEngine.triggerWorkflow({
      triggerType,
      organizationId: 'org_enterprise_demo_01',
      matterTitle,
      matterValueUSD: 320000,
    });
    setWorkflows([inst, ...workflows]);
  };

  const handleOptimizeCopilot = () => {
    const res = enterpriseCopilotBridge.optimizeClause({
      clientApp: 'MS_WORD',
      organizationId: 'org_enterprise_demo_01',
      clauseSnippet: copilotSnippet,
      clauseType: 'Limitation of Liability',
      jurisdiction: 'SA',
    });
    setCopilotResponse(res);
  };

  if (!access.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <SEO title={isAr ? 'وصول مقيد | مركز القيادة 2.0' : 'Access Restricted | Command Center 2.0'} noIndex={true} />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isAr ? 'مركز القيادة والعمليات القانونية مقيد' : 'Enterprise Command Center Restricted'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'مركز القيادة والعمليات القانونية الذاتية مخصص حصرياً للمسؤولين المعتمدين والمشرفين القانونيين.'
              : 'The Autonomous Legal Operations Command Center 2.0 is strictly restricted to certified enterprise administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={isAr ? 'مركز قيادة العمليات القانونية الذاتية 2.0 | JurisTech' : 'Enterprise AI Command Center 2.0 | JurisTech'}
        noIndex={true}
      />

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز القيادة والعمليات القانونية الذاتية 2.0' : 'Enterprise AI Command Center 2.0'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'مراقبة مسارات التدقيق الذاتية، ومزامنة الجرائد الرسمية، وتوجيه إحالات الشركاء، ومساعد الصياغة المؤسسي Word/Docs.'
              : 'Autonomous workflows, real-time legislative gazette monitoring, Copilot bridge, partner dispatch, and global treaties.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? 'المنظومة متصلة بنسبة 100%' : 'Autonomous Engine Live'}
          </span>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'workflows' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          {isAr ? 'مسارات العمل الذاتية (Workflows)' : 'Autonomous Workflows'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gazette')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'gazette' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          {isAr ? 'بث الجرائد الرسمية المباشر' : 'Official Gazette Stream'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('copilot')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'copilot' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {isAr ? 'جسر Word/Docs Copilot' : 'Enterprise Copilot Bridge'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'partners' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          {isAr ? 'شبكة مكاتب المحاماة العالمية' : 'Global Law Firm Network'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('treaties')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'treaties' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          {isAr ? 'دليل الولايات والاتفاقيات (50+)' : 'Global Treaties & 50+ Jurisdictions'}
        </button>
      </div>

      {/* ── TAB 1: AUTONOMOUS WORKFLOWS ── */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {isAr ? 'إطلاق مسار تدقيق وتفاوض تعاقدي ذاتي' : 'Trigger Autonomous Legal Workflow Pipeline'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'نوع المشغل' : 'Event Trigger'}</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as WorkflowTriggerType)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="CONTRACT_INGESTED">CONTRACT_INGESTED</option>
                  <option value="HIGH_VALUE_THRESHOLD_EXCEEDED">HIGH_VALUE_THRESHOLD_EXCEEDED</option>
                  <option value="REGULATORY_CHANGE_DETECTED">REGULATORY_CHANGE_DETECTED</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'عنوان المعاملة / العقد' : 'Matter Title'}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={matterTitle}
                    onChange={(e) => setMatterTitle(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleLaunchWorkflow}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {isAr ? 'تشغيل' : 'Launch'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{isAr ? 'طابور المسارات النشطة وبوابات الاعتماد البشري' : 'Active Autonomous Pipelines & Human Approval Gates'}</span>
              <span className="text-xs text-slate-400 font-mono">{workflows.length} Active Instances</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workflows.map((wf) => (
                <div key={wf.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {wf.triggerType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      wf.status === 'PENDING_HUMAN_APPROVAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {wf.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{wf.matterTitle}</h4>
                    <p className="text-slate-400 text-[11px] font-mono">ID: {wf.id}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-300 block text-[11px]">{isAr ? 'ملخص التعديلات المقترحة (Redline):' : 'Proposed Redline Action:'}</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {isAr ? wf.syntheticRedlineSummaryAr : wf.syntheticRedlineSummaryEn}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                      {isAr ? 'خطوات التنفيذ الآلية:' : 'Autonomous Execution Pipeline:'}
                    </span>
                    {wf.stepsExecuted.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          {st.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          {st.stepName}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">{st.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GAZETTE FEED ── */}
      {activeTab === 'gazette' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              {isAr ? 'موصلات الجرائد الرسمية المعتمدة' : 'Official Gazette Connectors'}
            </h2>

            <div className="space-y-2.5">
              {gazetteConnectors.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{isAr ? c.sourceNameAr : c.sourceNameEn}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px]">{c.authorityProvenance}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              {isAr ? 'أحدث التشريعات والقرارات الرسمية المنشورة' : 'Latest Gazette Publications & Decrees'}
            </h2>

            <div className="space-y-3">
              {feedItems.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                      {item.statutoryCategory}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{item.publicationDate} • {item.issueNumber}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{isAr ? item.titleAr : item.titleEn}</h3>
                  <p className="text-slate-300 leading-relaxed">{isAr ? item.summaryAr : item.summaryEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: COPILOT BRIDGE ── */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              {isAr ? 'اختبار مساعد الصياغة في Word و Google Docs' : 'Live Copilot Bridge Simulator'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="font-medium text-slate-400 block mb-1">{isAr ? 'النص التعاقدي المراد تحسينه في المحرر:' : 'Draft Clause Snippet in Word/Docs:'}</label>
                <textarea
                  rows={4}
                  value={copilotSnippet}
                  onChange={(e) => setCopilotSnippet(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleOptimizeCopilot}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-lg shadow-amber-600/20"
              >
                {isAr ? 'تحسين البند ومطابقة المعايير النظامية' : 'Optimize Clause via Copilot Bridge'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                {isAr ? 'استجابة المساعد الذكي في الوقت الفعلي' : 'Real-Time Copilot Response'}
              </span>
              {copilotResponse && (
                <span className="font-mono text-[10px] text-emerald-400">Latency: {copilotResponse.latencyMs}ms</span>
              )}
            </h2>

            {copilotResponse && (
              <div className="space-y-3.5">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300 block">{isAr ? 'البند المقترح بعد التحسين والتعديل:' : 'Suggested Redline Clause:'}</span>
                  <p className="text-slate-200 font-serif leading-relaxed italic">
                    &ldquo;{isAr ? copilotResponse.optimizedClauseAr : copilotResponse.optimizedClauseEn}&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-300 block text-[11px]">{isAr ? 'المخاطر التعاقدية المرصودة:' : 'Detected Risks & Ambiguities:'}</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                    {copilotResponse.detectedIssues.map((iss, i) => (
                      <li key={i}>{iss}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: PARTNERS NETWORK ── */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users2 className="w-4 h-4 text-emerald-400" />
              {isAr ? 'شبكة مكاتب المحاماة والشركاء المعتمدين دولياً' : 'Verified Global Law Firm Alliance'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">{partners.length} Tier 1 Firms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((p) => (
              <div key={p.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{isAr ? p.firmNameAr : p.firmNameEn}</h3>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {p.partnerTier}
                  </span>
                </div>

                <p className="text-slate-400 text-[11px]">{p.headquartersCity}</p>

                <div className="space-y-1">
                  <span className="font-bold text-slate-300 text-[11px] block">{isAr ? 'مجالات التخصص المعتمدة:' : 'Practice Areas:'}</span>
                  <div className="flex flex-wrap gap-1">
                    {p.practiceAreas.map((area) => (
                      <span key={area} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-mono">Response SLA: ~{p.averageResponseHours}h</span>
                  <span className="text-emerald-400 font-bold font-mono">Conflict Status: {p.conflictCheckStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: TREATIES & JURISDICTIONS ── */}
      {activeTab === 'treaties' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              {isAr ? 'الولايات القضائية المشمولة في المنظومة (50+ ولاية)' : 'Covered Global Jurisdictions'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {jurisdictions.map((j) => (
                <div key={j.code} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{isAr ? j.nameAr : j.nameEn}</span>
                    <span className="font-mono text-[10px] font-bold text-cyan-400">{j.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{j.primaryCommercialCode}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Enforceability Index: {j.enforceabilityIndex}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              {isAr ? 'المعاهدات والاتفاقيات التجارية الدولية المعتمدة' : 'Multilateral Commercial Treaties'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treaties.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{t.abbreviation}</span>
                    <span className="font-mono text-[10px] text-slate-500">{t.adoptionYear} • {t.signatoryCount} States</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{isAr ? t.coreObjectiveAr : t.coreObjectiveEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
