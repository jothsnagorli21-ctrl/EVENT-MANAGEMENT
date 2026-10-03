/**
 * authorizeRoles middleware factory
 * Usage: authorizeRoles('admin')  or  authorizeRoles('admin', 'student')
 *
 * Must be used AFTER the protect middleware so that req.user is available.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.',
      });
    }

    // Check whether the authenticated user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
