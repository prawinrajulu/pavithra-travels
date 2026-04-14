import { BackButton } from "../components/back-button";
import { travelData } from "../data/travel-data";
import { DestinationCard } from "../components/destination-card";

export function AllDestinations() {
  return (
    <div className="bg-[#FFFBF0]">
      <div className="pt-20">
        <BackButton />
      </div>
      
      <section className="bg-[#FFFBF0] py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              All Destinations
            </h1>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore our wide range of curated travel destinations across India and beyond. 
              Find your next adventure with Pavithra Travels.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-lg">
                Showing <span className="font-bold text-gray-900">{travelData.length}</span> curated destinations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {travelData.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}