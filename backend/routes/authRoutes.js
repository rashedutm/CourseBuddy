const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', verifyToken, authController.logout);
router.post('/reset/request', authController.requestPasswordReset);
router.post('/reset/verify', authController.verifyResetCode);
router.post('/reset/confirm', authController.resetPassword);

module.exports = router;