import { Router, Response, Request, NextFunction } from 'express';
import { destinationService } from '../services/destinationService.js';
import { AppError } from '../middleware/errorHandler.js';
import { optionalAuth, authMiddleware, adminMiddleware, superAdminMiddleware } from '../middleware/auth.js';

const router = Router();

// Get all destinations
router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/:destinationId', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/category/:category', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/region/:region', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
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

// Create destination (Super Admin only)
router.post('/', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destination = req.body;
    const newDestination = await destinationService.createDestination(destination);

    res.status(201).json({
      success: true,
      destination: newDestination,
    });
  } catch (error) {
    next(error);
  }
});

// Update destination (Super Admin only)
router.put('/:destinationId', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId } = req.params;
    const updates = req.body;
    const updatedDestination = await destinationService.updateDestination(destinationId, updates);

    res.json({
      success: true,
      destination: updatedDestination,
    });
  } catch (error) {
    next(error);
  }
});

// Delete destination (Super Admin only)
router.delete('/:destinationId', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId } = req.params;
    
    // Using update to set a deleted flag or just deleting it
    // For now let's implement a delete method in service if it doesn't exist
    // Let's check service first.
    await destinationService.deleteDestination(destinationId);

    res.json({
      success: true,
      message: 'Destination deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
