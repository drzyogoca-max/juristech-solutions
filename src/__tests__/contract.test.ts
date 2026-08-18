import { detectDocumentLanguage } from '../lib/pdfExtractor';
import { wrapPromptWithJurisdiction, JURISDICTIONS } from '../lib/jurisdiction';

export function runContractTestSuite() {
  const arabicText = 'عقد تقديم خدمات استشارية وتقنية بين الطرف الأول والطرف الثاني';
  const langAr = detectDocumentLanguage(arabicText);
  if (langAr !== 'ar') throw new Error('Failed Arabic language detection assertion');

  const englishText = 'Master Services Agreement entered into by and between Party A and Party B.';
  const langEn = detectDocumentLanguage(englishText);
  if (langEn !== 'en') throw new Error('Failed English language detection assertion');

  const prompt = 'Analyze penalty clause.';
  const jurisdictionEg = JURISDICTIONS.EG;
  const wrappedEg = wrapPromptWithJurisdiction(prompt, jurisdictionEg, true);
  if (!wrappedEg.includes('جمهورية مصر العربية')) throw new Error('Failed Egyptian jurisdiction wrapping assertion');

  const jurisdictionSa = JURISDICTIONS.SA;
  const wrappedSa = wrapPromptWithJurisdiction(prompt, jurisdictionSa, true);
  if (!wrappedSa.includes('المملكة العربية السعودية')) throw new Error('Failed Saudi jurisdiction wrapping assertion');

  return true;
}

// Auto-execute test assertion suite in non-production environment
if (import.meta.env.DEV) {
  try {
    runContractTestSuite();
    console.log('✓ JurisTech Core Intelligence Suite Tests PASSED');
  } catch (e) {
    console.error('✘ JurisTech Test Failure:', e);
  }
}
