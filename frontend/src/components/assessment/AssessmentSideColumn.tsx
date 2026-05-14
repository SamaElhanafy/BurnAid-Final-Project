import { Lightbulb, Maximize, PhoneCall } from 'lucide-react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Right column on large screens: quick jump to emergency tools plus static photography / safety tips.
 */
export function AssessmentSideColumn() {
  const { setView, t } = useBurnAid();

  return (
    <div className="space-y-6">
      <button
        onClick={() => setView('emergency')}
        className="w-full bg-primary text-white p-8 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all group"
      >
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <PhoneCall className="w-8 h-8" />
        </div>
        <span className="text-2xl font-black uppercase tracking-tight">{t.assessmentView.emergencyBtn}</span>
      </button>

      <div className="bg-surface-container-low rounded-[2.5rem] p-8 space-y-6 border border-surface-container-high">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-6 h-6 text-tertiary" />
          <h4 className="font-bold text-xl">{t.assessmentView.tipsTitle}</h4>
        </div>
        {t.assessmentView.tips.map((tip, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <Maximize className="w-4 h-4 text-secondary" />
              {tip.title}
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
