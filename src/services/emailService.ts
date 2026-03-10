import emailjs from '@emailjs/browser';

// EmailJS configuration - you'll need to set these up in your EmailJS account
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface EmailData {
  to_email: string;
  customer_name: string;
  destination: string;
  travel_date: string;
  passengers: number;
  booking_id: string;
  booking_phone?: string;
  booking_status_link?: string;
}

export class EmailService {
  async sendBookingConfirmation(data: EmailData): Promise<void> {
    // Skip if EmailJS is not configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn('EmailJS not configured. Skipping email notification.');
      return;
    }

    try {
      // Generate booking status check link
      const baseUrl = window.location.origin;
      const bookingStatusLink = `${baseUrl}/booking-status?check=${data.booking_id}`;
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: data.to_email,
          customer_name: data.customer_name,
          destination: data.destination,
          travel_date: data.travel_date,
          passengers: data.passengers,
          booking_id: data.booking_id,
          booking_phone: data.booking_phone || 'Not provided',
          booking_status_link: bookingStatusLink,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('Booking confirmation email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error; // Re-throw to handle in the component
    }
  }
}

export const emailService = new EmailService();