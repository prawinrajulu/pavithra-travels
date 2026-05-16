import axios from 'axios';
import { config } from '../config/env.js';

/**
 * WhatsApp Notification Service
 * 
 * Handles automated WhatsApp triggers using Meta WhatsApp Cloud API.
 */

export interface WhatsAppData {
  customerName: string;
  destination: string;
  travelDate: Date | string;
  phone: string;
  bookingId: string;
}

export class WhatsAppService {
  private ownerNumber: string = config.whatsapp.ownerNumber;
  private phoneId: string | undefined = config.whatsapp.phoneId;
  private token: string | undefined = config.whatsapp.token;
  private apiUrl: string = 'https://graph.facebook.com/v25.0';

  constructor() {
    if (this.phoneId && this.token) {
      console.log('[WHATSAPP SERVICE] Meta WhatsApp Cloud API configured');
    } else {
      console.warn('[WHATSAPP SERVICE] Configuration missing (WHATSAPP_PHONE_ID or WHATSAPP_TOKEN)');
    }
  }

  get isConfigured(): boolean {
    return !!(this.phoneId && this.token);
  }

  /**
   * Send a template or text message via Meta API
   */
  private async sendMessage(to: string, payload: any): Promise<any> {
    if (!this.isConfigured) {
      throw new Error('WhatsApp service not configured (check WHATSAPP_PHONE_ID and WHATSAPP_TOKEN)');
    }

    // Strictly remove all non-digits for Meta API compatibility
    const formattedTo = to.replace(/\D/g, '');
    const url = `${this.apiUrl}/${this.phoneId}/messages`;

    console.log(`[WHATSAPP DEBUG] Attempting to send message to: ${formattedTo}`);
    console.log(`[WHATSAPP DEBUG] URL: ${url}`);
    
    try {
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: formattedTo,
          ...payload
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`[WHATSAPP DEBUG] Success! Message ID: ${response.data.messages?.[0]?.id}`);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error('[WHATSAPP DEBUG] API Call Failed!');
      console.error('[WHATSAPP DEBUG] Status:', error.response?.status);
      console.error('[WHATSAPP DEBUG] Error Details:', JSON.stringify(errorData, null, 2));
      
      if (errorData?.error?.code === 190) {
        console.error('[WHATSAPP DEBUG] 💡 HINT: Your access token has expired or is invalid.');
      } else if (errorData?.error?.code === 100) {
        console.error('[WHATSAPP DEBUG] 💡 HINT: Check if your Phone ID or Recipient Number is correct.');
      } else if (errorData?.error?.message?.includes('template')) {
        console.error('[WHATSAPP DEBUG] 💡 HINT: Business-initiated messages must use a registered template.');
      }
      
      throw error;
    }
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

      if (this.isConfigured) {
        await this.sendMessage(this.ownerNumber, {
          type: 'text',
          text: { body: message }
        });
        console.log(`[WHATSAPP SERVICE] Alert sent to ${this.ownerNumber}`);
        return true;
      }

      console.log('--------------------------------------------------');
      console.log(`[WHATSAPP ALERT SILHOUETTE] To Travel Owner (${this.ownerNumber}):`);
      console.log(message);
      console.log('--------------------------------------------------');

      return true;
    } catch (error: any) {
      console.error('[WHATSAPP SERVICE] Failed to trigger notification:', error.response?.data || error.message);
      return false;
    }
  }

  async sendTestMessage(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const data = await this.sendMessage(to, {
        type: 'text',
        text: { body: text }
      });

      return { success: true, messageId: data.messages?.[0]?.id };
    } catch (error: any) {
      console.error('[WHATSAPP SERVICE] Test message failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }

  async sendTripCompletionAlert(data: WhatsAppData): Promise<boolean> {
    try {
      const dateStr = data.travelDate instanceof Date 
        ? data.travelDate.toLocaleDateString() 
        : data.travelDate;

      // Note: In production with Meta, sending to customers often requires TEMPLATES.
      // If the 24-hour window is closed, free-form text will fail.
      // We'll use text for now as requested, but templates are better.
      const message = `
*Journey Completed!* 🎊
--------------------------
Dear *${data.customerName}*,

We hope you had a blessed journey to *${data.destination}* on ${dateStr}.

Your booking *${data.bookingId}* is now marked as completed. Thank you for travelling with *Pavithra Travels*.

_May your pilgrimage bring you peace and joy._
`.trim();

      if (this.isConfigured) {
        await this.sendMessage(data.phone, {
          type: 'text',
          text: { body: message }
        });
        console.log(`[WHATSAPP SERVICE] Completion alert sent to ${data.phone}`);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[WHATSAPP SERVICE] Failed to send completion alert:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Example of sending a template message (Production best practice)
   */
  async sendBookingConfirmationTemplate(data: WhatsAppData): Promise<boolean> {
    try {
      if (!this.isConfigured) return false;

      const dateStr = data.travelDate instanceof Date 
        ? data.travelDate.toLocaleDateString() 
        : data.travelDate;

      await this.sendMessage(data.phone, {
        type: 'template',
        template: {
          name: 'hello_world',
          language: { code: 'en_US' }
        }
      });
      return true;
    } catch (error: any) {
      console.error('[WHATSAPP SERVICE] Template send failed:', error.response?.data || error.message);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
