import { Router, Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase.js';
import { userService } from '../services/userService.js';
import { AuthRequest, authMiddleware, adminMiddleware, superAdminMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config/env.js';

const router = Router();

// Login via REST API
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
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

    // Automatically assign super_admin if email matches
    let role = dbUser?.role || 'user';
    if (data.email === 'pavithrashoppee@gmail.com' && role !== 'super_admin') {
      await userService.setSuperAdmin('pavithrashoppee@gmail.com');
      role = 'super_admin';
    }

    // Provide the token and user data
    res.json({
      success: true,
      token: data.idToken,
      user: {
        id: data.localId,
        email: data.email,
        name: data.displayName || dbUser?.displayName,
        role: role,
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin-only protected route
router.get('/admin', authMiddleware, adminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  res.json({
    success: true,
    message: 'Welcome Admin!',
    data: authReq.user,
  });
});

// Register/Create user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
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
    let user;
    try {
      user = await userService.createUser(firebaseUser.uid, email, displayName, phone);
    } catch (dbError: any) {
      console.error(`[AUTH] Failed to create user document in Firestore for UID ${firebaseUser.uid}:`, dbError.message);
      // We don't delete the Firebase Auth user here to avoid complex rollback, 
      // but logging it helps debug perm issues.
      throw dbError; 
    }

    res.json({
      success: true,
      user,
      firebaseUid: firebaseUser.uid,
    });
  } catch (error) {
    console.error("[AUTH] Registration process failed:", error);
    next(error);
  }
});

// Get current user info
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return next(new AppError(401, 'User not found'));
    }

    const user = await userService.getUserByFirebaseUid(authReq.user.uid);

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
router.post('/verify-token', async (req: Request, res: Response, next: NextFunction) => {
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

// Reset user password (Super Admin Only)
router.post('/reset-password', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, email, newPassword } = req.body;

    if ((!userId && !email) || !newPassword) {
      return next(new AppError(400, 'User ID or email, and new password are required'));
    }

    let user;
    if (email) {
      user = await userService.getUserByEmail(email);
    } else {
      user = await userService.getUserById(userId);
    }

    if (!user || !user.firebaseUid) {
      return next(new AppError(404, 'User not found'));
    }

    await userService.changePassword(user.firebaseUid, newPassword);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Self password change (Authenticated users)
router.post('/change-password', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { newPassword, currentPassword } = req.body;

    if (!newPassword || !currentPassword) {
      return next(new AppError(400, 'Current and new password are required'));
    }

    // To verify current password, we try to log in with it
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.firebase.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: authReq.user?.email, 
          password: currentPassword, 
          returnSecureToken: true 
        })
      }
    );

    if (!response.ok) {
      return next(new AppError(401, 'Invalid current password'));
    }

    await userService.changePassword(authReq.user!.uid, newPassword);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});


export default router;
