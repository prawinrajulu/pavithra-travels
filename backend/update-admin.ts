import { firebaseAuth as auth } from './src/config/firebase.js';
import { db } from './src/config/firebase.js';

const TARGET_EMAIL = 'pavithrashoppee@gmail.com';
const NEW_PASSWORD = 'varnika@6369';

async function updateAdmin() {
  try {
    // 1. Find user by email in Firebase Auth
    console.log(`Looking up Firebase Auth user: ${TARGET_EMAIL}`);
    let userRecord;
    try {
      userRecord = await auth!.getUserByEmail(TARGET_EMAIL);
      console.log(`Found Firebase user: ${userRecord.uid}`);
    } catch {
      // Create the user if not found
      console.log('User not found in Firebase Auth – creating...');
      userRecord = await auth!.createUser({
        email: TARGET_EMAIL,
        password: NEW_PASSWORD,
        displayName: 'Pavithra Admin',
      });
      console.log(`Created Firebase user: ${userRecord.uid}`);
    }

    // 2. Update password
    await auth!.updateUser(userRecord.uid, { password: NEW_PASSWORD });
    console.log(`✅ Password updated for ${TARGET_EMAIL}`);

    // 3. Upsert Firestore user document with role = admin
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', TARGET_EMAIL).get();

    if (snapshot.empty) {
      await usersRef.doc(userRecord.uid).set({
        id: userRecord.uid,
        email: TARGET_EMAIL,
        name: 'Pavithra Admin',
        role: 'super_admin',
        firebaseUid: userRecord.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Created new super admin Firestore document.');
    } else {
      for (const doc of snapshot.docs) {
        await doc.ref.update({ 
          id: doc.id,
          role: 'super_admin', 
          firebaseUid: userRecord.uid,
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Updated Firestore doc ${doc.id} to super admin.`);
      }
    }

    console.log('\n🎉 Done! Login with:');
    console.log(`   Email   : ${TARGET_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

updateAdmin();
