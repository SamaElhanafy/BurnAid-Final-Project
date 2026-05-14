import { useBurnAid } from '../../context/BurnAidContext';
import { AlertTriangle, CheckCircle, Video } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Demo notification list (copy-only; not wired to a push backend).
 */
export function NotificationsView() {
  const {
    t,
  } = useBurnAid();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase font-headline">{t.notifications}</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="space-y-4">
        {t.notificationsView.items.map((notif, i) => {
          const icons = [CheckCircle, Video, AlertTriangle];
          const colors = ["text-green-500", "text-blue-500", "text-red-500"];
          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-surface-container-high shadow-sm hover:shadow-md transition-all flex items-start gap-4">
              <div className={`p-3 rounded-2xl bg-surface-container-low ${colors[i]}`}>
                {i === 0 ? <CheckCircle className="w-6 h-6" /> : i === 1 ? <Video className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{notif.title}</h3>
                  <span className="text-xs font-medium text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full">{notif.time}</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{notif.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
