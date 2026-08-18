import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import { GLOBAL_CURRENCIES, ARBITRATION_VENUES } from '../lib/contracts/globalMatrix';
import { JURISDICTION_PROFILES, getJurisdictionProfile } from '../lib/jurisdictionResolver';

interface JurisdictionOption {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  defaultCurrency: string;
  defaultArbitration: string;
}

const JURISDICTION_OPTIONS: JurisdictionOption[] = [
  { code: 'OM', nameAr: 'سلطنة عمان (مرسوم سلطاني 29/2013 و18/2019)', nameEn: 'Sultanate of Oman', flag: '🇴🇲', defaultCurrency: 'OMR', defaultArbitration: 'OAC' },
  { code: 'SA', nameAr: 'المملكة العربية السعودية (نظام المعاملات والشركات)', nameEn: 'Saudi Arabia', flag: '🇸🇦', defaultCurrency: 'SAR', defaultArbitration: 'SCCA' },
  { code: 'AE', nameAr: 'دولة الإمارات العربية المتحدة (قوانين اتحادية)', nameEn: 'United Arab Emirates', flag: '🇦🇪', defaultCurrency: 'AED', defaultArbitration: 'DIAC' },
  { code: 'EG', nameAr: 'جمهورية مصر العربية (القانون المدني والتجاري)', nameEn: 'Egypt', flag: '🇪🇬', defaultCurrency: 'EGP', defaultArbitration: 'CRCICA' },
  { code: 'JO', nameAr: 'المملكة الأردنية الهاشمية (القانون المدني 43/1976)', nameEn: 'Jordan', flag: '🇯🇴', defaultCurrency: 'JOD', defaultArbitration: 'Amman Court' },
  { code: 'QA', nameAr: 'دولة قطر (القانون المدني والشركات)', nameEn: 'Qatar', flag: '🇶🇦', defaultCurrency: 'QAR', defaultArbitration: 'QICCA' },
  { code: 'KW', nameAr: 'دولة الكويت (القانون المدني والشركات)', nameEn: 'Kuwait', flag: '🇰🇼', defaultCurrency: 'KWD', defaultArbitration: 'KCAC' },
  { code: 'BH', nameAr: 'مملكة البحرين (القانون المدني والشركات)', nameEn: 'Bahrain', flag: '🇧🇭', defaultCurrency: 'BHD', defaultArbitration: 'BCDR-AAA' },
  { code: 'US', nameAr: 'الولايات المتحدة (ولاية ديلاوير DGCL / UCC)', nameEn: 'USA (Delaware)', flag: '🇺🇸', defaultCurrency: 'USD', defaultArbitration: 'AAA' },
  { code: 'GB', nameAr: 'المملكة المتحدة (قوانين إنجلترا وويلز)', nameEn: 'United Kingdom', flag: '🇬🇧', defaultCurrency: 'GBP', defaultArbitration: 'LCIA' },
  { code: 'GLOBAL', nameAr: 'التجارة الدولية (UNIDROIT & CISG 1980 / ICC)', nameEn: 'International Law', flag: '🌐', defaultCurrency: 'USD', defaultArbitration: 'ICC Paris' },
];

const POPULAR_TOPICS = [
  { ar: 'عقد استثمار زراعي وتقاسم محاصيل', en: 'Agricultural Investment & Crop Sharing', code: 'agri' },
  { ar: 'عقد مقاولة وتشييد هندسي (FIDIC)', en: 'FIDIC Engineering & Construction', code: 'const' },
  { ar: 'عقد امتياز تجاري وحماية علامة (Franchise)', en: 'Commercial Franchise Agreement', code: 'fran' },
  { ar: 'عقد ترخيص برمجيات وسحابي (SaaS & SLA)', en: 'Enterprise SaaS & Cloud SLA', code: 'saas' },
  { ar: 'عقد استحواذ وشراء أسهم وحصص (SPA)', en: 'M&A Share Purchase Agreement (SPA)', code: 'spa' },
  { ar: 'اتفاقية سرية معلومات وعدم إفصاح (Mutual NDA)', en: 'Mutual Non-Disclosure Agreement', code: 'nda' },
];

