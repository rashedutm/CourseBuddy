const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')

// ============================================
// UC001 — Course Selection Routes
// ============================================
router.get('/sessions', courseController.getAcademicSessions)
router.get('/intakes', courseController.getIntakesBySession)
router.get('/semesters', courseController.getSemesters)
router.get('/handbook', courseController.checkHandbook)

// ============================================
// UC002 — Available Courses Routes
// ============================================
router.get('/courses/available', courseController.getAvailableCourses)
router.get('/courses/free-electives', courseController.getAvailableFreeElectives)

// ============================================
// UC003 — Prerequisite Route
// ============================================
router.get('/courses/prerequisites', courseController.getPrerequisiteInfo)

// ============================================
// UC004 — Course Selection Route
// ============================================
router.post('/courses/select', courseController.saveSelectedCourses)

// ============================================
// Helper — Student Info Route
// ============================================
router.get('/student/info', courseController.getStudentInfo)
router.get('/current-academic-year', courseController.getCurrentAcademicYear)

module.exports = router
