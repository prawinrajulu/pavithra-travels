// Simple booking service using localStorage
export interface BookingData {
  booking_id?: string;
  bookingId?: string;
  customerName: string;
  email: string;
  phone: string;
  destination: string;
  destinationId: string;
  travel_date: string;
  passengers: number;
  pickup_location?: string;
  number_of_persons?: number;
  persons?: number;
  trip_type?: string;
  return_date?: string;
  service_type?: string;
  hotelPreference?: string;
  specialRequests?: string;
  additional_requirements?: string;
  booking_status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingStatus?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  userId?: string;
}

class LocalBookingService {
  private readonly STORAGE_KEY = 'pavithra_travels_bookings';

  // Generate unique booking ID
  private generateBookingId(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `PNR${randomDigits}`;
  }

  // Get all bookings from localStorage
  private getBookings(): BookingData[] {
    try {
      // Check both possible storage keys for backward compatibility
      let stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        stored = localStorage.getItem('pavithra_bookings');
      }
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading bookings from localStorage:', error);
      return [];
    }
  }

  // Save bookings to localStorage
  private saveBookings(bookings: BookingData[]): void {
    try {
      const bookingData = JSON.stringify(bookings);
      localStorage.setItem(this.STORAGE_KEY, bookingData);
      localStorage.setItem('pavithra_bookings', bookingData);
    } catch (error) {
      console.error('Error saving bookings to localStorage:', error);
    }
  }

  // Create a new booking
  createBooking(bookingRequest: any): BookingData {
    const bookings = this.getBookings();

    const newBooking: BookingData = {
      bookingId: bookingRequest.bookingId || this.generateBookingId(),
      customerName: bookingRequest.name || bookingRequest.customerName,
      email: bookingRequest.email,
      phone: bookingRequest.phone,
      destination: this.getDestinationName(bookingRequest.destinationId),
      destinationId: bookingRequest.destinationId,
      travel_date: bookingRequest.travelDate || bookingRequest.travel_date,
      passengers: bookingRequest.passengers || 1,
      pickup_location: bookingRequest.pickupLocation || bookingRequest.pickup_location,
      number_of_persons: bookingRequest.numberOfPersons || bookingRequest.number_of_persons,
      persons: bookingRequest.persons,
      trip_type: bookingRequest.tripType || bookingRequest.trip_type,
      return_date: bookingRequest.returnDate || bookingRequest.return_date,
      service_type: bookingRequest.serviceType || bookingRequest.service_type,
      hotelPreference: bookingRequest.hotelPreference,
      specialRequests: bookingRequest.specialRequests,
      additional_requirements: bookingRequest.additional_requirements || bookingRequest.specialRequests || bookingRequest.additional_requirements,
      booking_status: bookingRequest.bookingStatus || bookingRequest.booking_status || 'pending',
      bookingStatus: bookingRequest.bookingStatus || bookingRequest.booking_status || 'pending',
      createdAt: new Date().toISOString(),
      userId: bookingRequest.userId,
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
  updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): BookingData | null {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(booking => booking.bookingId === bookingId);

    if (bookingIndex === -1) {
      return null;
    }

    bookings[bookingIndex].bookingStatus = status;
    this.saveBookings(bookings);

    return bookings[bookingIndex];
  }

  // Get all bookings for a specific user
  getUserBookings(userId: string): BookingData[] {
    const bookings = this.getBookings();
    return bookings.filter(booking => booking.userId === userId);
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