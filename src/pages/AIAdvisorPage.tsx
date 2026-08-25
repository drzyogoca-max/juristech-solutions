/**
 * src/pages/AIAdvisorPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Unified AI Legal Advisor Production Interface
 * Specification: JURISTECH-AI-P0 (Task 6)
 *
 * Master Unified Legal AI interface supporting:
 *  1. Smart Auto Intent Routing
 *  2. Statutory Legal Research & Citation Grounding
 *  3. Deep 8-Axis Contract Risk Forensics
 *  4. Regulatory Compliance & Governance Audits (PDPL, GDPR, ZATCA)
 *  5. Document Intelligence & Typology Classification
 *  6. Structured Legal Document Drafting (6 Templates with Human-Review Tags)
 *  7. Enterprise Cross-Border Comparative Advisory & Task Planning
 */

import React, { useState, useRef, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import {
  Send,
  Loader2,
  Trash2,
  Sparkles,
  Upload,
  RefreshCw,
  AlertCircle,
  FileText,
  Shield,
  HelpCircle,
  Paperclip,
} from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { useAuth } from '../lib/authContext';
import { useSubscription } from '../hooks/useSubscription';
import SEO from '../components/SEO';

// UI Subcomponents
import { AIAdvisorHeader } from '../components/ai-advisor/AIAdvisorHeader';
import { AITaskSelector, SelectedTaskMode } from '../components/ai-advisor/AITaskSelector';
import { JurisdictionSelector } from '../components/ai-advisor/JurisdictionSelector';
import { AILoadingProgress } from '../components/ai-advisor/AILoadingProgress';
import { AIResponseCard } from '../components/ai-advisor/AIResponseCard';
import { AccessUpgradeModal } from '../components/ai-advisor/AccessUpgradeModal';

// AI Intelligence Subsystem Core & Agents
import { aiOrchestrator } from '../ai/aiCore/orchestrator';
import { contextManager } from '../ai/aiCore/contextManager';
import { LegalResearchAgent } from '../ai/agents/legalResearchAgent';
import { ContractAgent } from '../ai/agents/contractAgent';
import { ComplianceAgent } from '../ai/agents/complianceAgent';
import { DocumentAgent } from '../ai/agents/documentAgent';
import { EnterpriseAgent } from '../ai/agents/enterpriseAgent';
import { DocumentGenerator } from '../ai/generation/documentGenerator';
import { LegalDomainSelector } from '../components/ai-advisor/LegalDomainSelector';
import { aiAnalytics } from '../analytics/aiAnalytics';
import { aiQualityMonitor } from '../ai/monitoring/aiQualityMonitor';
import { conversionTracker } from '../growth/conversionTracker';
import type {
  Citation,
  ComplianceAssessmentResult,
  EnterpriseExecutionResult,
  GeneratedLegalDocument,
  JurisdictionCode,
  LegalDomain,
  SourceVerificationStatus,
  StructuredContractReport,
  StructuredDocumentAnalysis,
  SupportedAILang,
  UserTier,
} from '../ai/types';

// Lazy-Loaded Specialized Workspaces
const ContractWorkspace = lazy(() =>
  import('../components/ai-advisor/ContractWorkspace').then((m) => ({ default: m.ContractWorkspace }))
);
const ComplianceWorkspace = lazy(() =>
  import('../components/ai-advisor/ComplianceWorkspace').then((m) => ({ default: m.ComplianceWorkspace }))
);
const DocumentAnalysisWorkspace = lazy(() =>
  import('../components/ai-advisor/DocumentAnalysisWorkspace').then((m) => ({ default: m.DocumentAnalysisWorkspace }))
);
const DocumentGenerationWorkspace = lazy(() =>
  import('../components/ai-advisor/DocumentGenerationWorkspace').then((m) => ({ default: m.DocumentGenerationWorkspace }))
);
const EnterpriseWorkspace = lazy(() =>
  import('../components/ai-advisor/EnterpriseWorkspace').then((m) => ({ default: m.EnterpriseWorkspace }))
);

interface ChatItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  taskMode: SelectedTaskMode;
  confidenceScore?: number;
  sourceVerificationStatus?: SourceVerificationStatus;
  jurisdiction?: JurisdictionCode;
  citations?: Citation[];
  clarificationRequired?: boolean;
  clarificationPrompt?: string;
  contractReport?: StructuredContractReport;
  complianceAssessment?: ComplianceAssessmentResult;
  documentAnalysis?: StructuredDocumentAnalysis;
  generatedDocument?: GeneratedLegalDocument;
  enterpriseResult?: EnterpriseExecutionResult;
}

