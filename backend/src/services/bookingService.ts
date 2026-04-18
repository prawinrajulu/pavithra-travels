import { db } from '../config/firebase.js';
import { Booking, BookingRequest, BookingResponse } from '../models/booking.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';
import { emailService } from './emailService.js';
import { whatsappService } from './whatsappService.js';
import { serializeFirestoreData } from '../utils/serialize-data.js';

export class BookingService {
  // Generate unique booking ID in TRV-XXXXXX format
  private generateBookingId(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    return `TRV-${randomDigits}`;
  }

  // Normalize phone number: trim and remove non-digits
  private normalizePhone(phone: string): string {
    if (!phone) return '';
    // Trim and keep only digits
    return phone.trim().replace(/\D/g, '');
  }

  async createBooking(request: BookingRequest): Promise<Booking> {
    console.log('[BOOKING SERVICE] Starting booking process for:', request.email || request.name);
    const id = uuidv4();
    const bookingId = this.generateBookingId();

    const travelDate = new Date(request.travelDate);
    if (isNaN(travelDate.getTime())) {
      console.error('[BOOKING SERVICE] Invalid date rejected:', request.travelDate);
      throw new AppError(400, 'Invalid travel date format. Expected YYYY-MM-DD');
    }

    // Use provided destination name or fall back to lookup/ID
    let destinationName = request.destinationName || request.destinationId;
    
    if (!request.destinationName) {
      try {
        console.log('[BOOKING SERVICE] Checking destination:', request.destinationId);
        const destinationDoc = await db.collection('destinations').doc(request.destinationId).get();
        if (destinationDoc.exists) {
          destinationName = destinationDoc.data()?.name || request.destinationId;
          console.log('[BOOKING SERVICE] Found destination Name from DB:', destinationName);
        }
      } catch (dbErr: any) {
        console.error('[BOOKING SERVICE] Database error during destination lookup:', dbErr.message);
      }
    }

    const booking: Booking = {
      id,
      bookingId,
      userId: request.userId,
      name: request.name,
      email: request.email,
      phone: this.normalizePhone(request.phone),
      destinationId: request.destinationId,
      destinationName,
      travelDate,
      passengers: request.passengers,
      status: 'pending',
      specialRequests: request.specialRequests || null,
      hotelPreference: request.hotelPreference || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('[BOOKING SERVICE] Saving booking to Firestore...');
    await db.collection('bookings').doc(id).set(booking);
    console.log('[BOOKING SERVICE] Firestore write successful. ID:', id);

    // Automated Notifications (Non-blocking)
    try {
      await Promise.all([
        emailService.sendBookingConfirmation({
          toEmail: request.email || '',
          customerName: request.name,
          destination: destinationName,
          travelDate: new Date(request.travelDate).toLocaleDateString(),
          passengers: request.passengers,
          bookingId: bookingId,
          phone: request.phone,
          specialRequests: request.specialRequests
        }),
        whatsappService.sendBookingAlert({
          customerName: request.name,
          destination: destinationName,
          travelDate: request.travelDate,
          phone: request.phone,
          bookingId: bookingId
        })
      ]);
    } catch (notificationError) {
      console.error('[BOOKING SERVICE] Notifications failed:', notificationError);
    }

    return serializeFirestoreData(booking);
  }

  async getBooking(bookingId: string): Promise<Booking | null> {
    const snapshot = await db.collection('bookings').where('bookingId', '==', bookingId).get();

    if (snapshot.empty) {
      return null;
    }

    return serializeFirestoreData(snapshot.docs[0].data());
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const doc = await db.collection('bookings').doc(id).get();
    return doc.exists ? serializeFirestoreData(doc.data()) : null;
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

    return snapshot.docs.map((doc: any) => serializeFirestoreData(doc.data()));
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const snapshot = await db
      .collection('bookings')
      .where('userId', '==', userId)
      .get();

    const bookings = snapshot.docs.map((doc: any) => serializeFirestoreData(doc.data()));
    
    // Sort in memory to avoid index requirement
    return bookings.sort((a: Booking, b: Booking) => 
      new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
    );
  }

  async getBookingsByPhone(phone: string): Promise<Booking[]> {
    const cleanPhone = this.normalizePhone(phone);
    console.log(`[BOOKING SERVICE] Querying Firestore for normalized phone: ${cleanPhone}`);
    
    const snapshot = await db
      .collection('bookings')
      .where('phone', '==', cleanPhone)
      .get();

    const bookings = snapshot.docs.map((doc: any) => serializeFirestoreData(doc.data()));
    
    // Sort in memory to avoid index requirement
    return bookings.sort((a: Booking, b: Booking) => 
      new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
    );
  }

  async getAllBookings(): Promise<Booking[]> {
    const snapshot = await db.collection('bookings').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc: any) => serializeFirestoreData(doc.data()));
  }
}

export const bookingService = new BookingService();
