import fs from 'fs';
import path from 'path';

console.log('--- Scanning all files for possible React Error #130 triggers ---');

// Search for any JSX syntax where component is a variable or object property
const srcDir = './src';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.jsx')) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');

  // Check 1: Dynamic icon or component rendering like <item.icon /> or <cat.icon />
  // where icon might be an object instead of a valid component
  const dynamicComponentMatches = code.match(/<([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)/g);
  if (dynamicComponentMatches) {
    // console.log(filePath, 'Dynamic property components:', dynamicComponentMatches);
  }

  // Check 2: Check if any Lucide icon imported is invalid
  const lucideImports = code.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
  if (lucideImports) {
    const iconNames = lucideImports[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    // We can verify these later
  }

  // Check 3: Check React.lazy imports without default
  const lazyMatches = [...code.matchAll(/lazy\(\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\s*\)/g)];
  for (const m of lazyMatches) {
    const target = m[1];
    let resolved = path.resolve(path.dirname(filePath), target);
    if (!resolved.endsWith('.tsx') && !resolved.endsWith('.ts')) {
      if (fs.existsSync(resolved + '.tsx')) resolved += '.tsx';
      else if (fs.existsSync(resolved + '.ts')) resolved += '.ts';
      else if (fs.existsSync(resolved + '/index.tsx')) resolved += '/index.tsx';
    }
    if (fs.existsSync(resolved)) {
      const targetContent = fs.readFileSync(resolved, 'utf8');
      if (!targetContent.includes('export default')) {
        console.error(`❌ LAZY ERROR in ${filePath}: ${target} has NO default export!`);
      }
    } else {
      console.error(`❌ LAZY TARGET MISSING in ${filePath}: ${target}`);
    }
  }
}

scanDir(srcDir);
console.log('--- Scan completed ---');
