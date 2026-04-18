import { Resend } from 'resend';

let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error: any) {
  console.error('[EMAIL SERVICE] Failed to initialize Resend:', error.message);
}

export interface EmailData {
  toEmail: string;
  customerName: string;
  destination: string;
  travelDate: string;
  passengers: number;
  bookingId: string;
  phone: string;
  specialRequests?: string | null;
}

export class EmailService {
  private ownerEmail: string = process.env.OWNER_EMAIL || 'pprawin48@gmail.com';

  async sendBookingConfirmation(data: EmailData): Promise<{ customerSent: boolean; ownerSent: boolean }> {
    if (!resend) {
      console.error('[EMAIL SERVICE] Resend not initialized. Skipping emails.');
      return { customerSent: false, ownerSent: false };
    }

    const { toEmail, customerName, bookingId, destination, travelDate, passengers, phone, specialRequests } = data;

    const customerHtml = `<h2>Booking Confirmed!</h2><p>Dear ${customerName}, your trip to ${destination} on ${travelDate} is confirmed. Booking ID: ${bookingId}</p>`;
    const ownerHtml = `<h2>New Booking Received</h2><p>Customer: ${customerName}<br>Email: ${toEmail}<br>Phone: ${phone}<br>Destination: ${destination}<br>Date: ${travelDate}<br>Passengers: ${passengers}<br>Booking ID: ${bookingId}</p>`;

    try {
      const [customerRes, ownerRes] = await Promise.allSettled([
        resend.emails.send({
          from: 'Pavithra Travels <onboarding@resend.dev>',
          to: [toEmail],
          subject: `Reservation Confirmed - ${destination}`,
          html: customerHtml,
        }),
        resend.emails.send({
          from: 'Pavithra Travels <onboarding@resend.dev>',
          to: [this.ownerEmail],
          subject: `ALERT: New Booking from ${customerName}`,
          html: ownerHtml,
        })
      ]);

      return {
        customerSent: customerRes.status === 'fulfilled' && !customerRes.value.error,
        ownerSent: ownerRes.status === 'fulfilled' && !ownerRes.value.error,
      };
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send emails:', error);
      return { customerSent: false, ownerSent: false };
    }
  }

  async sendTripCompletionNotification(data: EmailData): Promise<boolean> {
    if (!resend) return false;

    const { toEmail, customerName, destination, travelDate, bookingId } = data;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #FF8C00;">Trip Completed!</h2>
        <p>Dear ${customerName},</p>
        <p>We hope you had a wonderful journey to <strong>${destination}</strong> on ${travelDate}.</p>
        <p>Your booking (ID: ${bookingId}) has been marked as completed in our system. Thank you for choosing Pavithra Travels for your spiritual pilgrimage.</p>
        <p>We look forward to serving you again soon.</p>
        <br>
        <p>Best Regards,<br><strong>Pavithra Travels</strong></p>
      </div>
    `;

    try {
      const { error } = await resend.emails.send({
        from: 'Pavithra Travels <onboarding@resend.dev>',
        to: [toEmail],
        subject: `Journey Completed - ${destination}`,
        html: html,
      });
      return !error;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send completion email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
