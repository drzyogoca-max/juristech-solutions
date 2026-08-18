/**
 * src/components/VercelSpeedInsights.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Official Telemetry Component for Vercel Speed Insights & Real User Performance Metrics
 */

import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export function SpeedInsightsWrapper() {
  return <SpeedInsights />;
}

export default SpeedInsightsWrapper;
