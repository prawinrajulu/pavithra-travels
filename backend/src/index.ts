import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:');
  console.error(err);
  if (err.stack) console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

// Import routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import bookingRoutes from './routes/bookings.js';
import destinationRoutes from './routes/destinations.js';
import chatbotRoutes from './routes/chatbot.js';
import emailRoutes from './routes/email.js';
import adminRoutes from './routes/admin.js';
import imageRoutes from './routes/images.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/uploadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import travelPostsRoutes from './routes/travelPosts.js';

// Initialize Firebase
import './config/firebase.js';

import path from 'path';

const app = express();

// Security Middlewares
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: 'cross-origin' } 
}));

// Logging & Monitoring
app.use(morgan('combined')); // Standard Apache combined log output

// Strict CORS Middleware with dynamic local dev support
const allowedOrigins = config.corsOrigin
  ? config.corsOrigin.split(',').map(o => o.trim()) 
  : ['http://localhost:5173', 'https://pavithra-travels.com', 'https://www.pavithra-travels.com'];

console.log(`[CORS] Initialized with origins: ${allowedOrigins.join(', ')}`);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else if (config.nodeEnv !== 'production' && (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))) {
      // Allow any local port in development
      callback(null, true);
    } else if (origin.includes('pavithra-travels.com') || origin.includes('pavithra-travels.onrender.com') || origin.includes('web.app') || origin.includes('firebaseapp.com')) {
      callback(null, true);
    } else {
      console.warn(`🚨 CORS Refused: The origin "${origin}" is not allowed. Check CORS_ORIGIN in your environment.`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static local uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root health check for Render port detection
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pavithra Travels API is running',
    environment: config.nodeEnv,
    version: '1.0.2'
  });
});

// Health check
app.use('/api', healthRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/posts', travelPostsRoutes);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;

// Environment validation logging
console.log('--- Environment Validation ---');
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${config.nodeEnv}`);
console.log(`FIREBASE_PROJECT_ID: ${config.firebase.projectId ? '✅ Set' : '❌ Missing'}`);
console.log(`JWT_SECRET: ${config.jwtSecret !== 'your-secret-key' ? '✅ Set' : '⚠️ Default used'}`);
console.log(`EMAIL_USER: ${config.email.user}`);
console.log(`EMAIL_PASS: ${config.email.pass ? '✅ Set' : '❌ Missing (Gmail notifications will fail)'}`);
console.log(`RESEND_API_KEY: ${config.email.resendApiKey ? '✅ Set' : '⚠️ Missing (Alternate email route will fail)'}`);
console.log(`CLOUDINARY: ${config.cloudinary.cloudName ? '✅ Set' : '⚠️ Not configured'}`);
console.log('------------------------------');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pavithra Travels API Server running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});
