import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { Search, Ticket, MapPin, Calendar, Users, CheckCircle, Clock, XCircle, ArrowRight, MessageSquare } from 'lucide-react';

export function CheckStatus() {
  const navigate = useNavigate();
  
  const [searchValue, setSearchValue] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    
    if (!query) {
      setError('Please enter a PNR or Phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    setBookings([]);

    try {
      console.log(`[STATUS CHECK] Searching for: ${query}`);
      
      let results: any[] = [];
      
      // Heuristic: If it has only digits and is long, it's a phone. If it has 'TRV', it's a PNR.
      const isPhone = /^\d{7,}$/.test(query.replace(/\s/g, ''));
      
      if (isPhone) {
        console.log('[STATUS CHECK] Detected Phone Number');
        const response = await apiClient.getBookingsByPhone(query);
        if (response && response.success) {
          results = response.bookings || [];
        }
      } else {
        console.log('[STATUS CHECK] Detected PNR Number');
        const response = await apiClient.getBookingStatus(query.toUpperCase());
        if (response && response.success && response.booking) {
          results = [response.booking];
        }
      }
      
      if (results.length > 0) {
        setBookings(results);
      } else {
        setError('No journeys found with these details. Please check your information or contact support.');
      }
    } catch (error: any) {
      console.error('[STATUS CHECK] Error:', error);
      setError(error.response?.data?.error || 'Failed to fetch booking details. Our servers might be busy.');
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'Pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'Cancelled':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'Pending':
        return <Clock className="h-5 w-5" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Ticket className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-90" />
        <img 
          src="https://images.unsplash.com/photo-1436491865334-ee855f28f8ed?w=1920&h=1080&fit=crop&auto=format"
          alt="Status check background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Status Check Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Check Booking Status</h1>
            <p className="text-white/80 text-lg">Enter your PNR number to track your booking</p>
          </div>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  <Ticket className="inline h-4 w-4 mr-2" />
                  Booking ID or Phone Number
                </label>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter PNR (e.g., TRV-123456) or Phone"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF8C00] text-white px-6 py-3 rounded-xl hover:bg-[#F28C00] transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    Find Journey
                    <Search className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Booking Results */}
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div key={booking.id || index} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{booking.destinationName || 'Dream Journey'}</h2>
                      <p className="text-white/80">ID: <span className="font-mono font-semibold text-amber-400">{booking.bookingId}</span></p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="font-semibold uppercase tracking-wider text-xs">{booking.status}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-6 space-y-6">
                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 rounded-lg p-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Travel Date</p>
                        <p className="text-white font-medium">
                          {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Flexible'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/20 rounded-lg p-2">
                        <Users className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Travelers</p>
                        <p className="text-white font-medium">{booking.passengers || booking.numberOfPeople} { (booking.passengers || booking.numberOfPeople) === 1 ? 'Person' : 'People'}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Info (Limited for privacy) */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-white/60">Passenger</p>
                        <p className="text-white font-medium">{booking.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60">Phone</p>
                        <p className="text-white font-mono">{booking.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {index === bookings.length - 1 && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                      >
                        Go to My Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setBookings([]);
                          setSearchValue('');
                          setSearched(false);
                        }}
                        className="flex-1 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 font-bold"
                      >
                        New Search
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Help Section */}
          {searched && bookings.length === 0 && !error && (
            <div className="text-center bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-6">We couldn't find any journeys matching your search. If you just booked, please wait a few minutes or try searching by phone number.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/destinations')}
                  className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all"
                >
                  Browse Destinations
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
