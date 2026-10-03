const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Helper — returns a safe user object (no password)
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// -------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// -------------------------------------------------------
const registerUser = async (req, res, next) => {
  try {
    // Check express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, email, password, role } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create user — password is hashed by the pre-save hook in the model
    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        token,
        user: safeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Login user and return JWT
// @route   POST /api/auth/login
// @access  Public
// -------------------------------------------------------
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    // Find user by email (model stores email in lowercase)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Use a generic message to avoid revealing whether the email exists
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: safeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get profile of the currently logged-in user
// @route   GET /api/auth/profile
// @access  Private (requires valid JWT)
// -------------------------------------------------------
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware (password already excluded)
    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: {
        user: safeUser(req.user),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
