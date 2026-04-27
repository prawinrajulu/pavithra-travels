import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Import hero images from assets
import attariBorderImg from "../../assets/Attari Border.jpg";
import kedarnathImg from "../../assets/destination/Kedarnath Temple.jpg";
import nepalImg from "../../assets/destination/Nepal.png";
import bhutanImg from "../../assets/destination/Bhutan.png";
import ayodhyaImg from "../../assets/destination/ayodhya.jpg";

// Dedicated hero slide data
const heroSlides = [
  {
    id: 1,
    image: kedarnathImg,
    title: "Divine",
    highlight: "Kedarnath",
    description: "Seek spiritual solace at the sacred Kedarnath Temple, nestled in the majestic lap of the Himalayas."
  },
  {
    id: 2,
    image: nepalImg,
    title: "Serene",
    highlight: "Pokhara Lake",
    description: "Experience the tranquil beauty and breathtaking mountain reflections of Phewa Lake in Nepal."
  },
  {
    id: 3,
    image: bhutanImg,
    title: "Peaceful",
    highlight: "Bhutan",
    description: "Discover the Land of the Thunder Dragon, home to mystical monasteries and pristine nature."
  },
  {
    id: 4,
    image: ayodhyaImg,
    title: "Historic",
    highlight: "Ayodhya Temple",
    description: "Visit the grand Ram Mandir in Ayodhya, a monumental symbol of faith and cultural heritage."
  },
  {
    id: 5,
    image: attariBorderImg,
    title: "Patriotic",
    highlight: "ATTARI Border",
    description: "Witness the electric atmosphere and patriotic pride of the grand Wagah-Attari border ceremony."
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

              <div className="flex flex-col sm:flex-row gap-4">

                <a
                  href="#contact"
                  className="bg-[#FF8C00] text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  Book Your Trip
                </a>

                <a
                  href="#services"
                  className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg border border-white/40 text-center"
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
          </div>

        </div>
      </div>
    </section>
  );
}