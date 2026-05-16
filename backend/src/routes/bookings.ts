import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService.js';
import { emailService } from '../services/emailService.js';
import { whatsappService } from '../services/whatsappService.js';
import { AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, superAdminMiddleware } from '../middleware/auth.js';

const router = Router();

console.log('✅ Bookings router initialized and mounted.');

// Diagnostic Ping (Public)
router.get('/ping', (req: Request, res: Response) => {
  console.log('[BOOKINGS ROUTER] Ping received');
  res.json({ success: true, message: 'Bookings router is alive!', timestamp: new Date().toISOString() });
});

// Create booking (no auth required for basic booking)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/status/:bookingId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return next(new AppError(400, 'Booking ID is required'));
    }
    
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
router.get('/user/:phone', async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/my', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.uid;
    const email = authReq.user?.email;
    console.log(`[BACKEND] Fetching bookings for UserID: ${userId}, Email: ${email}`);
    
    if (!userId && !email) {
      console.error('[BACKEND] Unauthorized access attempt (no userId or email)');
      return next(new AppError(401, 'User not identified'));
    }

    const bookings = await bookingService.getBookingsByUserOrEmail(userId, email);
    console.log(`[BACKEND] Found ${bookings.length} bookings for user`);

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('[BACKEND] Error in /bookings/my:', error);
    next(error);
  }
});

// Get all bookings (for super admin only)
router.get('/', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

// Update booking status (for super admin only)
router.put('/:bookingId/status', authMiddleware, superAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!bookingId) {
      return next(new AppError(400, 'Booking ID is required'));
    }

    const booking = await bookingService.updateBooking(bookingId, { status });
    console.log(`[BOOKINGS ROUTER] Status for ${bookingId} updated to ${status}`);

    // Trigger Completion Notifications (Background task)
    if (status === 'completed') {
      console.log(`[BOOKINGS ROUTER] Triggering background completion notifications for ${bookingId}`);
      Promise.allSettled([
        emailService.sendTripCompletionNotification({
          toEmail: booking.email || '',
          customerName: booking.name,
          destination: booking.destinationName || '',
          travelDate: new Date(booking.travelDate).toLocaleDateString(),
          passengers: booking.passengers,
          bookingId: booking.bookingId,
          phone: booking.phone
        }),
        whatsappService.sendTripCompletionAlert({
          customerName: booking.name,
          destination: booking.destinationName || '',
          travelDate: booking.travelDate,
          phone: booking.phone,
          bookingId: booking.bookingId
        })
      ]).then(() => {
        console.log(`[BOOKINGS ROUTER] Background completion notifications for ${bookingId} finished.`);
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
