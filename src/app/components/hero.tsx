import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Import hero images from assets
import attariBorderImg from "../../assets/Attari Border.jpg";
import assamTeaImg from "../../assets/Assam.jpg";
import badrinathTempleImg from "../../assets/Badrinath Temple.jpg";
import amritsarImg from "../../assets/Amritsar.jpg";
import amarnathYatraImg from "../../assets/Amarnath Yatra.jpg";

// Dedicated hero slide data
const heroSlides = [
  {
    id: 1,
    image: attariBorderImg,
    title: "Patriotic",
    highlight: "Pride",
    description: "Witness the grand beating retreat ceremony and the towering national flag at the Wagah-Attari border."
  },
  {
    id: 2,
    image: assamTeaImg,
    title: "Serene",
    highlight: "Escapes",
    description: "Wander through the emerald green tea plantations and misty valleys of India's hill stations."
  },
  {
    id: 3,
    image: badrinathTempleImg,
    title: "Divine",
    highlight: "Journeys",
    description: "Seek spiritual solace at the colorful Badrinath Temple, nestled in the majestic lap of the Himalayas."
  },
  {
    id: 4,
    image: amritsarImg,
    title: "Sacred",
    highlight: "Harmony",
    description: "Experience the ethereal beauty and tranquil waters of the Golden Temple at the break of dawn."
  },
  {
    id: 5,
    image: amarnathYatraImg,
    title: "Eternal",
    highlight: "Devotion",
    description: "Reach the sacred ice lingam of Lord Shiva in the holy Amarnath Cave, a pilgrimage of a lifetime."
  }
];

export function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [AutoplayPlugin({ delay: 5000, stopOnInteraction: false })]
  );


  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
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
    <section className="relative bg-[#FFFBF0] overflow-hidden">

      {/* Slider */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">

              <div className="absolute inset-0 animate-[zoomIn_5s_ease-out_forwards]">
                <ImageWithFallback
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full"
                  fillMode="cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[500px] sm:min-h-[650px] flex items-center">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6 animate-[fadeIn_1s_ease-out]">

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm text-white font-medium">
                  Professional Tourism Company
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white transition-all duration-500">
                {heroSlides[selectedIndex]?.title || "Explore India"}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#F28C00]">
                  {heroSlides[selectedIndex]?.highlight || "with Comfort & Care"}
                </span>
              </h1>

              <p className="text-lg text-white/90 max-w-xl transition-all duration-500">
                {heroSlides[selectedIndex]?.description || "Discover spiritual, cultural, and scenic journeys across India."}
              </p>

              <div className="flex gap-4">

                <a
                  href="#contact"
                  className="bg-[#FF8C00] text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Book Your Trip
                </a>

                <a
                  href="#services"
                  className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg border border-white/40"
                >
                  Explore Packages
                </a>

              </div>

              <div className="flex items-center gap-2 text-sm text-white/90">
                <MapPin className="h-4 w-4 text-primary" />
                <span>All Over India Travel Service</span>
              </div>

            </div>

          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">

  
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-12 h-3 bg-[#FF8C00]"
                      : "w-3 h-3 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">

              <button
                onClick={scrollPrev}
                className="p-2 rounded-full bg-white/20 border border-white/30 text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={scrollNext}
                className="p-2 rounded-full bg-white/20 border border-white/30 text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}