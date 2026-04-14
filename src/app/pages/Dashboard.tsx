import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { LogOut, MapPin, Calendar, Users, Hash, ArrowRight } from 'lucide-react';

interface Booking {
  bookingId: string;
  destinationName: string;
  travelDate: string;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      // Preference: Use phone if available, then fallback to current user's authenticated /my
      const identifier = user?.phone || localStorage.getItem('userPhone') || user?.email;
      
      if (user) {
        console.log(`[DASHBOARD] Fetching bookings for identifier: ${identifier}`);
        setLoading(true);
        try {
          let response;
          if (user.phone) {
            response = await apiClient.getBookingsByPhone(user.phone);
          } else {
            // Fallback for users without phone in profile
            response = await apiClient.getMyBookings();
          }

          if (response && response.bookings) {
            console.log(`[DASHBOARD] Received ${response.bookings.length} bookings.`);
            setBookings(response.bookings);
          }
        } catch (err: any) {
          console.error('[DASHBOARD] Fetch error:', err);
          setError('Could not retrieve your bookings. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Cinematic Header Block */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white pt-24 pb-32 px-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-light mb-2">Welcome, <span className="font-semibold">{user.name}</span></h1>
            <p className="text-white/70 text-lg">Manage your travel adventures</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-md transition-all">
              Home
            </Link>
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-100 border border-red-500/30 rounded-full flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[500px]">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-indigo-600" />
            Your Travel History
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">Retrieving your journeys...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100 p-8">
              <p className="font-medium mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm font-bold underline hover:no-underline"
              >
                Try Refreshing
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-medium text-slate-700 mb-2">No trips booked yet</h3>
              <p className="text-slate-500 mb-8">It's time to start planning your next great adventure.</p>
              <Link to="/#services" className="inline-flex items-center justify-center gap-2 bg-[#FF8C00] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#F28C00] transition-colors shadow-lg">
                Explore Destinations <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div key={booking.createdAt} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                    <span className="flex items-center gap-2 font-mono text-sm font-semibold text-indigo-700">
                      <Hash className="h-4 w-4" />
                      {booking.bookingId}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">
                      {booking.destinationName || 'Custom Destination'}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <span>Date: <strong className="text-slate-700">{new Date(booking.travelDate).toLocaleDateString()}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <Users className="h-5 w-5 text-slate-400" />
                        <span>Passengers: <strong className="text-slate-700">{booking.passengers}</strong></span>
                      </div>
                    </div>

                    <Link to={`/check-status?check=${booking.bookingId}`} className="block w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
