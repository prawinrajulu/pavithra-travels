# Pavithra Travels Backend

Express.js + Firebase backend API for Pavithra Travels booking platform.

## Features

- **User Authentication** - Firebase Auth integration with JWT verification
- **Bookings Management** - Create, update, and track travel bookings
- **Destinations** - Manage and filter travel destinations
- **Chatbot** - Conversation management and AI-ready responses
- **User Profiles** - User data and preference management
- **Storage** - Firebase Storage for images and documents
- **Database** - Firestore for data persistence & Realtime Database support

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── firebase.ts        # Firebase Admin SDK initialization
│   │   └── env.ts             # Environment configuration
│   ├── middleware/
│   │   ├── auth.ts            # Firebase Auth middleware
│   │   └── errorHandler.ts    # Error handling middleware
│   ├── models/
│   │   ├── user.ts            # User interfaces
│   │   ├── booking.ts         # Booking interfaces
│   │   ├── destination.ts     # Destination interfaces
│   │   └── chatbot.ts         # Chat interfaces
│   ├── services/
│   │   ├── userService.ts     # User operations
│   │   ├── bookingService.ts  # Booking operations
│   │   ├── destinationService.ts # Destination operations
│   │   └── chatbotService.ts  # Chatbot operations
│   ├── routes/
│   │   ├── auth.ts            # Authentication endpoints
│   │   ├── users.ts           # User endpoints
│   │   ├── bookings.ts        # Booking endpoints
│   │   ├── destinations.ts    # Destination endpoints
│   │   ├── chatbot.ts         # Chatbot endpoints
│   │   └── health.ts          # Health check
│   └── index.ts               # Server entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in the backend root directory

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key-from-json
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Firebase Setup

Ensure your Firebase project has:
- **Firestore Database** - Create in Cloud Firestore section
- **Authentication** - Enable Email/Password provider
- **Realtime Database** - Optional
- **Storage** - Create storage bucket for images

### 5. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### 6. Run Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status
- `GET /api/health/db` - Firebase connection status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-token` - Verify JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get user by ID

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId` - Update booking
- `POST /api/bookings/:bookingId/cancel` - Cancel booking

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:destinationId` - Get destination details
- `GET /api/destinations/category/:category` - Filter by category
- `GET /api/destinations/region/:region` - Filter by region
- `POST /api/destinations/filter` - Advanced filtering

### Chatbot
- `GET /api/chatbot/conversation` - Create or get conversation
- `GET /api/chatbot/conversations` - Get user's conversations
- `POST /api/chatbot/message` - Send message to chatbot
- `POST /api/chatbot/conversation/:conversationId/archive` - Archive conversation

## Authentication

The API uses Firebase Auth with JWT tokens. Include the token in request headers:

```
Authorization: Bearer <firebase-id-token>
```

### Getting a Token

From the frontend, after user authentication with Firebase:

```typescript
const token = await user.getIdToken();
```

Then include in API calls:

```typescript
const response = await fetch('http://localhost:3001/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Database Schema (Firestore)

### Collections

**users/**
```json
{
  "id": "uuid",
  "firebaseUid": "firebase-uid",
  "email": "user@example.com",
  "displayName": "User Name",
  "phone": "phone-number",
  "address": "address",
  "city": "city",
  "state": "state",
  "pincode": "pincode",
  "profileImageUrl": "url",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**bookings/**
```json
{
  "id": "uuid",
  "userId": "user-id",
  "destinationId": "destination-id",
  "destinationName": "destination-name",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "numberOfTravelers": 4,
  "numberOfAdults": 2,
  "numberOfChildren": 2,
  "totalCost": 50000,
  "status": "pending|confirmed|cancelled|completed",
  "specialRequests": "text",
  "hotelPreference": "luxury|budget|standard",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**destinations/**
```json
{
  "id": "uuid",
  "name": "destination-name",
  "state": "state",
  "category": "temple|family|adventure|beach|hill-station",
  "region": "north|south|east|west|central",
  "duration": "2-3 Days",
  "durationDays": 3,
  "budget": "₹8,000 - ₹15,000",
  "estimatedCost": 11500,
  "bestSeason": "October to March",
  "highlights": ["highlight1", "highlight2"],
  "description": "description",
  "imageUrl": "url",
  "images": ["url1", "url2"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day Title",
      "description": "description",
      "activities": ["activity1"],
      "meals": "breakfast, lunch, dinner"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**conversations/**
```json
{
  "id": "uuid",
  "userId": "user-id",
  "messages": [
    {
      "id": "message-id",
      "userId": "user-id",
      "message": "user message",
      "response": "bot response",
      "timestamp": "timestamp",
      "metadata": {
        "type": "bot",
        "intent": "booking",
        "confidence": 0.95
      }
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "archived": false
}
```

## Deployment

### Deploy to Firebase Functions (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

2. Initialize Firebase in project:
```bash
firebase init functions
```

3. Move backend code to `functions/` directory
4. Deploy:
```bash
firebase deploy
```

### Deploy to Heroku

1. Install Heroku CLI
2. Create `Procfile`:
```
web: npm start
```

3. Deploy:
```bash
heroku create pavithra-travels-api
git push heroku main
```

### Deploy to AWS/Google Cloud/Others

Update the backend `index.ts` to use environment-specific configurations and deploy using their respective CLIs.

## Development

### Run with TypeScript Loader (Development)
```bash
npm run dev
```

### Type Checking
```bash
npm run typecheck
```

### Build TypeScript to JavaScript
```bash
npm run build
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| FIREBASE_PROJECT_ID | Firebase project ID | - |
| FIREBASE_PRIVATE_KEY | Service account private key | - |
| FIREBASE_CLIENT_EMAIL | Service account email | - |
| FIREBASE_DATABASE_URL | Realtime database URL | - |
| PORT | Server port | 3001 |
| NODE_ENV | Environment (development/production) | development |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| JWT_SECRET | Secret for JWT signing | - |
| JWT_EXPIRES_IN | JWT expiration time | 7d |

## Troubleshooting

### Firebase Connection Error
- Check `serviceAccountKey.json` exists in root
- Verify Firebase credentials in environment variables
- Ensure Firebase project is created and active

### CORS Error
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- Restart server after changing `.env`

### Authentication Fails
- Verify token was obtained from Firebase Authentication
- Check JWT_SECRET in environment
- Ensure auth middleware is applied to routes

### Database Write Fails
- Check Firestore security rules allow write
- Verify Firebase project has Firestore enabled
- Check user permissions in Firebase Console

## Support

For issues or questions, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
