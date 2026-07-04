// Timetable Routes - All timetable-related API endpoints
// UC034: Upload Timetable
// UC035: View Timetable Data
// UC036: Delete Timetable

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const timetableController = require('../controllers/timetableController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'timetable-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['.xlsx', '.xls'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only .xlsx and .xls files are allowed.'));
        }
    }
});

// Upload timetable from Excel file
// POST /api/timetable/upload
router.post('/timetable/upload', upload.single('file'), timetableController.uploadTimetable);

// Get timetable data by filters
// Example: GET /api/timetable?semesterNumber=1&intakeMonth=October&academicYear=2024/2025&facultyID=FC
router.get('/timetable', timetableController.getTimetableData);

// Get available semesters for dropdown
// Example: GET /api/timetable/semesters?facultyID=FC
router.get('/timetable/semesters', timetableController.getAvailableSemesters);

// Get sections for a specific course
// Example: GET /api/timetable/sections?courseCode=SCSE1013&semesterNumber=1&intakeMonth=October&academicYear=2024/2025
router.get('/timetable/sections', timetableController.getSectionsByCourse);

// Delete timetable data for a specific semester
// Example: DELETE /api/timetable/delete?semesterNumber=1&intakeMonth=October&academicYear=2024/2025&facultyID=FC
router.delete('/timetable/delete', timetableController.deleteTimetable);

module.exports = router;