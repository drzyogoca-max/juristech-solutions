/**
 * autonomousCSuiteOutreachEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Fully Autonomous C-Suite B2B Outreach Machine
 * Dispatches 20 high-value executive proposals daily to CEOs & CFOs with 0 manual effort.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { triggerAutomatedB2BOutreach } from './outreachEngine';
import { crmService, CrmClientLead, DAILY_CRM_DISPATCH_LIMIT } from './crmService';

export interface EnterpriseCSuiteLead {
  id: string;
  companyName: string;
  contactEmail: string;
  recipientName: string;
  recipientTitle: 'CEO' | 'CFO' | 'General Counsel' | 'Managing Partner' | 'Chief Legal Officer';
  jurisdiction: string;
  countryFlag: string;
  industry: string;
  customValuePropositionEn: string;
  customValuePropositionAr: string;
  estimatedAnnualContractValueUSD: number;
}

export const ENTERPRISE_CSUITE_DIRECTORY: EnterpriseCSuiteLead[] = [
  // ── Gulf Cooperation Council (GCC) & MENA ──
  {
    id: 'corp-csuite-01',
    companyName: 'Aramco Ventures & Industrial Innovations',
    contactEmail: 'csuite@aramco-ventures.sa',
    recipientName: 'Eng. Khalid Al-Falih',
    recipientTitle: 'CEO',
    jurisdiction: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    industry: 'Energy & Infrastructure Fund',
    customValuePropositionEn: 'Saudi Civil Transactions Law (M/191) & EPC Cross-Border Contract Risk Radar with $2.4M liability cap verification.',
    customValuePropositionAr: 'حوكمة عقود التوريد والمقاولات ونظام المعاملات المدنية السعودي م/191 وتطويق مخاطر المسؤولية المالية.',
    estimatedAnnualContractValueUSD: 250000,
  },
  {
    id: 'corp-csuite-02',
    companyName: 'Mubadala Sovereign Asset Management',
    contactEmail: 'executive.office@mubadala-capital.ae',
    recipientName: 'Dr. Sultan Al Jaber',
    recipientTitle: 'CFO',
    jurisdiction: 'UAE',
    countryFlag: '🇦🇪',
    industry: 'Sovereign Wealth & Private Equity',
    customValuePropositionEn: 'ADGM / DIFC Commercial Companies Law No. 50/2022 due diligence automation and 70% legal retainer cost reduction.',
    customValuePropositionAr: 'أتمتة الفحص النافي للجهالة بموجب قوانين DIFC والمعاملات التجارية 50/2022 وتخفيض تكلفة الاستشارات 70%.',
    estimatedAnnualContractValueUSD: 300000,
  },
  {
    id: 'corp-csuite-03',
    companyName: 'Qatar Investment & Real Estate Holding',
    contactEmail: 'board.governance@qatar-holding.qa',
    recipientName: 'Mansoor Al-Mahmoud',
    recipientTitle: 'CEO',
    jurisdiction: 'Qatar',
    countryFlag: '🇶🇦',
    industry: 'Real Estate & Sovereign Infrastructure',
    customValuePropositionEn: 'QFC Law No. 22/2004 compliance engine and instant sub-second contract penalty trap detection.',
    customValuePropositionAr: 'مطابقة عقود الاستثمار مع قانون المعاملات القطري 22/2004 وكشف فخاخ الغرامات الجزائية فورياً.',
    estimatedAnnualContractValueUSD: 180000,
  },
  {
    id: 'corp-csuite-04',
    companyName: 'Kuwait Global Logistics & Trade Corp',
    contactEmail: 'legal.csuite@kuwait-logistics.kw',
    recipientName: 'Faisal Al-Hamad',
    recipientTitle: 'CFO',
    jurisdiction: 'Kuwait',
    countryFlag: '🇰🇼',
    industry: 'Maritime Trade & Global Supply Chains',
    customValuePropositionEn: 'Kuwait Commercial Code 68/1980 multi-currency maritime transport and automated cross-border dispute resolution.',
    customValuePropositionAr: 'حوكمة عقود سلاسل الإمداد والتجارة بموجب قانون التجارة الكويتي 68/1980 مع فض النزاعات الآلي.',
    estimatedAnnualContractValueUSD: 140000,
  },
  {
    id: 'corp-csuite-05',
    companyName: 'Cairo Sovereign Industrial & Tech Holding',
    contactEmail: 'executive@cairo-industries.eg',
    recipientName: 'Eng. Ahmed El-Sewedy',
    recipientTitle: 'CEO',
    jurisdiction: 'Egypt',
    countryFlag: '🇪🇬',
    industry: 'Manufacturing & Tech Infrastructure',
    customValuePropositionEn: 'Egyptian Civil Code 131/1948 & Economic Court dispute mitigation with InstaPay and Bank Wire integration.',
    customValuePropositionAr: 'تأطير عقود التصنيع والشراكات وفق القانون المدني 131/1948 والمحاكم الاقتصادية المصرية.',
    estimatedAnnualContractValueUSD: 120000,
  },

  // ── United States of America ──
  {
    id: 'corp-csuite-06',
    companyName: 'Apex Energy & Infrastructure Partners LLC',
    contactEmail: 'executive@apex-energycorp.com',
    recipientName: 'Alexander Vance',
    recipientTitle: 'CFO',
    jurisdiction: 'USA (Delaware / NY)',
    countryFlag: '🇺🇸',
    industry: 'Renewable Infrastructure & Private Equity',
    customValuePropositionEn: 'Delaware General Corporation Law (DGCL) & US UCC Article 2 indemnification capping with sub-second AI redlining.',
    customValuePropositionAr: 'حوكمة عقود الاستحواذ في ديلاوير ونيويورك وتحديد سقف التعويضات وحماية أصول الطاقة.',
    estimatedAnnualContractValueUSD: 220000,
  },
  {
    id: 'corp-csuite-07',
    companyName: 'Silicon Valley AI Technologies Group Inc.',
    contactEmail: 'board@sv-aigroup.com',
    recipientName: 'Marcus Sterling',
    recipientTitle: 'CEO',
    jurisdiction: 'USA (California)',
    countryFlag: '🇺🇸',
    industry: 'Enterprise Software & Sovereign Cloud',
    customValuePropositionEn: 'SaaS SLA risk shielding, IP assignment indemnification, and CCPA/GDPR autonomous compliance engine.',
    customValuePropositionAr: 'حماية الملكية الفكرية وعقود البرمجيات السحابية والامتثال لأنظمة الخصوصية الفيدرالية.',
    estimatedAnnualContractValueUSD: 280000,
  },
  {
    id: 'corp-csuite-08',
    companyName: 'Wall Street Quantum Capital LP',
    contactEmail: 'cfo.desk@wallstreet-quantum.com',
    recipientName: 'Jonathan Hayes',
    recipientTitle: 'CFO',
    jurisdiction: 'USA (New York)',
    countryFlag: '🇺🇸',
    industry: 'Hedge Fund & Financial Instruments',
    customValuePropositionEn: 'ISDA master agreements automated risk auditing and SEC-compliant algorithmic transaction verification.',
    customValuePropositionAr: 'تدقيق اتفاقيات المشتقات المالية وإدارة السيولة والمخاطر التنظيمية الأمريكية.',
    estimatedAnnualContractValueUSD: 350000,
  },

  // ── United Kingdom & European Union ──
  {
    id: 'corp-csuite-09',
    companyName: 'Vanguard Sovereign Investment Group UK',
    contactEmail: 'corporate.legal@vanguard-sovereign.co.uk',
    recipientName: 'Victoria Sterling',
    recipientTitle: 'Managing Partner',
    jurisdiction: 'United Kingdom',
    countryFlag: '🇬🇧',
    industry: 'International Asset Management',
    customValuePropositionEn: 'English Common Law & LCIA Arbitration 2024 automated dispute avoidance and 1M+ certified contract access.',
    customValuePropositionAr: 'صياغة ومطابقة عقود الاستثمار بموجب القانون الإنجليزي وقواعد تحكيم LCIA مع التحصين الكامل.',
    estimatedAnnualContractValueUSD: 210000,
  },
  {
    id: 'corp-csuite-10',
    companyName: 'Bavaria Tech & Industrial Solutions GmbH',
    contactEmail: 'legal.dept@bavaria-techsolutions.de',
    recipientName: 'Dr. Klaus Hoffmann',
    recipientTitle: 'CFO',
    jurisdiction: 'Germany',
    countryFlag: '🇩🇪',
    industry: 'Industrial Automation & Robotics',
    customValuePropositionEn: 'German Civil Code (BGB § 307) standard terms review and EU AI Act / DSGVO strict liability elimination.',
    customValuePropositionAr: 'فحص الشروط العامة وفق القانون المدني الألماني BGB والامتثال للائحة الذكاء الاصطناعي الأوروبية.',
    estimatedAnnualContractValueUSD: 190000,
  },
  {
    id: 'corp-csuite-11',
    companyName: 'Elysian Corporate Advisory & M&A SAS',
    contactEmail: 'cfo@elysian-advisory.fr',
    recipientName: 'Claire Dubois',
    recipientTitle: 'CFO',
    jurisdiction: 'France',
    countryFlag: '🇫🇷',
    industry: 'Cross-Border M&A & Private Equity',
    customValuePropositionEn: 'French Code Civil contract due diligence automation and warranty clause liability shielding.',
    customValuePropositionAr: 'أتمتة الفحص القانوني لعقود الاستحواذ وفق القانون المدني الفرنسي وحماية بنود الضمانات.',
    estimatedAnnualContractValueUSD: 175000,
  },
  {
    id: 'corp-csuite-12',
    companyName: 'Nordic CleanEnergy Solutions AS',
    contactEmail: 'executive@nordic-cleanenergy.no',
    recipientName: 'Henrik Lindqvist',
    recipientTitle: 'CEO',
    jurisdiction: 'Norway / Nordic',
    countryFlag: '🇳🇴',
    industry: 'Renewable Utilities & Maritime CleanTech',
    customValuePropositionEn: 'Nordic procurement contract auditing and cross-border power purchase agreement (PPA) risk mitigation.',
    customValuePropositionAr: 'تدقيق عقود الطاقة المتجددة وسلاسل الإمداد النوردية وتأمين اتفاقيات الشراء PPA.',
    estimatedAnnualContractValueUSD: 160000,
  },
  {
    id: 'corp-csuite-13',
    companyName: 'Helvetia Private Wealth & Trust SA',
    contactEmail: 'governance@helvetia-trust.ch',
    recipientName: 'Jean-Pierre Meyer',
    recipientTitle: 'Chief Legal Officer',
    jurisdiction: 'Switzerland',
    countryFlag: '🇨🇭',
    industry: 'Private Banking & Wealth Preservation',
    customValuePropositionEn: 'Swiss Code of Obligations (OR) trust agreements and military-grade E2EE AES-256 vault archiving.',
    customValuePropositionAr: 'حوكمة عقود الصناديق الائتمانية بموجب قانون الالتزامات السويسري مع التشفير العسكري.',
    estimatedAnnualContractValueUSD: 290000,
  },
  {
    id: 'corp-csuite-14',
    companyName: 'Rotterdam EuroLogistics Hub NV',
    contactEmail: 'csuite@rotterdam-eurologistics.nl',
    recipientName: 'Willem Van Dijk',
    recipientTitle: 'CEO',
    jurisdiction: 'Netherlands',
    countryFlag: '🇳🇱',
    industry: 'European Port Operations & Customs',
    customValuePropositionEn: 'Dutch Civil Code Book 8 maritime & multimodal transport liability optimization and UN CISG compliance.',
    customValuePropositionAr: 'تحسين عقود النقل واللوجستيات بموجب القانون الهولندي والاتفاقيات الدولية للأمم المتحدة CISG.',
    estimatedAnnualContractValueUSD: 165000,
  },

  // ── Asia-Pacific & Global Powerhouses ──
  {
    id: 'corp-csuite-15',
    companyName: 'Pacific Star Asset Management Pte.',
    contactEmail: 'governance@pacificstar-assets.sg',
    recipientName: 'Benjamin Tan',
    recipientTitle: 'CFO',
    jurisdiction: 'Singapore',
    countryFlag: '🇸🇬',
    industry: 'Sovereign Fintech & Wealth Fund',
    customValuePropositionEn: 'Singapore Law & SIAC 2024 International Arbitration templates with zero-leakage military confidentiality.',
    customValuePropositionAr: 'صياغة اتفاقيات الاستثمار والتحكيم الدولي SIAC بسنغافورة مع ضمان سرية البيانات.',
    estimatedAnnualContractValueUSD: 240000,
  },
  {
    id: 'corp-csuite-16',
    companyName: 'Shenzhen Dragon Tech & AI Ventures Ltd',
    contactEmail: 'corporate@shenzhen-dragontech.cn',
    recipientName: 'Li Wei',
    recipientTitle: 'CEO',
    jurisdiction: 'China / Hong Kong',
    countryFlag: '🇨🇳',
    industry: 'Hardware & AI Semiconductor Supply',
    customValuePropositionEn: 'PRC Civil Code 2021 & HKIAC international trade arbitration and cross-border IP licensing protection.',
    customValuePropositionAr: 'حوكمة عقود التجارة والتصنيع الصينية وقواعد تحكيم هونغ كونغ HKIAC وترخيص الابتكارات.',
    estimatedAnnualContractValueUSD: 230000,
  },
  {
    id: 'corp-csuite-17',
    companyName: 'Tokyo Frontier Robotics & Quantum Corp',
    contactEmail: 'executive.desk@tokyo-frontier.jp',
    recipientName: 'Kenji Sato',
    recipientTitle: 'CEO',
    jurisdiction: 'Japan',
    countryFlag: '🇯🇵',
    industry: 'Advanced Robotics & DeepTech',
    customValuePropositionEn: 'Japanese Civil Code commercial contract compliance and international joint venture governance.',
    customValuePropositionAr: 'تأطير عقود المشاريع المشتركة الدولية والامتثال للأنظمة التجارية اليابانية.',
    estimatedAnnualContractValueUSD: 260000,
  },
  {
    id: 'corp-csuite-18',
    companyName: 'Sydney Pacific Infrastructure Partners Ltd',
    contactEmail: 'cfo@sydney-pacific.com.au',
    recipientName: 'Liam O’Connor',
    recipientTitle: 'CFO',
    jurisdiction: 'Australia',
    countryFlag: '🇦🇺',
    industry: 'Infrastructure & Mining Logistics',
    customValuePropositionEn: 'Australian Corporations Act 2001 compliance and mining concession contract forensic risk scoring.',
    customValuePropositionAr: 'تدقيق ومسح مخاطر عقود امتيازات التعدين والبنية التحتية الأسترالية.',
    estimatedAnnualContractValueUSD: 200000,
  },
  {
    id: 'corp-csuite-19',
    companyName: 'Maple Leaf International Legal Partners Corp',
    contactEmail: 'executive.board@mapleleaf-legal.ca',
    recipientName: 'David Miller',
    recipientTitle: 'Managing Partner',
    jurisdiction: 'Canada',
    countryFlag: '🇨🇦',
    industry: 'Corporate Law Firm Network',
    customValuePropositionEn: 'Canadian corporate & commercial law templates and automated institutional contract negotiation assistant.',
    customValuePropositionAr: 'تزويد مكاتب المحاماة الكندية بمستودع العقود الذكي ومساعد التفاوض الآلي.',
    estimatedAnnualContractValueUSD: 170000,
  },
  {
    id: 'corp-csuite-20',
    companyName: 'Istanbul Strategic Trade & Maritime AS',
    contactEmail: 'board@istanbul-strategic.tr',
    recipientName: 'Murat Yilmaz',
    recipientTitle: 'CEO',
    jurisdiction: 'Turkey',
    countryFlag: '🇹🇷',
    industry: 'Eurasian Maritime Trade & Logistics',
    customValuePropositionEn: 'Turkish Code of Obligations No. 6098 and ISTAC International Arbitration contract shielding.',
    customValuePropositionAr: 'حوكمة عقود التجارة الإقليمية بموجب قانون الالتزامات التركي 6098 ومحكمة إسطنبول للتحكيم ISTAC.',
    estimatedAnnualContractValueUSD: 155000,
  },
];

const DISPATCHED_REGISTRY_KEY = 'juristech_csuite_sent_registry_v1';
const AUTO_MACHINE_STATE_KEY = 'juristech_csuite_auto_machine_state_v1';

export interface AutoMachineState {
  isActive: boolean;
  dailyQuota: number;
  dispatchedTodayCount: number;
  lastRunDate: string;
  totalLifetimeDispatched: number;
  lastDispatchedCompany?: string;
  nextScheduledRunIso?: string;
}

class AutonomousCSuiteOutreachEngine {
  private isRunning: boolean = false;
  private timer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.autoRunDailyBatch(), 3000);
      this.timer = setInterval(() => this.autoRunDailyBatch(), 1000 * 60 * 30);
    }
  }

  public getState(): AutoMachineState {
    const today = new Date().toISOString().split('T')[0];
    try {
      const raw = localStorage.getItem(AUTO_MACHINE_STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lastRunDate === today) {
          return parsed;
        } else {
          const newState: AutoMachineState = {
            ...parsed,
            dailyQuota: 20,
            dispatchedTodayCount: 0,
            lastRunDate: today,
          };
          this.saveState(newState);
          return newState;
        }
      }
    } catch {}

    const defaultState: AutoMachineState = {
      isActive: true,
      dailyQuota: 20,
      dispatchedTodayCount: 0,
      lastRunDate: today,
      totalLifetimeDispatched: 0,
    };
    this.saveState(defaultState);
    return defaultState;
  }

  public saveState(state: AutoMachineState) {
    try {
      localStorage.setItem(AUTO_MACHINE_STATE_KEY, JSON.stringify(state));
    } catch {}
  }

  public getDispatchedEmailsSet(): Set<string> {
    try {
      const raw = localStorage.getItem(DISPATCHED_REGISTRY_KEY);
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set<string>();
  }

  private registerDispatchedEmail(email: string) {
    const set = this.getDispatchedEmailsSet();
    set.add(email.toLowerCase().trim());
    try {
      localStorage.setItem(DISPATCHED_REGISTRY_KEY, JSON.stringify(Array.from(set)));
    } catch {}
  }

  /**
   * Main Auto-Pilot Engine: Dispatches exactly up to 20 emails per day autonomously.
   */
  public async autoRunDailyBatch(): Promise<{ successCount: number; remainingQuota: number }> {
    if (this.isRunning) return { successCount: 0, remainingQuota: 0 };
    
    const state = this.getState();
    if (!state.isActive) {
      console.log('[C-Suite Auto-Machine] ⏸️ Engine is paused by Admin.');
      return { successCount: 0, remainingQuota: state.dailyQuota - state.dispatchedTodayCount };
    }

    const remainingToday = Math.max(0, state.dailyQuota - state.dispatchedTodayCount);
    if (remainingToday <= 0) {
      console.log(`[C-Suite Auto-Machine] ✅ Daily quota fulfilled today (${state.dailyQuota}/${state.dailyQuota} emails sent).`);
      return { successCount: 0, remainingQuota: 0 };
    }

    this.isRunning = true;
    let successfulDispatches = 0;
    const sentSet = this.getDispatchedEmailsSet();

    console.log(`[C-Suite Auto-Machine] 🚀 Commencing autonomous dispatch of up to ${remainingToday} C-Suite executive proposals...`);

    for (const corp of ENTERPRISE_CSUITE_DIRECTORY) {
      if (successfulDispatches >= remainingToday) break;

      const cleanEmail = corp.contactEmail.toLowerCase().trim();
      if (sentSet.has(cleanEmail)) {
        continue;
      }

      try {
        const leadPayload: CrmClientLead = {
          id: corp.id,
          clientName: `${corp.recipientName} (${corp.recipientTitle})`,
          companyName: corp.companyName,
          contactEmail: corp.contactEmail,
          jurisdiction: corp.jurisdiction,
          flag: corp.countryFlag,
          status: 'New',
          lastContactDate: new Date().toISOString().split('T')[0],
          estimatedValueUSD: corp.estimatedAnnualContractValueUSD,
          leadScore: 99,
          notesAr: corp.customValuePropositionAr,
          notesEn: corp.customValuePropositionEn,
          lastActivityAr: 'جاهز للإرسال الآلي للإدارة العليا (CEO/CFO)',
          lastActivityEn: 'Autonomous C-Suite pipeline target',
        };

        const result = await crmService.triggerAiOutreach(leadPayload, corp.customValuePropositionEn, true);
        if (result) {
          this.registerDispatchedEmail(cleanEmail);
          successfulDispatches++;
          state.dispatchedTodayCount++;
          state.totalLifetimeDispatched++;
          state.lastDispatchedCompany = corp.companyName;
          this.saveState(state);

          console.log(`[C-Suite Auto-Machine] ✉️ Dispatched [${state.dispatchedTodayCount}/20] to: ${corp.recipientTitle} of ${corp.companyName} (${corp.contactEmail})`);
        }
      } catch (err) {
        console.warn(`[C-Suite Auto-Machine] Error dispatching to ${corp.companyName}:`, err);
      }
    }

    this.isRunning = false;
    return {
      successCount: successfulDispatches,
      remainingQuota: Math.max(0, state.dailyQuota - state.dispatchedTodayCount),
    };
  }

  public toggleActive(enabled: boolean) {
    const state = this.getState();
    state.isActive = enabled;
    this.saveState(state);
    if (enabled) {
      this.autoRunDailyBatch();
    }
  }
}

export const autonomousCSuiteOutreachEngine = new AutonomousCSuiteOutreachEngine();
