import { Router, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

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
