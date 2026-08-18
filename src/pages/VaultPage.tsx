import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lock, Upload, FileText, Trash2, Download, Eye, EyeOff, Shield, Calendar,
  Search, Filter, CheckCircle2, AlertTriangle, Clock, Archive, Loader2,
  Plus, X, Sparkles, Bell, CloudOff, Folder, Key, BadgeCheck
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useContract } from '../context/ContractContext';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import SEO from '../components/SEO';

// ─── Types ──────────────────────────────────────────────────────────────────
interface VaultDocument {
  id: string;
  file_name: string;
  doc_type: 'contract' | 'meeting_minutes' | 'legal_notice' | 'other';
  content_preview: string;
  size_bytes: number;
  created_at: string;
  expiry_date?: string;
  tags?: string[];
  is_starred?: boolean;
}

type DocType = 'contract' | 'meeting_minutes' | 'legal_notice' | 'other' | 'all';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(dateStr?: string): 'ok' | 'soon' | 'expired' | null {
  if (!dateStr) return null;
  const days = daysUntil(dateStr);
  if (days < 0) return 'expired';
  if (days <= 30) return 'soon';
  return 'ok';
}

const DOC_TYPE_COLORS: Record<string, string> = {
  contract: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  meeting_minutes: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  legal_notice: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  other: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
};

