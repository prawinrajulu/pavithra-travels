import { useParams, Link } from "react-router-dom";
import { servicesData } from "../data/services-data";
import { ServiceDestinationCard } from "../components/ServiceDestinationCard";
import { ArrowLeft, ChevronDown, Compass } from "lucide-react";
import { motion } from "framer-motion";

const categoryHeroImages: Record<string, string> = {
  'adventure': "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=2000&auto=format&fit=crop",
  'family-honeymoon': "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
  'temple': "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2000&auto=format&fit=crop",
  'default': "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
};

const categorySubtitles: Record<string, string> = {
  'adventure': "Explore thrilling destinations and unforgettable experiences",
  'family-honeymoon': "Create beautiful memories with your loved ones in paradise",
  'temple': "Sacred journeys to divine destinations and spiritual peace",
  'default': "Discover the hidden gems and popular wonders of India"
};

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
    if (str === 'family-honeymoon') return "Family & Honeymoon";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const heroImage = categoryHeroImages[type || 'default'] || categoryHeroImages.default;
  const subtitle = categorySubtitles[type || 'default'] || categorySubtitles.default;
  const title = type ? formatTitle(type) : "Our Services";

  const scrollToContent = () => {
    const element = document.getElementById('destinations-list');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white flex flex-col min-h-screen">
      
      {/* Modern Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/20">
              <Compass className="h-4 w-4 text-[#FF8C00]" />
              <span className="tracking-wider uppercase">Premium Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              {title} <span className="text-[#FF8C00]">Trips</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={scrollToContent}
                className="bg-[#FF8C00] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#E67E00] transition-all hover:scale-105 shadow-xl flex items-center gap-2 group"
              >
                Explore Packages
                <ChevronDown className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white opacity-60 cursor-pointer"
          onClick={scrollToContent}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      <main id="destinations-list" className="flex-grow container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-white hover:shadow-md hover:text-[#FF8C00] transition-all font-bold group mb-4"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Available Packages</h2>
            <div className="w-16 h-1 bg-[#FF8C00] mt-2 rounded-full"></div>
          </div>
          
          <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            Showing {categoryDestinations.length} curated destinations
          </div>
        </div>
        
        {categoryDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categoryDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ServiceDestinationCard destination={dest} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Compass className="h-12 w-12 text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No destinations found</h2>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any trips for the "{title}" category at the moment. Check back soon for new additions!</p>
            <Link to="/" className="mt-8 inline-block text-[#FF8C00] font-bold hover:underline">Explore all destinations</Link>
          </div>
        )}
      </main>
    </div>
  );
}
