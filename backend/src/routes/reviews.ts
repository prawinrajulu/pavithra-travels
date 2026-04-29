import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';
import { AppError } from '../middleware/errorHandler.js';

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
    const { destinationId, author, rating, comment, date, timestamp } = req.body;

    if (!destinationId || !author || !rating || !comment) {
      return next(new AppError(400, 'Missing required fields'));
    }

    const reviewData = {
      destinationId,
      author,
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

export default router;
