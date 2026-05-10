import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'pavithrashoppee@gmail.com',
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false // Fixes "self-signed certificate in certificate chain"
  }
});

// Verify connection configuration
transporter.verify((error: any) => {
  if (error) {
    console.error('[EMAIL SERVICE] Transporter verification failed!');
    console.error('[EMAIL SERVICE] Error Code:', error.name);
    console.error('[EMAIL SERVICE] Full Error:', error);
    
    if (error.message.includes('EAUTH')) {
      console.error('[EMAIL SERVICE] 💡 HINT: Invalid login. Check EMAIL_USER and EMAIL_PASS (App Password).');
    }
  } else {
    console.log('[EMAIL SERVICE] SMTP Server is ready (User:', process.env.EMAIL_USER || 'pavithrashoppee@gmail.com', ')');
  }
});

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
  private ownerEmail: string = process.env.OWNER_EMAIL || 'pavithrashoppee@gmail.com';

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
    
    try {

      console.log(`[EMAIL SERVICE] Sending confirmation. From: ${process.env.EMAIL_USER}, To Customer: ${toEmail}, To Owner: ${this.ownerEmail}`);

      const [customerRes, ownerRes] = await Promise.allSettled([
        transporter.sendMail({
          from: `"Pavithra Travels" <${process.env.EMAIL_USER || 'pavithrashoppee@gmail.com'}>`,
          to: toEmail,
          subject: `Reservation Confirmed - ${destination}`,
          html: customerHtml,
        }),
        transporter.sendMail({
          from: `"System Alert" <${process.env.EMAIL_USER || 'pavithrashoppee@gmail.com'}>`,
          to: this.ownerEmail,
          subject: `ALERT: New Booking from ${customerName}`,
          html: ownerHtml,
        })
      ]);

      if (customerRes.status === 'rejected') console.error('[EMAIL SERVICE] Customer email failed:', customerRes.reason);
      if (ownerRes.status === 'rejected') console.error('[EMAIL SERVICE] Owner email failed:', ownerRes.reason);

      return {
        customerSent: customerRes.status === 'fulfilled',
        ownerSent: ownerRes.status === 'fulfilled',
      };
    } catch (error: any) {
      console.error('[EMAIL SERVICE] Failed to send emails:', error);
      return { customerSent: false, ownerSent: false };
    }
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
        from: `"Pavithra Travels" <${process.env.EMAIL_USER || 'pavithrashoppee@gmail.com'}>`,
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
