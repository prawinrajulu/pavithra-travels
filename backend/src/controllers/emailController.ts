import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Resend } from 'resend';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

let resend: Resend | null = null;
try {
  if (config.email.resendApiKey) {
    resend = new Resend(config.email.resendApiKey);
    console.log('[EMAIL] Resend initialized successfully');
  } else {
    console.warn('[EMAIL] RESEND_API_KEY missing. Email features will be disabled.');
  }
} catch (error: any) {
  console.error('[EMAIL] Failed to initialize Resend:', error.message);
}

// Robust Rate Limiting with express-rate-limit
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many emails sent from this IP, please try again after 15 minutes.' },
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    console.warn(`[RATE LIMIT TRIGGERED] IP: ${req.ip} exceeded email send limits.`);
    res.status(options.statusCode).json(options.message);
  }
});

// App-level API Key Protection (Optional, removed for simplicity as requested)
export const requireApiKey: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  // Skipping API key check to match simplified frontend request
  next();
};

export const validateEmailRequest = [
  body('to_email').isEmail().withMessage('Valid email is required'),
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('booking_id').notEmpty().withMessage('Booking ID is required'),
];

export const sendBookingConfirmation: RequestHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ success: false, errors: errors.array() });
       return;
    }

    const {
      to_email,
      customer_name,
      booking_id,
      destination,
      travel_date,
      passengers,
      booking_phone,
      special_requests
    } = req.body;

    // Use default values if optional fields are missing from simplified request
    const dest = destination || 'Your Trip';
    const date = travel_date || 'TBD';
    const count = passengers || 1;

    // Professional Customer Email Template (Cinematic Modern)
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; }
            .logo-text { color: #f59e0b; font-size: 28px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
            .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; }
            .booking-card { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #f1f5f9; }
            .pnr-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 15px; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .detail-item { margin-bottom: 15px; }
            .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; display: block; }
            .value { font-weight: 600; font-size: 16px; color: #0f172a; }
            .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; }
            .highlight { color: #f59e0b; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo-text">Pavithra Travels</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 10px;">Your Premium Journey Awaits</p>
            </div>
            <div class="content">
              <h2 style="font-weight: 400; margin-top: 0;">Reservation Confirmed</h2>
              <p>Dear ${customer_name},</p>
              <p>Thank you for choosing <span class="highlight">Pavithra Travels</span>. We are delighted to confirm that your booking for <span class="highlight">${dest}</span> has been successfully processed.</p>
              
              <div class="booking-card">
                <div class="pnr-badge">BOOKING #${booking_id}</div>
                <div style="display: table; width: 100%;">
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding-bottom: 15px;">
                      <span class="label">Destination</span>
                      <span class="value">${dest}</span>
                    </div>
                    <div style="display: table-cell; padding-bottom: 15px;">
                      <span class="label">Travel Date</span>
                      <span class="value">${date}</span>
                    </div>
                  </div>
                  <div style="display: table-row;">
                    <div style="display: table-cell;">
                      <span class="label">Passengers</span>
                      <span class="value">${count} Adult(s)</span>
                    </div>
                    <div style="display: table-cell;">
                      <span class="label">Status</span>
                      <span class="value" style="color: #10b981;">● Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>

              <p>If you have any questions or require modifications to your trip, please contact our support team with your booking reference.</p>
              
              <div class="footer">
                <p>&copy; 2026 Pavithra Travels. Luxury & Comfort across India.</p>
                <p>This is an automated confirmation. Please do not reply directly.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Professional Owner Notification Template
    const ownerEmailHtml = `
      <div style="font-family: sans-serif; color: #334155; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; color: #f59e0b;">NEW BOOKING ALERT</h2>
          <p style="margin: 5px 0 0; opacity: 0.8;">Action Required: Review Booking Details</p>
        </div>
        <div style="padding: 30px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Customer Information</h3>
          <p><strong>Name:</strong> ${customer_name}</p>
          <p><strong>Email:</strong> ${to_email}</p>
          <p><strong>Phone:</strong> ${booking_phone || 'None'}</p>

          <h3 style="margin-top: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Booking Details</h3>
          <p><strong>Destination:</strong> ${dest}</p>
          <p><strong>Travel Date:</strong> ${date}</p>
          <p><strong>Passenger Count:</strong> ${count}</p>
          <p><strong>Special Requests:</strong> ${special_requests || 'No specific preferences'}</p>
          <p><strong>Booking ID:</strong> <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${booking_id}</span></p>
          
          <div style="margin-top: 30px; background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px;">
            <p style="margin: 0; font-size: 14px;"><strong>Admin Note:</strong> Please coordinate with the internal fleet management to verify vehicle availability for this date.</p>
          </div>
        </div>
      </div>
    `;

    const ownerEmail = process.env.OWNER_EMAIL || 'pavithrashoppee@gmail.com';

    if (!resend) {
      console.error('[EMAIL] Resend not initialized. Email skipped.');
      return res.status(200).json({
        success: true,
        message: 'Booking saved, but email service is currently unavailable. Operator will contact you.',
        booking_id: booking_id,
        emails_sent: false
      });
    }

    console.log(`[EMAIL] Sending professional confirmation to: ${to_email}`);

    // Send emails in parallel and handle errors independently
    const [customerResult, ownerResult] = await Promise.allSettled([
      resend.emails.send({
        from: 'Pavithra Travels <onboarding@resend.dev>',
        to: [to_email],
        subject: `Reservation Confirmed - ${dest}`,
        html: customerEmailHtml,
      }),
      resend.emails.send({
        from: 'Pavithra Travels <onboarding@resend.dev>',
        to: [ownerEmail],
        subject: `ALERT: New Booking from ${customer_name}`,
        html: ownerEmailHtml,
      })
    ]);

    const customerEmailSuccess = customerResult.status === 'fulfilled' && !customerResult.value.error;
    const ownerEmailSuccess = ownerResult.status === 'fulfilled' && !ownerResult.value.error;

    if (customerResult.status === 'fulfilled' && customerResult.value.error) {
      console.error('[EMAIL ERROR] Customer confirmation API error:', customerResult.value.error);
    } else if (customerResult.status === 'rejected') {
      console.error('[EMAIL ERROR] Customer confirmation rejected:', customerResult.reason);
    } else {
      console.log('[EMAIL SUCCESS] Customer confirmation accepted. ID:', customerResult.value.data?.id);
    }

    if (ownerResult.status === 'fulfilled' && ownerResult.value.error) {
      console.error('[EMAIL ERROR] Owner notification API error:', ownerResult.value.error);
    } else if (ownerResult.status === 'rejected') {
      console.error('[EMAIL ERROR] Owner notification rejected:', ownerResult.reason);
    } else {
      console.log('[EMAIL SUCCESS] Owner notification accepted. ID:', ownerResult.value.data?.id);
    }

    if (customerEmailSuccess || ownerEmailSuccess) {
      res.status(200).json({ 
        success: true, 
        message: 'Email processing completed',
        customer_sent: customerEmailSuccess,
        owner_sent: ownerEmailSuccess
      });
    } else {
      const errorMsg = (ownerResult.status === 'fulfilled' && ownerResult.value.error?.message) || 'All email attempts failed';
      throw new Error(errorMsg);
    }
  } catch (error: any) {
    console.error('Email final exception:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send confirmation email', details: error.message });
  }
};
