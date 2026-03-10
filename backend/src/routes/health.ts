import { Router, Request, Response } from 'express';

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

export default router;
