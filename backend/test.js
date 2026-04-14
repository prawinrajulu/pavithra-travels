import dotenv from 'dotenv';
dotenv.config();
const k = process.env.FIREBASE_PRIVATE_KEY;
console.log('RAW TYPE:', typeof k);
if (k) {
  const clean = k.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
  console.log('CLEAN VALID PEM:', clean.includes('-----BEGIN PRIVATE KEY-----\n'));
  console.log('CLEAN LENGTH:', clean.length);
  console.log('START:', clean.substring(0, 40));
}
