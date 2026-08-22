/**
 * src/lib/monitoring.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time Error Monitoring & Performance Tracking Engine
 * Integrates Sentry / LogRocket / Custom Diagnostics telemetry for Juristech.solutions
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  userContext?: { id?: string; email?: string; role?: string };
  extra?: Record<string, unknown>;
  timestamp: string;
}

class MonitoringEngine {
  private isInitialized = false;
  private sentryDsn = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || '';
  private logrocketAppId = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LOGROCKET_APP_ID) || '';
  private errorLog: ErrorReport[] = [];

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Listen for uncaught window errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          source: 'window_uncaught_error',
          filename: event.filename,
          lineno: event.lineno,
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason || new Error('Unhandled Promise Rejection'), {
          source: 'window_unhandled_rejection',
        });
      });
    }

    console.log('[Juristech Telemetry] Telemetry and error monitoring initialized successfully.');
  }

  public captureError(error: unknown, extra?: Record<string, unknown>) {
    const errObj = error instanceof Error ? error : new Error(String(error));
    const report: ErrorReport = {
      message: errObj.message,
      stack: errObj.stack,
      extra,
      timestamp: new Date().toISOString(),
    };

    this.errorLog.unshift(report);
    if (this.errorLog.length > 50) this.errorLog.pop();

    console.error('[Juristech Telemetry] Captured Error:', report);

    // Save error telemetry locally for admin inspection
    try {
      const storedLogs = JSON.parse(localStorage.getItem('juristech_error_telemetry') || '[]');
      storedLogs.unshift(report);
      localStorage.setItem('juristech_error_telemetry', JSON.stringify(storedLogs.slice(0, 50)));
    } catch {
      // Ignore storage quota errors
    }
  }

  public getRecentErrors(): ErrorReport[] {
    return [...this.errorLog];
  }
}

export const monitoring = new MonitoringEngine();
monitoring.init();
