import { Router, Response, Request } from 'express';
import { destinationService } from '../services/destinationService.js';
import { AppError } from '../middleware/errorHandler.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all destinations
router.get('/', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const destinations = await destinationService.getAllDestinations();

    res.json({
      success: true,
      destinations,
      count: destinations.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get destination by ID
router.get('/:destinationId', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { destinationId } = req.params;
    const destination = await destinationService.getDestination(destinationId);

    if (!destination) {
      return next(new AppError(404, 'Destination not found'));
    }

    res.json({
      success: true,
      destination,
    });
  } catch (error) {
    next(error);
  }
});

// Get destinations by category
router.get('/category/:category', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { category } = req.params;
    const destinations = await destinationService.getDestinationsByCategory(category);

    res.json({
      success: true,
      destinations,
      count: destinations.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get destinations by region
router.get('/region/:region', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const { region } = req.params;
    const destinations = await destinationService.getDestinationsByRegion(region);

    res.json({
      success: true,
      destinations,
      count: destinations.length,
    });
  } catch (error) {
    next(error);
  }
});

// Filter destinations
router.post('/filter', optionalAuth, async (req: Request, res: Response, next) => {
  try {
    const filters = req.body;
    const destinations = await destinationService.filterDestinations(filters);

    res.json({
      success: true,
      destinations,
      count: destinations.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
