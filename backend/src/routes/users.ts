import { Router, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const user = await userService.getUserByFirebaseUid(req.user.uid);

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    const profile = await userService.getUserProfile(user.id);

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const user = await userService.getUserByFirebaseUid(req.user.uid);

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    const updates = {
      displayName: (req as any).body.displayName || user.displayName,
      phone: (req as any).body.phone,
      address: (req as any).body.address,
      city: (req as any).body.city,
      state: (req as any).body.state,
      pincode: (req as any).body.pincode,
    };

    const updated = await userService.updateUser(user.id, updates);

    res.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:userId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as any).params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
