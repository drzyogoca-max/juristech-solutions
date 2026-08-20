import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Key, CheckCircle2, AlertTriangle, Lock, X, RefreshCw, Smartphone, Copy, Check } from 'lucide-react';
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
        setSuccessMsg(isRtl ? 'تم تفعيل وتأكيد التحقق الثنائي (2FA) بنجاح!' : '2FA Enabled & Verified Successfully!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative text-slate-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isRtl ? 'نظام التحقق الثنائي (2FA TOTP)' : 'Two-Factor Authentication (2FA)'}
              </h3>
              <p className="text-xs text-slate-400">
                {userEmail}
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

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Status Screen */}
        {step === 'status' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {isRtl ? 'حالة الأمان الحالية:' : 'Current 2FA Status:'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {isEnabled ? (isRtl ? 'مفعّل وشغّال 🔒' : 'Enabled 🔒') : (isRtl ? 'غير مفعّل ⚠️' : 'Disabled ⚠️')}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl
                  ? 'يستخدم التحقق الثنائي خوارزمية TOTP المعتمدة لحماية حسابك عبر تطبيقات مثل Google Authenticator أو Authy من خلال رمز مكون من 6 أرقام.'
                  : 'Protect your account using RFC 6238 TOTP standard via Google Authenticator or Authy with a 6-digit OTP code.'}
              </p>
            </div>

            {!isEnabled ? (
              <button
                onClick={handleEnable2FA}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{loading ? (isRtl ? 'جاري التوليد...' : 'Generating...') : (isRtl ? 'تفعيل التحقق الثنائي الآن' : 'Enable 2FA Now')}</span>
              </button>
            ) : (
              <button
                onClick={handleDisable2FA}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-bold text-xs transition-colors border border-slate-700 hover:border-red-500/40"
              >
                {isRtl ? 'إلغاء تفعيل 2FA' : 'Disable 2FA'}
              </button>
            )}
          </div>
        )}

        {/* STEP 2: Setup Screen (Secret Key & Instructions) */}
        {step === 'setup' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 block">
                {isRtl ? 'الخطوة 1: أدخل المفتاح السري في تطبيق التوثيق' : 'Step 1: Input Secret Key in Authenticator'}
              </span>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? 'افتح تطبيق Google Authenticator أو Authy وأدخل المفتاح التالي:'
                  : 'Open Google Authenticator or Authy and add key:'}
              </p>
            </div>

            {/* Secret Key Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 font-mono text-sm font-bold text-amber-300">
              <span className="truncate select-all">{secret}</span>
              <button
                onClick={handleCopySecret}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <span>{isRtl ? 'المتابعة للتحقق من الرمز (6 أرقام)' : 'Continue to Verify 6-Digit OTP'}</span>
            </button>
          </div>
        )}

        {/* STEP 3: Verify Screen */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">
                {isRtl ? 'أدخل رمز OTP المكون من 6 أرقام من التطبيق:' : 'Enter 6-Digit OTP Token:'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-center text-2xl font-mono font-black text-cyan-300 tracking-widest focus:outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpToken.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد وإتمام تفعيل 2FA' : 'Verify & Enable 2FA')}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
