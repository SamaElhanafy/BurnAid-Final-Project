import { useBurnAid } from '../../context/BurnAidContext';
import { AlertTriangle, CheckCircle, Globe, Navigation, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * SOS page: do/don’t checklist, scripted call modal, map + backend `/api/places/nearby`.
 */
export function EmergencyView() {
  const {
    buildFacilityResultDirectionsUrl,
    buildGoogleMapsUrls,
    facilityMapEmbedUrl,
    facilityMode,
    facilityResults,
    facilityStatus,
    facilityStatusTone,
    findNearestFacility,
    formatDistanceLabel,
    getFacilityDisplayAddress,
    getFacilityDisplayName,
    getFacilitySearchMeta,
    isFindingFacility,
    isRtl,
    lastCoords,
    setFacilityMapEmbedUrl,
    setFacilityMode,
    setFacilityResults,
    setFacilityResultsMessage,
    setFacilityStatus,
    setFacilityStatusTone,
    setIsEmergencyModalOpen,
    t,
  } = useBurnAid();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-6 py-12"
    >
      {/* Urgency Banner */}
      <section className="mb-12 text-center">
        <h1 className="font-headline font-black text-5xl md:text-7xl text-primary tracking-tighter leading-none mb-6">
          {t.emergencyView.title}
        </h1>
        <p className="text-on-surface-variant text-xl max-w-2xl mx-auto leading-relaxed">
          {t.emergencyView.subtitle}
        </p>
      </section>

      {/* Major Emergency Action */}
      <section className="mb-12">
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="bg-emergency-gradient w-full flex flex-col items-center justify-center px-6 py-10 sm:py-12 rounded-[2.25rem] sm:rounded-[3rem] shadow-2xl transition-transform active:scale-[0.98] group"
        >
          <PhoneCall className="text-white w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-white font-headline font-black text-xl sm:text-2xl md:text-4xl tracking-tight uppercase text-center leading-tight break-words">
            {t.emergencyView.callBtn}
          </span>
          <span className="text-white/80 mt-2 text-sm sm:text-base md:text-lg text-center leading-relaxed max-w-2xl">
            {t.emergencyView.callSub}
          </span>
        </button>
      </section>

      {/* DOs and DON'Ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* DO List */}
        <div className="bg-surface-container-lowest p-10 rounded-[3rem] border-l-8 rtl:border-l-0 rtl:border-r-8 border-tertiary shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="text-tertiary w-8 h-8" />
            <h2 className="font-headline font-bold text-2xl text-on-surface">{t.emergencyView.dosTitle}</h2>
          </div>
          <ul className="space-y-6">
            {t.emergencyView.dos.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-tertiary mt-2.5 shrink-0" />
                <p className="text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">{item.title}:</strong> {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* DON'T List */}
        <div className="bg-error-container/20 p-10 rounded-[3rem] shadow-sm border border-error/10">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-error w-8 h-8" />
            <h2 className="font-headline font-bold text-2xl text-on-error-container">{t.emergencyView.dontsTitle}</h2>
          </div>
          <ul className="space-y-6">
            {t.emergencyView.donts.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-error mt-2.5 shrink-0" />
                <p className="text-on-error-container leading-relaxed">
                  <strong className="font-bold">{item.title}:</strong> {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bento-style Patient Info & Map */}
      <div className="flex justify-center">
        {/* Facility Finder (Map) */}
        <div
          id="emergency-facility"
          className="w-full max-w-3xl bg-white rounded-[3rem] shadow-sm overflow-hidden flex flex-col border border-surface-container-high"
        >
          <div className="p-8">
            <h3 className="font-headline font-bold text-2xl mb-2 flex items-center gap-3">
              <Globe className="text-secondary w-6 h-6" />
              {t.emergencyView.facilityTitle}
            </h3>
            <p className="text-on-surface-variant text-sm">{t.emergencyView.facilityDesc}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-surface-container-high">
                {([
                  { key: 'emergency' as const, label: isRtl ? 'طوارئ' : 'Emergency' },
                  { key: 'burn' as const, label: isRtl ? 'حروق' : 'Burn' },
                  { key: 'both' as const, label: isRtl ? 'الاثنين' : 'Both' },
                ]).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setFacilityMode(opt.key);
                      setFacilityMapEmbedUrl(buildGoogleMapsUrls(opt.key, lastCoords ?? undefined).embedUrl);
                      setFacilityResults([]);
                      setFacilityResultsMessage(
                        isRtl
                          ? 'اضغط بحث لعرض نتائج مكتوبة لهذا الخيار.'
                          : 'Press search to load written results for this option.',
                      );
                      setFacilityStatusTone('neutral');
                      setFacilityStatus(
                        isRtl
                          ? `الوضع المحدد: ${getFacilitySearchMeta(opt.key).buttonText}`
                          : `Selected mode: ${getFacilitySearchMeta(opt.key).buttonText}`,
                      );
                    }}
                    className={[
                      'px-3 py-2 rounded-lg text-xs font-bold transition-all',
                      facilityMode === opt.key
                        ? 'bg-white text-on-surface shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface',
                    ].join(' ')}
                    disabled={isFindingFacility}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => findNearestFacility()}
                className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold"
                disabled={isFindingFacility}
              >
                {isFindingFacility
                  ? (isRtl ? 'جاري البحث...' : 'Finding...')
                  : getFacilitySearchMeta(facilityMode).buttonText}
              </button>
              <span
                className={[
                  'text-xs font-medium',
                  facilityStatusTone === 'error'
                    ? 'text-error'
                    : facilityStatusTone === 'success'
                      ? 'text-tertiary'
                      : 'text-on-surface-variant',
                ].join(' ')}
              >
                {facilityStatus}
              </span>
            </div>
            <div className="mt-5">
              {isFindingFacility ? (
                <div className="animate-pulse rounded-2xl border border-surface-container-high bg-surface-container-low p-4">
                  <div className="h-4 bg-surface-container-high rounded w-1/2 mb-3" />
                  <div className="h-3 bg-surface-container-high rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface-container-high rounded w-1/3" />
                </div>
              ) : facilityResults[0] ? (
                <div className="rounded-2xl border border-surface-container-high bg-surface-container-low p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest text-secondary mb-2">{isRtl ? 'أقرب نتيجة' : 'Nearest result'}</p>
                      <h4 className="font-black text-lg text-on-surface leading-tight">{getFacilityDisplayName(facilityResults[0])}</h4>
                      <p className="text-sm text-on-surface-variant mt-2">{getFacilityDisplayAddress(facilityResults[0]) || (isRtl ? 'العنوان غير متاح' : 'Address not available')}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-on-surface-variant">
                        <span className="px-3 py-1 rounded-full bg-white border border-surface-container-high">{formatDistanceLabel(facilityResults[0].distanceKm)}</span>
                        <span className="px-3 py-1 rounded-full bg-white border border-surface-container-high">{facilityResults[0].rating ? `${isRtl ? 'التقييم' : 'Rating'} ${facilityResults[0].rating}` : (isRtl ? 'التقييم غير متاح' : 'Rating not available')}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(buildFacilityResultDirectionsUrl(facilityResults[0]), '_blank', 'noopener,noreferrer')}
                      className="h-11 w-11 inline-flex items-center justify-center bg-secondary text-white rounded-xl active:scale-95 transition-all shrink-0"
                      aria-label={isRtl ? 'فتح الاتجاهات في خرائط Google' : 'Open directions in Google Maps'}
                      title={isRtl ? 'فتح الاتجاهات في خرائط Google' : 'Open directions in Google Maps'}
                    >
                      <Navigation className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mx-8 mb-8 min-h-[350px] relative rounded-[2rem] overflow-hidden border border-surface-container-high bg-surface-container-low">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={facilityMapEmbedUrl}
              title={isRtl ? 'Nearest specialized care map preview' : 'Nearest specialized care map preview'}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
