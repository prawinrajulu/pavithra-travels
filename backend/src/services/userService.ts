import { db, auth, storage } from '../config/firebase.js';
import { User, UserProfile } from '../models/user.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  async createUser(firebaseUid: string, email: string, displayName: string): Promise<User> {
    const userId = uuidv4();
    const user: User = {
      id: userId,
      firebaseUid,
      email,
      displayName,
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
    return snapshot.empty ? null : (snapshot.docs[0].data() as User);
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
}

export const userService = new UserService();
