import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Users, MapPinned, Clock, Star } from "lucide-react";
import aboutShiva from "../../assets/about-shiva.jpg";
import aboutVishnu from "../../assets/about-vishnu.jpg";

const stats = [
  {
    icon: Users,
    value: "25000+",
    label: "Happy Travelers"
  },
  {
    icon: MapPinned,
    value: "25+",
    label: "Destinations Across India"
  },
  {
    icon: Clock,
    value: "20+",
    label: "Years of Experience"
  },
  {
    icon: Star,
    value: "24/7",
    label: "Customer Support"
  }
];

export function About() {
  return (
    <section className="py-20 bg-[#FFFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6 relative items-start">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 h-auto">
                <ImageWithFallback
                  src={aboutShiva}
                  alt="Lord Shiva"
                  className="w-full h-auto"
                  fillMode="cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 h-auto">
                <ImageWithFallback
                  src={aboutVishnu}
                  alt="Lord Vishnu"
                  className="w-full h-auto"
                  fillMode="cover"
                />
              </div>
              {/* Decorative background element */}
              <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-orange-200/20 rounded-full blur-3xl"></div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">About Pavithra Travels</h2>
              <p className="text-lg text-gray-600 mb-4">
                Welcome to Pavithra Travels, your trusted partner for comfortable and safe journeys across India. 
                As a family-run startup, we take pride in providing personalized service that larger 
                companies simply can't match.
              </p>
              <p className="text-gray-600 mb-4">
                We specialize in all-India travel including temple visits, family and Honeymoon trips, Adventure and customized tour packages. 
                Every trip with us is handled with care, ensuring your comfort and safety from start to finish.
              </p>
              <p className="text-gray-600">
                We believe in building lasting relationships with our customers through honest pricing, 
                reliable service, and the personal touch that comes from treating every passenger like family.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20"
                >
                  <stat.icon className="h-6 w-6 text-primary mb-2" />
                  <p className="text-2xl text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}