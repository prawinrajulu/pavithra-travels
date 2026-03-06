import { Users, Church, MapPin, HeartHandshake } from "lucide-react";
import { Link } from "react-router";

const services = [
  {
    icon: Users,
    title: "Family Trips",
    description: "Comfortable and safe travels for your entire family with personalized care.",
    color: "from-blue-500 to-cyan-500",
    clickable: true,
    link: "/family-trips"
  },
  {
    icon: Church,
    title: "Temple Visits",
    description: "Peaceful journeys to famous temples and spiritual destinations across India.",
    color: "from-purple-500 to-pink-500",
    clickable: true,
    link: "/temples"
  },
  {
    icon: MapPin,
    title: "Custom Routes",
    description: "Flexible itineraries designed around your specific needs and schedule.",
    color: "from-amber-500 to-orange-500",
    clickable: true,
    link: "/booking"
  },
  {
    icon: HeartHandshake,
    title: "Personal Service",
    description: "One-on-one attention ensuring a comfortable and memorable journey.",
    color: "from-indigo-500 to-purple-500",
    clickable: true,
    link: "/booking"
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a range of personalized travel services across India
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const content = (
              <>
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${service.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                {service.clickable && (
                  <p className="text-amber-600 text-sm mt-2">Click to explore →</p>
                )}
              </>
            );

            if (service.clickable) {
              return (
                <Link
                  key={service.title}
                  to={service.link}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={service.title}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all group"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}