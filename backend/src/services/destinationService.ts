import { db, storage } from '../config/firebase.js';
import { Destination, DestinationFilters } from '../models/destination.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class DestinationService {
  async createDestination(destination: Destination): Promise<Destination> {
    const id = destination.id || uuidv4();
    const doc: Destination = {
      ...destination,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('destinations').doc(id).set(doc);
    return doc;
  }

  async getDestination(destinationId: string): Promise<Destination | null> {
    const doc = await db.collection('destinations').doc(destinationId).get();
    return doc.exists ? (doc.data() as Destination) : null;
  }

  async getAllDestinations(): Promise<Destination[]> {
    const snapshot = await db.collection('destinations').get();
    return snapshot.docs.map((doc) => doc.data() as Destination);
  }

  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    const snapshot = await db
      .collection('destinations')
      .where('category', '==', category)
      .get();

    return snapshot.docs.map((doc) => doc.data() as Destination);
  }

  async getDestinationsByRegion(region: string): Promise<Destination[]> {
    const snapshot = await db
      .collection('destinations')
      .where('region', '==', region)
      .get();

    return snapshot.docs.map((doc) => doc.data() as Destination);
  }

  async filterDestinations(filters: DestinationFilters): Promise<Destination[]> {
    let query = db.collection('destinations') as any;

    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }

    if (filters.region) {
      query = query.where('region', '==', filters.region);
    }

    const snapshot = await query.get();
    let results = snapshot.docs.map((doc: any) => doc.data() as Destination);

    // Apply price filter
    if (filters.maxBudget) {
      results = results.filter((d: Destination) => d.estimatedCost <= filters.maxBudget!);
    }

    // Apply duration filter
    if (filters.minDays || filters.maxDays) {
      results = results.filter((d: Destination) => {
        const meet = true;
        if (filters.minDays && d.durationDays < filters.minDays) return false;
        if (filters.maxDays && d.durationDays > filters.maxDays) return false;
        return meet;
      });
    }

    return results;
  }

  async updateDestination(
    destinationId: string,
    updates: Partial<Destination>,
  ): Promise<Destination> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await db.collection('destinations').doc(destinationId).update(updateData);
    const updated = await this.getDestination(destinationId);

    if (!updated) {
      throw new AppError(404, 'Destination not found');
    }

    return updated;
  }

  async uploadDestinationImage(
    destinationId: string,
    buffer: Buffer,
    filename: string,
  ): Promise<string> {
    const filename_new = `${destinationId}/${filename}`;
    const file = storage.bucket().file(`destination-images/${filename_new}`);

    await file.save(buffer);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    return url;
  }
}

export const destinationService = new DestinationService();
