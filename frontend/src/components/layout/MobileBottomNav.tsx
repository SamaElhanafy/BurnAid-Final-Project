import { AlertTriangle, BookOpen, Stethoscope, UserCircle, Users, Video } from 'lucide-react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Fixed bottom tab bar for small screens; mirrors key sections from the desktop header.
 */
export function MobileBottomNav() {
  const { setView, t, view } = useBurnAid();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
      {t.mobileNav.map((label, i) => {
        const icons = [Stethoscope, Video, AlertTriangle, BookOpen, UserCircle, Users];
        const Icon = icons[i];
        const isActive =
          (i === 0 && view === 'assessment') ||
          (i === 1 && view === 'video') ||
          (i === 2 && view === 'emergency') ||
          (i === 3 && view === 'documentation') ||
          (i === 4 && view === 'about') ||
          (i === 5 && view === 'account');
        const isEmergency = i === 2;
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (i === 0) setView('assessment');
              if (i === 1) setView('video');
              if (i === 2) setView('emergency');
              if (i === 3) setView('documentation');
              if (i === 4) setView('about');
              if (i === 5) setView('account');
            }}
            className={`flex flex-col items-center justify-center rounded-xl px-2 py-1.5 active:scale-90 transition-all ${
              isEmergency ? (isActive ? 'bg-error text-white shadow-lg' : 'bg-error/10 text-error') : isActive ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
