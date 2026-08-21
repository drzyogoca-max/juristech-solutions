import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Building2 } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

export interface AdSponsorProps {
  slotType: 'top-banner' | 'in-feed' | 'sponsor-footer';
  customSponsorName?: string;
  customSponsorUrl?: string;
}

interface ActiveSponsorData {
  sponsorName: string;
  headlineAr: string;
  headlineEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  sponsorUrl: string;
  isOfficialPaid: boolean;
}

export default function AdSponsorBanner({
  slotType = 'top-banner',
  customSponsorName,
  customSponsorUrl,
}: AdSponsorProps) {
  const { isRtl, l } = usePlatformLocale();
  const navigate = useNavigate();

  const [sponsorData, setSponsorData] = useState<ActiveSponsorData>({
    sponsorName: '',
    headlineAr: 'مساحة إعلانية ورعاية رسمية متاحة للمؤسسات والشركات',
    headlineEn: 'Official Corporate Sponsorship & Ad Slot Available',
    ctaTextAr: 'حجز المساحة والإعلان عبر التحويل البنكي',
    ctaTextEn: 'Reserve Slot via Direct Bank Wire Transfer',
    sponsorUrl: '/sponsors-ads',
    isOfficialPaid: false,
  });

  const [hasVerifiedSponsor, setHasVerifiedSponsor] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('juristech_active_sponsorship');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sponsorName) {
          const ledgerRaw = localStorage.getItem('ls_wire_ledger');
          let isVerified = false;
          if (ledgerRaw) {
            const ledger = JSON.parse(ledgerRaw);
            isVerified = ledger.some((item: any) => 
              (item.referenceCode === parsed.referenceCode || item.contactEmail === parsed.email) && 
              ['Approved', 'Paid', 'Completed'].includes(item.status)
            );
          }

          if (isVerified || parsed.is_paid || parsed.status === 'Approved' || parsed.status === 'Completed') {
            setSponsorData({
              sponsorName: customSponsorName || parsed.sponsorName,
              headlineAr: `رعاية رسمية معتمدة من ${parsed.sponsorName}`,
              headlineEn: `Official Corporate Sponsorship by ${parsed.sponsorName}`,
              ctaTextAr: 'زيارة موقع الراعي',
              ctaTextEn: 'Visit Official Sponsor',
              sponsorUrl: customSponsorUrl || parsed.website || '/sponsors-ads',
              isOfficialPaid: true,
            });
            setHasVerifiedSponsor(true);
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse active sponsorship payload:', e);
      }
    }

    setHasVerifiedSponsor(false);
  }, [customSponsorName, customSponsorUrl]);

  function handleAdClick(e: React.MouseEvent) {
    e.preventDefault();
    if (sponsorData.sponsorUrl.startsWith('http') && !sponsorData.sponsorUrl.includes('juristech.solutions')) {
      window.open(sponsorData.sponsorUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/sponsors-ads');
    }
  }

  if (!hasVerifiedSponsor) {
    return null;
  }

  if (slotType === 'top-banner') {
    return (
      <div className="w-full bg-slate-900/95 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between gap-4 text-xs font-sans shadow-md" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
          <span className="font-extrabold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
            {sponsorData.isOfficialPaid ? l('راعي رسمي معتمد', 'Official Corporate Sponsor') : l('مساحة إعلانية', 'Ad Slot')}
          </span>
          <span className="truncate font-bold text-slate-800 dark:text-slate-200">
            {l(sponsorData.headlineAr, sponsorData.headlineEn)}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAdClick}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold transition-all text-xs shadow-md shadow-amber-500/20 active:scale-95 whitespace-nowrap"
          >
            <span>{l(sponsorData.ctaTextAr, sponsorData.ctaTextEn)}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (slotType === 'in-feed') {
    return (
      <div className="my-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glow-amber" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {sponsorData.isOfficialPaid
                  ? l('الراعي المعتمد لصفقات الاندماج والاستحواذ', 'Verified Corporate M&A Sponsor')
                  : l('مساحة إعلانية ورعاية رسمية متاحة للمؤسسات والشركات', 'Official Corporate Sponsorship & Ad Slot Available')}
              </span>
              {sponsorData.sponsorName && (
                <span className="text-xs font-bold text-slate-900 dark:text-white">{sponsorData.sponsorName}</span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed max-w-3xl">
              {l(sponsorData.headlineAr, sponsorData.headlineEn)}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              {l(
                'متاح لجميع الشركات والمؤسسات القانونية والمالية للاستهداف المباشر عبر التحويل البنكي SWIFT',
                'Available for institutional and corporate targeting via SWIFT Bank Wire Remittance'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={handleAdClick}
          className="w-full md:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 whitespace-nowrap active:scale-95 shrink-0 flex items-center justify-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          <span>{l(sponsorData.ctaTextAr, sponsorData.ctaTextEn)}</span>
        </button>
      </div>
    );
  }

  return (
    <footer className="w-full py-4 border-t border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-center text-xs text-slate-600 dark:text-slate-400" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {sponsorData.isOfficialPaid ? (
              <>
                {l('مدعوم برعاية رسمية من:', 'Powered & Sponsored By:')}{' '}
                <strong className="text-slate-800 dark:text-slate-200">{sponsorData.sponsorName}</strong>
              </>
            ) : (
              <span>{l('مساحة إعلانية ورعاية رسمية متاحة للمؤسسات والشركات', 'Official Corporate Sponsorship & Ad Slot Available')}</span>
            )}
          </span>
        </div>
        <button
          onClick={() => navigate('/sponsors-ads')}
          className="text-[11px] text-amber-400 hover:underline font-bold"
        >
          {l('حجز المساحة والإعلان عبر التحويل البنكي', 'Reserve Slot via Direct Bank Wire Transfer')}
        </button>
      </div>
    </footer>
  );
}
