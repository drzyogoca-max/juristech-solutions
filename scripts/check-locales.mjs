import fs from 'fs';
import path from 'path';

const messagesDir = './messages';
const languages = ['en', 'ar', 'fr', 'de', 'es', 'zh', 'tr'];

const localesData = {};
for (const lang of languages) {
  const filePath = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    localesData[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    console.error(`Missing file for ${lang}`);
  }
}

const enKeys = Object.keys(localesData['en']?.translation || {});
console.log('En translation root keys:', enKeys);

for (const lang of languages) {
  const keys = Object.keys(localesData[lang]?.translation || {});
  console.log(`Lang ${lang}: ${keys.length} namespaces`);
}
