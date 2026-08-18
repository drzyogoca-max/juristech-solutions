import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const mappings = {
  'bg-slate-950': 'bg-slate-50 dark:bg-slate-950',
  'bg-slate-900': 'bg-white dark:bg-slate-900',
  'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
  'text-slate-100': 'text-slate-800 dark:text-slate-100',
  'text-slate-200': 'text-slate-800 dark:text-slate-200',
  'text-slate-300': 'text-slate-700 dark:text-slate-300',
  'text-slate-400': 'text-slate-600 dark:text-slate-400',
  'border-slate-800': 'border-slate-200 dark:border-slate-800',
  'border-slate-700': 'border-slate-300 dark:border-slate-700',
  'text-white': 'text-slate-900 dark:text-white',
  // Specific cases with opacity
  'bg-slate-950/50': 'bg-slate-50/50 dark:bg-slate-950/50',
  'bg-slate-950/80': 'bg-slate-50/80 dark:bg-slate-950/80',
  'bg-slate-900/80': 'bg-white/80 dark:bg-slate-900/80',
  'bg-slate-900/50': 'bg-white/50 dark:bg-slate-900/50',
  'border-slate-800/50': 'border-slate-200/50 dark:border-slate-800/50',
  'border-slate-800/60': 'border-slate-200/60 dark:border-slate-800/60',
  'border-slate-800/80': 'border-slate-200/80 dark:border-slate-800/80',
  'divide-slate-800/60': 'divide-slate-200/60 dark:divide-slate-800/60',
  'divide-slate-800/70': 'divide-slate-200/70 dark:divide-slate-800/70',
  'divide-slate-800/40': 'divide-slate-200/40 dark:divide-slate-800/40',
  'bg-slate-800/30': 'bg-slate-100/30 dark:bg-slate-800/30',
  'bg-slate-800/40': 'bg-slate-100/40 dark:bg-slate-800/40',
  'bg-slate-800/80': 'bg-slate-100/80 dark:bg-slate-800/80',
  'bg-slate-950/70': 'bg-slate-50/70 dark:bg-slate-950/70',
  'divide-slate-800': 'divide-slate-200 dark:divide-slate-800',
  'bg-slate-950/40': 'bg-slate-50/40 dark:bg-slate-950/40',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // We need to apply mappings to word boundaries to avoid replacing parts of a word,
      // but hyphenated classnames aren't standard words in JS regex (\b doesn't include hyphens).
      // We can use a regex that matches the exact class string followed by space, quote, backtick, or newline.
      for (const [darkClass, newClass] of Object.entries(mappings)) {
        // Skip if already processed
        if (content.includes(`dark:${darkClass}`)) continue;
        
        // Regex: negative lookbehind for dark: or light:, then the exact string, then lookahead for whitespace or quote
        const regex = new RegExp(`(?<!dark:|light:)(?<![\\w\\-])${darkClass.replaceAll('/', '\\\\/')}(?=[\\s"'\`\\}\\]\\,\\>])`, 'g');
        
        if (regex.test(content)) {
          content = content.replace(regex, newClass);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log('Theme patcher completed successfully.');
