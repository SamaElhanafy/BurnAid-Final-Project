import { useBurnAid } from '../../context/BurnAidContext';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Step-by-step explainer + embedded “how it works” clip from admin-managed settings.
 */
export function HowItWorksView() {
  const {
    getEmbedUrl,
    howItWorksVideo,
    isDirectVideoUrl,
    isHowItWorksPlaying,
    isRtl,
    setIsHowItWorksPlaying,
    setView,
    t,
  } = useBurnAid();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => setView('landing')}
          className="p-3 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-headline uppercase">{t.howItWorksView.title}</h1>
          <p className="text-xl text-secondary font-bold uppercase tracking-widest">{t.howItWorksView.subtitle}</p>
        </div>
      </div>

      <div className="bg-surface-container-low p-12 rounded-[3.5rem] border border-surface-container-high overflow-hidden relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 className="text-4xl font-black mb-6 tracking-tight font-headline uppercase">{t.howItWorksView.videoTitle}</h2>
            <p className="text-xl text-on-surface-variant leading-relaxed font-medium mb-8">
              {t.howItWorksView.videoDesc}
            </p>
          </div>
          <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            {isHowItWorksPlaying ? (
              getEmbedUrl(howItWorksVideo.youtubeUrl || howItWorksVideo.videoUrl || '', true) ? (
                <iframe
                  src={getEmbedUrl(howItWorksVideo.youtubeUrl || howItWorksVideo.videoUrl || '', true)}
                  title="How It Works Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : isDirectVideoUrl(howItWorksVideo.youtubeUrl || howItWorksVideo.videoUrl || '') ? (
                <video className="w-full h-full object-cover" src={howItWorksVideo.youtubeUrl || howItWorksVideo.videoUrl || ''} controls autoPlay />
              ) : (
                <div className="w-full h-full bg-black/70 text-white flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <p className="font-semibold">
                    {isRtl ? 'الرابط ليس فيديو مباشرًا أو رابط YouTube صحيح للتضمين.' : 'Link is not a direct video file or a valid YouTube embed link.'}
                  </p>
                  <button
                    onClick={() => window.open(howItWorksVideo.youtubeUrl || howItWorksVideo.videoUrl || '', '_blank', 'noopener,noreferrer')}
                    className="px-4 py-2 rounded-lg bg-primary text-white font-bold"
                  >
                    {isRtl ? 'فتح الرابط في تبويب جديد' : 'Open link in new tab'}
                  </button>
                </div>
              )
            ) : (
              <>
                <img
                  src={howItWorksVideo.thumbnail}
                  alt="Video Preview"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setIsHowItWorksPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 blur-3xl rounded-full"></div>
      </div>
    </motion.div>
  );
}
