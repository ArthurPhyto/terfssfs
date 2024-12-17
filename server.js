import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Enable CORS
app.use(cors());

// Enable gzip compression
app.use(compression());

// Serve static files from the dist directory
app.use(express.static('dist'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Redirect endpoint
app.get('/redirect/:path', async (req, res) => {
  try {
    const urlPath = req.params.path;
    const urlsRef = collection(db, 'urls');
    const q = query(urlsRef, where('path', '==', urlPath));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).send('URL not found');
    }

    const urlDoc = snapshot.docs[0];
    const urlData = urlDoc.data();
    const targets = urlData.targets;

    // Generate random number between 0 and 100
    const rand = Math.random() * 100;
    let sum = 0;

    // Find the target based on percentage distribution
    for (const target of targets) {
      sum += target.percentage;
      if (rand <= sum) {
        return res.redirect(302, target.url);
      }
    }

    // Fallback to first target if something goes wrong
    res.redirect(302, targets[0].url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Internal server error');
  }
});

// Handle all other routes for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});