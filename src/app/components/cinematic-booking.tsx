import { useState, useEffect } from "react";
import { Users, User as UserIcon, MapPin, ArrowRight, Check, Calendar, Phone, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { destinations } from "../data/chatbot-data";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../../services/apiClient";

interface FormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  destinationId: string;
  travelDate: string;
  passengers: number;
  specialRequests: string;
}

export function CinematicBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const getDestinationName = (val: string) => {
    if (!val) return "";
    const lower = val.toLowerCase();
    const found = destinations.find(
      d => d.id.toLowerCase() === lower || d.slug.toLowerCase() === lower
    );
    return found ? found.name : val;
  };

  const getDestinationFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("destination") || "";
    return getDestinationName(raw);
  };

  const getDestinationIdFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("destination") || "";
    const lower = raw.toLowerCase();
    const found = destinations.find(
      d => d.id.toLowerCase() === lower || d.slug.toLowerCase() === lower || (d.name && d.name.toLowerCase() === lower)
    );
    return found ? found.id : "";
  };

  const getTripFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("trip") || "";
  };

  const getDestinationForTrip = (tripType: string) => {
    const tripDestinations: { [key: string]: string } = {
      "family-trips": "Family Trips",
      "temple-visits": "Temple Visits",
      "custom-routes": "Custom Routes",
      "personal-service": "Personal Service",
      "tirupati": "tirupati-balaji",
      "rameswaram": "rameswaram",
      "varanasi": "varanasi",
      "kedarnath": "kedarnath",
      "badrinath": "badrinath",
      "madurai": "meenakshi-temple",
      "kerala": "munnar",
      "goa": "goa",
      "rajasthan": "rajasthan-heritage",
      "himachal": "rohtang-pass",
      "uttarakhand": "kedarnath",
      "karnataka": "tirupati-balaji"
    };
    const slug = tripDestinations[tripType] || "";
    if (slug) {
      const found = destinations.find(d => d.slug === slug || d.id === slug);
      return found ? found.name : "";
    }
    return "";
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    destination: getDestinationFromQuery() || getDestinationForTrip(getTripFromQuery()),
    destinationId: getDestinationIdFromQuery(),
    travelDate: "",
    passengers: 1,
    specialRequests: "",
  });

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  // Sync user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  useEffect(() => {
    const dest = getDestinationFromQuery();
    const destId = getDestinationIdFromQuery();
    const trip = getTripFromQuery();
    const tripDest = getDestinationForTrip(trip);
    
    if (dest && dest !== formData.destination) {
      setFormData(prev => ({ ...prev, destination: dest, destinationId: destId }));
    } else if (trip && tripDest && tripDest !== formData.destination) {
      setFormData(prev => ({ ...prev, destination: tripDest }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "passengers") {
        const val = parseInt(value);
        if (val >= 200) return;
        setFormData(prev => ({ ...prev, [name]: val || 1 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.createBooking({
        ...formData,
        userId: user?.id
      });

      if (response && response.booking) {
        navigate(`/booking-success?bookingId=${response.booking.bookingId}`);
      } else {
        throw new Error("Failed to process booking");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to process booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#FF8C00]/30 border-t-[#FF8C00] rounded-full animate-spin"></div>
          <p className="text-[#0B132B]/50 animate-pulse text-sm font-light">Preparing Your Journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFBF0]" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Cinematic Background with Parallax */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF0]/20 via-[#FFFBF0]/10 to-[#FFFBF0]/10 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop&auto=format"
          alt="Travel background"
          className="w-full h-full object-cover opacity-70 blur-[2px]"
          style={{
            transform: 'scale(1.1)',
            animation: 'parallax 20s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <header className="bg-white/80 backdrop-blur-md border-b border-[#0B132B]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-[#0B132B] text-2xl tracking-tighter hover:text-[#FF8C00] transition-colors" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                Pavithra Travels
              </Link>
              <Link 
                to="/destinations" 
                className="text-[#0B132B]/60 hover:text-[#0B132B] font-light transition-all px-6 py-2 rounded-xl bg-[#0B132B]/5 flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-[#FF8C00]" />
                Explore
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center pt-8 pb-10 px-4">
        <div className="w-full max-w-4xl text-left mb-8">
           <Link to="/destinations" className="inline-flex items-center gap-2 text-[#0B132B]/50 hover:text-[#0B132B] transition-colors font-light group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Back to Explore
           </Link>
        </div>
        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl sm:text-7xl text-[#0B132B] mb-6 animate-fade-in" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            Book Your Journey
          </h1>
          <p className={`text-xl sm:text-2xl text-[#0B132B]/70 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Plan your perfect travel experience with Pavithra Travels.
          </p>
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="relative z-10 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            
            {/* Form Header */}
            <div className="text-center mb-12">
              <h2 className="text-5xl text-[#0B132B] mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Complete Your Booking</h2>
              <p className="text-[#0B132B]/50 font-light">Fill in your details to confirm your travel plans</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Details Section */}
              <div className={`space-y-6 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="bg-white rounded-3xl p-8 border border-[#0B132B]/5 shadow-sm">
                  <h3 className="text-2xl text-[#0B132B] mb-8 flex items-center gap-3 tracking-tighter" style={{ fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
                    <UserIcon className="h-7 w-7 text-[#FF8C00]" />
                    Customer Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#0B132B] text-sm font-light mb-3 ml-1 uppercase tracking-widest opacity-80">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/20" />
                        <input
                          type="text"
                          readOnly
                          value={formData.name}
                          className="w-full pl-12 pr-4 py-4.5 bg-[#FFFBF0]/50 border border-[#0B132B]/10 rounded-2xl text-[#0B132B]/40 cursor-not-allowed font-light focus:outline-none"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#0B132B] text-sm font-light mb-3 ml-1 uppercase tracking-widest opacity-80">Email Address </label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="email"
                          readOnly
                          value={formData.email}
                          className="w-full pl-12 pr-4 py-4.5 bg-[#FFFBF0]/50 border border-[#0B132B]/10 rounded-2xl text-[#0B132B]/40 cursor-not-allowed font-light focus:outline-none"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#0B132B] text-sm font-light mb-3 ml-1 uppercase tracking-widest opacity-80">Phone Number </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/20" />
                        <input
                          type="tel"
                          readOnly
                          value={formData.phone}
                          className="w-full pl-12 pr-4 py-4.5 bg-[#FFFBF0]/50 border border-[#0B132B]/10 rounded-2xl text-[#0B132B]/40 cursor-not-allowed font-light focus:outline-none"
                          placeholder="+91 Phone"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#0B132B] text-sm font-light mb-3 ml-1 uppercase tracking-widest opacity-80">Destination </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/20" />
                        <input
                          type="text"
                          readOnly
                          value={formData.destination}
                          className="w-full pl-12 pr-4 py-4.5 bg-[#FFFBF0]/50 border border-[#0B132B]/10 rounded-2xl text-[#0B132B]/40 cursor-not-allowed font-light focus:outline-none"
                          placeholder="Destination"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details Section */}
              <div className={`space-y-6 transition-all duration-700 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="bg-white rounded-3xl p-8 border border-[#0B132B]/5 shadow-sm">
                  <h3 className="text-2xl text-[#0B132B] mb-8 flex items-center gap-3 tracking-tighter" style={{ fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
                    <Calendar className="h-7 w-7 text-blue-500" />
                    Trip Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#0B132B] text-sm font-light mb-3 ml-1 uppercase tracking-widest">Travel Date *</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/30 group-focus-within:text-[#FF8C00] transition-colors" />
                        <input
                          type="date"
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-4.5 bg-white border-2 border-[#0B132B]/5 rounded-2xl text-[#0B132B] font-light transition-all [color-scheme:light]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#0B132B] text-sm font-light mb-3 ml-1 uppercase tracking-widest">Total Persons * (Max: 199)</label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/30 group-focus-within:text-[#FF8C00] transition-colors" />
                        <input
                          type="number"
                          name="passengers"
                          value={formData.passengers}
                          onChange={handleChange}
                          required
                          min="1"
                          max="199"
                          className="w-full pl-12 pr-4 py-4.5 bg-white border-2 border-[#0B132B]/5 rounded-2xl text-[#0B132B] font-light focus:outline-none focus:border-[#FF8C00] transition-all"
                          placeholder="Number of persons"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Requirements Section */}
              <div className={`space-y-6 transition-all duration-700 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="bg-white rounded-3xl p-8 border border-[#0B132B]/5 shadow-sm">
                  <h3 className="text-2xl text-[#0B132B] mb-8 flex items-center gap-3 tracking-tighter" style={{ fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
                    <ArrowRight className="h-7 w-7 text-green-500" />
                    Additional Requirements
                  </h3>
                  <div>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-6 py-5 bg-white border-2 border-[#0B132B]/5 rounded-2xl text-[#0B132B] font-light placeholder-[#0B132B]/20 focus:outline-none focus:border-[#FF8C00] transition-all resize-none"
                      placeholder="Tell us about extra details, luggage needs, or special requests..."
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-2xl text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className={`text-center transition-all duration-700 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex items-center gap-4 bg-[#0B132B] text-white px-14 py-6 rounded-full text-xl font-light shadow-[0_20px_50px_rgba(11,19,43,0.3)] hover:bg-[#1C2541] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="relative z-10">{loading ? 'Processing...' : 'Confirm Reservation'}</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <Check className="h-6 w-6 relative z-10" />
                </button>
                <p className="text-[#0B132B]/40 text-sm mt-6 font-light ml-1 uppercase tracking-widest">
                  Secure 256-bit encrypted booking
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes parallax {
          0% { transform: scale(1.1) translateY(0); }
          50% { transform: scale(1.1) translateY(-20px); }
          100% { transform: scale(1.1) translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1100 { animation-delay: 1100ms; }
        .delay-1300 { animation-delay: 1300ms; }
        
        }
      `}</style>
    </div>
  );
}
