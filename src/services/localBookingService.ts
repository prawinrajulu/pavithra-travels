// Simple booking service using localStorage
export interface BookingData {
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  destination: string;
  destinationId: string;
  travelDate: string;
  passengers: number;
  hotelPreference?: string;
  specialRequests?: string;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

class LocalBookingService {
  private readonly STORAGE_KEY = 'pavithra_travels_bookings';

  // Generate unique booking ID
  private generateBookingId(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `TRV-${randomDigits}`;
  }

  // Get all bookings from localStorage
  private getBookings(): BookingData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading bookings from localStorage:', error);
      return [];
    }
  }

  // Save bookings to localStorage
  private saveBookings(bookings: BookingData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving bookings to localStorage:', error);
    }
  }

  // Create a new booking
  createBooking(bookingRequest: {
    name: string;
    email: string;
    phone: string;
    destinationId: string;
    travelDate: string;
    passengers: number;
    hotelPreference?: string;
    specialRequests?: string;
  }): BookingData {
    const bookingId = this.generateBookingId();
    const bookings = this.getBookings();

    // Get destination name (simplified - you could import destinations here)
    const destinationName = this.getDestinationName(bookingRequest.destinationId);

    const newBooking: BookingData = {
      bookingId,
      customerName: bookingRequest.name,
      email: bookingRequest.email,
      phone: bookingRequest.phone,
      destination: destinationName,
      destinationId: bookingRequest.destinationId,
      travelDate: bookingRequest.travelDate,
      passengers: bookingRequest.passengers,
      hotelPreference: bookingRequest.hotelPreference,
      specialRequests: bookingRequest.specialRequests,
      bookingStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    this.saveBookings(bookings);

    return newBooking;
  }

  // Get booking by ID
  getBooking(bookingId: string): BookingData | null {
    const bookings = this.getBookings();
    return bookings.find(booking => booking.bookingId === bookingId) || null;
  }

  // Get all bookings
  getAllBookings(): BookingData[] {
    return this.getBookings();
  }

  // Update booking status
  updateBookingStatus(bookingId: string, status: BookingData['bookingStatus']): BookingData | null {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(booking => booking.bookingId === bookingId);

    if (bookingIndex === -1) {
      return null;
    }

    bookings[bookingIndex].bookingStatus = status;
    this.saveBookings(bookings);

    return bookings[bookingIndex];
  }

  // Helper method to get destination name (simplified)
  private getDestinationName(destinationId: string): string {
    // This is a simplified version - in a real app you'd import the destinations
    const destinationMap: { [key: string]: string } = {
      'tirupati': 'Tirupati Balaji',
      'rameswaram': 'Rameswaram',
      'varanasi': 'Varanasi (Kashi)',
      'kedarnath': 'Kedarnath Dham',
      'badrinath': 'Badrinath Temple',
      'madurai': 'Madurai Meenakshi Temple',
      'kerala': 'Kerala',
      'goa': 'Goa',
      'rajasthan': 'Rajasthan',
      'himachal': 'Himachal Pradesh',
      'uttarakhand': 'Uttarakhand',
      'karnataka': 'Karnataka',
    };

    return destinationMap[destinationId] || destinationId;
  }
}

export const localBookingService = new LocalBookingService();