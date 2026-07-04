const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/profile/programmes', verifyToken, profileController.getProgrammes);
router.get('/profile', verifyToken, profileController.getProfile);
router.post('/profile/initial-setup', verifyToken, requireRole('student'), profileController.submitInitialSetup);
router.put('/profile/name', verifyToken, profileController.updateName);
router.put('/profile/update', verifyToken, requireRole('student'), profileController.updateProfile);

module.exports = router;
