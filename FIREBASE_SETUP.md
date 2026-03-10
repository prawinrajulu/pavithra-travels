# Pavithra Travels - Backend & Firebase Setup Guide

Complete guide for setting up the Express.js backend with Firebase integration for Pavithra Travels.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Integration](#frontend-integration)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## Prerequisites

- Node.js 16+ and npm
- Firebase account (free tier works)
- VS Code or any code editor
- Windows/Mac/Linux system

## Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `pavithra-travels`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Get Service Account Key

1. Go to **Project Settings** (⚙️ icon)
2. Click **"Service Accounts"** tab
3. Select **Node.js** from dropdown
4. Click **"Generate New Private Key"**
5. JSON file downloads automatically
6. Save it as `serviceAccountKey.json` in `backend/` folder

### Step 3: Enable Firebase Services

#### Enable Authentication
1. Go to **Authentication** in left menu
2. Click **"Get started"**
3. Enable **Email/Password** provider
4. (Optional) Enable Google, Facebook providers

#### Enable Firestore
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Select **Start in test mode**
4. Choose region closest to your users
5. Click **"Create"**

#### Enable Storage
1. Go to **Storage**
2. Click **"Get started"**
3. Accept default rules for development
4. Click **"Done"**

#### Enable Realtime Database (Optional)
1. Go to **Realtime Database**
2. Click **"Create Database"**
3. Select your region
4. Start in **test mode**

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
# Firebase Configuration (from serviceAccountKey.json)
FIREBASE_PROJECT_ID=pavithra-travels
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEv...YOUR_KEY...AIDAQABAoIBAQ...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@pavithra-travels.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://pavithra-travels.firebaseio.com

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration (frontend URL)
CORS_ORIGIN=http://localhost:5173
```

**Important:** When copying `FIREBASE_PRIVATE_KEY` from JSON file:
- Use the exact value from the JSON
- Replace actual newlines with `\n` (backslash-n)

### Step 3: Copy Service Account Key

```bash
# Copy your downloaded JSON file
cp ~/Downloads/serviceAccountKey.json ./serviceAccountKey.json
```

### Step 4: Run Development Server

```bash
npm run dev
```

Expected output:
```
🚀 Pavithra Travels API Server running on port 3001
Environment: development
CORS Origin: http://localhost:5173
```

### Step 5: Test API

```bash
# Health check
curl http://localhost:3001/api/health

# Database connection
curl http://localhost:3001/api/health/db
```

---

## Frontend Integration

### Step 1: Update Frontend .env

Create `.env` in frontend root:

```env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=pavithra-travels.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pavithra-travels
VITE_FIREBASE_STORAGE_BUCKET=pavithra-travels.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

Get these values from Firebase Console → Project Settings → General tab.

### Step 2: Install Firebase SDK

```bash
npm install firebase
```

### Step 3: Use API Client in Components

```typescript
import { apiClient } from '@/services/apiClient';

// Set user token after authentication
const token = await user.getIdToken();
apiClient.setToken(token);

// Now make API calls
const bookings = await apiClient.getBookings();
const destinations = await apiClient.getDestinations();
```

---

## API Endpoints

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "John Doe"
}

Response:
{
  "success": true,
  "user": { ... },
  "firebaseUid": "uid-123"
}
```

#### Verify Token
```bash
POST /api/auth/verify-token
Content-Type: application/json

{
  "token": "firebase-id-token"
}

Response:
{
  "success": true,
  "valid": true,
  "uid": "uid-123",
  "email": "user@example.com"
}
```

### User Endpoints (Requires Authentication)

#### Get User Profile
```bash
GET /api/users/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "profile": {
    "id": "user-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "totalBookings": 5
  }
}
```

#### Update Profile
```bash
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "Jane Doe",
  "phone": "+91-9876543210",
  "address": "123 Main St",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001"
}

Response:
{
  "success": true,
  "user": { ... }
}
```

### Booking Endpoints

#### Create Booking (Requires Auth)
```bash
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "destinationId": "tirupati",
  "startDate": "2026-03-15",
  "endDate": "2026-03-17",
  "numberOfTravelers": 4,
  "numberOfAdults": 2,
  "numberOfChildren": 2,
  "hotelPreference": "luxury",
  "specialRequests": "Vegetarian meals preferred"
}

Response:
{
  "success": true,
  "booking": {
    "id": "booking-id",
    "status": "pending",
    ...
  }
}
```

#### Get User's Bookings
```bash
GET /api/bookings
Authorization: Bearer {token}

Response:
{
  "success": true,
  "bookings": [
    {
      "id": "booking-id",
      "destinationId": "tirupati",
      "status": "confirmed",
      ...
    }
  ]
}
```

#### Cancel Booking
```bash
POST /api/bookings/{bookingId}/cancel
Authorization: Bearer {token}

Response:
{
  "success": true,
  "booking": { "status": "cancelled", ... }
}
```

### Destination Endpoints

#### Get All Destinations
```bash
GET /api/destinations

