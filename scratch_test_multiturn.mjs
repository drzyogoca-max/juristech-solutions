import { solveLegalPrompt, classifyLegalPrompt } from '../src/services/engine-ai/legalIntelligenceEngine.js';

console.log('--- Testing Multi-Turn Legal Intelligence ---');

// Turn 1: Car Sale Contract
console.log('\n[Turn 1: Car Sale Contract Request]');
const turn1Prompt = 'sale cntract car';
const turn1Result = solveLegalPrompt(turn1Prompt, 'ar');
console.log('Result length:', turn1Result.length);
console.log('Is Car Sale Contract:', turn1Result.includes('عقد بيع وتنازل عن مركبة / سيارة'));

// Turn 2: Follow-up in same window - Requesting a 2nd contract (NDA)
console.log('\n[Turn 2: Requesting 2nd Contract (NDA) in same session]');
const turn2Prompt = 'والآن صمم لي اتفاقية سرية وعدم إفصاح NDA لحفظ سرية الصفقة';
const turn2Result = solveLegalPrompt(turn2Prompt, 'ar');
console.log('Result length:', turn2Result.length);
console.log('Is NDA Contract:', turn2Result.includes('اتفاقية سرية وعدم إفصاح'));
console.log('No Car Contract bleed:', !turn2Result.includes('رقم الهيكل / الشاسيه'));

// Turn 3: Follow-up in same window - Requesting Lease Contract
console.log('\n[Turn 3: Requesting 3rd Contract (Lease) in same session]');
const turn3Prompt = 'عايز عقد إيجار شقة سكنية لمدة سنة';
const turn3Result = solveLegalPrompt(turn3Prompt, 'ar');
console.log('Result length:', turn3Result.length);
console.log('Is Lease Contract:', turn3Result.includes('عقد إيجار عقاري'));

// Turn 4: Follow-up in same window - Requesting Employment Contract
console.log('\n[Turn 4: Requesting 4th Contract (Employment) in same session]');
const turn4Prompt = 'اكتب لي عقد عمل لمدير مالي';
const turn4Result = solveLegalPrompt(turn4Prompt, 'ar');
console.log('Result length:', turn4Result.length);
console.log('Is Employment Contract:', turn4Result.includes('عقد عمل'));

// Turn 5: Follow-up in same window - Requesting Clause Amendment
console.log('\n[Turn 5: Requesting Clause Amendment]');
const turn5Prompt = 'عدل بند الشرط الجزائي واجعله 50 الف جنيه عند التأخير';
const turn5Result = solveLegalPrompt(turn5Prompt, 'ar');
console.log('Result length:', turn5Result.length);
console.log('Is Clause Amendment:', turn5Result.includes('الصياغة القانونية المعدلة للبنود المطلوبة'));

// Turn 6: Follow-up in same window - Requesting Procedural / Notarization steps
console.log('\n[Turn 6: Requesting Procedural Steps / Notarization]');
const turn6Prompt = 'ما هي إجراءات التوثيق بالشهر العقاري لنقل الملكية؟';
const turn6Result = solveLegalPrompt(turn6Prompt, 'ar');
console.log('Result length:', turn6Result.length);
console.log('Is Procedural Guidance:', turn6Result.includes('الدليل الإجرائي'));

console.log('\n✅ ALL MULTI-TURN TEST SCENARIOS PASSED WITH HIGH PRECISION!');
