const db = require('../config/db')

// Every ID column in the schema is varchar(20), and MySQL is not running in
// strict mode — an over-long ID is silently TRUNCATED rather than rejected.
// Embedding studentID/courseCode in the ID overflowed that limit and cut off the
// timestamp, so repeated writes collapsed onto the same primary key and failed
// with "Duplicate entry". Keep generated IDs short: prefix + base36 timestamp +
// random suffix stays well inside 20 chars and is unique per row.
const shortID = (prefix) => {
    const stamp = Date.now().toString(36).toUpperCase()          // 8 chars
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase() // 3 chars
    return `${prefix}-${stamp}${rand}`
}

// ============================================
// UC009 — Save lecturer preference for a course
// If preference already exists update it
// ============================================
exports.saveLecturerPreference = (studentID, courseCode, lecturerID) => {
    return new Promise((resolve, reject) => {
        // Check if preference already exists
        const checkSql = `
            SELECT preferenceID FROM lecturer_preference
            WHERE studentID = ? AND courseCode = ? AND isActive = TRUE
        `
        db.query(checkSql, [studentID, courseCode], (err, existing) => {
            if (err) return reject(err)

            if (existing.length > 0) {
                // Update existing preference
                const updateSql = `
                    UPDATE lecturer_preference
                    SET lecturerID = ?, isConfirmed = TRUE
                    WHERE studentID = ? AND courseCode = ? AND isActive = TRUE
                `
                db.query(updateSql, [lecturerID, studentID, courseCode], (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                })
            } else {
                // Insert new preference
                const preferenceID = shortID('PREF')
                const createdDate = new Date().toISOString().split('T')[0]
                const insertSql = `
                    INSERT INTO lecturer_preference
                    (preferenceID, studentID, courseCode, lecturerID, isConfirmed, isActive, createdDate)
                    VALUES (?, ?, ?, ?, TRUE, TRUE, ?)
                `
                db.query(insertSql, [preferenceID, studentID, courseCode, lecturerID, createdDate], (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                })
            }
        })
    })
}

// ============================================
// UC010 — Get all active preferences for student
// ============================================
exports.getActivePreferences = (studentID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                lp.preferenceID,
                lp.courseCode,
                lp.lecturerID,
                lp.isConfirmed,
                l.lecturerName,
                c.courseName
            FROM lecturer_preference lp
            JOIN lecturer l ON lp.lecturerID = l.lecturerID
            JOIN course c ON lp.courseCode = c.courseCode
            WHERE lp.studentID = ? AND lp.isActive = TRUE
        `
        db.query(sql, [studentID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC010 — Get sections filtered by preferences
// For courses with preference: only that lecturer's sections
// For courses without preference: all sections
// ============================================
exports.getSectionsByPreference = (courseCodes, lecturerPreferences, semesterNumber, intakeMonth, academicYear) => {
    return new Promise((resolve, reject) => {
        const placeholders = courseCodes.map(() => '?').join(',')
        const sql = `
            SELECT
                s.sectionID,
                s.courseCode,
                s.sectionNumber,
                s.lecturerID,
                s.lecturerName,
                s.day,
                s.timeStart,
                s.timeEnd,
                s.venue,
                c.courseName,
                c.creditHours
            FROM section s
            JOIN course c ON s.courseCode = c.courseCode
            WHERE s.courseCode IN (${placeholders})
            AND s.semesterNumber = ?
            AND s.intakeMonth = ?
            AND s.academicYear = ?
            ORDER BY s.courseCode, s.sectionNumber
        `
        db.query(sql, [...courseCodes, semesterNumber, intakeMonth, academicYear], (err, results) => {
            if (err) return reject(err)

            // Filter by preferences in JS
            const filtered = results.filter(section => {
                const pref = lecturerPreferences[section.courseCode]
                if (!pref) return true
                return section.lecturerID === pref
            })

            resolve(filtered)
        })
    })
}

// ============================================
// UC012 — Reset all active preferences for student
// Logs the reset in preference_reset_log
// ============================================
exports.resetPreferences = (studentID, resetReason) => {
    return new Promise((resolve, reject) => {
        const deactivateSql = `
            UPDATE lecturer_preference
            SET isActive = FALSE
            WHERE studentID = ? AND isActive = TRUE
        `
        db.query(deactivateSql, [studentID], (err, result) => {
            if (err) return reject(err)

            // Log the reset
            const resetLogID = shortID('RLOG')
            const resetDate = new Date().toISOString().split('T')[0]
            const logSql = `
                INSERT INTO preference_reset_log
                (resetLogID, studentID, resetDate, resetReason, regeneratedWithoutPreference)
                VALUES (?, ?, ?, ?, TRUE)
            `
            db.query(logSql, [resetLogID, studentID, resetDate, resetReason || 'Manual reset by student'], (err) => {
                if (err) return reject(err)
                resolve({ message: 'Preferences reset successfully', affectedRows: result.affectedRows })
            })
        })
    })
}
