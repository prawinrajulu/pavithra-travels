import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, UserPlus, ArrowLeft, User, Phone, Eye, EyeOff } from 'lucide-react';

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the new async signup method from AuthContext
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      // We don't need a local navigate here because 
      // PublicRoute will automatically bounce the user 
      // to the dashboard once AuthContext.user is set.
    } catch (err: any) {
      console.error("Signup error details:", err);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      // Check for Network Error (server down)
      if (err.message === 'Network Error') {
        errorMessage = 'Network Error: Cannot connect to the server. Please ensure the backend is running and accessible.';
      }
      // Extract specific error from backend API
      else {
        const apiError = err.response?.data?.error || err.response?.data?.message;
        if (apiError) {
          errorMessage = apiError;
        } 
        // If error is direct Firebase error code
        else if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please go to Login.';
        } else if (err.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please use at least 6 characters.';
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12">
      {/* Background with Parallax */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90" />
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80&fit=crop"
          alt="Travel Horizon"
          className="w-full h-full object-cover opacity-30 animate-pulse-slow-reverse"
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-white mb-3">Begin Journey</h1>
            <p className="text-white/60">Create an account to track your travels</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-1.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-1.5">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="Enter phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-1.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative inline-flex items-center justify-center gap-2 bg-[#FF8C00] text-white font-semibold py-4 px-8 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>Sign Up <UserPlus className="h-5 w-5" /></>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow-reverse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
