import { Phone, User, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../../assets/logo.png";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "Check Status", path: "/check-status" },
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">

          {/* LOGO IMAGE */}
          <div className="flex items-center">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img
                src={logo}
                alt="Pavithra Travels"
                className="h-10 sm:h-13 object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-foreground/80 hover:text-primary font-medium transition-colors ${
                  location.pathname === link.path ? "text-primary border-b-2 border-primary" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-primary font-bold transition-colors text-sm uppercase tracking-wider border-l border-gray-100 pl-6">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* AUTH BUTTONS & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            {/* DESKTOP AUTH */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-foreground/80 hover:text-primary transition-colors font-medium px-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE TOGGLE BUTTON */}
            <button 
              className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="text-foreground/80 hover:text-primary font-medium py-2 border-b border-gray-50 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-primary font-bold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-foreground/80 py-2 border-b border-gray-50">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-foreground/80 hover:text-primary font-medium py-2 text-center border border-gray-200 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Phone className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

