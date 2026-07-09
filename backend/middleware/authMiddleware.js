const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || 'coursebuddy_secret';

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Checking user_session lets logout actually invalidate a token
        // that hasn't naturally expired yet — a plain JWT can't be revoked.
        const session = await authService.getSessionByToken(token);
        if (session && session.isRevoked) {
            return res.status(401).json({ error: 'Session has been revoked. Please log in again.' });
        }

        req.user = { userID: decoded.userID, email: decoded.email, role: decoded.role };
        req.token = token;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

exports.requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
};
