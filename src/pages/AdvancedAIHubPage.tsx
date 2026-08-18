import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, BrainCircuit, ShieldAlert, FileSearch, Scale, Loader2, ArrowRight, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import { callAI } from '../lib/api';

const MODULES = [
  {
    id: 'mna',
    titleAr: 'الاستحواذ الذكي التنبؤي (M&A Intelligence)',
    titleEn: 'Predictive M&A Intelligence',
    descAr: 'دمج نموذج تعلم عميق لتحليل القوائم المالية والعقود، لتوقع فرص نجاح الصفقات الاستثمارية بدقة.',
    descEn: 'Deep learning model analyzing financials and contracts to predict M&A success rates with high accuracy.',
    icon: BrainCircuit,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    promptTemplateAr: (input: string) => `قم بدور مستشار الذكاء الاصطناعي لصفقات الاستحواذ والاندماج. حلل البيانات التالية للشركة المستهدفة وتوقع "فرص النجاح أو التعثر":\n\n${input}`,
    promptTemplateEn: (input: string) => `Act as an AI M&A advisor. Analyze the following target company data and predict the "success or failure rate" of the acquisition:\n\n${input}`
  },
  {
    id: 'negotiation',
    titleAr: 'التفاوض الآلي مدعوم بالوكلاء',
    titleEn: 'Autonomous AI Negotiation Agents',
    descAr: 'وكيل ذكاء اصطناعي (AI Agent) قادر على التفاوض المباشر على الشروط والبنود بناءً على سياسات المخاطر المعتمدة.',
    descEn: 'An AI Agent capable of autonomously negotiating terms and clauses based on predefined risk policies.',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-500/10',
    promptTemplateAr: (input: string) => `أنت وكيل تفاوض آلي ممثل لشركتنا. بناءً على البنود والحدود التالية، قم بإنشاء مسودة رد تفاوضي لحماية مصالحنا بلهجة احترافية حازمة:\n\n${input}`,
    promptTemplateEn: (input: string) => `You are an autonomous negotiation agent representing our firm. Based on the following terms and limits, draft a professional negotiation response to protect our interests:\n\n${input}`
  },
  {
    id: 'litigation',
    titleAr: 'المحاكاة القضائية والنزاعات الافتراضية',
    titleEn: 'Virtual Litigation & Dispute Simulation',
    descAr: 'أداة تحاكي سيناريوهات النزاع القانوني أمام المحاكم المختلفة لتقديم تقرير استباقي بنقاط الضعف.',
    descEn: 'Simulates legal dispute scenarios across jurisdictions to provide a proactive report on vulnerabilities.',
    icon: Scale,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    promptTemplateAr: (input: string) => `قم بإجراء محاكاة قضائية للنزاع المحتمل حول هذا العقد أمام المحاكم. استخرج نقاط الضعف والقوة القانونية بالتفصيل:\n\n${input}`,
    promptTemplateEn: (input: string) => `Perform a virtual litigation simulation for a potential dispute over this contract. Extract legal strengths and vulnerabilities in detail:\n\n${input}`
  },
  {
    id: 'fraud',
    titleAr: 'اكتشاف الاحتيال بالقياس الحيوي النصي',
    titleEn: 'Advanced Fraud & Stylometric Detection',
    descAr: 'تحليل الأنماط اللغوية وتوقيعات البيانات الوصفية لاكتشاف محاولات التلاعب المخبأة والتزوير.',
    descEn: 'Analyzes linguistic patterns and metadata signatures to detect hidden forgery and manipulation attempts.',
    icon: ShieldAlert,
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-500/10',
    promptTemplateAr: (input: string) => `قم بتحليل النص التالي باستخدام القياس الحيوي النصي (Stylometric Detection) واكتشف أي محاولات للاحتيال المبطن أو التلاعب بالصيغ القانونية:\n\n${input}`,
    promptTemplateEn: (input: string) => `Analyze the following text using stylometric detection. Identify any hidden fraud attempts or manipulative legal phrasing:\n\n${input}`
  }
];

