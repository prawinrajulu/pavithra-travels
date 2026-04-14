import { useParams, Link } from "react-router-dom";
import { servicesData } from "../data/services-data";
import { ServiceDestinationCard } from "../components/ServiceDestinationCard";
import { ArrowLeft } from "lucide-react";

export function ServiceCategory() {
  const { type } = useParams<{ type: string }>();
  
  // Filter destinations by category type, default to empty array if type is undefined
  const categoryDestinations = servicesData.filter(d => {
    if (type === 'family-honeymoon') {
      return d.category === 'family' || d.category === 'honeymoon';
    }
    return d.category === type;
  });
  
  // Format title gracefully
  const formatTitle = (str: string) => {
    if (str === 'family-honeymoon') return "Family & Honeymoon Trips";
    return str.charAt(0).toUpperCase() + str.slice(1) + " Trips";
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      
      {/* Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white capitalize tracking-tight">
          {type ? formatTitle(type) : "Our Services"}
        </h1>
        <div className="mt-4 text-purple-200 flex items-center justify-center gap-2">
           <Link to="/" className="hover:text-white transition-colors">Home</Link>
           <span>/</span>
           <span className="capitalize">{type ? formatTitle(type) : "Services"}</span>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-[#FF8C00] transition-all font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
        
        {categoryDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categoryDestinations.map(dest => (
              <ServiceDestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h2>
            <p className="text-gray-500">We couldn't find any trips for the "{type}" category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