Response:
{
  "success": true,
  "destinations": [
    {
      "id": "tirupati",
      "name": "Tirupati Balaji",
      "category": "temple",
      ...
    }
  ],
  "count": 25
}
```

#### Get by Category
```bash
GET /api/destinations/category/temple

Response: { "success": true, "destinations": [...], "count": 12 }
```

#### Filter Destinations
```bash
POST /api/destinations/filter
Content-Type: application/json

{
  "category": "temple",
  "region": "south",
  "maxBudget": 15000,
  "minDays": 2,
  "maxDays": 5
}

Response:
{
  "success": true,
  "destinations": [...],
  "count": 8
}
```

### Chatbot Endpoints

#### Create/Get Conversation
```bash
GET /api/chatbot/conversation?conversationId=conv-123&userId=user-123

Response:
{
  "success": true,
  "conversation": {
    "id": "conv-123",
    "userId": "user-123",
    "messages": [],
    "createdAt": "2026-03-06T..."
  }
}
```

#### Send Message
```bash
POST /api/chatbot/message
Content-Type: application/json

{
  "message": "Tell me about Tirupati",
  "conversationId": "conv-123",
  "userId": "user-123"
}

Response:
{
  "success": true,
  "response": {
    "response": "Tirupati Balaji is a sacred temple...",
    "messageId": "msg-456",
    "timestamp": "2026-03-06T..."
  }
}
```

---

## Testing

### Test with cURL

```bash
# Health check
curl -X GET http://localhost:3001/api/health

# Get all destinations
curl -X GET http://localhost:3001/api/destinations

# Create user (requires body)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "displayName": "Test User"
  }'
```

### Test with Postman

1. Import collections from backend/postman/
2. Set environment variables:
   - `api_url`: http://localhost:3001/api
   - `token`: Your Firebase ID token
3. Run requests from collections

### Test with Frontend

```typescript
// In any React component
import { apiClient } from '@/services/apiClient';

useEffect(() => {
  const test = async () => {
    // Test API connection
    const health = await apiClient.healthCheck();
    console.log('API Health:', health);

    // Test destinations
    const { destinations } = await apiClient.getDestinations();
    console.log('Destinations:', destinations);
  };

  test();
}, []);
```

---

## Deployment

### Deploy Backend to Firebase Functions

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

2. Initialize Firebase functions:
```bash
cd backend
firebase init functions
```

3. Update `functions/src/index.ts` to export Express app as function

4. Deploy:
```bash
firebase deploy --only functions
```

Your API will be available at: `https://region-projectid.cloudfunctions.net/api`

### Deploy to Heroku

1. Create `Procfile` in backend:
```
web: npm start
```

2. Push to Heroku:
```bash
heroku create pavithra-travels-backend
git push heroku main
```

3. Set environment variables:
```bash
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_PRIVATE_KEY=your-key
# ... set all other variables
```

### Update Frontend API URL

After deployment, update `.env`:
```env
VITE_API_URL=https://your-deployed-api.example.com/api
```

---

## Firestore Security Rules

Add to Firestore Console → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Bookings - users can read/write their own
    match /bookings/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Destinations - public read, admin write
    match /destinations/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Conversations - users can read/write their own
    match /conversations/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Troubleshooting

### Error: "Cannot find module 'firebase-admin'"
```bash
cd backend
npm install firebase-admin
```

### Error: "CORS error"
- Ensure `CORS_ORIGIN` in `.env` matches your frontend URL
- Restart backend server

### Error: "Firebase authentication failed"
```bash
# Check if serviceAccountKey.json exists
ls -la backend/serviceAccountKey.json

# Verify credentials in .env
cat backend/.env | grep FIREBASE
```

### Error: "Firestore permission denied"
- Go to Firestore → Rules
- Change to test mode (development only)
- Or grant proper permissions with security rules above

### Backend not connecting to database
```bash
# Test connection
curl http://localhost:3001/api/health/db

# Check Firebase status at: https://status.firebase.google.com
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│             Frontend (React + TypeScript)           │
│  - Pages, Components, UI                            │
│  - Client-side Firebase Auth                        │
│  - API Client for backend calls                     │
└─────────────┬───────────────────────────────────────┘
              │ HTTP Requests
              ↓
┌─────────────────────────────────────────────────────┐
│    Express.js Backend API (Node.js + TypeScript)    │
│  - Auth middleware                                  │
│  - Routes (auth, users, bookings, destinations)     │
│  - Services (business logic)                        │
│  - Firebase Admin SDK                               │
└─────────────┬───────────────────────────────────────┘
              │ Firebase Admin Calls
              ↓
┌─────────────────────────────────────────────────────┐
│              Firebase Services                      │
│  - Authentication (sign up, login)                  │
│  - Firestore Database                               │
│  - Realtime Database                                │
│  - Storage (images, files)                          │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Populate Destinations** - Add temple/destination data to Firestore
2. **Setup Email Notifications** - Use Firebase Cloud Functions
3. **Implement Payment** - Add Razorpay/Stripe integration
4. **AI Chatbot** - Integrate with OpenAI/Gemini API
5. **Analytics** - Setup Firebase Analytics and custom events

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Console](https://console.firebase.google.com)
