import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setIsLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions. If you don\'t see it, check your spam folder.');
    } catch (err: any) {
      console.error("Password reset error:", err);
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FFFBF0]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF8C00]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#0B132B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-[#0B132B]/60 hover:text-[#0B132B] mb-8 transition-colors duration-300 font-medium"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Login
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#0B132B]/5 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#FF8C00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Mail className="h-10 w-10 text-[#FF8C00]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0B132B] mb-3">Forgot Password?</h1>
            <p className="text-[#0B132B]/50">No worries! Enter your email and we'll send you reset instructions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-4 rounded-2xl text-sm flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[#0B132B] text-sm font-semibold ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#0B132B]/20 group-focus-within:text-[#FF8C00] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent focus:border-[#FF8C00]/30 rounded-2xl text-[#0B132B] placeholder-[#0B132B]/20 focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/10 transition-all duration-300"
                  placeholder="Enter your registered email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!message}
              className="w-full group relative inline-flex items-center justify-center gap-3 bg-[#FF8C00] text-white font-bold py-5 px-8 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-orange-500/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Processing...' : (
                  <>Send Reset Link <Send className="h-5 w-5" /></>
                )}
              </span>
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 pt-8">
            <p className="text-[#0B132B]/40 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-[#FF8C00] hover:text-[#F28C00] font-bold transition-colors">
                Try logging in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
