import React from 'react';

console.log('--- Testing component imports & exports ---');

async function testImports() {
  const componentsToTest = [
    { name: 'App', path: '../src/App' },
    { name: 'PlatformChecklistPage', path: '../src/pages/admin/PlatformChecklistPage' },
    { name: 'ProtectedAdminRoute', path: '../src/components/ProtectedAdminRoute' },
    { name: 'AdminNavSubbar', path: '../src/components/AdminNavSubbar' },
    { name: 'Dashboard', path: '../src/pages/Dashboard' },
    { name: 'Footer', path: '../src/components/Footer' },
    { name: 'Navbar', path: '../src/components/Navbar' },
    { name: 'YouTubeStudioPage', path: '../src/pages/YouTubeStudioPage' },
    { name: 'VercelAnalyticsWrapper', path: '../src/components/VercelAnalyticsWrapper' },
    { name: 'VercelSpeedInsights', path: '../src/components/VercelSpeedInsights' },
  ];

  for (const comp of componentsToTest) {
    try {
      const mod = await import(comp.path);
      const Component = mod.default || mod[comp.name];
      if (!Component) {
        console.error(`❌ FAILED: ${comp.name} has no valid component export! Got:`, Object.keys(mod));
      } else if (typeof Component !== 'function') {
        console.error(`❌ INVALID TYPE: ${comp.name} export is typeof ${typeof Component} (Expected function)!`);
      } else {
        console.log(`✅ PASS: ${comp.name} is a valid function component.`);
      }
    } catch (err: any) {
      console.error(`💥 ERROR importing ${comp.name}:`, err.message);
    }
  }
}

testImports().then(() => console.log('--- Done testing component integrity ---'));
