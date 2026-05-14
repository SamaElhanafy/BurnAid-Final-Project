/**
 * Shared TypeScript models for the BURN-AID UI (assessment, video library, facility search, chat).
 */

export type BurnPrediction = {
  label: string;
  confidence: number;
  apiDescription?: string;
  apiRecommendations?: string[];
};

export type CurrentAssessmentResult = {
  id?: string;
  burnType: string;
  confidence: number;
  description: string;
  recommendations: string[];
  createdAt: string;
};

export type ManagedVideo = {
  id?: string;
  title: string;
  duration?: string;
  thumbnail: string;
  youtubeUrl?: string;
  sub?: string;
  videoUrl?: string;
};

export type HowItWorksVideoConfig = {
  thumbnail: string;
  youtubeUrl?: string;
  videoUrl?: string;
};

export type VideoSettings = {
  enVideos: ManagedVideo[];
  arVideos: ManagedVideo[];
  howItWorks: {
    en: HowItWorksVideoConfig;
    ar: HowItWorksVideoConfig;
  };
};

export type ChatTab = 'my-case' | 'unknown-degree' | 'services';
export type ChatHistoryMessage = { role: 'user' | 'bot'; text: string };

export type FacilitySearchMode = 'emergency' | 'burn' | 'both';
export type FacilityStatusTone = 'neutral' | 'error' | 'success';
export type FacilityResult = {
  id: string;
  name: string;
  arName?: string;
  category: string;
  address?: string;
  arAddress?: string;
  distanceKm?: number;
  rating?: string;
  googleMapsUrl?: string;
  lat: number;
  lon: number;
  lng?: number;
};

export type FacilityAdminArea = {
  city?: string;
  state?: string;
  governorate?: string;
};

/** Routes rendered inside the single-page shell (see App.tsx). */
export const APP_VIEWS = [
  'landing',
  'assessment',
  'emergency',
  'video',
  'documentation',
  'about',
  'account',
  'notifications',
  'how-it-works',
  'admin',
  'login',
  'register',
] as const;

export type AppView = (typeof APP_VIEWS)[number];
