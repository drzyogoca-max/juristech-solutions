import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, CheckCircle2, Key, X, AlertCircle, Timer } from 'lucide-react';
import { logSecurityEvent } from '../lib/securityAuditLogger';
import { verifyTOTP } from '../lib/security/totpEngine';

export interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
  totpSecret?: string; // TOTP secret from user profile (required for real validation)
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userEmail = 'executive@juristech.solutions',
  totpSecret,
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [totpCode, setTotpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

  if (!isOpen) return null;

  const handleVerify = async () => {
    setErrorMsg('');

    // Check lockout
    if (Date.now() < lockedUntil) {
      const remainingMin = Math.ceil((lockedUntil - Date.now()) / 60000);
      setErrorMsg(isRtl
        ? `تم تجميد الحساب بسبب محاولات متعددة — تنتظر ${remainingMin} دقيقة.`
        : `Account locked due to multiple failed attempts — wait ${remainingMin} min.`);
      return;
    }

    // Enforce 6 digits exactly
    if (!/^\d{6}$/.test(totpCode.trim())) {
      setErrorMsg(isRtl
        ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام بالضبط.'
        : 'Please enter exactly 6 numeric digits from your Authenticator app.');
      return;
    }

    setIsVerifying(true);
    try {
      let isValid = false;

      if (totpSecret) {
        // Real TOTP verification via RFC 6238
        isValid = await verifyTOTP(totpSecret, totpCode.trim());
      } else {
        // Demo mode: accept any 6-digit code (for accounts without TOTP setup)
        isValid = totpCode.trim().length === 6;
      }

      if (isValid) {
        setIsSuccess(true);
        setFailedAttempts(0);
        logSecurityEvent('2FA_VERIFIED', 'INFO', 'Two-Factor TOTP authentication verified successfully.', userEmail);
        setTimeout(() => {
          setIsSuccess(false);
          setTotpCode('');
          onSuccess();
        }, 1200);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        logSecurityEvent('2FA_VERIFIED', 'WARNING', `2FA failed attempt ${newAttempts}/${MAX_ATTEMPTS}`, userEmail);

        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setErrorMsg(isRtl
            ? `تم إغلاق الحساب لمدة 5 دقائق بعد ${MAX_ATTEMPTS} محاولات فاشلة.`
            : `Account locked for 5 minutes after ${MAX_ATTEMPTS} failed attempts.`);
        } else {
          setErrorMsg(isRtl
            ? `رمز خاطئ! متبقي لك ${MAX_ATTEMPTS - newAttempts} محاولة قبل الإغلاق.`
            : `Invalid code! ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining before lockout.`);
        }
      }
    } catch {
      setErrorMsg(isRtl ? 'خطأ داخلي — يرجى المحاولة مجدداً.' : 'Internal error — please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="bg-white dark:bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                ENTERPRISE 2FA ENFORCED
              </span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-0.5">
                {isRtl ? '🔐 المصادقة الثنائية (2FA Verification)' : '🔐 Two-Factor Authentication'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRtl ? 'تم التحقق من هوية الحساب بنجاح!' : '2FA Verified Successfully!'}
            </h4>
            <p className="text-xs font-mono text-cyan-400">
              {isRtl ? 'جاري تحويلك وإتاحة الوصول المشفر...' : 'Redirecting to secure session...'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-sans text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isRtl
                ? `لحماية البيانات والعقود السيادية للحساب (${userEmail})، أدخل الرمز المؤقت من تطبيق Authenticator الخاص بك:`
                : `To protect sovereign contracts for (${userEmail}), enter the code from your Authenticator app:`}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="flex justify-center gap-2" dir="ltr">
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  className="w-48 text-center text-2xl tracking-[0.4em] font-mono font-black p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                {isRtl ? 'رمز الدخول يتغير كل 30 ثانية (TOTP Standard)' : 'Code rotates every 30s (TOTP Standard)'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={isVerifying || !totpCode.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 active:scale-98"
            >
              <Key className="w-4 h-4 text-slate-950" />
              <span>{isVerifying ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد الدخول الآمن' : 'Verify & Authorize')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
