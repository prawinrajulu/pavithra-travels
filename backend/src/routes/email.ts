import { Router } from 'express';
import { sendBookingConfirmation, validateEmailRequest, emailRateLimiter, requireApiKey } from '../controllers/emailController.js';

const router = Router();

router.post('/send-confirmation', emailRateLimiter, requireApiKey, validateEmailRequest, sendBookingConfirmation);

export default router;
