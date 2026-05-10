import { Router } from 'express';
import { blogController } from '../controllers/blogController.js';
import { authMiddleware, adminMiddleware, superAdminMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import { storage } from '../config/firebase.js';
import { config } from '../config/env.js';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.get('/:id/comments', blogController.getComments);

// Protected routes (User)
router.post('/:id/like', authMiddleware, blogController.toggleLike);
router.post('/:id/comments', authMiddleware, blogController.addComment);

// Admin routes (Admin Only for managing blogs)
router.post('/', authMiddleware, adminMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, adminMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, blogController.deleteBlog);

// Multi-media upload endpoint (Firebase Storage)
router.post('/upload-media', authMiddleware, adminMiddleware, upload.array('media', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const { blogId } = req.body;
    if (!blogId) {
      return res.status(400).json({ success: false, message: 'blogId is required' });
    }

    const uploadPromises = files.map(async (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `travel-blogs/${blogId}`,
            resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
          },
          (error, result) => {
            if (error) {
              console.error('[CLOUDINARY ERROR]:', error);
              return reject(error);
            }
            resolve({
              url: result?.secure_url,
              type: result?.resource_type,
              publicId: result?.public_id,
              uploadedAt: new Date()
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    res.json({ success: true, files: uploadedFiles });
  } catch (error: any) {
    console.error('[BLOG UPLOAD ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
