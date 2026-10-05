// Load environment variables from .env file FIRST — before anything else
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const myRegistrationRoutes = require('./routes/myRegistrationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Error handling middleware (must be imported last, registered last)
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// -------------------------------------------------------
// 1. Connect to MongoDB
// -------------------------------------------------------
connectDB();

// -------------------------------------------------------
// 2. Initialize Express app
// -------------------------------------------------------
const app = express();

// -------------------------------------------------------
// 3. Core middleware
// -------------------------------------------------------

// Enable CORS — allow requests from the deployed frontend
app.use(cors({
  origin: true,
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: false }));

// -------------------------------------------------------
// 4. Health check endpoint
// -------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Event Management System backend is running',
  });
});

// -------------------------------------------------------
// 5. API routes
// -------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Registration routes: POST /api/events/:id/register
//                      GET  /api/events/:id/participants
app.use('/api/events', registrationRoutes);

// Feedback routes:     POST /api/events/:id/feedback
//                      GET  /api/events/:id/feedback
app.use('/api/events/:id/feedback', feedbackRoutes);

// My registrations:    GET  /api/my-registrations
app.use('/api/my-registrations', myRegistrationRoutes);

// AI routes:           POST /api/ai/event-plan
//                      POST /api/ai/announcement
//                      POST /api/ai/feedback-analysis
app.use('/api/ai', aiRoutes);

// Dashboard routes:    GET  /api/dashboard/admin
//                      GET  /api/dashboard/student
app.use('/api/dashboard', dashboardRoutes);

// -------------------------------------------------------
// 6. Error handling middleware (must be LAST)
// -------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// -------------------------------------------------------
// 7. Start the server
// -------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
