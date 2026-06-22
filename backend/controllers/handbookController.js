// Handbook Controller - Handles all handbook-related operations
// UC031: Upload Handbook
// UC032: View Handbook Data
// UC033: Delete Handbook

const db = require('../config/db');
const handbookService = require('../services/handbookService');

// Get handbook data by intake year and month
// GET /api/handbook?year=2024&month=October
exports.getHandbookData = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both year and month parameters'
            });
        }

        const data = await handbookService.getHandbookData(year, month);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `No handbook data found for ${month} ${year}`
            });
        }

        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch handbook data',
            error: err.message
        });
    }
};

// Get all available intake years (for dropdown filter)
// GET /api/handbook/years
exports.getAvailableYears = async (req, res) => {
    try {
        const years = await handbookService.getAvailableYears();
        res.json({
            success: true,
            data: years
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available years',
            error: err.message
        });
    }
};

// Get available months for a specific year
// GET /api/handbook/months?year=2024
exports.getAvailableMonths = async (req, res) => {
    try {
        const { year } = req.query;

        if (!year) {
            return res.status(400).json({
                success: false,
                message: 'Year parameter is required'
            });
        }

        const months = await handbookService.getAvailableMonths(year);
        res.json({
            success: true,
            data: months
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available months',
            error: err.message
        });
    }
};

// Delete handbook data for a specific intake
// DELETE /api/handbook/delete?year=2024&month=October
exports.deleteHandbook = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both year and month parameters'
            });
        }

        const result = await handbookService.deleteHandbook(year, month);

        if (!result.deleted) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        res.json({
            success: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete handbook',
            error: err.message
        });
    }
};

// Upload handbook from Excel file
// POST /api/handbook/upload
exports.uploadHandbook = async (req, res) => {
    try {
        const { programmeID, intakeID, semesterNumber, uploadedBy } = req.body;
        const fileName = req.file ? req.file.originalname : 'unknown';

        if (!programmeID || !intakeID || !semesterNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide programmeID, intakeID, and semesterNumber'
            });
        }

        const result = await handbookService.uploadHandbook(
            programmeID, 
            intakeID, 
            semesterNumber, 
            fileName, 
            uploadedBy
        );

        res.json({
            success: true,
            message: 'Handbook uploaded successfully',
            data: result
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to upload handbook',
            error: err.message
        });
    }
};