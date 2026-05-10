import { db } from './src/config/firebase.js';

async function dumpUser(email: string) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      console.log('No user found.');
      return;
    }

    const user = snapshot.docs[0].data();
    console.log('User Data:', JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

const targetEmail = process.argv[2] || 'pavithrashoppee@gmail.com';
dumpUser(targetEmail);
