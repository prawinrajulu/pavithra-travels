import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Booking {
  id: string;
  pnrNumber: string;
  userId: string;
  destinationId: string;
  destinationName: string;
  destinationState: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

interface BookingContextType {
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'pnrNumber' | 'status' | 'createdAt'>) => string;
  getBookingByPNR: (pnrNumber: string) => Booking | null;
  getUserBookings: (userId: string) => Booking[];
  updateBookingStatus: (pnrNumber: string, status: Booking['status']) => boolean;
  generatePNR: () => string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage on mount
    const savedBookings = localStorage.getItem('pavithra_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const generatePNR = (): string => {
    // Generate unique PNR: PNR + 6 digits
    const timestamp = Date.now().toString().slice(-6);
    return `PNR${timestamp}`;
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'pnrNumber' | 'status' | 'createdAt'>): string => {
    const pnrNumber = generatePNR();
    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      pnrNumber,
      status: 'Confirmed', // Default status
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('pavithra_bookings', JSON.stringify(updatedBookings));
    
    return pnrNumber;
  };

  const getBookingByPNR = (pnrNumber: string): Booking | null => {
    return bookings.find(booking => booking.pnrNumber === pnrNumber) || null;
  };

  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const updateBookingStatus = (pnrNumber: string, status: Booking['status']): boolean => {
    const bookingIndex = bookings.findIndex(booking => booking.pnrNumber === pnrNumber);
    if (bookingIndex === -1) return false;

    const updatedBookings = [...bookings];
    updatedBookings[bookingIndex] = { ...updatedBookings[bookingIndex], status };
    
    setBookings(updatedBookings);
    localStorage.setItem('pavithra_bookings', JSON.stringify(updatedBookings));
    
    return true;
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      getBookingByPNR,
      getUserBookings,
      updateBookingStatus,
      generatePNR
    }}>
      {children}
    </BookingContext.Provider>
  );
};
