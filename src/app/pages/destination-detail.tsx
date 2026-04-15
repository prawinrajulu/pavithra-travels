import { BackButton } from "../components/back-button";
import { destinations } from "../data/chatbot-data";
import { MapPin, CheckCircle, Phone, Calendar, Users } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { SmartImage } from "../components/ui/SmartImage";
import { ShareTrip } from "../components/share-trip";

export function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const destination = destinations.find(d => d.slug === slug || d.id === slug);

  if (!destination) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl text-gray-900 mb-4">Destination not found</h1>
          <Link
            to="/destinations"
            className="text-amber-600 hover:text-amber-700"
          >
            ← Back to All Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <BackButton />
      
      <section className="py-12" style={{ fontFamily: 'var(--font-sans)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="sticky top-24">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200 group flex items-center justify-center h-[400px] sm:h-[500px]">
                <SmartImage
                  destinationName={destination.name}
                  fallbackUrl={destination.imageUrl || ""}
                  className="w-full h-full"
                  fillMode="contain"
                  height="100%"
                  alt={destination.name}
                />
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
                <h1 className="text-5xl sm:text-6xl text-gray-900 mb-6 tracking-tight" style={{ fontWeight: 600 }}>{destination.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-8">
                  <MapPin className="h-6 w-6 text-amber-500" />
                  <span className="text-xl">{destination.state}</span>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed font-light">
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

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Best Season</h3>
                <p className="text-gray-600">{destination.bestSeason}</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl text-gray-900 mb-4">Ready to Book This Trip?</h2>
                <p className="text-gray-600 mb-6">
                  Contact us to plan your journey to {destination.name}. We'll handle all travel arrangements 
                  with personalized care and attention to ensure a comfortable and memorable experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/booking/${destination.slug}`}
                    className="flex-1 bg-[#FF8C00] text-white px-8 py-5 rounded-2xl hover:bg-[#F28C00] transition-all shadow-xl shadow-orange-500/20 text-center font-bold text-lg"
                  >
                    Book Now
                  </Link>
                  <ShareTrip 
                    tripName={destination.name}
                    tripUrl={`https://pavithratravels.com/trip/${destination.id}`}
                  />
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

    </div>
  );
}