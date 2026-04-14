import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

let k = process.env.FIREBASE_PRIVATE_KEY;

k = k.replace(/-----BEGIN PRIVATE KEY-----/g, '')
     .replace(/-----END PRIVATE KEY-----/g, '')
     .replace(/\\n/g, '')
     .replace(/\n/g, '')
     .replace(/"/g, '')
     .replace(/\r/g, '')
     .replace(/ /g, '');

const chunks = k.match(/.{1,64}/g);
const validPem = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;

try {
  crypto.createPrivateKey(validPem);
  console.log("VALID KEY");
  console.log(validPem.substring(0, 50));
} catch(e) {
  console.log("INVALID KEY", e.message);
}
