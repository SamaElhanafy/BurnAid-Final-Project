/** Curated video lists and “how it works” embed config (`backend/data/videoSettings.json`, etc.). */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type ManagedVideo = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  youtubeUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type HowItWorksVideo = {
  thumbnail: string;
  youtubeUrl: string;
  updatedAt: string;
};

export type VideoSettings = {
  enVideos: ManagedVideo[];
  arVideos: ManagedVideo[];
  howItWorks: {
    en: HowItWorksVideo;
    ar: HowItWorksVideo;
  };
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const SETTINGS_PATH = path.resolve(DATA_DIR, 'videoSettings.json');
const LEGACY_VIDEOS_PATH = path.resolve(DATA_DIR, 'videos.json');
const LEGACY_HOW_IT_WORKS_PATH = path.resolve(DATA_DIR, 'howItWorksVideo.json');

const now = () => new Date().toISOString();

const defaultVideos = (language: 'en' | 'ar'): ManagedVideo[] => {
  const videos = language === 'ar'
    ? [
        {
          title: '١. أساسيات الإسعافات الأولية للحروق',
          url: 'https://youtube.com/shorts/bvi0gesxqoA?si=5SXIGhSNGPjMVSN6',
          thumbnail: 'https://img.youtube.com/vi/bvi0gesxqoA/hqdefault.jpg',
        },
        {
          title: '٢. العلاج الطارئ للحروق',
          url: 'https://youtube.com/shorts/xEVPhIv0XbI?si=dvBFuJ82aR9fc53Y',
          thumbnail: 'https://img.youtube.com/vi/xEVPhIv0XbI/hqdefault.jpg',
        },
        {
          title: '٣. مراحل شفاء الحروق',
          url: 'https://youtu.be/ezf4sPpUN54?si=jHZKb7bOuq5F_00W',
          thumbnail: 'https://img.youtube.com/vi/ezf4sPpUN54/hqdefault.jpg',
        },
        {
          title: '٤. الوقاية من العدوى للحروق',
          url: 'https://youtube.com/shorts/8yYSm_6CDB4?si=L4dYlzJRNPvx18ti',
          thumbnail: 'https://img.youtube.com/vi/8yYSm_6CDB4/hqdefault.jpg',
        },
      ]
    : [
        {
          title: '1. Burn First Aid Basics',
          url: 'https://youtu.be/OU_GIcBpyF4?si=BOkmhag4LelBHhg8',
          thumbnail: 'https://img.youtube.com/vi/OU_GIcBpyF4/hqdefault.jpg',
        },
        {
          title: '2. Emergency Burn Treatment',
          url: 'https://youtu.be/XGnLkUty69g?si=Uyc_uRikwF5nhzHE',
          thumbnail: 'https://img.youtube.com/vi/XGnLkUty69g/hqdefault.jpg',
        },
        {
          title: '3. Stages of Recovery Visualization',
          url: 'https://youtu.be/Q3cVCiraAgw?si=Y4O6ul6Qq7wMgsUz',
          thumbnail: 'https://img.youtube.com/vi/Q3cVCiraAgw/hqdefault.jpg',
        },
        {
          title: '4. Infection Prevention Standards',
          url: 'https://youtube.com/shorts/39L-Y0AXrh0?si=_duKGYxXSK3TVZYE',
          thumbnail: 'https://img.youtube.com/vi/39L-Y0AXrh0/hqdefault.jpg',
        },
      ];
  const durations = ['12:45', '08:20', '15:10', '10:55'];
  const stamp = now();
  return videos.map((video, index) => ({
    id: `${language}-${index + 1}`,
    title: video.title,
    duration: durations[index],
    thumbnail: video.thumbnail,
    youtubeUrl: video.url,
    createdAt: stamp,
    updatedAt: stamp,
  }));
};

const defaultHowItWorks = (): HowItWorksVideo => ({
  thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYHmyJnvyk29yy8YKlREHveO-nJTgZGbFPzMGoDVWDpRaKUxEVKUwpjA8qK0SlC0PGnbuZUc18yjWH3ZJRl8wGPFk3SQtCDxWGP5tL0nvWYRci0Pu5h2HE3l8MdPWeJW2_f78toeu-vFZQ7qidRx0HrlvVqgf3As4dAyNYIBBxOuTQ6TOq0_fTAHi4jDlX3eH16_PpgZhMEjH1mjMR3yHmdOCY_Z6R5RrypupDK9cnLC1O5mm31wMgMxKZIh8DNI3NhQz3i96310w',
  youtubeUrl: 'https://youtu.be/OU_GIcBpyF4?si=BOkmhag4LelBHhg8',
  updatedAt: now(),
});

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export function toYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    let id = '';

    if (host === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') id = parsed.searchParams.get('v') ?? '';
      else if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? '';
      else if (parsed.pathname.startsWith('/embed/')) id = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? '';
    }

    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
}

