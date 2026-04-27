import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";
import type { ServiceDestination } from "../data/services-data";
import { SmartImage } from "./ui/SmartImage";

export function ServiceDestinationCard({ destination }: { destination: ServiceDestination }) {
  return (
    <Link to={`/destinations/${destination.slug}`} className="block h-full group">
      <div className="bg-white rounded-[2rem] shadow-sm flex flex-col h-full transition-all group-hover:shadow-2xl duration-500 border border-gray-100 overflow-hidden relative">
        
        {/* Image Section with Zoom */}
        <div className="h-64 overflow-hidden bg-gray-100 relative">
          <SmartImage
            destinationName={destination.title}
            fallbackUrl={destination.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            fillMode="cover"
            alt={destination.title}
          />
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-900 text-xs">{destination.rating}.0</span>
          </div>

          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
             <span className="text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
               View Details <ArrowRight size={16} />
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col gap-3 flex-grow">
          <div className="flex items-center gap-1 text-[#FF8C00] font-bold text-[10px] uppercase tracking-wider mb-1">
            <MapPin size={12} /> {destination.location}
          </div>
          
          <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1 group-hover:text-[#FF8C00] transition-colors">
            {destination.title}
          </h3>
          
          <div className="flex items-center gap-0.5 mt-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < destination.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-2">(Verified)</span>
          </div>
        </div>

        {/* Bottom Accent Bar */}
        <div className="h-1.5 w-0 bg-[#FF8C00] group-hover:w-full transition-all duration-700"></div>
      </div>
    </Link>
  );
}
