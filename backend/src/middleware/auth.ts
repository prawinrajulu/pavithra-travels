import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase.js';
import { AppError } from './errorHandler.js';
import { userService } from '../services/userService.js';

export interface UserContext {
  uid: string;
  email?: string;
  name?: string;
  role?: 'user' | 'admin' | 'super_admin';
}

export interface AuthRequest extends Request {
  user?: UserContext;
}

/**
 * Standard Express Middleware for Auth
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return next(new AppError(401, 'No authentication token provided'));
    }

    if (!firebaseAuth) {
      return next(new AppError(503, 'Authentication service is unavailable.'));
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    // Fetch matching user from our database to get their role
    let dbUser = await userService.getUserByFirebaseUid(decodedToken.uid);
    
    // Automatically assign super_admin if email matches
    if (decodedToken.email === 'pavithrashoppee@gmail.com' && dbUser?.role !== 'super_admin') {
      await userService.setSuperAdmin('pavithrashoppee@gmail.com');
      dbUser = await userService.getUserByFirebaseUid(decodedToken.uid); // Refresh
    }

    authReq.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      role: (decodedToken.email === 'pavithrashoppee@gmail.com' ? 'super_admin' : (dbUser?.role || 'user')) as any,
    };

    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token'));
  }
};

/**
 * Optional Auth Middleware - Does not fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (token && firebaseAuth) {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      const dbUser = await userService.getUserByFirebaseUid(decodedToken.uid);
      authReq.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        role: (decodedToken.email === 'pavithrashoppee@gmail.com' ? 'super_admin' : (dbUser?.role || 'user')) as any,
      };
    }
  } catch (error) {
    // Continue without user
  }
  next();
};

/**
 * Admin Only Middleware (Includes Super Admin)
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authReq = req as AuthRequest;
  if (authReq.user && (authReq.user.role === 'admin' || authReq.user.role === 'super_admin')) {
    next();
  } else {
    next(new AppError(403, 'Access denied. Admin permissions required.'));
  }
};

/**
 * Super Admin Only Middleware
 */
export const superAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authReq = req as AuthRequest;
  if (authReq.user && authReq.user.role === 'super_admin') {
    next();
  } else {
    next(new AppError(403, 'Access denied. Super Admin permissions required.'));
  }
};
