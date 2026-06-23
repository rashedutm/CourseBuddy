const express = require('express')
const router = express.Router()
const preferenceController = require('../controllers/preferenceController')

// UC009 — Save lecturer preference
router.post('/preferences/save', preferenceController.savePreference)

// UC010 — Get filtered patterns by preference
router.post('/preferences/filter', preferenceController.getFilteredPatterns)

// UC010 — Get active preferences for student
router.get('/preferences/active', preferenceController.getActivePreferences)

// UC012 — Reset all preferences
router.post('/preferences/reset', preferenceController.resetPreferences)

module.exports = router
