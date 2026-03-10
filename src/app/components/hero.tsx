import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const destinations = [
  {
    name: "Taj Mahal",
    location: "Agra",
    image: "https://images.unsplash.com/photo-1748433069358-831b8a154c71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYWolMjBNYWhhbCUyMEluZGlhJTIwc3VucmlzZSUyMG1vbnVtZW50fGVufDF8fHx8MTc3MjQ1NjE3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Kedarnath Temple",
    location: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1577516311194-eb14c570a137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZWRhcm5hdGglMjB0ZW1wbGUlMjBIaW1hbGF5YSUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzI0NTYxNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Varanasi Ghats",
    location: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1701619878991-716d8fbb319f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMGdoYXRzJTIwR2FuZ2VzJTIwcml2ZXIlMjBJbmRpYXxlbnwxfHx8fDE3NzI0NTYxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Rameswaram Temple",
    location: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1709461529054-601fc5d13f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSYW1lc3dhcmFtJTIwdGVtcGxlJTIwVGFtaWwlMjBOYWR1JTIwSW5kaWF8ZW58MXx8fHwxNzcyNDU2MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Goa Beaches",
    location: "Goa",
    image: "https://images.unsplash.com/photo-1698430184854-17aa542d247c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHb2ElMjBiZWFjaCUyMEluZGlhJTIwdHJvcGljYWwlMjBzdW5zZXR8ZW58MXx8fHwxNzcyNDU2MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Hawa Mahal",
    location: "Jaipur",
    image: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWlwdXIlMjBIYXdhJTIwTWFoYWwlMjBwaW5rJTIwcGFsYWNlfGVufDF8fHx8MTc3MjQ1NjE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Kerala Backwaters",
    location: "Kerala",
    image: "https://images.unsplash.com/photo-1593417034675-3ed7eda1bee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXJzJTIwaG91c2Vib2F0JTIwSW5kaWF8ZW58MXx8fHwxNzcyNDU2MTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Ladakh Mountains",
    location: "Ladakh",
    image: "https://images.unsplash.com/photo-1668602392958-a32e0c0ff7cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWRha2glMjBtb3VudGFpbnMlMjBsYW5kc2NhcGUlMjBJbmRpYXxlbnwxfHx8fDE3NzIzOTE2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30
    },
    [AutoplayPlugin({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Slider Background */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {destinations.map((destination, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              <div className="absolute inset-0 animate-[zoomIn_5s_ease-out_forwards]">
                <ImageWithFallback
                  src={destination.image}
                  alt={`${destination.name}, ${destination.location}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Overlay - Fixed */}
      <div className="relative min-h-[600px] sm:min-h-[700px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-[fadeIn_1s_ease-out]">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/30">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm text-white font-medium">Professional Tourism Company</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-2xl">
                Explore India
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 drop-shadow-lg">
                  with Comfort & Care
                </span>
              </h1>
              
              <p className="text-lg text-white/90 max-w-xl drop-shadow-lg">
                Discover spiritual, cultural, and scenic journeys across India. Perfect for family trips, 
                temple visits, and customized tour packages throughout the country.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transform"
                >
                  Book Your Trip
                </a>
                <a
                  href="#services"
                  className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg hover:bg-white/30 transition-all border border-white/40 shadow-xl"
                >
                  Explore Packages
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/90">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>All Over India Travel Service</span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm mb-3 border border-amber-400/30">
                      <Star className="h-8 w-8 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-3xl text-white mb-1">1000+</p>
                    <p className="text-sm text-white/80">Happy Travelers</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm mb-3 border border-amber-400/30">
                      <MapPin className="h-8 w-8 text-amber-400" />
                    </div>
                    <p className="text-3xl text-white mb-1">25+</p>
                    <p className="text-sm text-white/80">Destinations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {/* Dot Indicators */}
            <div className="flex gap-2">
              {destinations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all rounded-full ${
                    index === selectedIndex
                      ? "w-12 h-3 bg-gradient-to-r from-amber-400 to-orange-400"
                      : "w-3 h-3 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all border border-white/30 text-white"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all border border-white/30 text-white"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <style>{`
        @keyframes zoomIn {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}