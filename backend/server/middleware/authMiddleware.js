const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect middleware
 * Verifies the JWT from the Authorization header.
 * Attaches the logged-in user to req.user for downstream handlers.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB; exclude the password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User no longer exists.',
      });
    }

    // Attach user to request so controllers can access it
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token is invalid or expired.',
    });
  }
};

module.exports = { protect };
