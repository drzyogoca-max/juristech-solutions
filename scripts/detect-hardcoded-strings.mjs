/**
 * scripts/detect-hardcoded-strings.mjs
 * Scans src/pages and src/components for:
 * 1. Raw Arabic text in JSX (not wrapped in l(), t(), loc(), etc.)
 * 2. Inactive / Decorative interactive elements (onClick={() => {}}, href="#")
 * 3. Potentially unlocalized customer-facing strings
 */

import fs from 'fs';
import path from 'path';

const SRC_PAGES = path.join(process.cwd(), 'src', 'pages');
const SRC_COMPONENTS = path.join(process.cwd(), 'src', 'components');

const arabicRegex = /[\u0600-\u06FF]/;
// Matches raw JSX text nodes like: <span>نص عربي</span> or >نص عربي<
const rawArabicJsxTextRegex = />([^<>{}]*[\u0600-\u06FF][^<>{}]*)</g;
// Matches raw attribute strings like: placeholder="نص عربي" or title="نص عربي"
const rawArabicAttrRegex = /(placeholder|title|aria-label|alt)=["']([^"']*[\u0600-\u06FF][^"']*)["']/g;

function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full, fileList);
    } else if (f.endsWith('.tsx') || f.endsWith('.jsx')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const allFiles = [...scanDir(SRC_PAGES), ...scanDir(SRC_COMPONENTS)];

console.log(`Auditing ${allFiles.length} JSX/TSX files for raw unlocalized strings and fake interactive elements...\n`);

const rawTextFindings = [];
const rawAttrFindings = [];
const fakeButtons = [];

for (const file of allFiles) {
  const rel = path.relative(process.cwd(), file);
  const code = fs.readFileSync(file, 'utf8');
  const lines = code.split('\n');

  // Check line by line
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Skip comments and import lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ')) {
      return;
    }

    // Check for fake/decorative buttons or links
    if (trimmed.includes('onClick={() => {}}') || trimmed.includes('onClick={() => { }}') || trimmed.includes('href="#"')) {
      fakeButtons.push({ file: rel, line: lineNum, content: trimmed });
    }

    // Check raw JSX text nodes containing Arabic outside of curly braces
    let match;
    const lineWithoutExpressions = line.replace(/\{[^}]*\}/g, ''); // strip { ... }
    
    // Check if there is Arabic in the remaining line
    if (arabicRegex.test(lineWithoutExpressions)) {
      // Check if it's inside raw tag content: > ... <
      const textMatches = lineWithoutExpressions.match(rawArabicJsxTextRegex);
      if (textMatches) {
        textMatches.forEach(m => {
          const inner = m.slice(1, -1).trim();
          if (inner && !inner.startsWith('//') && !inner.startsWith('{')) {
            rawTextFindings.push({ file: rel, line: lineNum, text: inner });
          }
        });
      }

      // Check if it's in raw attributes
      let attrMatch;
      while ((attrMatch = rawArabicAttrRegex.exec(lineWithoutExpressions)) !== null) {
        rawAttrFindings.push({ file: rel, line: lineNum, attr: attrMatch[1], text: attrMatch[2] });
      }
    }
  });
}

console.log(`\n──────────────────────────────────────────────────────────────────`);
console.log(`🚩 FINDINGS REPORT`);
console.log(`──────────────────────────────────────────────────────────────────`);
console.log(`1. Inactive / Decorative Controls (onClick={() => {}} or href="#"): ${fakeButtons.length}`);
fakeButtons.slice(0, 15).forEach(b => console.log(`   - [${b.file}:${b.line}] ${b.content}`));
if (fakeButtons.length > 15) console.log(`   ... and ${fakeButtons.length - 15} more`);

console.log(`\n2. Raw Unwrapped Arabic JSX Text Nodes: ${rawTextFindings.length}`);
rawTextFindings.slice(0, 20).forEach(t => console.log(`   - [${t.file}:${t.line}] "${t.text.slice(0, 60)}"`));
if (rawTextFindings.length > 20) console.log(`   ... and ${rawTextFindings.length - 20} more`);

console.log(`\n3. Raw Unwrapped Arabic Attributes: ${rawAttrFindings.length}`);
rawAttrFindings.slice(0, 15).forEach(a => console.log(`   - [${a.file}:${a.line}] ${a.attr}="${a.text.slice(0, 50)}"`));
if (rawAttrFindings.length > 15) console.log(`   ... and ${rawAttrFindings.length - 15} more`);
console.log(`──────────────────────────────────────────────────────────────────\n`);
