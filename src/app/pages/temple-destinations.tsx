import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { BackButton } from "../components/back-button";
import { temples } from "../data/temples";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ChatBot } from "../components/chatbot";

export function TempleDestinations() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackButton />
      
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4">Temple Destinations</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore sacred temples across India with comfortable and personalized travel service
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {temples.map((temple) => (
              <Link
                key={temple.id}
                to={`/temples/${temple.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl text-white mb-1">{temple.name}</h3>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{temple.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{temple.shortDescription}</p>
                  <div className="flex items-center gap-2 text-amber-600 group-hover:gap-3 transition-all">
                    <span className="text-sm">View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
}