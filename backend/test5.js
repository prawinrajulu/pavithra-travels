import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

let k = process.env.FIREBASE_PRIVATE_KEY;
let base64 = k.replace(/-----BEGIN PRIVATE KEY-----/g, '')
             .replace(/-----END PRIVATE KEY-----/g, '')
             .replace(/\\n/g, '')
             .replace(/\n/g, '')
             .replace(/\s+/g, '')
             .replace(/"/g, '');

while (base64.length % 4 !== 0) {
    base64 += '=';
}

const chunks = base64.match(/.{1,64}/g);
const validPem = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;

try {
  crypto.createPrivateKey(validPem);
  console.log("SUCCESS with padding!");
} catch(e) {
  console.log("FAIL even with padding:", e.message);
  console.log("Final length:", base64.length);
}
