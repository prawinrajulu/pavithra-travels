import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  User, 
  Loader2, 
  AlertCircle,
  Share2,
  Clock
} from 'lucide-react';
import '../styles/TravelPosts.css';

interface Comment {
  id: string;
  username: string;
  message: string;
  createdAt: any;
}

interface TravelPost {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: any;
  reviews: Comment[];
}

export function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<TravelPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Comment form state
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPostDetails(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchPostDetails = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`[DEBUG] Fetching post details for ID: ${postId}`);
      const response = await apiClient.getPost(postId);
      console.log('[DEBUG] Fetch post success:', response);
      
      if (response.success) {
        setPost(response.post);
      } else {
        setError(response.message || 'Failed to load this post. Please try again.');
      }
    } catch (err: any) {
      console.error('[DEBUG] API Error:', err);
      setError('Failed to load this post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !message.trim() || !id) return;

    try {
      setSubmittingComment(true);
      console.log('[DEBUG] Submitting comment for post:', id);
      const response = await apiClient.addPostReview({
        postId: id,
        username: username.trim(),
        message: message.trim()
      });

      if (response.success) {
        console.log('[DEBUG] Comment added successfully');
        // Update local post state with new comment
        if (post) {
          setPost({
            ...post,
            reviews: [response.review, ...(post.reviews || [])]
          });
        }
        setMessage('');
        showToast('success', 'Comment posted!');
      }
    } catch (err) {
      console.error('[DEBUG] Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const showToast = (type: string, msg: string) => {
    // Simple alert for now, can be replaced with a proper toast component
    console.log(`[TOAST] ${type}: ${msg}`);
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white">
        <div className="relative">
          <Loader2 className="animate-spin text-[#FF8C00]" size={64} strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#FF8C00] rounded-full animate-ping" />
          </div>
        </div>
        <p className="text-slate-500 font-bold mt-6 tracking-widest uppercase text-xs">Loading Story</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-[#0B132B] mb-4">{error || 'Post Not Found'}</h2>
        <p className="text-slate-500 mb-10">The story you are looking for might have been removed or moved to a different location.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 bg-[#0B132B] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-[#0B132B]/20"
        >
          <ArrowLeft size={20} />
          Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="post-details-page bg-white min-h-screen">
      {/* Dynamic Header / Hero */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/20 to-transparent" />
        
        <div className="absolute top-8 left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-xl text-white px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/20 transition-all font-bold text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-[#FF8C00] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20">
                Experiences
              </span>
              <div className="flex items-center gap-2 text-white/90 text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <MapPin size={14} className="text-[#FF8C00]" />
                {post.location}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-white/60 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-[#FF8C00]" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare size={18} className="text-[#FF8C00]" />
                {post.reviews?.length || 0} Comments
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={18} className="text-[#FF8C00]" />
                5 Min Read
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-16 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="prose prose-xl max-w-none text-slate-700 leading-[1.8] font-medium">
            {post.description.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="mb-8">{para}</p>
            ))}
          </div>

          {/* Social Share */}
          <div className="mt-16 flex items-center gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
             <div className="w-12 h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white">
                <Share2 size={24} />
             </div>
             <div className="flex-1">
                <h4 className="font-bold text-[#0B132B]">Love this story?</h4>
                <p className="text-sm text-slate-500">Share it with your fellow travelers.</p>
             </div>
             <button 
              onClick={() => {
                const text = `Check out this amazing travel story: ${post.title}\n${window.location.href}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all text-sm"
             >
              WhatsApp
             </button>
          </div>

          {/* Comments System */}
          <div className="mt-20 pt-16 border-t border-slate-100">
            <h3 className="text-3xl font-bold text-[#0B132B] mb-10 flex items-center gap-4">
              <div className="w-1.5 h-10 bg-[#FF8C00] rounded-full" />
              Traveler's Voice
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-white rounded-[2.5rem] p-8 mb-16 border-2 border-slate-50 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF8C00]">
                  <MessageSquare size={20} />
                </div>
                <h4 className="font-black text-[#0B132B] uppercase tracking-tighter text-lg">Leave your thoughts</h4>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="What's your name?"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/5 focus:border-[#FF8C00] transition-all font-bold text-slate-700"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Write your comment here..."
                    className="w-full p-6 rounded-2xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/5 focus:border-[#FF8C00] transition-all min-h-[160px] font-medium text-slate-700 resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="flex items-center justify-center gap-3 bg-[#0B132B] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1a2540] hover:translate-y-[-2px] transition-all disabled:opacity-50 shadow-2xl shadow-[#0B132B]/20"
                >
                  {submittingComment ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Submit Comment</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-10">
              {post.reviews && post.reviews.length > 0 ? (
                post.reviews.map((comment, i) => (
                  <div key={comment.id || i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-[#FF8C00] shrink-0 font-black text-xl border border-orange-200/50">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-[#0B132B] text-lg">{comment.username}</h5>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-500 leading-relaxed text-lg font-medium">{comment.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No comments yet. Share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Recommendations */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-10">
            {/* CTA Card */}
            <div className="bg-[#0B132B] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF8C00]/10 rounded-full blur-3xl group-hover:bg-[#FF8C00]/20 transition-all duration-700" />
              <h4 className="text-2xl font-bold mb-4 relative z-10">Inspired by this story?</h4>
              <p className="text-white/60 text-sm mb-8 leading-relaxed relative z-10 font-medium">
                Let us help you create your own unforgettable travel story in {post.location}.
              </p>
              <button 
                onClick={() => navigate('/customized-trip')}
                className="w-full bg-[#FF8C00] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all relative z-10"
              >
                Plan My Adventure
              </button>
            </div>

            {/* Quick Info Card */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <h4 className="font-bold text-[#0B132B] mb-6 flex items-center gap-2">
                 <AlertCircle size={18} className="text-[#FF8C00]" />
                 Trip Overview
              </h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</span>
                    <span className="text-sm font-bold text-slate-700">{post.location}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Published</span>
                    <span className="text-sm font-bold text-slate-700">{formatDate(post.createdAt)}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Story ID</span>
                    <span className="text-[10px] font-mono text-slate-400">{post.id.slice(0, 8)}...</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
