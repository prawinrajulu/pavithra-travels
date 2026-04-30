import { useEffect, useState } from "react";
import { travelData } from "../data/travel-data";
import { DestinationCard } from "./destination-card";
import { apiClient } from "../../services/apiClient";
import { Loader2 } from "lucide-react";

export function Packages() {
  const [specialTrips, setSpecialTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialTrips = async () => {
      try {
        const response = await apiClient.getDestinations();
        if (response.success) {
          // Filter for special trips
          const special = response.destinations.filter((d: any) => d.isSpecial);
          setSpecialTrips(special);
        }
      } catch (error) {
        console.error("Error fetching special trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialTrips();
  }, []);

  // Use dynamic special trips if available, otherwise fallback to first 4 static packages
  const displayTrips = specialTrips.length > 0 ? specialTrips : travelData.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Popular Packages
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked travel experiences designed for comfort, adventure, and memories that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayTrips.map((pkg) => (
            <DestinationCard key={pkg.id} destination={pkg} />
          ))}
          {loading && specialTrips.length === 0 && (
            <div className="col-span-full flex justify-center py-4">
              <Loader2 className="h-6 w-6 text-[#FF8C00]/30 animate-spin" />
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <a href="/destinations" className="inline-flex items-center gap-2 bg-white text-[#FF8C00] px-6 py-3 rounded-lg border border-[#FF8C00]/20 hover:bg-[#FF8C00]/5 font-bold transition-all">
            View All Destinations
          </a>
        </div>
      </div>
    </section>
  );
}
