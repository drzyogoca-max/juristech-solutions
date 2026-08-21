import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  Globe,
  Zap,
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Scale,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface JurisdictionNode {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  countryCode: string;
  region: 'GCC' | 'NAFRICA' | 'US' | 'EU' | 'APAC';
  x: number; // Percentage on SVG map (0 - 100)
  y: number; // Percentage on SVG map (0 - 100)
  latency: string;
  statutesAr: string;
  statutesEn: string;
  arbitrationSeatAr: string;
  arbitrationSeatEn: string;
  contractsVolume: string;
  accuracyRate: string;
  accentColor: string;
  popularContracts: string[];
}

const JURISDICTION_NODES: JurisdictionNode[] = [
  {
    id: 'saudi',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia (KSA)',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    countryCode: 'SA',
    region: 'GCC',
    x: 58,
    y: 48,
    latency: '11ms',
    statutesAr: 'نظام المعاملات المدنية 2023، نظام الشركات الجديد، تراخيص MISA و RHQ',
    statutesEn: 'Civil Transactions Law 2023, New Companies Law, MISA & RHQ Rules',
    arbitrationSeatAr: 'المركز السعودي للتحكيم التجاري (SCCA)',
    arbitrationSeatEn: 'Saudi Center for Commercial Arbitration (SCCA)',
    contractsVolume: '18,450+',
    accuracyRate: '99.8%',
    accentColor: '#10B981', // Emerald
    popularContracts: ['عقد تأسيس شركة ذات مسؤولية محدودة', 'اتفاقية تقديم خدمات تقنية (SLA)', 'عقد مقاولة وتوريد تجاري']
  },
  {
    id: 'uae',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates (UAE)',
    cityAr: 'دبي / أبوظبي',
    cityEn: 'Dubai / ADGM',
    countryCode: 'AE',
    region: 'GCC',
    x: 62,
    y: 47,
    latency: '14ms',
    statutesAr: 'محاكم مركز دبي المالي العالمي (DIFC)، سوق أبوظبي العالمي (ADGM)، قانون المعاملات التجارية الاتحادي',
    statutesEn: 'DIFC Courts Common Law, ADGM Regulations, UAE Federal Commercial Code',
    arbitrationSeatAr: 'مركز دبي للتحكيم الدولي (DIAC)',
    arbitrationSeatEn: 'Dubai International Arbitration Centre (DIAC)',
    contractsVolume: '24,120+',
    accuracyRate: '99.9%',
    accentColor: '#06B6D4', // Cyan
    popularContracts: ['اتفاقية مساهمين (SHA)', 'عقد استثمار رأس مال جريء (SAFE)', 'عقد شراكة ومشروع مشترك (JV)']
  },
  {
    id: 'egypt',
    nameAr: 'جمهورية مصر العربية',
    nameEn: 'Egypt (ARE)',
    cityAr: 'القاهرة',
    cityEn: 'Cairo',
    countryCode: 'EG',
    region: 'NAFRICA',
    x: 53,
    y: 45,
    latency: '16ms',
    statutesAr: 'القانون المدني المصري (السنهوري)، قانون التجارة رقم 17، قانون الاستثمار والشركات المساهمة',
    statutesEn: 'Egyptian Civil Code, Commercial Code No. 17, General Investment Law',
    arbitrationSeatAr: 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA)',
    arbitrationSeatEn: 'Cairo Regional Centre for Int. Commercial Arbitration (CRCICA)',
    contractsVolume: '15,280+',
    accuracyRate: '99.7%',
    accentColor: '#F59E0B', // Amber
    popularContracts: ['عقد وكالة تجارية وتوزيع', 'عقد عمل وإدارة تنفيذية', 'عقد توريد وخدمات لوجستية']
  },
  {
    id: 'uk',
    nameAr: 'المملكة المتحدة',
    nameEn: 'United Kingdom (UK)',
    cityAr: 'لندن',
    cityEn: 'London',
    countryCode: 'GB',
    region: 'EU',
    x: 46,
    y: 28,
    latency: '22ms',
    statutesAr: 'القانون العام الإنجليزي (English Common Law)، قانون الشركات 2006، حماية البيانات UK-GDPR',
    statutesEn: 'English Common Law, Companies Act 2006, UK Data Protection Act',
    arbitrationSeatAr: 'محكمة لندن للتحكيم الدولي (LCIA)',
    arbitrationSeatEn: 'London Court of International Arbitration (LCIA)',
    contractsVolume: '9,840+',
    accuracyRate: '99.9%',
    accentColor: '#38BDF8', // Sky
    popularContracts: ['Master Services Agreement (MSA)', 'Non-Disclosure Agreement (NDA)', 'IP Licensing & Transfer']
  },
  {
    id: 'usa',
    nameAr: 'الولايات المتحدة الأمريكية',
    nameEn: 'United States (US)',
    cityAr: 'ديلاوير / نيويورك',
    cityEn: 'Delaware / NY',
    countryCode: 'US',
    region: 'US',
    x: 24,
    y: 35,
    latency: '28ms',
    statutesAr: 'قانون شركات ديلاوير (DGCL)، القانون التجاري الموحد (UCC)، اللوائح الفيدرالية SEC',
    statutesEn: 'Delaware General Corporation Law (DGCL), Uniform Commercial Code (UCC)',
    arbitrationSeatAr: 'جمعية التحكيم الأمريكية (AAA / ICDR)',
    arbitrationSeatEn: 'American Arbitration Association (AAA / ICDR)',
    contractsVolume: '12,310+',
    accuracyRate: '99.8%',
    accentColor: '#818CF8', // Indigo
    popularContracts: ['Delaware C-Corp Founder Agreement', 'SaaS Terms of Service & DPA', 'Convertible Promissory Note']
  },
  {
    id: 'eu',
    nameAr: 'الاتحاد الأوروبي',
    nameEn: 'European Union (EU)',
    cityAr: 'فرانكفورت / باريس',
    cityEn: 'Frankfurt / Paris',
    countryCode: 'DE',
    region: 'EU',
    x: 49,
    y: 30,
    latency: '24ms',
    statutesAr: 'اللائحة العامة لحماية البيانات (EU-GDPR)، لوائح التجارة الأوروبية الموحدة وتوجيهات الذكاء الاصطناعي EU AI Act',
    statutesEn: 'EU GDPR Regulation, EU Single Market Directives, EU AI Act Governance',
    arbitrationSeatAr: 'غرفة التجارة الدولية (ICC Paris)',
    arbitrationSeatEn: 'International Chamber of Commerce (ICC Paris)',
    contractsVolume: '8,760+',
    accuracyRate: '99.6%',
    accentColor: '#34D399', // Emerald light
    popularContracts: ['Cross-Border GDPR Data Transfer Agreement', 'Software Distribution & SLA', 'Commercial Agency']
  },
  {
    id: 'singapore',
    nameAr: 'سنغافورة ودول آسيا',
    nameEn: 'Singapore & APAC',
    cityAr: 'سنغافورة',
    cityEn: 'Singapore',
    countryCode: 'SG',
    region: 'APAC',
    x: 78,
    y: 58,
    latency: '31ms',
    statutesAr: 'قانون سنغافورة التجاري العام، أنظمة ACRA، معايير التجارة الدولية UNCITRAL',
    statutesEn: 'Singapore Commercial Law, ACRA Standards, UNCITRAL CISG Conventions',
    arbitrationSeatAr: 'مركز سنغافورة للتحكيم الدولي (SIAC)',
    arbitrationSeatEn: 'Singapore International Arbitration Centre (SIAC)',
    contractsVolume: '6,520+',
    accuracyRate: '99.8%',
    accentColor: '#F43F5E', // Rose
    popularContracts: ['Cross-Border International Sale of Goods', 'APAC Regional Franchise Agreement', 'Fintech SLA']
  }
];

