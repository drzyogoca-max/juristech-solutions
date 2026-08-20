import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Check, Copy, Lock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, X, Sparkles, Building2 } from 'lucide-react';
import { activateUserSubscription } from '../lib/financialGateway';

export interface InstaPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  packagePrice: number;
  packageId?: string;
  onSuccess?: () => void;
}

const INSTAPAY_PHONE = '+201031222262';
const INSTAPAY_NUMBER_LOCAL = '01031222262';
const EGP_EXCHANGE_RATE = 50; // 1 USD = 50 EGP (approx)

export default function InstaPayModal({
  isOpen,
  onClose,
  packageName,
  packagePrice,
  packageId = 'startup',
  onSuccess,
}: InstaPayModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [copied, setCopied] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberPhone, setSubscriberPhone] = useState('');
  const [senderNameOrReference, setSenderNameOrReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const egpAmount = Math.round(packagePrice * EGP_EXCHANGE_RATE);

  function handleCopyNumber() {
    navigator.clipboard.writeText(INSTAPAY_NUMBER_LOCAL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmitTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!subscriberEmail.trim()) {
      setError(isRtl ? 'يرجى إدخال البريد الإلكتروني لتفعيل الحساب.' : 'Please enter your corporate email for account activation.');
      return;
    }
    if (!senderNameOrReference.trim()) {
      setError(isRtl ? 'يرجى إدخال اسم المحول أو الرقم المرجعي للعملية.' : 'Please enter sender name or reference ID.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Activate subscription in Financial Gateway
      await activateUserSubscription({
        userEmail: subscriberEmail.trim(),
        planId: packageId === 'enterprise' ? 'enterprise' : packageId === 'sme' ? 'sme' : 'startup',
        paymentMethod: 'Bank Wire SWIFT',
        amountUSD: packagePrice,
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || (isRtl ? 'حدث خطأ في تأكيد المعاملة' : 'Error confirming transaction'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {isRtl ? 'الدفع الفوري عبر إنستا باي (InstaPay Egypt)' : 'Instant Payment via InstaPay Egypt'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isRtl ? 'تفعيل فوري' : 'Instant Activation'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRtl ? `حزمة: ${packageName} — المبلغ المطلوب: $${packagePrice} USD (${egpAmount.toLocaleString()} جنيه مصري)` : `Plan: ${packageName} — Amount: $${packagePrice} USD (${egpAmount.toLocaleString()} EGP)`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUCCESS SCREEN */}
        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h4 className="text-xl font-black text-white">
              {isRtl ? 'تم تسجيل المعاملة وتفعيل الاشتراك بنجاح! 🎉' : 'Transaction Registered & Subscription Activated! 🎉'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isRtl
                ? `تم إشعار الإدارة ومطابقة التحويل عبر رقم إنستا باي ${INSTAPAY_PHONE}. تم فتح كافة الصلاحيات لحسابك (${subscriberEmail}).`
                : `Notification sent to administration. Account (${subscriberEmail}) unlocked with full unlimited access.`}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg cursor-pointer"
            >
              {isRtl ? 'الذهاب للوحة التحكم وبدء الاستخدام' : 'Go to Dashboard & Launch Platform'}
            </button>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="space-y-6">
            
            {/* InstaPay Phone Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {isRtl ? 'رقم InstaPay المعتمد للاستلام:' : 'Official InstaPay Receiver Number:'}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {isRtl ? 'مصر / جميع البنوك' : 'Egypt / All Banks'}
                </span>
              </div>

              {/* Big Phone Number Display */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <div>
                  <div className="text-xl font-black text-emerald-400 tracking-wider">
                    {INSTAPAY_PHONE}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? `أو الرقم المحلي: ${INSTAPAY_NUMBER_LOCAL}` : `Local Number: ${INSTAPAY_NUMBER_LOCAL}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-emerald-500/30 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرقم' : 'Copy')}</span>
                </button>
              </div>

              {/* Amount Breakdown */}
              <div className="p-3 rounded-xl bg-slate-900/80 text-xs flex items-center justify-between border border-slate-800">
                <span className="text-slate-300 font-bold">
                  {isRtl ? 'المبلغ المطلوب تحويلهبالجنيه المصري:' : 'Amount to Transfer in EGP:'}
                </span>
                <span className="text-base font-black text-amber-300 font-mono">
                  {egpAmount.toLocaleString()} EGP <span className="text-[10px] text-slate-400">(${packagePrice} USD)</span>
                </span>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-2 text-xs text-slate-300">
              <span className="font-bold text-white block">
                {isRtl ? 'خطوات التحويل والتفعيل:' : 'Transfer & Activation Steps:'}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
                <li>{isRtl ? `افتح تطبيق إنستا باي (InstaPay) على هاتفك.` : 'Open InstaPay app on your phone.'}</li>
                <li>{isRtl ? `اختر "تحويل أموال" ← "رقم الهاتف" ← أدخل ${INSTAPAY_NUMBER_LOCAL}.` : `Select "Send Money" → "Mobile Number" → Enter ${INSTAPAY_NUMBER_LOCAL}.`}</li>
                <li>{isRtl ? `حول المبلغ المطلوبة (${egpAmount.toLocaleString()} EGP) وأدخل بياناتك أدناه.` : `Transfer the amount (${egpAmount.toLocaleString()} EGP) and submit details below.`}</li>
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitTransfer} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'البريد الإلكتروني المعتمد للحساب:' : 'Account Corporate Email:'}
                </label>
                <input
                  type="email"
                  required
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'رقم المحوِّل أو الاسم والرقم المرجعي:' : 'Sender Phone / Reference Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={senderNameOrReference}
                  onChange={(e) => setSenderNameOrReference(e.target.value)}
                  placeholder={isRtl ? 'مثال: أحمد مصطفى / 01012345678' : 'e.g., Ahmed Mostafa / Ref 987654'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{submitting ? (isRtl ? 'جاري تأكيد المعاملة وتفعيل الاشتراك...' : 'Confirming Transfer...') : (isRtl ? 'تأكيد التحويل وتفعيل الاشتراك فوراً' : 'Confirm Transfer & Activate Plan')}</span>
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-500">
              {isRtl
                ? 'يتم مراجعة ومطابقة التحويل تلقائياً، وفي حال وجود أي استفسار يسعدنا تواصلك عبر الواتساب المباشر: +201126674337'
                : 'Transfers are verified automatically. For instant support, WhatsApp: +201126674337'}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
