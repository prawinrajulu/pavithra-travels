import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoSectionProps {
  type?: 'local' | 'youtube';
  src?: string;
  poster?: string;
  title?: string;
}

export function VideoSection({ 
  type = 'youtube', 
  src = "https://www.youtube.com/embed/ScMzIvxBSi4", // High quality travel video example
  poster = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=900&fit=crop",
  title = "Experience the Journey with Pavithra Travels"
}: VideoSectionProps) {
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);  

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // YouTube optimized source (autoplay, mute, loop, no controls, modest branding)
  const youtubeSrc = `${src}${src.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&playlist=${src.split('/').pop()?.split('?')[0]}`;

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Decorative background blobs for a premium feel */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-[900px] mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <span className="text-amber-600 font-bold uppercase tracking-widest text-xs">Visual Journey</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Relive Our Travelers' Experiences</h2>
        </div>

        <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-black border-[8px] border-white group">
          {/* Subtle overlay glow */}
          <div className="absolute inset-0 border border-white/20 rounded-[2rem] z-20 pointer-events-none"></div>
          
          {hasError ? (
            <img 
              src={poster} 
              alt="Travel Destinations" 
              className="w-full h-auto block object-cover"
            />
          ) : type === 'local' ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto block"
              poster={poster}
              onError={() => setHasError(true)}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="relative w-full aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full" 
                src={youtubeSrc}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setHasError(true)}
              ></iframe>
            </div>
          )}

          {/* Sound Toggle Button (Local Video only) */}
          {type === 'local' && !hasError && (
            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-30 p-4 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/60 transition-all active:scale-95 group/btn shadow-xl"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 group-hover/btn:text-[#FF8C00] transition-colors" />
              ) : (
                <Volume2 className="w-6 h-6 group-hover/btn:text-[#FF8C00] transition-colors" />
              )}
            </button>
          )}
        </div>
        
        {/* Caption below the video */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            Authentic moments captured during our tours
            <span className="w-8 h-[1px] bg-gray-300"></span>
          </p>
        </div>
      </div>
    </section>
  );
}
