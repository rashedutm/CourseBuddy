const express = require('express')
const router = express.Router()
const lecturerController = require('../controllers/lecturerController')

// UC009 — Get lecturers for selected courses
router.get('/lecturers', lecturerController.getLecturersForCourses)

module.exports = router
