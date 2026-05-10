import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import '../styles/TravelPosts.css';

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: any;
  reviews?: { username: string }[];
}

import { Skeleton } from './ui/skeleton';

export function TravelPostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPosts();
      console.log('[DEBUG] TravelPostsSection fetch success:', response);
      if (response.success) {
        setPosts(response.posts || []);
      }
    } catch (error) {
      console.error('[DEBUG] TravelPostsSection fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <Skeleton className="h-8 w-48 mb-4 rounded-full" />
            <Skeleton className="h-16 w-96 mb-2 rounded-2xl" />
            <Skeleton className="h-4 w-64 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-[2rem]" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no posts
  if (!loading && posts.length === 0) return null;

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <section className="py-24 bg-white overflow-hidden" id="travel-posts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#FF8C00] text-sm font-bold mb-4">
              <Calendar size={15} />
              <span>Traveler Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B132B] mb-3 leading-tight">
              Travel Experiences
            </h2>
            <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
              Real stories from real travelers. Discover the magic of India's destinations.
            </p>
          </div>
          <div className="text-slate-400 text-sm font-medium shrink-0">
            {posts.length} {posts.length === 1 ? 'story' : 'stories'} shared
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visiblePosts.map((post, idx) => {
            return (
              <div
                key={post.id}
                className="post-card group cursor-pointer"
                onClick={() => {
                  console.log(`[DEBUG] Navigating to post: ${post.id}`);
                  navigate(`/post/${post.id}`);
                }}
                style={{ animationDelay: `${idx * 80}ms` }}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/post/${post.id}`)}
                aria-label={`Read more about ${post.title}`}
              >
                {/* Image */}
                <div className="post-image-container">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="post-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
                      <ImageIcon size={40} />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  {/* Location badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0B132B] flex items-center gap-1 shadow-sm">
                    <MapPin size={9} className="text-[#FF8C00]" />
                    {post.location}
                  </div>
                </div>

                {/* Content */}
                <div className="post-content">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                      : ''}
                  </p>
                  <h3 className="post-title group-hover:text-[#FF8C00] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="post-description line-clamp-2">
                    {post.description}
                  </p>

                  <div className="post-meta">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {post.reviews?.length
                        ? `${post.reviews.length} comment${post.reviews.length !== 1 ? 's' : ''}`
                        : 'No comments yet'}
                    </div>
                    <div className="flex items-center gap-1 text-[#FF8C00] font-bold text-xs group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More */}
        {visibleCount < posts.length && (
          <div className="mt-14 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 4)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0B132B] text-white font-bold hover:scale-105 hover:bg-[#1a2540] transition-all shadow-xl shadow-[#0B132B]/15 group"
            >
              Show More Experiences
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <p className="text-slate-400 text-sm mt-3">
              Showing {visibleCount} of {posts.length} stories
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
