import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase.js';
import { AppError } from './errorHandler.js';
import { userService } from '../services/userService.js';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    role?: 'user' | 'admin';
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new AppError(401, 'No authentication token provided');
    }

    if (!firebaseAuth) {
      throw new AppError(503, 'Authentication service is currently unavailable. Please contact the administrator.');
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    // Fetch matching user from our database to get their role
    const dbUser = await userService.getUserByFirebaseUid(decodedToken.uid);
    
    req.user = {
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

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (token && firebaseAuth) {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      const dbUser = await userService.getUserByFirebaseUid(decodedToken.uid);
      req.user = {
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

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new AppError(403, 'Access denied. Admin permissions required.'));
  }
};
