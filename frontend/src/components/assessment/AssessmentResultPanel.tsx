import { ArrowRight, Info, RefreshCw, Stethoscope } from 'lucide-react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Presents model output: localized burn label, confidence, emergency band, first-aid list, and save status for logged-in users.
 */
export function AssessmentResultPanel() {
  const {
    burnSaveError,
    burnSaveMessage,
    currentResult,
    getEmergencyLevel,
    getPredictionText,
    handleAnalyzeAnother,
    isRtl,
    lang,
    setView,
    t,
  } = useBurnAid();

  if (!currentResult) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-surface-container-high relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[5rem]"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-secondary" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-secondary">{t.assessmentView.resultTitle}</span>
        </div>
        <h3 className="text-4xl font-headline font-black mb-4 text-primary">{getPredictionText(currentResult.burnType, lang).localizedLabel}</h3>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <p className="text-sm text-secondary font-bold">
            {isRtl ? `نسبة الثقة: ${(currentResult.confidence * 100).toFixed(2)}%` : `Confidence: ${(currentResult.confidence * 100).toFixed(2)}%`}
          </p>
          <p className="text-sm text-on-surface-variant">{new Date(currentResult.createdAt).toLocaleString()}</p>
        </div>
        <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl">
          {isRtl ? getPredictionText(currentResult.burnType, 'ar').description : currentResult.description}
        </p>
        <div className="bg-surface-container-low p-6 rounded-2xl mb-8">
          <h4 className="font-bold text-on-surface mb-2">{isRtl ? 'مستوى الطوارئ' : 'Emergency Level'}</h4>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                getEmergencyLevel(currentResult.burnType).level === 'emergencyNow'
                  ? 'bg-error text-white'
                  : getEmergencyLevel(currentResult.burnType).level === 'seeDoctor'
                    ? 'bg-warning text-white'
                    : 'bg-success text-white'
              }`}
            >
              {t.assessmentView.emergencyLevel[getEmergencyLevel(currentResult.burnType).level as keyof typeof t.assessmentView.emergencyLevel]}
            </span>
            <span className="text-sm text-on-surface-variant">
              {isRtl ? getPredictionText(currentResult.burnType, 'ar').description : getEmergencyLevel(currentResult.burnType).reason}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-2">
            {isRtl ? getPredictionText(currentResult.burnType, 'ar').recommendations[0] : getEmergencyLevel(currentResult.burnType).action}
          </p>
        </div>
        <div className="mb-8">
          <h4 className="font-bold text-on-surface mb-3">{isRtl ? 'الإسعافات المقترحة' : 'Suggested first aid'}</h4>
          <ul className="space-y-2 text-on-surface-variant">
            {(isRtl ? getPredictionText(currentResult.burnType, 'ar').recommendations : currentResult.recommendations).map((item, index) => (
              <li key={index}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setView('documentation')}
            className="flex-1 bg-emergency-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all group"
          >
            <Info className="w-5 h-5" />
            {t.assessmentView.careBtn}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
          <button onClick={handleAnalyzeAnother} className="flex-1 bg-surface-container-high text-on-surface py-5 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all">
            <RefreshCw className="w-5 h-5" />
            {t.assessmentView.reuploadBtn}
          </button>
        </div>
        {(burnSaveMessage || burnSaveError) && (
          <div
            className={`mt-6 rounded-2xl px-5 py-4 text-sm font-bold ${burnSaveError ? 'bg-error/10 text-error border border-error/20' : 'bg-success/10 text-success border border-success/20'}`}
          >
            {burnSaveError || burnSaveMessage}
          </div>
        )}
      </div>
    </div>
  );
}
