import { useBurnAid } from '../../context/BurnAidContext';
import { AssessmentAnalyzingPanel } from '../assessment/AssessmentAnalyzingPanel';
import { AssessmentChatbotShortcut } from '../assessment/AssessmentChatbotShortcut';
import { AssessmentImagePreview } from '../assessment/AssessmentImagePreview';
import { AssessmentResultPanel } from '../assessment/AssessmentResultPanel';
import { AssessmentSideColumn } from '../assessment/AssessmentSideColumn';
import { AssessmentUploadZone } from '../assessment/AssessmentUploadZone';

/**
 * Assessment screen: composes upload, preview, progress, results, and sidebar CTAs.
 * Business logic (API calls, history) stays in `useBurnAidController`.
 */
export function AssessmentView() {
  const { assessmentError, t } = useBurnAid();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-black mb-4">{t.assessmentView.title}</h2>
        <p className="text-on-surface-variant font-medium">{t.assessmentView.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AssessmentUploadZone />
          <AssessmentChatbotShortcut />
          <AssessmentImagePreview />
          <AssessmentAnalyzingPanel />
          {assessmentError && <div className="bg-error/10 border border-error/30 text-error rounded-2xl px-5 py-4 font-medium">{assessmentError}</div>}
          <AssessmentResultPanel />
        </div>

        <AssessmentSideColumn />
      </div>
    </div>
  );
}
