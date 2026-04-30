import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';
import { AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get reviews for a specific destination
router.get('/:destinationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId } = req.params;
    
    const snapshot = await db.collection('reviews')
      .where('destinationId', '==', destinationId)
      .orderBy('timestamp', 'desc')
      .get();

    const reviews = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    // Note: if index is missing, it will throw an error. In that case, we can fetch all and sort in memory.
    try {
      const { destinationId } = req.params;
      const snapshot = await db.collection('reviews')
        .where('destinationId', '==', destinationId)
        .get();

      const reviews = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort in memory as fallback
      reviews.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));

      res.json({
        success: true,
        reviews
      });
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
});

// Create a new review
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId, author, rating, comment, date, timestamp, userId } = req.body;

    if (!destinationId || !author || !rating || !comment) {
      return next(new AppError(400, 'Missing required fields'));
    }

    const reviewData = {
      destinationId,
      author,
      userId: userId || null,
      rating: Number(rating),
      comment,
      date: date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      timestamp: timestamp || Date.now()
    };

    const docRef = await db.collection('reviews').add(reviewData);

    res.status(201).json({
      success: true,
      review: {
        id: docRef.id,
        ...reviewData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a review
router.delete('/:reviewId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const authReq = req as AuthRequest;
    const currentUserId = authReq.user?.uid;
    
    if (!currentUserId) {
      return next(new AppError(401, 'Unauthorized'));
    }

    const reviewRef = db.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return next(new AppError(404, 'Review not found'));
    }

    const reviewData = reviewDoc.data();
    
    // Get current user's role
    const userDoc = await db.collection('users').doc(currentUserId).get();
    const isAdmin = userDoc.exists && userDoc.data()?.role === 'admin';

    // Allow deletion if admin OR if current user is the author
    if (isAdmin || reviewData?.userId === currentUserId) {
      await reviewRef.delete();
      return res.json({ success: true, message: 'Review deleted successfully' });
    } else {
      return next(new AppError(403, 'You do not have permission to delete this review'));
    }
  } catch (error) {
    next(error);
  }
});

export default router;
