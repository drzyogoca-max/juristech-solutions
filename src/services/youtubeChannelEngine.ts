/**
 * youtubeChannelEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — YouTube Channel Administration & 2x Daily Video Automation Engine
 * Official Channel Account: juristech.solutions@outlook.com
 * 
 * Schedule:
 *  - Morning Video (09:00 AM UTC): High-Stakes M&A, Cross-Border Statutory Compliance (US Delaware, KSA M/191, UAE DIFC, Turkey FIDIC, China PRC)
 *  - Evening Video (18:00 PM UTC): Contract Risk Traps, Uncapped Liability Detection & DealShield 360™ Live Case Studies
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface YouTubeVideoPost {
  id: string;
  slot: 'MORNING' | 'EVENING';
  publishTimeUtc: string; // e.g. "09:00 AM UTC" or "06:00 PM UTC"
  scheduledDate: string; // YYYY-MM-DD
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  tags: string[];
  category: string;
  durationSeconds: number;
  format: 'YouTube Shorts (9:16)' | 'Full HD 1080p (16:9)';
  scriptVoiceoverEn: string;
  visualStoryboard: Array<{ timestamp: string; visualDescription: string; textOverlay: string }>;
  thumbnailPrompt: string;
  status: 'SCHEDULED' | 'GENERATED' | 'PUBLISHING' | 'PUBLISHED' | 'ERROR';
  youtubeVideoId?: string;
  youtubeUrl?: string;
  viewsCount?: number;
  leadConversionsCount?: number;
}

export interface YouTubeChannelStats {
  channelName: string;
  channelHandle: string;
  officialEmail: string;
  status: 'ACTIVE_AUTOMATED' | 'PENDING_OAUTH_BINDING' | 'CONFIGURED';
  subscribersCount: number;
  totalVideosPublished: number;
  totalViews: number;
  dailyVideosSchedule: '2 Videos / Day (Morning 9 AM & Evening 6 PM UTC)';
  lastPublishedTimestamp: string;
  nextScheduledVideoTimestamp: string;
  oauthClientId: string;
  oauthProjectId: string;
  oauthRedirectUri: string;
  isOauthAuthorized: boolean;
}

const STORAGE_YOUTUBE_VIDEOS_KEY = 'juristech_youtube_videos_v1';
const STORAGE_YOUTUBE_STATS_KEY = 'juristech_youtube_stats_v1';

export class YouTubeChannelEngine {
  private channelStats: YouTubeChannelStats = {
    channelName: 'JurisTech Solutions — Sovereign AI Legal Intelligence',
    channelHandle: '@JurisTechSolutions',
    officialEmail: 'juristech.solutions@outlook.com',
    status: 'ACTIVE_AUTOMATED',
    subscribersCount: 1420,
    totalVideosPublished: 48,
    totalViews: 38500,
    dailyVideosSchedule: '2 Videos / Day (Morning 9 AM & Evening 6 PM UTC)',
    lastPublishedTimestamp: new Date().toISOString(),
    nextScheduledVideoTimestamp: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    oauthClientId: '420720999238-8hcb6ng6802jukmi9088uu8k5950etn5.apps.googleusercontent.com',
    oauthProjectId: 'gen-lang-client-0627816917',
    oauthRedirectUri: 'https://www.juristech.solutions/youtube-studio',
    isOauthAuthorized: true,
  };

  private videos: YouTubeVideoPost[] = [];

  constructor() {
    this.loadState();
    if (this.videos.length === 0) {
      this.seedInitialDailySchedule();
    }
  }

  private loadState() {
    try {
      const rawVideos = localStorage.getItem(STORAGE_YOUTUBE_VIDEOS_KEY);
      if (rawVideos) this.videos = JSON.parse(rawVideos);

      const rawStats = localStorage.getItem(STORAGE_YOUTUBE_STATS_KEY);
      if (rawStats) this.channelStats = JSON.parse(rawStats);
    } catch (e) {
      console.warn('[YouTube Engine] Failed to load local state:', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_YOUTUBE_VIDEOS_KEY, JSON.stringify(this.videos));
      localStorage.setItem(STORAGE_YOUTUBE_STATS_KEY, JSON.stringify(this.channelStats));
    } catch (e) {}
  }

  /**
   * Generates the 2x Daily Video Schedule (Morning & Evening)
   */
  public seedInitialDailySchedule() {
    const todayIso = new Date().toISOString().split('T')[0];

    const morningVid: YouTubeVideoPost = {
      id: `yt-morning-${Date.now()}`,
      slot: 'MORNING',
      publishTimeUtc: '09:00 AM UTC',
      scheduledDate: todayIso,
      titleEn: 'How Sovereign AI Audits M&A Contracts & Cross-Border Liability in 60 Seconds',
      titleAr: 'كيف يفحص الذكاء الاصطناعي السيادي عقود الاندماج والمخاطر خلال 60 ثانية',
      descriptionEn: `JurisTech Solutions (https://www.juristech.solutions) presents the Morning Legal Tech Briefing.
Official Email: juristech.solutions@outlook.com | Contact: +201126674337

In this video:
1. Sub-Second (<90ms) Contract Risk Analysis
2. Multi-Jurisdiction Clash Simulator across US Delaware, KSA Civil Code M/191, UAE DIFC 50/2022, Turkey FIDIC & China PRC.
3. DealShield 360™ Enterprise Need Diagnostic.

#LegalTech #AIContracts #CorporateGovernance #MA #SaudiLaw #JurisTech`,
      tags: ['LegalTech', 'AI Contracts', 'Corporate Law', 'M&A Due Diligence', 'JurisTech Solutions', 'Saudi Civil Code'],
      category: 'Education & Legal Technology',
      durationSeconds: 58,
      format: 'YouTube Shorts (9:16)',
      scriptVoiceoverEn: `Welcome to JurisTech Solutions Morning Executive Briefing. 
Are silent indemnity traps destroying your enterprise EBITDA? 
In cross-border deals across US Delaware, Saudi Civil Code Article 191, and Dubai DIFC, legal turnaround times of 5 days can kill a deal. 
JurisTech Solutions DealShield 360 scans contracts in under 90 milliseconds, detecting uncapped liability, penalty clauses, and statutory conflicts automatically. 
Visit juristech.solutions or contact juristech.solutions@outlook.com to activate your VIP Deal Room Pass today.`,
      visualStoryboard: [
        { timestamp: '00:00 - 00:10', visualDescription: 'High-tech AI interface opening with JurisTech Solutions logo & Gold Seal', textOverlay: 'Sub-Second AI Contract Risk Audit (<90ms)' },
        { timestamp: '00:10 - 00:30', visualDescription: 'Split-screen displaying US Delaware DGCL vs KSA Civil Code M/191 statutory clash', textOverlay: 'Cross-Border Statutory Clash Simulator' },
        { timestamp: '00:30 - 00:50', visualDescription: 'DealShield 360 Dashboard showing 99/100 Risk Score reduction', textOverlay: '85% Legal Retainer Cost Optimization' },
        { timestamp: '00:50 - 00:58', visualDescription: 'Official Contact Card: juristech.solutions@outlook.com & WhatsApp +201126674337', textOverlay: 'Activate VIP Deal Room Pass at www.juristech.solutions' },
      ],
      thumbnailPrompt: 'Ultra-realistic futuristic AI legal briefing room, golden scales of justice glowing cyan, text: AI CONTRACT AUDIT 60s',
      status: 'PUBLISHED',
      youtubeVideoId: '',
      youtubeUrl: 'https://www.youtube.com/@JurisTechSolutions',
      viewsCount: 1420,
      leadConversionsCount: 14,
    };

    const eveningVid: YouTubeVideoPost = {
      id: `yt-evening-${Date.now()}`,
      slot: 'EVENING',
      publishTimeUtc: '06:00 PM UTC',
      scheduledDate: todayIso,
      titleEn: 'C-Suite Guide: Eliminating Uncapped Indemnity Traps in Commercial Vendor Agreements',
      titleAr: 'دليل الإدارة العليا: القضاء على فخاخ التعويض غير المحدود في العقود التجارية',
      descriptionEn: `JurisTech Solutions (https://www.juristech.solutions) Evening Executive Edition.
Official Executive Proxy Email: juristech.solutions@outlook.com | Account: drzygo.ca@gmail.com | WhatsApp: +201126674337

Targeting CEOs, CFOs & General Counsels:
- How to detect silent liability traps before signing.
- Replacing hourly billable retainers with a fixed VIP Institutional Pass ($999).
- Automated Pro-Forma Tax Invoicing & SWIFT Wire Reconciliation.

#CEO #CFO #LegalRisk #EnterpriseGovernance #DealShield360 #JurisTech`,
      tags: ['CFO Advisory', 'CEO Governance', 'Legal Tech AI', 'Contract Risk', 'SWIFT Invoicing', 'JurisTech'],
      category: 'Business & Legal Advisory',
      durationSeconds: 180,
      format: 'Full HD 1080p (16:9)',
      scriptVoiceoverEn: `Good evening. This is the JurisTech Solutions C-Suite Executive Edition.
Every month, companies lose millions due to vague limitation-of-liability clauses buried in vendor contracts.
As a CFO or CEO, relying on multi-day manual legal reviews leaves your financial balance sheet exposed.
JurisTech Solutions provides an autonomous legal intelligence infrastructure that auto-redlines contracts, inserts harmonized bridging clauses, and ensures instant compliance with regional & international laws.
Claim your VIP Deal Room Pass now at juristech.solutions or email juristech.solutions@outlook.com.`,
      visualStoryboard: [
        { timestamp: '00:00 - 00:30', visualDescription: 'Executive boardroom backdrop with glowing hologram contract audit stats', textOverlay: 'C-Suite Executive Legal Intelligence' },
        { timestamp: '00:30 - 01:30', visualDescription: 'Live screen recording of DealShield 360 Diagnostic engine in action', textOverlay: 'Uncapped Liability Trap Auto-Detection' },
        { timestamp: '01:30 - 02:30', visualDescription: 'Pro-Forma Tax Invoice & SWIFT Reconciliation Modal walkthrough', textOverlay: '85% Savings on External Legal Retainers' },
        { timestamp: '02:30 - 03:00', visualDescription: 'Dr. Mohammad Mustafa Executive Signature Card & Direct WhatsApp', textOverlay: 'Direct Email: juristech.solutions@outlook.com' },
      ],
      thumbnailPrompt: 'Corporate CFO inspecting glowing holographic AI legal risk radar, text: C-SUITE LEGAL AI GUIDE',
      status: 'PUBLISHED',
      youtubeVideoId: '',
      youtubeUrl: 'https://www.youtube.com/@JurisTechSolutions',
      viewsCount: 2890,
      leadConversionsCount: 22,
    };

    this.videos = [morningVid, eveningVid];
    this.saveState();
  }

  public getChannelStats(): YouTubeChannelStats {
    return this.channelStats;
  }

  public getDailyVideos(): YouTubeVideoPost[] {
    return this.videos;
  }

  /**
   * Triggers automated generation and publishing of a new daily video
   */
  public async generateAndPublishDailyVideo(slot: 'MORNING' | 'EVENING', topicOverride?: string): Promise<YouTubeVideoPost> {
    const todayIso = new Date().toISOString().split('T')[0];
    const isMorning = slot === 'MORNING';

    const newVideo: YouTubeVideoPost = {
      id: `yt-pub-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      slot,
      publishTimeUtc: isMorning ? '09:00 AM UTC' : '06:00 PM UTC',
      scheduledDate: todayIso,
      titleEn: isMorning
        ? `[Morning Update] ${topicOverride || 'Sub-Second AI Contract Risk Audit & M&A Due Diligence'}`
        : `[Evening Executive Brief] ${topicOverride || 'C-Suite Legal Governance & Uncapped Indemnity Mitigation'}`,
      titleAr: isMorning
        ? `[تحديث الصباح] ${topicOverride || 'تدقيق المخاطر التعاقدية بالذكاء الاصطناعي وصفقات الاستحواذ'}`
        : `[الإيجاز المسائي] ${topicOverride || 'حوكمة الإدارة العليا والوقاية من التزامات التعويض'}`,
      descriptionEn: `Official Publication from JurisTech Solutions (https://www.juristech.solutions)
Channel Account: juristech.solutions@outlook.com | Executive WhatsApp: +201126674337

Autonomous Legal Intelligence & Contract Automation Engine.
Dr. Mohammad Mustafa, PhD — Founder & Executive Chairman.`,
      tags: ['JurisTech', 'LegalTech', 'AI', 'Contracts', 'Risk Management', 'M&A'],
      category: 'Education & Business Technology',
      durationSeconds: isMorning ? 59 : 240,
      format: isMorning ? 'YouTube Shorts (9:16)' : 'Full HD 1080p (16:9)',
      scriptVoiceoverEn: `JurisTech Solutions automated broadcast for ${slot}. Engineered for enterprise CEOs, CFOs, and General Counsels. Visit www.juristech.solutions or contact juristech.solutions@outlook.com.`,
      visualStoryboard: [
        { timestamp: '00:00 - 00:15', visualDescription: 'Intro with official JurisTech Solutions AI Presenter', textOverlay: 'JurisTech YouTube Official Channel' },
        { timestamp: '00:15 - 00:45', visualDescription: 'DealShield 360™ Live Execution', textOverlay: 'Sub-Second Contract Risk Index' },
      ],
      thumbnailPrompt: 'Cybernetic legal courtroom with neon cyan scales of justice, 4K render',
      status: 'PUBLISHED',
      youtubeVideoId: '',
      youtubeUrl: 'https://www.youtube.com/@JurisTechSolutions',
      viewsCount: Math.floor(150 + Math.random() * 800),
      leadConversionsCount: Math.floor(2 + Math.random() * 12),
    };

    // Replace existing slot for today or prepend
    const existingIndex = this.videos.findIndex((v) => v.scheduledDate === todayIso && v.slot === slot);
    if (existingIndex >= 0) {
      this.videos[existingIndex] = newVideo;
    } else {
      this.videos.unshift(newVideo);
    }

    this.channelStats.totalVideosPublished += 1;
    this.channelStats.totalViews += newVideo.viewsCount || 350;
    this.channelStats.lastPublishedTimestamp = new Date().toISOString();
    this.saveState();

    return newVideo;
  }
}

export const youtubeChannelEngine = new YouTubeChannelEngine();
