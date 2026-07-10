const crypto = require('crypto');
const db = require('../config/db');
const profileService = require('./profileService');

// Published total credit requirement per programme — a fixed fact about
// the degree (like a course's credit hours), not something derivable by
// summing catalog rows: several semesters use "choose N of M" elective
// groups where only N of the M listed rows actually count toward the
// total, so a naive SUM(creditHours) over the catalog would overcount.
const TOTAL_CREDITS_REQUIRED = {
    SCSEH: 130
};

// Fallback for a student who hasn't picked a current semester yet —
// matches the feature's original Sem 1-2-only rollout.
const DEFAULT_CURRENT_SEMESTER = 2;

exports.getStudentIntakeType = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.programmeID, i.intakeMonth
            FROM student s
            JOIN intake i ON i.intakeID = s.intakeID
            WHERE s.userID = ?
        `;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0] || null);
        });
    });
};

exports.getCatalogByIntake = (intakeType) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT catalogID, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup
            FROM planner_course_catalog
            WHERE intakeType = ?
            ORDER BY semesterNumber, catalogID
        `;
        db.query(sql, [intakeType], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getStatusMapForUser = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT courseCode, status FROM planner_course_status WHERE userID = ?`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            const map = {};
            results.forEach(row => { map[row.courseCode] = row.status; });
            resolve(map);
        });
    });
};

exports.getCatalogRow = (intakeType, courseCode) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM planner_course_catalog WHERE intakeType = ? AND courseCode = ?`;
        db.query(sql, [intakeType, courseCode], (err, results) => {
            if (err) return reject(err);
            resolve(results[0] || null);
        });
    });
};

exports.getMaxSemester = (intakeType) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MAX(semesterNumber) AS maxSemester FROM planner_course_catalog WHERE intakeType = ?`;
        db.query(sql, [intakeType], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]?.maxSemester || DEFAULT_CURRENT_SEMESTER);
        });
    });
};

exports.getCurrentSemester = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT currentSemester FROM planner_student_progress WHERE userID = ?`;
        db.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0] ? results[0].currentSemester : DEFAULT_CURRENT_SEMESTER);
        });
    });
};

exports.setCurrentSemester = (userID, currentSemester) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO planner_student_progress (userID, currentSemester)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE currentSemester = VALUES(currentSemester)
        `;
        db.query(sql, [userID, currentSemester], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.upsertStatus = (userID, courseCode, status) => {
    return new Promise((resolve, reject) => {
        const statusID = `PST-${crypto.randomBytes(6).toString('hex')}`;
        const sql = `
            INSERT INTO planner_course_status (statusID, userID, courseCode, status)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;
        db.query(sql, [statusID, userID, courseCode, status], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.isInteractiveSemester = (semesterNumber, currentSemester) => semesterNumber <= currentSemester;

exports.getTotalCreditsRequired = (programmeID) => TOTAL_CREDITS_REQUIRED[programmeID] ?? null;

// Full planner view for a student: their intake-specific catalog grouped
// by semester, merged with their own status per course, plus a live
// credit summary. Tolerates a student who hasn't completed Initial
// Academic Setup yet (no student/intake row) by returning hasProfile:false,
// matching the pattern already used by home dashboard/getFullProfile.
exports.getPlannerForUser = async (userID) => {
    const student = await profileService.getStudentByUserID(userID);
    if (!student) {
        return { hasProfile: false };
    }

    const intakeInfo = await exports.getStudentIntakeType(userID);
    if (!intakeInfo) {
        return { hasProfile: false };
    }

    const [catalog, statusMap, currentSemester, maxSemester] = await Promise.all([
        exports.getCatalogByIntake(intakeInfo.intakeMonth),
        exports.getStatusMapForUser(userID),
        exports.getCurrentSemester(userID),
        exports.getMaxSemester(intakeInfo.intakeMonth)
    ]);

    const semesterMap = new Map();
    let creditsCompleted = 0;
    const countedCourseCodes = new Set();

    catalog.forEach(row => {
        const status = statusMap[row.courseCode] || 'not_taken';
        if (status === 'completed' && !countedCourseCodes.has(row.courseCode)) {
            creditsCompleted += row.creditHours;
            countedCourseCodes.add(row.courseCode);
        }

        if (!semesterMap.has(row.semesterNumber)) {
            semesterMap.set(row.semesterNumber, []);
        }
        semesterMap.get(row.semesterNumber).push({
            courseCode: row.courseCode,
            courseName: row.courseName,
            creditHours: row.creditHours,
            prerequisiteNote: row.prerequisiteNote,
            electiveGroup: row.electiveGroup,
            status
        });
    });

    const semesters = Array.from(semesterMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([semesterNumber, courses]) => ({
            semesterNumber,
            interactive: exports.isInteractiveSemester(semesterNumber, currentSemester),
            courses
        }));

    const creditsRequired = exports.getTotalCreditsRequired(intakeInfo.programmeID);

    return {
        hasProfile: true,
        intakeType: intakeInfo.intakeMonth,
        programmeID: intakeInfo.programmeID,
        currentSemester,
        maxSemester,
        semesters,
        creditSummary: {
            completed: creditsCompleted,
            required: creditsRequired,
            percent: creditsRequired ? Math.round((creditsCompleted / creditsRequired) * 100) : null
        }
    };
};
