import { DestinationCard } from "./destination-card";
import { destinations } from "../data/chatbot-data";
import { useState } from "react";
import { Filter } from "lucide-react";

export function ServicesDestinationCards() {
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explore Our Trip Packages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing travel experiences across India with our curated destination packages
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 mb-12">
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

        {/* Destination Cards Grid */}
        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Showing <span className="font-semibold text-gray-900">{filteredDestinations.length}</span> destination{filteredDestinations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
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
  );
}
