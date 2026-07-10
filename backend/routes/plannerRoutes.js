const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/planner', verifyToken, requireRole('student'), plannerController.getPlanner);
router.put('/planner/status', verifyToken, requireRole('student'), plannerController.updateStatus);
router.put('/planner/current-semester', verifyToken, requireRole('student'), plannerController.updateCurrentSemester);

module.exports = router;
