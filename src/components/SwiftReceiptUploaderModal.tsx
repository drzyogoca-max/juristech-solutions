/**
 * src/components/SwiftReceiptUploaderModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dedicated Secure SWIFT Bank Transfer Receipt Upload Component
 *
 * Stores receipt files in encrypted backend storage path (/storage/financial/swifts/)
 * Restricts view & audit capabilities strictly to Financial Admins.
 */

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Lock, ShieldCheck, FileText, CheckCircle2, Loader2, AlertCircle, X, Building2 } from 'lucide-react';
import { swiftVaultService } from '../services/swiftVaultService';

interface SwiftReceiptUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
  planName?: string;
  amountUSD?: number;
}

export default function SwiftReceiptUploaderModal({
  isOpen,
  onClose,
  onSuccess,
  userEmail = '',
  planName = 'Enterprise Pro Suite',
  amountUSD = 49.99,
}: SwiftReceiptUploaderModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [file, setFile] = useState<File | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [emailInput, setEmailInput] = useState(userEmail);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError(isRtl ? 'حجم الملف يتجاوز الحد المسموح (10 ميجابايت)' : 'File size exceeds 10MB limit');
        return;
      }
      setFile(selected);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !transactionRef.trim() || !emailInput.trim()) {
      setError(isRtl ? 'يرجى إدخال جميع البيانات المطلوبة وإرفاق صورة السويفت البنكي' : 'Please fill all required fields and attach SWIFT receipt copy');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await swiftVaultService.uploadSwiftReceipt(file, {
        userId: emailInput.trim(),
        userEmail: emailInput.trim(),
        transactionRef: transactionRef.trim(),
        amount: amountUSD,
        planName: planName,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else {
        setError(res.error || (isRtl ? 'فشل إرفاق صورة السويفت البنكي' : 'Failed to upload SWIFT receipt'));
      }
    } catch (err: any) {
      setError(err.message || 'Upload exception');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg">
            <Upload className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono font-black tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
            {isRtl ? 'مستودع السويفت البنكي المشفر' : 'RESTRICTED FINANCIAL SWIFT VAULT'}
          </span>
          <h2 className="text-xl font-extrabold text-white">
            {isRtl ? 'إرفاق صورة السويفت البنكي (SWIFT Copy)' : 'Attach Bank Wire SWIFT Receipt'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl
              ? 'يتم أرشفة الإثبات وتخزينه في مسار مشفر (/storage/financial/swifts/) متاح حصراً للإدارة المالية للتدقيق اليدوي دون قطع خدمة الاشتراك.'
              : 'Receipt is stored in encrypted vault path (/storage/financial/swifts/) restricted exclusively to Financial Admins for manual review without service interruption.'}
          </p>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">
              {isRtl ? 'تم إرفاق السويفت وأرشفته بنجاح!' : 'SWIFT Receipt Uploaded & Archived!'}
            </h3>
            <p className="text-xs text-emerald-300">
              {isRtl
                ? 'تم إرسال الملف لمستودع الإدارة المالية وتفعيل الاشتراك مع الإبقاء على حالة الاستخدام النشطة.'
                : 'Receipt routed to Financial Admin repository. Account status remains active.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{isRtl ? 'البريد الإلكتروني للعميل' : 'Client Email'}</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="client@company.com"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isRtl ? 'اسم الشركة' : 'Company Name'}</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Al-Faris Corp"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{isRtl ? 'رقم الحوالة (SWIFT Ref)' : 'Transaction Ref'}</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="TX-880912"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* File Dropzone Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{isRtl ? 'صورة أو ملف السويفت (JPG / PNG / PDF)' : 'SWIFT Receipt Copy'}</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-900/60"
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <span className="text-[10px] text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">
                      {isRtl ? 'اضغط لإرفاق ملف السويفت البنكي' : 'Click to select SWIFT receipt file'}
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono">Max size: 10MB (.PDF, .PNG, .JPG)</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 font-black text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl text-xs active:scale-98"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isRtl ? 'تأكيد الحفظ في مستودع الإدارة المالية' : 'Archive to Financial Admin Vault'}</span>
            </button>
          </form>
        )}

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Encrypted SWIFT Vault</span>
          </span>
          <span>Financial Admins Only</span>
        </div>
      </div>
    </div>
  );
}
