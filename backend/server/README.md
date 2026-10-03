# AI Event Management System — Backend

A Node.js/Express REST API backend for managing college events, registrations, feedback, and AI-powered features using the Google Gemini API.

---

## Technologies

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| @google/generative-ai | Gemini AI integration |
| express-validator | Input validation |
| dotenv | Environment variables |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## Folder Structure

```
server/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js       # Register, login, profile
│   ├── eventController.js      # CRUD for events
│   ├── registrationController.js # Event registration & participants
│   ├── feedbackController.js   # Submit & retrieve feedback
│   ├── dashboardController.js  # Admin & student dashboards
│   └── aiController.js         # AI event plan, announcement, analysis
├── middleware/
│   ├── authMiddleware.js       # JWT verification → req.user
│   ├── roleMiddleware.js       # Role-based access control
│   └── errorMiddleware.js      # Centralized error handler
├── models/
│   ├── User.js                 # User schema (admin/student)
│   ├── Event.js                # Event schema
│   ├── Registration.js         # Registration schema (unique per user+event)
│   ├── Feedback.js             # Feedback schema (unique per user+event)
│   └── AIPlan.js               # Saved AI-generated plans
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── registrationRoutes.js
│   ├── myRegistrationRoutes.js
│   ├── feedbackRoutes.js
│   ├── aiRoutes.js
│   └── dashboardRoutes.js
├── services/
│   └── geminiService.js        # All Gemini API calls (server-side only)
├── utils/
│   └── generateToken.js        # JWT token generator
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
└── server.js                   # Entry point
```

---

## Installation

```bash
# 1. Navigate to the server folder
cd server

# 2. Install dependencies
npm install
```

---

## MongoDB Setup

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a new cluster (free tier is fine).
3. Click **Connect** → **Connect your application**.
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
5. Replace `<username>`, `<password>`, and `<dbname>` with your values.
6. Paste it as `MONGODB_URI` in your `.env` file.

---

## Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Important:** Never commit your `.env` file. It is already in `.gitignore`.

### Getting a Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with a Google account.
3. Click **Create API Key**.
4. Copy the key and paste it as `GEMINI_API_KEY` in your `.env` file.

---

## How to Start the Backend

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start
```

The server starts on `http://localhost:5000`.

Health check: `GET http://localhost:5000/api/health`

---

## API Endpoint Reference

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/profile` | Private | Get current user profile |

### Events

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/events` | Private | Get all events with seat info |
| GET | `/api/events/:id` | Private | Get single event details |
| POST | `/api/events` | Admin | Create a new event |
| PUT | `/api/events/:id` | Admin (owner) | Update an event |
| DELETE | `/api/events/:id` | Admin (owner) | Delete an event |

### Registration

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/events/:id/register` | Student | Register for an event |
| GET | `/api/events/:id/participants` | Admin (owner) | View event participants |
| GET | `/api/my-registrations` | Student | View own registered events |

### Feedback

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/events/:id/feedback` | Student | Submit feedback (event must be Completed) |
| GET | `/api/events/:id/feedback` | Admin (owner) | View all feedback for an event |

### AI Features

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/ai/event-plan` | Admin | Generate AI event plan |
| POST | `/api/ai/announcement` | Admin | Generate AI event announcement |
| POST | `/api/ai/feedback-analysis` | Admin | Analyze event feedback with AI |

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/admin` | Admin | Admin statistics & upcoming events |
| GET | `/api/dashboard/student` | Student | Student's registered & available events |

---

## Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

You get a token when you register or login. Include it in every request to protected endpoints.

---

## Example API Requests

### Register an Admin

```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Admin",
  "email": "alice@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Register a Student

```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Bob Student",
  "email": "bob@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "password123"
}
```

Response includes a `token` — copy it for use in subsequent requests.

### Create an Event (Admin)

```json
POST /api/events
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "React Workshop 2025",
  "description": "A hands-on workshop covering React fundamentals and hooks.",
  "category": "Workshop",
  "date": "2025-12-15",
  "startTime": "10:00 AM",
  "endTime": "04:00 PM",
  "venue": "CS Lab 101",
  "capacity": 50,
  "status": "Upcoming"
}
```

### Register for an Event (Student)

```json
POST /api/events/<eventId>/register
Authorization: Bearer <student_token>
```

### Submit Feedback (Student — event must be Completed)

```json
POST /api/events/<eventId>/feedback
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent workshop! Very well organized.",
  "suggestions": "Would love a Part 2 covering advanced topics."
}
```

### Generate AI Event Plan (Admin)

```json
POST /api/ai/event-plan
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "eventType": "Workshop",
  "eventTopic": "Introduction to Machine Learning",
  "duration": "6 hours",
  "numberOfParticipants": 60,
  "targetAudience": "Second and third year Computer Science students",
  "specialRequirements": "Laptops required, Python pre-installed"
}
```

### Generate AI Announcement (Admin)

```json
POST /api/ai/announcement
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "eventId": "<eventId>"
}
```

### Analyze Feedback with AI (Admin)

```json
POST /api/ai/feedback-analysis
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "eventId": "<eventId>"
}
```

---

## Response Format

All responses follow a consistent structure.

**Success:**
```json
{
  "success": true,
  "message": "Event created successfully.",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Event not found."
}
```

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET / PUT) |
| 201 | Created successfully |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized (wrong role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate registration / email) |
| 503 | AI service unavailable |
| 500 | Internal server error |

---

## Testing with Thunder Client or Postman

1. Install [Thunder Client](https://www.thunderclient.com/) (VS Code extension) or [Postman](https://www.postman.com/).
2. Start the backend: `npm run dev`
3. Test the health endpoint first: `GET http://localhost:5000/api/health`
4. Register an admin and a student, then copy their JWT tokens.
5. Set the `Authorization: Bearer <token>` header on all protected requests.
6. Follow the example requests above to test each feature.

### Suggested Test Order

1. Register admin → Login admin → Copy admin token
2. Register student → Login student → Copy student token
3. Create event (admin token)
4. Get all events (any token)
5. Get event by ID (any token)
6. Update event (admin token)
7. Register for event (student token)
8. Try duplicate registration → should get 409
9. Get participants (admin token)
10. Get my registrations (student token)
11. Update event status to "Completed" (admin token)
12. Submit feedback (student token)
13. Get feedback (admin token)
14. Generate event plan (admin token)
15. Generate announcement (admin token)
16. Analyze feedback (admin token)
17. Admin dashboard (admin token)
18. Student dashboard (student token)
19. Delete event (admin token)
