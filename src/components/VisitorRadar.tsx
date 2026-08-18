import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, X, ArrowRight, MessageSquare } from 'lucide-react';
import { recordPageView, getVisitorBehavior, generateSmartOutreach } from '../lib/visitorRadar';
import { trackPageVisit, getSmartGreeting } from '../lib/aiPersonalization';
import { useAuth } from '../lib/authContext';

export default function VisitorRadar() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isRtl = i18n.language === 'ar';

  const [outreach, setOutreach] = useState<{ title: string; body: string; ctaText: string; ctaLink: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    recordPageView(location.pathname);
    // AI Personalization Engine — tracks visit and updates persona profile
    trackPageVisit(location.pathname, i18n.language);

    const timer = setTimeout(() => {
      const behavior = getVisitorBehavior();
      const offer = generateSmartOutreach(behavior, isRtl);
      if (offer) {
        setOutreach(offer);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [location.pathname, isRtl, i18n.language]);

  if (!isAdmin || !outreach || dismissed) return null;

  const isExternal = outreach.ctaLink.startsWith('http');

  return (
    <div
      className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl shadow-cyan-950/40 relative overflow-hidden backdrop-blur-lg">
        {/* Close Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 shrink-0 border border-cyan-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{outreach.title}</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{outreach.body}</p>

            <div className="mt-3">
              {isExternal ? (
                <a
                  href={outreach.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 dark:text-white hover:opacity-90 transition-all shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{outreach.ctaText}</span>
                </a>
              ) : (
                <Link
                  to={outreach.ctaLink}
                  onClick={() => setDismissed(true)}
                  className="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 dark:text-white hover:opacity-90 transition-all shadow-md"
                >
                  <span>{outreach.ctaText}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
