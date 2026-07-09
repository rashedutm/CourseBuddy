const authService = require('../services/authService');
const profileService = require('../services/profileService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'coursebuddy_secret';
const RESET_CODE_TTL_MINUTES = 10;

const hashResetCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await authService.getUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Role is trusted from the database (decided once at registration
        // time from the email domain) rather than recomputed on every login.
        const token = jwt.sign(
            { userID: user.userID, email: user.utmEmail, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const sessionID = `SESS-${Date.now()}`;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await authService.createSession(sessionID, user.userID, token, expiresAt);

        const profile = await profileService.getFullProfile(user.userID);

        res.json({
            token,
            role: user.role,
            user: profile
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, matricNumber, email, password } = req.body;

        if (!name || !matricNumber || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Self-registration is student-only. Admins are internal staff
        // provisioned directly in the database — they never sign up here,
        // they just log in with an account that already exists.
        if (!email.endsWith('@graduate.utm.my')) {
            return res.status(400).json({ error: 'Only student accounts (@graduate.utm.my) can register here. Admin accounts are set up internally — please log in with your existing account.' });
        }

        const userExists = await authService.checkUserExists(email, matricNumber);
        if (userExists) {
            return res.status(409).json({ error: 'User with this email or Matric Number already exists' });
        }

        await authService.createUser({ name, matricNumber, email, password });

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.token) {
            await authService.revokeSessionByToken(req.token);
        }
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// Password reset — simulated in-app verification
// code. No email service is configured in this
// project, so the code is returned directly in the
// API response instead of being emailed.
// ============================================

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await authService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'No account found with that email' });
        }

        await authService.invalidateExistingResetCodes(user.userID);

        const code = String(crypto.randomInt(100000, 1000000)); // 6-digit code
        const resetID = `RESET-${Date.now()}`;
        const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000);

        await authService.createPasswordReset(resetID, user.userID, hashResetCode(code), expiresAt);

        res.json({
            message: 'Verification code generated. (No email service is configured for this project — showing the code here instead.)',
            code,
            expiresInMinutes: RESET_CODE_TTL_MINUTES
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ error: 'Email and code are required' });
        }

        const user = await authService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'No account found with that email' });
        }

        const reset = await authService.getLatestValidResetByUserID(user.userID);
        if (!reset || reset.verificationLink !== hashResetCode(code)) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        const resetToken = jwt.sign(
            { userID: user.userID, resetID: reset.resetID, purpose: 'password_reset' },
            JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.json({ valid: true, resetToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: 'Reset token and new password are required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(resetToken, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Reset session expired. Please request a new code.' });
        }

        if (decoded.purpose !== 'password_reset') {
            return res.status(401).json({ error: 'Invalid reset token' });
        }

        const reset = await authService.getLatestValidResetByUserID(decoded.userID);
        if (!reset || reset.resetID !== decoded.resetID) {
            return res.status(400).json({ error: 'This reset code has already been used or has expired' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await authService.updateUserPassword(decoded.userID, newPasswordHash);
        await authService.markResetUsed(decoded.resetID);
        await authService.revokeAllSessionsForUser(decoded.userID);

        res.json({ message: 'Password reset successfully. Please sign in again.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
