import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Load from env file
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.FIREBASE_API_KEY;
const API_URL = 'http://localhost:10000/api';

async function testTravelPostUpload() {
  try {
    console.log('1. Authenticating as agentadmin...');
    const authRes = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      email: 'agentadmin@example.com',
      password: 'Password123!',
      returnSecureToken: true
    });
    
    const idToken = authRes.data.idToken;
    console.log('✅ Authentication successful. ID Token acquired.');

    console.log('2. Preparing Travel Post data...');
    const form = new FormData();
    form.append('title', 'A Magical Evening in Paris');
    form.append('description', 'We visited the Eiffel Tower just as the sun was setting. The view was breathtaking and the weather was perfect.');
    form.append('location', 'Paris, France');
    
    // We generated an image earlier. Let's use it or fallback to a dummy file.
    const imagePath = 'C:\\Users\\ppraw\\.gemini\\antigravity\\brain\\f9677982-a470-461c-8889-a84b8a9ec8a6\\paris_trip_1777899456889.png';
    if (fs.existsSync(imagePath)) {
      form.append('images', fs.createReadStream(imagePath));
      console.log('✅ Found Paris image.');
    } else {
      console.log('⚠️ Could not find Paris image. Creating a dummy file...');
      fs.writeFileSync('dummy.jpg', 'dummy content');
      form.append('images', fs.createReadStream('dummy.jpg'));
    }

    console.log('3. Uploading Travel Post...');
    const uploadRes = await axios.post(`${API_URL}/posts`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${idToken}`
      }
    });

    console.log('✅ Upload successful. Response:', uploadRes.data);
    
    if (uploadRes.data.success) {
      console.log('4. Verifying post in the list...');
      const listRes = await axios.get(`${API_URL}/posts`);
      const posts = listRes.data.posts || [];
      const found = posts.find(p => p.id === uploadRes.data.post.id);
      if (found) {
        console.log('✅ Post found in the recent posts list!');
        console.log('Image URLs:', found.images);
      } else {
        console.error('❌ Post was not found in the recent posts list.');
      }
    }
    
  } catch (err) {
    console.error('Error during test:', err?.response?.data || err.message);
  }
}

testTravelPostUpload();
