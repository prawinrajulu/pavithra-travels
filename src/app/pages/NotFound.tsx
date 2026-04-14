import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-90" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 text-center animate-fade-in-up">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4 opacity-80">
          404
        </h1>
        <h2 className="text-3xl font-light text-white mb-6">Destination Not Found</h2>
        <p className="text-white/60 mb-10 text-lg">
          It looks like you've wandered off the map. This journey doesn't exist.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#FF8C00] text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" /> Return Home
        </Link>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
