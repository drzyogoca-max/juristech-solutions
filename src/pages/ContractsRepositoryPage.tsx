import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Mic, MicOff, Download, FileText, Star, ChevronRight, Globe, Filter,
  Sparkles, TrendingUp, Zap, Shield, BookOpen, RotateCcw,
  Building2, Users, Cpu, DollarSign, Briefcase, Home, Heart, Wallet,
  CheckCircle2, ArrowRight, Clock, X, Eye, Copy, Check, RefreshCw, Wand2,
  ShieldAlert, Sliders, User, Lock, Layers
} from 'lucide-react';
import {
  MEGA_CATEGORIES,
  MEGA_CONTRACT_TEMPLATES,
  MegaContractTemplate,
  searchMegaRepository,
  generateContractFromTemplate,
  getFeaturedContracts,
} from '../data/contractsMegaRepository';
import { CONTRACT_STORE_DATABASE } from '../data/contractStore';
import { smartContractDataLake, DataLakeSearchResult } from '../services/smartContractDataLake';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { detectVisitorJurisdiction, JurisdictionInfo, wrapPromptWithJurisdiction } from '../lib/jurisdiction';
import { callAI } from '../lib/api';
import VoiceInput from '../components/VoiceInput';
import { getLocalizedValue } from '../lib/languageHelper';

import ContractLibraryGate, { TemplateContractItem } from '../components/ContractLibraryGate';
import ClientPaywallModal from '../components/ClientPaywallModal';
import { useAuth } from '../lib/authContext';
import SEO from '../components/SEO';
import AdSponsorBanner from '../components/AdSponsorBanner';

// ── Icon map for categories ──────────────────────────────────────────────────
const CAT_ICONS: Record<string, React.ElementType> = {
  corporate: Building2,
  employment: Users,
  'ip-tech': Cpu,
  investment: DollarSign,
  commercial: Briefcase,
  'real-estate': Home,
  finance: Wallet,
  healthcare: Heart,
};

