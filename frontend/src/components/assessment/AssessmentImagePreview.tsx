import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Shows the locally previewed burn image after the user selects a file (before/while the model runs).
 */
export function AssessmentImagePreview() {
  const { previewUrl, selectedFile } = useBurnAid();

  if (!previewUrl) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-surface-container-high">
      <img src={previewUrl} alt={selectedFile ? `Selected burn: ${selectedFile.name}` : 'Selected burn'} className="w-full max-h-[420px] object-contain rounded-2xl" />
    </div>
  );
}
