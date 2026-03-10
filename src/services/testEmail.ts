// Test script to verify email functionality
// Run with: npm run test-email (add to package.json scripts)

import { emailService } from './emailService.js';

async function testEmailService() {
  console.log('Testing EmailJS service...');

  try {
    // Test data
    const testData = {
      to_email: 'test@example.com', // Replace with your email for testing
      customer_name: 'Test Customer',
      destination: 'Tirupati Balaji',
      travel_date: 'March 15, 2026',
      passengers: 2,
      booking_id: 'TRV-123456',
      booking_phone: '+91-9876543210',
    };

    await emailService.sendBookingConfirmation(testData);
    console.log('✅ Email sent successfully!');
    console.log('Check your email for the booking confirmation.');
  } catch (error) {
    console.error('❌ Email test failed:', error);
    console.log('Make sure EmailJS credentials are configured in .env');
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailService();
}

export { testEmailService };