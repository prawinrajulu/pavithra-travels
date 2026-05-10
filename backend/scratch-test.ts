import axios from 'axios';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const PHONE_ID = '1110617382134796';
const TOKEN = 'EAAN2nf9JpSUBRX0PXC5Ve1XfHbHkwxTPZBcX13Y87HS6BijEbaQTmT8Dh9cYhkte7vbqEZCSTQYJ1bZBiWvRnqJ88BkSebx5SEV6V9QRB6ZAovMdIZCKcMY2mDNyCRkqDpQpolRgOQZCtijDzH7JPD54aS3jxVPXLyDyYgE2Vom2RS2thzrZAfZADyuVuS8LMZCEf5xbVBrb1in9k41tuZBdZBtTkP2ZAcVB60rYaoxerQO2cGVnVoPy23vJhY3pl0nf5Gh3pTXyVYqPr6kcnh8HGz6ZC';
const TO = '917824047328';

async function send() {
  console.log('Sending hello_world template...');
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: TO,
        type: 'template',
        template: {
          name: 'hello_world',
          language: { code: 'en_US' }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success!', response.data);
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

send();
