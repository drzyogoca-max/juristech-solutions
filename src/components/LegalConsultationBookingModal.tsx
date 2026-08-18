import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Calendar, User, Send, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { dispatchConsultationBooking } from '../lib/emailNotifier';
import { getUITranslations } from '../lib/uiTranslations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface LegalAdvisor {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  specialtyAr: string;
  specialtyEn: string;
  avatarUrl?: string;
  countryFlag: string;
}

export const ADVISORS: LegalAdvisor[] = [
  {
    id: 'advisor-1',
    nameAr: 'د. محمد مصطفى',
    nameEn: 'Dr. Mohammed Mustafa',
    titleAr: 'مستشار استراتيجي | دكتوراه إدارة المخاطر',
    titleEn: 'Strategic Advisor | PhD Risk Management',
    specialtyAr: 'الاستشارات الاستراتيجية الحصرية، حوكمة المخاطر القانونية والتشريعية للمؤسسات والشركات',
    specialtyEn: 'Exclusive Strategic Advisory, Legal & Regulatory Risk Governance',
    countryFlag: '🏛️ ⚖️',
  },
];

export default function LegalConsultationBookingModal({ isOpen, onClose }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'ar';
  const isRtl = lang === 'ar';
  const ui = getUITranslations(lang);

  const [selectedAdvisorId, setSelectedAdvisorId] = useState('advisor-1');
  const [consultationType, setConsultationType] = useState<'email_opinion' | 'video_call' | 'emergency_audit'>('email_opinion');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [subjectDetails, setSubjectDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  if (!isOpen) return null;

  const selectedAdvisor = ADVISORS.find((a) => a.id === selectedAdvisorId) || ADVISORS[0];

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        advisorId: selectedAdvisor.id,
        advisorName: isRtl ? selectedAdvisor.nameAr : selectedAdvisor.nameEn,
        consultationType,
        clientName,
        clientEmail,
        clientPhone,
        companyName,
        preferredDate,
        preferredTime,
        subjectDetails,
      };

      const result = await dispatchConsultationBooking(bookingData);
      setConfirmedBookingId(result.bookingId);
      setBookingConfirmed(true);
    } catch (err) {
      console.error('Error dispatching consultation booking:', err);
      setBookingConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl shadow-slate-900/20 dark:shadow-slate-950/90 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                {ui.consultation.headerBadge}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {ui.consultation.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={ui.consultation.closeAria}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingConfirmed ? (
          <div className="p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {ui.consultation.confirmedTitle}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-xs max-w-lg mx-auto leading-relaxed font-semibold">
              {ui.consultation.confirmedDesc}
            </p>
            <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold max-w-md mx-auto">
              Ref ID: {confirmedBookingId || 'LS-BOOK-CONFIRMED'} • Direct Target: juristech.solutions@outlook.com
            </div>
            <button
              onClick={() => {
                setBookingConfirmed(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md"
            >
              {ui.consultation.doneBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-5">
            
            {/* Advisor Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{ui.consultation.selectAdvisor}</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {ADVISORS.map((advisor) => (
                  <div
                    key={advisor.id}
                    className="p-4 rounded-2xl border bg-cyan-50/80 dark:bg-gradient-to-r dark:from-cyan-950/60 dark:via-slate-900 dark:to-slate-900 border-cyan-500/40 text-slate-900 dark:text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{advisor.countryFlag}</span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">{isRtl ? advisor.nameAr : advisor.nameEn}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                          {isRtl ? 'المستشار الحصري' : 'Exclusive Advisor'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-extrabold">{isRtl ? advisor.titleAr : advisor.titleEn}</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pt-1">
                        {isRtl ? advisor.specialtyAr : advisor.specialtyEn}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shrink-0 self-end sm:self-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Method */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 dark:text-slate-200">
                {ui.consultation.consultationType}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('email_opinion')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    consultationType === 'email_opinion'
                      ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{ui.consultation.typeEmail}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('video_call')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    consultationType === 'video_call'
                      ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 text-blue-950 dark:text-blue-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{ui.consultation.typeVideo}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('emergency_audit')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    consultationType === 'emergency_audit'
                      ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{ui.consultation.typeAudit}</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.fullName}</label>
                <input
                  type="text"
                  required
                  placeholder={ui.consultation.fullName}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.email}</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.phone}</label>
                <input
                  type="text"
                  placeholder="+20 1..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.company}</label>
                <input
                  type="text"
                  placeholder={ui.consultation.company}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.preferredDate}</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.preferredTime}</label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{ui.consultation.subjectDetails}</label>
              <textarea
                rows={3}
                placeholder={ui.consultation.subjectPlaceholder}
                value={subjectDetails}
                onChange={(e) => setSubjectDetails(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold"
              />
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/90 rounded-2xl">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                {ui.consultation.bookingRef}
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? ui.consultation.submittingBtn : ui.consultation.submitBtn}</span>
              </button>
            </div>

          </form>
        )}


      </div>
    </div>
  );
}
