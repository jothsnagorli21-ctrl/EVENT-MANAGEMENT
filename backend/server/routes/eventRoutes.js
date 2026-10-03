const express = require('express');
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Shared validation rules for create and update
const eventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.'),
  body('category')
    .notEmpty()
    .withMessage('Category is required.')
    .isIn(['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'])
    .withMessage('Invalid category.'),
  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date (e.g. 2025-12-01).'),
  body('startTime')
    .trim()
    .notEmpty()
    .withMessage('Start time is required.'),
  body('endTime')
    .trim()
    .notEmpty()
    .withMessage('End time is required.'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required.'),
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required.')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer.'),
  body('status')
    .optional()
    .isIn(['Upcoming', 'Ongoing', 'Completed'])
    .withMessage('Status must be Upcoming, Ongoing, or Completed.'),
];

// Looser validation for updates — all fields optional
const eventUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty.'),
  body('category')
    .optional()
    .isIn(['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'])
    .withMessage('Invalid category.'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date.'),
  body('startTime').optional().trim().notEmpty().withMessage('Start time cannot be empty.'),
  body('endTime').optional().trim().notEmpty().withMessage('End time cannot be empty.'),
  body('venue').optional().trim().notEmpty().withMessage('Venue cannot be empty.'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer.'),
  body('status')
    .optional()
    .isIn(['Upcoming', 'Ongoing', 'Completed'])
    .withMessage('Status must be Upcoming, Ongoing, or Completed.'),
];

// All event routes require a valid JWT
router.use(protect);

// GET /api/events  — any authenticated user can browse events
router.get('/', getEvents);

// GET /api/events/:id  — any authenticated user can view event details
router.get('/:id', getEventById);

// POST /api/events  — admin only
router.post('/', authorizeRoles('admin'), eventValidation, createEvent);

// PUT /api/events/:id  — admin only (ownership checked in controller)
router.put('/:id', authorizeRoles('admin'), eventUpdateValidation, updateEvent);

// DELETE /api/events/:id  — admin only (ownership checked in controller)
router.delete('/:id', authorizeRoles('admin'), deleteEvent);

module.exports = router;
