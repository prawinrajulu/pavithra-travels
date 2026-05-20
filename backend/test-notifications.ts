import { emailService } from './src/services/emailService.js';
import { whatsappService } from './src/services/whatsappService.js';
import { config } from './src/config/env.js';

async function run() {
  console.log('Testing Email...');
  const emailRes = await emailService.sendBookingConfirmation({
    toEmail: 'test@example.com',
    customerName: 'Test Customer',
    destination: 'Test Destination',
    travelDate: '2026-05-20',
    passengers: 2,
    bookingId: 'TRV-123456',
    phone: '+919999999999',
  });
  console.log('Email Result:', emailRes);

  console.log('Testing WhatsApp...');
  const waRes = await whatsappService.sendBookingAlert({
    customerName: 'Test Customer',
    destination: 'Test Destination',
    travelDate: '2026-05-20',
    phone: '+919999999999',
    bookingId: 'TRV-123456',
  });
  console.log('WhatsApp Result:', waRes);
}

run().catch(console.error);
