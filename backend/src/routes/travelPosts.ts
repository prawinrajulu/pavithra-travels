import { Router, Request, Response, NextFunction } from 'express';
import { travelPostService } from '../services/travelPostService.js';
import { authMiddleware, superAdminMiddleware } from '../middleware/auth.js';
const router = Router();

// Public Routes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await travelPostService.getAllPosts();
    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await travelPostService.getPostById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const reviews = await travelPostService.getReviewsByPostId(id);
    res.json({ success: true, post: { ...post, reviews } });
  } catch (error) {
    next(error);
  }
});

router.post('/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await travelPostService.addReview(req.body);
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
});

// Admin Routes (Protected - Super Admin Only)
router.post('/', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, location, imageUrl, images } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const post = await travelPostService.createPost({ 
      title, 
      description, 
      location, 
      imageUrl: imageUrl || (images && images[0]) || '', 
      images: images || [] 
    });
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, location, imageUrl, images } = req.body;
    
    const post = await travelPostService.updatePost(id, { 
      title, 
      description, 
      location, 
      imageUrl, 
      images: images || [] 
    });
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await travelPostService.deletePost(id);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
