Build a complete, production-ready full stack tourism website for a company named "Pavithra Travels".

PROJECT TYPE:
All Over India Tourism Company Website with Smart Booking Automation

TECH STACK:
Frontend: React (Vite) + React Router + Context API
Backend: Node.js + Express
Database: MongoDB (Mongoose)
Authentication: JWT + bcrypt
Security: Helmet, Rate limiting, Mongo sanitize, CORS protection
Deployment Ready Structure

-----------------------------------------------------
PHASE 1 – BRAND & BUSINESS SETUP

Company Name: Pavithra Travels
Tagline: Explore India with Comfort and Care
Service Area: All Over India
Operating Hours: Monday to Saturday – 10:00 AM to 9:00 PM
Sunday: Holiday

Core Services:
1. Temple Tours
2. Family Trips
3. Custom Route Planning
4. Personal Travel Assistance

Remove any car rental or single vehicle references.
Position company as a professional tourism company.

-----------------------------------------------------
PHASE 2 – WEBSITE DESIGN (Frontend UI)

Create a modern, responsive tourism website with:

Pages:
- Home
- Services
- Destinations
- About Us
- Contact
- Booking
- Admin Login

Design Style:
- Orange + White theme
- Clean typography
- Card-based layout
- Hero section with India travel imagery
- Consistent header & footer
- Mobile responsive

Home Page Sections:
- Hero banner
- About Pavithra Travels
- Service Cards (4 services)
- Featured Destinations
- Testimonials
- Call to Action

Each service card must be clickable and open a separate service page.

-----------------------------------------------------
PHASE 3 – DESTINATION STRUCTURE

Each service page should show:

Destination cards containing:
- Name
- State
- Duration
- Price range
- Short description
- Image
- "View Details" button

Clicking a destination opens dynamic route:
   /destination/:id

Destination Details Page:
- Large hero image
- Overview
- Highlights
- Itinerary sample
- Best season
- Pricing
- Book Now button

-----------------------------------------------------
PHASE 4 – SMART CHATBOT AUTOMATION

Integrate a floating chatbot inside website.

Chatbot features:
- Auto greeting after 5 seconds
- Service selection buttons
- Destination suggestion system
- Multi-step booking wizard
- Booking ID generation
- Sunday restriction logic
- Operating hour message
- Store conversation in React state

Booking flow:
1. Select service
2. Select destination
3. Enter date
4. Enter number of persons
5. Enter name
6. Enter phone
7. Confirm
8. Save booking to database

If Sunday:
Disable booking and show closure message.

-----------------------------------------------------
PHASE 5 – BACKEND API DESIGN

Create secure REST APIs:

POST /api/bookings
GET /api/bookings (Admin only)
PUT /api/bookings/:id/status
POST /api/admin/login

Validation:
- Validate all fields
- Sanitize inputs
- Prevent NoSQL injection

-----------------------------------------------------
PHASE 6 – DATABASE DESIGN

Create MongoDB Schemas:

1. Destination:
   - name
   - serviceType
   - state
   - duration
   - priceRange
   - highlights
   - bestSeason
   - imageURL

2. Booking:
   - serviceType
   - destination
   - date
   - persons
   - name
   - phone
   - status (Pending/Confirmed/Cancelled)
   - bookingId
   - createdAt

3. Admin:
   - username
   - password (hashed)
   - role

-----------------------------------------------------
PHASE 7 – ADMIN DASHBOARD

Create protected admin panel with:

- JWT authentication
- View all bookings
- Filter by service
- Filter by date
- Update booking status
- Dashboard statistics
- Revenue estimate display

-----------------------------------------------------
PHASE 8 – SECURITY HARDENING

Implement:

- Helmet middleware
- Rate limiting
- Mongo sanitize
- XSS protection
- CORS restriction
- Environment variables (.env)
- Hide stack traces in production
- HTTPS ready configuration

-----------------------------------------------------
PHASE 9 – DEPLOYMENT STRUCTURE

Prepare project for deployment:

Frontend:
- Build production version
- Environment config for API base URL

Backend:
- Production mode config
- Secure MongoDB Atlas connection
- Logging system

Cloudflare:
- Enable SSL
- DDoS protection
- Firewall rules

-----------------------------------------------------
PHASE 10 – FUTURE SCALABILITY

Keep architecture ready for:
- AI package recommendations
- Multilingual support
- Payment gateway integration
- Review & rating system
- WhatsApp API automation
- Email notification system

-----------------------------------------------------
FINAL GOAL:

Build a scalable, secure, intelligent tourism booking platform for Pavithra Travels that functions like a professional digital travel agency across India.