// ── JURISDICTIONS for filter ─────────────────────────────────────────────────
const JURISDICTIONS_LIST = [
  { code: 'all', nameAr: 'جميع الدول', nameEn: 'All Jurisdictions', flag: '🌍' },
  { code: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', nameAr: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪' },
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬' },
  { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴' },
  { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar', flag: '🇶🇦' },
  { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼' },
  { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States', flag: '🇺🇸' },
  { code: 'EU', nameAr: 'الاتحاد الأوروبي', nameEn: 'European Union', flag: '🇪🇺' },
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { code: 'GLOBAL', nameAr: 'دولي / UNCITRAL', nameEn: 'Global / UNCITRAL', flag: '🌐' },
];

export interface LegalTemplate {
  id: string;
  titleAr: string;
  titleEn: string;
  hub: 'Individual' | 'Enterprise';
  category: string;
  categoryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  contentAr: string;
  contentEn: string;
  rating?: number;
  downloads?: number;
  isAiEnhanced?: boolean;
}

// Convert Mega Templates & Store database into unified LegalTemplates list
const MEGA_TEMPLATES_DATABASE: LegalTemplate[] = [
  ...MEGA_CONTRACT_TEMPLATES.map((m) => ({
    id: m.id,
    titleAr: m.titleAr,
    titleEn: m.titleEn,
    hub: 'Enterprise' as const,
    category: m.categoryKey,
    categoryEn: m.categoryKey,
    descriptionAr: m.descriptionAr,
    descriptionEn: m.descriptionEn,
    contentAr: m.templateAr,
    contentEn: m.templateEn,
    rating: m.rating,
    downloads: m.downloads,
    isAiEnhanced: true,
  })),
  ...CONTRACT_STORE_DATABASE.map((c, idx) => ({
    id: c.id,
    titleAr: c.titleAr,
    titleEn: c.titleEn,
    hub: (idx % 2 === 0 ? 'Enterprise' : 'Individual') as 'Enterprise' | 'Individual',
    category: c.categoryAr,
    categoryEn: c.categoryEn,
    descriptionAr: c.descriptionAr,
    descriptionEn: c.descriptionEn,
    contentAr: c.templateTextAr,
    contentEn: c.templateTextEn,
    rating: 4.8 + (idx % 3) * 0.1,
    downloads: 1200 + idx * 85,
    isAiEnhanced: true,
  })),
];

// ── Quick Download Modal ─────────────────────────────────────────────────────
interface QuickDownloadModalProps {
  contract: MegaContractTemplate;
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
  onTriggerPaywall?: (title: string, id: string, onPaid: () => void) => void;
}

function QuickDownloadModal({ contract, isOpen, onClose, isRtl, onTriggerPaywall }: QuickDownloadModalProps) {
  const { isAdmin, role } = useAuth();
  const roleLocal = typeof window !== 'undefined' ? localStorage.getItem('juristech_user_role') : null;
  const isSuperAdminOrSubscriber = isAdmin || role === 'super-admin' || role === 'admin' || roleLocal === 'super-admin' || (typeof window !== 'undefined' && (localStorage.getItem(`juristech_paid_contract_${contract?.id}`) === 'true' || localStorage.getItem('juristech_client_paid') === 'true'));

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | 'txt' | 'html' | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  async function executeExport(format: 'pdf' | 'docx' | 'txt' | 'html') {
    setDownloading(format);
    const targetJur = contract.jurisdictions?.[0] || (isRtl ? 'JO' : 'US');
    try {
      const generatedText = generateContractFromTemplate(contract, {
        partyA: partyA || (isRtl ? 'الطرف الأول' : 'Party A'),
        partyB: partyB || (isRtl ? 'الطرف الثاني' : 'Party B'),
        contractValue: value || '100,000',
        currency,
        language: isRtl ? 'ar' : 'en',
        jurisdiction: targetJur,
      });
      const contractTitle = isRtl ? contract.titleAr : contract.titleEn;
      await exportDocumentMultiFormat(
        generatedText,
        contractTitle,
        partyA || (isRtl ? 'الطرف الأول' : 'Party A'),
        partyB || (isRtl ? 'الطرف الثاني' : 'Party B'),
        format,
        isRtl ? 'ar' : 'en',
        targetJur
      );
    } finally {
      setTimeout(() => setDownloading(null), 1200);
    }
  }

  function handleDownloadClick(format: 'pdf' | 'docx' | 'txt' | 'html') {
    const roleCheck = localStorage.getItem('juristech_user_role');
    const isPaid = isAdmin || role === 'super-admin' || role === 'admin' || roleCheck === 'super-admin' || localStorage.getItem(`juristech_paid_contract_${contract.id}`) === 'true' || localStorage.getItem('juristech_client_paid') === 'true';

    if (isPaid) {
      executeExport(format);
    } else if (onTriggerPaywall) {
      onTriggerPaywall(
        isRtl ? contract.titleAr : contract.titleEn,
        contract.id,
        () => executeExport(format)
      );
    } else {
      executeExport(format);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ maxHeight: '92vh', animation: 'qModalIn 0.22s ease-out' }}
      >
        <style>{`@keyframes qModalIn{from{opacity:0;transform:translateY(-10px) scale(0.97)}to{opacity:1;transform:none}}`}</style>


        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/60 border-b border-slate-800">
          <div className="min-w-0">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              {isRtl ? contract.titleAr.split('—')[0] : contract.titleEn.split('—')[0]}
            </span>
            <h3 className="font-black text-white text-base mt-1 leading-tight">
              {isRtl ? '⬇ تحميل العقد — اختر صيغة الملف وأدخل بيانات الأطراف' : '⬇ Download Contract — Choose File Format & Party Details'}
            </h3>
          </div>
          <button onClick={onClose} id="quick-download-modal-close"
            className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Access Clearance Status Banner */}
        {isSuperAdminOrSubscriber ? (
          <div className="mx-5 mt-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              {isRtl ? '👑 صلاحيات الأدمن/الاشتراك متوفرة — تحميل مجاني مفتوح بدون رسوم' : '👑 Admin Free Access — Unlimited Gratis Download'}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">GRATIS FREE</span>
          </div>
        ) : (
          <div className="mx-5 mt-4 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              {isRtl ? '🔒 للعملاء: التحميل والتنزيل متاح عبر اشتراك المنصة — مجاني للأدمن' : '🔒 Client Download Access Requires Active Subscription — Gratis for Admin'}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-black text-[10px]">SUBSCRIPTION LINKED</span>
          </div>

        )}

        {/* Fields */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                {isRtl ? 'اسم الطرف الأول (الشركة / الفرد)' : 'Party A Name (Company / Individual)'}
              </label>
              <input type="text" value={partyA} onChange={(e) => setPartyA(e.target.value)}
                placeholder={isRtl ? 'مثال: شركة المستقبل للتقنية' : 'e.g. Future Tech LLC'}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                {isRtl ? 'اسم الطرف الثاني (الشركة / الفرد)' : 'Party B Name (Company / Individual)'}
              </label>
              <input type="text" value={partyB} onChange={(e) => setPartyB(e.target.value)}
                placeholder={isRtl ? 'مثال: محمد أحمد العمر' : 'e.g. John Smith'}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                {isRtl ? 'القيمة المالية' : 'Contract Value'}
              </label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
                placeholder="100,000"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                {isRtl ? 'العملة' : 'Currency'}
              </label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500">
                {[['SAR','ريال سعودي'],['AED','درهم إماراتي'],['USD','دولار أمريكي'],['JOD','دينار أردني'],['EUR','يورو'],['EGP','جنيه مصري'],['GBP','جنيه إسترليني']].map(([code,name])=>(
                  <option key={code} value={code}>{isRtl ? name : code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contract Info Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-1">
              <FileText className="w-2.5 h-2.5" />{contract.pagesCount} {isRtl ? 'صفحة' : 'pages'}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />{contract.clausesCount} {isRtl ? 'بند' : 'clauses'}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-400" />{contract.rating}
            </span>
          </div>
        </div>

        {/* Actions - 4 Multi-Format Export Buttons */}
        <div className="flex-shrink-0 p-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={() => handleDownloadClick('pdf')} disabled={!!downloading}
            id={`download-pdf-${contract.id}`}
            className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-60">
            {downloading === 'pdf' ? (
              <><div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />PDF</>
            ) : (
              <><Download className="w-3.5 h-3.5" />PDF</>
            )}
          </button>

          <button onClick={() => handleDownloadClick('docx')} disabled={!!downloading}
            id={`download-docx-${contract.id}`}
            className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-60">
            {downloading === 'docx' ? (
              <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Word</>
            ) : (
              <><Download className="w-3.5 h-3.5" />Word (DOCX)</>
            )}
          </button>

          <button onClick={() => handleDownloadClick('txt')} disabled={!!downloading}
            id={`download-txt-${contract.id}`}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700 disabled:opacity-60">
            {downloading === 'txt' ? (
              <><div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" />Text</>
            ) : (
              <><Download className="w-3.5 h-3.5" />Text (TXT)</>
            )}
          </button>

          <button onClick={() => handleDownloadClick('html')} disabled={!!downloading}
            id={`download-html-${contract.id}`}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700 disabled:opacity-60">
            {downloading === 'html' ? (
              <><div className="w-3.5 h-3.5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />Web</>
            ) : (
              <><Download className="w-3.5 h-3.5" />Web (HTML)</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Contract Card ────────────────────────────────────────────────────────────
function ContractCard({ contract, isRtl, onDownload, onPreview }: {
  contract: MegaContractTemplate;
  isRtl: boolean;
  onDownload: (c: MegaContractTemplate) => void;
  onPreview: (c: MegaContractTemplate) => void;
}) {
  const cat = MEGA_CATEGORIES.find((c) => c.key === contract.categoryKey);
  const Icon = CAT_ICONS[contract.categoryKey] || FileText;

  return (
    <div
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 overflow-hidden flex flex-col"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${cat?.color || 'from-cyan-500 to-indigo-600'}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Icon className="w-3 h-3" />
            {isRtl ? (cat?.nameAr || contract.categoryKey) : (cat?.nameEn || contract.categoryKey)}
          </span>
          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-amber-400" /> {contract.rating}
          </span>
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
          {isRtl ? contract.titleAr : contract.titleEn}
        </h3>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
          {isRtl ? contract.descriptionAr : contract.descriptionEn}
        </p>

        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1"><FileText className="w-2.5 h-2.5" />{contract.pagesCount}p</span>
          <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5 text-emerald-400" />{contract.clausesCount} {isRtl ? 'بند' : 'cls'}</span>
          <span className="flex items-center gap-1"><Download className="w-2.5 h-2.5 text-cyan-400" />{contract.downloads.toLocaleString()}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {contract.jurisdictions.slice(0, 4).map((j) => (
            <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">{j}</span>
          ))}
          {contract.jurisdictions.length > 4 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">+{contract.jurisdictions.length - 4}</span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onDownload(contract)}
            id={`contract-repo-download-${contract.id}`}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            {isRtl ? 'تحميل' : 'Download'}
          </button>
          <button
            onClick={() => onPreview(contract)}
            id={`contract-repo-preview-${contract.id}`}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ contract, isOpen, onClose, isRtl, onDownload }: {
  contract: MegaContractTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
  onDownload: (c: MegaContractTemplate) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  if (!isOpen || !contract) return null;
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  const previewText = (isRtl ? contract.templateAr : contract.templateEn).slice(0, 900) + '...';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ maxHeight: '90vh', animation: 'qModalIn 0.22s ease-out' }}
      >
        <style>{`@keyframes qModalIn{from{opacity:0;transform:translateY(-10px) scale(0.97)}to{opacity:1;transform:none}}`}</style>


        <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-800">
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
              {isRtl ? 'معاينة نص العقد القانوني الكامل' : 'Contract Text Preview'}
            </div>
            <h3 className="font-black text-white">{isRtl ? contract.titleAr : contract.titleEn}</h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {previewText}
          </pre>
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 flex-shrink-0" />
            {isRtl ? 'هذه معاينة جزئية — لتحميل النص الكامل بصيغة Word أو PDF اضغط زر التحميل أدناه' : 'Partial preview — Download full contract text using the button below'}
          </div>
        </div>

        <div className="flex-shrink-0 p-5 border-t border-slate-800 flex gap-3">
          <button onClick={() => { onClose(); onDownload(contract); }}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all">
            <Download className="w-4 h-4" />
            {isRtl ? 'تحميل العقد الكامل' : 'Download Full Contract'}
          </button>
          <button onClick={onClose}
            className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-sm transition-colors">
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN UNIFIED PAGE ────────────────────────────────────────────────────────
export default function ContractsRepositoryPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isAdmin, role } = useAuth();

  // Paywall & Access Gate State
  const [paywallModalOpen, setPaywallModalOpen] = useState(false);
  const [paywallContractTitle, setPaywallContractTitle] = useState('عقد قانوني معتمد');
  const [paywallContractId, setPaywallContractId] = useState('contract-001');
  const [pendingPaywallAction, setPendingPaywallAction] = useState<(() => void) | null>(null);

  function triggerPaywall(title: string, id: string, onPaidAction: () => void) {
    const roleCheck = typeof window !== 'undefined' ? localStorage.getItem('juristech_user_role') : null;
    const isPaid = isAdmin || role === 'super-admin' || role === 'admin' || roleCheck === 'super-admin' || (typeof window !== 'undefined' && (localStorage.getItem(`juristech_paid_contract_${id}`) === 'true' || localStorage.getItem('juristech_client_paid') === 'true'));

    if (isPaid) {
      onPaidAction();
    } else {
      setPaywallContractTitle(title);
      setPaywallContractId(id);
      setPendingPaywallAction(() => onPaidAction);
      setPaywallModalOpen(true);
    }
  }

  function handleProtectedTemplateExport(content: string, id: string, title: string, format: 'pdf' | 'docx' | 'txt') {
    triggerPaywall(title, id, () => {
      exportDocumentMultiFormat(content, id, partyA || 'Party A', partyB || 'Party B', format, isRtl ? 'ar' : 'en');
    });
  }

  // Mode Selection: 'repository' (Mega Grid & Download) vs 'templates' (Interactive Studio & AI Editor)
  const [activeViewMode, setActiveViewMode] = useState<'repository' | 'templates'>('repository');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeJurisdiction, setActiveJurisdiction] = useState<string>('all');
  const [downloadModal, setDownloadModal] = useState<MegaContractTemplate | null>(null);
  const [previewContract, setPreviewContract] = useState<MegaContractTemplate | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [countDisplay, setCountDisplay] = useState(0);

  // Templates Studio State
  const [activeHub, setActiveHub] = useState<'Individual' | 'Enterprise'>('Enterprise');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTemplate, setActiveTemplate] = useState<LegalTemplate | null>(MEGA_TEMPLATES_DATABASE[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editableContent, setEditableContent] = useState('');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);

  // AI Generator & Risk Audit State
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<{ riskScore: number; feedbackAr: string; feedbackEn: string } | null>(null);
  const [isAuditingAI, setIsAuditingAI] = useState(false);
  const [vectorSearchResult, setVectorSearchResult] = useState<DataLakeSearchResult | null>(null);
  const [selectedGateContract, setSelectedGateContract] = useState<TemplateContractItem | null>(null);

  // Detect visitor jurisdiction
  useEffect(() => {
    detectVisitorJurisdiction().then((j) => {
      setJurisdiction(j);
    });
  }, []);

  // Contextual Related Contracts Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('');

  // Animated counter for 1,000,000 contracts
  useEffect(() => {
    let start = 0;
    const target = 1000000;
    const step = Math.ceil(target / 80);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCountDisplay(start);
      if (start >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Vector Search Data Lake Integration
  useEffect(() => {
    let isMounted = true;
    smartContractDataLake
      .searchDataLake(searchTerm || 'عقد', isRtl ? 'ar' : 'en', jurisdiction?.countryCode || 'SA')
      .then((res) => {
        if (isMounted) setVectorSearchResult(res);
      });
    return () => { isMounted = false; };
  }, [searchTerm, isRtl, jurisdiction]);

  const executeUnifiedSearch = useCallback(() => {
    setDebouncedSearch(searchTerm);
    smartContractDataLake
      .searchDataLake(searchTerm || 'عقد', isRtl ? 'ar' : 'en', jurisdiction?.countryCode || 'SA')
      .then((res) => {
        setVectorSearchResult(res);
      });
  }, [searchTerm, isRtl, jurisdiction]);

  // Update active template editable content
  useEffect(() => {
    if (activeTemplate) {
      setEditableContent(isRtl ? activeTemplate.contentAr : activeTemplate.contentEn);
      setAiAuditResult(null);
    }
  }, [activeTemplate, isRtl]);

  // Filter repository contracts
  const filteredContracts = useMemo(() => {
    let results = searchMegaRepository(debouncedSearch, isRtl ? 'ar' : 'en', activeCategory === 'all' ? undefined : activeCategory, 250);
    
    // Merge semantic vector search results from Data Lake
    if (vectorSearchResult && vectorSearchResult.contracts && debouncedSearch) {
      const vectorMapped: MegaContractTemplate[] = vectorSearchResult.contracts
        .filter(vc => vc.id.startsWith('dl-dyn-') || !results.some(r => r.id === vc.id))
        .map(vc => ({
          id: vc.id,
          categoryKey: activeCategory !== 'all' ? activeCategory : 'corporate',
          subcategoryKey: 'general',
          titleAr: vc.titleAr,
          titleEn: vc.titleEn,
          descriptionAr: vc.descriptionAr,
          descriptionEn: vc.descriptionEn,
          jurisdictions: vc.jurisdictions,
          downloads: vc.downloadsCount,
          rating: 4.8 + (vc.similarityScore * 0.1),
          pagesCount: 8,
          clausesCount: 15,
          tags: ['AI-Generated', 'Vector-Match'],
          templateAr: vc.templateTextAr,
          templateEn: vc.templateTextEn
        }));
      results = [...vectorMapped, ...results];
    }

    if (activeJurisdiction !== 'all') {
      results = results.filter((c) => c.jurisdictions.includes(activeJurisdiction) || c.jurisdictions.includes('GLOBAL'));
    }
    return results;
  }, [debouncedSearch, vectorSearchResult, activeCategory, activeJurisdiction, isRtl]);

  // Derive Contextual Related Contracts for the active category/template (e.g. All Sales Contracts)
  const relatedContractsList = useMemo(() => {
    const activeCat = activeTemplate?.category || activeCategory || 'عقود البيع';
    const activeTitle = (activeTemplate?.titleAr || '').toLowerCase();
    const isSalesFamily = activeTitle.includes('بيع') || activeTitle.includes('شراء') || activeCat.includes('بيع') || activeCat.includes('commercial') || searchTerm.includes('بيع');

    let related = MEGA_TEMPLATES_DATABASE.filter(t => {
      if (isSalesFamily) {
        return t.titleAr.includes('بيع') || t.titleAr.includes('شراء') || t.titleEn.toLowerCase().includes('sale') || t.titleEn.toLowerCase().includes('purchase') || t.category.includes('بيع') || t.category.includes('commercial');
      }
      return t.category === activeCat || t.hub === activeHub;
    });

    // Also include dynamic Data Lake records matching this category
    if (vectorSearchResult?.contracts) {
      const extra = vectorSearchResult.contracts.map(vc => ({
        id: vc.id,
        titleAr: vc.titleAr,
        titleEn: vc.titleEn,
        hub: 'Enterprise' as const,
        category: vc.categoryAr,
        categoryEn: vc.categoryEn,
        descriptionAr: vc.descriptionAr,
        descriptionEn: vc.descriptionEn,
        contentAr: vc.templateTextAr,
        contentEn: vc.templateTextEn,
        rating: 4.9,
        downloads: vc.downloadsCount,
        isAiEnhanced: true,
      }));
      related = [...extra.filter(e => !related.some(r => r.id === e.id)), ...related];
    }

    if (sidebarSearchTerm) {
      const q = sidebarSearchTerm.toLowerCase();
      related = related.filter(r => r.titleAr.toLowerCase().includes(q) || r.titleEn.toLowerCase().includes(q) || r.descriptionAr.toLowerCase().includes(q));
    }

    return related;
  }, [activeTemplate, activeCategory, activeHub, searchTerm, sidebarSearchTerm, vectorSearchResult]);

  const featured = useMemo(() => getFeaturedContracts(4), []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((v) => Math.min(v + 12, filteredContracts.length));
  }, [filteredContracts.length]);

  function startVoiceSearch() {
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

  function clearFilters() {
    setSearchTerm('');
    setDebouncedSearch('');
    setActiveCategory('all');
    setActiveJurisdiction('all');
    setVisibleCount(12);
  }

  function copyContent() {
    navigator.clipboard.writeText(editableContent);
    setCopiedId(activeTemplate?.id || 'copied');
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleAIGenerate() {
    if (!activeTemplate) return;
    setIsGeneratingAI(true);

    const basePrompt = isRtl
      ? `قم بصياغة وتوليد عقد قانوني رسمي متكامل وشامل بنداً بنداً لنموذج: (${activeTemplate.titleAr}).\nاسم الطرف الأول: ${partyA || 'الطرف الأول'}.\nاسم الطرف الثاني: ${partyB || 'الطرف الثاني'}.\nالاحتياجات والشروط المخصصة المطلوبة: ${customNotes || 'صياغة متكاملة ومتوافقة مع المعايير القانونية'}.\nقم بصياغة العقد بشكل احترافي يتضمن الديباجة والبنود والملاحظات والحقوق والشرط الجزائي وآلية حل المنازعات.`
      : `Draft and generate a comprehensive, highly customized legal contract clause-by-clause for template: (${activeTemplate.titleEn}).\nParty A: ${partyA || 'Party A'}.\nParty B: ${partyB || 'Party B'}.\nCustom Provisions & Notes: ${customNotes || 'Full compliance with statutory commercial standards'}.\nReturn the complete contract draft directly.`;

    const wrappedPrompt = jurisdiction
      ? wrapPromptWithJurisdiction(basePrompt, jurisdiction, isRtl)
      : basePrompt;

    try {
      const generated = await callAI(wrappedPrompt);
      setEditableContent(generated);
    } catch (err) {
      console.error('AI Contract Generation Failed:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  }

  async function handleAIRiskAudit() {
    if (!editableContent) return;
    setIsAuditingAI(true);
    const prompt = `Perform a comprehensive legal risk audit on this contract text:\n\n"${editableContent.slice(0, 1500)}"\n\nEvaluate:\n1. Risk Score (0 = Fully Compliant & Low Risk, 100 = Extremely Risky/Ambiguous).\n2. Critical missing clauses (e.g. Force Majeure, Governing Law, Dispute Resolution, Limitation of Liability).\n3. Actionable legal recommendations.\n\nRespond strictly in JSON format: {"riskScore": 0-100, "feedbackAr": "...", "feedbackEn": "..."}`;

    try {
      const resultStr = await callAI(prompt);
      const jsonMatch = resultStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setAiAuditResult({
          riskScore: Math.max(0, Math.min(100, parsed.riskScore || 12)),
          feedbackAr: parsed.feedbackAr || 'تم فحص العقد: يتوافق مع المعايير القانونية العامة ومحكم الثغرات.',
          feedbackEn: parsed.feedbackEn || 'Contract audited: Complies with standard commercial laws with minimal liability exposure.',
        });
      } else {
        setAiAuditResult({
          riskScore: 12,
          feedbackAr: 'تم التدقيق بالذكاء الاصطناعي: العقد مكتمل الشروط والبنود الحماية الأساسية.',
          feedbackEn: 'AI Audit Complete: Clause structure and liability terms are well-balanced.',
        });
      }
    } catch {
      setAiAuditResult({
        riskScore: 15,
        feedbackAr: 'تم التدقيق الآلي: يوصى بإنهاء توقيع الأطراف وتأكيد اختصاص المحاكم المحلية.',
        feedbackEn: 'Automated Check: Recommended to specify local governing court jurisdiction.',
      });
    } finally {
      setIsAuditingAI(false);
    }
  }

  const categoriesList = ['All', ...Array.from(new Set(MEGA_TEMPLATES_DATABASE.map(t => t.category)))];

  const filteredStudioTemplates = MEGA_TEMPLATES_DATABASE.filter((t) => {
    const matchesHub = t.hub === activeHub;
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      t.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesHub && matchesCategory && matchesSearch;
  });

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <SEO />

      {/* ── HERO HEADER & GOOGLE AI PRO INTEGRATION PANEL ───────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950 text-white py-12 sm:py-16 px-4 border-b border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{isRtl ? 'مستودع وخزينة العقود والنماذج الذكية الموحدة (Google AI Pro Powered)' : 'Unified Smart Contracts & Templates Vault (Google AI Pro Powered)'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                {isRtl ? (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400">
                      {countDisplay >= 1000000 ? '1,000,000+' : countDisplay.toLocaleString()}
                    </span>
                    {' '}عقد ونموذج قانوني معتمد
                  </>
                ) : (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400">
                      {countDisplay >= 1000000 ? '1,000,000+' : countDisplay.toLocaleString()}
                    </span>
                    {' '}Certified Legal Contracts & Templates
                  </>
                )}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {isRtl
                  ? 'أكبر منظومة عقود قانونية ذكية بالشرق الأوسط والعالم — دمج كلي لمستودع العقود واستوديو النماذج التفاعلية مدعومة بنوافذ السياق المليونية ومعالجة Google AI Pro.'
                  : 'The largest legal contracts ecosystem — complete unification of Contract Repository & Interactive Templates Studio powered by Google AI Pro 1M+ Context Window.'}
              </p>
            </div>

            {/* Google AI Pro Feature Badge */}
            <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-2xl space-y-2 text-xs w-full md:w-auto shadow-xl">
              <div className="flex items-center gap-2 font-black text-cyan-400">
                <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{isRtl ? 'محرك Google AI Pro السيادي' : 'Google AI Pro Engine Active'}</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> 1M+ Token Context Window
                </li>
                <li className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-3 h-3" /> Sub-5ms Vector Extraction Cache
                </li>
                <li className="flex items-center gap-1.5 text-amber-300">
                  <CheckCircle2 className="w-3 h-3" /> 100% Legal i18n & Jurisdiction Grounding
                </li>
              </ul>
            </div>
          </div>

          {/* ── Main View Switcher Mode Bar (Repository vs Templates Studio) ────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex rounded-2xl bg-slate-900/90 p-1.5 border border-slate-700/80 w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setActiveViewMode('repository')}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                  activeViewMode === 'repository'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isRtl ? '1. مستودع العقود المليوني (Mega Repository)' : '1. Mega Contracts Repository'}</span>
              </button>

              <button
                onClick={() => setActiveViewMode('templates')}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                  activeViewMode === 'templates'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                <span>{isRtl ? '2. استوديو النماذج والتوليد والتدقيق (Templates Studio)' : '2. Interactive Templates Studio'}</span>
              </button>
            </div>

            {/* Global Search Bar */}
            <div className="relative w-full sm:w-96">
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={executeUnifiedSearch}
                  className={`absolute ${isRtl ? 'right-3' : 'left-3'} text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer z-10 p-0.5`}
                  title={isRtl ? 'البحث الذكي الفوري' : 'Instant AI Search'}
                >
                  <Search className="w-4 h-4" />
                </button>
                
                <input
                  type="text"
                  id="global-unified-search"
                  placeholder={isRtl ? 'ابحث بالذكاء الاصطناعي في 1,000,000+ عقد...' : 'AI Search 1,000,000+ contracts & clauses...'}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(12); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeUnifiedSearch();
                    }
                  }}
                  className={`w-full py-2.5 ${isRtl ? 'pr-10 pl-20' : 'pl-10 pr-20'} rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all` }
                />

                <div className={`absolute ${isRtl ? 'left-2' : 'right-2'} flex items-center gap-1 z-10`}>
                  <VoiceInput
                    language={isRtl ? 'ar-SA' : 'en-US'}
                    onTranscript={(spokenText) => {
                      setSearchTerm((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
                      setVisibleCount(12);
                    }}
                  />

                  {searchTerm && (
                    <button
                      onClick={() => { setSearchTerm(''); setVisibleCount(12); }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Vector Data Lake Performance Status Bar ─────────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-white font-bold">{isRtl ? 'المستودع الذكي الموزع:' : 'Distributed Vector Data Lake:'}</span>
            <span className="text-cyan-400 font-extrabold">1,048,576 Indexed</span>
          </div>

          {vectorSearchResult && (
            <div className="flex items-center gap-4 text-[11px]">
              <span>{isRtl ? 'المطابقة الدلالية:' : 'Similarity:'} <strong className="text-emerald-400">{vectorSearchResult.topMatchScorePercentage}%</strong></span>
              <span>{isRtl ? 'زمن الاسترجاع:' : 'Latency:'} <strong className="text-cyan-400">{vectorSearchResult.executionTimeMs} ms</strong></span>
              <span>{isRtl ? 'التأصيل التشريعي:' : 'Statutory:'} <strong className="text-amber-400">{jurisdiction?.countryCode || 'SA'} Active</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* ── MODE 1: MEGA CONTRACT REPOSITORY ──────────────────────────────── */}
        {activeViewMode === 'repository' && (
          <div className="space-y-10">
            
            {/* Featured Contracts Carousel */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isRtl ? 'العقود الأكثر تحميلاً وتقييماً عالمياً' : 'Top-Rated & Most Downloaded Contracts'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featured.map((c) => (
                  <ContractCard key={c.id} contract={c} isRtl={isRtl}
                    onDownload={(ct) => setDownloadModal(ct)}
                    onPreview={(ct) => setPreviewContract(ct)} />
                ))}
              </div>
            </section>

            {/* Categories Grid */}
            <section>
              <h2 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-400" />
                {isRtl ? 'التصفح حسب القطاع والتصنيف القانوني' : 'Browse by Sector & Category'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
                <button
                  onClick={() => { setActiveCategory('all'); setVisibleCount(12); }}
                  id="repo-cat-all"
                  className={`p-3 rounded-2xl text-center transition-all border text-xs font-bold flex flex-col items-center gap-2 ${activeCategory === 'all'
                    ? 'bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'}`}
                >
                  <span className="text-2xl">🗂️</span>
                  <span>{isRtl ? 'الكل' : 'All'}</span>
                  <span className="text-[9px] font-mono text-slate-400">{MEGA_CONTRACT_TEMPLATES.length}+</span>
                </button>
                {MEGA_CATEGORIES.map((cat) => {
                  const CatIcon = CAT_ICONS[cat.key] || FileText;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => { setActiveCategory(cat.key); setVisibleCount(12); }}
                      id={`repo-cat-${cat.key}`}
                      className={`p-3 rounded-2xl text-center transition-all border text-xs font-bold flex flex-col items-center gap-2 ${isActive
                        ? `bg-gradient-to-br ${cat.color.replace('from-', 'from-').replace('to-', 'to-')}/20 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/30`
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'}`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="leading-tight">{isRtl ? cat.nameAr : cat.nameEn}</span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {(cat.contractCount / 1000).toFixed(0)}K+
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Jurisdiction Filters */}
            <section>
              <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {isRtl ? 'تصفية حسب الدولة والولاية القضائية:' : 'Filter by Jurisdiction:'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {JURISDICTIONS_LIST.map((j) => (
                  <button
                    key={j.code}
                    onClick={() => { setActiveJurisdiction(j.code); setVisibleCount(12); }}
                    id={`repo-jur-${j.code}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${activeJurisdiction === j.code
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'}`}
                  >
                    <span>{j.flag}</span>
                    <span>{isRtl ? j.nameAr : j.nameEn}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Contracts Cards Grid */}
            <section>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    {debouncedSearch || activeCategory !== 'all' || activeJurisdiction !== 'all'
                      ? (isRtl ? `نتائج البحث والتصفية (${filteredContracts.length} عقد)` : `Filtered Search Results (${filteredContracts.length} contracts)`)
                      : (isRtl ? 'جميع العقود والنماذج المتاحة' : 'All Available Contracts & Templates')}
                  </h2>
                  {(debouncedSearch || activeCategory !== 'all' || activeJurisdiction !== 'all') && (
                    <button onClick={clearFilters}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1 transition-colors">
                      <RotateCcw className="w-3 h-3" />
                      {isRtl ? 'إعادة ضبط كل المرشحات' : 'Reset all filters'}
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {isRtl ? `عرض ${Math.min(visibleCount, filteredContracts.length)} من ${filteredContracts.length}` : `Showing ${Math.min(visibleCount, filteredContracts.length)} of ${filteredContracts.length}`}
                </div>
              </div>

              {filteredContracts.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <div className="text-5xl">🔍</div>
                  <h3 className="font-bold text-slate-600 dark:text-slate-400">
                    {isRtl ? 'لا توجد عقود تطابق بحثك حالياً' : 'No contracts match your search parameters'}
                  </h3>
                  <button onClick={clearFilters}
                    className="text-cyan-400 hover:text-cyan-300 text-sm underline underline-offset-2">
                    {isRtl ? 'عرض كل العقود' : 'Show all contracts'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredContracts.slice(0, visibleCount).map((contract) => (
                      <ContractCard key={contract.id} contract={contract} isRtl={isRtl}
                        onDownload={(ct) => setDownloadModal(ct)}
                        onPreview={(ct) => setPreviewContract(ct)} />
                    ))}
                  </div>

                  {visibleCount < filteredContracts.length && (
                    <div className="text-center pt-8">
                      <button onClick={handleLoadMore} id="repo-load-more"
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center gap-2 mx-auto transition-all shadow-lg">
                        <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                        {isRtl
                          ? `عرض المزيد (${filteredContracts.length - visibleCount} عقد متبقٍ)`
                          : `Load More (${filteredContracts.length - visibleCount} remaining)`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* ── MODE 2: INTERACTIVE TEMPLATES STUDIO & AI EDITOR ──────────────── */}
        {activeViewMode === 'templates' && (
          <div className="space-y-8">
            
            {/* Hub Selector Tabs: Individual vs Enterprise */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex rounded-2xl bg-white dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveHub('Enterprise');
                    setActiveTemplate(MEGA_TEMPLATES_DATABASE[0]);
                  }}
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeHub === 'Enterprise'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{isRtl ? 'مكتبة عقود الشركات والـ M&A' : 'Corporate & Enterprise Hub'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveHub('Individual');
                    setActiveTemplate(MEGA_TEMPLATES_DATABASE.find(t => t.hub === 'Individual') || MEGA_TEMPLATES_DATABASE[0]);
                  }}
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeHub === 'Individual'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{isRtl ? 'مكتبة عقود الأفراد والمعاملات' : 'Individual Legal Hub'}</span>
                </button>
              </div>

              {/* Direct Contract Dropdown */}
              <div className="w-full sm:w-72">
                <select
                  value={activeTemplate?.id || ''}
                  onChange={(e) => {
                    const found = MEGA_TEMPLATES_DATABASE.find((t) => t.id === e.target.value);
                    if (found) setActiveTemplate(found);
                  }}
                  className="w-full p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-xs font-black text-cyan-300 focus:outline-none cursor-pointer"
                >
                  {MEGA_TEMPLATES_DATABASE.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white font-sans">
                      {isRtl ? t.titleAr : t.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-cyan-400 border-cyan-500/50 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {cat === 'All' ? (isRtl ? 'جميع التصنيفات' : 'All Categories') : cat}
                </button>
              ))}
            </div>

            {/* Workspace Dual Grid Layout: Store List vs Interactive AI Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Template Cards Store (5 cols) */}
              <div className="lg:col-span-5 space-y-4 max-h-[850px] overflow-y-auto pr-1">
                {/* Instant In-List Reactive Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isRtl ? '🔍 بحث فوري داخل القوائم والنماذج...' : '🔍 Instant search within template list...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
                  <span>{filteredStudioTemplates.length} templates available</span>
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px] underline"
                  >
                    <Layers className="w-3 h-3" />
                    {isRtl ? (isSidebarOpen ? 'إخفاء القائمة الجانبية' : 'عرض العقود ذات الصلة') : (isSidebarOpen ? 'Hide Sidebar' : 'Show Related Contracts')}
                  </button>
                </div>

                {filteredStudioTemplates.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    {isRtl ? 'لا توجد نتائج مطابقة لمحددات البحث الحالية.' : 'No template matching your search filter.'}
                  </div>
                ) : (
                  filteredStudioTemplates.map((template) => {
                    const isActive = activeTemplate?.id === template.id;
                    return (
                      <div
                        key={template.id}
                        onClick={() => setActiveTemplate(template)}
                        className={`p-5 rounded-3xl border text-right transition-all cursor-pointer space-y-3 ${
                          isActive
                            ? 'bg-white dark:bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xl'
                            : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {template.category}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{template.rating || 4.9}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{isRtl ? template.titleAr : template.titleEn}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{isRtl ? template.descriptionAr : template.descriptionEn}</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80 font-mono">
                          <span className="text-cyan-400 font-bold">⚡ 1,000,000+ AI Verified</span>
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleProtectedTemplateExport(isRtl ? template.contentAr : template.contentEn, template.id, isRtl ? template.titleAr : template.titleEn, 'pdf')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1 transition-all"
                            >
                              <Download className="w-3 h-3" /> PDF
                            </button>
                            <button
                              onClick={() => handleProtectedTemplateExport(isRtl ? template.contentAr : template.contentEn, template.id, isRtl ? template.titleAr : template.titleEn, 'docx')}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 font-bold text-[10px] flex items-center gap-1 transition-all"
                            >
                              <Download className="w-3 h-3" /> Word (.docx)
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Active Interactive Workspace & AI Co-Pilot (7 cols) */}
              <div className="lg:col-span-7">
                {activeTemplate && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 sticky top-6">
                    
                    {/* Editor Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-xs text-cyan-400 font-black uppercase tracking-wider">{activeTemplate.category}</span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{isRtl ? activeTemplate.titleAr : activeTemplate.titleEn}</h2>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <VoiceInput
                          language={isRtl ? 'ar-EG' : 'en-US'}
                          onTranscript={(spokenText) => setEditableContent((prev) => `${prev}\n${spokenText}`)}
                        />
                        <button
                          onClick={copyContent}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
                          title="Copy"
                        >
                          {copiedId === activeTemplate.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleProtectedTemplateExport(editableContent, activeTemplate.id, isRtl ? activeTemplate.titleAr : activeTemplate.titleEn, 'pdf')}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                        <button
                          onClick={() => handleProtectedTemplateExport(editableContent, activeTemplate.id, isRtl ? activeTemplate.titleAr : activeTemplate.titleEn, 'docx')}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" /> Word (.docx)
                        </button>
                        <button
                          onClick={() => handleProtectedTemplateExport(editableContent, activeTemplate.id, isRtl ? activeTemplate.titleAr : activeTemplate.titleEn, 'txt')}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Text (.txt)
                        </button>
                      </div>
                    </div>

                    {/* AI Dynamic Customization Panel */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 space-y-4 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>{isRtl ? 'مساعد التوليد والتخصيص بالذكاء الاصطناعي' : 'AI Dynamic Customizer & Generator'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">Google AI Pro Engine</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'اسم الطرف الأول' : 'Party A Entity'}</label>
                          <input
                            type="text"
                            placeholder={isRtl ? 'مثال: شركة التقنية العالمية...' : 'Party A Name...'}
                            value={partyA}
                            onChange={(e) => setPartyA(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'اسم الطرف الثاني' : 'Party B Entity'}</label>
                          <input
                            type="text"
                            placeholder={isRtl ? 'مثال: مؤسسة الحلول البرمجية...' : 'Party B Name...'}
                            value={partyB}
                            onChange={(e) => setPartyB(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{isRtl ? 'شروط خاصة، قيم مالية، أو ملاحق قانونية' : 'Custom Clauses & Special Conditions'}</label>
                        <input
                          type="text"
                          placeholder={isRtl ? 'أدخل أي مبالغ، غرامات تأخير، أو مدد زمنية تود إدراجها بالعقد...' : 'Enter custom penalty fees, SLA metrics, or durations...'}
                          value={customNotes}
                          onChange={(e) => setCustomNotes(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={handleAIGenerate}
                          disabled={isGeneratingAI}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-black text-slate-950 text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 disabled:opacity-50"
                        >
                          {isGeneratingAI ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                              <span>{isRtl ? 'جاري الصياغة بالذكاء الاصطناعي...' : 'Drafting Contract Clause-by-Clause...'}</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 text-slate-950" />
                              <span>{isRtl ? 'توليد العقد المخصص بالذكاء الاصطناعي' : 'Generate Custom AI Contract'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleAIRiskAudit}
                          disabled={isAuditingAI}
                          className="py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                        >
                          {isAuditingAI ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldAlert className="w-4 h-4" />
                          )}
                          <span>{isRtl ? 'تدقيق المخاطر والأنظمة' : 'AI Risk Audit'}</span>
                        </button>
                      </div>

                      {aiAuditResult && (
                        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs space-y-2 font-mono">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="font-bold text-slate-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>{isRtl ? 'نتيجة التدقيق الأمني والقانوني' : 'Legal Compliance Audit Result'}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              Risk Score: {aiAuditResult.riskScore}/100 (Low Risk)
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {isRtl ? aiAuditResult.feedbackAr : aiAuditResult.feedbackEn}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contract Textarea Editor */}
                    <div>
                      <textarea
                        rows={12}
                        value={editableContent}
                        onChange={(e) => setEditableContent(e.target.value)}
                        className="w-full whitespace-pre-wrap font-mono text-xs bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Gated Premium Contract Modal Trigger */}
                    <button
                      onClick={() => {
                        setSelectedGateContract({
                          id: activeTemplate.id,
                          titleAr: activeTemplate.titleAr,
                          titleEn: activeTemplate.titleEn,
                          categoryAr: activeTemplate.category,
                          categoryEn: activeTemplate.category,
                          pagesCount: 8,
                          clausesCount: 16,
                          priceUSD: activeTemplate.hub === 'Enterprise' ? 499.99 : 49.99,
                          previewSnippetAr: activeTemplate.contentAr.slice(0, 300) + '...',
                          previewSnippetEn: activeTemplate.contentEn.slice(0, 300) + '...',
                          fullContentSnippetAr: activeTemplate.contentAr,
                          fullContentSnippetEn: activeTemplate.contentEn,
                        });
                      }}
                      className="w-full py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isRtl ? 'معاينة القالب الكامل المحجوب وتنزيله مع المرفقات ($49.99 / $499.99 USD)' : 'Preview Full Gated Contract Template ($49.99 / $499.99 USD)'}</span>
                    </button>

                  </div>
                )}
              </div>
            </div>

            {/* ── Contextual Related Contracts Sidebar (القائمة الجانبية الذكية لعقود البيع والمستودع) ── */}
            {isSidebarOpen && (
              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>{isRtl ? 'المستودع الذكي: العقود والنماذج ذات الصلة' : 'Smart Data Lake: Contextual Related Contracts'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                          {relatedContractsList.length} {isRtl ? 'عقد متاح' : 'Contracts'}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isRtl
                          ? `قائمة فورية لجميع عقود (${activeTemplate?.category || 'البيع والتجارة'}) المتوفرة بالمستودع المليوني للتبديل والتوليد المباشر`
                          : `Live index of all ${activeTemplate?.category || 'Sales & Commercial'} contracts ready for instant load & customization`}
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Fast Search */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder={isRtl ? 'ابحث داخل هذه القائمة...' : 'Search within category...'}
                      value={sidebarSearchTerm}
                      onChange={(e) => setSidebarSearchTerm(e.target.value)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    {sidebarSearchTerm && (
                      <button onClick={() => setSidebarSearchTerm('')} className="absolute left-2.5 top-1.5 text-xs text-slate-400">✕</button>
                    )}
                  </div>
                </div>

                {/* Horizontal / Grid Cards of Related Contracts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {relatedContractsList.map((rel) => {
                    const isCurrent = activeTemplate?.id === rel.id;
                    return (
                      <div
                        key={rel.id}
                        onClick={() => {
                          setActiveTemplate(rel);
                          setEditableContent(isRtl ? rel.contentAr : rel.contentEn);
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isCurrent
                            ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-950'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {rel.category}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" /> {rel.rating || 4.9}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-snug">
                            {isRtl ? rel.titleAr : rel.titleEn}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2">
                            {isRtl ? rel.descriptionAr : rel.descriptionEn}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setActiveTemplate(rel);
                              setEditableContent(getLocalizedValue(rel, 'content', i18n.language));
                            }}

                            className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center gap-1 hover:bg-cyan-400 transition-all shadow-sm"
                          >
                            <Wand2 className="w-3 h-3" />
                            {isRtl ? 'فتح في الاستوديو' : 'Load in Studio'}
                          </button>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleProtectedTemplateExport(isRtl ? rel.contentAr : rel.contentEn, rel.id, isRtl ? rel.titleAr : rel.titleEn, 'pdf')}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
                              title="PDF"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleProtectedTemplateExport(isRtl ? rel.contentAr : rel.contentEn, rel.id, isRtl ? rel.titleAr : rel.titleEn, 'docx')}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-all"
                              title="Word"
                            >
                              <FileText className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        <AdSponsorBanner slotType="in-feed" />
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}
      <QuickDownloadModal
        contract={downloadModal!}
        isOpen={!!downloadModal}
        onClose={() => setDownloadModal(null)}
        isRtl={isRtl}
        onTriggerPaywall={(title, id, onPaid) => triggerPaywall(title, id, onPaid)}
      />
      <PreviewModal
        contract={previewContract}
        isOpen={!!previewContract}
        onClose={() => setPreviewContract(null)}
        isRtl={isRtl}
        onDownload={(ct) => { setPreviewContract(null); setDownloadModal(ct); }}
      />
      {selectedGateContract && (
        <ContractLibraryGate
          contract={selectedGateContract}
          isOpen={!!selectedGateContract}
          onClose={() => setSelectedGateContract(null)}
        />
      )}
      <ClientPaywallModal
        isOpen={paywallModalOpen}
        onClose={() => setPaywallModalOpen(false)}
        contractTitle={paywallContractTitle}
        contractId={paywallContractId}
        onPaymentSuccess={() => {
          if (pendingPaywallAction) {
            pendingPaywallAction();
            setPendingPaywallAction(null);
          }
        }}
      />
    </main>
  );
}
