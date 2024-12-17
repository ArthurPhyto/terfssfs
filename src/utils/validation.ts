import { z } from 'zod';

export const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string(),
  VITE_FIREBASE_PROJECT_ID: z.string(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  VITE_FIREBASE_APP_ID: z.string(),
});

export const validateEnvironment = () => {
  try {
    envSchema.parse(import.meta.env);
    return true;
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
};