import { Heart, Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* BRAND SECTION */}
          <div>
            <div className="flex flex-col items-start mb-4">
              {/* Crown */}
              <Crown className="h-6 w-6 text-amber-400 mb-1 drop-shadow-md" />

              {/* Decorative Serif Title */}
              <h2
                className="text-2xl font-[Cinzel] font-bold 
                bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-500 
                bg-clip-text text-transparent 
                tracking-wider drop-shadow-[0_2px_6px_rgba(255,180,0,0.3)]"
              >
                Pavithra Travels
              </h2>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Explore India with Comfort and Care. Your trusted
              partner for divine and memorable journeys.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Family Trips</li>
              <li>Temple Tours</li>
              <li>Custom Routes</li>
              <li>Pan India Tour Packages</li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#services"
                  className="hover:text-amber-400 transition-colors"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-amber-400 transition-colors"
                >
                  Book Now
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>+91 9342094598</li>
              <li>info@pavithratravels.com</li>
              <li>Serving All Over India</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2026 Pavithra Travels. All rights reserved.
          </p>

          <p className="text-sm text-gray-400 flex items-center gap-2">
            Crafted with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
            for our travelers
          </p>
        </div>
      </div>
    </footer>
  );
}