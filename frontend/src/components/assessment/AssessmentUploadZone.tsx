import { UploadCloud } from 'lucide-react';
import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Dashed drop-style area: opens the file picker and wires the hidden `<input type="file">` to the controller.
 */
export function AssessmentUploadZone() {
  const { fileInputRef, handleFileSelected, handlePickImage, isAnalyzing, isRtl, t } = useBurnAid();

  return (
    <div
      onClick={handlePickImage}
      className="bg-white rounded-[2.5rem] p-12 border-2 border-dashed border-surface-container-highest flex flex-col items-center justify-center text-center space-y-6 hover:border-secondary transition-colors cursor-pointer group"
    >
      <div className="w-24 h-24 bg-secondary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <UploadCloud className="w-12 h-12 text-secondary" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">{t.assessmentView.uploadTitle}</h3>
        <p className="text-on-surface-variant">{t.assessmentView.uploadDesc}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePickImage();
        }}
        disabled={isAnalyzing}
        className={`bg-secondary text-on-secondary px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 ${isAnalyzing ? 'opacity-50 cursor-not-allowed hover:shadow-none' : 'hover:shadow-xl'}`}
      >
        {isAnalyzing ? (isRtl ? 'جاري...' : 'Loading...') : t.assessmentView.selectBtn}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFileSelected(event);
          event.target.value = '';
        }}
      />
    </div>
  );
}