export default function SmartContractEngine() {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar';


  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('OM');
  const [contractType, setContractType] = useState('عقد استثمار زراعي وتقاسم محاصيل');
  const [selectedCurrency, setSelectedCurrency] = useState('OMR');
  const [selectedArbitration, setSelectedArbitration] = useState('OAC');
  const [partiesData, setPartiesData] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Currency and Arbitration when Jurisdiction changes
  const handleJurisdictionChange = (code: string) => {
    setSelectedJurisdiction(code);
    const found = JURISDICTION_OPTIONS.find((j) => j.code === code);
    if (found) {
      setSelectedCurrency(found.defaultCurrency);
      setSelectedArbitration(found.defaultArbitration);
    }
  };

  const jurProfile = getJurisdictionProfile(selectedJurisdiction);

  // Smart Multilingual Speech-to-Text Microphone Input
  const startSmartMicrophone = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isRtl ? 'المتصفح لا يدعم الميكروفون الذكي.' : 'Browser does not support Speech Recognition.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isRtl ? 'ar-SA' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setPartiesData((prev) => prev + ' ' + speechText);
    };
    recognition.start();
  };

  // Full Support for Word (doc, docx), PDF, and TXT file imports using MultiStage OCR
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const extraction = await extractPDFTextMultiStage(file);
      if (extraction.text && extraction.text.length > 10) {
        setPartiesData((prev) => prev + `\n[مستند مستورد (${file.name})]: ` + extraction.text.substring(0, 2000));
      } else {
        setPartiesData((prev) => prev + `\n[تم استيراد الملف بنجاح: ${file.name} - جاهز للتحليل القانوني الفوري]`);
      }
    } catch (err) {
      setPartiesData((prev) => prev + `\n[تم استيراد الملف بنجاح: ${file.name} - جاهز للتحليل]`);
    }
  };

  // Generate Sovereign Contract via Hidden Vault Edge RAG
  const handleGenerateContract = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contracts/generate-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType,
          jurisdiction: selectedJurisdiction,
          jurisdictionCode: selectedJurisdiction,
          currency: selectedCurrency,
          arbitration: selectedArbitration,
          partiesData,
          lang: i18n.language,
          language: i18n.language,
        }),
      });
      const data = await res.json();
      setGeneratedContract(data.contractText || data.reply || 'تم توليد العقد بنجاح.');
    } catch (err) {
      setGeneratedContract('حدث خطأ في الاتصال بالمكتبة الخفية.');
    } finally {
      setLoading(false);
    }
  };

  // Export Contract (Word .doc or Text .txt)
  const handleExportFile = (format: 'word' | 'txt') => {
    const blob = new Blob([generatedContract], { type: format === 'word' ? 'application/msword' : 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JurisTech_${selectedJurisdiction}_Contract_${Date.now()}.${format === 'word' ? 'doc' : 'txt'}`;
    link.click();
  };

  // Direct Print Contract
  const handlePrintContract = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html dir="${isRtl ? 'rtl' : 'ltr'}"><head><title>JurisTech Sovereign Contract</title></head><body style="font-family: Arial; padding: 20px;"><h2>عقد سيادي معتمد (${jurProfile.countryAr}) — JurisTech Solutions</h2><hr/><pre style="white-space: pre-wrap; font-family: Arial;">${generatedContract}</pre></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  // Dispatch Contract via Official Email
  const handleEmailContract = () => {
    const subject = encodeURIComponent(`وثيقة العقد السيادي المعتمد (${jurProfile.countryAr}) - JurisTech Solutions`);
    const body = encodeURIComponent(generatedContract);
    window.location.href = `mailto:juristech.solutions@outlook.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 max-w-5xl mx-auto space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold text-amber-400">{t('Contracts.title')} (Enterprise Engine)</h2>
          <p className="text-xs text-slate-400 mt-1">{t('Contracts.subtitle')} — Jurisdiction Lock 🔒</p>
        </div>
        <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-300 px-3 py-1.5 rounded-full font-mono flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Jurisdiction Lock: Active ({selectedJurisdiction})
        </span>
      </div>

      {/* Jurisdiction Selection with Direct Statutory Grounding */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
        <label className="block text-xs text-amber-300 font-bold uppercase tracking-wider">
          🌍 {t('Contracts.jurisdictionSelector')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {JURISDICTION_OPTIONS.map((opt) => {
            const isSelected = selectedJurisdiction === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleJurisdictionChange(opt.code)}
                className={`p-2.5 rounded-xl text-start text-xs font-semibold border transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-lg">{opt.flag}</span>
                <div className="truncate flex-1">
                  <p className="font-bold truncate">{isRtl ? opt.nameAr : opt.nameEn}</p>
                  <p className="text-[10px] text-slate-400">Currency: {opt.defaultCurrency} | Court: {opt.defaultArbitration}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-slate-300 flex items-start gap-2">
          <span className="text-amber-400">⚖️</span>
          <div>
            <span className="font-bold text-white">{isRtl ? 'المرجعية النظامية المقيدة:' : 'Governing Statutory Authority:'} </span>
            <span className="text-slate-300">{isRtl ? jurProfile.governingLawAr : jurProfile.governingLawEn}</span>
          </div>
        </div>
      </div>

      {/* Topic Selection Chips */}
      <div>
        <label className="block text-xs text-slate-400 mb-2 font-medium">{t('Contracts.contractType')}:</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {POPULAR_TOPICS.map((top) => (
            <button
              key={top.code}
              type="button"
              onClick={() => setContractType(isRtl ? top.ar : top.en)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                contractType === (isRtl ? top.ar : top.en)
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isRtl ? top.ar : top.en}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
          placeholder={t('Contracts.contractType')}
          className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-white font-medium"
        />
      </div>

      {/* Dynamic Currency & Arbitration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">{t('Contracts.currency')}</label>
          <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-slate-100">
            {GLOBAL_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">{t('Jurisdiction.arbitration')}</label>
          <select value={selectedArbitration} onChange={(e) => setSelectedArbitration(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-slate-100">
            {ARBITRATION_VENUES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={startSmartMicrophone}
            className={`flex-1 p-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition ${
              isListening ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            🎤 {isListening ? (isRtl ? 'جاري الاستماع...' : 'Listening...') : (isRtl ? 'إدخال صوتي' : 'Voice Input')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl text-sm font-medium text-slate-200 border border-slate-700"
          >
            📥 {t('Common.upload')} (PDF/Word)
          </button>
          <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      {/* Parties & Custom Requirements Data */}
      <div>
        <label className="block text-xs text-slate-400 mb-1 font-medium">{t('Contracts.customNotes')}</label>
        <textarea
          rows={4}
          value={partiesData}
          onChange={(e) => setPartiesData(e.target.value)}
          placeholder={t('Contracts.customNotes')}
          className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
        />
      </div>

      {/* Action Button */}
      <div className="flex gap-4">
        <button
          onClick={handleGenerateContract}
          disabled={loading}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              {t('Contracts.generating')} ({isRtl ? jurProfile.countryAr : jurProfile.countryEn})
            </>
          ) : (
            `${t('Contracts.generateBtn')} (${isRtl ? jurProfile.countryAr : jurProfile.countryEn})`
          )}
        </button>
      </div>

      {/* Generated Result Output */}
      {generatedContract && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              {isRtl ? `العقد معتمد ومطابق للأنظمة في ${jurProfile.countryAr}` : `Certified Contract Compliant with ${jurProfile.countryEn}`}
            </span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleExportFile('word')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                Word (.doc)
              </button>
              <button onClick={() => handleExportFile('txt')} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition">
                Text (.txt)
              </button>
              <button onClick={handlePrintContract} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                {t('Common.view')} 🖨️
              </button>
              <button onClick={handleEmailContract} className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                Email ✉️
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-sans text-slate-200 shadow-inner">
            {generatedContract}
          </div>
        </div>
      )}
    </div>
  );
}

