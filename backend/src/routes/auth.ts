import { Router, Response } from 'express';
import { firebaseAuth } from '../config/firebase.js';
import { userService } from '../services/userService.js';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config/env.js';

const router = Router();

// Login via REST API
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, 'Email and password are required'));
    }

    if (!config.firebase.apiKey) {
      return next(new AppError(500, 'FIREBASE_API_KEY is not configured on the server.'));
    }

    // Call Google Identity Toolkit REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.firebase.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );

    const data: any = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || 'Invalid credentials';
      return next(new AppError(401, errorMessage));
    }

    // Get the user data from our database
    const dbUser = await userService.getUserByFirebaseUid(data.localId);

    // Provide the token and user data
    res.json({
      success: true,
      token: data.idToken,
      user: {
        id: data.localId,
        email: data.email,
        name: data.displayName || dbUser?.displayName,
        role: dbUser?.role || 'user',
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin-only protected route
router.get('/admin', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome Admin!',
    data: req.user,
  });
});

// Register/Create user
router.post('/register', async (req: AuthRequest, res: Response, next) => {
  try {
    const { email, password, displayName, phone } = req.body;

    if (!email || !password || !displayName) {
      return next(new AppError(400, 'Email, password, and displayName are required'));
    }

    // Create Firebase auth user
    if (!firebaseAuth) {
      return next(new AppError(503, 'Firebase Authentication service is not initialized. Please check your FIREBASE_PRIVATE_KEY in the .env file.'));
    }

    let firebaseUser;
    try {
      firebaseUser = await firebaseAuth.createUser({
        email,
        password,
        displayName,
      });
    } catch (firebaseError: any) {
      console.warn("Firebase registration failed:", firebaseError.code);
      
      // Handle Firebase specific errors to return proper status codes
      if (firebaseError.code === 'auth/email-already-exists') {
        return next(new AppError(409, 'This email is already in use. Please log in instead.'));
      }
      if (firebaseError.code === 'auth/invalid-email') {
        return next(new AppError(400, 'The email address is invalid.'));
      }
      if (firebaseError.code === 'auth/weak-password') {
        return next(new AppError(400, 'The password is too weak.'));
      }
      
      throw firebaseError; // Reraise for general error handler
    }

    // Create user document in Firestore - include phone if provided
    const user = await userService.createUser(firebaseUser.uid, email, displayName, phone);

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

    if (!firebaseAuth) {
      return next(new AppError(503, 'Firebase Authentication service is unavailable.'));
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);

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
