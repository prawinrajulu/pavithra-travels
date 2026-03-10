import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Initialize Firebase Admin SDK
const getServiceAccount = () => {
  try {
    // Try to load from local file for development
    const keyPath = resolve('./serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
    return serviceAccount;
  } catch {
    // Fallback to environment variables
    return {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: 'key-id',
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: 'client-id',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    };
  }
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount() as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const db = admin.firestore();
export const rtdb = admin.database();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
