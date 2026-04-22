import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-[#FDFBF7] text-[#0B1221] py-14 relative overflow-hidden border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* BRAND SECTION */}
          <div>
            <div className="flex flex-col items-start mb-4">
              {/* Logo Image */}
              <img
                src={logo}
                alt="Pavithra Travels"
                // increased height for a much bigger logo
                className="h-32 w-90 mb-2 object-contain max-w-full"
              />

              {/* Decorative Serif Title */}
              <h2
                className="text-2xl font-[Cinzel] font-bold 
                bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-500 
                bg-clip-text text-transparent 
                tracking-wider drop-shadow-[0_2px_6px_rgba(255,180,0,0.3)]"
              >
                
              </h2>
            </div>

            <p className="text-[#475569] text-sm leading-relaxed">
              Explore India with Comfort and Care. Your trusted
              partner for divine and memorable journeys.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#701C1C]">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-[#1E293B]">
              <li>
                <Link
                  to="/services/family-honeymoon"
                  className="hover:text-[#701C1C] transition-colors"
                >
                  Family & Honeymoon Trips
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations?type=temple"
                  className="hover:text-[#701C1C] transition-colors"
                >
                  Temple Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="hover:text-[#701C1C] transition-colors"
                >
                  Pan India Tour Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#701C1C]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[#1E293B]">
              <li>
                <Link
                  to="/destinations"
                  className="hover:text-[#701C1C] transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="hover:text-[#701C1C] transition-colors"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#701C1C] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#701C1C]">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-[#1E293B]">
              <li>+91 9342094598</li>
              <li>pavithratravelshoppee@gmail.com</li>
              <li>Serving All Over India</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#64748B]">
            © 2026 Pavithra Travels. All rights reserved.
          </p>

          <p className="text-sm text-[#64748B] flex items-center gap-2">
            Crafted with{" "}
            <Heart className="h-4 w-4 text-[#701C1C] fill-[#701C1C]" />{" "}
            for our travelers
          </p>
        </div>
      </div>
    </footer>
  );
}