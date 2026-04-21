import { useState } from "react";
import { Share2, Copy, MessageCircle } from "lucide-react";

interface ShareTripProps {
  tripName: string;
  tripUrl: string;
}

export function ShareTrip({ tripName, tripUrl }: ShareTripProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Check out this amazing trip on Pavithra Travels: ${tripName}`;

  const handleShare = async (platform: string) => {
    const url = tripUrl;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
    }
    
    setShowShareOptions(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tripName,
          text: shareText,
          url: tripUrl
        });
        setShowShareOptions(false);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-semibold shadow-md active:scale-95"
      >
        <Share2 className="h-5 w-5" />
        <span>Share</span>
      </button>

      {showShareOptions && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 min-w-48">
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </button>
          )}
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">WhatsApp</span>
          </button>
          
          <button
            onClick={() => handleShare('facebook')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
          >
            <div className="h-4 w-4 bg-blue-600 rounded-sm" />
            <span className="text-sm">Facebook</span>
          </button>
          
          <button
            onClick={() => handleShare('twitter')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
          >
            <div className="h-4 w-4 bg-sky-500 rounded-sm" />
            <span className="text-sm">Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('copy')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
