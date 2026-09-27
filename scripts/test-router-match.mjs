import { matchPath } from 'react-router-dom';

const paths = [
  '/', '/dashboard', '/contracts', '/ar', '/ar/', '/ar/contracts',
  '/en', '/en/', '/en/dashboard', '/fr', '/de', '/company-formation',
  '/pricing', '/video-hub'
];

const LOCALES = ['', '/ar', '/en', '/fr', '/de', '/es', '/tr', '/zh'];
const baseRoutes = [
  '', '/dashboard', '/contracts', '/company-formation', '/pricing', '/video-hub'
];

console.log('--- Testing matchPath with explicit LOCALES list ---');
for (const p of paths) {
  let matched = false;
  for (const loc of LOCALES) {
    for (const r of baseRoutes) {
      // If root of locale
      const pat = `${loc}${r}` || '/';
      const match = matchPath(pat, p);
      if (match) {
        console.log(`✅ Path "${p}" MATCHED pattern "${pat}"`);
        matched = true;
        break;
      }
    }
    if (matched) break;
  }
  if (!matched) {
    console.log(`❌ Path "${p}" FAILED to match!`);
  }
}
