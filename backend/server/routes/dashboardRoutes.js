const express = require('express');
const { getAdminDashboard, getStudentDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/dashboard/admin  — admin only, all stats from MongoDB
router.get('/admin', protect, authorizeRoles('admin'), getAdminDashboard);

// GET /api/dashboard/student  — student only, personalised stats from MongoDB
router.get('/student', protect, authorizeRoles('student'), getStudentDashboard);

module.exports = router;