export default function AdvancedAIHubPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleRunAI = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);
    setExecutionTime(null);
    const start = performance.now();

    try {
      const prompt = isRtl
        ? activeModule.promptTemplateAr(inputText)
        : activeModule.promptTemplateEn(inputText);

      const languageEnforcement = isRtl
        ? '\n\nملاحظة هامة: أجب باللغة العربية حصراً وبأسلوب قانوني واحترافي رفيع المستوى.'
        : '\n\nIMPORTANT: Respond strictly in English using high-level professional legal terminology.';

      const finalPrompt = prompt + languageEnforcement;
      
      const response = await callAI(finalPrompt);
      setResult(response);
    } catch (error) {
      console.error('AI Processing Error:', error);
      setResult(isRtl ? 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.' : 'An error occurred during processing. Please try again.');
    } finally {
      const end = performance.now();
      setExecutionTime(Math.round(end - start));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex flex-col pt-8 pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Premium Header */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
              {isRtl ? 'وحدات الذكاء الاصطناعي السيادية المتقدمة' : 'Sovereign Advanced AI Units'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {isRtl ? 'محرك ' : ''}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Google AI Pro</span> {isRtl ? 'المتطور' : 'Engine Integration'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {isRtl
              ? 'أدوات تحليل استباقية مصممة حصرياً للمستثمرين المؤسسيين والشركات الكبرى لتحقيق الأمان المطلق واتخاذ القرارات بدقة متناهية.'
              : 'Proactive analytical tools designed exclusively for institutional investors and enterprises to achieve absolute security and precision decision-making.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8 w-full">
        
        {/* Module Selection Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod);
                setResult(null);
                setExecutionTime(null);
              }}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                activeModule.id === mod.id
                  ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full blur-3xl bg-gradient-to-br ${mod.color} transition-opacity ${activeModule.id === mod.id ? 'opacity-30' : 'group-hover:opacity-30'}`}></div>
              <div className="relative flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${activeModule.id === mod.id ? mod.bgColor : 'bg-slate-800'}`}>
                  <mod.icon className={`w-6 h-6 ${activeModule.id === mod.id ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className={`font-bold mb-1.5 ${activeModule.id === mod.id ? 'text-white' : 'text-slate-300'}`}>
                    {isRtl ? mod.titleAr : mod.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isRtl ? mod.descAr : mod.descEn}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Interface Area */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeModule.color}`}></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-4 rounded-2xl ${activeModule.bgColor}`}>
                <activeModule.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isRtl ? activeModule.titleAr : activeModule.titleEn}
                </h2>
                <p className="text-sm text-slate-400">
                  {isRtl ? 'وحدة معالجة البيانات المدعومة بالذكاء الاصطناعي السيادي' : 'Sovereign AI Data Processing Unit'}
                </p>
              </div>
            </div>

            {/* Input Area */}
            <div className="space-y-4 relative z-10">
              <label className="block text-sm font-semibold text-slate-300">
                {isRtl ? 'إدخال البيانات / الشروط / القوائم:' : 'Data Input / Terms / Statements:'}
              </label>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isRtl ? 'قم بلصق تفاصيل العقد، أو المؤشرات المالية، أو الشروط هنا لبدء التحليل المعمق...' : 'Paste contract details, financial indicators, or terms here to begin deep analysis...'}
                  className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none transition-shadow"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                {!inputText && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <UploadCloud className="w-12 h-12 text-slate-400" />
                      <span className="text-sm font-medium">{isRtl ? 'النظام جاهز لتلقي البيانات المعقدة' : 'System ready for complex data input'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunAI}
                  disabled={loading || !inputText.trim()}
                  className="group relative flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                  <span className="relative z-10">
                    {loading ? (isRtl ? 'جاري المعالجة المعمقة...' : 'Deep Processing...') : (isRtl ? 'بدء التحليل السيادي' : 'Initialize Sovereign Analysis')}
                  </span>
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  ) : (
                    isRtl ? <ArrowLeft className="w-5 h-5 relative z-10" /> : <ArrowRight className="w-5 h-5 relative z-10" />
                  )}
                </button>
              </div>
            </div>

            {/* Results Area */}
            {(loading || result) && (
              <div className="mt-10 pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    {isRtl ? 'مخرجات التحليل والذكاء الاصطناعي' : 'AI Analysis & Output'}
                  </h3>
                  {executionTime && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400">
                        {executionTime}ms
                      </span>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 border border-slate-800 animate-pulse">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    <p className="text-slate-400 text-sm">{isRtl ? 'يتم الآن تحليل ملايين البيانات والنماذج لاستخلاص النتيجة...' : 'Analyzing millions of data points and models to extract the result...'}</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-loose whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
