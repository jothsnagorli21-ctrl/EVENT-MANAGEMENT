const express = require('express');
const {
  registerForEvent,
  getEventParticipants,
  getMyRegistrations,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/events/:id/register  — student registers for an event
// Note: this route is mounted on the eventRoutes router so :id refers to eventId
router.post('/:id/register', protect, authorizeRoles('student'), registerForEvent);

// GET /api/events/:id/participants  — admin views participants of their event
router.get('/:id/participants', protect, authorizeRoles('admin'), getEventParticipants);

module.exports = router;
