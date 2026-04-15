import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase.js';
import { AppError } from './errorHandler.js';
import { userService } from '../services/userService.js';

export interface UserContext {
  uid: string;
  email?: string;
  name?: string;
  role?: 'user' | 'admin';
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
    const dbUser = await userService.getUserByFirebaseUid(decodedToken.uid);
    
    authReq.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      role: dbUser?.role || 'user',
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
        role: dbUser?.role || 'user',
      };
    }
  } catch (error) {
    // Continue without user
  }
  next();
};

/**
 * Admin Only Middleware
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authReq = req as AuthRequest;
  if (authReq.user && authReq.user.role === 'admin') {
    next();
  } else {
    next(new AppError(403, 'Access denied. Admin permissions required.'));
  }
};
