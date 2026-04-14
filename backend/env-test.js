import dotenv from 'dotenv';
dotenv.config();

const key = process.env.FIREBASE_PRIVATE_KEY;
console.log('SUFFIX:', JSON.stringify(key.substring(key.length - 40)));
