import { useBurnAid } from '../../context/BurnAidContext';
import { BarChart, Bookmark, Clock, PlayCircle, RefreshCw, Share2, ShieldCheck, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import type { ManagedVideo } from '../../types/burnAid';
import { DEFAULT_MANAGED_VIDEOS } from '../../constants/videoDefaults';

/**
 * Curated educational playlist (EN/AR lists from `/api/videos` + admin overrides).
 */
export function VideoResourcesView() {
  const {
    getEmbedUrl,
    isDirectVideoUrl,
    isRtl,
    isSelectedVideoPlaying,
    lang,
    selectedVideoIndex,
    setIsSelectedVideoPlaying,
    setSelectedVideoIndex,
    t,
    videoSettings,
  } = useBurnAid();

    const language = lang;
    const currentVideos = language === 'ar' ? videoSettings.arVideos : videoSettings.enVideos;
    const selectedVideo = currentVideos[selectedVideoIndex] ?? currentVideos[0] ?? DEFAULT_MANAGED_VIDEOS[0];
    const selectedVideoUrl = selectedVideo?.youtubeUrl || selectedVideo?.videoUrl || '';
    const youtubeEmbedUrl = getEmbedUrl(selectedVideoUrl, true);
    const directVideoUrl = selectedVideoUrl;
    const arabicVideoTitles = [
      '1. بروتوكولات تقييم الحروق',
      '2. تقنيات التبريد والخطوات الأولى',
      '3. دليل التعافي من الحروق',
      '4. الوقاية من العدوى',
    ];
    const getVideoDisplayTitle = (video: ManagedVideo | undefined, index = selectedVideoIndex) => {
      if (!video) return t.videoView.featured.title;
      if (language !== 'ar') return video.title;
      const title = video.title || '';
      const isOldEnglishArabicDefault =
        title.includes('Arabic Burn') ||
        title.includes('Arabic Cooling') ||
        title.includes('Arabic Recovery') ||
        title.includes('Arabic Infection');
      return isOldEnglishArabicDefault ? arabicVideoTitles[index] || title : title;
    };

    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-4">{t.videoView.title}</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          {t.videoView.desc}
        </p>
      </header>

      {/* Video Player Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Featured Video Player */}
        <div className="lg:col-span-8">
          <div className="relative aspect-video bg-surface-container-highest rounded-[2.5rem] overflow-hidden group shadow-2xl">
            {isSelectedVideoPlaying ? (
              youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={getVideoDisplayTitle(selectedVideo)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : isDirectVideoUrl(directVideoUrl) ? (
                <video className="w-full h-full object-cover" src={directVideoUrl} controls autoPlay />
              ) : (
                <div className="w-full h-full bg-black/80 text-white flex items-center justify-center p-8 text-center font-semibold">
                  {isRtl ? 'رابط الفيديو غير قابل للتضمين.' : 'This video link cannot be embedded.'}
                </div>
              )
            ) : (
              <>
                <img 
                  className="w-full h-full object-cover" 
                  src={selectedVideo?.thumbnail || "https://picsum.photos/seed/burnFeatured/1200/675"}
                  alt="Clinical demonstration"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:bg-black/20 transition-all">
                  <button
                    onClick={() => setIsSelectedVideoPlaying(true)}
                    className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white scale-100 hover:scale-110 transition-transform shadow-xl"
                  >
                    <PlayCircle className="w-12 h-12" />
                  </button>
                </div>
              </>
            )}
            {!isSelectedVideoPlaying && <div className={`absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="inline-block bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                {t.videoView.featured.badge}
              </span>
              <h2 className="text-white text-3xl font-black">{getVideoDisplayTitle(selectedVideo)}</h2>
            </div>}
          </div>

          <div className="mt-8 p-10 bg-white rounded-[2.5rem] border border-surface-container-high">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{t.videoView.featured.commentaryTitle}</h3>
                  <p className="text-sm text-on-surface-variant font-medium">{t.videoView.featured.commentaryAuthor}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors">
                  <Share2 className="w-5 h-5 text-on-surface-variant" />
                </button>
                <button className="p-3 bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors">
                  <Bookmark className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
            </div>
            <p className="text-on-surface text-lg leading-relaxed mb-8">
              {t.videoView.featured.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {t.videoView.featured.meta.map((item, i) => {
                const Icons = [Clock, BarChart, ShieldCheck];
                const Icon = Icons[i];
                return (
                  <span key={i} className="px-5 py-2.5 bg-surface-container-low rounded-xl text-sm font-bold flex items-center gap-2 text-on-surface-variant border border-surface-container-high">
                    <Icon className="w-4 h-4" /> {item}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-low rounded-[2.5rem] p-8 h-full border border-surface-container-high">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-2xl tracking-tight">{t.videoView.playlist.title}</h3>
              <span className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">{currentVideos.length} {isRtl ? 'فيديو' : 'Videos'}</span>
            </div>
            <div className="space-y-4">
              {currentVideos.map((item, i) => (
                <button 
                  key={item.id || i} 
                  onClick={() => {
                    setSelectedVideoIndex(i);
                    setIsSelectedVideoPlaying(false);
                  }}
                  className={`w-full flex gap-4 p-4 rounded-2xl text-left ${isRtl ? 'text-right' : 'text-left'} transition-all group ${i === selectedVideoIndex ? 'bg-white border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary shadow-md' : 'hover:bg-surface-container-highest'}`}
                >
                  <div className="relative w-28 aspect-video shrink-0 rounded-xl overflow-hidden bg-surface-container-highest">
                    <img 
                      className={`w-full h-full object-cover ${i === selectedVideoIndex ? 'opacity-40' : ''}`} 
                      src={item.thumbnail || `https://picsum.photos/seed/burn${i}/200/120`}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {i === selectedVideoIndex ? <RefreshCw className="w-6 h-6 text-primary animate-spin" /> : <PlayCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className={`font-bold text-sm leading-tight group-hover:text-primary transition-colors ${i === selectedVideoIndex ? 'text-primary' : 'text-on-surface'}`}>{getVideoDisplayTitle(item, i)}</h4>
                    <p className="text-xs text-on-surface-variant mt-1.5 font-medium">{item.duration || item.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-surface-container-highest">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-container-high">
                <p className="text-xs font-black text-secondary uppercase tracking-widest mb-3">{t.videoView.playlist.progress}</p>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-1/4 rounded-full"></div>
                </div>
                <p className="text-[11px] font-bold text-on-surface-variant mt-3">{t.videoView.playlist.progressSub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
    );
}
