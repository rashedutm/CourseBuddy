const db = require('../config/db');
const profileService = require('./profileService');

// These two read tables owned by Zimly's subsystem (Subsystem 4). They
// resolve to null/0 on any error instead of rejecting, so a missing table
// or missing rows (not implemented yet, or student hasn't used it yet)
// never breaks the dashboard — the frontend just shows an empty state.

const getLatestSemesterStatus = (studentID) => {
    return new Promise((resolve) => {
        const sql = `SELECT * FROM semester_status WHERE studentID = ? ORDER BY updatedDate DESC LIMIT 1`;
        db.query(sql, [studentID], (err, results) => {
            if (err) return resolve(null);
            resolve(results[0] || null);
        });
    });
};

const getActiveDraftCount = (studentID) => {
    return new Promise((resolve) => {
        const sql = `SELECT COUNT(*) AS count FROM draft_vault WHERE studentID = ? AND isActive = TRUE`;
        db.query(sql, [studentID], (err, results) => {
            if (err) return resolve(0);
            resolve(results[0] ? results[0].count : 0);
        });
    });
};

exports.getStudentDashboard = async (userID) => {
    const student = await profileService.getStudentByUserID(userID);
    const user = await new Promise((resolve, reject) => {
        db.query(`SELECT fullName FROM users WHERE userID = ?`, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });

    if (!student) {
        return {
            fullName: user ? user.fullName : '',
            hasProfile: false,
            studentID: null,
            programmeID: null,
            routine: null,
            draftCount: 0
        };
    }

    const [semesterStatus, draftCount] = await Promise.all([
        getLatestSemesterStatus(student.studentID),
        getActiveDraftCount(student.studentID)
    ]);

    return {
        fullName: user ? user.fullName : '',
        hasProfile: true,
        studentID: student.studentID,
        programmeID: student.programmeID,
        routine: semesterStatus ? {
            totalCourses: semesterStatus.totalCourses,
            registeredCourses: semesterStatus.registeredCourses,
            failedCourses: semesterStatus.failedCourses,
            status: semesterStatus.status
        } : null,
        draftCount
    };
};

exports.getAlerts = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT alertID, message, priority, createdAt, isRead
            FROM academic_alert
            WHERE userID = ?
            ORDER BY CASE priority WHEN 'high' THEN 0 ELSE 1 END, createdAt DESC
        `;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// These two read tables owned by Yousra's subsystem (Subsystem 6). Like the
// student-side draft/routine counts above, they resolve to null on any
// error (missing table) rather than rejecting — the frontend renders "—"
// for null, distinct from a genuine 0.
const countCoursesForFaculty = (facultyID) => {
    return new Promise((resolve) => {
        const sql = `SELECT COUNT(*) AS count FROM course WHERE ownerFacultyID = ?`;
        db.query(sql, [facultyID], (err, results) => {
            if (err) return resolve(null);
            resolve(results[0] ? results[0].count : 0);
        });
    });
};

const countSectionsForFaculty = (facultyID) => {
    return new Promise((resolve) => {
        const sql = `SELECT COUNT(*) AS count FROM section WHERE facultyID = ?`;
        db.query(sql, [facultyID], (err, results) => {
            if (err) return resolve(null);
            resolve(results[0] ? results[0].count : 0);
        });
    });
};

exports.getAdminDashboard = async (userID) => {
    const user = await new Promise((resolve, reject) => {
        db.query(`SELECT fullName FROM users WHERE userID = ?`, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });

    const admin = await profileService.getAdminByUserID(userID);

    if (!admin) {
        // No admins-table row linked yet (e.g. a newly provisioned account) —
        // faculty-scoped stats are meaningless without a facultyID, so they
        // stay null (frontend shows "—") rather than a misleading 0.
        return {
            fullName: user ? user.fullName : '',
            facultyName: null,
            coursesUploaded: null,
            sectionsLoaded: null
        };
    }

    const [coursesUploaded, sectionsLoaded] = await Promise.all([
        countCoursesForFaculty(admin.facultyID),
        countSectionsForFaculty(admin.facultyID)
    ]);

    return {
        fullName: user ? user.fullName : '',
        facultyName: admin.facultyName,
        coursesUploaded,
        sectionsLoaded
    };
};
