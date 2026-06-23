const db = require('../config/db')

// ============================================
// UC001 - Get all unique academic sessions
// e.g. 2024/2025, 2025/2026, 2026/2027
// ============================================
exports.getAcademicSessions = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT academicSession
            FROM intake
            ORDER BY academicSession DESC
        `
        db.query(sql, (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC001 - Get intakes for a specific academic session
// ============================================
exports.getIntakesBySession = (academicSession) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM intake
            WHERE academicSession = ?
            ORDER BY intakeNumber ASC
        `
        db.query(sql, [academicSession], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC001 - Get semesters for a specific intake
// ============================================
exports.getSemesterByIntake = (intakeID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM semester
            WHERE intakeID = ?
            ORDER BY semesterNumber ASC
        `
        db.query(sql, [intakeID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC001 - Check if handbook slots exist for
// selected programme + intake + semester
// ============================================
exports.checkHandbookExists = (programmeID, intakeID, semesterNumber) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT hs.*, p.programmeName, p.facultyID,
                   i.academicSession, i.intakeMonth, i.intakeNumber
            FROM handbook_slot hs
            JOIN programme p ON hs.programmeID = p.programmeID
            JOIN intake i ON hs.intakeID = i.intakeID
            WHERE hs.programmeID = ?
            AND hs.intakeID = ?
            AND hs.semesterNumber = ?
        `
        db.query(sql, [programmeID, intakeID, semesterNumber], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC002 - Get available courses for a student
// Fixed and elective_group slots only
// Filtered by programme + intake + semester
// and whether course is offered this semester (has sections)
// ============================================
exports.getAvailableCourses = (programmeID, intakeID, semesterNumber, academicYear) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT
                c.courseCode,
                c.courseName,
                c.creditHours,
                c.hasPrerequisite,
                c.ownerFacultyID,
                hs.slotType,
                hs.slotID,
                hs.slotLabel,
                hs.pickCount,
                i.intakeMonth
            FROM handbook_slot hs
            JOIN intake i ON hs.intakeID = i.intakeID
            JOIN handbook_slot_course hsc ON hs.slotID = hsc.slotID
            JOIN course c ON hsc.courseCode = c.courseCode
            JOIN section s ON s.courseCode = c.courseCode
            WHERE hs.programmeID = ?
            AND hs.intakeID = ?
            AND hs.semesterNumber = ?
            AND hs.slotType IN ('fixed', 'elective_group')
            AND s.semesterNumber = ?
            AND s.intakeMonth = i.intakeMonth
            AND s.academicYear = ?
            ORDER BY hs.slotType, c.courseCode
        `
        db.query(sql, [programmeID, intakeID, semesterNumber, semesterNumber, academicYear], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC002 - Get available free elective courses
// Rules:
//   1. Course code matches codePattern from handbook_slot
//   2. Appears in free_elective_offering this semester
//   3. Offered by DIFFERENT faculty than student's faculty
// ============================================
exports.getAvailableFreeElectives = (programmeID, intakeID, semesterNumber, academicYear, studentFacultyID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT
                c.courseCode,
                c.courseName,
                c.creditHours,
                c.hasPrerequisite,
                c.ownerFacultyID,
                hs.slotType,
                hs.slotID,
                hs.slotLabel,
                hs.pickCount,
                hs.codePattern,
                i.intakeMonth
            FROM handbook_slot hs
            JOIN intake i ON hs.intakeID = i.intakeID
            JOIN free_elective_offering feo ON feo.semesterNumber = hs.semesterNumber
            JOIN course c ON feo.courseCode = c.courseCode
            WHERE hs.programmeID = ?
            AND hs.intakeID = ?
            AND hs.semesterNumber = ?
            AND hs.slotType = 'free_elective'
            AND feo.intakeMonth = i.intakeMonth
            AND feo.academicYear = ?
            AND feo.offeringFacultyID != ?
            AND c.courseCode REGEXP REPLACE(
                REPLACE(
                    REPLACE(hs.codePattern, 'x', '[a-zA-Z]'),
                'X', '[A-Z]'),
            '?', '[0-9]')
            ORDER BY c.courseCode
        `
        db.query(sql, [programmeID, intakeID, semesterNumber, academicYear, studentFacultyID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC003 - Get prerequisite info for a course
// ============================================
exports.getPrerequisiteByCourse = (courseCode) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                p.prerequisiteID,
                p.isMandatory,
                c.courseCode AS prerequisiteCourseCode,
                c.courseName AS prerequisiteCourseName,
                c.creditHours AS prerequisiteCreditHours
            FROM prerequisite p
            JOIN course c ON p.prerequisiteCourseCode = c.courseCode
            WHERE p.courseCode = ?
        `
        db.query(sql, [courseCode], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC004 - Save selected courses
// Clears existing selections first then inserts new
// ============================================
exports.saveSelectedCourses = (studentID, courseCodes, semesterID) => {
    return new Promise((resolve, reject) => {
        const clearSql = `
            DELETE FROM selected_course
            WHERE studentID = ? AND semesterID = ?
        `
        db.query(clearSql, [studentID, semesterID], (err) => {
            if (err) return reject(err)

            const selectionDate = new Date().toISOString().split('T')[0]
            const values = courseCodes.map(code => [
                `SC${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
                studentID,
                code,
                semesterID,
                selectionDate
            ])

            const insertSql = `
                INSERT INTO selected_course
                (selectionID, studentID, courseCode, semesterID, selectionDate)
                VALUES ?
            `
            db.query(insertSql, [values], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
        })
    })
}

// ============================================
// UC004 - Get student's current selected courses
// ============================================
exports.getSelectedCourses = (studentID, semesterID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                sc.selectionID,
                sc.courseCode,
                sc.selectionDate,
                c.courseName,
                c.creditHours,
                c.hasPrerequisite
            FROM selected_course sc
            JOIN course c ON sc.courseCode = c.courseCode
            WHERE sc.studentID = ? AND sc.semesterID = ?
        `
        db.query(sql, [studentID, semesterID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// Helper - Get student info including
// programme, faculty, intake, academic session
// Email comes from users table — not student table
// ============================================
exports.getStudentInfo = (studentID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                s.studentID,
                s.name,
                s.programmeID,
                s.intakeID,
                s.userID,
                u.utmEmail,
                u.role,
                p.programmeName,
                p.facultyID,
                a.facultyName,
                i.intakeMonth,
                i.intakeYear,
                i.academicSession,
                i.intakeNumber
            FROM student s
            JOIN users u ON s.userID = u.userID
            JOIN programme p ON s.programmeID = p.programmeID
            JOIN admins a ON p.facultyID = a.facultyID
            JOIN intake i ON s.intakeID = i.intakeID
            WHERE s.studentID = ?
        `
        db.query(sql, [studentID], (err, results) => {
            if (err) return reject(err)
            resolve(results[0])
        })
    })
}
