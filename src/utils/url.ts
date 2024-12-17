import { APP_CONFIG } from '../config/constants';

export const generateRandomPath = (length: number = APP_CONFIG.DEFAULT_PATH_LENGTH): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getRedirectUrl = (path: string): string => {
  return `${APP_CONFIG.BASE_URL}/redirect/${path}`;
};