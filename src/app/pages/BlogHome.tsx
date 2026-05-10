import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { apiClient } from '../../services/apiClient';
import { Search, TrendingUp, Sparkles, Map, Loader2 } from 'lucide-react';

export default function BlogHome() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');

  const categories = ['All', 'Adventure', 'Culture', 'Food', 'Nature', 'Luxury', 'Budget'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBlogs();
      if (response.success) {
        setBlogs(response.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getValidDateTime = (dateObj: any) => {
    if (!dateObj) return 0;
    if (dateObj._seconds) return dateObj._seconds * 1000;
    if (dateObj.seconds) return dateObj.seconds * 1000;
    const time = new Date(dateObj).getTime();
    return isNaN(time) ? 0 : time;
  };

  const filteredBlogs = blogs.filter((blog: any) => {
    const titleMatch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const locationMatch = blog.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = titleMatch || locationMatch;
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => {
    if (sortBy === 'Latest') return getValidDateTime(b.createdAt) - getValidDateTime(a.createdAt);
    if (sortBy === 'Popular') return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
            alt="Travel Stories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-4 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary-light text-sm font-bold tracking-wider uppercase">
                Travel Journal
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Explore the World Through <span className="text-primary italic">Our Stories</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
              Discover hidden gems, cultural insights, and travel tips from our latest adventures across the globe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-4 md:p-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by destination or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
              />
            </div>

            {/* Category Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-48">
              <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl text-slate-500 font-bold text-sm">
                <TrendingUp size={18} className="text-primary" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 w-full p-0 cursor-pointer"
                >
                  <option>Latest</option>
                  <option>Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-slate-400 font-medium">Curating stories for you...</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredBlogs.map((blog: any) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="text-slate-300" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No stories found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </section>

      {/* Featured Section Banner */}
      {!loading && blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl shadow-slate-900/40">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity">
               <img 
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80" 
                alt="Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900" />
            </div>
            
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 text-primary-light font-bold text-sm mb-6 uppercase tracking-widest">
                <Sparkles size={18} /> Exclusive Travels
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Want to write your own <span className="text-primary italic">Travel Story?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Join our community of travelers and share your unique experiences with the world. Every journey has a story worth telling.
              </p>
              <button className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30">
                Join the Community
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
