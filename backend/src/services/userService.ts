import { db, firebaseAuth, storage } from '../config/firebase.js';
import { User, UserProfile } from '../models/user.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  async createUser(firebaseUid: string, email: string, displayName: string, phone?: string): Promise<User> {
    const userId = uuidv4();
    const user: User = {
      id: userId,
      firebaseUid,
      email,
      displayName,
      phone,
      role: email === 'pavithrashoppee@gmail.com' ? 'super_admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').doc(userId).set(user);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const doc = await db.collection('users').doc(userId).get();
    return doc.exists ? (doc.data() as User) : null;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const snapshot = await db
      .collection('users')
      .where('firebaseUid', '==', firebaseUid)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data() as User;
    if (!data.id) data.id = snapshot.docs[0].id;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data() as User;
    if (!data.id) data.id = snapshot.docs[0].id;
    return data;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await db.collection('users').doc(userId).update(updateData);
    const updated = await this.getUserById(userId);

    if (!updated) {
      throw new AppError(404, 'User not found');
    }

    return updated;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    // Get additional profile information
    const bookings = await db
      .collection('bookings')
      .where('userId', '==', userId)
      .get();

    const profile: UserProfile = {
      ...user,
      role: user.email === 'pavithrashoppee@gmail.com' ? 'super_admin' : user.role,
      totalBookings: bookings.size,
    };

    return profile;
  }

  async uploadProfileImage(userId: string, buffer: Buffer, filename: string): Promise<string> {
    const filename_new = `${userId}/${filename}`;
    const file = storage.bucket().file(`profile-images/${filename_new}`);

    await file.save(buffer);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return url;
  }

  async changePassword(uid: string, newPassword: string): Promise<void> {
    if (!firebaseAuth) {
      throw new AppError(503, 'Firebase Authentication service is unavailable.');
    }
    await firebaseAuth.updateUser(uid, {
      password: newPassword,
    });
  }

  async setSuperAdmin(email: string): Promise<void> {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({ 
        role: 'super_admin',
        updatedAt: new Date()
      });
    }

    // Revoke admin/super_admin from any other user who is not this email
    const admins = await db.collection('users')
      .where('role', 'in', ['admin', 'super_admin'])
      .get();
    
    for (const doc of admins.docs) {
      if (doc.data().email !== email) {
        console.log(`[AUTH] Revoking admin privileges from ${doc.data().email}`);
        await doc.ref.update({ 
          role: 'user',
          updatedAt: new Date()
        });
      }
    }
  }
}

export const userService = new UserService();
