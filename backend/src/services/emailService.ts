import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { config } from '../config/env.js';

let resendClient: Resend | null = null;
if (config.email.resendApiKey) {
  try {
    resendClient = new Resend(config.email.resendApiKey);
    console.log('[EMAIL SERVICE] Resend client initialized as email provider/fallback.');
  } catch (err: any) {
    console.warn('[EMAIL SERVICE] Could not initialize Resend client:', err.message);
  }
}

// Configure Nodemailer transporter
let smtpAvailable = false;
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass, 
  },
  tls: {
    rejectUnauthorized: false // Fixes "self-signed certificate in certificate chain"
  }
});

// Verify connection configuration safely without crashing
if (config.email.user && config.email.pass) {
  transporter.verify((error: any) => {
    if (error) {
      smtpAvailable = false;
      console.warn('[EMAIL SERVICE] ⚠️ Gmail SMTP authentication notice:');
      console.warn('               Username and password not accepted by Gmail (code: EAUTH).');
      console.warn('               To enable Gmail SMTP, generate a 16-character App Password in Google Account Settings:');
      console.warn('               Google Account -> Security -> 2-Step Verification -> App Passwords.');
      if (resendClient) {
        console.log('[EMAIL SERVICE] ✅ Will use Resend for outgoing emails.');
      }
    } else {
      smtpAvailable = true;
      console.log(`[EMAIL SERVICE] ✅ SMTP Server ready (User: ${config.email.user})`);
    }
  });
} else {
  console.log('[EMAIL SERVICE] SMTP credentials not provided. Using Resend / webhook fallback.');
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
  async sendBookingConfirmation(data: EmailData): Promise<{ customerSent: boolean; ownerSent: boolean }> {
    const { toEmail, customerName, bookingId, destination, travelDate, passengers, phone, specialRequests } = data;

    const customerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #FF8C00;">Booking Confirmed!</h2>
        <p>Dear ${customerName},</p>
        <p>Your journey to <strong>${destination}</strong> on ${travelDate} has been successfully reserved.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>Our team will contact you shortly to finalize the details.</p>
        <br>
        <p>Best Regards,<br><strong>Pavithra Travels</strong></p>
      </div>
    `;

    const ownerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #701C1C;">New Booking Received</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${toEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Date:</strong> ${travelDate}</p>
        <p><strong>Passengers:</strong> ${passengers}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
      </div>
    `;
    
    let customerSent = false;
    let ownerSent = false;

    // Strategy 1: Attempt via Gmail SMTP if available
    if (smtpAvailable) {
      try {
        console.log(`[EMAIL SERVICE] Attempting dispatch via Nodemailer to Customer: ${toEmail}`);
        const [customerRes, ownerRes] = await Promise.allSettled([
          transporter.sendMail({
            from: `"Pavithra Travels" <${config.email.user}>`,
            to: toEmail,
            subject: `Reservation Confirmed - ${destination}`,
            html: customerHtml,
          }),
          transporter.sendMail({
            from: `"System Alert" <${config.email.user}>`,
            to: config.email.ownerEmail,
            subject: `ALERT: New Booking from ${customerName}`,
            html: ownerHtml,
          })
        ]);

        customerSent = customerRes.status === 'fulfilled';
        ownerSent = ownerRes.status === 'fulfilled';
      } catch (smtpErr: any) {
        console.warn('[EMAIL SERVICE] Nodemailer send error, attempting fallback:', smtpErr.message);
      }
    }

    // Strategy 2: If SMTP did not send or wasn't available, attempt via Resend
    if ((!customerSent || !ownerSent) && resendClient) {
      try {
        console.log(`[EMAIL SERVICE] Dispatching via Resend to Customer: ${toEmail}, Owner: ${config.email.ownerEmail}`);
        const [resendCust, resendOwner] = await Promise.allSettled([
          !customerSent && toEmail ? resendClient.emails.send({
            from: 'Pavithra Travels <onboarding@resend.dev>',
            to: [toEmail],
            subject: `Reservation Confirmed - ${destination}`,
            html: customerHtml,
          }) : Promise.resolve(null),
          !ownerSent && config.email.ownerEmail ? resendClient.emails.send({
            from: 'Pavithra Travels <onboarding@resend.dev>',
            to: [config.email.ownerEmail],
            subject: `ALERT: New Booking from ${customerName}`,
            html: ownerHtml,
          }) : Promise.resolve(null)
        ]);

        if (resendCust.status === 'fulfilled' && resendCust.value && !(resendCust.value as any).error) {
          customerSent = true;
        }
        if (resendOwner.status === 'fulfilled' && resendOwner.value && !(resendOwner.value as any).error) {
          ownerSent = true;
        }
      } catch (resendErr: any) {
        console.warn('[EMAIL SERVICE] Resend send notice:', resendErr.message);
      }
    }

    return { customerSent, ownerSent };
  }

  async sendTripCompletionNotification(data: EmailData): Promise<boolean> {
    const { toEmail, customerName, destination, travelDate, bookingId } = data;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #FF8C00;">Trip Completed!</h2>
        <p>Dear ${customerName},</p>
        <p>We hope you had a wonderful journey to <strong>${destination}</strong> on ${travelDate}.</p>
        <p>Your booking (ID: ${bookingId}) has been marked as completed. Thank you for choosing Pavithra Travels.</p>
        <br>
        <p>Best Regards,<br><strong>Pavithra Travels</strong></p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Pavithra Travels" <${config.email.user}>`,
        to: toEmail,
        subject: `Journey Completed - ${destination}`,
        html: html,
      });
      return true;
    } catch (error: any) {
      console.error('[EMAIL SERVICE] Failed to send completion email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
