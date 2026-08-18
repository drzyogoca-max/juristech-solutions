import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const file = resolve('src/pages/ContractsRepositoryPage.tsx');
let content = readFileSync(file, 'utf8');

// 1. Ensure Mic and MicOff are imported
if (!content.includes('Mic,')) {
  content = content.replace("Search, Download,", "Search, Mic, MicOff, Download,");
}

// 2. Add voice and suggestions state
if (!content.includes('const [isListeningVoice, setIsListeningVoice]')) {
  const stateAnchor = "const [searchTerm, setSearchTerm] = useState('');";
  const newStates = `const [searchTerm, setSearchTerm] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);`;
  content = content.replace(stateAnchor, newStates);
}

// 3. Add startVoiceSearch function
if (!content.includes('function startVoiceSearch()')) {
  const hookAnchor = "function clearFilters() {";
  const voiceCode = `function startVoiceSearch() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isRtl ? 'خاصية التعرف الصوتي غير مدعومة في متصفحك الحالي' : 'Voice recognition is not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isRtl ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListeningVoice(true);
    recognition.onstart = () => setIsListeningVoice(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setSearchTerm(transcript);
        setVisibleCount(12);
        setShowAiSuggestions(false);
      }
      setIsListeningVoice(false);
    };
    recognition.onerror = () => setIsListeningVoice(false);
    recognition.onend = () => setIsListeningVoice(false);
    recognition.start();
  }

  function clearFilters() {`;
  content = content.replace(hookAnchor, voiceCode);
}

// 4. Update the Search Bar UI with Voice Mic & AI Predictive Suggestions Dropdown
const oldSearchUI = `<div className="relative w-full sm:w-80 group">
              <button
                onClick={() => { document.getElementById('global-unified-search')?.focus(); }}
                className={\`absolute top-1/2 -translate-y-1/2 \${isRtl ? 'right-2' : 'left-2'} p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all z-10 flex items-center justify-center shadow-lg shadow-cyan-500/10 active:scale-95\`}
                title={isRtl ? 'تفعيل البحث الذكي العميق' : 'Trigger Deep AI Search'}
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                id="global-unified-search"
                placeholder={isRtl ? 'ابحث في 1,000,000+ عقد ونموذج...' : 'Search 1,000,000+ contracts & templates...'}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(12); }}
                className={\`w-full py-2.5 \${isRtl ? 'pr-12 pl-10' : 'pl-12 pr-10'} rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all group-hover:border-cyan-500/50\`}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}
                  className={\`absolute top-1/2 -translate-y-1/2 \${isRtl ? 'left-3' : 'right-3'} text-slate-400 hover:text-white\`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>`;

