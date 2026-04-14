import { Star, Clock, MapPin, Users, Calendar, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [destination, setDestination] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    travelDate: '',
    numberOfPeople: 1,
    phone: user?.phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Find destination by ID
    const found = servicesData.find(d => d.id === id || d.slug === id);
    if (!found) {
      navigate('/destinations');
      return;
    }
    setDestination(found);
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bookingData.travelDate) {
      setError('Please select a travel date');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('[BOOKING] Initiating backend booking for user:', user.id);
      const response = await apiClient.createBooking({
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: bookingData.phone,
        destinationId: destination.id,
        destinationName: destination.title,
        travelDate: bookingData.travelDate,
        passengers: bookingData.numberOfPeople,
        specialRequests: '' // Default for standard page
      });

      if (response && response.booking) {
        const pnrNumber = response.booking.bookingId;
        console.log('[BOOKING] Success! PNR:', pnrNumber);
        setSuccess(`Booking confirmed! Your PNR number is: ${pnrNumber}`);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error('[BOOKING] Failed:', error);
      setError(error.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-90" />
        <ImageWithFallback 
          src={destination.image}
          alt={destination.title}
          className="w-full h-full opacity-30"
          fillMode="cover"
        />
      </div>

      {/* Booking Content */}
      <div className="relative z-10 min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Destination Details */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Destination Image */}
                <div className="relative h-64 bg-slate-50">
                  <ImageWithFallback 
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full"
                    fillMode="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">{destination.title}</h1>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{destination.location}</span>
                    </div>
                  </div>
                </div>

                {/* Destination Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-white">⭐ {destination.rating}.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-white">Custom Duration</span>
                    </div>
                  </div>

                  <p className="text-white/80">Experience an unforgettable journey to {destination.title}, beautifully located in {destination.location}. Book your dream trip today.</p>

                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">Inclusions:</h4>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                      <span className="text-white/70 text-sm">Premium Accommodation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                      <span className="text-white/70 text-sm">Guided Tours</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                      <span className="text-white/70 text-sm">All Transfers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Complete Your Booking</h2>

                {/* User Info Display */}
                {user && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <h3 className="text-white font-semibold mb-2">Booking For:</h3>
                    <div className="space-y-1 text-white/80 text-sm">
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                       Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      required
                      placeholder="+91 98765 43210"
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {/* Travel Date */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.travelDate}
                      onChange={(e) => setBookingData({...bookingData, travelDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      <Users className="inline h-4 w-4 mr-2" />
                      Number of People
                    </label>
                    <select
                      value={bookingData.numberOfPeople}
                      onChange={(e) => setBookingData({...bookingData, numberOfPeople: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num} className="text-gray-900">
                          {num} {num === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trip Summary */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <div className="space-y-2 text-white/90">
                      <div className="flex justify-between">
                        <span>Number of people:</span>
                        <span className="font-semibold text-amber-400">{bookingData.numberOfPeople}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20 text-sm text-white/70">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span>This package includes premium services and zero hidden charges.</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      <p className="text-green-200 text-sm">{success}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !!success}
                    className="w-full bg-[#FF8C00] text-white px-6 py-3 rounded-xl hover:bg-[#F28C00] transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      'Processing Booking...'
                    ) : success ? (
                      'Booking Confirmed!'
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
