const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE utmEmail = ?`;
        db.query(sql, [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.getUserByID = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT userID, fullName, matricNumber, utmEmail, role, isActive FROM users WHERE userID = ?`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.checkUserExists = (email, matricNumber) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE utmEmail = ? OR matricNumber = ?`;
        db.query(sql, [email, matricNumber], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0);
        });
    });
};

exports.createUser = async (userData) => {
    const role = userData.email.endsWith('@utm.my') ? 'admin' : 'student';
    const passwordHash = await bcrypt.hash(userData.password, 10);

    return new Promise((resolve, reject) => {
        // We use userData.matricNumber for both userID and matricNumber columns
        const sql = `INSERT INTO users (userID, fullName, matricNumber, utmEmail, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [userData.matricNumber, userData.name, userData.matricNumber, userData.email, passwordHash, role], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ============================================
// Session management (backs real logout / JWT revocation)
// ============================================

exports.createSession = (sessionID, userID, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_session (sessionID, userID, digitalAccessPass, expiresAt) VALUES (?, ?, ?, ?)`;
        db.query(sql, [sessionID, userID, token, expiresAt], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getSessionByToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user_session WHERE digitalAccessPass = ?`;
        db.query(sql, [token], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.revokeSessionByToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE user_session SET isRevoked = TRUE WHERE digitalAccessPass = ?`;
        db.query(sql, [token], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.revokeAllSessionsForUser = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE user_session SET isRevoked = TRUE WHERE userID = ?`;
        db.query(sql, [userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ============================================
// Password reset (in-app verification code — no email service configured)
// ============================================

exports.invalidateExistingResetCodes = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE password_reset SET isUsed = TRUE WHERE userID = ? AND isUsed = FALSE`;
        db.query(sql, [userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.createPasswordReset = (resetID, userID, hashedCode, expiresAt) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO password_reset (resetID, userID, verificationLink, expiresAt) VALUES (?, ?, ?, ?)`;
        db.query(sql, [resetID, userID, hashedCode, expiresAt], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getLatestValidResetByUserID = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM password_reset WHERE userID = ? AND isUsed = FALSE AND expiresAt > NOW() ORDER BY createdAt DESC LIMIT 1`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.markResetUsed = (resetID) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE password_reset SET isUsed = TRUE WHERE resetID = ?`;
        db.query(sql, [resetID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateUserPassword = (userID, newPasswordHash) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET passwordHash = ? WHERE userID = ?`;
        db.query(sql, [newPasswordHash, userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
