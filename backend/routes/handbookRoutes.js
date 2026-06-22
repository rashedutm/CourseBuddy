// Handbook Routes - All handbook-related API endpoints

const express = require('express');
const router = express.Router();
const handbookController = require('../controllers/handbookController');

// Get handbook data by year and month
// Example: GET /api/handbook?year=2024&month=October
router.get('/handbook', handbookController.getHandbookData);

// Get all available years for dropdown
// Example: GET /api/handbook/years
router.get('/handbook/years', handbookController.getAvailableYears);

// Get available months for a specific year
// Example: GET /api/handbook/months?year=2024
router.get('/handbook/months', handbookController.getAvailableMonths);

module.exports = router;