import { AnimatePresence } from 'motion/react';
import { useBurnAid } from '../../context/BurnAidContext';
import { AuthFormView } from '../auth/AuthFormView';
import {
  AboutView,
  AccountView,
  AdminPortalView,
  AssessmentView,
  DocumentationView,
  EmergencyView,
  HowItWorksView,
  LandingView,
  NotificationsView,
  VideoResourcesView,
} from '../views';

/**
 * Switches the main content area based on `view` from context (simple client-side "router").
 */
export function MainViewRouter() {
  const { authError, backendUrl, completeAuth, isRtl, setAuthError, setView, view } = useBurnAid();

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <LandingView key="landing" />
      ) : view === 'assessment' ? (
        <div key="assessment">
          <AssessmentView />
        </div>
      ) : view === 'emergency' ? (
        <EmergencyView key="emergency" />
      ) : view === 'documentation' ? (
        <DocumentationView key="documentation" />
      ) : view === 'about' ? (
        <AboutView key="about" />
      ) : view === 'account' ? (
        <AccountView key="account" />
      ) : view === 'notifications' ? (
        <NotificationsView key="notifications" />
      ) : view === 'how-it-works' ? (
        <HowItWorksView key="how-it-works" />
      ) : view === 'admin' ? (
        <AdminPortalView key="admin" />
      ) : view === 'login' ? (
        <AuthFormView
          key="login"
          mode="login"
          backendUrl={backendUrl}
          isRtl={isRtl}
          authError={authError}
          onAuthStart={() => setAuthError('')}
          onAuthSuccess={completeAuth}
          onAuthError={setAuthError}
          onNavigate={setView}
        />
      ) : view === 'register' ? (
        <AuthFormView
          key="register"
          mode="register"
          backendUrl={backendUrl}
          isRtl={isRtl}
          authError={authError}
          onAuthStart={() => setAuthError('')}
          onAuthSuccess={completeAuth}
          onAuthError={setAuthError}
          onNavigate={setView}
        />
      ) : (
        <VideoResourcesView key="video" />
      )}
    </AnimatePresence>
  );
}
