import { Phone } from "lucide-react";
import logo from "../../assets/logo.png";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">

          {/* LOGO IMAGE */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Pavithra Travels"
              className="h-20 sm:h-24 object-contain"
            />
          </div>

          {/* CTA BUTTON */}
          <a
            href="#contact"
            className="flex items-center gap-2 
            bg-gradient-to-r from-amber-500 to-orange-500 
            text-white px-5 py-2.5 rounded-full 
            hover:from-amber-600 hover:to-orange-600 
            transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Book Now</span>
          </a>

        </div>
      </div>
    </header>
  );
}