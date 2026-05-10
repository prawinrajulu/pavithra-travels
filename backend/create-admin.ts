import { firebaseAuth as auth } from './src/config/firebase.js';
import { db } from './src/config/firebase.js';

async function createAdmin() {
  const email = 'pavithrashoppee@gmail.com';
  const password = '[PASSWORD]';
  const displayName = 'Agent Admin';

  try {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    
    // 1. Create User in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });
    console.log('Successfully created new user:', userRecord.uid);

    // 2. Set Admin role in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name: displayName,
      role: 'admin',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    });
    console.log('Successfully granted admin rights in Firestore.');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
