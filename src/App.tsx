import { useEffect, useState, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import VercelAnalyticsWrapper from './components/VercelAnalyticsWrapper';
import SpeedInsightsWrapper from './components/VercelSpeedInsights';
import Navbar from './components/Navbar';
import StepWorkflowBanner from './components/StepWorkflowBanner';
import LegalDisclaimerBanner from './components/LegalDisclaimerBanner';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import { AuthProvider, useAuth } from './lib/authContext';
import { ContractProvider } from './context/ContractContext';
import { checkLibyaGeoBlock } from './lib/geoBlock';
import UpdateBanner from './components/UpdateBanner';
import GlobalForceUpdate from './components/GlobalForceUpdate';
import MasterAdminToolbar from './components/MasterAdminToolbar';
import GlobalTrafficGrowthBanner from './components/GlobalTrafficGrowthBanner';
import { logVisitorSession } from './lib/visitorTracker';
import { Loader2 } from 'lucide-react';
import { usePlatformLocale } from './lib/universalTranslator';

// ── Lazy Loaded Page Components for Minimal Initial Bundle Size & 95+ Performance ──
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

const ContractsPage = lazy(() => import('./pages/ContractsPage'));
const ContractsRepositoryPage = lazy(() => import('./pages/ContractsRepositoryPage'));
const RiskPage = lazy(() => import('./pages/RiskPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const NegotiationPage = lazy(() => import('./pages/NegotiationPage'));
const InvestigationPage = lazy(() => import('./pages/InvestigationPage'));
const LeadRadarPage = lazy(() => import('./pages/LeadRadarPage'));
const EnterpriseAuditPage = lazy(() => import('./pages/EnterpriseAuditPage'));
const B2BProposalPage = lazy(() => import('./pages/B2BProposalPage'));
const VideoHubPage = lazy(() => import('./pages/VideoHubPage'));
const SponsorsAdsPage = lazy(() => import('./pages/SponsorsAdsPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const SocialMarketingPage = lazy(() => import('./pages/SocialMarketingPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CompanyFormationPage = lazy(() => import('./pages/CompanyFormationPage'));
const AcquisitionPage = lazy(() => import('./pages/AcquisitionPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const BlockedPage = lazy(() => import('./pages/BlockedPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdvancedAIHubPage = lazy(() => import('./pages/AdvancedAIHubPage'));
const LegalCompliancePage = lazy(() => import('./pages/LegalCompliancePage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminFinancialDashboardPage = lazy(() => import('./pages/admin/AdminFinancialDashboardPage'));
const AntiFraudAuditorPage = lazy(() => import('./pages/admin/AntiFraudAuditorPage'));
const ReviewQueuePage = lazy(() => import('./pages/admin/ReviewQueuePage'));
const ReceiptVerificationPage = lazy(() => import('./pages/ReceiptVerificationPage'));
const AdminReceiptReviewPage = lazy(() => import('./pages/AdminReceiptReviewPage'));
const PlatformChecklistPage = lazy(() => import('./pages/admin/PlatformChecklistPage'));
const AdminMarketingCRMPage = lazy(() => import('./pages/admin/AdminMarketingCRMPage'));

// Lazy Loaded Auxiliary Components
const VisitorRadar = lazy(() => import('./components/VisitorRadar'));
const LeadCaptureModal = lazy(() => import('./components/LeadCaptureModal'));
const GdprPrivacyBanner = lazy(() => import('./components/GdprPrivacyBanner'));
const AdSponsorBanner = lazy(() => import('./components/AdSponsorBanner'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const AIChatbotConcierge = lazy(() => import('./components/AIChatbotConcierge'));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8 text-cyan-400">
      <Loader2 className="w-7 h-7 animate-spin opacity-80" />
    </div>
  );
}

function MainAppContent() {
  const [isBlocked, setIsBlocked] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();
  const { lang, isRtl } = usePlatformLocale();

  // Auxiliary Widgets Mounted Only Upon User Interaction or Idle Timeout (Sub-500ms FCP/LCP Guarantee)
  const [showAuxWidgets, setShowAuxWidgets] = useState(false);

  const [showLeadGate, setShowLeadGate] = useState(false);

  // Synchronize document dir and lang on every locale switch
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.body.dir = isRtl ? 'rtl' : 'ltr';
      document.body.lang = lang;
    }
  }, [lang, isRtl]);

  // ── Defer Auxiliary Floating Widgets (Chatbot, Radar) for High Speed Insights ──
  useEffect(() => {
    const timer = setTimeout(() => setShowAuxWidgets(true), 3000);

    const triggerMount = () => {
      setShowAuxWidgets(true);
      window.removeEventListener('mousemove', triggerMount);
      window.removeEventListener('touchstart', triggerMount);
      window.removeEventListener('scroll', triggerMount);
    };

    window.addEventListener('mousemove', triggerMount, { passive: true });
    window.addEventListener('touchstart', triggerMount, { passive: true });
    window.addEventListener('scroll', triggerMount, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', triggerMount);
      window.removeEventListener('touchstart', triggerMount);
      window.removeEventListener('scroll', triggerMount);
    };
  }, []);

  // ── 1. Deferred Background Engine Boot (Zero Main Thread Impact on Initial Paint) ──
  useEffect(() => {
    checkLibyaGeoBlock().then((blocked) => {
      if (blocked) setIsBlocked(true);
    });

    const runDeferredWorkers = async () => {
      try {
        const { initVersionManager } = await import('./lib/versionManager');
        const { enforceArchiveModeGuard } = await import('./lib/archiveModeGuard');
        const { runSovereignDataPurification } = await import('./lib/dataPurificationEngine');
        const { runDailyAIKnowledgeOptimizer } = await import('./lib/aiSelfLearningEngine');
        const { startStealthAgents } = await import('./services/stealth-agents');
        const { startRadarEngineAutomation } = await import('./services/radarEngine');
        const { startAutonomousRiskEngine } = await import('./services/autonomousRiskEngine');
        const { startSelfHealingRadarWorker } = await import('./lib/selfHealingEngine');
        const { startHourlyAdCampaignEngine } = await import('./services/hourlyAdCampaignEngine');
        const { ProactiveAlertsEngine } = await import('./lib/proactiveAlertsEngine');
        const { initGlobalScalingEngine } = await import('./lib/globalScalingEngine');
        const { runSWIFTWireCrossAudit } = await import('./services/wireTransferAuditor');
        const { scheduleDailyAudit } = await import('./services/dailyAuditReportEngine');
        const { autonomousCSuiteOutreachEngine } = await import('./services/autonomousCSuiteOutreachEngine');

        initVersionManager();
        enforceArchiveModeGuard();
        runSovereignDataPurification();
        runDailyAIKnowledgeOptimizer();

        startStealthAgents();
        startRadarEngineAutomation();
        startAutonomousRiskEngine();
        startSelfHealingRadarWorker();
        startHourlyAdCampaignEngine();
        ProactiveAlertsEngine.startWorker();

        initGlobalScalingEngine();
        runSWIFTWireCrossAudit();
        scheduleDailyAudit();
        autonomousCSuiteOutreachEngine.autoRunDailyBatch();
      } catch (e) {
        console.warn('[Performance Boot] Background engine deferred init:', e);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => setTimeout(runDeferredWorkers, 4000), { timeout: 6000 });
    } else {
      setTimeout(runDeferredWorkers, 4500);
    }
  }, []);

  // ── 2. Route Trackers & Google Analytics 4 (GA4) Page Views ───────────────
  useEffect(() => {
    const registered = localStorage.getItem('juristech_user_registered');
    const path = location.pathname;

    // GA4 Real-time SPA Route Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('config', 'G-311560459', {
          page_path: location.pathname + (location.search || ''),
          page_title: document.title,
        });
      } catch {}
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => logVisitorSession(location.pathname));
    } else {
      setTimeout(() => logVisitorSession(location.pathname), 100);
    }
  }, [isAdmin, location.pathname, location.search]);


  if (isBlocked) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <BlockedPage />
      </Suspense>
    );
  }

  const showWorkflowBanner = ['/contracts', '/risk', '/negotiation', '/enterprise-audit'].includes(location.pathname);

  return (
    <ErrorBoundary>
      <GlobalForceUpdate />
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={lang}
        className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between w-full max-w-full overflow-x-hidden transition-all"
      >
        <div className="w-full max-w-full overflow-x-hidden">
          <Navbar />


          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/contract-generator" element={<Navigate to="/contracts" replace />} />
              <Route path="/contract-builder" element={<Navigate to="/contracts" replace />} />
              <Route path="/repository" element={<ContractsRepositoryPage />} />
              <Route path="/contracts-library" element={<Navigate to="/repository" replace />} />
              <Route path="/contracts-repository" element={<Navigate to="/repository" replace />} />
              <Route path="/risk" element={<RiskPage />} />
              <Route path="/vault" element={<VaultPage />} />
              <Route path="/risk-analysis" element={<Navigate to="/risk" replace />} />
              <Route path="/shared-contract" element={<Navigate to="/risk" replace />} />
              <Route path="/investigate" element={<InvestigationPage />} />
              <Route path="/inspection-room" element={<Navigate to="/investigate" replace />} />
              <Route path="/investigation" element={<Navigate to="/investigate" replace />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/templates-library" element={<Navigate to="/templates" replace />} />
              <Route path="/negotiation" element={<NegotiationPage />} />
              <Route path="/negotiate" element={<Navigate to="/negotiation" replace />} />
              <Route path="/e-signature-room" element={<Navigate to="/negotiation" replace />} />
              <Route
                path="/lead-radar"
                element={
                  <ProtectedAdminRoute>
                    <LeadRadarPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="/enterprise-audit" element={<EnterpriseAuditPage />} />
              <Route path="/company-formation" element={<CompanyFormationPage />} />
              <Route path="/acquisition" element={<AcquisitionPage />} />
              <Route path="/corporate-takeover" element={<Navigate to="/acquisition" replace />} />
              <Route path="/b2b-proposals" element={<B2BProposalPage />} />
              <Route path="/video-hub" element={<VideoHubPage />} />
              <Route path="/sponsors-ads" element={<SponsorsAdsPage />} />
              <Route path="/monetization" element={<Navigate to="/sponsors-ads" replace />} />
              <Route path="/sponsors" element={<Navigate to="/sponsors-ads" replace />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/verify" element={<ReceiptVerificationPage />} />
              <Route path="/pricing" element={<Navigate to="/payment" replace />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/legal-compliance" element={<LegalCompliancePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/about-us" element={<Navigate to="/about" replace />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/terms-of-use" element={<Navigate to="/terms" replace />} />
              <Route path="/compliance" element={<Navigate to="/legal-compliance" replace />} />
              <Route path="/regulatory" element={<Navigate to="/legal-compliance" replace />} />
              <Route path="/regulatory-framework" element={<Navigate to="/legal-compliance" replace />} />
              <Route path="/marketing" element={<SocialMarketingPage />} />
              <Route
                path="/reports"
                element={
                  <ProtectedAdminRoute>
                    <ReportsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="/blocked" element={<BlockedPage />} />
              <Route path="/social-marketing" element={<Navigate to="/marketing" replace />} />
              <Route path="/sovereign-ai-hub" element={<AdvancedAIHubPage />} />
              
              {/* Strictly Protected Admin & Chairman Vault Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedAdminRoute>
                    <AdminAnalyticsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/marketing-crm"
                element={
                  <ProtectedAdminRoute>
                    <AdminMarketingCRMPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/receipt-review"
                element={
                  <ProtectedAdminRoute>
                    <AdminReceiptReviewPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/anti-fraud"
                element={
                  <ProtectedAdminRoute>
                    <AntiFraudAuditorPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/financial"
                element={
                  <ProtectedAdminRoute>
                    <AdminFinancialDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="/admin/billing" element={<Navigate to="/admin/financial" replace />} />
              <Route path="/admin/treasury" element={<Navigate to="/admin/financial" replace />} />
              <Route path="/admin/receipts" element={<Navigate to="/admin/receipt-review" replace />} />
              <Route path="/dashboard/finance" element={<Navigate to="/admin/financial" replace />} />
              <Route
                path="/admin/review-queue"
                element={
                  <ProtectedAdminRoute>
                    <ReviewQueuePage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/checklist"
                element={
                  <ProtectedAdminRoute>
                    <PlatformChecklistPage />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Suspense>

          <Suspense fallback={null}>
            <LeadCaptureModal />
          </Suspense>

          {showAuxWidgets && (
            <Suspense fallback={null}>
              <VisitorRadar />
              <AIChatbotConcierge />
              <GdprPrivacyBanner />
            </Suspense>
          )}

          <MobileBottomNav />
          <Footer />
          <VercelAnalyticsWrapper />
          <SpeedInsightsWrapper />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ContractProvider>
          <MainAppContent />
        </ContractProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
