import { Shield, DollarSign, Heart, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const benefits = [
  {
    icon: Shield,
    title: "Safe & Reliable",
    description: "Professional travel planning and experienced team ensure your safety on every journey."
  },
  {
    icon: DollarSign,
    title: "Affordable Rates",
    description: "Transparent pricing with no hidden charges. Quality service at honest prices."
  },
  {
    icon: Heart,
    title: "Personal Care",
    description: "As a family-run business, we treat every customer like our own family."
  },
  {
    icon: Award,
    title: "Trusted Service",
    description: "Built on trust and reliability. Your satisfaction is our priority."
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">Why Choose Pavithra Travels?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference of personalized, caring service
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1659451336016-00d62d32f677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMHZhY2F0aW9uJTIwSW5kaWElMjB0cmF2ZWwlMjBncm91cHxlbnwxfHx8fDE3NzI0NTU1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy family vacation in India"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}