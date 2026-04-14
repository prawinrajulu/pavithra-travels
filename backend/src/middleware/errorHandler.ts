import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  console.error('Unexpected error:', err);
  
  // Specific check for Firebase initialization failure errors
  const isFirebaseInitError = err.message?.includes('Firebase not initialized') || 
                             err.message?.includes('Firebase Authentication service is not initialized');

  return res.status(500).json({
    success: false,
    error: isFirebaseInitError 
      ? 'The server is having trouble connecting to Firebase. Please try again in a moment.' 
      : 'Internal server error',
    statusCode: 500,
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack 
    }),
  });
};
