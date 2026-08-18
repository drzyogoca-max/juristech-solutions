import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, MessageSquare, FileText, AlertTriangle, BarChart3, CreditCard, Share2, Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isRtl = i18n.language === 'ar';

  const links = [
    { to: '/dashboard', label: t('Nav.dashboard'), icon: Home },
    { to: '/chat', label: t('Nav.chat'), icon: MessageSquare },
    { to: '/contracts', label: t('Nav.contracts'), icon: FileText },
    { to: '/risk', label: t('Nav.risk'), icon: AlertTriangle },
    { to: '/reports', label: t('Nav.reports'), icon: BarChart3 },
    { to: '/payment', label: t('Nav.payment'), icon: CreditCard },
    { to: '/marketing', label: isRtl ? 'تسويق X/LinkedIn' : 'Social Marketing', icon: Share2 },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-cyan-400 font-extrabold text-xl hover:opacity-90">
          <Shield className="w-5 h-5" />
          <span>JurisTech Solutions</span>
        </Link>
      </div>
    </nav>
  );
}
