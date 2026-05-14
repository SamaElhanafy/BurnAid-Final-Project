import type { FacilityResult } from '../types/burnAid';

/**
 * Static fallbacks when live facility APIs (Overpass / Google) return nothing.
 * Used by the emergency “nearest care” flow inside Egypt.
 */
export const EGYPT_FALLBACK_FACILITIES: FacilityResult[] = [
  {
    id: 'fallback-ahl-masr-burn-hospital',
    name: 'Ahl Masr Burn Hospital',
    arName: 'مستشفى أهل مصر لعلاج الحروق',
    category: 'burn care',
    address: 'Second New Cairo, Cairo Governorate, Egypt',
    arAddress: 'التجمع الثاني، القاهرة الجديدة، محافظة القاهرة، مصر',
    rating: '4.6',
    lat: 30.0274,
    lon: 31.4913,
    lng: 31.4913,
  },
  {
    id: 'fallback-kasr-al-ainy-emergency',
    name: 'Kasr Al Ainy Emergency Hospital',
    arName: 'مستشفى قصر العيني للطوارئ',
    category: 'emergency care',
    address: 'Al Manial, Cairo Governorate, Egypt',
    arAddress: 'المنيل، محافظة القاهرة، مصر',
    rating: '3.9',
    lat: 30.0319,
    lon: 31.2292,
    lng: 31.2292,
  },
  {
    id: 'fallback-ain-shams-specialized',
    name: 'Ain Shams University Specialized Hospital',
    arName: 'مستشفى عين شمس التخصصي',
    category: 'emergency care',
    address: 'Abbassia, Cairo Governorate, Egypt',
    arAddress: 'العباسية، محافظة القاهرة، مصر',
    rating: '4.0',
    lat: 30.0768,
    lon: 31.2852,
    lng: 31.2852,
  },
  {
    id: 'fallback-alexandria-main-university',
    name: 'Alexandria Main University Hospital',
    arName: 'المستشفى الرئيسي الجامعي بالإسكندرية',
    category: 'emergency care',
    address: 'Al Attarin, Alexandria, Egypt',
    arAddress: 'العطارين، الإسكندرية، مصر',
    rating: '3.8',
    lat: 31.1999,
    lon: 29.913,
    lng: 29.913,
  },
  {
    id: 'fallback-mansoura-emergency',
    name: 'Mansoura Emergency Hospital',
    arName: 'مستشفى الطوارئ بالمنصورة',
    category: 'emergency care',
    address: 'Mansoura, Dakahlia Governorate, Egypt',
    arAddress: 'المنصورة، محافظة الدقهلية، مصر',
    rating: '3.9',
    lat: 31.0417,
    lon: 31.3785,
    lng: 31.3785,
  },
];
