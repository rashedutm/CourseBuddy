const db = require('../config/db');

// ============================================
// Programme lookup (read-only) — needed for the
// Initial Academic Setup / Update Academic Info
// dropdowns. No other endpoint exposes this yet.
// ============================================

exports.getAllProgrammes = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT programmeID, programmeName, facultyID FROM programme ORDER BY programmeName`;
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getStudentByUserID = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM student WHERE userID = ?`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.getAdminByUserID = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM admins WHERE userID = ?`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.createStudentProfile = (studentID, name, programmeID, intakeID, userID) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO student (studentID, name, programmeID, intakeID, userID) VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [studentID, name, programmeID, intakeID, userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateStudentProfile = (userID, programmeID, intakeID) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE student SET programmeID = ?, intakeID = ? WHERE userID = ?`;
        db.query(sql, [programmeID, intakeID, userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateFullName = (userID, fullName) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET fullName = ? WHERE userID = ?`;
        db.query(sql, [fullName, userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// The student table keeps its own denormalized copy of the name — this is
// a no-op (0 affected rows) for admins or students who haven't completed
// Initial Academic Setup yet, since the WHERE just matches nothing.
exports.syncStudentName = (userID, fullName) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE student SET name = ? WHERE userID = ?`;
        db.query(sql, [fullName, userID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ============================================
// Full profile, combining the users row with the
// role-specific sub-profile (student or admin).
// Tolerates a missing sub-profile row (pre-setup
// state) by returning nulls instead of throwing —
// reused by login enrichment and GET /profile.
// ============================================

exports.getFullProfile = async (userID) => {
    const user = await new Promise((resolve, reject) => {
        const sql = `SELECT userID, fullName, matricNumber, utmEmail, role FROM users WHERE userID = ?`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });

    if (!user) return null;

    if (user.role === 'student') {
        const student = await exports.getStudentByUserID(userID);
        return {
            userID: user.userID,
            name: user.fullName,
            matricNumber: user.matricNumber,
            utmEmail: user.utmEmail,
            role: user.role,
            studentID: student ? student.studentID : null,
            programmeID: student ? student.programmeID : null,
            intakeID: student ? student.intakeID : null,
        };
    }

    if (user.role === 'admin') {
        const admin = await exports.getAdminByUserID(userID);
        return {
            userID: user.userID,
            name: user.fullName,
            matricNumber: user.matricNumber,
            utmEmail: user.utmEmail,
            role: user.role,
            adminID: admin ? admin.adminID : null,
            facultyID: admin ? admin.facultyID : null,
        };
    }

    return { userID: user.userID, name: user.fullName, utmEmail: user.utmEmail, role: user.role };
};
