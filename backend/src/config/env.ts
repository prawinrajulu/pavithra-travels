import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Try multiple .env locations
const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'backend', '.env'),
  resolve(process.cwd(), '..', '.env')
];

for (const envPath of envPaths) {
  console.log(`[CONFIG] Checking for .env at: ${envPath}`);
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[CONFIG] ✅ Loaded environment from: ${envPath}`);
    break;
  }
}

if (!process.env.FIREBASE_PROJECT_ID) {
  console.warn('[CONFIG] ⚠️ FIREBASE_PROJECT_ID not found after loading .env files!');
}

export const config = {
  port: parseInt(process.env.PORT || '10000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,https://pavithra-travels.com,https://www.pavithra-travels.com,https://pavithra-travels.onrender.com',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    databaseUrl: process.env.FIREBASE_DATABASE_URL,
    apiKey: process.env.FIREBASE_API_KEY,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  whatsapp: {
    phoneId: process.env.WHATSAPP_PHONE_ID,
    token: process.env.WHATSAPP_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    fromNumber: process.env.WHATSAPP_FROM_NUMBER || '+15550000000',
  },
  unsplash: {
    accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  email: {
    user: process.env.EMAIL_USER || 'pavithrashoppee@gmail.com',
    pass: process.env.EMAIL_PASS,
    resendApiKey: process.env.RESEND_API_KEY,
    ownerEmail: process.env.OWNER_EMAIL || 'pavithrashoppee@gmail.com',
  }
};
