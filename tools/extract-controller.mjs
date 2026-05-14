import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
const s = fs.readFileSync(appPath, 'utf8');
const marker = '  /** Marketing landing';
const end = s.indexOf(marker);
if (end < 0) throw new Error('marker not found');
const fn = 'export default function App() {';
const start = s.indexOf(fn);
if (start < 0) throw new Error('App not found');
const bodyStart = start + fn.length;
const body = s.slice(bodyStart, end).replace(/^\s*\r?\n/, '').trimEnd();

const imports = `import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import type {
  BurnPrediction,
  CurrentAssessmentResult,
  ManagedVideo,
  HowItWorksVideoConfig,
  VideoSettings,
  FacilitySearchMode,
  FacilityStatusTone,
  FacilityResult,
  FacilityAdminArea,
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

`;

const hook = `/**
 * Client state, effects, and helpers for BURN-AID (assessment, maps, admin, videos).
 * Used via BurnAidProvider and useBurnAid() from screen components.
 */
export function useBurnAidController() {
${body}

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
`;

const outDir = path.join(__dirname, '..', 'src', 'context');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'useBurnAidController.ts'), imports + hook, 'utf8');
console.log('Wrote useBurnAidController.ts, body chars:', body.length);
