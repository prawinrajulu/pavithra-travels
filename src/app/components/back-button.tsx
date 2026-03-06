import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function BackButton() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show button only when scrollY is less than 50px (near top of page)
      // Hide button when scrollY is greater than 50px (scrolled down)
      if (window.scrollY < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className={`
        fixed top-20 left-6 md:top-24 md:left-8
        z-50 group
        inline-flex items-center gap-2.5 px-6 py-3 rounded-full
        bg-orange-400/15
        backdrop-blur-md border border-orange-300/30
        hover:bg-orange-400/25 hover:border-orange-300/50
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none"}
      `}
      style={{
        boxShadow: isVisible
          ? '0 8px 32px rgba(251, 146, 60, 0.15), 0 0 20px rgba(251, 146, 60, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          : 'none',
      }}
      aria-label="Go back to previous page"
    >
      {/* Soft glow effect */}
      <div className={`
        absolute -inset-2 bg-gradient-to-r from-orange-300 via-amber-300 to-orange-300 
        rounded-full blur-lg opacity-0 group-hover:opacity-30 
        transition-all duration-500 -z-10
        ${isVisible ? "scale-100" : "scale-0"}
      `}></div>

      {/* Arrow icon with smooth animation */}
      <ArrowLeft className="relative h-5 w-5 text-orange-600 group-hover:-translate-x-1 transition-transform duration-300" />

      {/* Text */}
      <span className="relative text-sm font-semibold text-orange-700">
        Back
      </span>

      {/* Inner shimmer effect on hover */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Click ripple effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-white/30 scale-0 group-active:scale-100 opacity-0 group-active:opacity-100 transition-all duration-200 rounded-full"></div>
      </div>
    </button>
  );
}