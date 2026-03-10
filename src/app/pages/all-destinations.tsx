import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { BackButton } from "../components/back-button";
import { ChatBot } from "../components/chatbot";
import { destinations } from "../data/chatbot-data";
import { MapPin, Clock, Filter } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export function AllDestinations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "temple", label: "Temple Tours" },
    { value: "family", label: "Family Trips" },
    { value: "beach", label: "Beach Vacations" },
    { value: "hill-station", label: "Hill Stations" },
    { value: "adventure", label: "Adventure" }
  ];

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "north", label: "North India" },
    { value: "south", label: "South India" },
    { value: "east", label: "East India" },
    { value: "west", label: "West India" },
    { value: "central", label: "Central India" }
  ];

  const filteredDestinations = destinations.filter(d => {
    const categoryMatch = selectedCategory === "all" || d.category === selectedCategory;
    const regionMatch = selectedRegion === "all" || d.region === selectedRegion;
    return categoryMatch && regionMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackButton />
      
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl text-gray-900 mb-6">
              Explore All Destinations
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover amazing travel experiences across India. From spiritual journeys to family adventures, 
              we have the perfect destination for every traveler.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              {regions.map(reg => (
                <option key={reg.value} value={reg.value}>{reg.label}</option>
              ))}
            </select>

            {(selectedCategory !== "all" || selectedRegion !== "all") && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRegion("all");
                }}
                className="text-sm text-amber-600 hover:text-amber-700 underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredDestinations.length}</span> destination{filteredDestinations.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination) => (
              <Link
                key={destination.id}
                to={destination.category === "temple" ? `/temples/${destination.id}` : `/destinations/${destination.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <MapPin className="h-12 w-12" />
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {destination.category}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
                    {destination.region} India
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">{destination.state}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="text-amber-600 font-semibold text-xs">
                      {destination.budget.split(' - ')[0]}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No destinations found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRegion("all");
                }}
                className="text-amber-600 hover:text-amber-700 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
}