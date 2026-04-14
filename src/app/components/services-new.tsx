import { Church, Users, Heart, Compass, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Temple Trips",
    type: "temple",
    description: "Sacred journeys to divine destinations",
    icon: Church,
    color: "text-primary",
    bg: "bg-primary/10",
    hoverBg: "hover:bg-primary/20"
  },
  {
    title: "Family & Honeymoon",
    type: "family-honeymoon",
    description: "Memorable vacations for families and couples",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    hoverBg: "hover:bg-pink-100"
  },
  {
    title: "Adventure Trips",
    type: "adventure",
    description: "Thrilling experiences for adventure seekers",
    icon: Compass,
    color: "text-green-600",
    bg: "bg-green-50",
    hoverBg: "hover:bg-green-100"
  }
];

export function ServicesNew() {
  return (
    <section id="services" className="py-24 bg-[#FFFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Our Travel Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover amazing travel experiences across India. Choose a category below to explore our curated destination packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.type}
                to={`/services/${cat.type}`}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-1"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${cat.bg} ${cat.hoverBg}`}>
                  <Icon className={`h-10 w-10 ${cat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {cat.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Explore Destinations
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
