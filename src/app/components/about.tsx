import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Users, MapPinned, Clock, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1000+",
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1715015175957-751f1288cef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZ2VudCUyMHBsYW5uaW5nJTIwSW5kaWElMjB0b3VyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjQ1NTU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional travel planning"
                className="w-full h-auto"
              />
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
                We specialize in all-India travel including family trips, temple visits, and customized tour packages. 
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
                  className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100"
                >
                  <stat.icon className="h-6 w-6 text-amber-600 mb-2" />
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