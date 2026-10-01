import fs from 'fs';

const appContent = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /lazy\(\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/g;
let match;
const imports = [];
while ((match = regex.exec(appContent)) !== null) {
  imports.push(match[1]);
}
console.log('Total lazy imports found:', imports.length);

for (const imp of imports) {
  let file = imp.startsWith('.') ? 'src/' + imp.replace(/^\.\//, '') : imp;
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) {
    if (fs.existsSync(file + '.tsx')) file += '.tsx';
    else if (fs.existsSync(file + '.ts')) file += '.ts';
    else if (fs.existsSync(file + '/index.tsx')) file += '/index.tsx';
  }
  if (!fs.existsSync(file)) {
    console.error('FILE DOES NOT EXIST:', imp, '->', file);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const hasDefaultExport = /export\s+default\s+/.test(content);
  if (!hasDefaultExport) {
    console.error('❌ NO DEFAULT EXPORT IN:', imp, '(', file, ')');
  }
}
console.log('Check finished.');
