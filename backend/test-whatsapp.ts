import { whatsappService } from './src/services/whatsappService.js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load env
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function test() {
  console.log('--- WhatsApp Automation Test ---');
  console.log('Checking configuration...');

  if (!whatsappService.isConfigured) {
    console.error('❌ WhatsApp Service is NOT configured.');
    console.log('Check your .env for WHATSAPP_PHONE_ID and WHATSAPP_TOKEN');
    console.log('Current Values:');
    console.log('- Phone ID:', process.env.WHATSAPP_PHONE_ID ? '✅ Set' : '❌ Missing');
    console.log('- Token:', process.env.WHATSAPP_TOKEN ? '✅ Set' : '❌ Missing');
    process.exit(1);
  }

  console.log('✅ WhatsApp Service is configured.');
  console.log(`📡 Targeting Phone ID: ${process.env.WHATSAPP_PHONE_ID}`);
  console.log(`👤 Recipient Number: ${process.env.OWNER_WHATSAPP || '917824047328'}`);
  console.log('---');
  console.log('Sending test message...');

  const result = await whatsappService.sendBookingConfirmationTemplate({
    customerName: 'Test User',
    destination: 'Varanasi',
    travelDate: new Date(),
    phone: process.env.OWNER_WHATSAPP || '917824047328',
    bookingId: 'TEST-' + Date.now()
  });

  if (result) {
    console.log('\n🚀 TEST PASSED: Message sent successfully!');
    console.log('\nNOTE: If you still don\'t receive it on your phone:');
    console.log('1. Check if you verified the recipient number in Meta Dashboard (if using test numbers).');
    console.log('2. Check the "Message Delivery" status in the Meta App Dashboard.');
  } else {
    console.error('\n❌ TEST FAILED: Could not send message.');
    console.log('\n🔧 Troubleshooting:');
    console.log('👉 Check the console logs above for specific Meta API error details.');
    console.log('👉 Verify your WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in .env');
  }

  process.exit(0);
}

test();
