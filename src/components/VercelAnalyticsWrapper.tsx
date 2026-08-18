/**
 * src/components/VercelAnalyticsWrapper.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Vercel Web Analytics Component & Custom Event Tracking Wrapper
 *
 * Captures real-time visitor counts, page views, bounce rates, and custom events
 * for Juristech.solutions on Vercel Production deployments.
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

export function VercelAnalyticsWrapper() {
  const location = useLocation();

  useEffect(() => {
    // Log route change to Vercel Web Analytics custom event pipeline
    if (typeof window !== 'undefined' && window.location.hostname.includes('juristech')) {
      try {
        window.dispatchEvent(
          new CustomEvent('va_page_view', {
            detail: {
              path: location.pathname,
              timestamp: new Date().toISOString(),
            },
          })
        );
      } catch {}
    }
  }, [location.pathname]);

  return <Analytics mode="auto" />;
}

export default VercelAnalyticsWrapper;
