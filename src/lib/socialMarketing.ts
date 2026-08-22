/**
 * src/lib/socialMarketing.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Autonomous AI Social Media & Real-time Auto-Engagement Engine
 * Integrated with AI Intent Recognition & Human-in-the-Loop Approval Workflow
 */

import { callAI } from './api';
import { classifyUserIntent, UserIntent } from '../services/aiIntentClassifier';

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram';
  topic: string;
  language: 'ar' | 'en';
  content: string;
  hashtags: string[];
  imageUrl?: string;
  scheduledTime: string;
  status: 'scheduled' | 'published';
  engagement: {
    likes: number;
    shares: number;
    commentsCount: number;
    clicks: number;
  };
}

export interface AutoEngagement {
  id: string;
  postId: string;
  platform: 'twitter' | 'linkedin' | 'instagram';
  author: string;
  commentText: string;
  replyText: string;
  intent?: UserIntent;
  reviewStatus: 'pending_approval' | 'approved' | 'rejected';
  humanNote?: string;
  timestamp: string;
  status: 'answered';
}

export interface MarketingAnalytics {
  totalPublished: number;
  totalEngagement: number;
  avgEngagementRate: number;
  bestTimeSlot: string;
  bestTopic: string;
  selfOptimizedCycles: number;
}

// ─── Constants & Persistence Keys ────────────────────────────────────────────
const STORAGE_POSTS_KEY = 'juristech_auto_social_posts';
const STORAGE_ENGAGE_KEY = 'juristech_auto_social_engagement';
const STORAGE_ANALYTICS_KEY = 'juristech_auto_social_analytics';
const STORAGE_REVIEW_MODE_KEY = 'juristech_auto_engagement_review_mode';

/** Official LinkedIn Credentials & Profile Config */
export const LINKEDIN_OFFICIAL_CONFIG = {
  pageName: 'JURISTECH Solutions',
  partnerId: '7896543',
  officialEmail: 'Drzyogo.ca@gmail.com',
  targetAudience: 'Global B2B Enterprises, Law Firms, Corporate Counsel, General Counsel (MENA, GCC, EU, Asia)',
  profileUrl: 'https://www.linkedin.com/in/juristech-solutions-14954b427/',
  status: 'Connected & Active 🟢',
};

/** Official TikTok Profile Config */
export const TIKTOK_OFFICIAL_CONFIG = {
  accountName: '@juristech.solutio6',
  profileUrl: 'https://www.tiktok.com/@juristech.solutio6?_r=1&_t=ZS-98uWtMFrHld',
  targetAudience: 'Entrepreneurs, Startups, Business Owners & Global Audience',
  status: 'Official Channel Active 🟢',
};

/** Official X (Twitter) Profile Config */
export const TWITTER_OFFICIAL_CONFIG = {
  accountName: '@JurisTech_AI',
  profileUrl: 'https://x.com/JurisTech_AI',
  targetAudience: 'Global B2B Enterprises, Law Firms, C-Suite Officers & VCs',
  status: 'Connected & Active 🟢',
};

export const DISALLOWED_TRADEMARK_KEYWORDS = [
  'legalshield usa',
  'legalshield america',
  'legal shield us',
  'legalshield corporation',
  'ppl legalshield',
];

export function filterTrademarkCompliantAdKeywords(keywords: string[]): string[] {
  return keywords.filter(k => {
    const lower = k.toLowerCase();
    return !DISALLOWED_TRADEMARK_KEYWORDS.some(disallowed => lower.includes(disallowed));
  });
}

const CAMPAIGN_TOPICS = [
  'أهمية صياغة العقود التجارية بالذكاء الاصطناعي',
  'كيف تحمي حقوق الملكية الفكرية لشركتك الناشئة بنقرة واحدة',
  'أثر التوقيع الإلكتروني الرقمي الموثق في المحاكم العربية والدولية',
  'تجنب المسؤولية القانونية غير المحدودة في عقود التوريد',
  'اتفاقيات NDA الدولية وكيفية صياغتها بنظام RAG الذكي',
  'Why B2B startups need autonomous NDA generators',
  'The legal impact of authenticated e-signatures in GCC region',
  'How to audit legal risk in vendor contracts automatically',
];

