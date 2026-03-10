# Backend API Documentation

Complete API reference for Pavithra Travels backend.

## Base URL
```
Development: http://localhost:3001/api
Production: https://your-deployed-api.example.com/api
```

## Authentication

All endpoints requiring authentication must include the Firebase ID token in the header:

```
Authorization: Bearer <firebase-id-token>
```

To get a token in your frontend:
```typescript
import { auth } from 'firebase/auth';

const user = auth.currentUser;
const token = await user?.getIdToken();
```

---

## Endpoints

### Health & Status

#### Check API Health
```
GET /health
```
Returns server status and timestamp.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-06T10:30:00Z"
}
```

#### Check Database Connection
```
GET /health/db
```
Tests Firebase connection.

**Response:**
```json
{
  "status": "OK",
  "firebase": "connected",
  "timestamp": "2026-03-06T10:30:00Z"
}
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "firebaseUid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2026-03-06T10:30:00Z",
    "updatedAt": "2026-03-06T10:30:00Z"
  },
  "firebaseUid": "firebase-uid"
}
```

**Errors:**
- `400` - Missing email, password, or displayName
- `409` - Email already exists

---

### Verify Token
```
POST /auth/verify-token
```

**Body:**
```json
{
  "token": "firebase-id-token"
}
```

**Response (200):**
```json
{
  "success": true,
  "valid": true,
  "uid": "firebase-uid",
  "email": "user@example.com"
}
```

**Response (401):**
```json
{
  "success": false,
  "valid": false,
  "error": "Invalid token"
}
```

---

### Get Current User (Auth Required)
```
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2026-03-06T10:30:00Z"
  }
}
```

**Errors:**
- `401` - No token or invalid token

---

## User Endpoints

### Get User Profile (Auth Required)
```
GET /users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "phone": "+91-9876543210",
    "address": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "profileImageUrl": "https://...",
    "totalBookings": 5,
    "createdAt": "2026-03-06T10:30:00Z"
  }
}
```

---

### Update User Profile (Auth Required)
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "displayName": "Jane Doe",
  "phone": "+91-9876543210",
  "address": "456 New Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560002"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "displayName": "Jane Doe",
    "phone": "+91-9876543210",
    "address": "456 New Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560002",
    "updatedAt": "2026-03-06T11:00:00Z"
  }
}
```

---

### Get User by ID
```
GET /users/{userId}
```

**Parameters:**
- `userId` (path) - User UUID

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2026-03-06T10:30:00Z"
  }
}
```

**Errors:**
- `404` - User not found

---

## Destination Endpoints

### Get All Destinations
```
GET /destinations
```

**Query Parameters (Optional):**
- `limit` - Number of results (default: all)
- `offset` - Pagination offset

**Response (200):**
```json
{
  "success": true,
  "destinations": [
    {
      "id": "tirupati",
      "name": "Tirupati Balaji",
      "state": "Andhra Pradesh",
      "category": "temple",
      "region": "south",
      "duration": "2-3 Days",
      "durationDays": 3,
      "budget": "₹8,000 - ₹15,000",
      "estimatedCost": 11500,
      "bestSeason": "October to March",
      "highlights": ["Darshan booking", "Scenic views"],
      "description": "...",
      "imageUrl": "https://...",
      "createdAt": "2026-03-06T10:30:00Z"
    }
  ],
  "count": 25
}
```

---

### Get Destination by ID
```
GET /destinations/{destinationId}
```

**Parameters:**
- `destinationId` (path) - Destination ID

**Response (200):**
```json
{
  "success": true,
  "destination": {
    "id": "tirupati",
    "name": "Tirupati Balaji",
    "state": "Andhra Pradesh",
    "category": "temple",
    "region": "south",
    "duration": "2-3 Days",
    "durationDays": 3,
    "budget": "₹8,000 - ₹15,000",
    "estimatedCost": 11500,
    "bestSeason": "October to March",
    "highlights": ["Darshan booking", "Scenic views"],
    "description": "Sacred temple dedicated to Lord Venkateshwara...",
    "imageUrl": "https://...",
    "images": ["https://...", "https://..."],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival and Check-in",
        "description": "...",
        "activities": ["Arrival", "Check-in"],
        "meals": "Lunch, Dinner"
      }
    ],
    "createdAt": "2026-03-06T10:30:00Z"
  }
}
```

**Errors:**
- `404` - Destination not found

---

### Get Destinations by Category
```
GET /destinations/category/{category}
```

**Parameters:**
- `category` (path) - One of: `temple`, `family`, `adventure`, `beach`, `hill-station`

**Response (200):**
```json
{
  "success": true,
  "destinations": [...],
  "count": 12
}
```

---

### Get Destinations by Region
```
GET /destinations/region/{region}
```

**Parameters:**
- `region` (path) - One of: `north`, `south`, `east`, `west`, `central`

**Response (200):**
```json
{
  "success": true,
  "destinations": [...],
  "count": 8
}
```

---

### Filter Destinations
```
POST /destinations/filter
Content-Type: application/json
```

**Body:**
```json
{
  "category": "temple",
  "region": "south",
  "maxBudget": 15000,
  "minDays": 2,
  "maxDays": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "destinations": [...],
  "count": 6
}
```

---

## Booking Endpoints

### Create Booking (Auth Required)
```
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "destinationId": "tirupati",
  "startDate": "2026-04-15",
  "endDate": "2026-04-17",
  "numberOfTravelers": 4,
  "numberOfAdults": 2,
  "numberOfChildren": 2,
  "hotelPreference": "luxury",
  "specialRequests": "Vegetarian meals preferred"
}
```

**Response (201):**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "userId": "user-uuid",
    "destinationId": "tirupati",
    "destinationName": "Tirupati Balaji",
    "startDate": "2026-04-15T00:00:00Z",
    "endDate": "2026-04-17T00:00:00Z",
    "numberOfTravelers": 4,
    "numberOfAdults": 2,
    "numberOfChildren": 2,
    "totalCost": 46000,
    "status": "pending",
    "hotelPreference": "luxury",
    "specialRequests": "Vegetarian meals preferred",
    "createdAt": "2026-03-06T10:30:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Not authenticated

---

### Get User Bookings (Auth Required)
```
GET /bookings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "booking-uuid",
      "destinationId": "tirupati",
      "status": "confirmed",
      "startDate": "2026-04-15T00:00:00Z",
      "totalCost": 46000
    }
  ]
}
```

---

### Get Booking Details (Auth Required)
```
GET /bookings/{bookingId}
Authorization: Bearer <token>
```

**Parameters:**
- `bookingId` (path) - Booking UUID

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "userId": "user-uuid",
    "destinationId": "tirupati",
    "destinationName": "Tirupati Balaji",
    "startDate": "2026-04-15T00:00:00Z",
    "endDate": "2026-04-17T00:00:00Z",
    "numberOfTravelers": 4,
    "numberOfAdults": 2,
    "numberOfChildren": 2,
    "totalCost": 46000,
    "status": "confirmed",
    "hotelPreference": "luxury",
    "specialRequests": "Vegetarian meals preferred",
    "createdAt": "2026-03-06T10:30:00Z"
  }
}
```

