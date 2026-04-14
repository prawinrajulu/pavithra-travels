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
    console.log('Check your .env for TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('✅ WhatsApp Service is configured.');
  console.log('Sending test message...');

  const result = await whatsappService.sendTestMessage(
    process.env.OWNER_WHATSAPP || '917824047328', 
    'Hello! This is a test message from your Pavithra Travels WhatsApp automation system. 🚌'
  );

  if (result.success) {
    console.log('🚀 Test message sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Check your phone for the notification.');
  } else {
    console.error('❌ Failed to send test message.');
    console.error('Error:', result.error);
    
    if (result.error?.includes('Authenticate')) {
      console.log('\n💡 Hint: Check if your TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN are correct.');
    } else if (result.error?.includes('Permission')) {
      console.log('\n💡 Hint: Ensure your Twilio number is enabled for WhatsApp.');
    }
  }

  process.exit(0);
}

test();
