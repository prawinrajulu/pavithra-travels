// firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Safe env cleaner helper to avoid unexpected quotes or whitespace
const cleanEnv = (val?: string) => {
  if (!val) return val;
  const trimmed = val.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

// Use environment variables (BEST PRACTICE)
const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: cleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
};

if (!firebaseConfig.apiKey) {
  console.warn('[FIREBASE CLIENT] ⚠️ VITE_FIREBASE_API_KEY is not defined in the frontend environment. Authentication and Firestore will be unavailable.');
}

// Initialize Firebase ONLY ONCE (Guaranteed singleton across HMR reloads)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics (Safe conditional initialization)
export let analytics: any = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  import('firebase/analytics')
    .then(({ isSupported, getAnalytics }) => {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics unsupported in this browser environment
      });
    })
    .catch(() => {
      // Analytics module not loaded
    });
}