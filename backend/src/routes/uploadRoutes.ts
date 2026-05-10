import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * @route   POST /api/upload
 * @desc    Upload an image to Cloudinary and return the URL
 * @access  Public (Can be protected by authMiddleware if needed)
 */
router.post('/', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // req.file.path contains the Cloudinary secure URL
    const imageUrl = (req.file as any).path;

    console.log('[DEBUG] File uploaded to Cloudinary:', imageUrl);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
    });
  } catch (error: any) {
    console.error('[DEBUG] Upload route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload',
      error: error.message,
    });
  }
});

export default router;
