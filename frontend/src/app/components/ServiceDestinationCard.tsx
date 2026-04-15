import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { ServiceDestination } from "../data/services-data";
import { SmartImage } from "./ui/SmartImage";

export function ServiceDestinationCard({ destination }: { destination: ServiceDestination }) {
  return (
    <Link to={`/destinations/${destination.slug}`} className="block h-full group">
      <div className="bg-white rounded-xl shadow-lg flex flex-col h-full transition-transform group-hover:-translate-y-2 group-hover:shadow-2xl duration-300 border border-gray-100 overflow-hidden">
      <div className="h-56 overflow-hidden bg-gray-200 relative">
        <Link
          to={`/destinations/${destination.slug}`}
          className="block w-full h-full"
        >
          <SmartImage
            destinationName={destination.title}
            fallbackUrl={destination.image}
            className="w-full h-full"
            fillMode="cover"
            alt={destination.title}
          />
        </Link>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-transform group-hover:scale-110">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-gray-800 text-sm">{destination.rating}.0</span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-2 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{destination.title}</h3>
        <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {destination.location}
        </p>
        <div className="flex items-center gap-1 mt-auto pt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < destination.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      </div>
    </Link>
  );
}
