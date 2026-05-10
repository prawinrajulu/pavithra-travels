import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Reply, MessageSquare, Loader2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: any;
  likes: number;
}

export function BlogComments({ blogId }: { blogId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Real-time listener for comments
    const commentsRef = collection(db, 'blogs', blogId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to comments:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!newMessage.trim()) return;

    try {
      setSubmitting(true);
      const response = await apiClient.addBlogComment(blogId, { message: newMessage });
      if (response.success) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 border-t border-slate-200">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          Real-time <span className="text-primary">Conversations</span>
        </h2>
        <span className="px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-sm font-bold border border-slate-200">
          {comments.length} Comments
        </span>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 mb-12">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {user ? user.name[0] : <User size={20} />}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={user ? "Share your thoughts on this story..." : "Please login to join the conversation"}
              disabled={!user || submitting}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-16 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[100px]"
            />
            <button
              type="submit"
              disabled={!user || submitting || !newMessage.trim()}
              className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all"
              >
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-100 shrink-0">
                    {comment.username[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-slate-900 tracking-tight">{comment.username}</h4>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                        {comment.createdAt ? formatDistanceToNow((() => {
                          if (comment.createdAt._seconds) return new Date(comment.createdAt._seconds * 1000);
                          if (comment.createdAt.seconds) return new Date(comment.createdAt.seconds * 1000);
                          const parsed = new Date(comment.createdAt);
                          return isNaN(parsed.getTime()) ? new Date() : parsed;
                        })()) + ' ago' : 'Just now'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {comment.message}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest">
                        <Heart size={14} /> {comment.likes || 0} Likes
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
                        <Reply size={14} /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-medium tracking-tight uppercase text-xs">No comments yet. Be the first to start the story.</p>
          </div>
        )}
      </div>
    </div>
  );
}
