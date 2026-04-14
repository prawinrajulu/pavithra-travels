import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { config } from './env.js';

let isInitialized = false;

const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    isInitialized = true;
    return;
  }

  try {
    // 1. Try Service Account Key File
    const paths = [
      resolve(process.cwd(), './serviceAccountKey.json'),
      resolve(process.cwd(), './backend/serviceAccountKey.json'),
      resolve(process.cwd(), '../serviceAccountKey.json')
    ];
    
    let keyData;
    for (const p of paths) {
      if (existsSync(p)) {
        try {
          keyData = JSON.parse(readFileSync(p, 'utf8'));
          console.log(`[FIREBASE] Using key file: ${p}`);
          break;
        } catch (e) {
          console.warn(`[FIREBASE] Failed to parse key file ${p}:`, e);
        }
      }
    }

    // 2. Fallback to Environment Variables
    if (!keyData) {
      const fb = config.firebase;
      if (fb.projectId && fb.privateKey && fb.privateKey !== 'your-private-key-here') {
        const rawKey = fb.privateKey.replace(/^"|"$/g, '').trim();
        
        // 1. Extract the base64 content only by removing headers and ALL non-base64 characters
        const base64Content = rawKey
          .replace(/-----BEGIN PRIVATE KEY-----/g, '')
          .replace(/-----END PRIVATE KEY-----/g, '')
          .replace(/\\n/g, '') // Remove literal \n sequences
          .replace(/\\r/g, '') // Remove literal \r sequences
          .replace(/\\f/g, '') // Remove literal \f sequences
          .replace(/\\t/g, '') // Remove literal \t sequences
          .replace(/[^A-Za-z0-9+/=]/g, ''); // Super aggressive: remove actual newlines, \f, typos, etc.

          
        // 2. Re-format with exactly 64 characters per line (standard PEM)
        const lines = base64Content.match(/.{1,64}/g) || [];
        const cleanKey = `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
        
        keyData = {
          projectId: fb.projectId,
          clientEmail: fb.clientEmail,
          privateKey: cleanKey,
        };
        console.log(`[FIREBASE] Using environment variables for project: ${fb.projectId} (Stabilization active)`);
      }
    }


      try {
        admin.initializeApp({
          credential: admin.credential.cert(keyData as admin.ServiceAccount),
          databaseURL: config.firebase.databaseUrl,
        });
        isInitialized = true;
        console.log('[FIREBASE] Initialization successful');
      } catch (error: any) {
        console.error('[FIREBASE] Critical Initialization Error:', error.message);
        console.error(`[FIREBASE] Key length used: ${keyData.privateKey.length}`);
        
        // Check if there are any obvious issues with the key content
        const lines = keyData.privateKey.split('\n');
        console.log(`[FIREBASE] Key lines: ${lines.length}`);
        
        if (error.stack) {
           console.error('[FIREBASE] Stack:', error.stack);
        }
      }

  } catch (error: any) {
    console.error('[FIREBASE] Critical Initialization Error:', error.message);
    if (error.stack) {
       // Log more details in dev mode
       console.error('[FIREBASE] Stack:', error.stack);
    }
    if (error.message.includes('Invalid PEM')) {
      console.error('[FIREBASE] Hint: Your private key format is incorrect. Ensure it includes -----BEGIN PRIVATE KEY----- headers.');
    }
  }
};

// Auto-initialize on load
initializeFirebase();

/**
 * Proxy-safe versions of Firebase services to prevent the server from 
 * crashing if initialization failed.
 */
const getAuth = () => {
  if (!isInitialized) return null;
  try { return admin.auth(); } catch { return null; }
};

const getDb = () => {
  if (!isInitialized) {
    // Return a dummy object that logs errors instead of crashing
    return {
      collection: () => ({
        doc: () => ({
          get: () => Promise.reject(new Error('Firebase not initialized')),
          set: () => Promise.reject(new Error('Firebase not initialized')),
          update: () => Promise.reject(new Error('Firebase not initialized')),
          where: () => ({
            limit: () => ({
              get: () => Promise.reject(new Error('Firebase not initialized'))
            })
          })
        })
      })
    } as any;
  }
  const firestore = admin.firestore();
  try {
    firestore.settings({ ignoreUndefinedProperties: true });
    console.log('[FIREBASE] Firestore initialized with ignoreUndefinedProperties: true');
  } catch (err: any) {
    console.warn('[FIREBASE] Firestore settings already applied or failed:', err.message);
  }
  return firestore;
};

export const db = getDb();
export const firebaseAuth = getAuth();
export const rtdb: any = isInitialized ? admin.database() : null;
export const storage: any = isInitialized ? admin.storage() : null;

export default admin;
