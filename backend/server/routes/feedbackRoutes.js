const express = require('express');
const { body } = require('express-validator');
const { submitFeedback, getEventFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router({ mergeParams: true }); // mergeParams lets us access :id from parent router

// Validation rules for feedback submission
const feedbackValidation = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a whole number between 1 and 5.'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required.'),
  body('suggestions')
    .optional()
    .trim(),
];

// POST /api/events/:id/feedback  — student submits feedback for a completed event
router.post('/', protect, authorizeRoles('student'), feedbackValidation, submitFeedback);

// GET /api/events/:id/feedback  — admin views feedback for their event
router.get('/', protect, authorizeRoles('admin'), getEventFeedback);

module.exports = router;
