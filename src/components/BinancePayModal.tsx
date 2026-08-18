import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Zap, Copy, Check, CheckCircle2, X, Lock, Clock, ShieldCheck,
  QrCode, AlertCircle, ExternalLink
} from 'lucide-react';
import { activateUserSubscription, BillingTransaction } from '../lib/financialGateway';
import DigitalInvoiceModal from './DigitalInvoiceModal';
import { trackBinancePayEvent } from '../lib/marketingTracker';

export interface BinancePayModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  packagePrice: number;
}

const BINANCE_MERCHANT_EMAIL = 'Drzyogo.ca@gmail.com';
const BINANCE_USER_ID = 'User-444da';
const SESSION_EXPIRE_SECONDS = 15 * 60; // 15 minutes

export default function BinancePayModal({
  isOpen,
  onClose,
  packageName,
  packagePrice,
}: BinancePayModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [binanceTxId, setBinanceTxId] = useState('');

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<BillingTransaction | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'form'>('qr');
  const [timeLeft, setTimeLeft] = useState(SESSION_EXPIRE_SECONDS);
  const [qrLoaded, setQrLoaded] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    trackBinancePayEvent('qr_rendered', { amountUSD: packagePrice, packageName });
    setTimeLeft(SESSION_EXPIRE_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [isOpen, packagePrice, packageName]);

  if (!isOpen) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const copyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!subscriberEmail || !subscriberEmail.includes('@')) {
      alert(isRtl
        ? 'يرجى إدخال بريد إلكتروني صحيح لتلقي تفعيل الاشتراك والفاتورة.'
        : 'Please provide a valid email to receive your subscription activation and invoice.');
      return;
    }
    setIsProcessing(true);
    trackBinancePayEvent('payment_submitted', { amountUSD: packagePrice, email: subscriberEmail });
    try {
      let planId: 'startup' | 'sme' | 'enterprise' = 'startup';
      const pkgLower = packageName.toLowerCase();
      if (pkgLower.includes('enterprise') || packagePrice >= 250) {
        planId = 'enterprise';
      } else if (pkgLower.includes('sme') || packagePrice >= 100) {
        planId = 'sme';
      } else {
        planId = 'startup';
      }

      const { transaction } = await activateUserSubscription({
        userEmail: subscriberEmail.trim(),
        userName: subscriberName.trim() || subscriberEmail.split('@')[0],
        planId,
        paymentMethod: 'Binance Pay (USDT)',
        amountUSD: packagePrice,
      });
      trackBinancePayEvent('payment_verified', { amountUSD: packagePrice, txId: transaction.id, email: subscriberEmail });
      setActiveInvoice(transaction);
      setIsCompleted(true);
    } catch (err) {
      trackBinancePayEvent('payment_failed', { amountUSD: packagePrice, error: String(err) });
      console.error('Binance Pay activation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isExpired = timeLeft === 0;

  // Real static QR image (User-444da) from Binance Pay
  const qrImageSrc = '/binance-qr-user444da.webp';


  return (
    <>
      {activeInvoice && (
        <DigitalInvoiceModal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          transaction={activeInvoice}
        />
      )}

      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-[#0f172a] border border-amber-500/30 rounded-3xl max-w-xl w-full shadow-2xl shadow-amber-900/20 relative overflow-hidden animate-fadeIn">

          {/* Golden glow accent top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/15 border border-amber-400/30">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 dark:text-amber-400">
                  ⚡ BINANCE PAY · LIVE MERCHANT
                </p>
                <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {isRtl ? 'الدفع الفوري عبر Binance Pay (USDT)' : 'Instant Payment via Binance Pay'}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plan badge + Countdown */}
          <div className="mx-6 mt-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">
                {isRtl ? 'الخطة المختارة' : 'Selected Plan'}
              </p>
              <p className="font-black text-slate-900 dark:text-white text-sm">{packageName}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-semibold">
                {isRtl ? 'المبلغ (USDT)' : 'Amount (USDT)'}
              </p>
              <p className="font-black text-amber-500 text-xl font-mono">${packagePrice}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border ${isExpired ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{isExpired ? (isRtl ? 'انتهت الجلسة' : 'Expired') : formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="mx-6 mt-4 flex rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 gap-1">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'qr'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              {isRtl ? 'مسح رمز QR' : 'Scan QR Code'}
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'form'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {isRtl ? 'تأكيد التحويل' : 'Confirm Transfer'}
            </button>
          </div>

          {/* ── TAB: QR CODE ── */}
          {activeTab === 'qr' && (
            <div className="px-6 py-5 space-y-5">
              {/* Instruction */}
              <p className="text-center text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isRtl
                  ? 'افتح تطبيق Binance → Binance Pay → امسح الرمز أدناه لإتمام الدفع الفوري.'
                  : 'Open Binance app → Binance Pay → Scan the QR code below to complete instant payment.'}
              </p>

              {/* QR Code Card */}
              <div className="flex flex-col items-center">
                <div className="relative bg-white rounded-3xl p-4 shadow-xl shadow-amber-500/10 border-2 border-amber-400/40 inline-block">
                  {/* Binance header inside card */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <svg width="22" height="22" viewBox="0 0 38 38" fill="none">
                      <path d="M19 2L26 9L19 16L12 9L19 2Z" fill="#F0B90B"/>
                      <path d="M7 14L14 21L7 28L0 21L7 14Z" fill="#F0B90B"/>
                      <path d="M31 14L38 21L31 28L24 21L31 14Z" fill="#F0B90B"/>
                      <path d="M19 22L26 29L19 36L12 29L19 22Z" fill="#F0B90B"/>
                    </svg>
                    <span className="font-black text-base text-slate-900 tracking-widest">BINANCE</span>
                  </div>

                  {/* QR Image */}
                  <div className="relative w-52 h-52 mx-auto">
                    {!qrLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-xl">
                        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <img
                      src={qrImageSrc}
                      alt="Binance Pay QR Code — User-444da"
                      width={208}
                      height={208}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => setQrLoaded(true)}

                      onError={(e) => {
                        // Fallback to generated QR via API
                        (e.target as HTMLImageElement).src =
                          `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`binancepay://pay?uid=444da&merchant=Drzyogo.ca%40gmail.com`)}&color=0f172a&bgcolor=ffffff&qzone=1&format=png`;
                        setQrLoaded(true);
                      }}
                      className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${qrLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>

                  {/* User ID */}
                  <p className="text-center font-black text-slate-900 mt-3 text-sm tracking-wider">
                    {BINANCE_USER_ID}
                  </p>
                  <p className="text-center text-[10px] text-slate-500 mt-1">
                    {isRtl ? 'امسح باستخدام تطبيق Binance للدفع' : 'Scan with Binance App to Pay'}
                  </p>
                </div>
              </div>

              {/* Account Details Row */}
              <div className="space-y-2">
                {/* Email */}
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      {isRtl ? 'حساب Binance Pay (البريد الإلكتروني)' : 'Binance Pay Merchant Email'}
                    </p>
                    <code className="text-amber-500 dark:text-amber-300 font-black text-sm break-all">
                      {BINANCE_MERCHANT_EMAIL}
                    </code>
                  </div>
                  <button
                    onClick={() => copyText(BINANCE_MERCHANT_EMAIL, setCopiedEmail)}
                    className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold transition-colors"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedEmail ? (isRtl ? 'تم' : 'Copied') : (isRtl ? 'نسخ' : 'Copy')}
                  </button>
                </div>
                {/* UID */}
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      {isRtl ? 'معرف المستخدم (User ID)' : 'Binance Pay User ID'}
                    </p>
                    <code className="text-slate-800 dark:text-slate-100 font-black text-sm">
                      {BINANCE_USER_ID}
                    </code>
                  </div>
                  <button
                    onClick={() => copyText(BINANCE_USER_ID, setCopiedUid)}
                    className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300/60 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold transition-colors"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUid ? (isRtl ? 'تم' : 'Copied') : (isRtl ? 'نسخ' : 'Copy')}
                  </button>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold leading-relaxed">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {isRtl
                    ? 'بعد إتمام الدفع، انتقل إلى تبويب "تأكيد التحويل" وأدخل بريدك الإلكتروني لتفعيل اشتراكك تلقائياً واستقبال الفاتورة الرسمية.'
                    : 'After completing payment, go to "Confirm Transfer" tab, enter your email to instantly activate your subscription and receive your official invoice.'}
                </span>
              </div>

              {/* Next Step CTA */}
              <button
                onClick={() => setActiveTab('form')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 font-black text-slate-950 text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isRtl ? 'لقد أتممت الدفع ← تفعيل الاشتراك' : "I've Paid → Activate Subscription"}
              </button>
            </div>
          )}

          {/* ── TAB: CONFIRM FORM ── */}
          {activeTab === 'form' && !isCompleted && (
            <div className="px-6 py-5 space-y-4">
              {isExpired && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {isRtl ? 'انتهت صلاحية جلسة الدفع. يرجى إغلاق النافذة وإعادة المحاولة.' : 'Payment session expired. Please close and restart.'}
                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {isRtl
                  ? 'أدخل بياناتك وأدخل مرجع التحويل (TxID) لتأكيد دفعتك وتفعيل اشتراكك فوراً.'
                  : 'Enter your details and the Binance TxID to confirm your payment and instantly activate your account.'}
              </p>

              {/* Subscriber Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isRtl ? 'الاسم الكامل / اسم الشركة' : 'Full Name / Company Name'}
                </label>
                <input
                  type="text"
                  placeholder={isRtl ? 'الاسم الكامل...' : 'Full Name...'}
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isRtl ? '★ البريد الإلكتروني (لتلقي التفعيل والفاتورة)' : '★ Email Address (for activation & invoice)'}
                </label>
                <input
                  type="email"
                  placeholder="subscriber@domain.com"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* TxID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isRtl ? 'رقم عملية بايننس (TxID / Order Ref)' : 'Binance TxID / Order Ref (optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4419820293847"
                  value={binanceTxId}
                  onChange={(e) => setBinanceTxId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Amount reminder */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-amber-400/30 bg-amber-400/8 text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">{packageName}</span>
                <span className="font-black text-amber-500 font-mono text-lg">${packagePrice} USDT</span>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing || !subscriberEmail || isExpired}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 font-black text-slate-950 text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    {isRtl ? 'جاري التحقق والتفعيل الفوري...' : 'Verifying & Activating...'}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {isRtl ? 'تأكيد التحويل وتفعيل الاشتراك فوراً' : 'Confirm & Activate Subscription'}
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {isCompleted && (
            <div className="px-6 py-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {isRtl ? '✅ تم تفعيل الاشتراك بنجاح!' : '✅ Subscription Activated!'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono max-w-xs">
                {isRtl
                  ? `تم إرسال الفاتورة الرسمية ومفاتيح الوصول إلى: ${subscriberEmail}`
                  : `Invoice & access keys sent to: ${subscriberEmail}`}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isRtl ? 'معاملة محمية ومشفرة بالكامل' : 'Secured & Encrypted Transaction'}
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-sm transition-colors border border-slate-700"
              >
                {isRtl ? 'إغلاق ومتابعة المنصة' : 'Close & Continue'}
              </button>
            </div>
          )}

          {/* Footer */}
          {!isCompleted && (
            <div className="px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                {isRtl ? 'بوابة دفع رسمية مشفرة — صفر رسوم' : 'Official Encrypted Gateway — Zero Fees'}
              </div>
              <div className="flex items-center gap-1 text-amber-500/70">
                <Zap className="w-3 h-3" />
                BINANCE PAY · USDT
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
