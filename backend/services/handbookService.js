// Handbook Service - Business logic for handbook operations

const db = require('../config/db');

// Get handbook data by intake year and month
exports.getHandbookData = (year, month) => {
    return new Promise((resolve, reject) => {
        // Step 1: Find the intakeID
        const intakeQuery = `
            SELECT intakeID, intakeName, academicSession 
            FROM intake 
            WHERE intakeYear = ? AND intakeMonth = ?
            ORDER BY intakeYear DESC 
            LIMIT 1
        `;

        db.query(intakeQuery, [year, month], (err, intakeResult) => {
            if (err) {
                return reject(err);
            }

            if (intakeResult.length === 0) {
                return resolve(null);
            }

            const intakeID = intakeResult[0].intakeID;
            const intakeName = intakeResult[0].intakeName;
            const academicSession = intakeResult[0].academicSession;

            // Step 2: Get all courses for this intake
            const courseQuery = `
                SELECT 
                    c.courseCode,
                    c.courseName,
                    c.creditHours,
                    hs.semesterNumber,
                    GROUP_CONCAT(DISTINCT p.prerequisiteCourseCode ORDER BY p.prerequisiteCourseCode SEPARATOR ', ') as prerequisites
                FROM handbook_slot hs
                JOIN handbook_slot_course hsc ON hs.slotID = hsc.slotID
                JOIN course c ON hsc.courseCode = c.courseCode
                LEFT JOIN prerequisite p ON c.courseCode = p.courseCode
                WHERE hs.intakeID = ?
                GROUP BY c.courseCode, hs.semesterNumber
                ORDER BY hs.semesterNumber, c.courseCode
            `;

            db.query(courseQuery, [intakeID], (err, courses) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    intakeID,
                    intakeName,
                    academicSession,
                    totalCourses: courses.length,
                    courses
                });
            });
        });
    });
};

// Get all available intake years
exports.getAvailableYears = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DISTINCT intakeYear 
            FROM intake 
            ORDER BY intakeYear DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }

            const years = results.map(row => row.intakeYear);
            resolve(years);
        });
    });
};

// Get available months for a specific year
exports.getAvailableMonths = (year) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DISTINCT intakeMonth 
            FROM intake 
            WHERE intakeYear = ?
            ORDER BY intakeMonth
        `;

        db.query(query, [year], (err, results) => {
            if (err) {
                return reject(err);
            }

            const months = results.map(row => row.intakeMonth);
            resolve(months);
        });
    });
};

// Delete handbook data for a specific intake
exports.deleteHandbook = (year, month) => {
    return new Promise((resolve, reject) => {
        // First find the intakeID
        const intakeQuery = `
            SELECT intakeID FROM intake 
            WHERE intakeYear = ? AND intakeMonth = ?
            LIMIT 1
        `;

        db.query(intakeQuery, [year, month], (err, intakeResult) => {
            if (err) {
                return reject(err);
            }

            if (intakeResult.length === 0) {
                return resolve({ deleted: false, message: 'Intake not found' });
            }

            const intakeID = intakeResult[0].intakeID;

            // Delete handbook slots and their courses
            const deleteQuery = `
                DELETE hs, hsc 
                FROM handbook_slot hs
                LEFT JOIN handbook_slot_course hsc ON hs.slotID = hsc.slotID
                WHERE hs.intakeID = ?
            `;

            db.query(deleteQuery, [intakeID], (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve({ 
                    deleted: true, 
                    message: 'Handbook deleted successfully',
                    affectedRows: result.affectedRows
                });
            });
        });
    });
};

// Upload handbook from Excel file
exports.uploadHandbook = (programmeID, intakeID, semesterNumber, fileName, uploadedBy) => {
    return new Promise((resolve, reject) => {
        // This would typically parse the Excel file and insert data
        // For now, we'll create a log entry
        const logQuery = `
            INSERT INTO handbook_upload_log 
            (uploadLogID, programmeID, intakeID, semesterNumber, uploadedBy, fileName, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const uploadLogID = `HUL${Date.now()}`;
        const status = 'success';

        db.query(logQuery, [uploadLogID, programmeID, intakeID, semesterNumber, uploadedBy, fileName, status], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                success: true,
                uploadLogID,
                message: 'Handbook uploaded successfully'
            });
        });
    });
};