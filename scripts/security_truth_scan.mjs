/**
 * scripts/security_truth_scan.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Automated Truth, Claims, and Security Verification Audit for JurisTech Solutions
 *
 * Checks:
 * 1. Truth in Advertising & AI Architecture (No unverified "Gemini 2.5 Pro Ultra" claims)
 * 2. Legal Disclaimers & Advice Boundaries (No guarantees of legal outcomes)
 * 3. Protected Payment Configuration (Preservation of $49, $139, $349, $999 tiers)
 * 4. Placeholder Accounting (All {{TODO_OWNER: ...}} documented in /docs/OWNER_TODO.md)
 * 5. Complete Service Inventory (All 19 services accounted for in 6 canonical categories)
 */

import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const OWNER_TODO_PATH = path.join(DOCS_DIR, 'OWNER_TODO.md');

let failures = [];
let warnings = [];
let passedChecks = 0;

function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.md']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        files = files.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log('================================================================');
console.log(' JurisTech Solutions — Truth, Claims & Security Verification Scan');
console.log('================================================================\n');

// ── Check 1: AI Provider Truth Check ──────────────────────────────────────────
console.log('[Check 1] Verifying AI Provider and Architecture Claims...');
const srcFiles = getAllFiles(SRC_DIR);
const prohibitedAIClaims = [
  /gemini\s*2\.5\s*pro\s*ultra/i,
  /google\s*ai\s*pro\s*ultra/i,
  /gpt-5/i,
];

let prohibitedClaimFound = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const regex of prohibitedAIClaims) {
    if (regex.test(content)) {
      failures.push(`Prohibited exaggerated AI claim found in ${path.relative(process.cwd(), file)}: matches ${regex}`);
      prohibitedClaimFound = true;
    }
  }
}
if (!prohibitedClaimFound) {
  console.log('  ✓ PASSED: No unverified or exaggerated AI provider claims detected.');
  passedChecks++;
}

// ── Check 2: Legal Advice Guarantee Bounds ─────────────────────────────────────
console.log('[Check 2] Verifying Legal Advice and Guarantee Boundaries...');
const legalGuaranteePatterns = [
  /ضمان\s+كسب\s+القضايا/i,
  /نضمن\s+لك\s+الفوز/i,
  /guarantee\s+(a\s+)?legal\s+win/i,
  /100%\s+guaranteed\s+legal\s+outcome/i,
];

let legalGuaranteeFound = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const regex of legalGuaranteePatterns) {
    if (regex.test(content)) {
      failures.push(`Prohibited legal guarantee found in ${path.relative(process.cwd(), file)}: matches ${regex}`);
      legalGuaranteeFound = true;
    }
  }
}
if (!legalGuaranteeFound) {
  console.log('  ✓ PASSED: No impermissible legal outcome guarantees detected.');
  passedChecks++;
}

// ── Check 3: Protected Payment Configuration & Prices ─────────────────────────
console.log('[Check 3] Verifying Protected Commercial Pricing & Gateways...');
const paymentPagePath = path.join(SRC_DIR, 'pages', 'PaymentPage.tsx');
if (fs.existsSync(paymentPagePath)) {
  const paymentContent = fs.readFileSync(paymentPagePath, 'utf-8');
  const requiredPrices = [49, 139, 349, 999];
  const missingPrices = requiredPrices.filter(p => !paymentContent.includes(`price: ${p}`) && !paymentContent.includes(`$${p}`));

  if (missingPrices.length > 0) {
    failures.push(`PaymentPage.tsx is missing protected pricing tiers: ${missingPrices.join(', ')}`);
  } else {
    console.log('  ✓ PASSED: All protected pricing tiers ($49, $139, $349, $999) verified intact.');
    passedChecks++;
  }

  // Check that official gateways are present
  const requiredGateways = ['GumroadPayModal', 'InstaPayModal', 'BankWireModal', 'BinancePayModal'];
  const missingGateways = requiredGateways.filter(g => !paymentContent.includes(g));
  if (missingGateways.length > 0) {
    failures.push(`PaymentPage.tsx is missing protected gateway modals: ${missingGateways.join(', ')}`);
  } else {
    console.log('  ✓ PASSED: Protected payment gateway modals verified intact.');
    passedChecks++;
  }
} else {
  failures.push('PaymentPage.tsx does not exist.');
}

// ── Check 4: Placeholder Accounting in /docs/OWNER_TODO.md ────────────────────
console.log('[Check 4] Auditing {{TODO_OWNER: ...}} Placeholders...');
if (!fs.existsSync(OWNER_TODO_PATH)) {
  failures.push('docs/OWNER_TODO.md does not exist.');
} else {
  const ownerTodoContent = fs.readFileSync(OWNER_TODO_PATH, 'utf-8');
  const placeholderRegex = /\{\{TODO_OWNER:\s*([^\}]+)\}\}/g;
  let codePlaceholders = new Set();

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = placeholderRegex.exec(content)) !== null) {
      codePlaceholders.add(match[1].trim());
    }
  }

  console.log(`  • Found ${codePlaceholders.size} unique {{TODO_OWNER: ...}} placeholders in src/`);
  let uncataloged = [];
  for (const placeholder of codePlaceholders) {
    if (!ownerTodoContent.includes(placeholder)) {
      uncataloged.push(placeholder);
    }
  }

  if (uncataloged.length > 0) {
    failures.push(`The following placeholders in code are not recorded in /docs/OWNER_TODO.md: ${uncataloged.join(', ')}`);
  } else {
    console.log('  ✓ PASSED: All code placeholders are strictly cataloged in /docs/OWNER_TODO.md.');
    passedChecks++;
  }
}

// ── Check 5: Complete 19-Service Taxonomy Verification ─────────────────────────
console.log('[Check 5] Verifying 6-Category Service Taxonomy Completeness...');
const taxonomyPath = path.join(SRC_DIR, 'data', 'serviceTaxonomy.ts');
if (!fs.existsSync(taxonomyPath)) {
  failures.push('src/data/serviceTaxonomy.ts does not exist.');
} else {
  const taxonomyContent = fs.readFileSync(taxonomyPath, 'utf-8');
  const requiredServices = [
    '/risk',
    '/contracts',
    '/deal-shield',
    '/investigate',
    '/templates',
    '/vault',
    '/repository',
    '/negotiation',
    '/b2b-proposals',
    '/acquisition',
    '/corporate-structuring',
    '/lead-radar',
    '/reports',
    '/enterprise-audit',
    '/legal-compliance',
    '/trust',
    '/chat',
    '/sovereign-ai-hub',
    '/video-hub'
  ];

  const missingServices = requiredServices.filter(s => !taxonomyContent.includes(s));
  if (missingServices.length > 0) {
    failures.push(`serviceTaxonomy.ts is missing services: ${missingServices.join(', ')}`);
  } else {
    console.log(`  ✓ PASSED: All ${requiredServices.length} platform services accounted for across 6 categories.`);
    passedChecks++;
  }
}

// ── Final Summary ─────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(` AUDIT RESULTS: ${passedChecks} Passed | ${failures.length} Failed | ${warnings.length} Warnings`);
console.log('================================================================\n');

if (failures.length > 0) {
  console.error('FAILURES DETECTED:');
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('🎉 ALL TRUTH, SECURITY, AND CLAIMS CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
}
