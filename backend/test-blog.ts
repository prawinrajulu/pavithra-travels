import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import './src/config/env.js';
import './src/config/firebase.js';

async function seedSampleBlog() {
  try {
    console.log('Connecting to Firestore to create a sample blog...');
    const db = admin.firestore();
    
    const blogId = uuidv4();
    const sampleBlog = {
      id: blogId,
      title: "The Ultimate Guide to Exploring Bali's Hidden Waterfalls",
      location: "Bali, Indonesia",
      description: "Discover the most breathtaking, off-the-beaten-path waterfalls in Bali that tourists often miss. From Sekumpul to Banyumala, get ready for an adventure.",
      storyContent: "Bali is known for its stunning beaches and vibrant culture, but hidden deep within its lush jungles are some of the most spectacular waterfalls in the world.\n\nIn this guide, we take you on a journey to discover the secret cascading beauties of the island.\n\nFirst on our list is the majestic Sekumpul Waterfall, a towering natural wonder that requires a bit of a hike but rewards you with breathtaking views and refreshing mist. Next, we explored the twin cascades of Banyumala, perfect for a peaceful morning swim before the crowds arrive.\n\nMake sure to pack proper hiking shoes, a dry bag for your electronics, and an adventurous spirit. These hidden gems are the true heart of Bali's natural beauty.",
      category: "Adventure",
      tags: ["Bali", "Waterfalls", "Nature", "Hiking", "Travel Tips"],
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
      mediaFiles: [
        {
          url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80",
          type: "image",
          uploadedAt: admin.firestore.Timestamp.now()
        },
        {
          url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
          type: "image",
          uploadedAt: admin.firestore.Timestamp.now()
        }
      ],
      author: "Admin",
      likes: 0,
      commentsCount: 0,
      likedBy: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('blogs').doc(blogId).set(sampleBlog);
    
    console.log(`✅ Successfully created sample blog!`);
    console.log(`Title: ${sampleBlog.title}`);
    console.log(`Blog ID: ${blogId}`);
    
    // Fetch it back to verify
    const snapshot = await db.collection('blogs').doc(blogId).get();
    if (snapshot.exists) {
      console.log('✅ Verified: Blog exists in the database.');
    } else {
      console.error('❌ Failed: Blog was not found after creation.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample blog:', error);
    process.exit(1);
  }
}

seedSampleBlog();
