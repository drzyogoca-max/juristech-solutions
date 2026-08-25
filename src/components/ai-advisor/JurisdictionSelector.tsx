import React from 'react';
import { Globe, Check } from 'lucide-react';
import type { JurisdictionCode, SupportedAILang } from '../../ai/types';

interface JurisdictionSelectorProps {
  selectedJurisdiction: JurisdictionCode;
  onSelectJurisdiction: (code: JurisdictionCode) => void;
  lang: SupportedAILang;
}

export const JURISDICTIONS_LIST: Array<{
  code: JurisdictionCode;
  nameEn: string;
  nameAr: string;
  flag: string;
}> = [
  { code: 'UNKNOWN', nameEn: 'Auto / Unspecified', nameAr: 'تحديد تلقائي / عام', flag: '🌐' },
  { code: 'SA', nameEn: 'Saudi Arabia (KSA)', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'AE', nameEn: 'United Arab Emirates (UAE / DIFC)', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'جمهورية مصر العربية', flag: '🇪🇬' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'دولة قطر', flag: '🇶🇦' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'دولة الكويت', flag: '🇰🇼' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'مملكة البحرين', flag: '🇧🇭' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'سلطنة عمان', flag: '🇴🇲' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'المملكة الأردنية الهاشمية', flag: '🇯🇴' },
  { code: 'GB', nameEn: 'United Kingdom (UK Law)', nameAr: 'المملكة المتحدة (القانون الإنجليزي)', flag: '🇬🇧' },
  { code: 'US', nameEn: 'United States (Delaware / UCC)', nameAr: 'الولايات المتحدة الأمريكية', flag: '🇺🇸' },
  { code: 'EU', nameEn: 'European Union (GDPR / BGB)', nameAr: 'الاتحاد الأوروبي', flag: '🇪🇺' },
  { code: 'SG', nameEn: 'Singapore', nameAr: 'جمهورية سنغافورة', flag: '🇸🇬' },
  { code: 'TR', nameEn: 'Turkey', nameAr: 'الجمهورية التركية', flag: '🇹🇷' },
  { code: 'CN', nameEn: 'China', nameAr: 'جمهورية الصين الشعبية', flag: '🇨🇳' },
  { code: 'INTL', nameEn: 'International (CISG / UNCITRAL)', nameAr: 'القانون الدولي العام', flag: '🌍' },
];

export const JurisdictionSelector: React.FC<JurisdictionSelectorProps> = ({
  selectedJurisdiction,
  onSelectJurisdiction,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="jurisdiction-select" className="text-xs text-slate-400 font-medium flex items-center gap-1.5 whitespace-nowrap">
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span>{isAr ? 'الولاية القضائية:' : 'Jurisdiction:'}</span>
      </label>
      <div className="relative">
        <select
          id="jurisdiction-select"
          value={selectedJurisdiction}
          onChange={(e) => onSelectJurisdiction(e.target.value as JurisdictionCode)}
          className="appearance-none bg-slate-900 border border-slate-700/80 hover:border-slate-600 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
        >
          {JURISDICTIONS_LIST.map((j) => (
            <option key={j.code} value={j.code} className="bg-slate-950 text-slate-200">
              {j.flag} {isAr ? j.nameAr : j.nameEn}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
};
