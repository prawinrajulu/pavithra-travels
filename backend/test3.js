import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

const k = process.env.FIREBASE_PRIVATE_KEY;
let clean = k.replace(/^"|"$/g, '').replace(/\\n/g, '\n').replace(/\r/g, '').trim();

try {
  crypto.createPrivateKey(clean);
  console.log("Node Crypto: VALID KEY (clean)");
} catch(e) {
  console.log("Node Crypto Error (clean):", e.message);
  console.log("LENGTH:", clean.length);
  // Just dump the first few and last few lines to see if there is corruption
  const lines = clean.split('\n');
  console.log("FIRST LINE:", lines[0]);
  console.log("LAST LINE:", lines[lines.length-1]);
}
