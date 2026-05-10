import { useState } from "react";
import { Church, MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { destinations } from "../data/chatbot-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TempleTripsReveal() {
  const [isHovered, setIsHovered] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // Filter temple destinations
  const templeDestinations = destinations.filter(d => d.category === "temple").slice(0, 3);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setShowCards(true), 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowCards(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">Sacred Temple Journeys</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience divine bliss with our carefully curated spiritual tours
          </p>
        </div>

        {/* Temple Trips Hover Trigger */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-8 py-4 bg-[#FF8C00] text-white rounded-full cursor-pointer transition-all duration-500 ${isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'}`}>
              <Church className="h-6 w-6" />
              <span className="text-lg font-semibold">Temple Trips</span>
              <ArrowRight className={`h-5 w-5 transition-transform duration-500 ${isHovered ? 'translate-x-2' : ''}`} />
            </div>
            <p className="text-sm text-purple-600 mt-3 font-medium">Hover to explore sacred destinations</p>
          </div>

          {/* Cinematic Cards Reveal */}
          <div className={`mt-12 transition-all duration-1000 ease-out ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templeDestinations.map((destination, index) => (
                <div
                  key={destination.id}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-700 delay-${index * 100} ${
                    showCards ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}
                  style={{
                    transitionDelay: showCards ? `${index * 150}ms` : '0ms'
                  }}
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-50">
                    <ImageWithFallback 
                      src={destination.imageUrl || "https://images.unsplash.com/photo-1599453920126-68335b9f5f5c?w=400&h=300&fit=crop&auto=format"}
                      alt={destination.name}
                      className="w-full h-full"
                      fillMode="cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Spiritual Tour
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{destination.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500 italic">Customizable pilgrimage for a meaningful experience.</p>
                    </div>

                    <Link
                      to={`/booking?trip=${destination.id}`}
                      className="w-full bg-[#FF8C00] text-white py-3 px-6 rounded-lg hover:bg-[#F28C00] transition-all duration-300 font-bold text-center shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      Book Trip
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className={`text-center mt-12 transition-all duration-1000 delay-300 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-gray-600 mb-4">
                Explore {templeDestinations.length} sacred destinations with expert guidance
              </p>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                View All Temple Tours
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
