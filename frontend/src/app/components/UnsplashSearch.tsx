import { useState } from 'react';
import { Search, Copy, Check, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UnsplashImage {
  id: string;
  alt_description: string;
  urls: {
    regular: string;
    small: string;
    full: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
}

export function UnsplashSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await apiClient.searchUnsplashImages(query);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (url: string, id: string, downloadLocation: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      
      // Trigger download for Unsplash API compliance
      apiClient.triggerUnsplashDownload(downloadLocation).catch(console.error);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Area */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for travel images (e.g., Himalayas, Kerala, Taj Mahal...)"
            className="w-full pl-14 pr-32 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/10 focus:border-[#FF8C00]/30 transition-all text-gray-800"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-[#FF8C00] text-white px-6 rounded-xl font-bold hover:bg-[#F28C00] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((img) => (
          <div key={img.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
            <div className="relative h-48 overflow-hidden bg-gray-50">
              <ImageWithFallback
                src={img.urls.small}
                alt={img.alt_description}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                fillMode="cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyToClipboard(img.urls.regular, img.id, img.links.download_location)}
                  className="bg-white text-gray-900 p-3 rounded-full hover:scale-110 transition-transform flex items-center gap-2 font-bold text-sm shadow-xl"
                  title="Copy Direct Link"
                >
                  {copiedId === img.id ? (
                    <><Check className="h-4 w-4 text-green-600" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copy Link</>
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {img.alt_description || 'No description'}
              </p>
              <div className="flex items-center justify-between">
                <a
                  href={img.user.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-[#FF8C00] transition-colors flex items-center gap-1"
                >
                  By {img.user.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <ImageIcon className="h-4 w-4 text-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && !error && query && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No images found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
