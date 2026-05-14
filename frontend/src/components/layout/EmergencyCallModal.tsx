import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Full-screen modal shown when the user taps "Emergency call".
 * Displays the national emergency number and a short script to read to the dispatcher.
 */
export function EmergencyCallModal() {
  const { emergencyNumber, emergencyScript, isEmergencyModalOpen, isRtl, setIsEmergencyModalOpen } = useBurnAid();

  return (
    <AnimatePresence>
      {isEmergencyModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsEmergencyModalOpen(false)}
          className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-surface-container-high p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-primary">{isRtl ? 'اتصال الطوارئ' : 'Emergency Call'}</h3>
              <button type="button" onClick={() => setIsEmergencyModalOpen(false)} className="p-2 rounded-full hover:bg-surface-container-low">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-on-surface-variant mb-2">{isRtl ? 'رقم الطوارئ:' : 'Emergency number:'}</p>
            <div className="text-4xl font-black text-primary mb-5">{emergencyNumber}</div>
            <p className="font-bold mb-2">{isRtl ? 'قولي للمسعف النص ده:' : 'Tell dispatcher this:'}</p>
            <div className="bg-surface-container-low rounded-2xl p-4 text-sm whitespace-pre-wrap leading-relaxed border border-surface-container-high">
              {emergencyScript}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
