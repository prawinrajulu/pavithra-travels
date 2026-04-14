import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const fb = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  databaseUrl: process.env.FIREBASE_DATABASE_URL
};

const cleanKey = fb.privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

const keyData = {
  projectId: fb.projectId,
  project_id: fb.projectId,
  clientEmail: fb.clientEmail,
  client_email: fb.clientEmail,
  privateKey: cleanKey,
  private_key: cleanKey,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(keyData),
    databaseURL: fb.databaseUrl,
  });
  console.log("SUCCESS initialized!");
} catch(err) {
  console.error("FAIL:", err.message);
  console.error(keyData.privateKey.substring(0, 50));
}
