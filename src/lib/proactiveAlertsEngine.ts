/**
 * proactiveAlertsEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fully Automated AI Monitoring & Trigger Engine for Proactive Legal Alerts
 * Operates in the background, continuously analyzing user data, simulating AI 
 * cross-referencing against global regulatory updates and contract dates.
 */

import { addAlert, getStoredAlerts } from './alertsManager';

const MONITORING_INTERVAL_MS = 1000 * 60 * 15; // Run every 15 minutes in a real scenario
const DEMO_INTERVAL_MS = 1000 * 60 * 2; // Run every 2 minutes for demonstration

// Simulate a database of dynamic global regulatory updates
const DYNAMIC_UPDATES = [
  {
    title_en: 'AI Law Compliance Update 2026',
    title_ar: 'تحديث الامتثال لقانون الذكاء الاصطناعي 2026',
    desc_en: 'New global AI transparency regulations mandate an audit of AI-generated deliverables and liability clauses in all tech contracts.',
    desc_ar: 'قوانين الشفافية العالمية الجديدة للذكاء الاصطناعي تلزم بإجراء تدقيق للمخرجات وشروط المسؤولية في كافة العقود التقنية.',
    priority: 'high' as const,
  },
  {
    title_en: 'Data Localization Mandate Shift',
    title_ar: 'تعديل قوانين توطين البيانات',
    desc_en: 'Data localization requirements in the MENA region have shifted. You must update your cloud hosting compliance terms.',
    desc_ar: 'تغيرت متطلبات توطين البيانات في منطقة الشرق الأوسط. يجب تحديث شروط الامتثال للاستضافة السحابية الخاصة بك.',
    priority: 'medium' as const,
  },
  {
    title_en: 'Digital Signature Recognition expansion',
    title_ar: 'توسيع نطاق الاعتراف بالتوقيع الرقمي',
    desc_en: 'Cross-border digital signatures are now universally recognized across 5 new GCC jurisdictions. Review execution clauses.',
    desc_ar: 'تم الآن الاعتراف بالتواقيع الرقمية العابرة للحدود في 5 دول خليجية جديدة. يرجى مراجعة بنود التنفيذ.',
    priority: 'low' as const,
  }
];

export class ProactiveAlertsEngine {
  private static intervalId: any = null;
  private static isRunning = false;

  /**
   * Initializes the autonomous AI background worker.
   */
  static startWorker() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    console.log('[AI Proactive Alerts Engine] Starting autonomous background worker...');
    
    // Initial scan
    this.performAIScan();

    // Schedule continuous background monitoring
    this.intervalId = setInterval(() => {
      this.performAIScan();
    }, DEMO_INTERVAL_MS);
  }

  static stopWorker() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[AI Proactive Alerts Engine] Worker stopped.');
  }

  /**
   * Core AI Logic: Ingests context and determines if an alert should be fired.
   */
  private static async performAIScan() {
    console.log('[AI Proactive Alerts Engine] Running deep cross-reference scan...');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentAlerts = getStoredAlerts();
    
    // 1. Check for AI Regulatory Updates (Inject 1 random update if not already present)
    const randomUpdate = DYNAMIC_UPDATES[Math.floor(Math.random() * DYNAMIC_UPDATES.length)];
    const alreadyTriggered = currentAlerts.some(a => a.title_en === randomUpdate.title_en);
    
    if (!alreadyTriggered && Math.random() > 0.3) {
      addAlert({
        title_en: randomUpdate.title_en,
        title_ar: randomUpdate.title_ar,
        description_en: `${randomUpdate.desc_en} (⚠️ Pending Manual Fix / Remediation Required)`,
        description_ar: `${randomUpdate.desc_ar} (⚠️ يتطلب مراجعة وإصلاح يدوي لكل بند)`,
        alert_type: 'legal_update',
        priority: randomUpdate.priority,
        status: 'pending',
        action_url: '/compliance'
      });

      console.log(`[AI Proactive Alerts Engine] Generated Pending Regulatory Alert: ${randomUpdate.title_en}`);
    }

    // 2. Scan Contracts for Upcoming Renewals
    this.scanContractExpiries(currentAlerts);
  }

  private static scanContractExpiries(currentAlerts: any[]) {
    // In a real app, this fetches active contracts from the database.
    // We simulate finding a contract that expires soon.
    
    const simulatedContracts = [
      { name: 'Enterprise Cloud SLA', expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() }, // 10 days
      { name: 'MENA Vendor Agreement', expiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() } // 45 days
    ];

    simulatedContracts.forEach(contract => {
      const daysLeft = Math.ceil((new Date(contract.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const isAlreadyAlerted = currentAlerts.some(a => a.alert_type === 'contract_renewal' && a.description_en.includes(contract.name));
      
      if (!isAlreadyAlerted && daysLeft <= 60) {
        addAlert({
          title_ar: 'تنبيه استباقي لتجديد عقد',
          title_en: 'Proactive Contract Renewal',
          description_ar: `لقد رصد الذكاء الاصطناعي أن عقد "${contract.name}" سينتهي خلال ${daysLeft} يوم. يرجى المراجعة والتجديد لحماية حقوقك.`,
          description_en: `AI Monitoring detected that "${contract.name}" expires in ${daysLeft} days. Review and renew to secure your rights.`,
          alert_type: 'contract_renewal',
          priority: daysLeft <= 14 ? 'high' : daysLeft <= 30 ? 'medium' : 'low',
          due_date: contract.expiry,
          action_url: '/vault',
        });
        console.log(`[AI Proactive Alerts Engine] Triggered Renewal Alert for: ${contract.name}`);
      }
    });
  }
}