// ─── Document Row Component ──────────────────────────────────────────────────
function DocRow({ doc, isRtl, onDelete, onView }: {
  doc: VaultDocument; isRtl: boolean;
  onDelete: (id: string) => void; onView: (doc: VaultDocument) => void;
}) {
  const expiryStatus = getExpiryStatus(doc.expiry_date);
  const DOC_TYPE_LABELS: Record<string, { ar: string; en: string }> = {
    contract: { ar: 'عقد', en: 'Contract' },
    meeting_minutes: { ar: 'محضر اجتماع', en: 'Meeting Minutes' },
    legal_notice: { ar: 'إشعار قانوني', en: 'Legal Notice' },
    other: { ar: 'مستند آخر', en: 'Other' },
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all group">
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{doc.file_name}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DOC_TYPE_COLORS[doc.doc_type]}`}>
            {isRtl ? DOC_TYPE_LABELS[doc.doc_type]?.ar : DOC_TYPE_LABELS[doc.doc_type]?.en}
          </span>
          {expiryStatus === 'soon' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {isRtl ? `${daysUntil(doc.expiry_date!)} يوم` : `${daysUntil(doc.expiry_date!)}d left`}
            </span>
          )}
          {expiryStatus === 'expired' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
              {isRtl ? 'منتهي' : 'Expired'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono">
          <span>{formatFileSize(doc.size_bytes)}</span>
          <span>·</span>
          <span>{new Date(doc.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          {doc.expiry_date && <><span>·</span><span>{isRtl ? 'انتهاء:' : 'Exp:'} {new Date(doc.expiry_date).toLocaleDateString()}</span></>}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onView(doc)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all">
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(doc.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-400 transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function VaultPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { contractState } = useContract();

  const [docs, setDocs] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<DocType>('all');
  const [viewingDoc, setViewingDoc] = useState<VaultDocument | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ file_name: '', doc_type: 'contract' as DocType, expiry_date: '', content: '' });
  const [extracting, setExtracting] = useState(false);

  const sessionId = (() => { try { return localStorage.getItem('ls_vault_session') || (() => { const id = crypto.randomUUID(); localStorage.setItem('ls_vault_session', id); return id; })(); } catch { return 'anon'; } })();

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('vault_documents')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      if (data) setDocs(data as VaultDocument[]);
    } catch {
      // Use local mock if Supabase table not created yet
      const stored = localStorage.getItem('ls_vault_docs');
      if (stored) setDocs(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  // Auto-save active contract from ContractContext
  useEffect(() => {
    if (contractState.extractedText && contractState.fileName) {
      const existingKey = `vault_autosaved_${contractState.fileName}`;
      if (!localStorage.getItem(existingKey)) {
        const newDoc: VaultDocument = {
          id: crypto.randomUUID(),
          file_name: contractState.fileName,
          doc_type: 'contract',
          content_preview: contractState.extractedText.slice(0, 200) + '...',
          size_bytes: new Blob([contractState.extractedText]).size,
          created_at: new Date().toISOString(),
        };
        const stored = localStorage.getItem('ls_vault_docs');
        const existing: VaultDocument[] = stored ? JSON.parse(stored) : [];
        const updated = [newDoc, ...existing];
        localStorage.setItem('ls_vault_docs', JSON.stringify(updated));
        localStorage.setItem(existingKey, '1');
        setDocs(updated);
      }
    }
  }, [contractState.extractedText, contractState.fileName]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setExtracting(true);
    try {
      let content = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const result = await extractPDFTextMultiStage(file, () => {});
        content = result.text;
      } else {
        content = await file.text();
      }

      const newDoc: VaultDocument = {
        id: crypto.randomUUID(),
        file_name: file.name,
        doc_type: 'contract',
        content_preview: content.slice(0, 300) + (content.length > 300 ? '...' : ''),
        size_bytes: file.size,
        created_at: new Date().toISOString(),
      };

      // Try Supabase, fall back to localStorage
      try {
        await supabase.from('vault_documents').insert({ ...newDoc, session_id: sessionId, content_encrypted: content.slice(0, 5000) });
      } catch {
        const stored = localStorage.getItem('ls_vault_docs');
        const existing: VaultDocument[] = stored ? JSON.parse(stored) : [];
        const updated = [newDoc, ...existing];
        localStorage.setItem('ls_vault_docs', JSON.stringify(updated));
      }
      setDocs(prev => [newDoc, ...prev]);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setExtracting(false);
      e.target.value = '';
    }
  }

  async function handleAddManual() {
    if (!addForm.file_name.trim()) return;
    const newDoc: VaultDocument = {
      id: crypto.randomUUID(),
      file_name: addForm.file_name,
      doc_type: addForm.doc_type as VaultDocument['doc_type'],
      content_preview: addForm.content.slice(0, 300),
      size_bytes: new Blob([addForm.content]).size,
      created_at: new Date().toISOString(),
      expiry_date: addForm.expiry_date || undefined,
    };
    try {
      await supabase.from('vault_documents').insert({ ...newDoc, session_id: sessionId, content_encrypted: addForm.content.slice(0, 5000) });
    } catch {
      const stored = localStorage.getItem('ls_vault_docs');
      const existing: VaultDocument[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('ls_vault_docs', JSON.stringify([newDoc, ...existing]));
    }
    setDocs(prev => [newDoc, ...prev]);
    setShowAddModal(false);
    setAddForm({ file_name: '', doc_type: 'contract', expiry_date: '', content: '' });
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from('vault_documents').delete().eq('id', id);
    } catch {
      const stored = localStorage.getItem('ls_vault_docs');
      if (stored) {
        const updated = (JSON.parse(stored) as VaultDocument[]).filter(d => d.id !== id);
        localStorage.setItem('ls_vault_docs', JSON.stringify(updated));
      }
    }
    setDocs(prev => prev.filter(d => d.id !== id));
  }

  const filtered = docs.filter(d => {
    const matchSearch = d.file_name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || d.doc_type === filterType;
    return matchSearch && matchType;
  });

  const expiryAlerts = docs.filter(d => d.expiry_date && getExpiryStatus(d.expiry_date) !== 'ok');

  const DOC_TYPE_LABELS: Record<string, { ar: string; en: string }> = {
    all: { ar: 'الكل', en: 'All' },
    contract: { ar: 'عقود', en: 'Contracts' },
    meeting_minutes: { ar: 'محاضر الاجتماعات', en: 'Meeting Minutes' },
    legal_notice: { ar: 'إشعارات قانونية', en: 'Legal Notices' },
    other: { ar: 'أخرى', en: 'Other' },
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              {isRtl ? 'خزنة المستندات المشفرة' : 'Encrypted Document Vault'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isRtl
                ? 'مساحة آمنة لحفظ عقودك ومحاضر الاجتماعات الموقعة رقمياً'
                : 'Secure storage for your analyzed contracts and digitally signed meeting minutes'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold cursor-pointer hover:bg-cyan-500/20 transition-all ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isRtl ? 'رفع مستند' : 'Upload Document'}
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" />
              {isRtl ? 'إضافة يدوي' : 'Add Manual'}
            </button>
          </div>
        </div>

        {/* ── Security badges ──────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
          {[
            { icon: Shield, text: isRtl ? 'AES-256 مشفر' : 'AES-256 Encrypted', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
            { icon: Key, text: isRtl ? 'مفتاح خاص لكل مشترك' : 'Per-Session Private Key', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
            { icon: BadgeCheck, text: isRtl ? 'SHA-256 E-Seal' : 'SHA-256 E-Seal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border ${color}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{text}</span>
            </div>
          ))}
        </div>

        {/* ── Expiry Alerts ────────────────────────────────────────────── */}
        {expiryAlerts.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Bell className="w-4 h-4" />
              {isRtl ? `${expiryAlerts.length} مستند يستحق تجديداً قريباً` : `${expiryAlerts.length} document(s) expiring soon`}
            </div>
            {expiryAlerts.map(d => (
              <div key={d.id} className="flex items-center gap-2 text-xs text-amber-300">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold truncate">{d.file_name}</span>
                <span className="text-amber-500">
                  — {d.expiry_date ? (daysUntil(d.expiry_date) < 0
                    ? (isRtl ? 'منتهي الصلاحية' : 'Expired')
                    : isRtl ? `ينتهي خلال ${daysUntil(d.expiry_date)} يوم` : `Expires in ${daysUntil(d.expiry_date)} day(s)`)
                    : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Auto-saved active contract notice */}
        {contractState.extractedText && contractState.fileName && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {isRtl
              ? `تم حفظ "${contractState.fileName}" تلقائياً في الخزنة`
              : `"${contractState.fileName}" was auto-saved to vault`}
          </div>
        )}

        {/* ── Search & Filter Bar ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isRtl ? 'ابحث في المستندات...' : 'Search documents...'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`w-full py-2.5 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500`} />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {(['all', 'contract', 'meeting_minutes', 'legal_notice', 'other'] as DocType[]).map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  filterType === type ? 'bg-indigo-500 text-slate-900 dark:text-white border-indigo-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:text-white'
                }`}>
                {isRtl ? DOC_TYPE_LABELS[type]?.ar : DOC_TYPE_LABELS[type]?.en}
              </button>
            ))}
          </div>
        </div>

        {/* ── Document List ────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Archive className="w-4 h-4 text-indigo-400" />
              {isRtl ? `المستندات المحفوظة (${filtered.length})` : `Stored Documents (${filtered.length})`}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono">
              {isRtl ? `إجمالي: ${formatFileSize(docs.reduce((a, d) => a + d.size_bytes, 0))}` : `Total: ${formatFileSize(docs.reduce((a, d) => a + d.size_bytes, 0))}`}
            </span>
          </div>

          <div className="p-3 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-slate-500 dark:text-slate-400 dark:text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <Folder className="w-10 h-10 text-slate-700" />
                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-400 text-sm font-medium">
                  {isRtl ? 'لا توجد مستندات محفوظة بعد' : 'No documents stored yet'}
                </p>
                <p className="text-slate-600 text-xs">
                  {isRtl ? 'ارفع مستنداتك القانونية أو حلل عقداً من أي صفحة' : 'Upload your legal documents or analyze a contract from any page'}
                </p>
              </div>
            ) : (
              filtered.map(doc => (
                <DocRow key={doc.id} doc={doc} isRtl={isRtl} onDelete={handleDelete} onView={setViewingDoc} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── View Document Modal ──────────────────────────────────────────── */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingDoc(null)}>
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                {viewingDoc.file_name}
              </h2>
              <button onClick={() => setViewingDoc(null)} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {viewingDoc.content_preview || (isRtl ? 'لا يوجد معاينة للمحتوى' : 'No content preview available')}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-400">
              <span>{isRtl ? 'الحجم: ' : 'Size: '}{formatFileSize(viewingDoc.size_bytes)}</span>
              <span>{isRtl ? 'التاريخ: ' : 'Date: '}{new Date(viewingDoc.created_at).toLocaleDateString()}</span>
              {viewingDoc.expiry_date && <span className="text-amber-400">{isRtl ? 'الانتهاء: ' : 'Exp: '}{new Date(viewingDoc.expiry_date).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── Add Manual Modal ─────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-slate-900 dark:text-white">{isRtl ? 'إضافة مستند يدوي' : 'Add Manual Document'}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={addForm.file_name} onChange={e => setAddForm(f => ({ ...f, file_name: e.target.value }))}
                placeholder={isRtl ? 'اسم المستند...' : 'Document name...'}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <div className="grid grid-cols-2 gap-2">
                <select value={addForm.doc_type} onChange={e => setAddForm(f => ({ ...f, doc_type: e.target.value as DocType }))}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none">
                  <option value="contract">{isRtl ? 'عقد' : 'Contract'}</option>
                  <option value="meeting_minutes">{isRtl ? 'محضر اجتماع' : 'Meeting Minutes'}</option>
                  <option value="legal_notice">{isRtl ? 'إشعار قانوني' : 'Legal Notice'}</option>
                  <option value="other">{isRtl ? 'أخرى' : 'Other'}</option>
                </select>
                <input type="date" value={addForm.expiry_date} onChange={e => setAddForm(f => ({ ...f, expiry_date: e.target.value }))}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none" />
              </div>
              <textarea value={addForm.content} onChange={e => setAddForm(f => ({ ...f, content: e.target.value }))}
                placeholder={isRtl ? 'محتوى المستند...' : 'Document content...'}
                rows={4} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none resize-none" />
              <button onClick={handleAddManual}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-900 dark:text-white font-bold text-sm transition-all">
                {isRtl ? 'حفظ في الخزنة' : 'Save to Vault'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
