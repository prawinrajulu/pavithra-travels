import './src/config/env.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from './src/config/env.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    
    const result = await cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed_white_cat.jpg', {
      public_id: 'test_cat'
    });
    
    console.log('✅ Successfully uploaded to Cloudinary!');
    console.log('URL:', result.secure_url);
    
    await cloudinary.uploader.destroy('test_cat');
    console.log('✅ Successfully deleted from Cloudinary!');
  } catch (err) {
    console.error('❌ Cloudinary Test Failed:', err);
  }
}

testCloudinary();
