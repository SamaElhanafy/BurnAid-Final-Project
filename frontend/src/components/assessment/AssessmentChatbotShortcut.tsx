import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Secondary CTA: open the Gemini chatbot without uploading (still contextual once a prediction exists).
 */
export function AssessmentChatbotShortcut() {
  const { isRtl, setIsChatbotOpen } = useBurnAid();

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={() => setIsChatbotOpen(true)}
        className="flex-1 bg-secondary text-white px-6 py-4 rounded-2xl font-bold hover:bg-secondary/90 transition-all"
      >
        {isRtl ? 'تخطي الرفع وبدء الدردشة' : 'Skip upload and start chatbot'}
      </button>
    </div>
  );
}
