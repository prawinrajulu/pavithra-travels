import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService.js';
import { AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

console.log('✅ Bookings router initialized and mounted.');

// Diagnostic Ping (Public)
router.get('/ping', (req: Request, res: Response) => {
  console.log('[BOOKINGS ROUTER] Ping received');
  res.json({ success: true, message: 'Bookings router is alive!', timestamp: new Date().toISOString() });
});

// Create booking (no auth required for basic booking)
router.post('/', async (req: any, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
});

// Get booking by booking ID (public access for status checking)
router.get('/status/:bookingId', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBooking(bookingId);

    if (!booking) {
      return next(new AppError(404, 'Booking not found'));
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
});

// Get user's own bookings by Phone (Requirement #3B)
router.get('/user/:phone', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.params;
    console.log(`[BACKEND] Fetching bookings for Phone: ${phone}`);
    
    if (!phone) {
      return next(new AppError(400, 'Phone number is required'));
    }

    const bookings = await bookingService.getBookingsByPhone(phone);
    console.log(`[BACKEND] Found ${bookings.length} bookings for phone ${phone}`);

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('[BACKEND] Error in /bookings/user/:phone:', error);
    next(error);
  }
});

// Get user's own bookings (Legacy/Authenticated sync)
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.uid;
    console.log(`[BACKEND] Fetching bookings for UserID: ${userId}`);
    
    if (!userId) {
      console.error('[BACKEND] Unauthorized access attempt (no userId)');
      return next(new AppError(401, 'User not identified'));
    }

    const bookings = await bookingService.getBookingsByUser(userId);
    console.log(`[BACKEND] Found ${bookings.length} bookings for user ${userId}`);

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('[BACKEND] Error in /bookings/my:', error);
    next(error);
  }
});

// Get all bookings (for admin purposes)
router.get('/', async (req: any, res: Response, next: NextFunction) => {
  try {
    const bookings = await bookingService.getAllBookings();

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
});

// Update booking status
router.put('/:bookingId/status', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await bookingService.updateBooking(bookingId, { status });

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
