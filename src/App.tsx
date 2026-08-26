import React, { useEffect, useState, lazy, Suspense, Fragment } from 'react';
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
import { getLocaleFromUrl, setDocumentLanguage, persistLocalePreference, normalizeLanguageCode } from './i18n';

// ── Lazy Loaded Page Components for Minimal Initial Bundle Size & 95+ Performance ──
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AIAdvisorPage = lazy(() => import('./pages/AIAdvisorPage'));
const AdminAIAnalyticsPage = lazy(() => import('./pages/AdminAIAnalyticsPage'));
const CustomerSuccessPage = lazy(() => import('./pages/CustomerSuccessPage'));
const EnterpriseGovernancePage = lazy(() => import('./pages/EnterpriseGovernancePage'));
const EnterpriseEcosystemPage = lazy(() => import('./pages/EnterpriseEcosystemPage'));
const LegalOperationsCenterPage = lazy(() => import('./pages/LegalOperationsCenterPage'));
const EnterpriseCommandCenterPage = lazy(() => import('./pages/EnterpriseCommandCenterPage'));
const RegulatoryRadarPage = lazy(() => import('./pages/RegulatoryRadarPage'));
const SovereignCloudConsolePage = lazy(() => import('./pages/SovereignCloudConsolePage'));
const SingularityHubPage = lazy(() => import('./pages/SingularityHubPage'));
const SovereignFederationHubPage = lazy(() => import('./pages/SovereignFederationHubPage'));
const PlanetaryHubPage = lazy(() => import('./pages/PlanetaryHubPage'));
const OperationsCenterPage = lazy(() => import('./pages/OperationsCenterPage'));
const TrustPortalPage = lazy(() => import('./pages/TrustPortalPage'));
const EnterpriseTrustHubPage = lazy(() => import('./pages/EnterpriseTrustHubPage'));
const ScaleReadinessCommandCenterPage = lazy(() => import('./pages/ScaleReadinessCommandCenterPage'));
const EnterpriseLifecycleHubPage = lazy(() => import('./pages/EnterpriseLifecycleHubPage'));
const StrategicOperationsCommandCenterPage = lazy(() => import('./pages/StrategicOperationsCommandCenterPage'));
const EnterpriseAdoptionCommandCenterPage = lazy(() => import('./pages/EnterpriseAdoptionCommandCenterPage'));
const EnterpriseOperationsCommandCenterPage = lazy(() => import('./pages/EnterpriseOperationsCommandCenterPage'));
const CommercialIntelligenceCommandCenterPage = lazy(() => import('./pages/CommercialIntelligenceCommandCenterPage'));
const PartnerEcosystemCommandCenterPage = lazy(() => import('./pages/PartnerEcosystemCommandCenterPage'));
const GlobalIntelligenceCommandCenterPage = lazy(() => import('./pages/GlobalIntelligenceCommandCenterPage'));
const InstitutionalOSCommandCenterPage = lazy(() => import('./pages/InstitutionalOSCommandCenterPage'));
const GlobalEcosystemCommandCenterPage = lazy(() => import('./pages/GlobalEcosystemCommandCenterPage'));
const OperationalMaturityCommandCenterPage = lazy(() => import('./pages/OperationalMaturityCommandCenterPage'));
const InstitutionalScaleCommandCenterPage = lazy(() => import('./pages/InstitutionalScaleCommandCenterPage'));
const GlobalIntelligenceNetworkCommandCenterPage = lazy(() => import('./pages/GlobalIntelligenceNetworkCommandCenterPage'));
const InstitutionalMarketplaceCommandCenterPage = lazy(() => import('./pages/InstitutionalMarketplaceCommandCenterPage'));
const PlanetarySovereignCommandCenterPage = lazy(() => import('./pages/PlanetarySovereignCommandCenterPage'));

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
const DealShieldPage = lazy(() => import('./pages/DealShieldPage'));
const YouTubeStudioPage = lazy(() => import('./pages/YouTubeStudioPage').then(m => ({ default: m.YouTubeStudioPage })));
const CompanyFormationPage = lazy(() => import('./pages/CompanyFormationPage'));
const AcquisitionPage = lazy(() => import('./pages/AcquisitionPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const BlockedPage = lazy(() => import('./pages/BlockedPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdvancedAIHubPage = lazy(() => import('./pages/AdvancedAIHubPage'));
const LegalCompliancePage = lazy(() => import('./pages/LegalCompliancePage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminFinancialDashboardPage = lazy(() => import('./pages/admin/AdminFinancialDashboardPage'));
const AntiFraudAuditorPage = lazy(() => import('./pages/admin/AntiFraudAuditorPage'));
const ReviewQueuePage = lazy(() => import('./pages/admin/ReviewQueuePage'));
const ReceiptVerificationPage = lazy(() => import('./pages/ReceiptVerificationPage'));
const AdminReceiptReviewPage = lazy(() => import('./pages/AdminReceiptReviewPage'));
const PlatformChecklistPage = lazy(() => import('./pages/admin/PlatformChecklistPage'));
const AdminMarketingCRMPage = lazy(() => import('./pages/admin/AdminMarketingCRMPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy Loaded Auxiliary Components
const VisitorRadar = lazy(() => import('./components/VisitorRadar'));
const LeadCaptureModal = lazy(() => import('./components/LeadCaptureModal'));
const GdprPrivacyBanner = lazy(() => import('./components/GdprPrivacyBanner'));
const AdSponsorBanner = lazy(() => import('./components/AdSponsorBanner'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const AIChatbotConcierge = lazy(() => import('./components/AIChatbotConcierge'));
const YouTubeGrowthWidget = lazy(() => import('./components/YouTubeGrowthWidget'));

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

  // Synchronize URL locale with i18n instance on route transitions
  useEffect(() => {
    const urlLocale = getLocaleFromUrl(location.pathname);
    if (urlLocale && urlLocale !== lang) {
      setDocumentLanguage(urlLocale);
      persistLocalePreference(urlLocale);
    }
  }, [location.pathname, lang]);

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

        const { masterExecutiveAutopilot } = await import('./services/masterExecutiveAutopilot');
        const { executiveMonitorEngine } = await import('./services/executiveMonitorEngine');

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
        masterExecutiveAutopilot.startAutopilot();
        executiveMonitorEngine.startDailyMonitoring();
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
              {/* Common Single-Source-of-Truth Route Definitions */}
              {[ '', '/:locale' ].map((prefix) => (
                <Fragment key={prefix || 'root'}>
                  <Route path={`${prefix}/`} element={<Navigate to={`${prefix ? prefix + '/dashboard' : '/dashboard'}`} replace />} />
                  <Route path={`${prefix}/dashboard`} element={<Dashboard />} />
                  <Route path={`${prefix}/ai-advisor`} element={<AIAdvisorPage />} />
                  <Route path={`${prefix}/chat`} element={<AIAdvisorPage />} />
                  <Route path={`${prefix}/contracts`} element={<ContractsPage />} />
                  <Route path={`${prefix}/contract-generator`} element={<Navigate to={`${prefix}/contracts`} replace />} />
                  <Route path={`${prefix}/contract-builder`} element={<Navigate to={`${prefix}/contracts`} replace />} />
                  <Route path={`${prefix}/repository`} element={<ContractsRepositoryPage />} />
                  <Route path={`${prefix}/contracts-library`} element={<Navigate to={`${prefix}/repository`} replace />} />
                  <Route path={`${prefix}/contracts-repository`} element={<Navigate to={`${prefix}/repository`} replace />} />
                  <Route path={`${prefix}/risk`} element={<RiskPage />} />
                  <Route path={`${prefix}/vault`} element={<VaultPage />} />
                  <Route path={`${prefix}/risk-analysis`} element={<Navigate to={`${prefix}/risk`} replace />} />
                  <Route path={`${prefix}/shared-contract`} element={<Navigate to={`${prefix}/risk`} replace />} />
                  <Route path={`${prefix}/investigate`} element={<InvestigationPage />} />
                  <Route path={`${prefix}/inspection-room`} element={<Navigate to={`${prefix}/investigate`} replace />} />
                  <Route path={`${prefix}/investigation`} element={<Navigate to={`${prefix}/investigate`} replace />} />
                  <Route path={`${prefix}/templates`} element={<TemplatesPage />} />
                  <Route path={`${prefix}/templates-library`} element={<Navigate to={`${prefix}/templates`} replace />} />
                  <Route path={`${prefix}/negotiation`} element={<NegotiationPage />} />
                  <Route path={`${prefix}/negotiate`} element={<Navigate to={`${prefix}/negotiation`} replace />} />
                  <Route path={`${prefix}/e-signature-room`} element={<Navigate to={`${prefix}/negotiation`} replace />} />
                  <Route
                    path={`${prefix}/lead-radar`}
                    element={
                      <ProtectedAdminRoute>
                        <LeadRadarPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path={`${prefix}/enterprise-audit`} element={<EnterpriseAuditPage />} />
                  <Route path={`${prefix}/deal-shield`} element={<DealShieldPage />} />
                  <Route path={`${prefix}/need-diagnostic`} element={<Navigate to={`${prefix}/deal-shield`} replace />} />
                  <Route path={`${prefix}/deal-simulator`} element={<Navigate to={`${prefix}/deal-shield`} replace />} />
                  <Route path={`${prefix}/clash-simulator`} element={<Navigate to={`${prefix}/deal-shield`} replace />} />
                  <Route path={`${prefix}/youtube-studio`} element={<YouTubeStudioPage />} />
                  <Route path={`${prefix}/youtube`} element={<Navigate to={`${prefix}/youtube-studio`} replace />} />
                  <Route path={`${prefix}/youtube-channel`} element={<Navigate to={`${prefix}/youtube-studio`} replace />} />
                  <Route path={`${prefix}/company-formation`} element={<CompanyFormationPage />} />
                  <Route path={`${prefix}/acquisition`} element={<AcquisitionPage />} />
                  <Route path={`${prefix}/corporate-takeover`} element={<Navigate to={`${prefix}/acquisition`} replace />} />
                  <Route path={`${prefix}/b2b-proposals`} element={<B2BProposalPage />} />
                  <Route path={`${prefix}/trust`} element={<TrustPortalPage />} />
                  <Route path={`${prefix}/video-hub`} element={<VideoHubPage />} />
                  <Route path={`${prefix}/sponsors-ads`} element={<SponsorsAdsPage />} />
                  <Route path={`${prefix}/monetization`} element={<Navigate to={`${prefix}/sponsors-ads`} replace />} />
                  <Route path={`${prefix}/sponsors`} element={<Navigate to={`${prefix}/sponsors-ads`} replace />} />
                  <Route path={`${prefix}/payment`} element={<PaymentPage />} />
                  <Route path={`${prefix}/payment/verify`} element={<ReceiptVerificationPage />} />
                  <Route path={`${prefix}/billing`} element={<BillingPage />} />
                  <Route path={`${prefix}/pricing`} element={<Navigate to={`${prefix}/payment`} replace />} />
                  <Route path={`${prefix}/support`} element={<SupportPage />} />
                  <Route path={`${prefix}/legal-compliance`} element={<LegalCompliancePage />} />
                  <Route path={`${prefix}/about`} element={<AboutUsPage />} />
                  <Route path={`${prefix}/about-us`} element={<Navigate to={`${prefix}/about`} replace />} />
                  <Route path={`${prefix}/privacy`} element={<PrivacyPage />} />
                  <Route path={`${prefix}/privacy-policy`} element={<Navigate to={`${prefix}/privacy`} replace />} />
                  <Route path={`${prefix}/terms`} element={<TermsPage />} />
                  <Route path={`${prefix}/terms-of-use`} element={<Navigate to={`${prefix}/terms`} replace />} />
                  <Route path={`${prefix}/refund`} element={<RefundPage />} />
                  <Route path={`${prefix}/refunds`} element={<RefundPage />} />
                  <Route path={`${prefix}/refund-policy`} element={<Navigate to={`${prefix}/refund`} replace />} />
                  <Route path={`${prefix}/compliance`} element={<Navigate to={`${prefix}/legal-compliance`} replace />} />
                  <Route path={`${prefix}/regulatory`} element={<Navigate to={`${prefix}/legal-compliance`} replace />} />
                  <Route path={`${prefix}/regulatory-framework`} element={<Navigate to={`${prefix}/legal-compliance`} replace />} />
                  <Route path={`${prefix}/marketing`} element={<SocialMarketingPage />} />
                  <Route
                    path={`${prefix}/reports`}
                    element={
                      <ProtectedAdminRoute>
                        <ReportsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path={`${prefix}/blocked`} element={<BlockedPage />} />
                  <Route path={`${prefix}/social-marketing`} element={<Navigate to={`${prefix}/marketing`} replace />} />
                  <Route path={`${prefix}/sovereign-ai-hub`} element={<AdvancedAIHubPage />} />

                  {/* Strictly Protected Admin & Chairman Vault Routes */}
                  <Route
                    path={`${prefix}/admin`}
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboardPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/analytics`}
                    element={
                      <ProtectedAdminRoute>
                        <AdminAnalyticsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/ai-analytics`}
                    element={
                      <ProtectedAdminRoute>
                        <AdminAIAnalyticsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/customer-success`}
                    element={
                      <ProtectedAdminRoute>
                        <CustomerSuccessPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/enterprise-governance`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseGovernancePage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/ecosystem`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseEcosystemPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/legal-ops`}
                    element={
                      <ProtectedAdminRoute>
                        <LegalOperationsCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/command-center`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/regulatory-radar`}
                    element={
                      <ProtectedAdminRoute>
                        <RegulatoryRadarPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/cloud-console`}
                    element={
                      <ProtectedAdminRoute>
                        <SovereignCloudConsolePage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/singularity-hub`}
                    element={
                      <ProtectedAdminRoute>
                        <SingularityHubPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/federation-hub`}
                    element={
                      <ProtectedAdminRoute>
                        <SovereignFederationHubPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/planetary-hub`}
                    element={
                      <ProtectedAdminRoute>
                        <PlanetaryHubPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/operations-center`}
                    element={
                      <ProtectedAdminRoute>
                        <OperationsCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/trust-hub`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseTrustHubPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/scale-readiness`}
                    element={
                      <ProtectedAdminRoute>
                        <ScaleReadinessCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/lifecycle-hub`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseLifecycleHubPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/strategic-operations`}
                    element={
                      <ProtectedAdminRoute>
                        <StrategicOperationsCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/enterprise-adoption`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseAdoptionCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/enterprise-operations`}
                    element={
                      <ProtectedAdminRoute>
                        <EnterpriseOperationsCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/commercial-intelligence`}
                    element={
                      <ProtectedAdminRoute>
                        <CommercialIntelligenceCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/partner-ecosystem`}
                    element={
                      <ProtectedAdminRoute>
                        <PartnerEcosystemCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/global-intelligence`}
                    element={
                      <ProtectedAdminRoute>
                        <GlobalIntelligenceCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/institutional-os`}
                    element={
                      <ProtectedAdminRoute>
                        <InstitutionalOSCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/global-ecosystem`}
                    element={
                      <ProtectedAdminRoute>
                        <GlobalEcosystemCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/operational-maturity`}
                    element={
                      <ProtectedAdminRoute>
                        <OperationalMaturityCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/institutional-scale`}
                    element={
                      <ProtectedAdminRoute>
                        <InstitutionalScaleCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/global-intelligence-network`}
                    element={
                      <ProtectedAdminRoute>
                        <GlobalIntelligenceNetworkCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/institutional-marketplace`}
                    element={
                      <ProtectedAdminRoute>
                        <InstitutionalMarketplaceCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/planetary-sovereign`}
                    element={
                      <ProtectedAdminRoute>
                        <PlanetarySovereignCommandCenterPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/marketing-crm`}
                    element={
                      <ProtectedAdminRoute>
                        <AdminMarketingCRMPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/receipt-review`}
                    element={
                      <ProtectedAdminRoute>
                        <AdminReceiptReviewPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/anti-fraud`}
                    element={
                      <ProtectedAdminRoute>
                        <AntiFraudAuditorPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/financial`}
                    element={
                      <ProtectedAdminRoute>
                        <AdminFinancialDashboardPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path={`${prefix}/admin/billing`} element={<Navigate to={`${prefix}/admin/financial`} replace />} />
                  <Route path={`${prefix}/admin/treasury`} element={<Navigate to={`${prefix}/admin/financial`} replace />} />
                  <Route path={`${prefix}/admin/receipts`} element={<Navigate to={`${prefix}/admin/receipt-review`} replace />} />
                  <Route path={`${prefix}/dashboard/finance`} element={<Navigate to={`${prefix}/admin/financial`} replace />} />
                  <Route
                    path={`${prefix}/admin/review-queue`}
                    element={
                      <ProtectedAdminRoute>
                        <ReviewQueuePage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path={`${prefix}/admin/checklist`}
                    element={
                      <ProtectedAdminRoute>
                        <PlatformChecklistPage />
                      </ProtectedAdminRoute>
                    }
                  />
                </Fragment>
              ))}

              {/* 🛑 404 Custom Legal Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
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
              <YouTubeGrowthWidget />
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
