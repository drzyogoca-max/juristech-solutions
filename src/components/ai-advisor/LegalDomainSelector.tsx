import React from 'react';
import { Tag } from 'lucide-react';
import type { LegalDomain, SupportedAILang } from '../../ai/types';

interface LegalDomainSelectorProps {
  selectedDomain: LegalDomain;
  onSelectDomain: (domain: LegalDomain) => void;
  lang: SupportedAILang;
}

export const LEGAL_DOMAINS_LIST: Array<{
  domain: LegalDomain;
  nameEn: string;
  nameAr: string;
}> = [
  { domain: 'general', nameEn: 'All Domains (General)', nameAr: 'كافة المجالات (عام)' },
  { domain: 'corporate', nameEn: 'Corporate & M&A', nameAr: 'الشركات والاندماج والاستحواذ' },
  { domain: 'contract', nameEn: 'Contracts & Commercial', nameAr: 'العقود والمعاملات التجارية' },
  { domain: 'labor', nameEn: 'Labor & Employment', nameAr: 'العمل والموارد البشرية' },
  { domain: 'compliance', nameEn: 'Regulatory Compliance & Privacy', nameAr: 'الامتثال التنظيمي وحماية البيانات' },
  { domain: 'ip', nameEn: 'Intellectual Property', nameAr: 'الملكية الفكرية وبراءات الاختراع' },
  { domain: 'arbitration', nameEn: 'Arbitration & Disputes', nameAr: 'التحكيم وفض النزاعات' },
  { domain: 'banking', nameEn: 'Banking & Finance', nameAr: 'التمويل والمصرفية' },
  { domain: 'real_estate', nameEn: 'Real Estate & Property', nameAr: 'العقارات والإنشاءات' },
  { domain: 'tax', nameEn: 'Tax & Zakat', nameAr: 'الضريبة والزكاة والفوترة' },
  { domain: 'company_formation', nameEn: 'Company Formation & Licensing', nameAr: 'تأسيس الشركات والتراخيص' },
];

export const LegalDomainSelector: React.FC<LegalDomainSelectorProps> = ({
  selectedDomain,
  onSelectDomain,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="domain-select" className="text-xs text-slate-400 font-medium flex items-center gap-1.5 whitespace-nowrap">
        <Tag className="w-3.5 h-3.5 text-cyan-400" />
        <span>{isAr ? 'المجال القانوني:' : 'Legal Domain:'}</span>
      </label>
      <div className="relative">
        <select
          id="domain-select"
          value={selectedDomain}
          onChange={(e) => onSelectDomain(e.target.value as LegalDomain)}
          className="appearance-none bg-slate-900 border border-slate-700/80 hover:border-slate-600 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
        >
          {LEGAL_DOMAINS_LIST.map((d) => (
            <option key={d.domain} value={d.domain} className="bg-slate-950 text-slate-200">
              {isAr ? d.nameAr : d.nameEn}
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
