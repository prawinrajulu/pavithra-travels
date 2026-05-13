import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { Request } from 'express';

// Define the storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'pavithra-travels/travel-posts', // Cloudinary folder name
      format: file.mimetype.split('/')[1], // Maintain original format (jpg, png, etc.)
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: [{ width: 1920, height: 1080, crop: 'limit' }], // Optional: Auto-resize on upload
    };
  },
});

// File filter to accept only specific formats
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and WEBP are allowed.') as any, false);
  }
};

// Create the multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
