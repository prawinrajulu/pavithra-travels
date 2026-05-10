import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { 
  MapPin, Calendar, User, Heart, MessageCircle, Share2, 
  ChevronLeft, Info, Play, Maximize2, Loader2, ArrowLeft 
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { BlogComments } from '../components/BlogComments';
import { format } from 'date-fns';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBlog(id!);
      if (response.success) {
        setBlog(response.blog);
        // Check if user liked it (mock for now, real logic would check auth)
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await apiClient.toggleBlogLike(id!);
      if (response.success) {
        setBlog({ ...blog, likes: response.likes });
        setLiked(response.liked);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      <h2 className="text-3xl font-bold text-slate-800">Story not found</h2>
      <Link to="/blog" className="flex items-center gap-2 text-primary font-bold">
        <ArrowLeft size={20} /> Back to Blog
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0"
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute top-8 left-8 z-30">
          <Link to="/blog" className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all">
            <ChevronLeft size={20} /> Back to Stories
          </Link>
        </div>

        <div className="absolute bottom-20 left-0 w-full z-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-5 py-1.5 bg-primary rounded-full text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30">
                  {blog.category}
                </span>
                <span className="flex items-center gap-2 px-5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                  <MapPin size={14} className="text-primary-light" /> {blog.location}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none max-w-4xl drop-shadow-2xl">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-10 text-white/90">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white/20">
                    {blog.author[0]}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-black">Author</p>
                    <p className="font-bold">{blog.author}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary-light" size={24} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-black">Date</p>
                    <p className="font-bold">
                      {blog.createdAt ? format((() => {
                        if (blog.createdAt._seconds) return new Date(blog.createdAt._seconds * 1000);
                        if (blog.createdAt.seconds) return new Date(blog.createdAt.seconds * 1000);
                        const parsed = new Date(blog.createdAt);
                        return isNaN(parsed.getTime()) ? new Date() : parsed;
                      })(), 'MMMM dd, yyyy') : 'Recently Published'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-24">
        {/* Story Body */}
        <div className="lg:col-span-8">
          {/* Intro Card */}
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-16 relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/30 -rotate-12 group hover:rotate-0 transition-transform cursor-pointer">
               <Info size={40} />
            </div>
            
            <p className="text-2xl font-medium text-slate-800 leading-relaxed italic mb-8 border-l-4 border-primary pl-8">
              "{blog.description}"
            </p>
            
            <div className="prose prose-xl prose-slate max-w-none prose-headings:font-black prose-p:leading-loose text-slate-600">
              {blog.storyContent.split('\n').map((para: string, i: number) => (
                <p key={i} className="mb-6">{para}</p>
              ))}
            </div>
          </div>

          {/* Media Gallery Slider */}
          {blog.mediaFiles && blog.mediaFiles.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Visual <span className="text-primary">Journey</span></h2>
                <div className="flex gap-4">
                   <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{blog.mediaFiles.length} MEDIA FILES</span>
                </div>
              </div>
              
              <div className="rounded-[3rem] overflow-hidden shadow-2xl relative bg-black group">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  loop={true}
                  className="h-[600px]"
                >
                  {blog.mediaFiles.map((file: any, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="w-full h-full relative">
                        {file.type === 'video' ? (
                          <video 
                            src={file.url} 
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                            autoPlay
                            loop
                          />
                        ) : (
                          <img src={file.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        )}
                        
                        {file.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white cursor-pointer hover:scale-110 transition-transform">
                                <Play size={40} fill="white" />
                             </div>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-24">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold border border-slate-200 hover:bg-primary hover:text-white transition-all cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>

          {/* Real-time Comments Section */}
          <BlogComments blogId={id!} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            {/* Action Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 text-center">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6">Support this story</h3>
              <div className="flex justify-center gap-6">
                <button 
                  onClick={handleLike}
                  className={`flex flex-col items-center gap-2 group transition-all ${liked ? 'text-red-500 scale-110' : 'text-slate-400'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-red-50 text-red-500 shadow-lg shadow-red-100' : 'bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500'}`}>
                    <Heart size={28} fill={liked ? "currentColor" : "none"} />
                  </div>
                  <span className="text-sm font-black tracking-widest">{blog.likes} LIKES</span>
                </button>

                <button className="flex flex-col items-center gap-2 group text-slate-400 hover:text-blue-500 transition-all">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                    <Share2 size={28} />
                  </div>
                  <span className="text-sm font-black tracking-widest uppercase">SHARE</span>
                </button>
              </div>
            </div>

            {/* Travel Info Box */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full" />
              <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                <Info size={20} className="text-primary" /> Trip Intel
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <MapPin className="text-primary-light" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-black">Location</p>
                    <p className="font-bold text-sm">{blog.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <Info className="text-primary-light" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-black">Difficulty</p>
                    <p className="font-bold text-sm">Moderate Adventure</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/10">
                <Link to={`/bookings?destination=${blog.location}`} className="block w-full py-4 bg-primary text-white text-center rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30">
                  Visit Location
                </Link>
              </div>
            </div>

            {/* Newsletter Small */}
            <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-[2.5rem] p-8 text-white shadow-2xl">
               <h4 className="text-xl font-black mb-4 tracking-tighter">Never miss a <span className="italic underline">journey.</span></h4>
               <p className="text-white/80 text-sm mb-6 font-medium">Get the latest travel stories and exclusive tips delivered to your inbox.</p>
               <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 mb-4 focus:ring-2 focus:ring-white/50"
              />
               <button className="w-full py-3 bg-white text-indigo-600 font-black rounded-xl text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors">
                Subscribe
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
