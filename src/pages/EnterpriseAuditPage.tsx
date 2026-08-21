import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, Upload, FileText, Loader2, DollarSign, Download, CheckCircle2,
  Building2, Zap, AlertTriangle, Globe, X, Lock, Landmark, Sparkles
} from 'lucide-react';
import { callAI } from '../lib/api';
import { exportLegalContractPDF } from '../lib/pdfExporter';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { dispatchReceiptEmail } from '../lib/emailNotifier';
import { extractPDFTextMultiStage, detectDocumentLanguage } from '../lib/pdfExtractor';
import BankWireModal from '../components/BankWireModal';
import VoiceInput from '../components/VoiceInput';
import AdSponsorBanner from '../components/AdSponsorBanner';

import { runSelfHealingMAAudit, EnterpriseAuditResult } from '../lib/ragEnterpriseAgent';
import { erpIntegrationService, ERPConfig } from '../lib/erpIntegrationService';
import SEO from '../components/SEO';

export default function EnterpriseAuditPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditTier, setAuditTier] = useState<500 | 1200 | 2000>(1200);
  const [result, setResult] = useState<EnterpriseAuditResult | null>(null);
  const [showWireModal, setShowWireModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setFileName(file.name);

    try {
      const extraction = await extractPDFTextMultiStage(file, (msg) => {
        setExtractionStatus(msg);
      });
      setContractText(extraction.text);
    } catch (err) {
      console.error('M&A extraction error:', err);
    } finally {
      setExtracting(false);
      setExtractionStatus('');
    }
    e.target.value = '';
  }

  async function runEnterpriseAudit() {
    if (!contractText.trim() && !fileName) return;
    setLoading(true);

    const docLang = detectDocumentLanguage(contractText || fileName);
    const isDocArabic = docLang === 'ar' || /[\u0600-\u06FF]/.test(contractText || fileName);

    const prompt = `Running RAG Self-Healing Engine...`; // We don't need this anymore since we moved it, but let's keep it clean
    try {
      const parsed = await runSelfHealingMAAudit(contractText || fileName, isDocArabic, auditTier);
      setResult(parsed);

      // Dispatch audit notification
      await dispatchReceiptEmail({
        clientEmail: 'enterprise-client@juristech.solutions',
        clientRef: `Enterprise M&A Audit ($${auditTier})`,
        transactionId: `MA-AUDIT-${Date.now()}`,
        planName: `High-Ticket M&A & Enterprise Audit ($${auditTier})`,
        amount: auditTier,
        receiptUrl: 'https://juristech.solutions/sponsors-ads',
        timestamp: new Date().toISOString(),
      });

    } catch (err) {
      console.error('Enterprise Audit error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setFileName('');
    setContractText('');
    setResult(null);
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      {showWireModal && (
        <BankWireModal
          isOpen={showWireModal}
          onClose={() => setShowWireModal(false)}
          packageName={`Enterprise M&A Audit ($${auditTier})`}
          packagePrice={auditTier}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'محرك فحص صفقات M&A والشركات الكبرى' : 'High-Ticket M&A & Enterprise Instant Audit Engine'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {isRtl ? 'تدقيق عقود الاستحواذ والشراكات الضخمة' : 'Enterprise M&A & Partnership Contract Audit'}
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
            {isRtl
              ? 'احصل على تقرير فحص قانوني شامل لمجلس الإدارة خلال ثوانٍ مع حساب التعرض للمسئولية والحلول الوقائية'
              : 'Get C-suite ready legal audit reports for high-value corporate deals with liability calculation and preventive redlines'}
          </p>
        </div>

        {/* Audit Tier Selection Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              tier: 500,
              title: isRtl ? 'تدقيق العقود المتوسطة' : 'Medium Contract Audit',
              price: '$500',
              desc: isRtl ? 'عقود الشراكة والخدمات حتى $1M' : 'Partnership & Service Agreements up to $1M',
            },
            {
              tier: 1200,
              title: isRtl ? 'تدقيق الاستحواذ M&A' : 'M&A Acquisition Audit',
              price: '$1,200',
              desc: isRtl ? 'صفقات الدمج والاستحواذ الضخمة' : 'High-Ticket Mergers & Acquisitions Deals',
            },
            {
              tier: 2000,
              title: isRtl ? 'تدقيق المجموعات القابضة' : 'Holding Groups Audit',
              price: '$2,000',
              desc: isRtl ? 'الشركات العابرة للحدود والقابضة' : 'Cross-Border Holding Conglomerates',
            },
          ].map(({ tier, title, price, desc }) => (
            <button
              key={tier}
              onClick={() => setAuditTier(tier as any)}
              className={`p-5 rounded-3xl border text-right transition-all flex flex-col justify-between relative overflow-hidden group ${
                auditTier === tier
                  ? 'bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-900 border-amber-500 text-amber-400 shadow-2xl shadow-amber-950/40 scale-102'
                  : 'bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:border-slate-700 hover:bg-white dark:bg-slate-900'
              }`}
            >
              {auditTier === tier && (
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {isRtl ? 'الباقة المحددة' : 'Active Tier'}
                </span>
              )}
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white block font-mono">{price}</span>
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-1 block">{title}</span>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-4 block">{desc}</span>
            </button>
          ))}
        </div>

        {/* Upload & Form Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          {fileName ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/40">
              <div className="flex items-center gap-3 truncate">
                <FileText className="w-6 h-6 text-amber-400 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{fileName}</span>
              </div>
              <button onClick={handleClear} className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-400 hover:bg-slate-100 dark:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={extracting}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500/60 rounded-3xl p-8 flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-all bg-slate-950/40 group"
            >
              {extracting ? (
                <Loader2 className="w-9 h-9 animate-spin text-amber-400" />
              ) : (
                <Upload className="w-9 h-9 text-amber-400 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-black text-sm text-center">
                {extracting
                  ? extractionStatus || (isRtl ? 'جاري قراءة واستخراج نص العقد بالذكاء الاصطناعي...' : 'Extracting contract text...')
                  : isRtl ? 'رفع عقد الاستحواذ / الشراكة الكبيرة (.pdf, .docx)' : 'Upload M&A or Enterprise Contract (.pdf, .docx)'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? 'تشفير تام وحماية سرية SSL 256-Bit' : '100% Confidential & Encrypted (256-Bit SSL)'}</span>
              </span>
            </button>
          )}

          <div className="relative">
            <textarea
              placeholder={isRtl ? 'أو الصق بنود العقد هنا...' : 'Or paste high-ticket contract clauses here...'}
              value={contractText}
              onChange={(e) => {
                setContractText(e.target.value);
                if (!e.target.value) setFileName('');
              }}
              rows={6}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono leading-relaxed pr-10"
            />
            <div className="absolute top-3 right-3">
              <VoiceInput onTranscript={(text) => setContractText((prev) => prev + ' ' + text)} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={runEnterpriseAudit}
              disabled={loading || extracting || (!contractText.trim() && !fileName)}
              className="flex-1 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-90 disabled:opacity-40 font-black text-slate-950 text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-950" /> : <Zap className="w-6 h-6 text-slate-950" />}
              <span>
                {loading
                  ? (isRtl ? 'جاري الفحص المالي والقانوني التخصصي...' : 'Executing Enterprise Audit...')
                  : (isRtl ? `بدء الفحص القانوني الفوري مقابل ($${auditTier})` : `Run Enterprise Audit ($${auditTier})`)}
              </span>
            </button>

            <button
              onClick={() => setShowWireModal(true)}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-300 dark:border-slate-700"
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'طلب فاتورة تحويل بنكي SWIFT' : 'Request SWIFT Pro-Forma Invoice'}</span>
            </button>
          </div>
        </div>

        {/* Audit Results Presentation */}
        {result && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                  {isRtl ? 'تقدير قيمة الصفقة الملاحظة' : 'Estimated Deal Value'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{result.dealValueEstimate}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-600 dark:text-slate-400 block font-bold">{isRtl ? 'نسبة المطابقة التشريعية' : 'M&A Compliance Score'}</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">{result.maComplianceScore}%</span>
                </div>
                <button
                  onClick={() => exportDocumentMultiFormat(result.executiveSummary, 'Enterprise_MA_Audit', 'Enterprise Client', 'JurisTech AI Audit', 'pdf', isRtl ? 'ar' : 'en')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>{isRtl ? 'تصدير التقرير التنفيذي PDF' : 'Export C-Suite Report PDF'}</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-red-500/30 space-y-3">
                <h3 className="font-extrabold text-red-400 flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isRtl ? 'المخاطر الهيكلية الرئيسية في الصفقة' : 'Key Structural Deal Risks'}</span>
                </h3>
                <ul className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                  {result.keyRisks.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
                <h3 className="font-extrabold text-emerald-400 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isRtl ? 'البنود الوقائية والتعديلات الموصى بها' : 'Recommended Mitigation Clauses'}</span>
                </h3>
                <ul className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                  {result.mitigationClauses.map((m, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? 'الملخص التنفيذي القانوني المخصص لمجلس الإدارة (C-Suite Boardroom Summary)' : 'Boardroom Executive Summary'}</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">{result.executiveSummary}</p>
            </div>

            {/* NEW: Autonomous Self-Healing AI Section */}
            {result.selfHealedClauses && result.selfHealedClauses.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-4 relative z-10">
                  <div className="p-2 rounded-xl bg-indigo-500/20">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-indigo-300 text-sm sm:text-base">
                      {isRtl ? 'نظام المعالجة الذاتية (Self-Healing AI Agent)' : 'Autonomous Self-Healing AI Agent'}
                    </h3>
                    <p className="text-xs text-indigo-400/70 font-mono mt-0.5">
                      {isRtl ? 'تمت إعادة صياغة البنود المعيبة تلقائياً وسد الثغرات.' : 'Structural flaws were detected and automatically re-drafted.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {result.selfHealedClauses.map((clause, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/20 space-y-4">
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                            {isRtl ? 'الثغرة المرصودة' : 'Detected Flaw'}
                          </span>
                          <p className="text-xs text-slate-300 font-mono">{clause.originalRisk}</p>
                        </div>

                        <div className="hidden sm:flex items-center justify-center px-4">
                          <div className="h-[1px] w-8 bg-gradient-to-r from-red-500/50 to-emerald-500/50 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex justify-between items-center">
                            <span>{isRtl ? 'البند الآمن المُعاد صياغته (جاهز للنسخ)' : 'Healed Clause (Ready to Use)'}</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                          <p className="text-xs text-emerald-50 dark:text-emerald-100 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20 font-mono leading-relaxed selection:bg-emerald-500/30">
                            {clause.healedText}
                          </p>
                        </div>
                      </div>

                      {clause.ragCitations && clause.ragCitations.length > 0 && (
                        <div className="pt-3 border-t border-indigo-500/10 flex flex-wrap gap-2">
                          <span className="text-[10px] text-indigo-400/60 font-bold uppercase mt-1">
                            {isRtl ? 'مرجعية الذكاء الاصطناعي:' : 'RAG Grounding:'}
                          </span>
                          {clause.ragCitations.map((cite, cIdx) => (
                            <span key={cIdx} className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-mono">
                              {cite}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Enterprise ERP & CLM System Integration Panel ─────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {isRtl ? 'التكامل البرمجي مع أنظمة إدارة المؤسسات (ERP & CLM Connectors)' : 'Enterprise ERP & Contract System Integration'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {isRtl
                  ? 'ربط مباشر عبر REST APIs و Webhooks مع أنظمة SAP, Odoo, Salesforce, Oracle للربط التلقائي وتدقيق العقود.'
                  : 'Direct REST API & Webhook integration with SAP, Odoo, Salesforce, and Oracle ERP systems for automated contract audit & dispatch.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'SAP', name: 'SAP S/4HANA & RFC', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
              { id: 'ODOO', name: 'Odoo ERP (JSON-RPC)', color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
              { id: 'SALESFORCE', name: 'Salesforce CRM & CLM', color: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400' },
              { id: 'ORACLE', name: 'Oracle ERP Cloud', color: 'border-red-500/30 bg-red-500/5 text-red-400' },
            ].map(({ id, name, color }) => {
              const config = erpIntegrationService.getERPConfigs().find((c) => c.systemType === id);
              const isConn = config?.isEnabled && config?.status === 'CONNECTED';
              return (
                <div key={id} className={`p-4 rounded-2xl border ${color} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-extrabold ${isConn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {isConn ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {config?.endpointUrl || 'Not configured'}
                  </p>
                  <button
                    onClick={() => {
                      erpIntegrationService.pingERPWebhook(id as any).then((res) => {
                        alert(isRtl ? `تم فحص الاتصال مع ${id}: استجابة ناجحة (${res.latencyMs}ms)` : `Ping ${id}: Success (${res.latencyMs}ms)`);
                      });
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700 transition-all flex items-center justify-center gap-1"
                  >
                    <span>{isRtl ? 'اختبار الـ Webhook' : 'Ping Connector'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

