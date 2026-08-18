import React, { useState } from 'react';
import { Mail, Lock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EncryptedSupportMessengerModal from './EncryptedSupportMessengerModal';

export interface HumanEscalationTriggerProps {
  userQueryContext?: string;
  className?: string;
}

export const HumanEscalationTrigger: React.FC<HumanEscalationTriggerProps> = ({
  userQueryContext = 'استشارة قانونية عامة',
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);

  return (
    <>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`mt-4 p-4 bg-slate-900 border border-cyan-500/30 rounded-2xl text-center font-sans ${className}`}
      >
        <p dir="auto" className="text-xs sm:text-sm text-cyan-300 mb-3 leading-relaxed">
          {isRtl
            ? 'هل تحتاج إلى تعمق إضافي أو معالجة قانونية معقدة؟ تواصل مباشرة عبر المراسلات الداخلية المشفرة أو البريد الرسمي:'
            : 'Need deeper legal analysis or complex contract handling? Connect via encrypted internal messaging or official email:'}
        </p>
        <button
          onClick={() => setIsMessengerOpen(true)}
          id="human-escalation-ticket-btn"
          className="w-full py-3 px-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 hover:scale-[1.02]"
        >
          <Lock className="w-4 h-4 text-cyan-100 shrink-0" />
          <span dir="auto">
            {isRtl
              ? '🔒 فتح تذكرة دعم مشفرة وتواصل مباشر (Drzyogo.ca@gmail.com)'
              : '🔒 Open Encrypted Support Ticket (Drzyogo.ca@gmail.com)'}
          </span>
          <ArrowUpRight className="w-4 h-4 text-cyan-200 shrink-0" />
        </button>
      </div>

      <EncryptedSupportMessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
        defaultSubject={userQueryContext}
        defaultCategory="Legal"
      />
    </>
  );
};

export default HumanEscalationTrigger;
