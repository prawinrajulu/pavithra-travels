import { BackButton } from "../components/back-button";
import { destinations } from "../data/chatbot-data";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SmartImage } from "../components/ui/SmartImage";

export function FamilyTrips() {
  const familyDestinations = destinations.filter(
    d => d.category === "family" || d.category === "beach" || d.category === "hill-station"
  );

  return (
    <div className="bg-white">
      <BackButton />
      
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl text-gray-900 mb-6 font-bold tracking-tight">
              Family & Honeymoon
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Create unforgettable memories with your loved ones. Our family travel packages are designed 
              for comfort, safety, and fun across India's most beautiful destinations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Popular Family Destinations</h2>
            <p className="text-gray-600">
              Handpicked destinations perfect for families seeking adventure, relaxation, and quality time together
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {familyDestinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <SmartImage
                    destinationName={destination.name}
                    fallbackUrl={destination.imageUrl}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    alt={destination.name}
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {destination.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{destination.state}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>


                  <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium group-hover:gap-3 transition-all">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl text-gray-900 mb-4">Why Choose Our Family Packages?</h3>
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Child-Friendly</h4>
                  <p className="text-sm text-gray-600">Comfortable travel with rest stops and kid-friendly accommodations</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Flexible Itinerary</h4>
                  <p className="text-sm text-gray-600">Customizable schedules to match your family's pace and preferences</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Safety First</h4>
                  <p className="text-sm text-gray-600">Professional travel arrangements with experienced team members</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✓ All-Inclusive Support</h4>
                  <p className="text-sm text-gray-600">Assistance with bookings, routes, and local recommendations</p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 bg-[#FF8C00] text-white px-8 py-3 rounded-lg hover:bg-[#F28C00] transition-all shadow-lg hover:shadow-xl"
                >
                  Book Your Family Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}