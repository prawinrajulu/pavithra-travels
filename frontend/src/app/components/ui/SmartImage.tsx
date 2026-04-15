import { useState, useEffect } from 'react';
import { unsplashService } from '../../services/unsplashService';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SmartImageProps {
  destinationName: string;
  fallbackUrl?: string;
  className?: string; // Standard HTML/React className for the container
  imageClassName?: string; // Allow passing classes specifically to the img element
  alt?: string;
  bypassUnsplash?: boolean;
  fillMode?: 'cover' | 'contain';
  height?: string;
}

/**
 * SmartImage component that automatically fetches high-quality 
 * destination images from Unsplash based on the destination name.
 */
export function SmartImage({ 
  destinationName, 
  fallbackUrl, 
  className = "", 
  imageClassName = "",
  alt = "",
  bypassUnsplash = false,
  fillMode = 'cover',
  height = '100%' // Changed default to 100% to follow container, fallback still works
}: SmartImageProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(fallbackUrl || '');
  
  // Decide whether to resolve via Unsplash:
  const isDirectImage = !bypassUnsplash && fallbackUrl && !fallbackUrl.startsWith('http');
  const needsResolving = !bypassUnsplash && !isDirectImage && (!fallbackUrl || fallbackUrl.includes('ibb.co') || fallbackUrl.includes('images.unsplash.com/photo-1501785888041-af3ef285b470'));
  
  const [isResolving, setIsResolving] = useState(needsResolving);
  
  useEffect(() => {
    if (!needsResolving) {
      if (fallbackUrl) setCurrentUrl(fallbackUrl);
      setIsResolving(false);
      return;
    }

    let isMounted = true;
    
    async function resolveImage() {
      try {
        const img = await unsplashService.getDestinationImage(destinationName);
        if (isMounted) {
          if (img) {
            setCurrentUrl(img);
          }
          setIsResolving(false);
        }
      } catch (err) {
        console.error("Resolution failed for", destinationName, err);
        if (isMounted) setIsResolving(false);
      }
    }
    
    resolveImage();
    
    return () => { isMounted = false; };
  }, [destinationName, needsResolving, fallbackUrl]);

  return (
    <div 
      className={`relative overflow-hidden ${fillMode === 'contain' ? 'bg-slate-100 flex items-center justify-center' : 'bg-gray-100'} ${className}`}
      style={{ width: '100%', height: height }}
      data-place={destinationName}
    >
      {isResolving && (
         <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
               <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
               <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-semibold">Glimpsing {destinationName}...</span>
            </div>
         </div>
      )}
      <ImageWithFallback
        src={currentUrl}
        alt={alt || destinationName}
        className={`w-full h-full transition-transform duration-700 ${fillMode === 'cover' ? 'group-hover:scale-110' : ''} ${imageClassName}`}
        fillMode={fillMode}
      />
    </div>
  );
}
