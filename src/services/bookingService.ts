import { apiClient } from './apiClient';

export interface BookingRequest {
  name: string;
  phone: string;
  destinationId: string;
  travelDate: string;
  passengers: number;
  hotelPreference?: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  name: string;
  phone: string;
  destinationId: string;
  destinationName: string;
  travelDate: string;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  hotelPreference?: string;
  createdAt: string;
  updatedAt: string;
}

export class BookingService {
  async createBooking(request: BookingRequest): Promise<Booking> {
    const response = await apiClient.createBooking(request);
    return response.booking;
  }

  async getBookingStatus(bookingId: string): Promise<Booking | null> {
    try {
      const response = await apiClient.getBookingStatus(bookingId);
      return response.booking;
    } catch (error) {
      return null;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    const response = await apiClient.getBookings();
    return response.bookings;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const response = await apiClient.updateBookingStatus(bookingId, status);
    return response.booking;
  }
}

export const bookingService = new BookingService();