function normalizeVideo(video: any, fallback: ManagedVideo): ManagedVideo {
  const stamp = now();
  return {
    id: typeof video?.id === 'string' ? video.id : crypto.randomUUID(),
    title: typeof video?.title === 'string' && video.title.trim() ? video.title : fallback.title,
    duration: typeof video?.duration === 'string' && video.duration.trim()
      ? video.duration
      : typeof video?.sub === 'string' && video.sub.trim()
        ? video.sub
        : fallback.duration,
    thumbnail: typeof video?.thumbnail === 'string' && video.thumbnail.trim() ? video.thumbnail : fallback.thumbnail,
    youtubeUrl: toYoutubeEmbedUrl(
      typeof video?.youtubeUrl === 'string' && video.youtubeUrl.trim()
        ? video.youtubeUrl
        : typeof video?.videoUrl === 'string'
          ? video.videoUrl
          : fallback.youtubeUrl,
    ),
    createdAt: typeof video?.createdAt === 'string' ? video.createdAt : stamp,
    updatedAt: stamp,
  };
}

function normalizeVideos(videos: any, fallback: ManagedVideo[]) {
  const source = Array.isArray(videos) && videos.length > 0 ? videos : fallback;
  return source.map((video, index) => normalizeVideo(video, fallback[index] || fallback[0]));
}

function normalizeHowItWorks(video: any, fallback: HowItWorksVideo): HowItWorksVideo {
  return {
    thumbnail: typeof video?.thumbnail === 'string' && video.thumbnail.trim() ? video.thumbnail : fallback.thumbnail,
    youtubeUrl: toYoutubeEmbedUrl(
      typeof video?.youtubeUrl === 'string' && video.youtubeUrl.trim()
        ? video.youtubeUrl
        : typeof video?.videoUrl === 'string'
          ? video.videoUrl
          : fallback.youtubeUrl,
    ),
    updatedAt: now(),
  };
}

function normalizeSettings(raw: any): VideoSettings {
  const legacyVideos = Array.isArray(raw?.videos) ? raw.videos : undefined;
  const legacyHowItWorks = raw?.video || raw?.howItWorksVideo;
  return {
    enVideos: normalizeVideos(raw?.enVideos || raw?.en?.videos || legacyVideos, defaultVideos('en')),
    arVideos: normalizeVideos(raw?.arVideos || raw?.ar?.videos, defaultVideos('ar')),
    howItWorks: {
      en: normalizeHowItWorks(raw?.howItWorks?.en || legacyHowItWorks, defaultHowItWorks()),
      ar: normalizeHowItWorks(raw?.howItWorks?.ar || legacyHowItWorks, defaultHowItWorks()),
    },
  };
}

async function readJson(filePath: string) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function readVideoSettings(): Promise<VideoSettings> {
  await ensureDataDir();
  try {
    return normalizeSettings(await readJson(SETTINGS_PATH));
  } catch {
    try {
      const legacyVideos = await readJson(LEGACY_VIDEOS_PATH).catch(() => []);
      const legacyHowItWorks = await readJson(LEGACY_HOW_IT_WORKS_PATH).catch(() => undefined);
      return normalizeSettings({ videos: legacyVideos, video: legacyHowItWorks });
    } catch {
      return normalizeSettings({});
    }
  }
}

export async function writeVideoSettings(settings: any): Promise<VideoSettings> {
  await ensureDataDir();
  const normalized = normalizeSettings(settings);
  const tmp = SETTINGS_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(normalized, null, 2), 'utf8');
  await fs.rename(tmp, SETTINGS_PATH);
  return normalized;
}

// Legacy helpers remain for older routes while the UI uses video settings.
export async function readVideos(): Promise<ManagedVideo[]> {
  return (await readVideoSettings()).enVideos;
}

export async function readHowItWorksVideo(): Promise<HowItWorksVideo> {
  return (await readVideoSettings()).howItWorks.en;
}
