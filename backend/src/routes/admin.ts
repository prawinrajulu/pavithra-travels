import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware as any);
router.use(adminMiddleware as any);

router.get('/whatsapp/status', adminController.getWhatsAppStatus as any);
router.post('/whatsapp/test', adminController.sendTestWhatsApp as any);

export default router;
