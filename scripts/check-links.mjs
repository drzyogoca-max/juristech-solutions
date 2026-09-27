import fs from 'fs';
import path from 'path';

const routeDefs = new Set([
  '/', '/dashboard', '/ai-advisor', '/chat', '/contracts', '/contract-generator',
  '/contract-builder', '/repository', '/contracts-library', '/contracts-repository',
  '/risk', '/vault', '/risk-analysis', '/shared-contract', '/investigate',
  '/inspection-room', '/investigation', '/templates', '/templates-library',
  '/poa-library', '/power-of-attorney', '/wakala', '/negotiation', '/negotiate',
  '/e-signature-room', '/lead-radar', '/enterprise-audit', '/deal-shield',
  '/need-diagnostic', '/deal-simulator', '/clash-simulator', '/youtube-studio',
  '/youtube', '/youtube-channel', '/corporate-structuring', '/company-formation',
  '/acquisition', '/corporate-takeover', '/b2b-proposals', '/trust', '/video-hub',
  '/sponsors-ads', '/monetization', '/sponsors', '/payment', '/payment/verify',
  '/billing', '/pricing', '/support', '/legal-compliance', '/about', '/about-us',
  '/privacy', '/privacy-policy', '/terms', '/terms-of-use', '/refund', '/refunds',
  '/refund-policy', '/compliance', '/regulatory', '/regulatory-framework',
  '/marketing', '/reports', '/blocked', '/social-marketing', '/sovereign-ai-hub',
  '/admin', '/admin/analytics', '/admin/ai-analytics', '/admin/customer-success',
  '/admin/enterprise-governance', '/admin/ecosystem', '/admin/legal-ops',
  '/admin/command-center', '/admin/regulatory-radar', '/admin/cloud-console',
  '/admin/singularity-hub', '/admin/federation-hub', '/admin/planetary-hub',
  '/admin/operations-center', '/admin/trust-hub', '/admin/scale-readiness',
  '/admin/lifecycle-hub', '/admin/strategic-operations', '/admin/enterprise-adoption',
  '/admin/enterprise-operations', '/admin/commercial-intelligence',
  '/admin/partner-ecosystem', '/admin/global-intelligence', '/admin/institutional-os',
  '/admin/global-ecosystem', '/admin/operational-maturity',
  '/admin/institutional-scale', '/admin/global-intelligence-network',
  '/admin/institutional-marketplace', '/admin/planetary-sovereign',
  '/admin/institutional-reality', '/admin/planetary-consortium',
  '/admin/market-activation', '/admin/production-hardening', '/admin/marketing-crm',
  '/admin/receipt-review', '/admin/anti-fraud', '/admin/financial',
  '/admin/billing', '/admin/treasury', '/admin/receipts', '/dashboard/finance',
  '/admin/review-queue', '/admin/checklist'
]);

function scanDir(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        scanDir(full, results);
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/(?:to=['"]|navigate\(['"]|href=['"])(\/[a-zA-Z0-9\-_/]+)['"]/g);
      for (const m of matches) {
        const link = m[1];
        if (!link.startsWith('/api') && !link.startsWith('/#') && !link.startsWith('/assets') && !link.startsWith('/icons') && !link.startsWith('/locales')) {
          results.push({ file: path.relative(process.cwd(), full), link });
        }
      }
    }
  }
  return results;
}

const allLinks = scanDir('./src');
const missing = [];
for (const item of allLinks) {
  const norm = item.link.length > 1 && item.link.endsWith('/') ? item.link.slice(0, -1) : item.link;
  const withoutLang = norm.replace(/^\/(?:ar|en|fr|es|de|tr|zh)(?=\/|$)/, '') || '/';
  if (!routeDefs.has(norm) && !routeDefs.has(withoutLang)) {
    missing.push(item);
  }
}

console.log('Total internal links found:', allLinks.length);
console.log('Unrecognized routes count:', missing.length);
if (missing.length > 0) {
  const uniqueMissing = [...new Set(missing.map(m => m.link))];
  console.log('Unique missing links:');
  uniqueMissing.forEach(u => console.log('  ' + u));
  console.log('\nOccurrences:');
  missing.forEach(m => console.log(`  ${m.link} in ${m.file}`));
}
