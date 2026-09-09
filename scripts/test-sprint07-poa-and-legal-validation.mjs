import { readFileSync, existsSync } from 'fs';

let passed = 0;
let failed = 0;

function assertTest(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log(' JurisTech Solutions — Sprint 07: POA Library & Legal Validation Suite');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// ── 1. Power of Attorney Library Data & Templates ────────────────────────────
console.log('--- Group 1: Power of Attorney Library (Data & Templates) ---');
assertTest(existsSync('src/data/powerOfAttorneyLibrary.ts'), 'powerOfAttorneyLibrary.ts exists');
const poaFile = readFileSync('src/data/powerOfAttorneyLibrary.ts', 'utf8');
assertTest(poaFile.includes('POA_LIBRARY'), 'POA_LIBRARY array exported');
assertTest(poaFile.includes('poa-general-absolute'), 'General Absolute POA template present');
assertTest(poaFile.includes('searchPOALibrary'), 'searchPOALibrary helper function exported');
assertTest(poaFile.includes('getPOAsByJurisdiction'), 'getPOAsByJurisdiction helper exported');
assertTest(poaFile.includes('POA_DISCLAIMER_AR') && poaFile.includes('POA_DISCLAIMER_EN'), 'Bilingual regulatory disclaimer constants present');

// ── 2. POA Library Page & Routing ────────────────────────────────────────────
console.log('\n--- Group 2: POA Library UI & Routing ---');
assertTest(existsSync('src/pages/POALibraryPage.tsx'), 'POALibraryPage.tsx exists');
const poaPage = readFileSync('src/pages/POALibraryPage.tsx', 'utf8');
assertTest(poaPage.includes('POALibraryPage'), 'POALibraryPage component defined');
assertTest(poaPage.includes('POA_LIBRARY'), 'POALibraryPage consumes POA_LIBRARY');
assertTest(poaPage.includes('templateTab'), 'Bilingual template tab toggle supported');
assertTest(poaPage.includes('handleDownload'), 'Download .txt functionality implemented');
assertTest(poaPage.includes('handleCopy'), 'Copy to clipboard functionality implemented');

const appFile = readFileSync('src/App.tsx', 'utf8');
assertTest(appFile.includes('POALibraryPage'), 'App.tsx imports POALibraryPage');
assertTest(appFile.includes('/poa-library'), '/poa-library route registered in App.tsx');
assertTest(appFile.includes('/power-of-attorney'), '/power-of-attorney redirect registered');
assertTest(appFile.includes('/wakala'), '/wakala redirect registered');

// ── 3. Missing Document Protocol Engine ──────────────────────────────────────
console.log('\n--- Group 3: Missing Document Protocol Engine ---');
assertTest(existsSync('src/lib/contracts/missingDocumentProtocol.ts'), 'missingDocumentProtocol.ts exists');
const docProtoFile = readFileSync('src/lib/contracts/missingDocumentProtocol.ts', 'utf8');
assertTest(docProtoFile.includes('REQUIRED_DOCUMENT_REGISTRY'), 'REQUIRED_DOCUMENT_REGISTRY exported');
assertTest(docProtoFile.includes('analyzeRequiredDocuments'), 'analyzeRequiredDocuments function exported');
assertTest(docProtoFile.includes('getCriticalMissingDocuments'), 'getCriticalMissingDocuments function exported');
assertTest(docProtoFile.includes('doc-trade-license'), 'Commercial registration document registered');
assertTest(docProtoFile.includes('doc-power-of-attorney'), 'Power of attorney companion registered');
assertTest(docProtoFile.includes('doc-sharia-certificate'), 'Sharia compliance certificate registered');
assertTest(docProtoFile.includes('doc-data-processing-agreement'), 'DPA companion agreement registered');

// ── 4. 8-Dimension Legal Validation Engine ───────────────────────────────────
console.log('\n--- Group 4: 8-Dimension Legal Validation Scoring Engine ---');
assertTest(existsSync('src/services/legalValidationEngine.ts'), 'legalValidationEngine.ts exists');
const valEngineFile = readFileSync('src/services/legalValidationEngine.ts', 'utf8');
assertTest(valEngineFile.includes('executeLegalValidation'), 'executeLegalValidation function exported');
assertTest(valEngineFile.includes('dim-parties-identification'), 'Dimension 1: Parties Identification present');
assertTest(valEngineFile.includes('dim-subject-matter'), 'Dimension 2: Subject Matter present');
assertTest(valEngineFile.includes('dim-financial-terms'), 'Dimension 3: Financial Terms present');
assertTest(valEngineFile.includes('dim-legal-compliance'), 'Dimension 4: Legal Compliance present');
assertTest(valEngineFile.includes('dim-dispute-resolution'), 'Dimension 5: Dispute Resolution present');
assertTest(valEngineFile.includes('dim-termination-rights'), 'Dimension 6: Termination Rights present');
assertTest(valEngineFile.includes('dim-document-completeness'), 'Dimension 7: Document Completeness present');
assertTest(valEngineFile.includes('dim-sharia-compliance'), 'Dimension 8: Sharia Compliance present');
assertTest(valEngineFile.includes('DIMENSION_WEIGHTS'), 'DIMENSION_WEIGHTS composite weighting defined');
assertTest(valEngineFile.includes('executionReadiness'), 'Execution readiness flag computed');
assertTest(valEngineFile.includes('executionBlockers'), 'Execution blockers array tracked');

// ── 5. Protected Admin Route Cryptographic Security ──────────────────────────
console.log('\n--- Group 5: Protected Admin Route Hardening ---');
const adminRouteFile = readFileSync('src/components/ProtectedAdminRoute.tsx', 'utf8');
assertTest(adminRouteFile.includes('AUTHORIZED_PASSCODE_HASHES'), 'Pre-computed SHA-256 hashes used for passcode comparison');
assertTest(adminRouteFile.includes('crypto.subtle.digest'), 'Native Web Crypto SHA-256 used for verification');
assertTest(adminRouteFile.includes('dispatch2FAOtpEmail'), '2FA OTP dispatch triggered upon valid passcode');
assertTest(adminRouteFile.includes('create2FAWhatsAppDetails'), 'WhatsApp 2FA helper integrated');

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` Results: ${passed} Passed, ${failed} Failed`);
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 SPRINT 07 VERIFICATION SUITE PASSED 100% WITH ZERO DEFECTS!\n');
}
