import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import './index.css';
import './styles/public-ux-overrides.css';
import { initVersionManager, CURRENT_APP_VERSION } from './lib/versionManager';

// Initialize version manager & cache purging for instant global updates
initVersionManager();

if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      if (!name.includes(CURRENT_APP_VERSION)) {
        caches.delete(name);
      }
    }
  });
}

import { LocaleProvider } from './context/LocaleContext';

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </BrowserRouter>
);
