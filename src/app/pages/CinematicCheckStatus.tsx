import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import { useAuth } from "../context/AuthContext";
import { Search, CheckCircle, Clock, XCircle, AlertCircle, User, Phone, MapPin, Calendar, Users, Hash, ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export function CinematicCheckStatus() {
  const [searchParams] = useSearchParams();
  const prefilledBookingId = searchParams.get('check') || '';

  const { user: currentUser } = useAuth();
  const [searchValue, setSearchValue] = useState(prefilledBookingId);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maskEmail = (email: string) => {
    if (!email) return "Not provided";
    const [name, domain] = email.split("@");
    if (!domain) return "****";
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return "Not provided";
    const p = String(phone).replace(/\D/g, '');
    if (p.length < 4) return "****";
    return `******${p.slice(-4)}`;
  };


  useEffect(() => {
    if (prefilledBookingId) {
      checkStatus();
    }
  }, [prefilledBookingId]);

  const checkStatus = async () => {
    const query = searchValue.trim().replace(/#/g, '');
    if (!query) {
      setError("Please enter a valid PNR Number or Phone");
      setBookings([]);
      return;
    }
    
    setLoading(true);
    setError("");
    setBookings([]);

    try {
      console.log(`[CINEMATIC STATUS] Searching for: ${query}`);
      let results: any[] = [];
      
      const isPhone = /^\d{7,}$/.test(query.replace(/\s/g, ''));
      
      if (isPhone) {
        console.log('[CINEMATIC STATUS] Detected Phone Number');
        const response = await apiClient.getBookingsByPhone(query);
        if (response && response.success) {
          results = response.bookings || [];
        }
      } else {
        console.log('[CINEMATIC STATUS] Detected PNR Number');
        const response = await apiClient.getBookingStatus(query.toUpperCase());
        if (response && response.success && response.booking) {
          results = [response.booking];
        }
      }

      if (results.length > 0) {
        setBookings(results);
      } else {
        setError("No journeys found with these details. Verify your PNR or try searching by phone.");
      }
    } catch (err: any) {
      console.error('[CINEMATIC STATUS] Error:', err);
      setError(err.response?.data?.error || "Error fetching status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'confirmed': return <CheckCircle className="w-12 h-12 text-emerald-400" />;
      case 'pending': return <Clock className="w-12 h-12 text-amber-400" />;
      case 'cancelled': return <XCircle className="w-12 h-12 text-rose-500" />;
      case 'completed': return <CheckCircle className="w-12 h-12 text-blue-400" />;
      default: return <AlertCircle className="w-12 h-12 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 pb-20">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>

        {/* Search Input Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-4 tracking-tight">Track Your Journey</h1>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">Enter your PNR tracking number to view your itinerary and current booking status.</p>
          
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-white/40 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter PNR or Phone Number"
              className="w-full pl-14 pr-32 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase tracking-widest transition-all shadow-2xl"
              onKeyDown={(e) => e.key === 'Enter' && checkStatus()}
            />
            <div className="absolute inset-y-2 right-2 flex">
              <button 
                onClick={checkStatus}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Track'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="max-w-xl mx-auto mt-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 py-3 rounded-xl animate-fade-in-up">
              {error}
            </div>
          )}
        </div>

        {/* Result Cards Section */}
        <div className="space-y-12">
          {bookings.map((item, index) => (
            <div key={item.id || index} className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-3xl mx-auto animate-fade-in-up relative overflow-hidden">
              
              {/* Decorative background logo/icon */}
              <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
                <MapPin className="w-64 h-64 text-white" />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8 relative z-10">
                <div>
                  <span className="text-white/50 text-sm font-medium uppercase tracking-widest mb-1 block">Booking Reference</span>
                  <div className="flex items-center gap-3">
                    <Hash className="h-6 w-6 text-blue-400" />
                    <span className="text-3xl font-mono font-bold text-white tracking-wider">
                      {item.bookingId || item.id}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {getStatusIcon(item.status)}
                  <span className="text-white/80 font-medium uppercase tracking-wider mt-2">
                    {item.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
                <div className="space-y-6">
                  <div>
                    <div className="text-white/50 text-sm mb-1">Destination</div>
                    <div className="text-xl text-white font-medium flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      {item.destinationName || item.destination || 'Custom Journey'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-white/50 text-sm mb-1">Travel Date</div>
                    <div className="text-lg text-white font-medium flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      {item.travelDate ? new Date(item.travelDate).toLocaleDateString('en-IN') : 'Flexible'}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50 text-sm mb-1">Passengers</div>
                    <div className="text-lg text-white font-medium flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      {item.numberOfPeople || item.passengers} Travelers
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-white/50 text-sm mb-1">Primary Traveler</div>
                    <div className="text-lg text-white font-medium flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      {item.name || item.customerName}
                    </div>
                  </div>

                  {/* Privacy Logic: Mask details if not owner or admin */}
                  {(() => {
                    const isOwner = currentUser && (
                      currentUser.email === item.email || 
                      (currentUser.phone && item.phone && currentUser.phone.includes(item.phone)) || 
                      (item.phone && currentUser.phone && item.phone.includes(currentUser.phone)) ||
                      currentUser.role === 'admin'
                    );

                    return (
                      <>
                        <div>
                          <div className="text-white/50 text-sm mb-1 flex items-center gap-1.5">
                            Contact Details {!isOwner && <Lock className="h-3 w-3 text-white/30" />}
                          </div>
                          <div className="text-lg text-white font-medium flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-400" />
                            {isOwner ? item.phone : maskPhone(item.phone)}
                          </div>
                        </div>

                        <div>
                          <div className="text-white/50 text-sm mb-1 flex items-center gap-1.5">
                            Email Address {!isOwner && <Lock className="h-3 w-3 text-white/30" />}
                          </div>
                          <div className="text-lg text-white font-medium flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-400" />
                            {isOwner ? item.email : maskEmail(item.email)}
                          </div>
                        </div>

                        {!isOwner && (
                          <div className="pt-4 mt-4 border-t border-white/5">
                            <p className="text-[10px] text-white/30 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                              <ShieldCheck className="h-3 w-3" /> Privacy Protected View
                            </p>
                            <p className="text-[10px] text-white/20 mt-1">Login to view full traveler details</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
