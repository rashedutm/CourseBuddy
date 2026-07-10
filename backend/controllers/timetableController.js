// Timetable Controller - Handles all timetable-related operations
// UC034: Upload Timetable
// UC035: View Timetable Data
// UC036: Delete Timetable

const timetableService = require('../services/timetableService');

// Get timetable data by filters
// GET /api/timetable?semesterNumber=1&intakeMonth=October&academicYear=2024/2025&facultyID=FC
exports.getTimetableData = async (req, res) => {
    try {
        const { semesterNumber, intakeMonth, academicYear, facultyID } = req.query;

        if (!semesterNumber || !intakeMonth || !academicYear || !facultyID) {
            return res.status(400).json({
                success: false,
                message: 'Please provide semesterNumber, intakeMonth, academicYear, and facultyID'
            });
        }

        const data = await timetableService.getTimetableData(
            semesterNumber, 
            intakeMonth, 
            academicYear, 
            facultyID
        );

        res.json({
            success: true,
            data: data,
            count: data.length
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch timetable data',
            error: err.message
        });
    }
};

// Get available semesters for dropdown
// GET /api/timetable/semesters?facultyID=FC
exports.getAvailableSemesters = async (req, res) => {
    try {
        const { facultyID } = req.query;

        if (!facultyID) {
            return res.status(400).json({
                success: false,
                message: 'Please provide facultyID'
            });
        }

        const semesters = await timetableService.getAvailableSemesters(facultyID);
        res.json({
            success: true,
            data: semesters
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available semesters',
            error: err.message
        });
    }
};

// Delete timetable data for a specific semester
// DELETE /api/timetable/delete?semesterNumber=1&intakeMonth=October&academicYear=2024/2025&facultyID=FC
exports.deleteTimetable = async (req, res) => {
    try {
        const { semesterNumber, intakeMonth, academicYear, facultyID } = req.query;

        if (!semesterNumber || !intakeMonth || !academicYear || !facultyID) {
            return res.status(400).json({
                success: false,
                message: 'Please provide semesterNumber, intakeMonth, academicYear, and facultyID'
            });
        }

        const result = await timetableService.deleteTimetable(
            semesterNumber, 
            intakeMonth, 
            academicYear, 
            facultyID
        );

        res.json({
            success: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete timetable',
            error: err.message
        });
    }
};

// Upload timetable from Excel file
// POST /api/timetable/upload
exports.uploadTimetable = async (req, res) => {
    try {
        const { semesterNumber, intakeMonth, academicYear, facultyID, uploadedBy } = req.body;
        const fileName = req.file ? req.file.originalname : 'unknown';
        const filePath = req.file ? req.file.path : null;

        if (!semesterNumber || !intakeMonth || !academicYear || !facultyID) {
            return res.status(400).json({
                success: false,
                message: 'Please provide semesterNumber, intakeMonth, academicYear, and facultyID'
            });
        }

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await timetableService.uploadTimetable(
            semesterNumber,
            intakeMonth,
            academicYear,
            facultyID,
            fileName,
            uploadedBy,
            filePath
        );

        res.json({
            success: true,
            message: result.message,
            data: result
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to upload timetable',
            error: err.message
        });
    }
};

// Get sections for a specific course
// GET /api/timetable/sections?courseCode=SCSE1013&semesterNumber=1&intakeMonth=October&academicYear=2024/2025
exports.getSectionsByCourse = async (req, res) => {
    try {
        const { courseCode, semesterNumber, intakeMonth, academicYear } = req.query;

        if (!courseCode || !semesterNumber || !intakeMonth || !academicYear) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseCode, semesterNumber, intakeMonth, and academicYear'
            });
        }

        const sections = await timetableService.getSectionsByCourse(
            courseCode, 
            semesterNumber, 
            intakeMonth, 
            academicYear
        );

        res.json({
            success: true,
            data: sections
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sections',
            error: err.message
        });
    }
};