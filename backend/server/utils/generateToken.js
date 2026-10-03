const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for the given user ID.
 * The token expires in 7 days.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