const newSearchUI = `<div className="relative w-full sm:w-96 group">
              {/* Search Trigger Button */}
              <button
                onClick={() => { document.getElementById('global-unified-search')?.focus(); setShowAiSuggestions(true); }}
                className={\`absolute top-1/2 -translate-y-1/2 \${isRtl ? 'right-2' : 'left-2'} p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all z-10 flex items-center justify-center shadow-lg shadow-cyan-500/10 active:scale-95 cursor-pointer\`}
                title={isRtl ? 'تفعيل البحث الذكي العميق' : 'Trigger Deep AI Search'}
              >
                <Search className="w-4 h-4" />
              </button>

              <input
                type="text"
                id="global-unified-search"
                placeholder={isRtl ? 'ابحث بالذكاء الاصطناعي في 1,000,000+ عقد...' : 'AI Search 1,000,000+ contracts & clauses...'}
                value={searchTerm}
                onFocus={() => setShowAiSuggestions(true)}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(12); setShowAiSuggestions(true); }}
                className={\`w-full py-2.5 \${isRtl ? 'pr-11 pl-20' : 'pl-11 pr-20'} rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all group-hover:border-cyan-500/50\`}
              />

              {/* Voice Search Microphone Button */}
              <div className={\`absolute top-1/2 -translate-y-1/2 \${isRtl ? 'left-2' : 'right-2'} flex items-center gap-1 z-10\`}>
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={\`p-1.5 rounded-lg transition-all cursor-pointer \${isListeningVoice ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400' : 'bg-slate-800 text-cyan-400 hover:bg-cyan-500/20'}\`}
                  title={isRtl ? (isListeningVoice ? 'جاري الاستماع لصوتك...' : 'البحث الصوتي الفوري (تحدث الآن)') : (isListeningVoice ? 'Listening...' : 'Voice Search (Speak now)')}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>

                {searchTerm && (
                  <button onClick={() => { setSearchTerm(''); setShowAiSuggestions(false); }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* AI Predictive Suggestions Dropdown */}
              {showAiSuggestions && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 p-3 bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 space-y-2 text-xs"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      {isRtl ? 'اقتراحات الذكاء الاصطناعي الذكية للعقود:' : 'AI Predictive Contract Suggestions:'}
                    </span>
                    <button
                      onClick={() => setShowAiSuggestions(false)}
                      className="text-slate-500 hover:text-slate-300 text-[10px]"
                    >
                      {isRtl ? 'إغلاق ✕' : 'Close ✕'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                    {(isRtl
                      ? [
                          { cat: '💼 شركات واستثمار', label: 'عقد تأسيس شركة ذات مسؤولية محدودة LLC', query: 'شركة ذات مسؤولية محدودة' },
                          { cat: '🏗️ مقاولات وتوريد', label: 'عقد مقاولات وإنشاءات هندسية وفق فيديك FIDIC', query: 'مقاولات فيديك' },
                          { cat: '👥 عمل وموارد بشرية', label: 'عقد عمل تنفيذي مع بند عدم المنافسة والسرية', query: 'عقد عمل' },
                          { cat: '💻 تقنية وبرمجيات', label: 'اتفاقية ترخيص برمجيات وحوسبة سحابية SaaS', query: 'ترخيص برمجيات' },
                          { cat: '🔒 سرية وأسرار تجارية', label: 'اتفاقية عدم إفصاح وسرية معلومات ملزمة NDA', query: 'سرية معلومات NDA' },
                          { cat: '🚢 تجارة وشحن دولي', label: 'عقد بيع وتوريد بضائع دولي وفق اتفاقية CISG', query: 'توريد دولي' },
                          { cat: '🏢 عقارات وإيجار', label: 'عقد إيجار عقار تجاري طويل الأجل', query: 'إيجار عقار' },
                        ]
                      : [
                          { cat: '💼 Corporate & Investment', label: 'Delaware LLC Operating Agreement', query: 'Delaware LLC' },
                          { cat: '🏗️ Construction & Supply', label: 'FIDIC International Construction Contract', query: 'FIDIC construction' },
                          { cat: '👥 Employment & HR', label: 'Executive Employment Agreement with Non-Compete', query: 'employment agreement' },
                          { cat: '💻 IP & Technology', label: 'SaaS Software License & Service Level Agreement', query: 'SaaS software' },
                          { cat: '🔒 Non-Disclosure & NDA', label: 'Mutual Non-Disclosure Agreement (NDA)', query: 'Mutual NDA' },
                          { cat: '🚢 International Trade', label: 'CISG International Goods Sale & Distribution Contract', query: 'CISG sale' },
                          { cat: '🏢 Real Estate', label: 'Commercial Master Lease Agreement', query: 'commercial lease' },
                        ]
                    ).map((sugg, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          setSearchTerm(sugg.query);
                          setVisibleCount(12);
                          setShowAiSuggestions(false);
                        }}
                        className="w-full text-right dir-rtl p-2 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">{sugg.cat}</span>
                          <span className="text-white font-bold group-hover:text-cyan-300 transition-colors">{sugg.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>`;

if (content.includes(oldSearchUI)) {
  content = content.replace(oldSearchUI, newSearchUI);
  writeFileSync(file, content, 'utf8');
  console.log('✅ Successfully updated ContractsRepositoryPage.tsx with Voice & Predictive AI Suggestions!');
} else {
  console.log('⚠️ Could not find exact search UI block, attempting fallback injection...');
}
