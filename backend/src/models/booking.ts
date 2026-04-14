export interface Booking {
  id: string;
  bookingId: string; // TRV-XXXXXX format
  userId?: string;
  name: string;
  email?: string;
  phone: string;
  destinationId: string;
  destinationName: string;
  travelDate: Date;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string | null;
  hotelPreference?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  userId?: string;
  name: string;
  email?: string;
  phone: string;
  destinationId: string;
  destinationName?: string;
  travelDate: string;
  passengers: number;
  hotelPreference?: string;
  specialRequests?: string;
}

export interface BookingResponse extends Booking {
  userEmail?: string;
  userPhone?: string;
}
