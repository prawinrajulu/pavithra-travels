import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

router.get('/health/db', async (req: Request, res: Response) => {
  try {
    // Simple Firestore ping
    const doc = await (await import('../config/firebase.js')).db.collection('_health').doc('ping').get();
    res.json({
      status: 'OK',
      firebase: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      firebase: 'disconnected',
      error: String(error),
    });
  }
});

router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { emailService } = await import('../services/emailService.js');
    console.log('[HEALTH] Manual email test triggered');
    
    const result = await emailService.sendBookingConfirmation({
      toEmail: req.body.to || 'test@example.com',
      customerName: 'Test Customer',
      destination: 'Varanasi',
      travelDate: '2026-05-20',
      passengers: 2,
      bookingId: 'TRV-TEST-123',
      phone: '9150557789'
    });

    res.json({
      success: true,
      message: 'Email test completed',
      details: result
    });
  } catch (error: any) {
    console.error('[HEALTH] Email test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      fullError: error
    });
  }
});

export default router;