export default function InteractiveSassGlobalMap() {
  const { l, isRtl } = usePlatformLocale();
  const navigate = useNavigate();

  const [selectedNode, setSelectedNode] = useState<JurisdictionNode>(JURISDICTION_NODES[0]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'GCC' | 'NAFRICA' | 'US' | 'EU' | 'APAC'>('ALL');

  const filteredNodes = activeFilter === 'ALL'
    ? JURISDICTION_NODES
    : JURISDICTION_NODES.filter(n => n.region === activeFilter);

  return (
    <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl relative overflow-hidden font-sans space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-sky-400">
              {l('خريطة النفوذ والأنظمة القضائية السيادية', 'Global Sovereign Legal & Jurisdiction Matrix')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {l('المنظومة التفاعلية لتغطية الأنظمة القانونية الدولية', 'Interactive Multi-Jurisdiction Intelligence Grid')}
          </h2>
          <p className="text-xs text-slate-300">
            {l(
              'انقر على أي عاصمة أو مركز قضائي لاستعراض الأنظمة التشريعية النافذة، سرعة الاستجابة، وتوليد العقود المعتمدة فورياً.',
              'Click any legal capital node to inspect governing statutes, live API response latency, and launch certified drafting.'
            )}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', labelAr: 'الكل (35+ دولة)', labelEn: 'All Hubs' },
            { id: 'GCC', labelAr: '🇸🇦 الخليج العربي', labelEn: 'GCC' },
            { id: 'NAFRICA', labelAr: '🇪🇬 شمال أفريقيا', labelEn: 'N. Africa' },
            { id: 'US', labelAr: '🇺🇸 أمريكا', labelEn: 'USA' },
            { id: 'EU', labelAr: '🇪🇺 أوروبا', labelEn: 'Europe' },
            { id: 'APAC', labelAr: '🇸🇬 آسيا', labelEn: 'APAC' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                activeFilter === f.id
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-black scale-105'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {l(f.labelAr, f.labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage: Map View & Live Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center: Interactive SVG Global Map Surface (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/90 rounded-2xl border border-slate-800/80 p-4 sm:p-6 relative min-h-[340px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden shadow-inner">
          
          {/* Subtle Grid Radar Lines Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG Canvas Map Representation */}
          <div className="relative w-full h-[280px] sm:h-[340px] my-auto">
            
            {/* World Landmass Silhouettes (Stylized Abstract SVG) */}
            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-35 select-none pointer-events-none">
              {/* Americas */}
              <path d="M150,100 Q200,120 250,180 Q220,260 180,320 Q160,400 210,460 Q230,420 220,350 Q280,240 300,150 Q260,80 180,70 Z" fill="#334155" />
              {/* Eurasia & Africa */}
              <path d="M420,80 Q520,70 650,90 Q780,120 880,150 Q820,240 760,300 Q720,240 640,260 Q600,320 580,420 Q500,450 460,340 Q430,220 400,160 Z" fill="#334155" />
              {/* Australia */}
              <path d="M780,360 Q860,350 890,420 Q840,460 770,430 Z" fill="#334155" />

              {/* Interconnection Laser Beams */}
              {JURISDICTION_NODES.map((n, i) => {
                const next = JURISDICTION_NODES[(i + 1) % JURISDICTION_NODES.length];
                return (
                  <line
                    key={i}
                    x1={`${n.x * 10}`}
                    y1={`${n.y * 5}`}
                    x2={`${next.x * 10}`}
                    y2={`${next.y * 5}`}
                    stroke={selectedNode.id === n.id ? '#38bdf8' : '#334155'}
                    strokeWidth={selectedNode.id === n.id ? '2' : '1'}
                    strokeDasharray="4 4"
                    className="opacity-40 transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Interactive Glowing Radar Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setSelectedNode(node)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Ping Ring */}
                  <div className="relative flex items-center justify-center">
                    <span
                      style={{ backgroundColor: node.accentColor }}
                      className={`absolute inline-flex rounded-full opacity-75 animate-ping ${
                        isSelected ? 'w-8 h-8' : 'w-5 h-5 opacity-40'
                      }`}
                    />
                    <div
                      style={{
                        backgroundColor: isSelected ? node.accentColor : '#0f172a',
                        borderColor: node.accentColor
                      }}
                      className={`relative rounded-full border-2 transition-all flex items-center justify-center shadow-lg ${
                        isSelected ? 'w-6 h-6 scale-125' : 'w-4 h-4 hover:scale-125'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Node City Tooltip / Label */}
                  <div
                    className={`absolute top-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl text-[11px] font-black whitespace-nowrap transition-all shadow-xl backdrop-blur-md border ${
                      isSelected
                        ? 'bg-slate-900/95 text-white border-sky-400 scale-105 z-30'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 opacity-85 group-hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{isRtl ? node.cityAr : node.cityEn}</span>
                      <span className="text-[9px] text-emerald-400 font-mono">({node.latency})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Stats Strip */}
          <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-200">
                {l('شبكة الذكاء الاصطناعي السيادي: 7 عقد رئيسية نشطة', 'Live Sovereign Network: 7 Master Nodes Active')}
              </span>
            </div>
            <span className="font-mono text-sky-400 font-bold">Avg Latency: ~18ms | 99.9% Statutory Accuracy</span>
          </div>
        </div>

        {/* Right: Selected Node Detail & Action Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl border border-sky-500/30 p-5 sm:p-6 space-y-5 shadow-2xl relative">
          
          {/* Header of selected node */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  {selectedNode.countryCode} · {selectedNode.region}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{selectedNode.latency}</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                {l(selectedNode.nameAr, selectedNode.nameEn)}
              </h3>
              <p className="text-xs text-sky-400 font-bold">
                {l(`المركز القضائي: ${selectedNode.cityAr}`, `Legal Capital: ${selectedNode.cityEn}`)}
              </p>
            </div>

            <div className="text-right rtl:text-left">
              <span className="text-[10px] text-slate-400 block font-bold">{l('حجم العقود', 'Volume')}</span>
              <span className="text-base font-black text-white font-mono">{selectedNode.contractsVolume}</span>
            </div>
          </div>

          {/* Governing Statutes & Arbitration Seat */}
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <Scale className="w-3.5 h-3.5 text-sky-400" />
                <span>{l('الأنظمة والتشريعات المعتمدة بالمحرك:', 'Governing Legal Codes:')}</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans text-[11px]">
                {l(selectedNode.statutesAr, selectedNode.statutesEn)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{l('مقر وهيئة التحكيم التجاري المعتمدة:', 'Recognized Arbitration Seat:')}</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans text-[11px]">
                {l(selectedNode.arbitrationSeatAr, selectedNode.arbitrationSeatEn)}
              </p>
            </div>

            {/* Popular Contracts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 block">
                {l('أبرز العقود الأكثر طلباً في هذا النطاق:', 'Top Requested Contracts in Region:')}
              </span>
              <div className="space-y-1">
                {selectedNode.popularContracts.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instant Launch Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => navigate(`/contracts?region=${selectedNode.countryCode}`)}
              className="px-3.5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{l('صياغة عقد فوري', 'Draft Contract')}</span>
            </button>

            <button
              onClick={() => navigate(`/risk?region=${selectedNode.countryCode}`)}
              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{l('فحص المخاطر', 'Risk Audit')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
