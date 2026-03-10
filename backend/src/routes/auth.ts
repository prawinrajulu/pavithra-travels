import { Router, Response } from 'express';
import { auth } from '../config/firebase.js';
import { userService } from '../services/userService.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Register/Create user
router.post('/register', async (req: AuthRequest, res: Response, next) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return next(new AppError(400, 'Email, password, and displayName are required'));
    }

    // Create Firebase auth user
    const firebaseUser = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Create user document in Firestore
    const user = await userService.createUser(firebaseUser.uid, email, displayName);

    res.json({
      success: true,
      user,
      firebaseUid: firebaseUser.uid,
    });
  } catch (error) {
    next(error);
  }
});

// Get current user info
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      return next(new AppError(401, 'User not found'));
    }

    const user = await userService.getUserByFirebaseUid(req.user.uid);

    if (!user) {
      return next(new AppError(404, 'User not found in database'));
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// Verify token
router.post('/verify-token', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new AppError(400, 'Token is required'));
    }

    const decodedToken = await auth.verifyIdToken(token);

    res.json({
      success: true,
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    res.json({
      success: false,
      valid: false,
      error: 'Invalid token',
    });
  }
});

export default router;
