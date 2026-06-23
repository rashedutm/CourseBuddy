const express = require('express')
const router = express.Router()
const patternController = require('../controllers/patternController')

// UC005 — Generate clash free patterns
router.post('/patterns/generate', patternController.generatePatterns)

// UC007 — Save selected pattern
router.post('/patterns/select', patternController.saveSelectedPattern)

// UC008 — Get active pattern
router.get('/patterns/active', patternController.getActivePattern)

module.exports = router
