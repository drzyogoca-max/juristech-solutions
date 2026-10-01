import fs from 'fs';
import path from 'path';

console.log('--- Analyzing JSX element imports across the entire src directory ---');

const srcDir = './src';
const allFiles = [];

function getFiles(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) getFiles(p);
    else if (p.endsWith('.tsx') || p.endsWith('.jsx')) allFiles.push(p);
  }
}
getFiles(srcDir);

let issuesFound = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Find all default imports: import Identifier from '...'
  const defaultImportRegex = /import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = defaultImportRegex.exec(content)) !== null) {
    const importName = match[1];
    const importPath = match[2];

    // Only check local imports starting with .
    if (importPath.startsWith('.')) {
      let resolved = path.resolve(path.dirname(filePath), importPath);
      if (!resolved.endsWith('.tsx') && !resolved.endsWith('.ts')) {
        if (fs.existsSync(resolved + '.tsx')) resolved += '.tsx';
        else if (fs.existsSync(resolved + '.ts')) resolved += '.ts';
        else if (fs.existsSync(resolved + '/index.tsx')) resolved += '/index.tsx';
        else if (fs.existsSync(resolved + '/index.ts')) resolved += '/index.ts';
      }

      if (fs.existsSync(resolved)) {
        const targetContent = fs.readFileSync(resolved, 'utf8');
        // Check if target file actually has a default export!
        const hasDefault = /export\s+default\s+/.test(targetContent);
        if (!hasDefault) {
          // Check if importName is used as a JSX element <ImportName
          const isUsedAsJsx = new RegExp(`<${importName}[\\s>/]`).test(content);
          if (isUsedAsJsx) {
            console.error(`🚨 CRITICAL IMPORT MISMATCH in ${filePath}:`);
            console.error(`   '${importName}' is imported as DEFAULT from '${importPath}' (${resolved})`);
            console.error(`   BUT '${resolved}' DOES NOT HAVE 'export default'!`);
            console.error(`   And it IS USED as a JSX element <${importName} />!`);
            issuesFound++;
          }
        }
      }
    }
  }
}

console.log(`--- Finished. Total critical issues found: ${issuesFound} ---`);
