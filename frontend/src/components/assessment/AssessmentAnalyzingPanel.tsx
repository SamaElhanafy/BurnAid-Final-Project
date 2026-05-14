import { CheckCircle, Circle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Animated progress UI while the Python `/predict` request is in flight.
 */
export function AssessmentAnalyzingPanel() {
  const { isAnalyzing, isRtl, t } = useBurnAid();

  if (!isAnalyzing) return null;

  return (
    <div className="bg-surface-container-low rounded-[2.5rem] p-8 space-y-6 border border-surface-container-high">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-secondary animate-spin" />
          <span className="font-bold">{t.assessmentView.analyzing}</span>
        </div>
        <span className="text-secondary font-black">...</span>
      </div>
      <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: isRtl ? '78%' : '78%' }} className="h-full bg-secondary rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {t.assessmentView.analysisSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {i < 3 ? <CheckCircle className="w-4 h-4 text-tertiary" /> : <Circle className="w-4 h-4 text-on-surface-variant/30" />}
            <span className={i < 2 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
