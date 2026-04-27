import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Hotel,
  Car,
  Utensils,
  Target,
  Wallet,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  BadgeCheck,
  HeadphonesIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { BackButton } from "../components/back-button";

const destinations = [
  "Goa", "Kerala", "Manali", "Shimla", "Rajasthan", "Varanasi", "Ooty", "Munnar", "Hampi", "Pondicherry"
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Family Traveler",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    feedback: "Pavithra Travels helped us plan a perfect 5-day trip to Kerala. The customization options were exactly what we needed for our family with kids.",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Adventure Enthusiast",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
    feedback: "I wanted a mix of trekking and relaxation in Manali. They managed to fit everything perfectly within my budget. Highly recommended!",
    rating: 5
  },
  {
    name: "Vikram Singh",
    role: "Spiritual Traveler",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
    feedback: "The spiritual tour they designed for my parents to Varanasi was seamless. The transport and guide were exceptional.",
    rating: 4
  }
];

export default function CustomizedTrip() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    accommodation: "Standard",
    transport: "Car",
    food: "Both",
    tripType: "Relaxation",
    budget: 20000,
    requests: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Removed cost estimation logic as preview is removed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request Received!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for choosing Pavithra Travels. Our travel expert will contact you within 24 hours with a detailed itinerary and final quote.
          </p>
          {/* Removed Trip Summary as requested */}
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-[#FF8C00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#E67E00] transition-colors shadow-lg"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <BackButton />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight">
              Plan Your <span className="text-[#FF8C00]">Own Trip</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mb-10 leading-relaxed">
              Create a travel experience tailored just for you. Every detail, from destination to dining, is under your control.
            </p>
            <button
              onClick={() => document.getElementById('custom-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#FF8C00] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#E67E00] transition-all hover:scale-105 shadow-xl flex items-center gap-2 group"
            >
              Start Planning
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Customization Form Section */}
      <section id="custom-form" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">

            {/* Form Column */}
            <div className="w-full">
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#FF8C00] rounded-lg flex items-center justify-center text-white text-xl">1</span>
                  Customize Your Preferences
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Destination */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FF8C00]" /> Destination
                      </label>
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select Destination</option>
                        {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* Travelers */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#FF8C00]" /> Travelers
                      </label>
                      <input
                        type="number"
                        name="travelers"
                        min="1"
                        max="50"
                        value={formData.travelers}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF8C00]" /> Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF8C00]" /> End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    {/* Accommodation */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-[#FF8C00]" /> Accommodation
                      </label>
                      <select
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      >
                        <option value="Budget">Budget</option>
                        <option value="Standard">Standard</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>

                    {/* Transport */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#FF8C00]" /> Transport
                      </label>
                      <select
                        name="transport"
                        value={formData.transport}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      >
                        <option value="Bus">Bus</option>
                        <option value="Car">Car</option>
                        <option value="Flight">Flight</option>
                      </select>
                    </div>

                    {/* Food */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-[#FF8C00]" /> Food Preference
                      </label>
                      <select
                        name="food"
                        value={formData.food}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Trip Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#FF8C00]" /> Trip Type
                      </label>
                      <select
                        name="tripType"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all"
                      >
                        <option value="Relaxation">Relaxation</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Spiritual">Spiritual</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>

                    {/* Budget Slider */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-[#FF8C00]" /> Budget Range
                        </span>
                        <span className="text-[#FF8C00]">₹{formData.budget.toLocaleString()}</span>
                      </label>
                      <input
                        type="range"
                        name="budget"
                        min="5000"
                        max="200000"
                        step="5000"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>₹5k</span>
                        <span>₹100k</span>
                        <span>₹200k</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Requests */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#FF8C00]" /> Additional Requests
                    </label>
                    <textarea
                      name="requests"
                      value={formData.requests}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Special requirements, specific spots you want to visit, or any other preferences..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#E67E00] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Calculating Itinerary...
                      </>
                    ) : (
                      <>
                        Get My Custom Quote
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Removed Preview Column as requested */}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Customize With Us?</h2>
            <div className="w-20 h-1.5 bg-[#FF8C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BadgeCheck, title: "100% Flexible", desc: "Change your plan anytime before booking confirmed." },
              { icon: Shield, title: "Verified Partners", desc: "Only top-rated hotels and professional drivers." },
              { icon: Wallet, title: "Best Price", desc: "No middleman fees. Direct agency prices for you." },
              { icon: HeadphonesIcon, title: "24/7 Support", desc: "On-trip assistance whenever you need it." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#FF8C00] transition-colors">
                  <item.icon className="w-7 h-7 text-[#FF8C00] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Travelers Say</h2>
            <p className="text-gray-600">Join thousands of happy travelers who planned their dream trip with us.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-8 flex-grow">"{t.feedback}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFB347] rounded-[3rem] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,100 C20,80 40,80 60,100 C80,120 100,120 100,100 L100,0 L0,0 Z" fill="white" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <h2 className="text-4xl sm:text-6xl font-extrabold mb-8">Ready to Build Your Dream Trip?</h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
                Get a personalized quote and expert advice for your next journey in just a few minutes.
              </p>
              <button
                onClick={() => document.getElementById('custom-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-[#FF8C00] px-12 py-5 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                Get Quote Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
