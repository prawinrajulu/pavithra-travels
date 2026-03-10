import { db } from '../config/firebase.js';
import { Booking, BookingRequest, BookingResponse } from '../models/booking.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
  // Generate unique booking ID in TRV-XXXXXX format
  private generateBookingId(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    return `TRV-${randomDigits}`;
  }

  async createBooking(request: BookingRequest): Promise<Booking> {
    const id = uuidv4();
    const bookingId = this.generateBookingId();

    // Get destination name from destinations collection
    const destinationDoc = await db.collection('destinations').doc(request.destinationId).get();
    const destinationName = destinationDoc.exists ? destinationDoc.data()?.name : request.destinationId;

    const booking: Booking = {
      id,
      bookingId,
      name: request.name,
      phone: request.phone,
      destinationId: request.destinationId,
      destinationName,
      travelDate: new Date(request.travelDate),
      passengers: request.passengers,
      status: 'pending',
      specialRequests: request.specialRequests,
      hotelPreference: request.hotelPreference,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('bookings').doc(id).set(booking);
    return booking;
  }

  async getBooking(bookingId: string): Promise<Booking | null> {
    const snapshot = await db.collection('bookings').where('bookingId', '==', bookingId).get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as Booking;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const doc = await db.collection('bookings').doc(id).get();
    return doc.exists ? (doc.data() as Booking) : null;
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    const snapshot = await db.collection('bookings').where('bookingId', '==', bookingId).get();

    if (snapshot.empty) {
      throw new AppError(404, 'Booking not found');
    }

    const docId = snapshot.docs[0].id;
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await db.collection('bookings').doc(docId).update(updateData);
    const updated = await this.getBooking(bookingId);

    if (!updated) {
      throw new AppError(404, 'Booking not found after update');
    }

    return updated;
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    return this.updateBooking(bookingId, { status: 'cancelled' });
  }

  async getBookingsByDestination(destinationId: string): Promise<Booking[]> {
    const snapshot = await db
      .collection('bookings')
      .where('destinationId', '==', destinationId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as Booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    const snapshot = await db.collection('bookings').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => doc.data() as Booking);
  }
}

export const bookingService = new BookingService();
