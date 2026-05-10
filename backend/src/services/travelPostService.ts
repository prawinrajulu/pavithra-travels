import { db, storage } from '../config/firebase.js';
import { TravelPost, PostReview } from '../models/travelPost.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';
import { serializeFirestoreData } from '../utils/serialize-data.js';
import fs from 'fs';
import path from 'path';

export class TravelPostService {
  async createPost(data: Partial<TravelPost>): Promise<TravelPost> {
    const id = uuidv4();
    const post: TravelPost = {
      id,
      title: data.title || '',
      description: data.description || '',
      location: data.location || '',
      imageUrl: data.imageUrl || '',
      images: data.images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('travelPosts').doc(id).set(post);
    return post;
  }

  async getAllPosts(): Promise<TravelPost[]> {
    const snapshot = await db.collection('travelPosts').get();
    
    return snapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return serializeFirestoreData({ ...data, id: doc.id });
      })
      .sort((a: any, b: any) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });
  }

  async getPostById(id: string): Promise<TravelPost | null> {
    const doc = await db.collection('travelPosts').doc(id).get();
    if (!doc.exists) return null;
    return serializeFirestoreData({ ...doc.data(), id: doc.id });
  }

  async updatePost(id: string, updates: Partial<TravelPost>): Promise<TravelPost> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await db.collection('travelPosts').doc(id).update(updateData);
    const updated = await this.getPostById(id);
    if (!updated) throw new AppError(404, 'Post not found');
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    await db.collection('travelPosts').doc(id).delete();
    
    // Also delete associated reviews
    const reviewsSnapshot = await db.collection('postReviews').where('postId', '==', id).get();
    const batch = db.batch();
    reviewsSnapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
    await batch.commit();
  }

  // Review methods
  async addReview(data: Partial<PostReview>): Promise<PostReview> {
    const id = uuidv4();
    const review: PostReview = {
      id,
      postId: data.postId || '',
      username: data.username || 'Anonymous',
      message: data.message || '',
      createdAt: new Date(),
    };

    await db.collection('postReviews').doc(id).set(review);
    return review;
  }

  async getReviewsByPostId(postId: string): Promise<PostReview[]> {
    const snapshot = await db.collection('postReviews')
      .where('postId', '==', postId)
      .get();
    
    return snapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return serializeFirestoreData({ ...data, id: doc.id });
      })
      .sort((a: any, b: any) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });
  }
}

export const travelPostService = new TravelPostService();
