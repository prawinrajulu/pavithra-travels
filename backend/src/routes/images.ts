import { Router, Request, Response } from 'express';
import { unsplashService } from '../services/unsplashService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Search Unsplash images
router.get('/unsplash/search', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { query, page, perPage } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const data = await unsplashService.searchPhotos(
      query as string,
      page ? parseInt(page as string) : 1,
      perPage ? parseInt(perPage as string) : 20
    );

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    next(error);
  }
});

// Trigger download for Unsplash API attribution tracking
router.post('/unsplash/trigger-download', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { downloadLocation } = req.body;
    if (downloadLocation) {
      await unsplashService.triggerDownload(downloadLocation);
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
