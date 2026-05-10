import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, Heart, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    location: string;
    description: string;
    coverImage: string;
    category: string;
    author: string;
    createdAt: any;
    likes: number;
    commentsCount: number;
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  const getValidDate = (dateObj: any) => {
    if (!dateObj) return new Date();
    if (dateObj._seconds) return new Date(dateObj._seconds * 1000);
    if (dateObj.seconds) return new Date(dateObj.seconds * 1000);
    const parsed = new Date(dateObj);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const formattedDate = blog.createdAt ? format(getValidDate(blog.createdAt), 'MMM dd, yyyy') : 'Recently';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={blog.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary text-xs font-bold rounded-full shadow-lg">
            {blog.category}
          </span>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white">
          <MapPin size={16} className="text-[#FF8C00]" />
          <span className="text-sm font-medium drop-shadow-md">{blog.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={14} />
            {blog.author}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-1">
          {blog.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {blog.description}
        </p>

        {/* Stats & Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Heart size={16} className="group-hover:text-red-500 transition-colors" />
              <span className="text-xs font-bold">{blog.likes}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MessageCircle size={16} className="group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-bold">{blog.commentsCount}</span>
            </div>
          </div>

          <Link
            to={`/blog/${blog.id}`}
            className="flex items-center gap-2 text-primary font-bold text-sm group/btn"
          >
            Read More
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
