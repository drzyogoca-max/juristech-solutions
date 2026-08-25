import React from 'react';
import {
  Sparkles,
  BookOpen,
  FileCheck2,
  ShieldAlert,
  FileText,
  PenTool,
  Building2,
} from 'lucide-react';
import type { SupportedAILang } from '../../ai/types';

export type SelectedTaskMode =
  | 'AUTO'
  | 'LEGAL_RESEARCH'
  | 'CONTRACT_ANALYSIS'
  | 'COMPLIANCE'
  | 'DOCUMENT_ANALYSIS'
  | 'DOCUMENT_GENERATION'
  | 'ENTERPRISE_AI';

interface AITaskSelectorProps {
  selectedMode: SelectedTaskMode;
  onSelectMode: (mode: SelectedTaskMode) => void;
  lang: SupportedAILang;
}

export const AITaskSelector: React.FC<AITaskSelectorProps> = ({
  selectedMode,
  onSelectMode,
  lang,
}) => {
  const isAr = lang === 'ar';

  const modes: Array<{
    id: SelectedTaskMode;
    labelEn: string;
    labelAr: string;
    icon: React.ComponentType<{ className?: string }>;
    descriptionEn: string;
    descriptionAr: string;
  }> = [
    {
      id: 'AUTO',
      labelEn: 'Smart Auto',
      labelAr: 'توجيه ذكي تلقائي',
      icon: Sparkles,
      descriptionEn: 'Auto-detect intent & route to specialist agent',
      descriptionAr: 'كشف نوع الطلب وتوجيهه للوكيل المتخصص تلقائياً',
    },
    {
      id: 'LEGAL_RESEARCH',
      labelEn: 'Legal Research',
      labelAr: 'البحث القانوني',
      icon: BookOpen,
      descriptionEn: 'Statute retrieval & verified citation grounding',
      descriptionAr: 'استرجاع النصوص القانونية والتوثيق التشريعي',
    },
    {
      id: 'CONTRACT_ANALYSIS',
      labelEn: 'Contract Audit',
      labelAr: 'تدقيق العقود (8 محاور)',
      icon: FileCheck2,
      descriptionEn: 'Deep 8-axis statutory forensics & liability caps',
      descriptionAr: 'تدقيق جنائي تشريعي وسقف المسؤولية المالية',
    },
    {
      id: 'COMPLIANCE',
      labelEn: 'Compliance Audit',
      labelAr: 'الامتثال التنظيمي',
      icon: ShieldAlert,
      descriptionEn: 'PDPL, GDPR, ZATCA & regulatory frameworks',
      descriptionAr: 'حوكمة وحماية البيانات والفوترة الإلكترونية',
    },
    {
      id: 'DOCUMENT_ANALYSIS',
      labelEn: 'Doc Intelligence',
      labelAr: 'تحليل المستندات',
      icon: FileText,
      descriptionEn: 'Classification, key facts & obligation mapping',
      descriptionAr: 'تصنيف الوثائق واستخراج الالتزامات الجوهرية',
    },
    {
      id: 'DOCUMENT_GENERATION',
      labelEn: 'Doc Generator',
      labelAr: 'توليد المسودات',
      icon: PenTool,
      descriptionEn: '6 structured templates with human review metadata',
      descriptionAr: 'صياغة مسودات منظمة مع وسم المراجعة البشرية',
    },
    {
      id: 'ENTERPRISE_AI',
      labelEn: 'Enterprise AI',
      labelAr: 'الذكاء المؤسسي المقارن',
      icon: Building2,
      descriptionEn: 'Multi-jurisdiction comparative advisory & planning',
      descriptionAr: 'دراسات تشريعية مقارنة وتخطيط المهام للمؤسسات',
    },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
      <div className="flex items-center gap-2 min-w-max">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              title={isAr ? m.descriptionAr : m.descriptionEn}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{isAr ? m.labelAr : m.labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