export default function AIAdvisorPage() {
  const { lang, isRtl } = usePlatformLocale();
  const isAr = lang === 'ar';
  const { isAdmin, isLawyer } = useAuth();
  const { tier: subTierName, isSubscriber, subscribeWithPaddle } = useSubscription();

  // Map user tier (memoized)
  const userTier: UserTier = useMemo(() => {
    if (isAdmin) return 'admin';
    if (isLawyer) return 'lawyer';
    if (subTierName === 'Enterprise') return 'enterprise';
    if (subTierName === 'Pro') return 'pro';
    if (subTierName === 'SMEs') return 'sme';
    if (subTierName === 'Startup') return 'startup';
    return 'free';
  }, [isAdmin, isLawyer, subTierName]);

  // State
  const [taskMode, setTaskMode] = useState<SelectedTaskMode>('AUTO');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>('UNKNOWN');
  const [selectedDomain, setSelectedDomain] = useState<LegalDomain>('general');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [requiredTierForModal, setRequiredTierForModal] = useState<UserTier>('startup');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversionTracker.trackStage('AI_STARTED', { currentTier: userTier });
  }, [userTier]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClearSession = useCallback(() => {
    contextManager.clear();
    setMessages([]);
  }, []);

  const handleUpgradeClick = useCallback((feature = 'Advanced Legal Intelligence', minTier: UserTier = 'startup') => {
    setUpgradeFeature(feature);
    setRequiredTierForModal(minTier);
    setUpgradeModalOpen(true);
    conversionTracker.trackStage('UPGRADE_VIEWED', { currentTier: userTier, targetTier: minTier, featureContext: feature });
  }, [userTier]);

  const handleSendMessage = async (overridePrompt?: string) => {
    const query = (overridePrompt || inputQuery).trim();
    if (!query || isLoading) return;

    setInputQuery('');
    const userMsgId = `usr-${Date.now()}`;
    const newMessages: ChatItem[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        timestamp: new Date().toISOString(),
        taskMode,
      },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // ── Dispatch According to Selected Task Mode ──
      const targetJur = jurisdiction !== 'UNKNOWN' ? jurisdiction : undefined;
      const targetLang: SupportedAILang = (['ar', 'en', 'fr', 'es', 'de', 'tr', 'zh'].includes(lang) ? lang : 'en') as SupportedAILang;

      if (taskMode === 'CONTRACT_ANALYSIS') {
        const audit = await ContractAgent.executeStructuredContractAudit(query, {
          forceJurisdiction: targetJur,
          lang: targetLang,
          userTier,
        });

        if (audit.overallScore === 0 && audit.executiveSummary.includes('🔒')) {
          handleUpgradeClick('Contract Intelligence (8-Axis)', 'startup');
        }

        setMessages([
          ...newMessages,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: audit.executiveSummary,
            timestamp: new Date().toISOString(),
            taskMode: 'CONTRACT_ANALYSIS',
            confidenceScore: audit.confidenceScore,
            sourceVerificationStatus: audit.sourceVerificationStatus,
            jurisdiction: audit.jurisdiction,
            citations: audit.citations,
            contractReport: audit,
          },
        ]);
      } else if (taskMode === 'COMPLIANCE') {
        const comp = await ComplianceAgent.assessCompliance(query, {
          forceJurisdiction: targetJur,
          lang: targetLang,
          userTier,
        });

        if (comp.confidenceScore === 0 && comp.riskLevel === 'HIGH') {
          handleUpgradeClick('Regulatory Compliance Audits', 'sme');
        }

        setMessages([
          ...newMessages,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: isAr
              ? `تم الانتهاء من فحص الامتثال التنظيمي للولاية (${comp.jurisdiction}).`
              : `Regulatory compliance audit completed for jurisdiction (${comp.jurisdiction}).`,
            timestamp: new Date().toISOString(),
            taskMode: 'COMPLIANCE',
            confidenceScore: comp.confidenceScore,
            sourceVerificationStatus: comp.sourceVerificationStatus,
            jurisdiction: comp.jurisdiction,
            citations: comp.verifiedSources,
            clarificationRequired: comp.jurisdictionSafetyStatus === 'JURISDICTION_REQUIRED',
            clarificationPrompt: comp.clarificationPrompt,
            complianceAssessment: comp,
          },
        ]);
      } else if (taskMode === 'DOCUMENT_ANALYSIS') {
        const docAnalysis = await DocumentAgent.analyzeDocument(query, {
          forceJurisdiction: targetJur,
          lang: targetLang,
          userTier,
        });

        if (docAnalysis.confidenceScore === 0) {
          handleUpgradeClick('Document Intelligence', 'startup');
        }

        setMessages([
          ...newMessages,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: docAnalysis.executiveSummary,
            timestamp: new Date().toISOString(),
            taskMode: 'DOCUMENT_ANALYSIS',
            confidenceScore: docAnalysis.confidenceScore,
            sourceVerificationStatus: docAnalysis.sourceVerificationStatus,
            jurisdiction: docAnalysis.jurisdiction,
            citations: docAnalysis.citations,
            documentAnalysis: docAnalysis,
          },
        ]);
      } else if (taskMode === 'DOCUMENT_GENERATION') {
        const gen = await DocumentGenerator.generateLegalDraft({
          documentTitle: 'Client Legal Draft',
          templateType: query.toLowerCase().includes('contract')
            ? 'Contract Draft'
            : query.toLowerCase().includes('notice')
            ? 'Legal Notice'
            : query.toLowerCase().includes('policy')
            ? 'Policy Draft'
            : 'Legal Memorandum',
          jurisdiction: targetJur,
          keyTerms: [query],
          lang: targetLang,
          userTier,
        });

        if (gen.confidenceScore === 0) {
          handleUpgradeClick('Legal Document Generator', 'startup');
        }

        setMessages([
          ...newMessages,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: gen.content,
            timestamp: new Date().toISOString(),
            taskMode: 'DOCUMENT_GENERATION',
            confidenceScore: gen.confidenceScore,
            sourceVerificationStatus: gen.sourceVerificationStatus,
            jurisdiction: gen.jurisdiction,
            citations: gen.citations,
            generatedDocument: gen,
          },
        ]);
      } else if (taskMode === 'ENTERPRISE_AI') {
        const ent = await EnterpriseAgent.executeEnterpriseTask(query, {
          forceJurisdiction: targetJur,
          lang: targetLang,
          userTier,
        });

        if (ent.confidenceScore === 0) {
          handleUpgradeClick('Enterprise Multi-Jurisdiction AI', 'enterprise');
        }

        setMessages([
          ...newMessages,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: ent.executiveSummary,
            timestamp: new Date().toISOString(),
            taskMode: 'ENTERPRISE_AI',
            confidenceScore: ent.confidenceScore,
            sourceVerificationStatus: ent.sourceVerificationStatus,
            jurisdiction: ent.jurisdiction,
            citations: ent.verifiedCitations,
            enterpriseResult: ent,
          },
        ]);
      } else if (taskMode === 'AUTO' || taskMode === 'LEGAL_RESEARCH') {
        // AUTO or LEGAL_RESEARCH
        const advisor = await aiOrchestrator.executeLegalAdvisory({
          query,
          forceJurisdiction: targetJur,
          forceDomain: selectedDomain !== 'general' ? selectedDomain : undefined,
          lang: targetLang,
          userTier,
        });

        setMessages([
          ...newMessages,
          {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: advisor.legalAnalysis,
            timestamp: new Date().toISOString(),
            taskMode: 'LEGAL_RESEARCH',
            confidenceScore: advisor.confidenceScore,
            sourceVerificationStatus: advisor.sourceVerificationStatus,
            jurisdiction: advisor.jurisdiction,
            citations: advisor.sources,
            clarificationRequired: advisor.clarificationRequired,
            clarificationPrompt: advisor.clarificationPrompt,
          },
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: isAr
            ? '⚠️ تعذر إتمام المعالجة الذكية حالياً. يرجى التحقق من اتصال الشبكة أو إعادة المحاولة.'
            : '⚠️ Processing could not be completed. Please check your connection or retry.',
          timestamp: new Date().toISOString(),
          taskMode: 'AUTO',
          sourceVerificationStatus: 'INSUFFICIENT',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={isAr ? 'المستشار القانوني الذكي الموحد | JurisTech' : 'Unified AI Legal Advisor | JurisTech'}
        description="Institutional-grade AI legal advisory, statutory research, contract risk forensics, and document drafting across 15 jurisdictions."
        noIndex={true}
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Header */}
        <AIAdvisorHeader
          lang={lang as SupportedAILang}
          isRtl={isRtl}
          userTier={userTier}
          onUpgradeClick={() => handleUpgradeClick('All AI Features', 'startup')}
        />

        {/* Task & Jurisdiction Controls Bar */}
        <div className="w-full bg-slate-900/40 border-b border-slate-800 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <AITaskSelector
              selectedMode={taskMode}
              onSelectMode={setTaskMode}
              lang={lang as SupportedAILang}
            />

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0">
              {(taskMode === 'AUTO' || taskMode === 'LEGAL_RESEARCH') && (
                <LegalDomainSelector
                  selectedDomain={selectedDomain}
                  onSelectDomain={setSelectedDomain}
                  lang={lang as SupportedAILang}
                />
              )}

              <JurisdictionSelector
                selectedJurisdiction={jurisdiction}
                onSelectJurisdiction={setJurisdiction}
                lang={lang as SupportedAILang}
              />

              {messages.length > 0 && (
                <button
                  onClick={handleClearSession}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-all cursor-pointer text-xs flex items-center gap-1.5"
                  title={isAr ? 'بدء محادثة جديدة' : 'New Session'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'جلسة جديدة' : 'New'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Conversation & Workspace Container */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between space-y-6">
          {messages.length === 0 ? (
            /* Empty State Hero */
            <div className="my-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-500/10">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {isAr ? 'كيف يمكن لـ Juris مساعدتك اليوم؟' : 'How can Juris assist your legal matter today?'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {isAr
                    ? 'اختر وضع المعالجة أو اكتب استفسارك مباشرة لتفعيل التوجيه الذكي عبر نصوص الأنظمة واللوائح الموثقة في 15 دولة.'
                    : 'Select a task mode or type your inquiry directly. The AI will route to specialist agents grounded in statutory codes across 15 jurisdictions.'}
                </p>
              </div>

              {/* Quick Prompt Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-xs text-start">
                <button
                  onClick={() => {
                    setTaskMode('LEGAL_RESEARCH');
                    setJurisdiction('SA');
                    handleSendMessage('ما هي ضوابط الشرط الجزائي والتعويض الاتفاقي في نظام المعاملات المدنية السعودي؟');
                  }}
                  className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl transition-all space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-cyan-300 block">🇸🇦 {isAr ? 'بحث نظامي سعودي' : 'Saudi Civil Law'}</span>
                  <span className="text-slate-400 text-[11px] line-clamp-2">
                    {isAr ? 'ضوابط الشرط الجزائي والتعويض الاتفاقي في المعاملات المدنية' : 'Liquidated damages under KSA Civil Transactions Law'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setTaskMode('CONTRACT_ANALYSIS');
                    handleSendMessage('راجع بند المسؤولية المالية التالي: "لا يتحمل المورد أي مسؤولية عن الأضرار التبعية أو خسارة الأرباح بدون سقف مالي محدد".');
                  }}
                  className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl transition-all space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-cyan-300 block">⚖️ {isAr ? 'تدقيق عقد ومسؤولية' : 'Contract Liability Audit'}</span>
                  <span className="text-slate-400 text-[11px] line-clamp-2">
                    {isAr ? 'فحص سقف المسؤولية التعاقدية والأضرار التبعية' : 'Evaluate aggregate liability cap and indirect damages'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setTaskMode('COMPLIANCE');
                    setJurisdiction('SA');
                    handleSendMessage('ما هي التزامات حماية البيانات الشخصية وفق نظام PDPL السعودي؟');
                  }}
                  className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl transition-all space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-cyan-300 block">🛡️ {isAr ? 'امتثال وحماية بيانات' : 'PDPL / GDPR Audit'}</span>
                  <span className="text-slate-400 text-[11px] line-clamp-2">
                    {isAr ? 'متطلبات الامتثال لنظام حماية البيانات الشخصية PDPL' : 'Personal Data Protection Law regulatory baseline'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Conversation Stream */
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {msg.sender === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl max-w-2xl shadow-md">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Standard Advisory Response Card */}
                      <AIResponseCard
                        content={msg.text}
                        confidenceScore={msg.confidenceScore}
                        sourceVerificationStatus={msg.sourceVerificationStatus}
                        jurisdiction={msg.jurisdiction}
                        citations={msg.citations}
                        clarificationRequired={msg.clarificationRequired}
                        clarificationPrompt={msg.clarificationPrompt}
                        taskMode={msg.taskMode || taskMode}
                        lang={lang as SupportedAILang}
                        isRtl={isRtl}
                      />

                      {/* Specialized Interactive Workspaces */}
                      <Suspense fallback={<div className="p-4 text-center text-xs text-slate-400">Loading Workspace...</div>}>
                        {msg.contractReport && (
                          <ContractWorkspace report={msg.contractReport} lang={lang as SupportedAILang} isRtl={isRtl} />
                        )}
                        {msg.complianceAssessment && (
                          <ComplianceWorkspace assessment={msg.complianceAssessment} lang={lang as SupportedAILang} isRtl={isRtl} />
                        )}
                        {msg.documentAnalysis && (
                          <DocumentAnalysisWorkspace analysis={msg.documentAnalysis} lang={lang as SupportedAILang} isRtl={isRtl} />
                        )}
                        {msg.generatedDocument && (
                          <DocumentGenerationWorkspace document={msg.generatedDocument} lang={lang as SupportedAILang} isRtl={isRtl} />
                        )}
                        {msg.enterpriseResult && (
                          <EnterpriseWorkspace result={msg.enterpriseResult} lang={lang as SupportedAILang} isRtl={isRtl} />
                        )}
                      </Suspense>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="py-4">
                  <AILoadingProgress lang={lang as SupportedAILang} taskMode={taskMode} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ── Input Box & Action Bar ── */}
          <div className="sticky bottom-4 z-20">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-3 shadow-2xl backdrop-blur-xl focus-within:border-cyan-500/60 transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'اطرح استفسارك القانوني، أو الصق بنداً تعاقدياً، أو اطلب صياغة مسودة...'
                      : 'Ask a legal question, paste a contract clause, or request a document draft...'
                  }
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shrink-0 shadow-md shadow-cyan-500/20"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />}
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* ── Upgrade Modal ── */}
        <AccessUpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          requiredTier={requiredTierForModal}
          featureName={upgradeFeature}
          onUpgrade={(planKey) => subscribeWithPaddle(planKey)}
          lang={lang as SupportedAILang}
          isRtl={isRtl}
        />
      </div>
    </>
  );
}
