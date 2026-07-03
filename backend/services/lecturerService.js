const db = require('../config/db')

// ============================================
// UC009 — Get all lecturers for given courses
// Groups by courseCode + lecturerID
// Also returns which sections each lecturer teaches
// ============================================
exports.getLecturersByCourses = (courseCodes, semesterNumber, intakeMonth, academicYear) => {
    return new Promise((resolve, reject) => {
        const placeholders = courseCodes.map(() => '?').join(',')
        const sql = `
            SELECT DISTINCT
                s.courseCode,
                s.lecturerID,
                s.lecturerName,
                c.courseName,
                GROUP_CONCAT(s.sectionNumber ORDER BY s.sectionNumber) AS assignedSections
            FROM section s
            JOIN course c ON s.courseCode = c.courseCode
            WHERE s.courseCode IN (${placeholders})
            AND s.semesterNumber = ?
            AND s.intakeMonth = ?
            AND s.academicYear = ?
            AND s.lecturerID IS NOT NULL
            GROUP BY s.courseCode, s.lecturerID, s.lecturerName, c.courseName
            ORDER BY s.courseCode, s.lecturerName
        `
        db.query(sql, [...courseCodes, semesterNumber, intakeMonth, academicYear], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC009 — Get single lecturer by ID
// ============================================
exports.getLecturerByID = (lecturerID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM lecturer WHERE lecturerID = ?
        `
        db.query(sql, [lecturerID], (err, results) => {
            if (err) return reject(err)
            resolve(results[0])
        })
    })
}
