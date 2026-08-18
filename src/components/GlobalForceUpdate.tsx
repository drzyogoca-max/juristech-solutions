import { useEffect } from 'react';

const DEPLOYMENT_VERSION = 'juristech-sec-v2026-08';

export default function GlobalForceUpdate() {
  useEffect(() => {
    const currentVersion = localStorage.getItem('app_secure_version');
    if (currentVersion !== DEPLOYMENT_VERSION) {
      localStorage.setItem('app_secure_version', DEPLOYMENT_VERSION);
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      window.location.reload();
    }
  }, []);

  return null;
}
