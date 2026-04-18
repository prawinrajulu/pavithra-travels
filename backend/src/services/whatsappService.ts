import twilio from 'twilio';
import { config } from '../config/env.js';

/**
 * WhatsApp Notification Service
 * 
 * Handles automated WhatsApp triggers using Twilio.
 */

export interface WhatsAppData {
  customerName: string;
  destination: string;
  travelDate: Date | string;
  phone: string;
  bookingId: string;
}

export class WhatsAppService {
  private ownerNumber: string = process.env.OWNER_WHATSAPP || '+917824047328';
  private client: twilio.Twilio | null = null;
  private fromNumber: string = config.twilio.fromNumber;

  constructor() {
    if (config.twilio.accountSid && config.twilio.authToken) {
      try {
        this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
        console.log('[WHATSAPP SERVICE] Twilio initialized successfully');
      } catch (err: any) {
        console.error('[WHATSAPP SERVICE] Initialization failed:', err.message);
      }
    }
  }

  get isConfigured(): boolean {
    return !!this.client;
  }

  async sendBookingAlert(data: WhatsAppData): Promise<boolean> {
    try {
      const dateStr = data.travelDate instanceof Date 
        ? data.travelDate.toLocaleDateString() 
        : data.travelDate;

      const message = `
*New Booking Received* 🚌
--------------------------
👤 *Customer:* ${data.customerName}
📍 *Destination:* ${data.destination}
📅 *Date:* ${dateStr}
📱 *Phone:* ${data.phone}
🎫 *Booking ID:* ${data.bookingId}

_System generated alert from Pavithra Travels_
`.trim();

      if (this.client) {
        // Twilio requires 'whatsapp:' prefix
        const to = this.ownerNumber.startsWith('whatsapp:') ? this.ownerNumber : `whatsapp:+${this.ownerNumber.replace('+', '')}`;
        const from = this.fromNumber.startsWith('whatsapp:') ? this.fromNumber : `whatsapp:${this.fromNumber}`;

        await this.client.messages.create({
          body: message,
          from,
          to
        });
        console.log(`[WHATSAPP SERVICE] Alert sent to ${to}`);
        return true;
      }

      console.log('--------------------------------------------------');
      console.log(`[WHATSAPP ALERT SILHOUETTE] To Travel Owner (${this.ownerNumber}):`);
      console.log(message);
      console.log('--------------------------------------------------');

      return true;
    } catch (error) {
      console.error('[WHATSAPP SERVICE] Failed to trigger notification:', error);
      return false;
    }
  }

  async sendTestMessage(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:+${to.replace('+', '')}`;
      const from = this.fromNumber.startsWith('whatsapp:') ? this.fromNumber : `whatsapp:${this.fromNumber}`;

      const res = await this.client.messages.create({
        body: text,
        from,
        to: formattedTo
      });

      return { success: true, messageId: res.sid };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async sendTripCompletionAlert(data: WhatsAppData): Promise<boolean> {
    if (!this.client) return false;

    try {
      const dateStr = data.travelDate instanceof Date 
        ? data.travelDate.toLocaleDateString() 
        : data.travelDate;

      const message = `
*Journey Completed!* 🎊
--------------------------
Dear *${data.customerName}*,

We hope you had a blessed journey to *${data.destination}* on ${dateStr}.

Your booking *${data.bookingId}* is now marked as completed. Thank you for travelling with *Pavithra Travels*.

_May your pilgrimage bring you peace and joy._
`.trim();

      const to = `whatsapp:+${data.phone.replace(/\D/g, '')}`;
      const from = this.fromNumber.startsWith('whatsapp:') ? this.fromNumber : `whatsapp:${this.fromNumber}`;

      await this.client.messages.create({
        body: message,
        from,
        to
      });
      console.log(`[WHATSAPP SERVICE] Completion alert sent to ${to}`);
      return true;
    } catch (error) {
      console.error('[WHATSAPP SERVICE] Failed to send completion alert:', error);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
