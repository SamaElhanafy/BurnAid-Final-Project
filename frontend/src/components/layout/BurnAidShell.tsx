import { useBurnAid } from '../../context/BurnAidContext';
import { ChatbotModal } from '../chat/ChatbotModal';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { EmergencyCallModal } from './EmergencyCallModal';
import { MainViewRouter } from './MainViewRouter';
import { MobileBottomNav } from './MobileBottomNav';

/**
 * App shell: global layout (header, main, footer, mobile nav) plus overlays (chatbot, emergency modal).
 * Actual screen bodies live in `MainViewRouter` and the `views/*` components.
 */
export function BurnAidShell() {
  const { isChatbotOpen, isRtl, lang, prediction, setIsChatbotOpen, setView, t } = useBurnAid();

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'font-cairo' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <ChatbotModal
        t={t}
        isRtl={isRtl}
        lang={lang}
        predictionLabel={prediction?.label}
        onNavigateToAssessment={() => setView('assessment')}
        startOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      <EmergencyCallModal />

      <AppHeader />

      <main className="pt-24 pb-32 flex-grow">
        <MainViewRouter />
      </main>

      <AppFooter />

      <MobileBottomNav />
    </div>
  );
}
