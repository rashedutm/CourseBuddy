// Handbook Routes - All handbook-related API endpoints
// UC031: Upload Handbook
// UC032: View Handbook Data
// UC033: Delete Handbook

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const handbookController = require('../controllers/handbookController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'handbook-' + uniqueSuffix + path.extname(file.originalname));
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

// Upload handbook from Excel file
// POST /api/handbook/upload
router.post('/handbook/upload', upload.single('file'), handbookController.uploadHandbook);

// Get handbook data by year and month
// Example: GET /api/handbook?year=2024&month=October
router.get('/handbook', handbookController.getHandbookData);

// Get all available years for dropdown
// Example: GET /api/handbook/years
router.get('/handbook/years', handbookController.getAvailableYears);

// Get available months for a specific year
// Example: GET /api/handbook/months?year=2024
router.get('/handbook/months', handbookController.getAvailableMonths);

// Delete handbook data for a specific intake
// Example: DELETE /api/handbook/delete?year=2024&month=October
router.delete('/handbook/delete', handbookController.deleteHandbook);

module.exports = router;