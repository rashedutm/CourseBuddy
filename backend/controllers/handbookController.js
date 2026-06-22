// Handbook Controller - Handles all handbook-related operations
// UC032: View Handbook Data

const db = require('../config/db');

// Get handbook data by intake year and month
// GET /api/handbook?year=2024&month=October
exports.getHandbookData = (req, res) => {
    const { year, month } = req.query;

    // Validate input
    if (!year || !month) {
        return res.status(400).json({
            success: false,
            message: 'Please provide both year and month parameters'
        });
    }

    // Step 1: Find the intakeID for the given year and month
    const intakeQuery = `
        SELECT intakeID, intakeName, academicSession 
        FROM intake 
        WHERE intakeYear = ? AND intakeMonth = ?
        ORDER BY intakeYear DESC 
        LIMIT 1
    `;

    db.query(intakeQuery, [year, month], (err, intakeResult) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch intake data',
                error: err.message
            });
        }

        if (intakeResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No intake found for ${month} ${year}`
            });
        }

        const intakeID = intakeResult[0].intakeID;
        const intakeName = intakeResult[0].intakeName;
        const academicSession = intakeResult[0].academicSession;

        // Step 2: Get all courses for this intake from the handbook
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
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch course data',
                    error: err.message
                });
            }

            // Step 3: Send response
            res.json({
                success: true,
                data: {
                    intakeID: intakeID,
                    intakeName: intakeName,
                    academicSession: academicSession,
                    totalCourses: courses.length,
                    courses: courses
                }
            });
        });
    });
};

// Get all available intake years (for dropdown filter)
// GET /api/handbook/years
exports.getAvailableYears = (req, res) => {
    const query = `
        SELECT DISTINCT intakeYear 
        FROM intake 
        ORDER BY intakeYear DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch available years',
                error: err.message
            });
        }

        const years = results.map(row => row.intakeYear);

        res.json({
            success: true,
            data: years
        });
    });
};

// Get available months for a specific year
// GET /api/handbook/months?year=2024
exports.getAvailableMonths = (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({
            success: false,
            message: 'Year parameter is required'
        });
    }

    const query = `
        SELECT DISTINCT intakeMonth 
        FROM intake 
        WHERE intakeYear = ?
        ORDER BY intakeMonth
    `;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch available months',
                error: err.message
            });
        }

        const months = results.map(row => row.intakeMonth);

        res.json({
            success: true,
            data: months
        });
    });
};