export const APP_NAME = 'Shirkat Gah';
export const APP_TAGLINE = 'Digital Platform';

export const PAKISTAN_CENTER = { lat: 30.3753, lng: 69.3451 };
export const PAKISTAN_BOUNDS = {
  north: 37.0841,
  south: 23.6345,
  east: 77.8375,
  west: 60.8729,
};

export const PROVINCE_COLORS: Record<string, string> = {
  Punjab: '#047857',
  Sindh: '#0ea5e9',
  KPK: '#14b8a6',
  Balochistan: '#f97316',
  Islamabad: '#8b5cf6',
};

export const CHART_COLORS = ['#047857', '#0ea5e9', '#14b8a6', '#f97316', '#8b5cf6'];

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const FILE_UPLOAD_MAX_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/mp4',
  'video/webm',
];