const PLATFORMS: Array<SocialPost['platform']> = ['linkedin', 'twitter', 'instagram'];

// ─── Human-in-the-Loop Review Mode Control ───────────────────────────────────
export function isReviewModeActive(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_REVIEW_MODE_KEY);
    return val === null ? true : val === 'true'; // Default to Review & Approve Mode ACTIVE
  } catch {
    return true;
  }
}

export function toggleReviewMode(active: boolean): void {
  try {
    localStorage.setItem(STORAGE_REVIEW_MODE_KEY, String(active));
  } catch {}
}

// ─── Persistence Helpers ─────────────────────────────────────────────────────
export function getStoredPosts(): SocialPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_POSTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function savePosts(posts: SocialPost[]) {
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
}

export function getStoredEngagements(): AutoEngagement[] {
  try {
    const raw = localStorage.getItem(STORAGE_ENGAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveEngagements(engagements: AutoEngagement[]) {
  localStorage.setItem(STORAGE_ENGAGE_KEY, JSON.stringify(engagements));
}

// ─── Human Approval Operations ───────────────────────────────────────────────
export function approveEngagementResponse(id: string): void {
  const list = getStoredEngagements();
  const target = list.find(e => e.id === id);
  if (target) {
    target.reviewStatus = 'approved';
    saveEngagements(list);
    console.info(`[Human-in-the-Loop] Approved auto-response ${id} for social publishing.`);
  }
}

export function editEngagementResponse(id: string, newReplyText: string, humanNote?: string): void {
  const list = getStoredEngagements();
  const target = list.find(e => e.id === id);
  if (target) {
    target.replyText = newReplyText;
    if (humanNote) target.humanNote = humanNote;
    target.reviewStatus = 'approved';
    saveEngagements(list);
    console.info(`[Human-in-the-Loop] Edited and approved auto-response ${id}.`);
  }
}

export function rejectEngagementResponse(id: string): void {
  const list = getStoredEngagements();
  const target = list.find(e => e.id === id);
  if (target) {
    target.reviewStatus = 'rejected';
    saveEngagements(list);
    console.info(`[Human-in-the-Loop] Rejected auto-response ${id}.`);
  }
}

export function getStoredMarketingAnalytics(): MarketingAnalytics {
  try {
    const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    totalPublished: 0,
    totalEngagement: 0,
    avgEngagementRate: 0.0,
    bestTimeSlot: '10:00 AM (RTL Optimized)',
    bestTopic: 'M&A Governance',
    selfOptimizedCycles: 1,
  };
}

export function saveMarketingAnalytics(stats: MarketingAnalytics) {
  localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(stats));
}

// ─── AI Content Generator ────────────────────────────────────────────────────
export async function generateSocialPostContent(
  platform: SocialPost['platform'],
  topic: string,
  language: 'ar' | 'en'
): Promise<{ content: string; hashtags: string[]; imageUrl: string }> {
  const prompt = language === 'ar'
    ? `اكتب منشوراً تسويقياً وتثقيفياً احترافياً ومقنعاً جداً لشركات B2B لمنصة ${platform === 'twitter' ? 'تويتر/X' : platform === 'instagram' ? 'إنستجرام' : 'لينكد إن (LinkedIn)'} يروج لمنصة JurisTech Solutions (https://juristech.solutions).\nالموضوع: ${topic}.\nيجب أن يتضمن المنشور دعوة واضحة ومقنعة للغاية لاتخاذ إجراء (CTA) مثل "احصل على استشارتك الآن" أو "ولد عقدك الذكي الآن". لا تذكر أي تفاصيل تحريرية أو إرشادات كتابية، اكتب المنشور والهاشتاجات مباشرة.`
    : `Generate a high-converting professional B2B marketing & educational post for ${platform === 'twitter' ? 'Twitter/X' : platform === 'instagram' ? 'Instagram' : 'LinkedIn'} promoting JurisTech Solutions (https://juristech.solutions).\nTopic: ${topic}.\nInclude a strong, high-converting call to action. Return only the post text and hashtags directly.`;

  const content = await callAI(prompt);
  
  const hashtags = content.match(/#[A-Za-z0-9_\u0600-\u06FF]+/g) || ['#JurisTechSolution', '#AI_Legal', '#LegalTech'];
  const cleanContent = content.replace(/#[A-Za-z0-9_\u0600-\u06FF]+/g, '').trim();

  const imageSeed = Math.floor(Math.random() * 1000);
  const imageUrl = `https://picsum.photos/seed/legal_${platform}_${imageSeed}/800/600`;

  return {
    content: cleanContent,
    hashtags: hashtags.slice(0, 5),
    imageUrl,
  };
}

// ─── Simulation of API Posting ───────────────────────────────────────────────
async function publishToSocialMediaAPI(post: SocialPost): Promise<boolean> {
  console.log(`[API Gateway] POST /v1/${post.platform}/share - Dispatching campaign...`);
  await new Promise(resolve => setTimeout(resolve, 600));
  return true;
}

// ─── Background Social Media Worker / Cron ──────────────────────────────────
export async function runSocialSchedulerWorker(): Promise<number> {
  const posts = getStoredPosts();
  let updatedCount = 0;
  const now = new Date();

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (post.status === 'scheduled' && new Date(post.scheduledTime) <= now) {
      console.log(`[Marketing Worker] Publishing scheduled post ${post.id} to ${post.platform}...`);
      
      const apiSuccess = await publishToSocialMediaAPI(post);
      if (apiSuccess) {
        posts[i] = {
          ...post,
          status: 'published',
          engagement: {
            likes: Math.floor(Math.random() * 120 + 20),
            shares: Math.floor(Math.random() * 30 + 5),
            commentsCount: Math.floor(Math.random() * 10 + 2),
            clicks: Math.floor(Math.random() * 200 + 40),
          }
        };
        updatedCount++;
      }
    }
  }

  if (updatedCount > 0) {
    savePosts(posts);
    recalculateAnalytics();
  }

  return updatedCount;
}

// ─── Automated Content Ingestion Worker ──────────────────────────────────────
export async function runCampaignGeneratorWorker(): Promise<boolean> {
  const posts = getStoredPosts();
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;

  if (scheduledCount >= 3) return false;

  console.log('[Marketing AI Worker] Generation queue below threshold. Triggering content creation...');

  const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
  const topic = CAMPAIGN_TOPICS[Math.floor(Math.random() * CAMPAIGN_TOPICS.length)];
  const language = topic.match(/[\u0600-\u06FF]/) ? 'ar' : 'en';

  try {
    const generated = await generateSocialPostContent(platform, topic, language);
    
    const timeOffset = (scheduledCount + 1) * 30 * 60 * 1000;
    const scheduledTime = new Date(Date.now() + timeOffset).toISOString();

    const newPost: SocialPost = {
      id: `POST-${Date.now()}`,
      platform,
      topic,
      language,
      content: generated.content,
      hashtags: generated.hashtags,
      imageUrl: generated.imageUrl,
      scheduledTime,
      status: 'scheduled',
      engagement: { likes: 0, shares: 0, commentsCount: 0, clicks: 0 },
    };

    savePosts([newPost, ...posts]);
    return true;
  } catch (err) {
    console.error('[Marketing AI Worker] Generation failed:', err);
    return false;
  }
}

// ─── Auto-Engagement Comment/DM Replier Worker with AI Intent Classifier ──────
export async function runAutoEngagementWorker(): Promise<number> {
  const posts = getStoredPosts().filter(p => p.status === 'published');
  if (posts.length === 0) return 0;

  const randomPost = posts[Math.floor(Math.random() * posts.length)];
  const engagements = getStoredEngagements();

  const commentsPoolAr = [
    'أريد حجز استشارة مباشرة وعاجلة مع د. محمد مصطفى.',
    'كيف يمكن حجز موعد لقاء للشركات؟',
    'هل تدعم منصتكم القوانين السارية في السعودية ومصر والأردن؟',
    'أنا مهتم بتجربة توليد عقود التأسيس للشركات الناشئة، كيف يمكن البدء؟',
    'كم سعر الاشتراك السنوي للمؤسسات؟',
  ];

  const commentsPoolEn = [
    'I want to schedule a direct live consultation.',
    'How do I book a direct appointment with your legal team?',
    'Does this support international NDA laws for US-to-GCC companies?',
    'Awesome concept! What are your pricing plans for enterprise audits?',
    'I need to talk to a legal advisor regarding a cross-border contract.',
  ];

  const userNames = ['@TechFounder', '@AhmedLegal', '@SabaHolding', '@GlobalAdvisors', '@Rawan_B2B', '@InvestKuwait'];

  const commentText = randomPost.language === 'ar'
    ? commentsPoolAr[Math.floor(Math.random() * commentsPoolAr.length)]
    : commentsPoolEn[Math.floor(Math.random() * commentsPoolEn.length)];

  if (engagements.find(e => e.postId === randomPost.id && e.commentText === commentText)) {
    return 0;
  }

  console.log(`[Auto-Engagement] Inbound client inquiry detected on ${randomPost.platform}: "${commentText}"`);

  // 1. Run Intent Recognition & Classification Engine
  const intentResult = classifyUserIntent(commentText);
  const replyText = intentResult.recommendedReply;

  // 2. Check if Human-in-the-Loop Review Mode is active
  const reviewActive = isReviewModeActive();
  const reviewStatus = reviewActive ? 'pending_approval' : 'approved';

  const newEngage: AutoEngagement = {
    id: `ENG-${Date.now()}`,
    postId: randomPost.id,
    platform: randomPost.platform,
    author: userNames[Math.floor(Math.random() * userNames.length)],
    commentText,
    replyText,
    intent: intentResult.intent,
    reviewStatus,
    timestamp: new Date().toISOString(),
    status: 'answered',
  };

  saveEngagements([newEngage, ...engagements]);
  return 1;
}

// ─── Self-Optimization & Learning Evaluation Loop ───────────────────────────
export function runSelfOptimizationLoop() {
  const posts = getStoredPosts().filter(p => p.status === 'published');
  if (posts.length === 0) return;

  const stats = getStoredMarketingAnalytics();
  
  let highestPost = posts[0];
  let maxEngagement = 0;

  posts.forEach(p => {
    const sum = p.engagement.likes + p.engagement.shares * 2 + p.engagement.clicks;
    if (sum > maxEngagement) {
      maxEngagement = sum;
      highestPost = p;
    }
  });

  const bestTopic = highestPost.topic;
  const bestTime = new Date(highestPost.scheduledTime).getHours();
  const timeSlot = `${bestTime}:00 ${bestTime >= 12 ? 'PM' : 'AM'} (AI Optimized)`;

  const updatedStats: MarketingAnalytics = {
    ...stats,
    bestTopic,
    bestTimeSlot: timeSlot,
    selfOptimizedCycles: stats.selfOptimizedCycles + 1,
  };

  saveMarketingAnalytics(updatedStats);
}

function recalculateAnalytics() {
  const posts = getStoredPosts().filter(p => p.status === 'published');
  const stats = getStoredMarketingAnalytics();
  if (posts.length === 0) return;

  let totalPublished = posts.length;
  let totalEngagement = 0;
  let totalClicks = 0;

  posts.forEach(p => {
    totalEngagement += p.engagement.likes + p.engagement.shares + p.engagement.commentsCount;
    totalClicks += p.engagement.clicks;
  });

  const avgEngagementRate = Number((totalEngagement / Math.max(totalPublished, 1)).toFixed(1));

  saveMarketingAnalytics({
    ...stats,
    totalPublished,
    totalEngagement,
    avgEngagementRate,
  });
}
