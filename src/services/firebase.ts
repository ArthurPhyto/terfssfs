import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config/constants';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

// Export the initialized app for reuse
export const firebaseApp = app;