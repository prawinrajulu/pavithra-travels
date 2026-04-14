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
    <section className="relative w-full max-w-[750px] mx-auto py-12 md:py-16 z-10">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-gray-100">
        
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
          /* YouTube Embed Handler within the same centered container */
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
            className="absolute bottom-4 right-4 z-30 p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/60 transition-all active:scale-95 group"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 group-hover:text-[#FF8C00] transition-colors" />
            ) : (
              <Volume2 className="w-5 h-5 group-hover:text-[#FF8C00] transition-colors" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
