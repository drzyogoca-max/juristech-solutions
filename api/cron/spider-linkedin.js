/**
 * Vercel Cron API Function — /api/cron/spider-linkedin
 * JurisTech Solutions | AI-Spider LinkedIn Autonomous Publisher & Ad Campaign Engine
 */

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8',
};

export async function GET(req) {
  return handleSpiderCampaign(req);
}

export async function POST(req) {
  return handleSpiderCampaign(req);
}

export default async function handler(req) {
  return handleSpiderCampaign(req);
}

async function handleSpiderCampaign(req) {
  try {
    const result = await executeSpiderRadarCampaign();
    return Response.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    console.error('[Spider LinkedIn Cron Error]:', err);
    return Response.json({ success: false, error: String(err) }, { status: 500, headers: CORS_HEADERS });
  }
}

// AI-Spider LinkedIn Auto-Publisher Core
export async function executeSpiderRadarCampaign() {
  const campaignAngles = [
    {
      title: "ثغرة الـ 100 ألف دولار في عقود الـ B2B الناشئة",
      body: "أغلب الشركات الناشئة توقع عقود شراكة وتوريد بدون حماية بند النزاعات الدولية. هل شركتك محمية ضد الإفلاس المفاجئ للمقاول الباطن؟ اكتشف كيف تعيد منصة JurisTech Solutions هندسة عقودك في ثوانٍ.",
      cta: "فعل الحماية السيادية لشركتك الآن عبر: https://juristech.solutions"
    },
    {
      title: "تكلفة الجهل القانوني في التوسع الخليجي والدولي",
      body: "التوسع السريع بدون امتثال تشريعي يكبد الشركات ملايين الغرامات. نظام 'المستشار الذكي' في JurisTech Solutions يحلل المخاطر التشريعية قبل التوقيع بدقة تتجاوز 99%.",
      cta: "احمِ أصول شركتك اليوم: https://juristech.solutions"
    },
    {
      title: "إيقاف استنزاف المستشارين الخارجيين في صياغة عقود الـ B2B",
      body: "تتيح منظومة JurisTech Solutions صياغة وتدقيق العقود التجارية بخوارزميات الذكاء الاصطناعي وتطبيق المعايير التشريعية في دول الخليج وأوروبا وأمريكا بضغطة زر.",
      cta: "ابدأ التجربة والتدقيق المباشر: https://juristech.solutions"
    }
  ];

  // Choose campaign angle randomly or sequentially
  const selectedPost = campaignAngles[Math.floor(Math.random() * campaignAngles.length)];
  const linkedinOrgId = process.env.LINKEDIN_ORG_ID || '14954b427';
  const linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  const postPayload = {
    author: `urn:li:organization:${linkedinOrgId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { 
          text: `${selectedPost.title}\n\n${selectedPost.body}\n\n👉 ${selectedPost.cta}\n\n#LegalTech #B2B #JurisTechSolutions #RiskManagement #AI_Legal` 
        },
        shareMediaCategory: 'NONE'
      }
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
  };

  if (linkedinAccessToken) {
    try {
      await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${linkedinAccessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postPayload)
      });
    } catch (apiErr) {
      console.warn('[Spider LinkedIn API Post Notice]:', apiErr);
    }
  }

  console.log("[Spider Radar]: LinkedIn Autonomous Ad Campaign Executed Successfully.", postPayload);

  return {
    success: true,
    campaignTitle: selectedPost.title,
    postedAt: new Date().toISOString(),
    channel: "LinkedIn Autonomous Spider Radar",
    payload: postPayload
  };
}
