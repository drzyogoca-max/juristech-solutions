import fs from 'fs';
import path from 'path';
import * as LucideIcons from 'lucide-react';

console.log('--- Checking all lucide-react imports across src ---');

const srcDir = './src';
const allFiles = [];

function getFiles(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) getFiles(p);
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) allFiles.push(p);
  }
}
getFiles(srcDir);

let missingIconsCount = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lucideRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
  let match;
  while ((match = lucideRegex.exec(content)) !== null) {
    const rawIcons = match[1].split(',');
    for (const raw of rawIcons) {
      const parts = raw.trim().split(/\s+as\s+/);
      const iconName = parts[0].trim();
      if (!iconName) continue;
      if (!(iconName in LucideIcons)) {
        console.error(`❌ MISSING ICON '${iconName}' imported in: ${filePath}`);
        missingIconsCount++;
      }
    }
  }
}

console.log(`--- Finished checking Lucide icons. Total missing: ${missingIconsCount} ---`);
