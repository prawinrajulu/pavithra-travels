import { MapPin, Clock, IndianRupee } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";

const featuredDestinations = [
  {
    id: "tirupati",
    name: "Tirupati Balaji",
    state: "Andhra Pradesh",
    category: "Temple Tour",
    duration: "2-3 Days",
    priceRange: "₹8,000 - ₹15,000",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80",
    link: "/temples/tirupati"
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    state: "Kerala",
    category: "Family Trip",
    duration: "5-6 Days",
    priceRange: "₹25,000 - ₹40,000",
    image: "https://drive.google.com/file/d/1eydBHKiR8yKe_brMrlwYvkpjOQ66UKkG/view",
    link: "/destinations/kerala"
  },
  {
    id: "goa",
    name: "Goa Beaches",
    state: "Goa",
    category: "Family Trip",
    duration: "4-5 Days",
    priceRange: "₹18,000 - ₹30,000",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    link: "/destinations/goa"
  },
  {
    id: "varanasi",
    name: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    category: "Temple Tour",
    duration: "3-4 Days",
    priceRange: "₹15,000 - ₹25,000",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
    link: "/temples/varanasi"
  }
];

export function FeaturedDestinations() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular travel packages across India
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((destination) => (
            <Link
              key={destination.id}
              to={destination.link}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {destination.category}
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
                
                <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    <span className="text-xs">{destination.priceRange.split(' - ')[0]}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
