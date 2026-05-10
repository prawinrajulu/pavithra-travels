import admin, { storage } from './src/config/firebase.js';
import { config } from './src/config/env.js';

async function testStorage() {
  try {
    console.log('Testing Firebase Storage...');
    
    const bucketName = admin.app().options.storageBucket;
    console.log(`App options storageBucket: ${bucketName}`);
    const bucket = storage.bucket(bucketName);
    const file = bucket.file('test-connection.txt');
    
    console.log('Attempting to save file...');
    await file.save('Connection test ' + new Date().toISOString(), {
      metadata: { contentType: 'text/plain' }
    });
    console.log('✅ Successfully saved test file to storage!');
    
    await file.makePublic().catch(e => console.warn('Could not make public:', e.message));
    console.log('Public URL:', `https://storage.googleapis.com/${bucketName}/test-connection.txt`);
    
    await file.delete();
    console.log('✅ Successfully deleted test file!');
  } catch (err: any) {
    console.error('❌ Storage Test Failed:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    }
  }
}

testStorage();
