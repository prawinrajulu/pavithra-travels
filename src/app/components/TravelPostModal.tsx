import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { 
  X, 
  MapPin, 
  Calendar, 
  Star, 
  Send, 
  User, 
  MessageSquare,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface PostDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  createdAt: any;
  reviews: Review[];
}

interface TravelPostModalProps {
  postId: string;
  onClose: () => void;
}

export function TravelPostModal({ postId, onClose }: TravelPostModalProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPostDetails();
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPost(postId);
      if (response.success) {
        setPost(response.post);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    try {
      setSubmitting(true);
      const response = await apiClient.addPostReview({
        postId,
        username: name,
        message: comment
      });

      if (response.success) {
        setSuccess(true);
        setName('');
        setComment('');
        setRating(5);
        fetchPostDetails(); // Refresh reviews
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = post?.reviews?.length 
    ? (post.reviews.reduce((acc, r) => acc + r.rating, 0) / post.reviews.length).toFixed(1) 
    : '0';

  if (loading && !post) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B132B]/80 backdrop-blur-sm">
        <Loader2 className="animate-spin text-[#FF8C00]" size={48} />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0B132B]/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#0B132B] p-2 rounded-full transition-all shadow-lg"
        >
          <X size={24} />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left side: Image Slider */}
            <div className="h-[400px] lg:h-full bg-slate-900">
              <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                navigation
                pagination={{ clickable: true }}
                effect="fade"
                className="h-full w-full"
              >
                {post.images && post.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt={post.title} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Right side: Content & Reviews */}
            <div className="p-8 lg:p-12 space-y-10">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF8C00] text-xs font-bold">
                    <MapPin size={14} />
                    {post.location}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0B132B] leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 leading-relaxed text-lg">
                  {post.description}
                </p>
              </div>

              {/* Review Stats */}
              <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#0B132B]">{averageRating}</div>
                  <div>
                    <div className="flex text-[#fbbf24] gap-0.5 mb-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Average Rating</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0B132B]">{post.reviews?.length || 0}</div>
                  <div className="text-xs text-slate-500 font-medium">Total Reviews</div>
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#0B132B] flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#FF8C00]" />
                  Leave a Review
                </h3>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="flex items-center gap-3 px-4 py-2 border-1.5 border-slate-200 rounded-2xl">
                      <span className="text-sm font-bold text-slate-500">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button 
                            key={s} 
                            type="button"
                            onClick={() => setRating(s)}
                            className={`transition-transform hover:scale-125 ${s <= rating ? 'text-[#fbbf24]' : 'text-slate-200'}`}
                          >
                            <Star size={20} fill={s <= rating ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea 
                    placeholder="Share your thoughts about this experience..."
                    className="form-input min-h-[100px] resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#0B132B] text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Send size={20} />}
                    {submitting ? 'Submitting...' : success ? 'Review Posted!' : 'Post Review'}
                  </button>
                </form>
              </div>

              {/* Review List */}
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-[#0B132B] mb-6">Recent Reviews</h3>
                {post.reviews?.length === 0 ? (
                  <p className="text-slate-400 italic">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  <div className="space-y-4">
                    {post.reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                              <User size={20} />
                            </div>
                            <div>
                              <div className="font-bold text-[#0B132B]">{review.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed pl-13">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
