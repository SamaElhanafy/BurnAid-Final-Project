import {
  AlertTriangle,
  Bell,
  BookOpen,
  Globe,
  House,
  PhoneCall,
  Stethoscope,
  UserCircle,
  Video,
} from 'lucide-react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Top navigation: brand, primary routes (desktop), language toggle, notifications, account, emergency shortcut.
 */
export function AppHeader() {
  const {
    authUser,
    isRtl,
    lang,
    setIsEmergencyModalOpen,
    setLang,
    setView,
    t,
    view,
  } = useBurnAid();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
        <button
          type="button"
          onClick={() => setView('landing')}
          className="text-xl font-black text-primary uppercase tracking-tighter font-headline active:scale-95 transition-transform flex items-center gap-2 md:mr-6 rtl:md:mr-0 rtl:md:ml-6"
        >
          Burnaid
        </button>
        <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => setView('landing')}
            className={`flex items-center gap-2 ${view === 'landing' ? 'text-secondary font-semibold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary transition-colors'}`}
          >
            <House className="w-4 h-4" />
            {t.guide}
          </button>
          <button
            type="button"
            onClick={() => setView('assessment')}
            className={`flex items-center gap-2 ${view === 'assessment' ? 'text-secondary font-semibold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary transition-colors'}`}
          >
            <Stethoscope className="w-4 h-4" />
            {t.assessment}
          </button>
          <button
            type="button"
            onClick={() => setView('emergency')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 ${view === 'emergency' ? 'bg-error text-white ring-4 ring-error/20' : 'bg-error text-white hover:bg-error/90'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            {t.emergency}
          </button>
          <button
            type="button"
            onClick={() => setView('documentation')}
            className={`flex items-center gap-2 ${view === 'documentation' ? 'text-secondary font-semibold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary transition-colors'}`}
          >
            <BookOpen className="w-4 h-4" />
            {t.documentation}
          </button>
          <button
            type="button"
            onClick={() => setView('video')}
            className={`flex items-center gap-2 ${view === 'video' ? 'text-secondary font-semibold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary transition-colors'}`}
          >
            <Video className="w-4 h-4" />
            {t.video}
          </button>
          <button
            type="button"
            onClick={() => setView('about')}
            className={`flex items-center gap-2 ${view === 'about' ? 'text-secondary font-semibold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary transition-colors'}`}
          >
            <UserCircle className="w-4 h-4" />
            {t.about}
          </button>
          <div className="flex items-center ml-4 rtl:ml-0 rtl:mr-4 border-l rtl:border-l-0 rtl:border-r border-surface-container-high pl-4 rtl:pl-0 rtl:pr-4">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`text-xs font-bold px-2 py-1 rounded ${lang === 'en' ? 'bg-surface-container-high text-secondary' : 'text-on-surface-variant'}`}
            >
              English
            </button>
            <span className="mx-1 text-surface-container-highest">|</span>
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`text-xs font-medium px-2 py-1 border border-[#0d0d0e] rounded ${lang === 'ar' ? 'bg-surface-container-high text-secondary' : 'text-on-surface-variant'}`}
            >
              العربية
            </button>
          </div>
        </nav>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded-full border border-surface-container-high text-on-surface-variant"
          >
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">{lang}</span>
          </button>
          <button
            type="button"
            onClick={() => setView('notifications')}
            className={`p-2 rounded-full transition-all ${view === 'notifications' ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setView(authUser ? 'account' : 'login')}
            className={`p-2 rounded-full transition-all ${view === 'account' ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            <UserCircle className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="hidden lg:flex items-center gap-2 bg-emergency-gradient text-white px-6 py-2.5 rounded-full font-bold tracking-tight text-sm active:scale-95 transition-all shadow-sm hover:shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            {t.emergencyCall}
          </button>
        </div>
      </div>
    </header>
  );
}
