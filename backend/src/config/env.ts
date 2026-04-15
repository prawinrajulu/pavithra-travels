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
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[CONFIG] Loaded environment from: ${envPath}`);
    break;
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,https://pavithra-travels.onrender.com',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    databaseUrl: process.env.FIREBASE_DATABASE_URL,
    apiKey: process.env.FIREBASE_API_KEY,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
  },
  unsplash: {
    accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  },
};
