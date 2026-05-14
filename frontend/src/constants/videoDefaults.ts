import type { HowItWorksVideoConfig, ManagedVideo, VideoSettings } from '../types/burnAid';

/** Default English playlist when the API has not yet returned admin-managed URLs. */
export const DEFAULT_MANAGED_VIDEOS: ManagedVideo[] = [
  {
    title: '1. Burn First Aid Basics',
    sub: '12:45',
    thumbnail: 'https://img.youtube.com/vi/OU_GIcBpyF4/hqdefault.jpg',
    videoUrl: 'https://youtu.be/OU_GIcBpyF4?si=BOkmhag4LelBHhg8',
  },
  {
    title: '2. Emergency Burn Treatment',
    sub: '08:20',
    thumbnail: 'https://img.youtube.com/vi/XGnLkUty69g/hqdefault.jpg',
    videoUrl: 'https://youtu.be/XGnLkUty69g?si=Uyc_uRikwF5nhzHE',
  },
  {
    title: '3. Stages of Recovery Visualization',
    sub: '15:10',
    thumbnail: 'https://img.youtube.com/vi/Q3cVCiraAgw/hqdefault.jpg',
    videoUrl: 'https://youtu.be/Q3cVCiraAgw?si=Y4O6ul6Qq7wMgsUz',
  },
  {
    title: '4. Infection Prevention Standards',
    sub: '10:55',
    thumbnail: 'https://img.youtube.com/vi/39L-Y0AXrh0/hqdefault.jpg',
    videoUrl: 'https://youtube.com/shorts/39L-Y0AXrh0?si=_duKGYxXSK3TVZYE',
  },
];

export const DEFAULT_HOW_IT_WORKS_VIDEO: HowItWorksVideoConfig = {
  thumbnail:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAYHmyJnvyk29yy8YKlREHveO-nJTgZGbFPzMGoDVWDpRaKUxEVKUwpjA8qK0SlC0PGnbuZUc18yjWH3ZJRl8wGPFk3SQtCDxWGP5tL0nvWYRci0Pu5h2HE3l8MdPWeJW2_f78toeu-vFZQ7qidRx0HrlvVqgf3As4dAyNYIBBxOuTQ6TOq0_fTAHi4jDlX3eH16_PpgZhMEjH1mjMR3yHmdOCY_Z6R5RrypupDK9cnLC1O5mm31wMgMxKZIh8DNI3NhQz3i96310w',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export const DEFAULT_AR_MANAGED_VIDEOS: ManagedVideo[] = [
  {
    title: '١. أساسيات الإسعافات الأولية للحروق',
    duration: '12:45',
    thumbnail: 'https://img.youtube.com/vi/bvi0gesxqoA/hqdefault.jpg',
    youtubeUrl: 'https://youtube.com/shorts/bvi0gesxqoA?si=5SXIGhSNGPjMVSN6',
  },
  {
    title: '٢. العلاج الطارئ للحروق',
    duration: '08:20',
    thumbnail: 'https://img.youtube.com/vi/xEVPhIv0XbI/hqdefault.jpg',
    youtubeUrl: 'https://youtube.com/shorts/xEVPhIv0XbI?si=dvBFuJ82aR9fc53Y',
  },
  {
    title: '٣. مراحل شفاء الحروق',
    duration: '15:10',
    thumbnail: 'https://img.youtube.com/vi/ezf4sPpUN54/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/ezf4sPpUN54?si=jHZKb7bOuq5F_00W',
  },
  {
    title: '٤. الوقاية من العدوى للحروق',
    duration: '10:55',
    thumbnail: 'https://img.youtube.com/vi/8yYSm_6CDB4/hqdefault.jpg',
    youtubeUrl: 'https://youtube.com/shorts/8yYSm_6CDB4?si=L4dYlzJRNPvx18ti',
  },
];

/** Combined defaults used until `/api/videos` responds. */
export const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  enVideos: DEFAULT_MANAGED_VIDEOS,
  arVideos: DEFAULT_AR_MANAGED_VIDEOS,
  howItWorks: {
    en: DEFAULT_HOW_IT_WORKS_VIDEO,
    ar: DEFAULT_HOW_IT_WORKS_VIDEO,
  },
};
