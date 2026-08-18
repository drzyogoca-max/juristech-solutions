// نظام الاستخبارات السلوكية والتعرف على الشركات (B2B Telemetry & Entity Profiling)
export async function trackAndAnalyzeUserIntent(req, userSession) {
  let ip = 'unknown';
  let userAgent = '';
  if (req && req.headers) {
    ip = typeof req.headers.get === 'function' ? (req.headers.get('x-forwarded-for') || 'unknown') : (req.headers['x-forwarded-for'] || 'unknown');
    userAgent = typeof req.headers.get === 'function' ? (req.headers.get('user-agent') || '') : (req.headers['user-agent'] || '');
  }

  let body = {};
  if (req && typeof req.json === 'function') {
    body = await req.json().catch(() => ({}));
  } else if (req && req.body) {
    body = req.body;
  }
  
  const { currentPath = '/', timeSpentOnPageMs = 0, scrollDepth = 0 } = body;

  // 1. تقييم مستوى الاهتمام (Intent Scoring Matrix)
  let intentScore = 0;
  if (currentPath.includes('/payment') || currentPath.includes('/pricing')) intentScore += 40;
  if (currentPath.includes('/risk-analyzer') || currentPath.includes('/risk')) intentScore += 50;
  if (currentPath.includes('/contracts') || currentPath.includes('/enterprise-audit')) intentScore += 35;
  if (timeSpentOnPageMs > 45000) intentScore += 25; // قضى أكثر من 45 ثانية يقرأ بند مخاطر أو أسعار
  if (scrollDepth > 80) intentScore += 15;

  // 2. كشف النية الخبيثة/الاستثمارية (Corporate Target Identification)
  let targetProfile = "Standard Visitor";
  let triggerAggressiveConversion = false;

  if (intentScore >= 70) {
    targetProfile = "High-Value B2B Prospect (Corporate Decision Maker)";
    triggerAggressiveConversion = true; // تفعيل فخ الاستقطاب الفوري
  } else if (intentScore >= 40) {
    targetProfile = "Qualified B2B Lead";
  }

  return {
    targetProfile,
    triggerAggressiveConversion,
    intentScore,
    suggestedPayload: triggerAggressiveConversion 
      ? "نظامنا رصد اهتمام مؤسستك المباشر بإدارة مخاطر العقود. هل ترغب في تفعيل 'التقرير السيادي الفوري' لشركتك خلال 30 ثانية؟"
      : null,
    timestamp: new Date().toISOString()
  };
}

export default trackAndAnalyzeUserIntent;
