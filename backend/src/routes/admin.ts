import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/whatsapp/status', adminController.getWhatsAppStatus);
router.post('/whatsapp/test', adminController.sendTestWhatsApp);

export default router;
