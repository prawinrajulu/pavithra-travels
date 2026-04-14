import { UnsplashSearch } from '../components/UnsplashSearch';
import { ImageIcon, LayoutGrid, Info } from 'lucide-react';

export default function AdminMedia() {
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Media Library
              </h1>
              <p className="text-slate-400 text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#FF8C00]" />
                Find high-quality images for your destinations
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-sm">
              <div className="flex gap-4">
                <div className="bg-[#FF8C00] p-2 rounded-lg h-fit">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Direct Link Tip</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Once you find an image, click "Copy Link" to get a direct URL you can paste into your code (hero, destinations, etc).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[#FF8C00]/10 p-2 rounded-lg">
            <LayoutGrid className="h-6 w-6 text-[#FF8C00]" />
          </div>
          <h2 className="text-3xl font-bold text-[#0B132B]">Search Unsplash</h2>
        </div>

        <UnsplashSearch />

        <div className="mt-20 border-t border-gray-100 pt-12">
          <div className="bg-gray-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#0B132B] mb-3">Unsplash Photography</h3>
              <p className="text-gray-600 leading-relaxed">
                All images provided through this tool are from Unsplash researchers and are free to use. 
                Please ensure you attribute the photographers correctly when possible to support the community.
              </p>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://unsplash.com/license" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-white transition-all shadow-sm"
              >
                License Info
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
