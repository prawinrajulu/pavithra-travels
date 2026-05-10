import { db } from './src/config/firebase.js';

async function setAdmin(email: string) {
  try {
    console.log(`Searching for user with email: ${email}...`);
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No user found with that email.');
      const allUsers = await usersRef.limit(10).get();
      allUsers.forEach((doc: any) => console.log(`- ${doc.data().email} (${doc.id}) role: ${doc.data().role}`));
      return;
    }

    console.log(`Found ${snapshot.size} user(s) with email: ${email}`);
    for (const doc of snapshot.docs) {
      const data = doc.data();
      console.log(`User ID: ${doc.id}, FirebaseUID: ${data.firebaseUid}, Current Role: ${data.role}`);
      if (data.role !== 'admin') {
        await doc.ref.update({ role: 'admin' });
        console.log(`Updated User ${doc.id} to admin.`);
      } else {
        console.log(`User ${doc.id} is already an admin.`);
      }
    }
  } catch (error) {
    console.error('Error granting admin role:', error);
  } finally {
    process.exit(0);
  }
}

const targetEmail = process.argv[2] || 'pavithrashoppee@gmail.com';
setAdmin(targetEmail);
