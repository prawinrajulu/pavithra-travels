export interface Booking {
  id: string;
  bookingId: string; // TRV-XXXXXX format
  userId?: string;
  name: string;
  phone: string;
  destinationId: string;
  destinationName: string;
  travelDate: Date;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  hotelPreference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  name: string;
  phone: string;
  destinationId: string;
  travelDate: string;
  passengers: number;
  hotelPreference?: string;
  specialRequests?: string;
}

export interface BookingResponse extends Booking {
  userEmail?: string;
  userPhone?: string;
}
