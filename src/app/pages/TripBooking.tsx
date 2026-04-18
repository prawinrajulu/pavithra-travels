import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { localBookingService } from "../../services/localBookingService";
import { sendBookingConfirmation } from "../../services/emailService";
import { destinations } from "../data/chatbot-data";
import { BackButton } from "../components/back-button";
import { useAuth } from "../context/AuthContext";
import { Calendar, Users, Phone, User as UserIcon, MapPin } from "lucide-react";

export default function TripBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // helper to resolve a raw query value to a valid destination id
  const resolveDestinationId = (val: string) => {
    if (!val) return "";
    const lower = val.toLowerCase();
    // try to match by id or by name
    const found = destinations.find(
      (d) => d.id.toLowerCase() === lower || d.name.toLowerCase() === lower
    );
    return found ? found.id : "";
  };

  const getDestinationFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("destination") || "";
    return resolveDestinationId(raw);
  };

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    destinationId: getDestinationFromQuery(),
    travelDate: "",
    passengers: 1,
    additional_requirements: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync user data when it arrives
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create booking using local storage
      const booking = localBookingService.createBooking({
        ...form,
        userId: user?.id
      });

      // Send email confirmation to customer
      try {
        await sendBookingConfirmation({
          to_email: booking.email,
          customer_name: booking.customerName,
          destination: booking.destination || 'Unknown Destination',
          travel_date: new Date(booking.travel_date || new Date()).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          passengers: booking.passengers || 1,
          booking_id: booking.bookingId || booking.booking_id || 'Unknown',
          booking_phone: booking.phone,
        });

        // Navigate to success page with booking ID
        navigate(`/booking-success?bookingId=${booking.bookingId}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Still navigate to success but show email failure message
        navigate(`/booking-success?bookingId=${booking.bookingId}&emailFailed=true`);
      }
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // if location.search changes (e.g. user clicks a book‑now link while already
  // on the page) update the destinationId again
  useEffect(() => {
    const destId = getDestinationFromQuery();
    if (destId && destId !== form.destinationId) {
      setForm(prev => ({ ...prev, destinationId: destId }));
    }
  }, [location.search]);

  return (
    <div className="bg-[#FFFBF0]">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Book Your Trip
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    readOnly
                    value={form.name}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed focus:outline-none"
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    required
                    readOnly
                    value={form.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed focus:outline-none"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    required
                    disabled
                    value={form.destinationId}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed appearance-none focus:outline-none"
                  >
                    <option value="">Select destination</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name} - {dest.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={form.travelDate}
                    onChange={(e) => handleInputChange("travelDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers * (Max: 199)
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="199"
                    value={form.passengers}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < 200) {
                        handleInputChange("passengers", val || 1);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements (Optional)
                </label>
                <textarea
                  value={form.additional_requirements}
                  onChange={(e) => handleInputChange("additional_requirements", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any extra details or requests for your journey..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md active:scale-[0.98]"
              >
                {loading ? "Processing..." : "Book Trip"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}