import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesData } from '../data/services-data';
import { destinations } from '../data/chatbot-data';
import { apiClient } from '../../services/apiClient';
import { Calendar, Users, ArrowLeft, Star, MapPin, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CinematicBookingPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    phone: '',
    travelDate: '',
    passengers: 1,
    specialRequests: ''
  });

  // Check auth and fetch destination
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    if (user && !formData.phone && user.phone) {
       setFormData(prev => ({ ...prev, phone: user.phone || '' }));
    }

    // Check in servicesData
    let dest = servicesData.find(d => d.slug === id || d.id === id);
    
    // If not found, check in destinations (chatbot-data)
    if (!dest) {
      const chatDest = destinations.find(d => d.slug === id || d.id === id);
      if (chatDest) {
        dest = {
          id: chatDest.id || '',
          slug: chatDest.slug || '',
          title: chatDest.name || '',
          category: chatDest.category || '',
          location: chatDest.state || '',
          image: chatDest.imageUrl || '',
          rating: chatDest.rating || 5,
        } as any;
      }
    }

    if (dest) {
      setDestination(dest);
    } else {
      setError('Destination not found');
    }
    
    setLoading(false);
  }, [id, isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (!user) throw new Error("User not authenticated");
      if (!destination) throw new Error("Destination invalid");
      
      const response = await apiClient.createBooking({
        name: user.name,
        email: user.email,
        phone: formData.phone,
        destinationId: destination.id,
        destinationName: destination.title,
        travelDate: formData.travelDate,
        passengers: formData.passengers,
        specialRequests: formData.specialRequests,
        userId: user.id
      });

      if (response && response.booking) {
        setBookingDetails(response.booking);
        setIsSuccess(true);
      } else {
        throw new Error("Failed to process booking");
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to process booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FFFBF0] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#FF8C00]/30 border-t-[#FF8C00] rounded-full animate-spin"></div>
          <p className="text-[#0B132B]/50 animate-pulse text-sm font-light">Loading Destination...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="bg-[#FFFBF0] flex items-center justify-center text-[#0B132B] flex-col gap-6 p-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
           <Star className="h-10 w-10 text-red-400 rotate-45" />
        </div>
        <h2 className="text-3xl font-black">{error || 'Destination Not Found'}</h2>
        <p className="text-[#0B132B]/60 max-w-md">We couldn't retrieve the details for this journey. Please try again or browse other destinations.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#0B132B] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#1C2541] transition-all shadow-xl shadow-[#0B132B]/20">
          <ArrowLeft className="h-5 w-5" /> Return to Home
        </Link>
      </div>
    );
  }

  // Success State View
  if (isSuccess) {
    return (
      <div className="relative overflow-hidden bg-[#FFFBF0] flex items-center justify-center p-4 py-20">
        <div className="relative z-20 w-full max-w-2xl bg-white border border-[#0B132B]/5 rounded-[40px] p-8 md:p-12 text-center shadow-2xl animate-fade-in-up">
           <div className="w-24 h-24 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-500" />
           </div>
           <h1 className="text-4xl md:text-5xl text-[#0B132B] mb-4" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Journey Initiated!</h1>
           <p className="text-[#0B132B]/60 text-lg mb-8 font-light">Your reservation for <span className="text-[#FF8C00] font-medium">{destination.title}</span> is processing. We've sent details to your email.</p>
           
           <div className="bg-[#0B132B]/5 border border-[#0B132B]/10 rounded-2xl p-6 mb-10 text-left">
              <div className="flex justify-between items-center mb-6 border-b border-[#0B132B]/5 pb-6">
                 <span className="text-[#0B132B]/40 text-sm uppercase tracking-widest font-medium">Booking PNR</span>
                 <span className="text-[#FF8C00] font-mono font-bold text-2xl tracking-tighter">{bookingDetails?.bookingId}</span>
              </div>
              <p className="text-[#0B132B]/60 text-sm italic mb-0 text-center">Final step: Please confirm your booking on WhatsApp to receive quick updates.</p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`https://wa.me/?text=Hello, I would like to confirm my booking ${bookingDetails?.bookingId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-green-500/20"
              >
                Confirm on WhatsApp
                <MessageSquare className="w-6 h-6" />
              </a>
              <Link to="/dashboard" className="px-10 py-5 rounded-2xl font-bold text-[#FF8C00] border border-[#FF8C00]/20 hover:bg-[#FF8C00]/5 transition-all flex items-center justify-center">
                Go to Dashboard
              </Link>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Premium Header Banner */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link to={`/destinations/${destination.slug}`} className="inline-flex items-center gap-2 text-[#0B132B]/50 hover:text-[#0B132B] transition-colors mb-8 font-medium group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Back to details
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0">
              <ImageWithFallback 
                src={destination.image || destination.imageUrl || ""} 
                alt={destination.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <span className="inline-block px-4 py-1.5 bg-[#FF8C00]/10 text-[#FF8C00] border border-[#FF8C00]/20 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
                Booking for {destination.category}
              </span>
              <h1 className="text-4xl md:text-6xl text-[#0B132B] tracking-tight" style={{ fontWeight: 700 }}>
                {destination.title}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-[#0B132B]/60">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-lg">{destination.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Booking Form Column */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl text-[#0B132B] mb-3 tracking-tight" style={{ fontWeight: 600 }}>Complete Reservation</h2>
                <p className="text-[#0B132B]/50 font-medium">Please finalize your travel details below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                
                <div className="grid sm:grid-cols-2 gap-10">
                  {/* Name (Readonly from context) */}
                  <div className="space-y-3">
                    <label className="text-[#0B132B]/60 text-sm font-bold uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.name || ''}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#0B132B]/40 cursor-not-allowed font-medium focus:outline-none"
                    />
                  </div>
                  
                  {/* Email (Readonly from context) */}
                  <div className="space-y-3">
                    <label className="text-[#0B132B]/60 text-sm font-bold uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.email || ''}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#0B132B]/40 cursor-not-allowed font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-3">
                  <label className="text-[#0B132B]/80 text-sm font-bold uppercase tracking-widest ml-1">Phone Number *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-orange-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4.5 bg-white border border-gray-200 rounded-2xl text-[#0B132B] font-medium transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[#0B132B]/80 text-sm font-bold uppercase tracking-widest ml-1">Travel Date *</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-orange-500 transition-colors" />
                      </div>
                      <input
                        type="date"
                        name="travelDate"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4.5 bg-white border border-gray-200 rounded-2xl text-[#0B132B] font-medium transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[#0B132B]/80 text-sm font-bold uppercase tracking-widest ml-1">Total Persons *</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-orange-500 transition-colors" />
                      </div>
                      <input
                        type="number"
                        name="passengers"
                        min="1" 
                        max="199"
                        required
                        value={formData.passengers}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val < 200 || !val) {
                            handleChange(e);
                          }
                        }}
                        className="w-full pl-14 pr-6 py-4.5 bg-white border border-gray-200 rounded-2xl text-[#0B132B] font-bold transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[#0B132B]/80 text-sm font-bold uppercase tracking-widest ml-1">Additional Requirements</label>
                  <textarea
                    name="specialRequests"
                    rows={4}
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-white border border-gray-200 rounded-2xl text-[#0B132B] font-medium placeholder-gray-300 transition-all focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none shadow-sm"
                    placeholder="Tell us about special requests, dietary needs, or preferences..."
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full group relative inline-flex items-center justify-center gap-4 bg-[#FF8C00] text-white font-bold text-xl py-6 px-10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#F28C00] active:translate-y-1 disabled:opacity-70 shadow-2xl shadow-orange-500/20"
                  >
                    {submitting ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Complete Reservation
                        <ArrowLeft className="h-6 w-6 rotate-180 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                    <span className="h-[1px] w-12 bg-[#0B132B]"></span>
                    <p className="text-[#0B132B] text-xs font-bold uppercase tracking-[0.2em]">Secure 256-bit Encrypted Booking</p>
                    <span className="h-[1px] w-12 bg-[#0B132B]"></span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
