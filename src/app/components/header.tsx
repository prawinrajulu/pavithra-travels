import { Phone, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../../assets/logo.png";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">

          {/* LOGO IMAGE */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={logo}
                alt="Pavithra Travels"
                className="h-16 sm:h-20 object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground/80 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/destinations" className="text-foreground/80 hover:text-primary font-medium transition-colors">
              Destinations
            </Link>
            <Link to="/check-status" className="text-foreground/80 hover:text-primary font-medium transition-colors">
              Check Status
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground/80 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wider">
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-primary font-bold transition-colors text-sm uppercase tracking-wider border-l border-gray-100 pl-6">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-foreground/80">
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
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
