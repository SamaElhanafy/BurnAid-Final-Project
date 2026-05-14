/**
 * Hospital / burn-center discovery: OpenStreetMap Overpass, optional Google Places, and Egypt fallbacks.
 * Used by `/api/nearby-facilities` and `/api/places/nearby`.
 */

export type NearbyMode = 'emergency' | 'burn' | 'both';

export type NearbyResult = {
  id: string;
  name: string;
  arName?: string;
  category: string;
  address?: string;
  arAddress?: string;
  distanceKm: number;
  rating?: string;
  lat: number;
  lon: number;
  lng: number;
  googleMapsUrl: string;
};

export type PlacesType = 'emergency' | 'burn' | 'both';

const EGYPT_FALLBACK_FACILITIES: Omit<NearbyResult, 'distanceKm' | 'googleMapsUrl'>[] = [
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

const isInsideEgypt = (lat: number, lon: number) => lat >= 21.5 && lat <= 31.8 && lon >= 24.5 && lon <= 36.9;

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

const formatOsmAddress = (tags: Record<string, string>) =>
  [
    [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ').trim(),
    tags['addr:city'],
    tags['addr:state'],
    tags['addr:country'],
  ]
    .filter(Boolean)
    .join(', ');

const buildNearbyOverpassQuery = (mode: NearbyMode, lat: number, lon: number, radius: number) => {
  const burnSearch = `
    node(around:${radius},${lat},${lon})(area.egypt)["healthcare:speciality"~"burn|burns",i];
    way(around:${radius},${lat},${lon})(area.egypt)["healthcare:speciality"~"burn|burns",i];
    node(around:${radius},${lat},${lon})(area.egypt)["name"~"burn|burns",i];
    way(around:${radius},${lat},${lon})(area.egypt)["name"~"burn|burns",i];
  `;
  const emergencySearch = `
    node(around:${radius},${lat},${lon})(area.egypt)["amenity"="hospital"];
    way(around:${radius},${lat},${lon})(area.egypt)["amenity"="hospital"];
    node(around:${radius},${lat},${lon})(area.egypt)["healthcare"="hospital"];
    way(around:${radius},${lat},${lon})(area.egypt)["healthcare"="hospital"];
    node(around:${radius},${lat},${lon})(area.egypt)["emergency"="yes"];
    way(around:${radius},${lat},${lon})(area.egypt)["emergency"="yes"];
    node(around:${radius},${lat},${lon})(area.egypt)["name"~"emergency|trauma",i];
    way(around:${radius},${lat},${lon})(area.egypt)["name"~"emergency|trauma",i];
  `;
  const search = mode === 'burn' ? burnSearch : mode === 'emergency' ? emergencySearch : `${burnSearch}\n${emergencySearch}`;
  return `[out:json][timeout:15];
    area["ISO3166-1"="EG"][admin_level=2]->.egypt;
    (
      ${search}
    );
    out center tags;`;
};

const fetchOverpassJson = async (query: string) => {
  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.nchc.org.tw/api/interpreter',
  ];

  let lastError: unknown = null;
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
      if (!response.ok) throw new Error(`Overpass ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('Overpass unavailable');
};

const parseNearbyElements = (elements: any[], mode: NearbyMode, lat: number, lon: number): NearbyResult[] => {
  const parsed = elements
    .map((element: any) => {
      const resultLat = element.lat ?? element.center?.lat;
      const resultLon = element.lon ?? element.center?.lon;
      const tags = (element.tags ?? {}) as Record<string, string>;
      if (typeof resultLat !== 'number' || typeof resultLon !== 'number') return null;
      if (!isInsideEgypt(resultLat, resultLon)) return null;

      const name = (tags.name || '').toLowerCase();
      const speciality = (tags['healthcare:speciality'] || '').toLowerCase();
      const emergency = (tags.emergency || '').toLowerCase();
      const amenity = (tags.amenity || '').toLowerCase();
      const healthcare = (tags.healthcare || '').toLowerCase();
      const isBurn = name.includes('burn') || speciality.includes('burn');
      const isHospital = amenity.includes('hospital') || healthcare.includes('hospital') || emergency === 'yes';
      if (mode === 'burn' && !isBurn) return null;
      if (mode === 'emergency' && !isHospital) return null;
      if (mode === 'both' && !isBurn && !isHospital) return null;

      const distanceKm = haversineKm(lat, lon, resultLat, resultLon);
      const placeName = tags.name || 'Nearby medical facility';
      return {
        id: `${element.type}-${element.id}`,
        name: placeName,
        category: isBurn ? 'burn care' : emergency === 'yes' ? 'emergency care' : tags.amenity || tags.healthcare || 'hospital',
        address: formatOsmAddress(tags) || undefined,
        distanceKm,
        rating: tags.stars || tags.rating || undefined,
        lat: resultLat,
        lon: resultLon,
        lng: resultLon,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName} ${resultLat},${resultLon}`)}`,
      } satisfies NearbyResult;
    })
    .filter((item: NearbyResult | null): item is NearbyResult => Boolean(item))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return parsed.filter(
    (item, index, all) => all.findIndex((entry) => entry.name.toLowerCase() === item.name.toLowerCase()) === index,
  );
};

export async function findNearbyFacilities(mode: NearbyMode, lat: number, lon: number) {
  const searchModes: NearbyMode[] = mode === 'burn' ? ['burn', 'emergency'] : [mode];
  for (const searchMode of searchModes) {
    for (const radius of [10000, 25000, 50000]) {
      const data = await fetchOverpassJson(buildNearbyOverpassQuery(searchMode, lat, lon, radius));
      const results = parseNearbyElements(Array.isArray(data?.elements) ? data.elements : [], searchMode, lat, lon);
      if (results.length > 0) return { results: results.slice(0, 5), fallbackUsed: searchMode !== mode };
    }
  }
  return { results: [], fallbackUsed: false };
}

export function findFallbackEgyptFacilities(mode: NearbyMode, lat: number, lon: number): NearbyResult[] {
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
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

const getPlacesApiKey = () =>
  process.env.GOOGLE_MAPS_API_KEY?.trim() ||
  process.env.GOOGLE_PLACES_API_KEY?.trim() ||
  process.env.MAPS_API_KEY?.trim() ||
  '';

const mapPlacesTypeToQuery = (type: PlacesType, fallback = false) => {
  if (fallback) return 'hospital emergency Egypt';
  if (type === 'emergency') return 'emergency hospital Egypt';
  if (type === 'both') return 'burn center emergency hospital Egypt';
  return 'burn center Egypt';
};

const parseGooglePlacesResults = (places: any[], lat: number, lon: number): NearbyResult[] =>
  places
    .map((place: any) => {
      const resultLat = place?.geometry?.location?.lat;
      const resultLon = place?.geometry?.location?.lng;
      if (typeof resultLat !== 'number' || typeof resultLon !== 'number') return null;
      if (!isInsideEgypt(resultLat, resultLon)) return null;
      const name = typeof place?.name === 'string' ? place.name : 'Nearby medical facility';
      const distanceKm = haversineKm(lat, lon, resultLat, resultLon);
      const placeId = typeof place?.place_id === 'string' ? place.place_id : '';
      return {
        id: placeId || `${resultLat},${resultLon}`,
        name,
        category: Array.isArray(place?.types) ? place.types.join(', ') : 'hospital',
        address: typeof place?.formatted_address === 'string' ? place.formatted_address : place?.vicinity,
        distanceKm,
        rating: typeof place?.rating === 'number' ? String(place.rating) : undefined,
        lat: resultLat,
        lon: resultLon,
        lng: resultLon,
        googleMapsUrl: placeId
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${encodeURIComponent(placeId)}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${resultLat},${resultLon}`)}`,
      } satisfies NearbyResult;
    })
    .filter((item: NearbyResult | null): item is NearbyResult => Boolean(item))
    .sort((a, b) => a.distanceKm - b.distanceKm);

const fetchGooglePlacesTextSearch = async (type: PlacesType, lat: number, lon: number, fallback = false) => {
  const key = getPlacesApiKey();
  if (!key) throw new Error('GOOGLE_PLACES_KEY_MISSING');

  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', mapPlacesTypeToQuery(type, fallback));
  url.searchParams.set('location', `${lat},${lon}`);
  url.searchParams.set('radius', '50000');
  url.searchParams.set('region', 'eg');
  url.searchParams.set('key', key);

  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || (body.status && !['OK', 'ZERO_RESULTS'].includes(body.status))) {
    console.error('Google Places search failed', {
      httpStatus: response.status,
      placesStatus: body.status,
      errorMessage: body.error_message,
    });
    throw new Error(body.error_message || body.status || `Google Places ${response.status}`);
  }
  return parseGooglePlacesResults(Array.isArray(body.results) ? body.results : [], lat, lon);
};

export async function findGoogleNearbyPlaces(type: PlacesType, lat: number, lon: number) {
  let results = await fetchGooglePlacesTextSearch(type, lat, lon, false);
  if (!results.length && type === 'burn') results = await fetchGooglePlacesTextSearch(type, lat, lon, true);
  return results;
}
