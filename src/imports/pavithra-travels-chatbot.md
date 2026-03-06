Build a fully integrated, production-ready website chatbot automation system for "Pavithra Travels", an All Over India tourism company.

Technology Stack:
- Frontend: React (Vite or CRA)
- Backend: Node.js + Express
- Database: MongoDB
- Security: JWT, Validation, Rate limiting

BUSINESS CONTEXT:
Pavithra Travels is a tourism company operating across India.
Service Area: All Over India
Operating Hours: Monday to Saturday – 10:00 AM to 9:00 PM
Sunday: Holiday

The company provides:
- Family Trips
- Temple Visits
- Custom Routes
- Personal Service

----------------------------------------------------
1️⃣ FRONTEND REQUIREMENTS (React)

Create a floating chatbot widget positioned at the bottom-right corner.

Design:
- Match existing orange theme
- Smooth open/close animation
- Mobile responsive
- Modern UI with card-style options

Chatbot Flow:

Step 1 – Auto Greeting (after 5 seconds)
"Hello 👋 Welcome to Pavithra Travels!
Explore India with Comfort and Care.
Operating Hours: Mon–Sat (10 AM – 9 PM)
How can we help you today?"

Show buttons:
- Temple Tours
- Family Trips
- Custom Packages
- Talk to Executive

Step 2 – Service Selection
When user clicks a service:
Display destination options dynamically.

Example:
Temple Tours:
- Tirupati
- Rameswaram
- Varanasi
- Kedarnath
- Badrinath

Each destination should be clickable.

Step 3 – Destination Selection
Show:
- Short description
- Duration
- Travel highlights
- Estimated price range
- "Book This Trip" button

Step 4 – Booking Collection
When clicking "Book This Trip":
Ask sequentially:
- Name
- Phone Number
- Travel Date

Validate inputs before submission.

Step 5 – Submission
Send booking data to backend API.
On success:
Show message:
"Thank you for choosing Pavithra Travels!
Our team will contact you shortly."

----------------------------------------------------
2️⃣ BACKEND REQUIREMENTS (Node + Express)

Create secure REST APIs:

POST /api/chatbot/book
- Save booking details
- Validate input
- Sanitize data
- Return success response

GET /api/admin/bookings
- Protected route (JWT authentication)
- Only admin can access

----------------------------------------------------
3️⃣ DATABASE (MongoDB Schema)

Create Booking Model with fields:
- serviceType
- destination
- name
- phone
- travelDate
- createdAt
- status (Pending / Contacted / Confirmed)

----------------------------------------------------
4️⃣ SECURITY IMPLEMENTATION

- Use express-validator for input validation
- Use express-mongo-sanitize to prevent NoSQL injection
- Use helmet for HTTP security
- Use rate limiting to prevent spam
- Store secrets in .env
- Hash admin password with bcrypt
- Enable CORS only for frontend domain

----------------------------------------------------
5️⃣ ADMIN PANEL (Basic)

Create:
- Secure admin login
- JWT-based authentication
- Dashboard to view bookings
- Filter by service type
- Update booking status

----------------------------------------------------
6️⃣ ADVANCED FEATURES

- Auto disable booking option on Sundays
- Show message:
  "We are closed today (Sunday). Bookings will be processed on Monday."
- Store chatbot conversation in state
- Use reusable React components
- Maintain same website header/footer design
- Keep UI clean and professional

----------------------------------------------------
7️⃣ PROJECT STRUCTURE

Frontend:
client/
  components/
  pages/
  services/
  chatbot/

Backend:
server/
  models/
  routes/
  controllers/
  middleware/
  config/

----------------------------------------------------
Goal:
Create a scalable, secure, tourism-focused chatbot automation system fully integrated into the Pavithra Travels website, maintaining design consistency and providing seamless booking experience.