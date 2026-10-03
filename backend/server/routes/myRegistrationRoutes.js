const express = require('express');
const { getMyRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/my-registrations  — student views all their registered events
router.get('/', protect, authorizeRoles('student'), getMyRegistrations);

module.exports = router;
