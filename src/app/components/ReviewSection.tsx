import { useState, useEffect } from "react";
import { Star, UserCircle2, Trash2 } from "lucide-react";
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: string;
  author: string;
  userId?: string;
  rating: number;
  comment: string;
  date: string;
  timestamp: number;
}

interface ReviewSectionProps {
  destinationId: string;
}

export function ReviewSection({ destinationId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(true);

  // Load reviews from API on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiClient.getReviews(destinationId);
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [destinationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    const newReviewData = {
      destinationId,
      author: name,
      userId: user?.id,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      timestamp: Date.now(),
    };

    try {
      const data = await apiClient.createReview(newReviewData);
      if (data.success && data.review) {
        const updatedReviews = [data.review as Review, ...reviews];
        setReviews(updatedReviews);

        // Reset form
        setName("");
        setComment("");
        setRating(0);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const result = await apiClient.deleteReview(reviewId);
      if (result.success) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete the review. You might not have permission.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-8">
      <h2 className="text-2xl text-gray-900 mb-6 font-semibold">Traveler Reviews</h2>
      
      {/* Review Form */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
              placeholder="Share your experience..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !comment.trim() || rating === 0}
            className="px-6 py-2.5 bg-[#701C1C] text-white rounded-lg hover:bg-[#5a1616] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-500 text-center py-6 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-6 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((review) => {
            const canDelete = user && (user.role === 'admin' || user.id === review.userId);
            
            return (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 relative group">
                <div className="flex items-center gap-3 mb-3">
                  <UserCircle2 className="h-12 w-12 text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                    <div className="flex items-center gap-2 text-sm mt-0.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 pl-[60px] leading-relaxed">{review.comment}</p>
                {canDelete && (
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
