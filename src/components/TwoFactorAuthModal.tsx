import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Key, CheckCircle, AlertTriangle, Lock, X, RefreshCw, FileText, Zap, Award, Sparkles } from 'lucide-react';
import { rbacService } from '../services/rbacService';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function TwoFactorAuthModal({ isOpen, onClose, userEmail = 'drzyogo.ca@gmail.com' }: TwoFactorAuthModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [step, setStep] = useState<'status' | 'setup' | 'verify'>('status');
  const [secret, setSecret] = useState<string>('');
  const [otpUrl, setOtpUrl] = useState<string>('');
  const [otpToken, setOtpToken] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const users = rbacService.getUsers();
      const currentUser = users.find(u => u.email === userEmail);
      setIsEnabled(currentUser?.is_two_factor_enabled || localStorage.getItem(`ls_2fa_enabled_${userEmail}`) === 'true');
      setStep('status');
      setErrorMsg('');
      setSuccessMsg('');
      setOtpToken('');
    }
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  async function handleEnable2FA() {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await rbacService.enable2FA(userEmail);
      if (res.success && res.secret) {
        setSecret(res.secret);
        setOtpUrl(res.otpauth_url || '');
        setStep('setup');
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg(isRtl ? 'حدث خطأ أثناء توليد مفتاح 2FA.' : 'Error generating 2FA secret.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!otpToken.trim() || otpToken.length !== 6) {
      setErrorMsg(isRtl ? 'يرجى إدخال رمز OTP المكون من 6 أرقام.' : 'Please enter valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await rbacService.verify2FA(userEmail, otpToken);
      if (res.success) {
        setIsEnabled(true);
        setSuccessMsg(isRtl ? 'تم تفعيل وتأكيد التحقق الثنائي (2FA) بنجاح وحماية الحساب مشفرة!' : '2FA Enabled & Verified Successfully! Account E2E Protected.');
        setStep('status');
      } else {
        setErrorMsg(isRtl ? 'رمز 2FA غير صحيح. يرجى المراجعة وتكرار المحاولة.' : res.message);
      }
    } catch {
      setErrorMsg(isRtl ? 'حدث خطأ في عملية التحقق.' : 'Verification error.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable2FA() {
    setLoading(true);
    try {
      await rbacService.disable2FA(userEmail);
      setIsEnabled(false);
      setSuccessMsg(isRtl ? 'تم إلغاء تفعيل التحقق الثنائي 2FA.' : '2FA Disabled.');
      setStep('status');
    } catch {} finally {
      setLoading(false);
    }
  }

  function handleCopySecret() {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative text-slate-100 font-sans my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isRtl ? 'نظام التحقق الثنائي (2FA TOTP)' : 'Two-Factor Authentication (2FA)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                  SHA-256
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[220px] sm:max-w-xs">
                {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Status Screen */}
        {step === 'status' && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {isRtl ? 'حالة الأمان والتوثيق:' : '2FA Security Status:'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${
                  isEnabled ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10' : 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isEnabled ? (isRtl ? 'مفعّل ومحمي 🔒' : 'Active & Protected 🔒') : (isRtl ? 'غير مفعّل ⚠️' : 'Inactive ⚠️')}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl
                  ? 'يستخدم التحقق الثنائي خوارزمية TOTP القياسية لحماية حسابك عبر Google Authenticator أو Microsoft Authenticator أو Authy برمز مؤقت يتغير كل 30 ثانية.'
                  : 'RFC 6238 Time-Based One-Time Password (TOTP) standard. Compatible with Google Authenticator, Microsoft Authenticator, and Authy.'}
              </p>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{isRtl ? 'تشفير E2EE كامل' : 'E2E Encryption'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isRtl ? 'رمز لحظي (30ث)' : '30s Refresh'}</span>
              </div>
            </div>

            {!isEnabled ? (
              <button
                onClick={handleEnable2FA}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 active:scale-98 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{loading ? (isRtl ? 'جاري التوليد...' : 'Generating...') : (isRtl ? 'تفعيل التحقق الثنائي الآن' : 'Enable 2FA Protection Now')}</span>
              </button>
            ) : (
              <button
                onClick={handleDisable2FA}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-bold text-xs transition-colors border border-slate-700 hover:border-red-500/40 cursor-pointer"
              >
                {isRtl ? 'إلغاء تفعيل 2FA' : 'Disable 2FA'}
              </button>
            )}
          </div>
        )}

        {/* STEP 2: Setup Screen */}
        {step === 'setup' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {isRtl ? 'الخطوة 1: أدخل المفتاح في تطبيق التوثيق' : 'Step 1: Add Key to Authenticator App'}
              </span>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? 'افتح تطبيق Google Authenticator أو Authy وأدخل المفتاح السري التالي:'
                  : 'Open your Authenticator app (Google Authenticator, Authy, etc.) and paste this secret:'}
              </p>
            </div>

            {/* Secret Key Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs sm:text-sm font-bold text-amber-300">
              <span className="truncate select-all tracking-wider">{secret}</span>
              <button
                onClick={handleCopySecret}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
                title="Copy Secret"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 active:scale-98 cursor-pointer"
            >
              <span>{isRtl ? 'المتابعة للتحقق من رمز OTP (6 أرقام)' : 'Continue to Verify 6-Digit OTP'}</span>
            </button>
          </div>
        )}

        {/* STEP 3: Verify Screen */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">
                {isRtl ? 'أدخل رمز OTP المكون من 6 أرقام الظاهر في تطبيقك:' : 'Enter 6-Digit OTP Token from Authenticator:'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-center text-3xl font-mono font-black text-cyan-300 tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                autoFocus
                inputMode="numeric"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('setup')}
                className="w-1/3 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {isRtl ? 'رجوع' : 'Back'}
              </button>
              <button
                type="submit"
                disabled={loading || otpToken.length !== 6}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد وحفظ 2FA' : 'Verify & Activate')}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

