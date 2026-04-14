import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), './.env') });

console.log('--- TEST BOOT ---');
console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);

try {
  const account = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!account.project_id || !account.private_key) {
    throw new Error('MISSING CREDENTIALS');
  }

  admin.initializeApp({
    credential: admin.credential.cert(account as admin.ServiceAccount),
  });
  console.log('Firebase Init: SUCCESS');
} catch (err: any) {
  console.error('CRASH REASON:', err);
}
