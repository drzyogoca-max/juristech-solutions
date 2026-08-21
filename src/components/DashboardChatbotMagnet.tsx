import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Sparkles, Send, Upload, FileText, ArrowRight, CheckCircle2, Shield, Zap, Lock
} from 'lucide-react';
import { callAI } from '../lib/api';
import VoiceInput from './VoiceInput';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import { useContract } from '../context/ContractContext';
import { findFastSemanticMatch, recordAndLearnQuery } from '../lib/aiSelfLearningEngine';

interface DashboardChatbotMagnetProps {
  onContractUploaded?: (text: string, filename: string) => void;
}

export default function DashboardChatbotMagnet({ onContractUploaded }: DashboardChatbotMagnetProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const { setContractData } = useContract();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [stagedFileName, setStagedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const quickPrompts = [
    {
      labelAr: '📜 توليد العقود وقفل الاختصاص (Jurisdiction Lock)',
      labelEn: '📜 Million+ Contracts & Jurisdiction Lock',
      query: 'ما هي آلية توليد العقود المليونية المتخصصة والتحقق من التوافق القانوني الجغرافي Jurisdiction Lock؟'
    },
    {
      labelAr: '📄 دقة تصدير Word والاتجاهات RTL/LTR',
      labelEn: '📄 Word DOCX & RTL/LTR Precision',
      query: 'هل ملفات الورد (Word .docx) المستخرجة متوافقة مع الاتجاهات اللغوية (RTL/LTR) وخالية من الفراغات؟'
    },
    {
      labelAr: '🏢 ربط الحسابات المؤسسية وباقات الشركات',
      labelEn: '🏢 Enterprise Corporate Linking & Retainers',
      query: 'ما هي خطوات ربط الحسابات المؤسسية الكبرى وباقات الشركات المخصصة؟'
    },
    {
      labelAr: '⚖️ غرفة التفاوض الرقمية وفض النزاعات',
      labelEn: '⚖️ Digital Negotiation Chambers',
      query: 'ما هي آلية الاستفادة القصوى من غرف التفاوض الرقمية الذكية وحل النزاعات التعاقدية؟'
    },
    {
      labelAr: '🔒 إنشاء اتفاقية عدم إفصاح NDA تجارية',
      labelEn: '🔒 Draft B2B Non-Disclosure Agreement',
      query: 'ما هي البنود الجوهرية في اتفاقية عدم الإفصاح وحماية الأسرار التجارية؟'
    },
    {
      labelAr: '💼 كشف البنود التعسفية في عقود التوريد',
      labelEn: '💼 Detect Arbitrary Terms in Supply Agreements',
      query: 'ما هي البنود التعسفية والمسؤولية غير المحدودة التي يجب تجنبها في عقود التوريد والخدمات؟'
    }
  ];

  async function handleSubmitQuery(customPrompt?: string) {
    const textToSubmit = customPrompt || inputQuery;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setAiResponse(null);

    try {
      // 0. Fast-Path Statutory Semantic Cache Lookup
      const fastMatch = findFastSemanticMatch(textToSubmit, isRtl);
      if (fastMatch && fastMatch.synthesizedResponse) {
        setAiResponse(fastMatch.synthesizedResponse);
        setLoading(false);
        return;
      }

      const prompt = `You are Juris, an elite senior AI legal consultant for JurisTech Solutions. Provide a concise, highly authoritative legal answer with statutory references for GCC/MENA and international commercial law.\n\nUser Question:\n${textToSubmit}`;
      const res = await callAI(prompt);
      setAiResponse(res);
      if (res && res.length > 50) {
        recordAndLearnQuery(textToSubmit, res, isRtl ? 'ar' : 'en');
      }
    } catch (err) {
      console.error('Chatbot Magnet AI Error:', err);
      setAiResponse(
        isRtl
          ? 'بناءً على الأنظمة التجارية النافذة، نوصي بمراجعة البنود المالية والتأكد من تحديد سقف المسؤولية لحماية حقوقك القانونية.'
          : 'Based on applicable commercial codes, we recommend reviewing financial indemnity clauses to ensure liability is capped.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStagedFileName(file.name);
    setUploadProgress(isRtl ? 'جاري قراءة واستخراج نص المستند...' : 'Extracting document content...');

    try {
      const result = await extractPDFTextMultiStage(file, (msg) => setUploadProgress(msg));
      setContractData({
        fileName: file.name,
        extractedText: result.text,
      });

      if (onContractUploaded) {
        onContractUploaded(result.text, file.name);
      }

      setAiResponse(
        isRtl
          ? `تم تحليل مستند "${file.name}" بنجاح! تم استخراج ${result.text.length} حرفاً. ينصح بالانتقال إلى قسم التحليل الشامل أو طرح سؤال محدد حول بنود هذا العقد.`
          : `Document "${file.name}" analyzed successfully! Extracted ${result.text.length} characters. You can now audit clauses or ask questions.`
      );
    } catch (err) {
      console.error('Document upload error:', err);
      setAiResponse(isRtl ? 'تعذر قراءة الملف. يرجى إدخال النص يدوياً.' : 'Failed to extract text. Please paste clauses manually.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  }

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden glow-indigo">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Header Badge & Acquisition Callout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {isRtl ? 'منصة تحليل العقود بالذكاء الاصطناعي وإدارة المخاطر القانونية للشركات' : 'AI Contract Analysis Platform & Corporate Legal Risk Audit'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {isRtl ? 'فحص فوري 24/7' : '24/7 Live AI Audit'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isRtl
                  ? 'كشف الثغرات والبنود التعسفية في العقود التجارية، صياغة الاتفاقيات الذكية، وحوكمة الشركات بالذكاء الاصطناعي وفق الأنظمة السيادية'
                  : 'Detect legal loopholes, audit indemnities, draft smart contracts & ensure statutory corporate compliance across global jurisdictions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'حماية من المخاطر وغرامات العقود' : 'Contract Risk & Liability Shield'}</span>
            </span>
          </div>

        </div>

        {/* Input & Upload Bar */}
        <div className="space-y-3">
          <div className="relative flex items-center bg-slate-950/80 rounded-2xl border border-indigo-500/30 focus-within:border-cyan-400 transition-all p-1.5 shadow-inner">
            <input
              type="text"
              aria-label={isRtl ? 'حقل استشارة الذكاء الاصطناعي القانوني' : 'Legal AI Consultation Input'}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuery()}
              placeholder={
                isRtl
                  ? 'اكتب سؤالك القانوني هنا (مثال: ما صحة بند الشرط الجزائي عند فسخ العقد؟)...'
                  : 'Type your legal query (e.g. Is this penalty clause valid under commercial code?)...'
              }
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
            />

            <div className={`flex items-center gap-1.5 ${isRtl ? 'pl-2' : 'pr-2'}`}>
              <VoiceInput
                onTranscript={(text) => setInputQuery((prev) => (prev ? `${prev} ${text}` : text))}
              />

              <label
                aria-label={isRtl ? 'رفع ملف عقد' : 'Upload contract file'}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 cursor-pointer border border-slate-700 transition-all flex items-center gap-1 text-xs font-semibold"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">{isRtl ? 'رفع عقد' : 'Upload'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => handleSubmitQuery()}
                disabled={loading || !inputQuery.trim()}
                aria-label={isRtl ? 'إرسال الاستشارة القانونية' : 'Submit legal query'}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-slate-950 border-t-transparent rounded-full w-4 h-4" />
                ) : (
                  <>
                    <span>{isRtl ? 'اسأل الآن' : 'Consult'}</span>
                    <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Staged file or uploading indicator */}
          {uploading && (
            <div className="text-xs font-sans text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-2 rounded-xl flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{uploadProgress}</span>
            </div>
          )}

          {stagedFileName && !uploading && (
            <div className="text-xs font-sans text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{isRtl ? `المستند المجهّز: ${stagedFileName}` : `Staged file: ${stagedFileName}`}</span>
              </span>
              <span className="text-[10px] text-slate-400">{isRtl ? 'تم التحميل' : 'Ready'}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Shortcut Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isRtl ? 'أسئلة شائعة واستشارات سريعة:' : 'Common Quick Queries:'}</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPrompts.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputQuery(item.query);
                  handleSubmitQuery(item.query);
                }}
                aria-label={isRtl ? item.labelAr : item.labelEn}
                className="text-left dir-auto p-2.5 rounded-xl bg-slate-950/60 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span className="truncate">{isRtl ? item.labelAr : item.labelEn}</span>
                <ArrowRight className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* AI Output Preview Box */}
        {aiResponse && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? 'الرأي القانوني المباشر من جوريس:' : 'Direct Legal Opinion from Juris AI:'}</span>
              </span>
              <span className="text-[10px] font-sans text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                {isRtl ? 'تأصيل تشريعي معتمد' : 'Statutory Reference'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap dir-auto">
              {aiResponse}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>{isRtl ? 'مستنداتك مشفّرة بحماية AES-256' : 'AES-256 Encrypted Audit'}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/chat')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{isRtl ? 'متابعة النقاش مع الشات بوت' : 'Continue Chat'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => navigate('/payment')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-black hover:brightness-110 transition-all shadow"
                >
                  {isRtl ? 'اشتراك للحصول على استشارات غير محدودة' : 'Unlock Unlimited AI'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
