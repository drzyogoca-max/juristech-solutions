import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Scale, Search } from 'lucide-react';
import { JURISDICTIONS, JurisdictionInfo, setSelectedJurisdiction } from '../lib/jurisdiction';
import { useNavigate } from 'react-router-dom';
import { getUITranslations } from '../lib/uiTranslations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectJurisdiction?: (jurisdiction: JurisdictionInfo) => void;
}

export default function JurisdictionSelectorModal({ isOpen, onClose, onSelectJurisdiction }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'ar';
  const isRtl = lang === 'ar';
  const ui = getUITranslations(lang);
  const navigate = useNavigate();

  const [activeCode, setActiveCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('juristech_jurisdiction');
      if (saved) {
        return JSON.parse(saved).countryCode || 'EG';
      }
    } catch {}
    return 'EG';
  });

  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const rawList = Object.values(JURISDICTIONS).filter(j => !j.isBlocked);
  const jurisdictionsList = rawList.filter(j => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.countryName.toLowerCase().includes(q) ||
      j.countryNameAr.includes(q) ||
      j.countryCode.toLowerCase().includes(q) ||
      (j.currencyCode && j.currencyCode.toLowerCase().includes(q))
    );
  });

  function handleSelect(code: string) {
    setActiveCode(code);
    const selected = setSelectedJurisdiction(code);
    if (onSelectJurisdiction) {
      onSelectJurisdiction(selected);
    }
    onClose();
    // Navigate seamlessly to /chat with Legislative Advisor context pre-loaded
    navigate('/chat', { state: { jurisdiction: selected, prompt: isRtl ? `أنا أحتاج استشارة من المستشار التشريعي الدولي المباشر النافذ في ${selected.countryNameAr}` : `I need legal advice grounded in ${selected.countryName} law` } });
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-slate-900/20 dark:shadow-slate-950/90 overflow-hidden relative animate-in fade-in zoom-in duration-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                {ui.jurisdiction.advisorBadge}
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1">
                {ui.jurisdiction.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            aria-label={ui.jurisdiction.closeAria}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Description */}
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60 space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold text-xs">
            {ui.jurisdiction.description}
          </p>

          <div className="relative">
            <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              aria-label={ui.jurisdiction.searchPlaceholder}
              placeholder={ui.jurisdiction.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs bg-white dark:bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {jurisdictionsList.map((j) => {
              const isSelected = activeCode === j.countryCode;
              return (
                <button
                  key={j.countryCode}
                  onClick={() => handleSelect(j.countryCode)}
                  className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-cyan-50/90 dark:bg-gradient-to-b dark:from-cyan-950/60 dark:to-slate-900 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{j.flagEmoji || '🌐'}</span>
                      <span className="font-black text-sm text-slate-900 dark:text-white">{isRtl ? j.countryNameAr : j.countryName}</span>
                      {j.currencyCode && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                          {j.currencySymbol} {j.currencyCode}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-cyan-500 text-slate-950">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <p className="line-clamp-2 text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                      {isRtl ? j.legalFrameworkAr : j.legalFramework}
                    </p>
                    <span className="text-[10px] text-cyan-700 dark:text-cyan-400 block pt-1 font-sans font-bold">
                      {ui.jurisdiction.arbitration}: {isRtl ? j.arbitrationVenueAr : j.arbitrationVenue}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 sticky bottom-0 z-10 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
            {ui.jurisdiction.grounding}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors border border-slate-300 dark:border-slate-700"
          >
            {ui.jurisdiction.close}
          </button>
        </div>
      </div>
    </div>
  );
}
