const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/home/dashboard', verifyToken, requireRole('student'), homeController.getStudentDashboard);
router.get('/home/alerts', verifyToken, homeController.getAlerts);
router.get('/home/admin-dashboard', verifyToken, requireRole('admin'), homeController.getAdminDashboard);

module.exports = router;
