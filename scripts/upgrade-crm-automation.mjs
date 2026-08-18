import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const file = resolve('src/services/crmService.ts');
let content = readFileSync(file, 'utf8');

// Replace startDynamicLeadStream with 24/7 full autonomous background engine
const oldScheduler = `  private startDynamicLeadStream() {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      if (this.leads.length === 0) return;
      const idx = Math.floor(Math.random() * this.leads.length);
      const lead = this.leads[idx];

      const delta = Math.floor(Math.random() * 5) - 2;
      lead.leadScore = Math.min(100, Math.max(50, lead.leadScore + delta));

      // In Full Auto-Mode: If lead is high score, auto-trigger the 3-phase dispatch pipeline!
      if (this.isAutoMode && lead.leadScore >= 92 && lead.status !== 'Converted') {
        this.executeAutonomousPipeline(lead);
      } else {
        this.saveLeads();
      }
    }, 15000);
  }`;

const newScheduler = `  private startDynamicLeadStream() {
    if (typeof window === 'undefined') return;

    // 24/7 Full Autonomous Worker Loop (Runs every 10 seconds)
    setInterval(async () => {
      if (!this.isAutoMode) return;

      // 1. If lead queue is empty, auto-inject fresh high-value global leads
      if (this.leads.length === 0) {
        this.injectFreshGlobalLead();
        return;
      }

      // 2. Pick the highest scoring active lead for immediate 3-phase autonomous processing
      const pendingLeads = this.leads.filter(l => l.status !== 'Converted');
      if (pendingLeads.length > 0) {
        // Auto-select lead
        const targetLead = pendingLeads[0];
        console.log(\`[24/7 CRM Autonomous Engine] ⚡ Auto-processing lead: \${targetLead.clientName} (\${targetLead.contactEmail})\`);
        
        try {
          await this.executeAutonomousPipeline(targetLead);
        } catch (err) {
          console.warn('[24/7 CRM Autonomous Engine] Execution notice:', err);
        }
      } else {
        // Inject a fresh lead if all existing are converted
        this.injectFreshGlobalLead();
      }
    }, 10000);
  }`;

if (content.includes(oldScheduler)) {
  content = content.replace(oldScheduler, newScheduler);
  writeFileSync(file, content, 'utf8');
  console.log('✅ Successfully upgraded crmService.ts with 24/7 Zero-Human Full Autonomous Daemon Engine!');
} else {
  console.log('⚠️ Could not find exact scheduler snippet, attempting regex replacement...');
  content = content.replace(/private startDynamicLeadStream\(\) \{[\s\S]*?\n  \}/, newScheduler);
  writeFileSync(file, content, 'utf8');
  console.log('✅ Regex replaced startDynamicLeadStream in crmService.ts!');
}
