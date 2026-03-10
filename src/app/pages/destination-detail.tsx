import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { BackButton } from "../components/back-button";
import { destinations } from "../data/chatbot-data";
import { MapPin, CheckCircle, Phone, Calendar, Users } from "lucide-react";
import { useParams, Link } from "react-router";
import { ChatBot } from "../components/chatbot";

export function DestinationDetail() {
  const { destinationId } = useParams<{ destinationId: string }>();
  
  const destination = destinations.find(d => d.id === destinationId);

  if (!destination) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl text-gray-900 mb-4">Destination not found</h1>
          <Link
            to="/destinations"
            className="text-amber-600 hover:text-amber-700"
          >
            ← Back to All Destinations
          </Link>
        </div>
        <Footer />
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackButton />
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] flex items-center justify-center">
                <MapPin className="h-24 w-24 text-gray-400" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                  <Calendar className="h-5 w-5 text-amber-600 mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{destination.duration}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                  <Users className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Best For</p>
                  <p className="font-semibold text-gray-900 capitalize">{destination.category}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4 capitalize">
                  {destination.category} • {destination.region} India
                </div>
                <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4">{destination.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  <span className="text-lg">{destination.state}</span>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {destination.description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100">
                <h2 className="text-2xl text-gray-900 mb-6">Travel Highlights</h2>
                <ul className="space-y-4">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Best Season</h3>
                  <p className="text-gray-600">{destination.bestSeason}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Budget Range</h3>
                  <p className="text-amber-600 font-semibold text-lg">{destination.budget}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl text-gray-900 mb-4">Ready to Book This Trip?</h2>
                <p className="text-gray-600 mb-6">
                  Contact us to plan your journey to {destination.name}. We'll handle all travel arrangements 
                  with personalized care and attention to ensure a comfortable and memorable experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/booking"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-center font-semibold"
                  >
                    Book This Trip
                  </Link>
                  <a
                    href="tel:+919876543210"
                    className="flex-1 bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg text-gray-900 mb-2">Why Choose Pavithra Travels?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Comfortable travel arrangements</li>
                  <li>✓ Professional travel assistance</li>
                  <li>✓ Flexible itineraries tailored to your needs</li>
                  <li>✓ Transparent pricing with no hidden costs</li>
                  <li>✓ Personal care throughout your journey</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
}