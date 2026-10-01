import fs from 'fs';

const content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Find all capitalized JSX tags
const tags = [...new Set([...content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g)].map(m => m[1]))];
console.log('Capitalized tags in Dashboard.tsx:', tags);

// Now check if each tag is defined in Dashboard.tsx
for (const tag of tags) {
  // Check if it's imported or defined
  const importRegex = new RegExp(`(import|const|function|class)\\s+.*\\b${tag}\\b`);
  const isDeclared = importRegex.test(content);
  console.log(`Tag: ${tag} -> Declared? ${isDeclared}`);
}
