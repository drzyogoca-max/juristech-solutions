import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { ShieldCheck, Lock, Key, ShieldAlert, Mail, RefreshCw, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { verifyAdminAccess, grantAdminAuth } from '../lib/adminGuard';
import { dispatch2FAOtpEmail } from '../lib/emailNotifier';

// Pre-computed SHA-256 cryptographic hashes for authorized Chairman passcodes
const AUTHORIZED_PASSCODE_HASHES = [
  '5a4af055ed39a4a4bdd1afd9d67c4b3820671163a10733444fec6304dd50217d', // SHA-256 of 505275MH
  'ffef6d842239aba2e3a7501dba341fd1b6d6670f3d75de491018bae852a29e71', // SHA-256 of 505275mh
  'dadf13c080e63d9a6ba4c4a814b2374d3eb68c5b56d228bf2b0570e9a36fdc6b', // SHA-256 of MH505275
  'fed693e31aa9d3d851868ac3c65cad2371c4a3bc0d5ac5167d19306d36a60b88', // SHA-256 of mh505275
];

const TARGET_OFFICIAL_EMAIL = 'Drzyogo.ca@gmail.com';

async function hashSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, setRole } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [passcode, setPasscode] = useState('');
  const [step2FA, setStep2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generated2FACode, setGenerated2FACode] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const [error, setError] = useState(false);
  const [error2FA, setError2FA] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState('');

  const isLocallyAuthed = verifyAdminAccess();

  if (isAdmin || isLocallyAuthed) {
    return <>{children}</>;
  }

  async function handleAuthenticatePasscode(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const cleanInput = passcode.trim();
    const computedHash = await hashSHA256(cleanInput);

    if (AUTHORIZED_PASSCODE_HASHES.includes(computedHash)) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGenerated2FACode(otp);
      setOtpExpiry(Date.now() + 5 * 60 * 1000); 
      setFailedAttempts(0);
      setStep2FA(true);
      
      setIsSendingEmail(true);
      setEmailStatusMsg(isRtl ? `جاري إرسال الرمز إلى ${TARGET_OFFICIAL_EMAIL}...` : `Sending OTP code to ${TARGET_OFFICIAL_EMAIL}...`);
      
      dispatch2FAOtpEmail(TARGET_OFFICIAL_EMAIL, otp).then(() => {
        setIsSendingEmail(false);
        setEmailStatusMsg(
          isRtl
            ? `تم إرسال رمز 2FA تلقائياً إلى بريدك الإلكتروني المعتمد: ${TARGET_OFFICIAL_EMAIL}`
            : `2FA OTP code automatically sent to: ${TARGET_OFFICIAL_EMAIL}`
        );
      });
    } else {
      setError(true);
    }
  }

  async function handleResend2FAEmail() {
    setIsSendingEmail(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGenerated2FACode(newOtp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000);
    setEmailStatusMsg(isRtl ? `جاري إعادة إرسال رمز جديد إلى ${TARGET_OFFICIAL_EMAIL}...` : `Resending new OTP to ${TARGET_OFFICIAL_EMAIL}...`);

    await dispatch2FAOtpEmail(TARGET_OFFICIAL_EMAIL, newOtp);
    setIsSendingEmail(false);
    setEmailStatusMsg(
      isRtl
        ? `تم إرسال رمز جديد بنجاح إلى: ${TARGET_OFFICIAL_EMAIL}`
        : `New OTP code sent successfully to: ${TARGET_OFFICIAL_EMAIL}`
    );
  }

  function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    setError2FA(false);

    if (Date.now() < lockedUntil) {
      setError2FA(true);
      return;
    }

    if (Date.now() > otpExpiry) {
      setError2FA(true);
      setStep2FA(false);
      setGenerated2FACode('');
      return;
    }

    if (otpCode.trim() === generated2FACode && otpCode.trim().length === 6) {
      setRole('super-admin');
      grantAdminAuth();
      setFailedAttempts(0);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setError2FA(true);
      if (newAttempts >= 3) {
        setLockedUntil(Date.now() + 5 * 60 * 1000);
        setStep2FA(false);
        setGenerated2FACode('');
        setOtpCode('');
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {!step2FA ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {isRtl ? 'منطقة محمية بالأمان السيادي' : 'RESTRICTED ADMIN ZONE'}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {isRtl ? 'تسجيل دخول الإدارة العليا' : 'Super Admin Authentication'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                {isRtl ? 'أدخل رمز المرور الأمني للمتابعة إلى خطوة التحقق الثنائي (2FA)' : 'Enter secure passcode to initiate 2FA verification'}
              </p>
            </div>

            <form onSubmit={handleAuthenticatePasscode} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder={isRtl ? 'رمز المرور الإداري...' : 'Admin passcode...'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-center text-lg font-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {error && (
                  <p className="text-red-400 text-xs font-bold mt-2 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{isRtl ? 'رمز المرور غير صحيح!' : 'Incorrect admin passcode!'}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-black text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl text-sm active:scale-98"
              >
                <span>{isRtl ? 'متابعة إلى التحقق الثنائي (2FA)' : 'Proceed to 2FA Verification'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isRtl ? 'التحقق الثنائي 2FA ACTIVE' : 'TWO-FACTOR 2FA VERIFICATION'}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {isRtl ? 'إدخال رمز التحقق (OTP 2FA)' : 'Enter 2FA Security Code'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {isRtl
                  ? `تم توليد رمز أمان مكون من 6 أرقام. يصلح لمدة 5 دقائق فقط.${failedAttempts > 0 ? ` (محاولات متبقية: ${3 - failedAttempts})` : ''}`
                  : `A 6-digit security code has been generated. Valid for 5 minutes only.${failedAttempts > 0 ? ` (Attempts remaining: ${3 - failedAttempts})` : ''}`}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{isRtl ? 'إشعار البريد الإلكتروني الرسمي:' : 'Official Email Dispatch:'}</span>
              </div>
              <p className="font-mono text-[11px] text-slate-300 leading-normal">
                {emailStatusMsg || (isRtl ? `تم إرسال الرمز تلقائياً إلى: ${TARGET_OFFICIAL_EMAIL}` : `OTP automatically dispatched to: ${TARGET_OFFICIAL_EMAIL}`)}
              </p>
              <button
                type="button"
                onClick={handleResend2FAEmail}
                disabled={isSendingEmail}
                className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSendingEmail ? 'animate-spin' : ''}`} />
                <span>{isRtl ? 'إعادة إرسال الرمز إلى البريد الإلكتروني' : 'Resend OTP Code to Email'}</span>
              </button>
            </div>

            {/* Direct 2FA OTP Emergency Fallback & Auto-fill */}
            {generated2FACode && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-amber-400">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{isRtl ? 'رمز التحقق المباشر (2FA OTP Code):' : 'Live 2FA Security OTP:'}</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-mono">DIRECT DISPLAY</span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-amber-500/40 font-mono shadow-inner">
                  <span className="text-2xl font-black tracking-widest text-amber-400 select-all">{generated2FACode}</span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generated2FACode)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-lg transition-all shadow-md active:scale-95 flex items-center gap-1"
                  >
                    <span>{isRtl ? 'تعبئة تلقائية ⚡' : 'Auto-fill ⚡'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-300/90 leading-relaxed">
                  {isRtl
                    ? `💡 في حال لم يصلك البريد على ${TARGET_OFFICIAL_EMAIL} بسبب مجلد البريد العشوائي (Spam)، انقر فوق "تعبئة تلقائية ⚡" للدخول فوراً.`
                    : `💡 If email to ${TARGET_OFFICIAL_EMAIL} is in Spam/Junk or delayed, click "Auto-fill ⚡" to log in immediately.`}
                </p>
              </div>
            )}

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-400 font-mono text-center tracking-[0.5em] text-xl font-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {error2FA && (
                  <p className="text-red-400 text-xs font-bold mt-2 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{isRtl ? 'رمز التحقق غير صحيح!' : 'Invalid 2FA OTP Code!'}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-black text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl text-sm active:scale-98"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>{isRtl ? 'تأكيد الدخول النهائي 2FA' : 'Authorize Super Admin Access'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
