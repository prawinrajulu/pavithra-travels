import { db } from './src/config/firebase.js';

async function setAdmin(email: string) {
  try {
    console.log(`Searching for user with email: ${email}...`);
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      console.log('No user found with that email.');
      console.log('Available users in system:');
      const allUsers = await usersRef.limit(10).get();
      allUsers.forEach((doc: any) => console.log(`- ${doc.data().email} (${doc.id})`));
      return;
    }

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ role: 'admin' });
    console.log(`Successfully granted admin role to: ${email}`);
  } catch (error) {
    console.error('Error granting admin role:', error);
  } finally {
    process.exit(0);
  }
}

const targetEmail = process.argv[2] || 'praveenrajulu9@gmail.com';
setAdmin(targetEmail);
