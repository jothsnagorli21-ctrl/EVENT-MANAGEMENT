const express = require('express');
const { body } = require('express-validator');
const { getEventPlan, getAnnouncement, getFeedbackAnalysis } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// All AI routes require authentication and admin role
router.use(protect, authorizeRoles('admin'));

// Validation for event plan generation
const eventPlanValidation = [
  body('eventType')
    .trim()
    .notEmpty()
    .withMessage('Event type is required (e.g. Workshop, Hackathon).'),
  body('eventTopic')
    .trim()
    .notEmpty()
    .withMessage('Event topic is required.'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required (e.g. "2 hours", "1 day").'),
  body('numberOfParticipants')
    .notEmpty()
    .withMessage('Number of participants is required.')
    .isInt({ min: 1 })
    .withMessage('Number of participants must be a positive integer.'),
  body('targetAudience')
    .trim()
    .notEmpty()
    .withMessage('Target audience is required.'),
  body('specialRequirements')
    .optional()
    .trim(),
  body('eventId')
    .optional()
    .isMongoId()
    .withMessage('eventId must be a valid MongoDB ID.'),
];

// Validation for announcement generation
const announcementValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required.')
    .isMongoId()
    .withMessage('eventId must be a valid MongoDB ID.'),
];

// Validation for feedback analysis
const feedbackAnalysisValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required.')
    .isMongoId()
    .withMessage('eventId must be a valid MongoDB ID.'),
];

// POST /api/ai/event-plan  — generate structured event plan
router.post('/event-plan', eventPlanValidation, getEventPlan);

// POST /api/ai/announcement  — generate professional event announcement
router.post('/announcement', announcementValidation, getAnnouncement);

// POST /api/ai/feedback-analysis  — analyze event feedback with AI
router.post('/feedback-analysis', feedbackAnalysisValidation, getFeedbackAnalysis);

module.exports = router;
