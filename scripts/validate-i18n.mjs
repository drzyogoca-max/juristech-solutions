/**
 * scripts/validate-i18n.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strict 7-Language Validation Suite
 * Specification: GLOBAL-I18N-P0 Section 37 & 40
 * 
 * Verifies:
 *   1. Exactly all 7 languages are present (en, ar, fr, es, de, tr, zh)
 *   2. Exactly all 23 namespaces exist for each language
 *   3. 100% key parity with zero missing or extra keys
 *   4. Zero empty translation strings ("")
 *   5. Valid JSON formatting across all catalogs
 *   6. Exit code 0 on complete pass, 1 on any failure
 */

import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(process.cwd(), 'src', 'locales');
const REQUIRED_LANGUAGES = ['en', 'ar', 'fr', 'es', 'de', 'tr', 'zh'];
const REQUIRED_NAMESPACES = [
  'common',
  'navigation',
  'home',
  'auth',
  'dashboard',
  'ai',
  'documents',
  'contracts',
  'compliance',
  'enterprise',
  'pricing',
  'billing',
  'subscription',
  'security',
  'documentation',
  'contact',
  'errors',
  'notifications',
  'legal',
  'forms',
  'validation',
  'admin',
  'accessibility',
];

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║   JurisTech Solutions — Strict i18n Validation Suite v1.0        ║');
console.log('║   Specification: GLOBAL-I18N-P0                                  ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

let totalKeysChecked = 0;
let totalMissingKeys = 0;
let totalExtraKeys = 0;
let totalEmptyValues = 0;
let totalSyntaxErrors = 0;
const errorsList = [];

// 1. Check Languages Presence
console.log('🔍 [1/4] Verifying 7 Official Languages directories...');
for (const lang of REQUIRED_LANGUAGES) {
  const langDir = path.join(LOCALES_DIR, lang);
  if (!fs.existsSync(langDir)) {
    errorsList.push(`Language directory missing: src/locales/${lang}`);
    console.error(`❌ Missing language directory: ${lang}`);
  } else {
    console.log(`  ✓ Language [${lang}] directory verified.`);
  }
}

// 2. Check 23 Namespaces Presence & Load JSON
console.log('\n🔍 [2/4] Verifying 23 Namespaces per language...');
const catalogs = {};

for (const lang of REQUIRED_LANGUAGES) {
  catalogs[lang] = {};
  for (const ns of REQUIRED_NAMESPACES) {
    const filePath = path.join(LOCALES_DIR, lang, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      errorsList.push(`Missing namespace file: ${lang}/${ns}.json`);
      console.error(`❌ Missing namespace: src/locales/${lang}/${ns}.json`);
      continue;
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      catalogs[lang][ns] = parsed;
    } catch (err) {
      totalSyntaxErrors++;
      errorsList.push(`JSON Syntax Error in ${lang}/${ns}.json: ${err.message}`);
      console.error(`❌ JSON Syntax Error in ${lang}/${ns}.json:`, err.message);
    }
  }
}

// 3. Deep Key Parity & Empty Value Audit
console.log('\n🔍 [3/4] Running Deep Key Parity & Non-Empty String Audit...');

function getFlattenedKeys(obj, prefix = '') {
  let keys = {};
  if (!obj || typeof obj !== 'object') return keys;

  for (const [k, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(keys, getFlattenedKeys(val, fullKey));
    } else {
      keys[fullKey] = val;
    }
  }
  return keys;
}

let totalUniqueEnKeys = 0;

for (const ns of REQUIRED_NAMESPACES) {
  const enData = catalogs['en']?.[ns];
  if (!enData) continue;

  const enFlattened = getFlattenedKeys(enData);
  const enKeyList = Object.keys(enFlattened);
  totalUniqueEnKeys += enKeyList.length;

  for (const lang of REQUIRED_LANGUAGES) {
    if (lang === 'en') {
      // Check for empty strings in EN
      for (const [k, val] of Object.entries(enFlattened)) {
        totalKeysChecked++;
        if (typeof val === 'string' && val.trim() === '') {
          totalEmptyValues++;
          errorsList.push(`Empty string in en/${ns}.json at key: ${k}`);
        }
      }
      continue;
    }

    const langData = catalogs[lang]?.[ns];
    if (!langData) continue;

    const langFlattened = getFlattenedKeys(langData);
    const langKeyList = Object.keys(langFlattened);

    // Check missing keys in target language compared to English
    for (const k of enKeyList) {
      totalKeysChecked++;
      if (!(k in langFlattened)) {
        totalMissingKeys++;
        errorsList.push(`Missing key [${k}] in ${lang}/${ns}.json`);
      } else {
        const val = langFlattened[k];
        if (typeof val === 'string' && val.trim() === '') {
          totalEmptyValues++;
          errorsList.push(`Empty string in ${lang}/${ns}.json at key: ${k}`);
        }
      }
    }

    // Check extra keys in target language not present in English
    for (const k of langKeyList) {
      if (!(k in enFlattened)) {
        totalExtraKeys++;
        errorsList.push(`Extra unknown key [${k}] in ${lang}/${ns}.json`);
      }
    }
  }
}

// 4. Output Summary Report
console.log('\n──────────────────────────────────────────────────────────────────');
console.log('                    📊 VALIDATION SUMMARY RESULTS                 ');
console.log('──────────────────────────────────────────────────────────────────');
console.log(`Languages Checked       : ${REQUIRED_LANGUAGES.length} / 7 (${REQUIRED_LANGUAGES.join(', ')})`);
console.log(`Namespaces Checked      : ${REQUIRED_NAMESPACES.length} / 23 per language (161 files total)`);
console.log(`Total Keys Audited      : ${totalKeysChecked}`);
console.log(`Unique Keys per Catalog : ${totalUniqueEnKeys}`);
console.log(`Missing Keys            : ${totalMissingKeys}`);
console.log(`Extra Keys              : ${totalExtraKeys}`);
console.log(`Empty Values            : ${totalEmptyValues}`);
console.log(`JSON Syntax Errors      : ${totalSyntaxErrors}`);
console.log('──────────────────────────────────────────────────────────────────\n');

if (errorsList.length === 0) {
  console.log('✅ ALL I18N VALIDATION CHECKS PASSED (100% PARITY, 0 MISSING KEYS).\n');
  process.exit(0);
} else {
  console.error(`❌ VALIDATION FAILED WITH ${errorsList.length} ISSUES:\n`);
  errorsList.slice(0, 20).forEach((err) => console.error(`  • ${err}`));
  if (errorsList.length > 20) {
    console.error(`  ... and ${errorsList.length - 20} more errors.`);
  }
  process.exit(1);
}
