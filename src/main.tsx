import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import './index.css';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
