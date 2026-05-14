import { useState, useRef, useEffect, useMemo, type ChangeEvent } from 'react';
import {
  APP_VIEWS,
  type AppView,
  type BurnPrediction,
  type CurrentAssessmentResult,
  type ManagedVideo,
  type HowItWorksVideoConfig,
  type VideoSettings,
  type FacilitySearchMode,
  type FacilityStatusTone,
  type FacilityResult,
  type FacilityAdminArea,
} from '../types/burnAid';
import { EGYPT_FALLBACK_FACILITIES } from '../constants/egyptFacilities';
import {
  DEFAULT_VIDEO_SETTINGS,
  DEFAULT_MANAGED_VIDEOS,
  DEFAULT_AR_MANAGED_VIDEOS,
  DEFAULT_HOW_IT_WORKS_VIDEO,
} from '../constants/videoDefaults';
import { BLOOD_TYPE_OPTIONS, EGYPTIAN_PHONE_PATTERN, normalizeBloodType } from '../constants/auth';
import { translations } from '../i18n/translations';

/**
 * Client state, effects, and helpers for BURN-AID (assessment, maps, admin, videos).
 * Used via BurnAidProvider and useBurnAid() from screen components.
 */
export function useBurnAidController() {
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('burnaid_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });
  const [view, setView] = useState<AppView>(() => {
    const saved = localStorage.getItem('burnaid_view');
    return (APP_VIEWS as readonly string[]).includes(saved ?? '') ? (saved as AppView) : 'landing';
  });
  const t = translations[lang];
  const isRtl = lang === 'ar';
  /** API base: env override, else local Express in dev, else same origin (e.g. single Vercel project). */
  const backendUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_URL?.trim();
    if (fromEnv) return fromEnv.replace(/\/$/, '');
    if (import.meta.env.DEV) return 'http://127.0.0.1:3002';
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://127.0.0.1:3002';
  }, []);

  const [authToken, setAuthToken] = useState<string>(() => localStorage.getItem('burnaid_token') ?? '');
  const [authUser, setAuthUser] = useState<{ id: string; name: string; email: string; role?: 'admin' | 'user'; phone?: string; bloodType?: string; allergies?: string; medications?: string } | null>(null);
  const [authError, setAuthError] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileBloodType, setProfileBloodType] = useState('');
  const [profileAllergies, setProfileAllergies] = useState('');
  const [profileMedications, setProfileMedications] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [burnHistory, setBurnHistory] = useState<Array<{ id: string; burnType: string; confidence: number; description?: string; recommendations?: string[]; createdAt: string }>>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [selectedBurnResult, setSelectedBurnResult] = useState<null | { id: string; burnType: string; confidence: number; description?: string; recommendations?: string[]; createdAt: string }>(null);
  const [currentResult, setCurrentResult] = useState<CurrentAssessmentResult | null>(null);
  const [burnSaveMessage, setBurnSaveMessage] = useState('');
  const [burnSaveError, setBurnSaveError] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const skipNextScrollToTopRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAnalyzingRef = useRef(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentError, setAssessmentError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef('');
  const [prediction, setPrediction] = useState<BurnPrediction | null>(null);
  const [videoSettings, setVideoSettings] = useState<VideoSettings>(DEFAULT_VIDEO_SETTINGS);
  const [draftVideoSettings, setDraftVideoSettings] = useState<VideoSettings>(DEFAULT_VIDEO_SETTINGS);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isSelectedVideoPlaying, setIsSelectedVideoPlaying] = useState(false);
  const previousVideoLanguageRef = useRef(lang);
  const [videoSaveMsg, setVideoSaveMsg] = useState('');
  const howItWorksVideo = videoSettings.howItWorks[lang];
  const [howItWorksSaveMsg, setHowItWorksSaveMsg] = useState('');
  const [isHowItWorksPlaying, setIsHowItWorksPlaying] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isFindingFacility, setIsFindingFacility] = useState(false);
  const [facilityMode, setFacilityMode] = useState<FacilitySearchMode>('burn');
  const [facilityMapEmbedUrl, setFacilityMapEmbedUrl] = useState(
    'https://www.google.com/maps?q=burn%20center%20near%2030.0444%2C31.2357%20Egypt&ll=30.0444,31.2357&z=13&output=embed',
  );
  const [facilityStatus, setFacilityStatus] = useState(
    isRtl
      ? 'اضغط الزر للعثور على أقرب رعاية متخصصة بالقرب منك.'
      : 'Click the button to find the nearest specialized care near you.',
  );
  const [facilityStatusTone, setFacilityStatusTone] = useState<FacilityStatusTone>('neutral');
  const [facilityResults, setFacilityResults] = useState<FacilityResult[]>([]);
  const [facilityResultsMessage, setFacilityResultsMessage] = useState(
    isRtl
      ? 'اضغط بحث لعرض نتائج مكتوبة داخل الموقع.'
      : 'Use search to load written results inside the website.',
  );
  const lastLocationLookupRef = useRef<{ lat: number; lon: number; timestamp: number } | null>(null);
  const isFindingFacilityRef = useRef(false);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; name: string; email: string; phone?: string; bloodType?: string; createdAt: string; role: 'admin' | 'user' }>>([]);
  const [adminDatasets, setAdminDatasets] = useState<Array<{ id: string; name: string; description: string; imageCount: number; status: string; uploadedAt: string }>>([]);
  const [adminTab, setAdminTab] = useState<'videos' | 'users' | 'datasets'>('videos');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminAccessDenied, setAdminAccessDenied] = useState(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lon: number } | null>(null);
  const cairoCoords = { lat: 30.0444, lon: 31.2357 };

  const closeBlockingOverlays = () => {
    setIsEmergencyModalOpen(false);
    setIsChatbotOpen(false);
  };

  const completeAuth = (token: string, user: { id: string; name: string; email: string; role?: 'admin' | 'user'; phone?: string; bloodType?: string }) => {
    closeBlockingOverlays();
    setAuthToken(token);
    setAuthUser(user);
    setAuthError('');
    setView('account');
  };

  useEffect(() => {
    localStorage.setItem('burnaid_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('burnaid_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (view === 'account' || view === 'login' || view === 'register') {
      closeBlockingOverlays();
    }
  }, [view]);

  useEffect(() => {
    setFacilityStatus(
      isRtl
        ? 'اضغط الزر للعثور على أقرب رعاية متخصصة بالقرب منك.'
        : 'Click the button to find the nearest specialized care near you.',
    );
    setFacilityStatusTone('neutral');
    setFacilityResultsMessage(
      isRtl
        ? 'اضغط بحث لعرض نتائج مكتوبة داخل الموقع.'
        : 'Use search to load written results inside the website.',
    );
  }, [isRtl]);

  useEffect(() => {
    if (skipNextScrollToTopRef.current) {
      skipNextScrollToTopRef.current = false;
      return;
    }
    // When switching views from the top nav, start at top.
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    if (authToken) localStorage.setItem('burnaid_token', authToken);
    else localStorage.removeItem('burnaid_token');
  }, [authToken]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setAuthError('');
      if (!authToken) {
        setAuthUser(null);
        return;
      }
      try {
        const resp = await fetch(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!resp.ok) throw new Error('auth');
        const data = await resp.json();
        if (!cancelled) setAuthUser(data.user);
      } catch {
        if (!cancelled) {
          setAuthUser(null);
          setAuthToken('');
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [authToken, backendUrl]);

  useEffect(() => {
    if (authUser) {
      setProfileName(authUser.name);
      setProfileEmail(authUser.email);
      setProfilePhone(authUser.phone || '');
      setProfileBloodType(normalizeBloodType(authUser.bloodType));
      setProfileAllergies(authUser.allergies || '');
      setProfileMedications(authUser.medications || '');
    }
  }, [authUser]);

  useEffect(() => {
    const fetchBurnHistory = async () => {
      if (!authToken) return;
      setHistoryError('');
      setHistoryLoading(true);
      try {
        const resp = await fetch(`${backendUrl}/api/burn-results`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!resp.ok) throw new Error('Failed to load burn history');
        const data = await resp.json();
        const sortedBurnHistory = (data.burnResults || []).slice().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBurnHistory(sortedBurnHistory);
      } catch (error) {
        setHistoryError((error as Error).message || 'Unable to load burn history');
      } finally {
        setHistoryLoading(false);
      }
    };

    if (authUser && view === 'account') {
      fetchBurnHistory();
    }
  }, [authUser, authToken, backendUrl, view]);

  const saveProfile = async () => {
    if (!authToken) return;
    setProfileStatus('');
    if (profilePhone && !EGYPTIAN_PHONE_PATTERN.test(profilePhone)) {
      setProfileStatus(isRtl ? 'رقم الهاتف يجب أن يكون 11 رقمًا ويبدأ بـ 01' : 'Phone number must be 11 digits and start with 01');
      return;
    }
    if (profileBloodType && !normalizeBloodType(profileBloodType)) {
      setProfileStatus(isRtl ? 'اختر فصيلة دم صحيحة' : 'Select a valid blood type');
      return;
    }
    setProfileLoading(true);
    try {
      const resp = await fetch(`${backendUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          name: profileName, 
          email: profileEmail,
          phone: profilePhone || undefined,
          bloodType: profileBloodType || undefined,
          allergies: profileAllergies || undefined,
          medications: profileMedications || undefined,
        }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || body?.message || 'Unable to update profile');
      }
      const data = await resp.json();
      setAuthUser(data.user);
      setProfileStatus('Profile updated successfully.');
    } catch (error) {
      setProfileStatus((error as Error).message || 'Unable to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchBurnResultById = async (id: string) => {
    if (!authToken) return;
    try {
      const resp = await fetch(`${backendUrl}/api/burn-results/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!resp.ok) throw new Error('Unable to load result details');
      const data = await resp.json();
      setSelectedBurnResult(data.burnResult || null);
    } catch (error) {
      setHistoryError((error as Error).message || 'Unable to load result details');
    }
  };

  const deleteBurnResult = async (id: string) => {
    if (!authToken) return;
    setHistoryError('');
    try {
      const resp = await fetch(`${backendUrl}/api/burn-results/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!resp.ok) throw new Error('Unable to delete result');
      setBurnHistory((prev) => prev.filter((item) => item.id !== id));
      if (selectedBurnResult?.id === id) setSelectedBurnResult(null);
    } catch (error) {
      setHistoryError((error as Error).message || 'Unable to delete result');
    }
  };

  const getEmergencyLevel = (burnType: string) => {
    if (burnType.includes('3rd') || burnType.includes('Third')) {
      return { level: 'emergencyNow', reason: 'Third-degree burns require immediate professional care.', action: 'Call emergency services immediately.' };
    }
    if (burnType.includes('2nd') || burnType.includes('Second')) {
      return { level: 'seeDoctor', reason: 'Second-degree burns may need medical evaluation.', action: 'See a doctor within 24 hours.' };
    }
    return { level: 'homeCare', reason: 'First-degree burns can usually be treated at home.', action: 'Follow first-aid guidelines and monitor for complications.' };
  };

  const saveBurnResult = async (
    prediction: { label: string; confidence: number; apiDescription?: string; apiRecommendations?: string[] },
    visiblePreviewUrl: string,
  ) => {
    if (!authToken) return;
    setBurnSaveMessage('');
    setBurnSaveError('');
    try {
      const payload = {
        burnType: prediction.label,
        confidence: prediction.confidence,
        description: prediction.apiDescription || getPredictionText(prediction.label, 'en').description,
        recommendations: prediction.apiRecommendations && prediction.apiRecommendations.length > 0
          ? prediction.apiRecommendations
          : getPredictionText(prediction.label, 'en').recommendations,
      };
      const resp = await fetch(`${backendUrl}/api/burn-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.message || 'Unable to save burn result');
      }
      const data = await resp.json();
      console.log('SAVING HISTORY DONE - DO NOT RESET UI');
      setBurnSaveMessage(isRtl ? 'تم حفظ نتيجة التقييم في السجل.' : 'Assessment saved to history.');
      setBurnHistory((prev) => [data.burnResult, ...prev]);
      console.log('history saved, preview still:', visiblePreviewUrl);
    } catch (error) {
      console.error('History save failed but UI stays visible:', error);
      setBurnSaveError(
        `Result displayed locally, but could not be saved to history. ${(error as Error).message || ''}`.trim()
      );
    }
  };

  const clearLatestResult = () => {
    localStorage.removeItem('burnaid_latest_result');
  };

  const clearAssessmentSessionState = () => {
    console.log('RESET/CLEAR FUNCTION CALLED', 'clearAssessmentSessionState');
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    isAnalyzingRef.current = false;
    setIsAnalyzing(false);
    setAssessmentError('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setCurrentResult(null);
    setBurnSaveMessage('');
    setBurnSaveError('');
    setSelectedBurnResult(null);
    setBurnHistory([]);
    setHistoryError('');
    setHistoryLoading(false);
    setIsChatbotOpen(false);
    clearLatestResult();
    localStorage.removeItem('burnaid_currentAssessment');
    localStorage.removeItem('burnaid_assessmentResult');
    localStorage.removeItem('burnaid_selectedImage');
    localStorage.removeItem('burnaid_imagePreview');
    sessionStorage.removeItem('burnaid_currentAssessment');
    sessionStorage.removeItem('burnaid_assessmentResult');
    sessionStorage.removeItem('burnaid_selectedImage');
    sessionStorage.removeItem('burnaid_imagePreview');
  };

  const normalizeVideo = (video: any, fallback: ManagedVideo): ManagedVideo => ({
    id: typeof video?.id === 'string' ? video.id : fallback.id,
    title: typeof video?.title === 'string' && video.title.trim() ? video.title : fallback.title,
    duration: typeof video?.duration === 'string' && video.duration.trim()
      ? video.duration
      : typeof video?.sub === 'string' && video.sub.trim()
        ? video.sub
        : fallback.duration || fallback.sub || '',
    thumbnail: typeof video?.thumbnail === 'string' && video.thumbnail.trim() ? video.thumbnail : fallback.thumbnail,
    youtubeUrl: typeof video?.youtubeUrl === 'string' && video.youtubeUrl.trim()
      ? video.youtubeUrl
      : typeof video?.videoUrl === 'string'
        ? video.videoUrl
        : fallback.youtubeUrl || fallback.videoUrl || '',
  });

  const normalizeVideoList = (videos: any, fallback: ManagedVideo[]) => {
    const source = Array.isArray(videos) && videos.length > 0 ? videos : fallback;
    return source.map((video, index) => normalizeVideo(video, fallback[index] || fallback[0]));
  };

  const normalizeHowItWorks = (video: any, fallback: HowItWorksVideoConfig): HowItWorksVideoConfig => ({
    thumbnail: typeof video?.thumbnail === 'string' && video.thumbnail.trim() ? video.thumbnail : fallback.thumbnail,
    youtubeUrl: typeof video?.youtubeUrl === 'string' && video.youtubeUrl.trim()
      ? video.youtubeUrl
      : typeof video?.videoUrl === 'string'
        ? video.videoUrl
        : fallback.youtubeUrl || fallback.videoUrl || '',
  });

  const normalizeVideoSettings = (raw: any): VideoSettings => {
    const legacyVideos = Array.isArray(raw?.videos) ? raw.videos : undefined;
    const legacyHowItWorks = raw?.video || raw?.howItWorksVideo;
    return {
      enVideos: normalizeVideoList(raw?.enVideos || raw?.en?.videos || legacyVideos, DEFAULT_MANAGED_VIDEOS),
      arVideos: normalizeVideoList(raw?.arVideos || raw?.ar?.videos, DEFAULT_AR_MANAGED_VIDEOS),
      howItWorks: {
        en: normalizeHowItWorks(raw?.howItWorks?.en || legacyHowItWorks, DEFAULT_HOW_IT_WORKS_VIDEO),
        ar: normalizeHowItWorks(raw?.howItWorks?.ar || legacyHowItWorks, DEFAULT_HOW_IT_WORKS_VIDEO),
      },
    };
  };

  useEffect(() => {
    console.log('ASSESSMENT STATE CHANGED:', {
      selectedFile: selectedFile?.name ?? null,
      previewUrl,
      hasResult: Boolean(currentResult),
      isAnalyzing,
      isLoggedIn: Boolean(authToken),
    });
  }, [selectedFile, previewUrl, currentResult, isAnalyzing, authToken]);

  useEffect(() => {
    const raw = localStorage.getItem('burnaid_video_settings');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const normalized = normalizeVideoSettings(parsed);
      setVideoSettings(normalized);
      setDraftVideoSettings(normalized);
    } catch {
      // ignore corrupted local data and keep defaults
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadVideos = async () => {
      try {
        const resp = await fetch(`${backendUrl}/api/videos`);
        if (!resp.ok) return;
        const data = await resp.json();
        const settings = normalizeVideoSettings(data);
        if (!cancelled) {
          setVideoSettings(settings);
          setDraftVideoSettings(settings);
          localStorage.setItem('burnaid_video_settings', JSON.stringify(settings));
        }
      } catch {
        // Keep the locally cached/default videos if the backend is unavailable.
      }
    };
    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [backendUrl]);

  useEffect(() => {
    const currentVideos = lang === 'ar' ? videoSettings.arVideos : videoSettings.enVideos;
    setIsSelectedVideoPlaying(false);
    if (previousVideoLanguageRef.current !== lang) {
      previousVideoLanguageRef.current = lang;
      setSelectedVideoIndex(0);
      return;
    }
    if (selectedVideoIndex >= currentVideos.length) {
      setSelectedVideoIndex(Math.max(0, currentVideos.length - 1));
      setIsSelectedVideoPlaying(false);
    }
  }, [lang, selectedVideoIndex, videoSettings.arVideos, videoSettings.enVideos]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const getPredictionText = (label: string, language: 'en' | 'ar') => {
    const normalized = label.toLowerCase();
    const isArabic = language === 'ar';
    const ar = {
      title: "نتيجة التقييم",
      unknown: "لم نتمكن من تحديد درجة الحرق بدقة.",
      byClass: {
        first: {
          label: "حرق درجة أولى",
          description: "حرق سطحي غالبا يسبب احمرارا وألما خفيفا بدون فقدان عميق للجلد.",
          care: [
            "برّد المنطقة بمياه جارية فاترة لمدة 20 دقيقة.",
            "انزع أي خواتم أو إكسسوارات ضاغطة من المنطقة المصابة.",
            "استخدم مرطبا لطيفا أو ضمادة غير لاصقة، وراقب التحسن خلال 24-48 ساعة.",
          ],
        },
        second: {
          label: "حرق درجة ثانية",
          description: "حرق أعمق نسبيا وقد يسبب فقاعات وألما واضحا، ويحتاج عناية أدق.",
          care: [
            "برّد الحرق فورا بمياه جارية فاترة لمدة 20 دقيقة.",
            "لا تفقع الفقاعات نهائيا، وغطِّ المكان بضمادة معقمة غير لاصقة.",
            "توجّه للطوارئ إذا المساحة كبيرة أو الحرق في الوجه أو اليد أو القدم أو الأعضاء الحساسة.",
          ],
        },
        third: {
          label: "حرق درجة ثالثة",
          description: "حرق شديد وعميق، ويُعد حالة طبية طارئة تحتاج تدخلا فوريا.",
          care: [
            "اتصل بالطوارئ فورا.",
            "غطِّ المكان بقطعة قماش نظيفة وجافة فقط.",
            "لا تضع ماء أو ثلج أو كريمات، ولا تنزع الملابس الملتصقة بالجلد.",
          ],
        },
      },
    };
    const en = {
      title: "Assessment Result",
      unknown: "Unable to confidently classify this burn image.",
      byClass: {
        first: {
          label: "1st Degree Burn",
          description: "Usually superficial with redness and mild pain.",
          care: [
            "Cool under running water for 20 minutes.",
            "Remove rings or tight items near the burned area.",
            "Use a light moisturizer or non-stick dressing and monitor symptoms.",
          ],
        },
        second: {
          label: "2nd Degree Burn",
          description: "May include blisters and moderate to severe pain.",
          care: [
            "Cool under running water for 20 minutes.",
            "Do not break blisters and cover with a sterile non-stick dressing.",
            "Go to urgent care if large or on face, hands, feet, or genitals.",
          ],
        },
        third: {
          label: "3rd Degree Burn",
          description: "Medical emergency requiring immediate professional care.",
          care: [
            "Call emergency services immediately.",
            "Cover with a clean dry cloth only.",
            "Do not apply water, ice, creams, or remove stuck clothing.",
          ],
        },
      },
    };

    const copy = isArabic ? ar : en;
    if (normalized.includes('1st') || normalized.includes('first')) {
      return {
        title: copy.title,
        localizedLabel: copy.byClass.first.label,
        description: copy.byClass.first.description,
        recommendations: copy.byClass.first.care,
      };
    }
    if (normalized.includes('2nd') || normalized.includes('second')) {
      return {
        title: copy.title,
        localizedLabel: copy.byClass.second.label,
        description: copy.byClass.second.description,
        recommendations: copy.byClass.second.care,
      };
    }
    if (normalized.includes('3rd') || normalized.includes('third')) {
      return {
        title: copy.title,
        localizedLabel: copy.byClass.third.label,
        description: copy.byClass.third.description,
        recommendations: copy.byClass.third.care,
      };
    }
    return {
      title: copy.title,
      localizedLabel: isArabic ? 'درجة الحرق غير واضحة' : 'Unclear burn degree',
      description: copy.unknown,
      recommendations: isArabic
        ? [
            "صوّر الحرق بإضاءة طبيعية ومن مسافة قريبة وواضحة.",
            "تأكد من ظهور كامل المنطقة المصابة.",
            "إذا الألم شديد أو الحالة تتدهور، توجّه للطوارئ مباشرة.",
          ]
        : [
            "Retake the image in clear natural lighting.",
            "Make sure the full burn area is visible and in focus.",
            "If severe pain or worsening symptoms exist, seek emergency care immediately.",
          ],
    };
  };

  const handlePickImage = () => {
    if (isAnalyzingRef.current) return;
    fileInputRef.current?.click();
  };

  const clearVisibleAssessment = () => {
    console.log('RESET/CLEAR FUNCTION CALLED', 'clearVisibleAssessment');
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    isAnalyzingRef.current = false;
    setIsAnalyzing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setCurrentResult(null);
    setAssessmentError('');
    setBurnSaveMessage('');
    setBurnSaveError('');
    clearLatestResult();
    localStorage.removeItem('burnaid_currentAssessment');
    localStorage.removeItem('burnaid_assessmentResult');
    localStorage.removeItem('burnaid_selectedImage');
    localStorage.removeItem('burnaid_imagePreview');
    sessionStorage.removeItem('burnaid_currentAssessment');
    sessionStorage.removeItem('burnaid_assessmentResult');
    sessionStorage.removeItem('burnaid_selectedImage');
    sessionStorage.removeItem('burnaid_imagePreview');
  };

  const handleAnalyzeAnother = () => {
    console.log('analyze another clicked');
    console.log('RESET/CLEAR FUNCTION CALLED', 'handleAnalyzeAnother');
    clearVisibleAssessment();
  };

  const handleAnalyze = async (activeFile: File, activePreviewUrl: string) => {
    if (!activeFile || !activePreviewUrl) return;
    setIsAnalyzing(true);
    isAnalyzingRef.current = true;

    try {
      console.log('BEFORE ANALYZE:', {
        isLoggedIn: Boolean(authToken),
        selectedFile: activeFile,
        previewUrl: activePreviewUrl,
      });
      const formData = new FormData();
      formData.append('file', activeFile);

      const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
      const baseUrl = viteEnv?.VITE_BURN_MODEL_API || 'http://127.0.0.1:8000';
      const response = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('PREDICTION RESPONSE:', data);

      const rawLabel = data?.prediction ?? data?.predicted_class ?? data?.class ?? data?.label ?? data?.burnType ?? data?.severity ?? 'Unknown';
      const normalizedLabel = typeof rawLabel === 'string' ? rawLabel : String(rawLabel ?? 'Unknown');
      const rawConfidence = data?.confidence ?? data?.probability ?? 0;
      const confidence = Number(rawConfidence ?? 0) || 0;

      const predictionData = {
        label: normalizedLabel,
        confidence,
        apiDescription: typeof data?.description === 'string' ? data.description : undefined,
        apiRecommendations: Array.isArray(data?.recommendations) ? data.recommendations : undefined,
      };

      const resultData = {
        burnType: normalizedLabel,
        confidence,
        description: predictionData.apiDescription || getPredictionText(normalizedLabel, 'en').description,
        recommendations: predictionData.apiRecommendations && predictionData.apiRecommendations.length > 0
          ? predictionData.apiRecommendations
          : getPredictionText(normalizedLabel, 'en').recommendations,
        createdAt: new Date().toISOString(),
      };

      console.log('SETTING RESULT NOW');
      setPrediction(predictionData);
      setCurrentResult(resultData);
      console.log('STATE SHOULD SHOW:', {
        previewUrl: activePreviewUrl,
        prediction: resultData,
      });

      if (authToken) {
        console.log('SAVING HISTORY START');
        saveBurnResult(predictionData, activePreviewUrl).catch((saveError) => {
          console.error('History save failed but UI must stay visible:', saveError);
        });
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setAssessmentError(isRtl ? 'فشل الاتصال بخدمة تحليل الحروق. تأكد أن سيرفر الموديل شغال.' : 'Failed to connect to burn model service. Make sure the model API is running.');
    } finally {
      setIsAnalyzing(false);
      isAnalyzingRef.current = false;
    }
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) {
      input.value = '';
      return;
    }

    if (isAnalyzingRef.current) {
      input.value = '';
      return;
    }

    setAssessmentError('');
    setPrediction(null);
    setCurrentResult(null);
    setBurnSaveMessage('');
    setBurnSaveError('');
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    console.log('SELECTED FILE:', file);
    console.log('PREVIEW URL CREATED:', nextPreviewUrl);
    input.value = '';
    void handleAnalyze(file, nextPreviewUrl);
  };

  const handleDraftVideoChange = (language: 'en' | 'ar', index: number, field: keyof ManagedVideo, value: string) => {
    const key = language === 'ar' ? 'arVideos' : 'enVideos';
    setDraftVideoSettings((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleDraftHowItWorksChange = (language: 'en' | 'ar', field: keyof HowItWorksVideoConfig, value: string) => {
    setDraftVideoSettings((prev) => ({
      ...prev,
      howItWorks: {
        ...prev.howItWorks,
        [language]: {
          ...prev.howItWorks[language],
          [field]: value,
        },
      },
    }));
  };

  const saveVideoSettings = async () => {
    if (!authToken || authUser?.role !== 'admin') {
      setVideoSaveMsg(isRtl ? 'خطأ: ليس لديك صلاحيات كافية' : 'Error: Insufficient permissions');
      setTimeout(() => setVideoSaveMsg(''), 2200);
      return;
    }
    setVideoSaveMsg(isRtl ? 'جاري الحفظ...' : 'Saving...');
    try {
      const payload = normalizeVideoSettings(draftVideoSettings);
      const resp = await fetch(`${backendUrl}/api/admin/video-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Failed to save videos: ${resp.statusText}`);
      const nextSettings = normalizeVideoSettings(data);
      setVideoSettings(nextSettings);
      setDraftVideoSettings(nextSettings);
      localStorage.setItem('burnaid_video_settings', JSON.stringify(nextSettings));
      const activeVideos = lang === 'ar' ? nextSettings.arVideos : nextSettings.enVideos;
      setSelectedVideoIndex((index) => Math.min(index, Math.max(0, activeVideos.length - 1)));
      setIsSelectedVideoPlaying(false);
      setVideoSaveMsg(isRtl ? 'تم حفظ الفيديوهات بنجاح.' : 'Videos saved successfully.');
      setTimeout(() => setVideoSaveMsg(''), 2200);
    } catch (error) {
      setVideoSaveMsg((error as Error).message || (isRtl ? 'فشل الحفظ' : 'Save failed'));
      setTimeout(() => setVideoSaveMsg(''), 3000);
    }
  };

  const saveHowItWorksVideoSettings = async () => {
    setHowItWorksSaveMsg(isRtl ? 'Saved.' : 'Saved.');
    await saveVideoSettings();
    setIsHowItWorksPlaying(false);
    setTimeout(() => setHowItWorksSaveMsg(''), 2200);
  };

  const fetchAdminUsers = async () => {
    setAdminLoading(true);
    setAdminError('');
    try {
      const resp = await fetch(`${backendUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Failed to fetch users (${resp.status})`);
      setAdminUsers(data.users);
    } catch (e: any) {
      setAdminError(e?.message || 'Error loading users');
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchAdminDatasets = async () => {
    setAdminLoading(true);
    setAdminError('');
    try {
      const resp = await fetch(`${backendUrl}/api/admin/datasets`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Failed to fetch datasets (${resp.status})`);
      setAdminDatasets(data.datasets);
    } catch (e: any) {
      setAdminError(e?.message || 'Error loading datasets');
    } finally {
      setAdminLoading(false);
    }
  };

  const deleteAdminUser = async (userId: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) return;
    try {
      const resp = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Failed to delete user (${resp.status})`);
      await fetchAdminUsers();
      setAdminError('');
    } catch (e: any) {
      setAdminError(e?.message || 'Error deleting user');
    }
  };

  const deleteAdminDataset = async (datasetId: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا المجموعة؟' : 'Are you sure you want to delete this dataset?')) return;
    try {
      const resp = await fetch(`${backendUrl}/api/admin/datasets/${datasetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Failed to delete dataset (${resp.status})`);
      await fetchAdminDatasets();
      setAdminError('');
    } catch (e: any) {
      setAdminError(e?.message || 'Error deleting dataset');
    }
  };

  const getEmbedUrl = (url: string, autoplay = false) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      const suffix = autoplay ? '?autoplay=1' : '';
      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id ? `https://www.youtube.com/embed/${id}${suffix}` : '';
      }
      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
        if (parsed.pathname === '/watch') {
          const id = parsed.searchParams.get('v');
          return id ? `https://www.youtube.com/embed/${id}${suffix}` : '';
        }
        if (parsed.pathname.startsWith('/shorts/')) {
          const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
          return id ? `https://www.youtube.com/embed/${id}${suffix}` : '';
        }
        if (parsed.pathname.startsWith('/embed/')) {
          const id = parsed.pathname.split('/embed/')[1]?.split('/')[0];
          return id ? `https://www.youtube.com/embed/${id}${suffix}` : '';
        }
      }
      return '';
    } catch {
      return '';
    }
  };

  const isDirectVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  const emergencyNumber = '123';
  const emergencyScript = isRtl
    ? `مرحباً، أنا أبلغ عن حالة حرق.
المصاب عمره: [اكتب العمر]
مكان الإصابة: [اكتب العنوان بالتفصيل]
درجة الوعي والتنفس: [واعي/غير واعي - يتنفس/لا يتنفس]
نوع الحرق الظاهر: [حراري/كيميائي/كهربائي]
المساحة التقريبية: [صغيرة/متوسطة/كبيرة]
نحتاج إسعاف بشكل عاجل.`
    : `Hello, I am reporting a burn emergency.
Patient age: [enter age]
Location: [full address]
Consciousness and breathing: [conscious/unconscious - breathing/not breathing]
Burn type: [thermal/chemical/electrical]
Approximate area: [small/medium/large]
We need an ambulance urgently.`;

  const copyEmergencyScript = async () => {
    try {
      await navigator.clipboard.writeText(emergencyScript);
    } catch {
      // clipboard API may be unavailable in some browsers
    }
  };

  const getFacilitySearchMeta = (mode: FacilitySearchMode) => {
    if (mode === 'emergency') {
      return {
        query: 'emergency+hospital',
        fallbackQuery: 'emergency+hospital',
        buttonText: isRtl ? 'ابحث عن أقرب مستشفى طوارئ' : 'Find nearest emergency hospital',
        searchingText: isRtl
          ? 'جاري البحث عن أقرب مستشفى طوارئ بالقرب من موقعك...'
          : 'Searching nearest Emergency Hospital near your location...',
      };
    }
    if (mode === 'both') {
      return {
        query: 'burn+center+emergency+hospital',
        fallbackQuery: 'burn+center+emergency+hospital',
        buttonText: isRtl ? 'ابحث عن أقرب طوارئ + رعاية حروق' : 'Find nearest emergency + burn care',
        searchingText: isRtl
          ? 'جاري البحث عن أقرب طوارئ + رعاية حروق بالقرب من موقعك...'
          : 'Searching nearest Emergency + Burn Care near your location...',
      };
    }
    return {
      query: 'burn+center',
      fallbackQuery: 'burn+center',
      buttonText: isRtl ? 'ابحث عن أقرب مركز حروق' : 'Find nearest burn center',
      searchingText: isRtl
        ? 'جاري البحث عن أقرب مركز حروق بالقرب من موقعك...'
        : 'Searching nearest Burn Center near your location...',
    };
  };

  const buildGoogleMapsUrls = (mode: FacilitySearchMode, coords?: { lat: number; lon: number }) => {
    const { query } = getFacilitySearchMeta(mode);
    const plainQuery = query.replace(/\+/g, ' ');
    const activeCoords = coords ?? cairoCoords;
    const location = `${activeCoords.lat},${activeCoords.lon}`;
    const searchQuery = `${plainQuery} near ${location} Egypt`;
    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&ll=${activeCoords.lat},${activeCoords.lon}&z=13&output=embed`;
    const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchQuery)}`;
    console.log('Generated Google Maps URLs:', { embedUrl, externalUrl, directionsUrl, searchQuery });
    return {
      embedUrl,
      externalUrl,
      directionsUrl,
      searchQuery,
    };
  };

  const openGoogleMapsSearch = (modeOverride?: FacilitySearchMode) => {
    const mode = modeOverride ?? facilityMode;
    const { externalUrl } = buildGoogleMapsUrls(mode, lastCoords ?? undefined);
    console.log('Opening Google Maps URL:', externalUrl);
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
    setFacilityStatusTone('success');
    setFacilityStatus(
      isRtl
        ? 'تم فتح نتائج البحث في خرائط Google.'
        : 'Opened Google Maps search results for the selected care type.',
    );
  };

  const requestUserLocation = () =>
    new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('UNSUPPORTED'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 300000 },
      );
    });

  const isGeoErrorWithCode = (value: unknown): value is GeolocationPositionError =>
    typeof value === 'object' && value !== null && 'code' in value;

  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getFallbackFacilityResults = (mode: FacilitySearchMode, lat: number, lon: number) => {
    const matchingFacilities = EGYPT_FALLBACK_FACILITIES.filter((facility) => {
      if (mode === 'burn') return facility.category.toLowerCase().includes('burn');
      if (mode === 'emergency') return facility.category.toLowerCase().includes('emergency');
      return true;
    });
    const source = matchingFacilities.length ? matchingFacilities : EGYPT_FALLBACK_FACILITIES;
    return source
      .map((facility) => ({
        ...facility,
        distanceKm: haversineKm(lat, lon, facility.lat, facility.lon),
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${facility.name} ${facility.lat},${facility.lon}`,
        )}`,
      }))
      .sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER));
  };

  const getFacilityDisplayName = (facility: FacilityResult) =>
    isRtl ? facility.arName || facility.name : facility.name;

  const getFacilityDisplayAddress = (facility: FacilityResult) =>
    isRtl ? facility.arAddress || facility.address : facility.address;

  const formatDistanceLabel = (distanceKm?: number) => {
    if (distanceKm == null) return isRtl ? 'غير متاح' : 'Not available';
    if (distanceKm < 1) return isRtl ? `يبعد ${Math.round(distanceKm * 1000)} متر` : `${Math.round(distanceKm * 1000)} m away`;
    return isRtl ? `يبعد ${distanceKm.toFixed(1)} كم` : `${distanceKm.toFixed(1)} km away`;
  };

  const isInsideEgypt = ({ lat, lon }: { lat: number; lon: number }) =>
    lat >= 21.5 && lat <= 31.8 && lon >= 24.5 && lon <= 36.9;

  const buildFacilityResultDirectionsUrl = (result: FacilityResult) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${result.lat},${result.lon}`)}`;

  const buildFacilityResultMapEmbedUrl = (result: FacilityResult) =>
    `https://www.google.com/maps?q=${encodeURIComponent(`${result.name} near ${result.lat},${result.lon} Egypt`)}&ll=${result.lat},${result.lon}&z=15&output=embed`;


  const buildFacilityOverpassQuery = (mode: FacilitySearchMode, latitude: number, longitude: number, radius: number) => {
    const burnSearch = `
      node(area.egypt)(around:${radius},${latitude},${longitude})["healthcare:speciality"~"burn|burns",i];
      way(area.egypt)(around:${radius},${latitude},${longitude})["healthcare:speciality"~"burn|burns",i];
      node(area.egypt)(around:${radius},${latitude},${longitude})["name"~"burn|burns|حروق",i];
      way(area.egypt)(around:${radius},${latitude},${longitude})["name"~"burn|burns|حروق",i];
    `;
    const emergencySearch = `
      node(area.egypt)(around:${radius},${latitude},${longitude})["amenity"="hospital"];
      way(area.egypt)(around:${radius},${latitude},${longitude})["amenity"="hospital"];
      node(area.egypt)(around:${radius},${latitude},${longitude})["healthcare"="hospital"];
      way(area.egypt)(around:${radius},${latitude},${longitude})["healthcare"="hospital"];
      node(area.egypt)(around:${radius},${latitude},${longitude})["emergency"="yes"];
      way(area.egypt)(around:${radius},${latitude},${longitude})["emergency"="yes"];
      node(area.egypt)(around:${radius},${latitude},${longitude})["name"~"emergency|trauma|طوارئ",i];
      way(area.egypt)(around:${radius},${latitude},${longitude})["name"~"emergency|trauma|طوارئ",i];
    `;
    const search = mode === 'burn' ? burnSearch : mode === 'emergency' ? emergencySearch : `${burnSearch}\n${emergencySearch}`;
    return `[out:json][timeout:15];
      area["ISO3166-1"="EG"][admin_level=2]->.egypt;
      (
        ${search}
      );
      out center tags;`;
  };
  const normalizeFacilityCategory = (tags: Record<string, string>, mode: FacilitySearchMode) => {
    const name = (tags.name || '').toLowerCase();
    const speciality = (tags['healthcare:speciality'] || '').toLowerCase();
    const emergency = (tags.emergency || '').toLowerCase();
    const amenity = (tags.amenity || '').toLowerCase();
    const healthcare = (tags.healthcare || '').toLowerCase();

    const isBurn =
      name.includes('burn') || name.includes('حروق') || speciality.includes('burn') || speciality.includes('حروق');
    const isEmergency =
      emergency === 'yes' || name.includes('emergency') || name.includes('trauma') || name.includes('طوارئ');
    const isHospitalLike = amenity.includes('hospital') || healthcare.includes('hospital');

    if (mode === 'burn') return isBurn;
    if (mode === 'emergency') return isEmergency || isHospitalLike;
    return isBurn || isEmergency || isHospitalLike;
  };

  const formatFacilityAddress = (tags: Record<string, string>) => {
    const addressParts = [
      [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ').trim(),
      tags['addr:city'],
      tags['addr:state'],
      tags['addr:country'],
    ].filter(Boolean);
    return addressParts.join(', ');
  };

  const normalizeAdminName = (value?: string) =>
    (value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

  const extractAdminArea = (address: Record<string, string> | undefined): FacilityAdminArea => {
    if (!address) return {};
    return {
      city: address.city || address.town || address.village || address.municipality || address.county,
      state: address.state || address.region || address.province,
      governorate: address.governorate || address.state_district || address.county,
    };
  };

  const sameAdminArea = (userArea: FacilityAdminArea, placeArea: FacilityAdminArea) => {
    const userCity = normalizeAdminName(userArea.city);
    const userState = normalizeAdminName(userArea.state);
    const userGov = normalizeAdminName(userArea.governorate);
    const placeCity = normalizeAdminName(placeArea.city);
    const placeState = normalizeAdminName(placeArea.state);
    const placeGov = normalizeAdminName(placeArea.governorate);

    const cityMatch = userCity && placeCity && userCity === placeCity;
    const govMatch = userGov && placeGov && userGov === placeGov;
    const stateMatch = userState && placeState && userState === placeState;
    return Boolean(cityMatch || govMatch || stateMatch);
  };

  const reverseGeocodeAdminArea = async (lat: number, lon: number): Promise<FacilityAdminArea | null> => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat,
    )}&lon=${encodeURIComponent(lon)}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return extractAdminArea(data?.address);
  };

  const fetchOverpassElements = async (query: string): Promise<any[]> => {
    const endpoints = [
      `${backendUrl}/api/overpass`,
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.nchc.org.tw/api/interpreter',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            Accept: 'application/json',
          },
          body: query,
          signal: AbortSignal.timeout(16000),
        });
        if (!response.ok) continue;
        const data = await response.json();
        const elements = Array.isArray(data?.elements) ? data.elements : [];
        return elements;
      } catch {
        // try next endpoint
      }
    }
    throw new Error('Search source unavailable');
  };

  const fetchWrittenFacilityResults = async (mode: FacilitySearchMode, lat: number, lon: number) => {
    const requestResults = async () => {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lon),
        type: mode,
      });
      const response = await fetch(`${backendUrl}/api/places/nearby?${params.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(22000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('Nearby places request failed', {
          status: response.status,
          body: data,
        });
        throw new Error(data?.error || `Nearby search failed (${response.status})`);
      }
      return Array.isArray(data) ? (data as FacilityResult[]) : [];
    };

    try {
      return await requestResults();
    } catch (error) {
      console.warn('Nearby written result search failed, retrying once:', error);
      return await requestResults();
    }
  };
  const findNearestFacility = async (modeOverride?: FacilitySearchMode) => {
    if (isFindingFacilityRef.current) return;
    isFindingFacilityRef.current = true;
    const mode = modeOverride ?? facilityMode;
    const { searchingText } = getFacilitySearchMeta(mode);
    setFacilityStatusTone('neutral');
    setFacilityStatus(searchingText);
    setIsFindingFacility(true);
    setFacilityResults([]);
    setFacilityResultsMessage(isRtl ? 'جارٍ تحميل النتائج المكتوبة...' : 'Loading written results...');

    let coords: { lat: number; lon: number } = cairoCoords;
    try {
      const now = Date.now();
      const cached = lastLocationLookupRef.current;
      coords =
        cached && now - cached.timestamp < 60000
          ? { lat: cached.lat, lon: cached.lon }
          : await requestUserLocation();
      lastLocationLookupRef.current = { lat: coords.lat, lon: coords.lon, timestamp: now };
      setLastCoords(coords);
      if (!isInsideEgypt(coords)) {
        throw new Error('OUTSIDE_EGYPT');
      }
      const { embedUrl } = buildGoogleMapsUrls(mode, coords);
      setFacilityMapEmbedUrl(embedUrl);
      setFacilityResults([]);
      setFacilityResultsMessage('');
    } catch (error) {
      coords = cairoCoords;
      const fallbackCoords = coords;
      const { embedUrl } = buildGoogleMapsUrls(mode, fallbackCoords);
      setLastCoords(fallbackCoords);
      setFacilityMapEmbedUrl(embedUrl);
      setFacilityResults([]);
      setFacilityResultsMessage('');
      setFacilityStatusTone('neutral');
      if (isGeoErrorWithCode(error) && error.code === 1) {
        setFacilityStatus(
          isRtl
            ? 'تم رفض إذن الموقع. يمكنك الاستمرار والبحث يدويًا.'
            : 'Location permission was denied. Using Cairo, Egypt as a fallback.',
        );
      } else if (isGeoErrorWithCode(error) && error.code === 3) {
        setFacilityStatus(
          isRtl
            ? 'انتهت مهلة طلب الموقع. حاول مرة أخرى أو افتح خرائط Google.'
            : 'Location request timed out. Using Cairo, Egypt as a fallback.',
        );
      } else if (isGeoErrorWithCode(error) && error.code === 2) {
        setFacilityStatus(
          isRtl
            ? 'تعذر الحصول على موقعك حالياً. تأكد من تشغيل خدمات الموقع وحاول مرة أخرى.'
            : 'Unable to get your location right now. Using Cairo, Egypt as a fallback.',
        );
      } else if ((error as Error).message === 'OUTSIDE_EGYPT') {
        setFacilityStatus(
          isRtl ? 'هذه الميزة تبحث فقط داخل مصر. موقعك الحالي خارج نطاق البحث.' : 'This search is limited to Egypt. Using Cairo, Egypt as a fallback.',
        );
      } else if ((error as Error).message === 'UNSUPPORTED') {
        setFacilityStatus(
          isRtl ? 'المتصفح لا يدعم تحديد الموقع الجغرافي.' : 'Geolocation is not supported by this browser. Using Cairo, Egypt as a fallback.',
        );
      } else {
        setFacilityStatus(
          isRtl ? 'تعذر تحديد الموقع حالياً. يمكنك المتابعة بالبحث اليدوي.' : 'Unable to detect location right now. Using Cairo, Egypt as a fallback.',
        );
      }
      console.warn('Using Cairo fallback for nearest care search:', error);
    }

    try {
      let results = await fetchWrittenFacilityResults(mode, coords.lat, coords.lon);
      if (!results.length && mode === 'burn') {
        results = await fetchWrittenFacilityResults('emergency', coords.lat, coords.lon);
      }
      const nearest = results[0];
      setFacilityResults(nearest ? [nearest] : []);
      if (nearest) {
        setFacilityMapEmbedUrl(buildFacilityResultMapEmbedUrl(nearest));
      }
      setFacilityResultsMessage(
        nearest
          ? ''
          : isRtl
            ? 'لم يتم العثور على نتائج مكتوبة داخل نفس المدينة/المحافظة/الولاية من المصدر المجاني. افتح خرائط Google لعرض أماكن أكثر.'
            : 'No nearby written results were found. You can still use the map.',
      );
      setFacilityStatusTone('success');
      setFacilityStatus(
        nearest
          ? isRtl
            ? 'تم تحميل أقرب النتائج حسب موقعك الحالي.'
            : 'Nearest results loaded using your current location.'
          : isRtl
            ? 'تم تحديد موقعك، لكن لم يعثر المصدر المجاني على قائمة مكتوبة.'
            : 'No nearby written results were found. You can still use the map.',
      );
    } catch (error) {
      console.error('Nearby hospital card request failed, using built-in Egypt fallback:', error);
      const fallbackResults = getFallbackFacilityResults(mode, coords.lat, coords.lon);
      const nearest = fallbackResults[0];
      setFacilityResults(nearest ? [nearest] : []);
      if (nearest) {
        setFacilityMapEmbedUrl(buildFacilityResultMapEmbedUrl(nearest));
      }
      setFacilityResultsMessage('');
      setFacilityStatusTone(nearest ? 'success' : 'error');
      setFacilityStatus(
        nearest
          ? isRtl
            ? 'تم عرض أقرب نتيجة من قائمة مستشفيات مصر الاحتياطية.'
            : 'Showing nearest result from the Egypt hospital fallback list.'
          : isRtl
            ? 'تعذر تحميل بطاقة أقرب مستشفى. لا تزال الخريطة متاحة.'
            : 'Unable to load a nearby hospital card. You can still use the map.',
      );
    } finally {
      isFindingFacilityRef.current = false;
      setIsFindingFacility(false);
    }
  };

  return {
    lang, setLang, view, setView, t, isRtl, backendUrl,
    authToken, setAuthToken, authUser, setAuthUser, authError, setAuthError,
    profileName, setProfileName, profileEmail, setProfileEmail, profilePhone, setProfilePhone,
    profileBloodType, setProfileBloodType, profileAllergies, setProfileAllergies, profileMedications, setProfileMedications,
    profileStatus, setProfileStatus, profileLoading, setProfileLoading,
    burnHistory, setBurnHistory, historyLoading, historyError, setHistoryError,
    selectedBurnResult, setSelectedBurnResult, currentResult, setCurrentResult,
    burnSaveMessage, burnSaveError, isChatbotOpen, setIsChatbotOpen,
    skipNextScrollToTopRef,
    fileInputRef, isAnalyzingRef, isAnalyzing, setIsAnalyzing, assessmentError, setAssessmentError,
    selectedFile, setSelectedFile, previewUrl, setPreviewUrl, previewUrlRef, prediction, setPrediction,
    videoSettings, setVideoSettings, draftVideoSettings, setDraftVideoSettings,
    selectedVideoIndex, setSelectedVideoIndex, isSelectedVideoPlaying, setIsSelectedVideoPlaying,
    previousVideoLanguageRef, videoSaveMsg, setVideoSaveMsg, howItWorksVideo,
    howItWorksSaveMsg, setHowItWorksSaveMsg, isHowItWorksPlaying, setIsHowItWorksPlaying,
    isEmergencyModalOpen, setIsEmergencyModalOpen, isFindingFacility, setIsFindingFacility,
    facilityMode, setFacilityMode, facilityMapEmbedUrl, setFacilityMapEmbedUrl,
    facilityStatus, setFacilityStatus, facilityStatusTone, setFacilityStatusTone,
    facilityResults, setFacilityResults, facilityResultsMessage, setFacilityResultsMessage,
    lastLocationLookupRef, adminUsers, setAdminUsers, adminDatasets, setAdminDatasets,
    adminTab, setAdminTab, adminLoading, setAdminLoading, adminError, setAdminError,
    adminAccessDenied, setAdminAccessDenied, lastCoords, setLastCoords, cairoCoords,
    closeBlockingOverlays, completeAuth, saveProfile, fetchBurnResultById, deleteBurnResult,
    getEmergencyLevel, saveBurnResult, clearLatestResult, clearAssessmentSessionState,
    normalizeVideo, normalizeVideoList, normalizeHowItWorks, normalizeVideoSettings,
    getPredictionText, handlePickImage, clearVisibleAssessment, handleAnalyzeAnother, handleAnalyze, handleFileSelected,
    handleDraftVideoChange, handleDraftHowItWorksChange, saveVideoSettings, saveHowItWorksVideoSettings,
    fetchAdminUsers, fetchAdminDatasets, deleteAdminUser, deleteAdminDataset,
    getEmbedUrl, isDirectVideoUrl, emergencyNumber, emergencyScript, copyEmergencyScript,
    getFacilitySearchMeta, buildGoogleMapsUrls, openGoogleMapsSearch, requestUserLocation,
    haversineKm, getFallbackFacilityResults, getFacilityDisplayName, getFacilityDisplayAddress,
    formatDistanceLabel, isInsideEgypt, buildFacilityResultDirectionsUrl, buildFacilityResultMapEmbedUrl,
    buildFacilityOverpassQuery, normalizeFacilityCategory, formatFacilityAddress, normalizeAdminName,
    extractAdminArea, sameAdminArea, reverseGeocodeAdminArea, fetchOverpassElements,
    fetchWrittenFacilityResults, findNearestFacility,
  };
}
