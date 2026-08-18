import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface PulsingCardProps {
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  icon: React.ElementType;
  accentColor?: string; // Tailwind color name like 'cyan', 'emerald', 'amber', 'purple', 'indigo'
  href?: string;
  children?: React.ReactNode;
}

export default function PulsingCard({
  title,
  titleAr,
  description,
  descriptionAr,
  icon: Icon,
  accentColor = 'cyan',
  href,
  children
}: PulsingCardProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const getColorClasses = () => {
    switch(accentColor) {
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hoverBorder: 'group-hover:border-emerald-500/50', glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20' };
      case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hoverBorder: 'group-hover:border-amber-500/50', glow: 'bg-amber-500/10 group-hover:bg-amber-500/20' };
      case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', hoverBorder: 'group-hover:border-purple-500/50', glow: 'bg-purple-500/10 group-hover:bg-purple-500/20' };
      case 'indigo': return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', hoverBorder: 'group-hover:border-indigo-500/50', glow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20' };
      case 'cyan':
      default: return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', hoverBorder: 'group-hover:border-cyan-500/50', glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/20' };
    }
  };

  const c = getColorClasses();

  const cardContent = (
    <div className={`relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 card-shimmer animate-pulse-glow ${c.hoverBorder}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl transition-colors duration-500 ${c.glow}`} />
      
      <div className="relative z-10 flex flex-col h-full gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${c.bg} ${c.text} ${c.border} border group-hover:animate-heartbeat`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:text-white transition-colors">
            {isRtl ? titleAr : title}
          </h3>
        </div>
        
        {(description || descriptionAr) && (
          <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:text-slate-300 transition-colors">
            {isRtl ? descriptionAr : description}
          </p>
        )}

        {children && <div className="mt-auto">{children}</div>}
      </div>
    </div>
  );

  if (href) {
    return <Link to={href} className="block w-full">{cardContent}</Link>;
  }

  return cardContent;
}
