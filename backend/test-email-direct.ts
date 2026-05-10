import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function runTest() {
  const { emailService } = await import('./src/services/emailService.js');
  console.log('--- Email Service Test ---');
  console.log('User:', process.env.EMAIL_USER);
  console.log('Owner:', process.env.OWNER_EMAIL);
  console.log('Password Length:', process.env.EMAIL_PASS?.length);
  console.log('Password Start:', process.env.EMAIL_PASS?.substring(0, 4));
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Error: EMAIL_USER or EMAIL_PASS missing in .env');
    process.exit(1);
  }

  try {
    console.log('Attempting to send test email...');
    const result = await emailService.sendBookingConfirmation({
      toEmail: process.env.OWNER_EMAIL || 'pavithrashoppee@gmail.com',
      customerName: 'Production Test',
      destination: 'Tirupati Balaji',
      travelDate: '2026-06-15',
      passengers: 4,
      bookingId: 'PRD-VERIFY-999',
      phone: '9150557789'
    });
    
    console.log('Result:', result);
    if (result.customerSent && result.ownerSent) {
      console.log('✅ SUCCESS: Emails triggered successfully!');
    } else {
      console.log('⚠️ WARNING: One or more emails failed to send.');
    }
  } catch (error) {
    console.error('❌ FATAL ERROR:', error);
  } finally {
    process.exit(0);
  }
}

runTest();
