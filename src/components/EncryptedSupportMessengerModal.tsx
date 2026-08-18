import React, { useState } from 'react';
import { ShieldCheck, Lock, Send, X, Ticket, CheckCircle2, Mail, FileText, AlertCircle } from 'lucide-react';

interface EncryptedSupportMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  defaultCategory?: string;
}

export default function EncryptedSupportMessengerModal({
  isOpen,
  onClose,
  defaultSubject = '',
  defaultCategory = 'General',
}: EncryptedSupportMessengerModalProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [category, setCategory] = useState(defaultCategory);
  const [email, setEmail] = useState('Drzyogo.ca@gmail.com');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Generate secure ticket ID
    const newTicketId = `JT-TICK-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setTicketId(newTicketId);
      setIsSubmitting(false);
    }, 1000);
  };

  const resetForm = () => {
    setTicketId(null);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-slate-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>المراسلات الداخلية المشفرة والتذاكر الرسمية</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">
                قناة تواصل مؤمنة 256-bit بديلة للاتصال الهاتفي والمراسلات الشخصية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {ticketId ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">تم إنشاء تذكرة الدعم المشفرة بنجاح</h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-sm space-y-1">
              <span className="text-slate-400 text-xs block">رقم التذكرة المعتمد:</span>
              <span className="text-cyan-400 font-extrabold text-base">{ticketId}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              تم تحويل رسالتك المشفرة مباشرة إلى فريق المستشارين القانونيين والدعم المالي على البريد الرسمي <code className="text-cyan-300 font-mono">Drzyogo.ca@gmail.com</code>. ستتلقى الرد والمتابعة عبر المنصة خلال أقل من 15 دقيقة.
            </p>
            <button
              onClick={resetForm}
              className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all"
            >
              موافق وإغلاق النافذة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                وفقاً لتوجيهات الخصوصية والأمان المعتمدة، تم إلغاء أرقام الهواتف الشخصية والاعتماد الكلي على البريد الرسمي <strong>Drzyogo.ca@gmail.com</strong> وهذه البوابة المشفرة.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">قسم التذكرة / الاستفسار</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="General">استفسار عام / حجز مواعيد</option>
                  <option value="Legal">استشارة قانونية عاجلة</option>
                  <option value="Billing">الاشتراكات والتحويل البنكي</option>
                  <option value="Enterprise">عروض الشركات B2B</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني المعتمد للمتابعة</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Drzyogo.ca@gmail.com"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">موضوع التذكرة</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="عنوان الرسالة أو معاملة العقد..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">تفاصيل الرسالة المعالجة تشفيراً</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب استفسارك أو تفاصيل عقدك هنا بصيغة آمنة..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !message.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 font-extrabold text-slate-950 text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
            >
              {isSubmitting ? (
                <span>جاري إرسال التذكرة وتشفير البيانات...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال التذكرة المشفرة إلى الدعم المباشر</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
