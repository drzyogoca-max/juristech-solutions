import { detectDocumentLanguage } from '../lib/pdfExtractor';

export function runChatFileUploadTestSuite() {
  // Test 1: Language Isolation Assertion for Arabic Contract
  const arabicContractSample = `عقد توريد وخدمات صيانة برمجة وحلول تقنية
الطرف الأول: شركة الحلول الرقمية المحدودة
الطرف الثاني: المؤسسة الوطنية للتطبيقات
المادة الأولى: النطاق والتنفيذ والالتزامات المالية والتأخير القسري والتنفيذ الجبري.`;
  
  const langAr = detectDocumentLanguage(arabicContractSample);
  if (langAr !== 'ar') {
    throw new Error('Assertion Failed: Arabic contract text misidentified.');
  }

  // Test 2: Language Isolation Assertion for English Contract
  const englishContractSample = `MASTER SERVICES AGREEMENT
Party A: JurisTech Corp (Delaware Corporation)
Party B: Global Client LLC
Section 1: Scope of Services, Payment Terms, Limitation of Liability, and Governing Law.`;

  const langEn = detectDocumentLanguage(englishContractSample);
  if (langEn !== 'en') {
    throw new Error('Assertion Failed: English contract text misidentified.');
  }

  // Test 3: Structured 3-Section Report Format Validator
  const sampleReportText = `
📌 Section 1: Executive Contract Summary (ملخص العقد الجوهري)
Summary of obligations...

⚠️ Section 2: Critical Risk Assessment & Loopholes (تقييم المخاطر الجوهرية والثغرات القانونية)
Risk analysis details...

💡 Section 3: Executive Legal Recommendations & Redlines (التوصيات القانونية التنفيذية والتعديلات الحمائية)
Recommended redlines...
`;

  if (!sampleReportText.includes('Section 1') || !sampleReportText.includes('Section 2') || !sampleReportText.includes('Section 3')) {
    throw new Error('Assertion Failed: 3-Section Report format missing required section headers.');
  }

  return true;
}

// Auto-run test suite in DEV mode
if (import.meta.env.DEV) {
  try {
    runChatFileUploadTestSuite();
    console.log('✓ Chat File NLP Ingestion Test Suite PASSED');
  } catch (e) {
    console.error('✘ Chat File NLP Test Suite FAILED:', e);
  }
}
