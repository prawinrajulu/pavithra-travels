import { getUnsplashQuery } from "../data/unsplash-queries";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const SEARCH_API_URL = "https://api.unsplash.com/search/photos";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Reliable fallback travel image
const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop&auto=format";

interface CachedImage {
  url: string;
  timestamp: number;
}

/**
 * Service to fetch high-quality images from Unsplash with caching
 */
class UnsplashService {
  /**
   * Fetches an image URL for a given destination name
   */
  async getDestinationImage(destinationName: string): Promise<string> {
    const query = getUnsplashQuery(destinationName);
    
    // Exact requested key format: image_<destination_name>
    const cacheKey = `image_${destinationName.toLowerCase().replace(/\s+/g, '_')}`;

    // 1. Check Cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`[UNSPLASH] Cache hit for: ${destinationName}`);
      return cached;
    }

    // 2. Fetch from API
    try {
      if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
        process.env.NODE_ENV === 'development' && console.warn("[UNSPLASH] Missing API Key. Using fallback.");
        return DEFAULT_FALLBACK;
      }

      console.log(`[UNSPLASH] Fetching new image for: ${destinationName} (Query: ${query})`);
      
      // per_page=15 to allow for better random selection from top results
      const response = await fetch(`${SEARCH_API_URL}?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results || [];
      
      if (results.length > 0) {
        // Implement requested random selection:
        // const randomIndex = Math.floor(Math.random() * data.results.length)
        const randomIndex = Math.floor(Math.random() * results.length);
        const imageUrl = results[randomIndex]?.urls?.regular;

        if (imageUrl) {
          this.saveToCache(cacheKey, imageUrl);
          return imageUrl;
        }
      }

      return DEFAULT_FALLBACK;
    } catch (error) {
      console.error(`[UNSPLASH] Error fetching image for ${destinationName}:`, error);
      return DEFAULT_FALLBACK;
    }
  }

  private getFromCache(key: string): string | null {
    try {
      const dataStr = localStorage.getItem(key);
      if (!dataStr) return null;

      const cached: CachedImage = JSON.parse(dataStr);
      const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return cached.url;
    } catch {
      return null;
    }
  }

  private saveToCache(key: string, url: string) {
    try {
      const cacheData: CachedImage = {
        url,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (e) {
      console.warn("[UNSPLASH] Failed to save to cache:", e);
    }
  }
}

export const unsplashService = new UnsplashService();
