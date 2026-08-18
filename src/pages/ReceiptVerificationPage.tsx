/**
 * ReceiptVerificationPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium AI-Powered Payment Receipt Verification Page
 * 
 * Flow:
 *  1. User enters Transaction Reference + Amount + Date
 *  2. User uploads receipt image
 *  3. OCR scans and extracts data
 *  4. Fraud engine checks for duplicates & mismatches
 *  5. Auto-activate (score ≥ 75) or flag for admin review (score < 75)
 *  6. Rejected if duplicate detected
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload, Shield, CheckCircle2, XCircle, AlertTriangle, Loader2,
  Eye, FileText, Zap, Lock, RefreshCw, ChevronRight, Camera,
  ClipboardCheck, DollarSign, Calendar, Hash, Star, Trash2
} from 'lucide-react';

import { supabase } from '../lib/supabaseClient';
import { extractReceiptData, validateImageFile } from '../lib/receiptOCR';
import { runFraudCheck, type ReceiptData, type FraudCheckResult } from '../lib/receiptFraudDetection';
import { getFinancialRepositoryRecords, purgeAndBlacklistReceipt } from '../lib/financialRepository';

type Step = 'form' | 'scanning' | 'result';

interface ScanProgress {
  percent: number;
  label: string;
}

function FraudScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    : score >= 50 ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    : 'text-red-400 border-red-500/40 bg-red-500/10';

  const label = score >= 75 ? '✅ نظيف' : score >= 50 ? '⚠️ مشبوه' : '🚫 محظور';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-black ${color}`}>
      <span className="text-2xl font-black">{score}</span>
      <span>/100</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function OcrField({ icon: Icon, labelAr, labelEn, value, match, isRtl }: {
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
  value: string | null;
  match?: boolean | null;
  isRtl: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/60 last:border-0">
      <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
      <span className="text-xs text-slate-600 dark:text-slate-400 w-28 shrink-0">{isRtl ? labelAr : labelEn}</span>
      <span className={`text-sm font-mono font-bold flex-1 ${value ? 'text-slate-900 dark:text-white' : 'text-slate-600 italic'}`}>
        {value ?? (isRtl ? 'لم يُكتشف' : 'Not detected')}
      </span>
      {match === true && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {match === false && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
      {match === null && value && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
    </div>
  );
}

export default function ReceiptVerificationPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [step, setStep] = useState<Step>('form');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [transactionRef, setTransactionRef] = useState('');
  const [claimedAmount, setClaimedAmount] = useState('');
  const [claimedDate, setClaimedDate] = useState('');
  const [planId] = useState('premium');
  const [planName] = useState('Premium Plan');

  const [progress, setProgress] = useState<ScanProgress>({ percent: 0, label: '' });
  const [fraudResult, setFraudResult] = useState<FraudCheckResult | null>(null);
  const [ocrResult, setOcrResult] = useState<Awaited<ReturnType<typeof extractReceiptData>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vaultRecords, setVaultRecords] = useState(getFinancialRepositoryRecords());

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVaultRecords(getFinancialRepositoryRecords());
  }, []);

  const handleImageDrop = useCallback((file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid file');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  }, []);

  const onDropZone = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageDrop(file);
  }, [handleImageDrop]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageDrop(file);
  };

  async function handleVerify() {
    if (!imageFile || !transactionRef || !claimedAmount || !claimedDate) {
      setError(isRtl ? 'يرجى ملء جميع الحقول ورفع صورة الإيصال' : 'Please fill all fields and upload a receipt image.');
      return;
    }

    setStep('scanning');
    setError(null);

    try {
      setProgress({ percent: 10, label: isRtl ? 'تهيئة محرك OCR...' : 'Initializing OCR engine...' });

      const ocr = await extractReceiptData(imageFile, (pct, lbl) => {
        setProgress({ percent: 10 + Math.round(pct * 0.5), label: lbl });
      });

      setOcrResult(ocr);
      setProgress({ percent: 65, label: isRtl ? 'جاري التحقق من الاحتيال...' : 'Running fraud checks...' });

      const { data: { user } } = await supabase.auth.getUser();

      const receiptData: ReceiptData = {
        userId: user?.id || null,
        transactionRef,
        claimedAmount: parseFloat(claimedAmount),
        claimedDate,
        imageFile,
        planId,
        planName,
      };

      setProgress({ percent: 80, label: isRtl ? 'التحقق من التكرار والاحتيال...' : 'Checking duplicates & fraud...' });

      const result = await runFraudCheck(receiptData, ocr);
      setFraudResult(result);

      if (result.autoActivate && user) {
        setProgress({ percent: 95, label: isRtl ? 'تفعيل الاشتراك تلقائياً...' : 'Auto-activating subscription...' });
        await supabase.from('subscriptions').upsert({
          user_id: user.id,
          plan_id: planId,
          plan_name: planName,
          status: 'active',
          activated_at: new Date().toISOString(),
          receipt_id: result.receiptId,
        });
      }

      setProgress({ percent: 100, label: isRtl ? 'اكتملت العملية' : 'Verification complete' });
      setStep('result');
      setVaultRecords(getFinancialRepositoryRecords());

    } catch (err: any) {
      setError(err?.message ?? 'Verification failed');
      setStep('form');
    }
  }

  async function handleDeleteAndBlacklist(id: string, email: string) {
    if (window.confirm(isRtl ? 'هل أنت تأكد من شطب الإيصال وإلغاء عضوية المستخدم نهائياً وحظره من المنصة؟' : 'Are you sure you want to delete this receipt and permanently revoke/blacklist this user?')) {
      await purgeAndBlacklistReceipt(id, email);
      setVaultRecords(getFinancialRepositoryRecords());
    }
  }

  function reset() {
    setStep('form');
    setImageFile(null);
    setImagePreview(null);
    setFraudResult(null);
    setOcrResult(null);
    setTransactionRef('');
    setClaimedAmount('');
    setClaimedDate('');
    setError(null);
    setProgress({ percent: 0, label: '' });
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4 pt-10">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5" />
            {isRtl ? 'نظام التحقق الآلي من الإيصالات' : 'AI Receipt Verification System'}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {isRtl ? 'التحقق الآلي من إيصال الدفع' : 'Automated Payment Receipt Verification'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isRtl
              ? 'رفع صورة الإيصال لاستخراج وتدقيق بياناتك تلقائياً ومنع الاحتيال'
              : 'Upload your receipt for instant AI-powered OCR extraction, duplicate detection & fraud prevention'}
          </p>
        </div>

        {step === 'form' && (
          <div className="space-y-5">
            <div
              onDrop={onDropZone}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-900/50 hover:border-slate-600'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileInput} />

              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Receipt" width={600} height={256} loading="lazy" decoding="async" className="w-full max-h-64 object-contain rounded-3xl" />

                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-3xl">
                    <p className="text-cyan-400 font-bold text-sm">
                      {isRtl ? 'انقر لتغيير الصورة' : 'Click to change image'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                    <Camera className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {isRtl ? 'اسحب أو انقر لرفع صورة الإيصال' : 'Drag & drop or click to upload receipt'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPEG, PNG, WebP — Max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 bg-slate-900/50 rounded-3xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-cyan-400" />
                {isRtl ? 'بيانات الحوالة' : 'Transaction Details'}
              </h3>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  {isRtl ? 'رقم مرجع الحوالة / Transaction Reference' : 'Transaction Reference Number'}
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder={isRtl ? 'مثال: TXN20240123456789' : 'e.g. TXN20240123456789'}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {isRtl ? 'المبلغ المدفوع' : 'Amount Paid'}
                  </label>
                  <input
                    type="number"
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(e.target.value)}
                    placeholder="99.00"
                    min="1"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {isRtl ? 'تاريخ التحويل' : 'Transfer Date'}
                  </label>
                  <input
                    type="date"
                    value={claimedDate}
                    onChange={(e) => setClaimedDate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={!imageFile || !transactionRef || !claimedAmount || !claimedDate}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-900 dark:text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Shield className="w-5 h-5" />
              {isRtl ? 'بدء التحقق الآلي الآن' : 'Start AI Verification Now'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="space-y-8 py-8">
            <div className="text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"
                  style={{ animationDuration: '1s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-cyan-400">{progress.percent}%</span>
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">{progress.label}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isRtl ? 'يرجى الانتظار — جاري تحليل الإيصال بالذكاء الاصطناعي' : 'Please wait — AI is analyzing your receipt'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: Camera, labelAr: 'قراءة الصورة (OCR)', labelEn: 'Image OCR Scan', threshold: 10 },
                { icon: FileText, labelAr: 'استخراج البيانات', labelEn: 'Data Extraction', threshold: 60 },
                { icon: Shield, labelAr: 'فحص التكرار والاحتيال', labelEn: 'Fraud & Duplicate Check', threshold: 65 },
                { icon: Lock, labelAr: 'تحليل النتائج', labelEn: 'Analyzing Results', threshold: 90 },
                { icon: Zap, labelAr: 'تفعيل الاشتراك', labelEn: 'Activating Subscription', threshold: 95 },
              ].map(({ icon: Icon, labelAr, labelEn, threshold }) => {
                const done = progress.percent > threshold;
                const active = progress.percent >= threshold && progress.percent <= threshold + 20;
                return (
                  <div key={threshold} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                    done ? 'bg-emerald-500/10 border-emerald-500/20' :
                    active ? 'bg-cyan-500/10 border-cyan-500/20' :
                    'bg-slate-900/30 border-slate-800/50'
                  }`}>
                    {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                     active ? <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" /> :
                     <Icon className="w-4 h-4 text-slate-600" />}
                    <span className={`text-sm font-bold ${done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-600'}`}>
                      {isRtl ? labelAr : labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 'result' && fraudResult && (
          <div className="space-y-5">
            <div className={`p-6 rounded-3xl border text-center space-y-3 ${
              fraudResult.status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/30' :
              fraudResult.status === 'flagged' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}>
              {fraudResult.status === 'verified' && (
                <>
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h2 className="text-xl font-black text-emerald-400">
                    {isRtl ? '✅ تم التحقق بنجاح — الاشتراك مفعّل' : '✅ Verified — Subscription Activated'}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {isRtl
                      ? 'تم التحقق من إيصالك بنجاح وتفعيل اشتراكك تلقائياً. يمكنك البدء فوراً!'
                      : 'Your receipt has been verified and your subscription is now active. Enjoy!'}
                  </p>
                </>
              )}
              {fraudResult.status === 'flagged' && (
                <>
                  <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                  <h2 className="text-xl font-black text-amber-400">
                    {isRtl ? '⚠️ قيد المراجعة اليدوية' : '⚠️ Sent to Admin for Manual Review'}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {isRtl
                      ? 'تم إرسال طلبك لمراجعة يدوية من فريق الإدارة. ستُفعَّل خدمتك خلال ساعات.'
                      : 'Your request has been sent for manual admin review. Your service will be activated within hours.'}
                  </p>
                </>
              )}
              {fraudResult.status === 'rejected' && (
                <>
                  <XCircle className="w-12 h-12 text-red-400 mx-auto" />
                  <h2 className="text-xl font-black text-red-400">
                    {isRtl ? '🚫 تم رفض الإيصال — احتيال مكتشف' : '🚫 Receipt Rejected — Fraud Detected'}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {isRtl
                      ? 'تم اكتشاف استخدام مسبق لهذا الإيصال. إذا كان هذا خطأ، تواصل مع الدعم.'
                      : 'This receipt has already been used. If this is an error, please contact support.'}
                  </p>
                </>
              )}
            </div>

            <div className="bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  {isRtl ? 'درجة الأمان' : 'Trust Score'}
                </h3>
                <FraudScoreBadge score={fraudResult.fraudScore} />
              </div>

              {fraudResult.flags.length > 0 && (
                <div className="space-y-1.5">
                  {fraudResult.flags.map((flag) => (
                    <div key={flag} className="flex items-center gap-2 text-xs text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono">{flag.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {ocrResult && (
              <div className="bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-1">
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  {isRtl ? 'البيانات المستخرجة بالـ OCR' : 'OCR Extracted Data'}
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-auto">
                    {isRtl ? 'ثقة:' : 'Confidence:'} {ocrResult.confidence}%
                  </span>
                </h3>
                <OcrField icon={Hash} labelAr="رقم المرجع" labelEn="Transaction Ref"
                  value={ocrResult.transactionRef}
                  match={ocrResult.transactionRef ? ocrResult.transactionRef.toUpperCase() === transactionRef.toUpperCase() : null}
                  isRtl={isRtl} />
                <OcrField icon={DollarSign} labelAr="المبلغ" labelEn="Amount"
                  value={ocrResult.amount !== null ? `${ocrResult.amount}` : null}
                  match={ocrResult.amount !== null ? Math.abs(ocrResult.amount - parseFloat(claimedAmount)) / parseFloat(claimedAmount) < 0.02 : null}
                  isRtl={isRtl} />
                <OcrField icon={Calendar} labelAr="التاريخ" labelEn="Date"
                  value={ocrResult.date}
                  match={ocrResult.date ? ocrResult.date === claimedDate : null}
                  isRtl={isRtl} />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                {isRtl ? 'تحقق من إيصال آخر' : 'Verify Another Receipt'}
              </button>
              {fraudResult.status === 'verified' && (
                <a
                  href="/dashboard"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-900 dark:text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  {isRtl ? 'الذهاب للوحة التحكم' : 'Go to Dashboard'}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Dynamic SWIFT Wire Receipts Vault & Live Verification Table */}
        <div className="mt-12 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isRtl ? 'خزينة الإيصالات البنكية المعتمدة والمؤكدة' : 'Verified Bank Wire Receipts Vault'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isRtl ? 'سجلات التحويلات البنكية المعتمدة بحساب بنك البركة للمشتركين والشركات' : 'Confirmed SWIFT bank wire transactions bound to Al Baraka Bank account'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ● {isRtl ? 'حساب معتمد: بنك البركة' : 'Account: Al Baraka Bank'}
            </span>
          </div>

          <div className="overflow-x-auto">
            {vaultRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                {isRtl ? 'لا توجد إيصالات معلقة أو غير مفترضة حالياً.' : 'No active wire receipts registered.'}
              </div>
            ) : (
              <table className="w-full text-xs text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 text-left">{isRtl ? 'رقم الفاتورة والعميل' : 'Invoice & Client'}</th>
                    <th className="p-3">{isRtl ? 'الباقة المختارة' : 'Selected Plan'}</th>
                    <th className="p-3 text-left">{isRtl ? 'المبلغ المدفوع' : 'Amount Paid'}</th>
                    <th className="p-3">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</th>
                    <th className="p-3">{isRtl ? 'الحالة والتحكم' : 'Status & Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {vaultRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                      <td className="p-3 text-left">
                        <span className="font-bold text-slate-900 dark:text-white block font-mono">{r.transaction_ref}</span>
                        <span className="text-[11px] text-cyan-400 font-mono block">{r.user_email}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{r.user_name || r.company_name}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">{r.plan_name}</span>
                      </td>
                      <td className="p-3 font-mono text-base font-black text-emerald-400 text-left">${r.amount} USD</td>
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">Bank Wire SWIFT</td>
                      <td className="p-3 flex items-center gap-2 justify-end">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{r.status === 'approved' ? (isRtl ? 'مؤكد ومفعل' : 'Approved') : (isRtl ? 'قيد المراجعة' : 'Pending')}</span>
                        </span>
                        <button
                          onClick={() => handleDeleteAndBlacklist(r.id, r.user_email)}
                          title={isRtl ? 'شطب وإلغاء العضوية وحظره نهائياً' : 'Purge & Blacklist Permanently'}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
