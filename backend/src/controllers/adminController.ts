import { Request, Response, NextFunction } from 'express';
import { whatsappService } from '../services/whatsappService.js';

export class AdminController {
  async getWhatsAppStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const isConfigured = whatsappService.isConfigured;
      res.json({
        success: true,
        isConfigured,
        provider: 'Twilio',
        ownerNumber: process.env.OWNER_WHATSAPP || 'Not Set'
      });
    } catch (error) {
      next(error);
    }
  }

  async sendTestWhatsApp(req: Request, res: Response, next: NextFunction) {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ success: false, error: 'Recipient and message are required' });
      }

      const result = await whatsappService.sendTestMessage(to, message);
      
      if (result.success) {
        res.json({ success: true, messageId: result.messageId });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
