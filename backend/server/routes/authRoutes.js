const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
  body('role')
    .optional()
    .isIn(['admin', 'student'])
    .withMessage('Role must be either admin or student.'),
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Protected route — requires valid JWT
router.get('/profile', protect, getUserProfile);

module.exports = router;
