import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import nodemailer from 'nodemailer';

// Load .env explicitly
const envPath = resolve(process.cwd(), '../.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded .env from', envPath);
}

const user = process.env.EMAIL_USER || 'pavithrashoppee@gmail.com';
const pass = process.env.EMAIL_PASS;

console.log('Using EMAIL_USER:', user);
console.log('Using EMAIL_PASS:', pass ? '***' : 'MISSING');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user,
    pass, 
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error: any) => {
  if (error) {
    console.error('Transporter verification failed!', error);
  } else {
    console.log('SMTP Server is ready to take our messages.');
    
    // Attempt sending a test email
    transporter.sendMail({
      from: `"Pavithra Travels" <${user}>`,
      to: user, // Send to self
      subject: `Test Email from Nodemailer`,
      html: `<b>If you receive this, Nodemailer is working perfectly!</b>`,
    }).then(res => {
      console.log('Test email sent successfully!', res.messageId);
    }).catch(err => {
      console.error('Failed to send test email', err);
    });
  }
});
