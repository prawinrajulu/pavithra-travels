import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { destinations } from '../data/chatbot-data';
import { apiClient } from '../../services/apiClient';
import { Calendar, Users, MapPin, Phone, CheckCircle } from 'lucide-react';
import { SmartImage } from '../components/ui/SmartImage';
import { BackButton } from '../components/back-button';

export function BookingUnified() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    phone: '',
    travelDate: '',
    passengers: 1,
    specialRequests: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) {
      const dest = destinations.find(d => d.slug === id || d.id === id);
      setDestination(dest || null);
    } else {
      setDestination(null);
    }
  }, [id]);

  useEffect(() => {
    if (user && !formData.phone) {
       setFormData(prev => ({ ...prev, phone: user.phone || '' }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDestinationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      // Redirect to the selected destination booking page
      navigate(`/booking/${selectedId}`);
    } else {
      navigate(`/booking`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) {
      setError("Please select a valid destination to proceed.");
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      const response = await apiClient.createBooking({
        name: user.name,
        email: user.email,
        phone: formData.phone,
        destinationId: destination.id,
        destinationName: destination.name,
        travelDate: formData.travelDate,
        passengers: formData.passengers,
        specialRequests: formData.specialRequests,
        userId: user.id
      });

      if (response && response.booking) {
        navigate(`/booking-success?bookingId=${response.booking.bookingId}`);
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

  return (
    <div className="bg-white min-h-screen py-12" style={{ fontFamily: 'var(--font-sans)' }}>
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching destination-detail */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 600 }}>
            {destination ? `Book ${destination.name}` : "Book Your Journey"}
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Plan your perfect travel experience with Pavithra Travels.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Destination Dropdown */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 ml-1">Destination *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-amber-500" />
                  </div>
                  <select
                    value={destination?.slug || ""}
                    onChange={handleDestinationSelect}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none appearance-none"
                    required
                  >
                    <option value="" disabled>Select a destination</option>
                    {destinations.map(dest => (
                      <option key={dest.slug} value={dest.slug}>{dest.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium focus:outline-none"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.email || ''}
                    className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-amber-500 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-medium transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Travel Date *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-amber-500 transition-colors" />
                    </div>
                    <input
                      type="date"
                      name="travelDate"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.travelDate}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-medium transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Total Persons *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-amber-500 transition-colors" />
                    </div>
                    <input
                      type="number"
                      name="passengers"
                      min="1" 
                      max="199"
                      required
                      value={formData.passengers}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 ml-1">Additional Requirements</label>
                <textarea
                  name="specialRequests"
                  rows={4}
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-medium transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
                  placeholder="Tell us about special requests, dietary needs..."
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl text-center border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !destination}
                className="w-full bg-[#FF8C00] text-white font-bold text-lg py-5 px-8 rounded-2xl inline-flex justify-center items-center hover:bg-[#F28C00] transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none"
              >
                {submitting ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
          
          {/* Destination Preview Column matching destination-detail */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {destination ? (
              <div className="space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200 group flex items-center justify-center h-[300px]">
                  <SmartImage
                    destinationName={destination.name}
                    fallbackUrl={destination.imageUrl || ""}
                    className="w-full h-full"
                    fillMode="contain"
                    height="100%"
                    alt={destination.name}
                  />
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                  <h3 className="text-2xl text-gray-900 mb-2 font-semibold">{destination.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 text-amber-500" />
                    <span>{destination.state}</span>
                  </div>
                  <p className="text-gray-600 font-light mb-6 line-clamp-3">
                    {destination.description}
                  </p>
                  <ul className="space-y-2">
                    {destination.highlights?.slice(0, 3).map((h: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
             <div className="rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 flex flex-col items-center justify-center h-[400px] text-center p-8">
               <MapPin className="h-16 w-16 text-slate-300 mb-4" />
               <h3 className="text-xl text-slate-500 font-medium mb-2">No Destination Selected</h3>
               <p className="text-slate-400 font-light">Please select a destination from the dropdown to view its details.</p>
             </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