**Errors:**
- `403` - Unauthorized (not the booking owner)
- `404` - Booking not found

---

### Update Booking (Auth Required)
```
PUT /bookings/{bookingId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "startDate": "2026-04-20",
  "numberOfTravelers": 5,
  "specialRequests": "Updated requests"
}
```

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "startDate": "2026-04-20T00:00:00Z",
    "numberOfTravelers": 5,
    "specialRequests": "Updated requests",
    "updatedAt": "2026-03-06T11:00:00Z"
  }
}
```

---

### Cancel Booking (Auth Required)
```
POST /bookings/{bookingId}/cancel
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "status": "cancelled",
    "updatedAt": "2026-03-06T11:00:00Z"
  }
}
```

**Errors:**
- `403` - Unauthorized
- `404` - Booking not found

---

## Chatbot Endpoints

### Get or Create Conversation
```
GET /chatbot/conversation
```

**Query Parameters:**
- `conversationId` (optional) - Existing conversation ID
- `userId` (optional) - User ID

**Response (200):**
```json
{
  "success": true,
  "conversation": {
    "id": "conv-uuid",
    "userId": "user-uuid",
    "messages": [],
    "createdAt": "2026-03-06T10:30:00Z",
    "updatedAt": "2026-03-06T10:30:00Z"
  }
}
```

---

### Get User Conversations (Auth Required)
```
GET /chatbot/conversations
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conv-uuid",
      "userId": "user-uuid",
      "messages": [...],
      "createdAt": "2026-03-06T10:30:00Z",
      "updatedAt": "2026-03-06T10:30:00Z",
      "archived": false
    }
  ]
}
```

---

### Send Message
```
POST /chatbot/message
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Tell me about temple tours",
  "conversationId": "conv-uuid",
  "userId": "user-uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "response": {
    "response": "We offer sacred temple tours across South India...",
    "messageId": "msg-uuid",
    "timestamp": "2026-03-06T10:30:00Z",
    "suggestions": ["Tirupati", "Madurai", "Rameswaram"]
  }
}
```

---

### Archive Conversation (Auth Required)
```
POST /chatbot/conversation/{conversationId}/archive
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "conversation": {
    "id": "conv-uuid",
    "archived": true,
    "updatedAt": "2026-03-06T11:00:00Z"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

Currently no rate limiting. In production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## Pagination

Destinations endpoint supports pagination:

```
GET /destinations?limit=10&offset=0
```

---

## Data Types

### Date Format
All dates use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

### Currency
All costs in INR (Indian Rupees). No currency symbol in API responses.

### IDs
All IDs are UUIDs (v4) or Firebase UIDs.

---

## Example Workflows

### Complete Booking Flow

1. Register/Login user
2. Get destinations
3. Create booking
4. Track booking status

```typescript
// 1. Register
const register = await apiClient.register(email, password, name);
const token = await getTokenFromFirebase();
apiClient.setToken(token);

// 2. Get destinations
const { destinations } = await apiClient.getDestinations();

// 3. Create booking
const booking = await apiClient.createBooking({
  destinationId: destinations[0].id,
  startDate: '2026-04-15',
  endDate: '2026-04-17',
  numberOfTravelers: 2,
  numberOfAdults: 2
});

// 4. Check booking status
const bookingDetails = await apiClient.getBooking(booking.id);
```

### Chat Interaction

```typescript
// Get or create conversation
const conv = await apiClient.getOrCreateConversation();

// Send message
const response = await apiClient.sendChatMessage(
  'Tell me about temple tours',
  conv.id
);

// Get conversation history
const conversations = await apiClient.getUserConversations();
```

---

## Support

For API issues:
1. Check `/health` endpoint
2. Verify authentication token
3. Check request format matches documentation
4. Review server logs in backend console
