import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { localBookingService, type BookingData } from "../../services/localBookingService";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { BackButton } from "../components/back-button";
import { Search, CheckCircle, Clock, XCircle, AlertCircle, User, Phone, MapPin, Calendar, Users } from "lucide-react";

export default function BookingStatus() {
  const [searchParams] = useSearchParams();
  const prefilledBookingId = searchParams.get('check') || '';

  const [bookingId, setBookingId] = useState(prefilledBookingId);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-check if booking ID is prefilled
  useEffect(() => {
    if (prefilledBookingId) {
      checkStatus();
    }
  }, [prefilledBookingId]);

  const checkStatus = async () => {
    if (!bookingId.trim()) {
      setError("Please enter a booking ID");
      return;
    }

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const result = localBookingService.getBooking(bookingId.trim());
      if (result) {
        setBooking(result);
      } else {
        setError("Invalid Booking ID. Please check and try again.");
      }
    } catch (err) {
      setError("Failed to fetch booking status. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Check Booking Status
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Your Booking ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                    placeholder="e.g., TRV-123456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={checkStatus}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? "Checking..." : "Check Status"}
              </button>
            </div>
          </div>

          {booking && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Booking Details
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Booking ID:</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {booking.bookingId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-semibold">{booking.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold">{booking.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p className="font-semibold">{booking.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Travel Date</p>
                      <p className="font-semibold">{formatDate(booking.travelDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Passengers</p>
                      <p className="font-semibold">{booking.passengers}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusIcon(booking.bookingStatus)}
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {booking.hotelPreference && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Hotel Preference</p>
                  <p className="font-semibold capitalize">{booking.hotelPreference}</p>
                </div>
              )}

              {booking.specialRequests && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                  <p className="font-semibold">{booking.specialRequests}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Booked on: {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}