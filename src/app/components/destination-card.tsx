import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TravelPackage } from "../data/travel-data";
import type { Destination } from "../data/chatbot-data";
import { SmartImage } from "./ui/SmartImage";

interface DestinationCardProps {
  destination: TravelPackage | Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  // Normalize data from different sources
  const name = destination.name;
  
  // Get fallback from data if it exists, otherwise use Unsplash via SmartImage
  const fallbackImage = "image" in destination 
    ? destination.image 
    : destination.imageUrl;
    
  // Handle different location field names
  const location = "location" in destination 
    ? destination.location 
    : destination.state;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      {/* Smart Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-50">
        <SmartImage
          destinationName={name}
          fallbackUrl={fallbackImage}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           <span className="text-white text-sm font-medium">Explore amazing {name}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{name}</h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            <span>{location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={`/destinations/${destination.slug}`}
            className="w-full bg-[#FF8C00] text-white px-4 py-3 rounded-xl hover:bg-[#F28C00] transition-all duration-300 font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
