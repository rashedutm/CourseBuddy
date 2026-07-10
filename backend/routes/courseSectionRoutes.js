// Course Section Routes - All course and section management API endpoints
// UC037: View Course and Section Data
// UC038: Edit Course Data
// UC039: Edit Section Data
// UC040: Delete Course or Section Entry

const express = require('express');
const router = express.Router();
const courseSectionController = require('../controllers/courseSectionController');

// Get all courses with optional filters
// Example: GET /api/courses?facultyID=FC&searchTerm=SCSE
router.get('/courses', courseSectionController.getCourses);

// Get course details by course code
// Example: GET /api/courses/SCSE1013
router.get('/courses/:courseCode', courseSectionController.getCourseByCode);

// Create a new course
// POST /api/courses
router.post('/courses', courseSectionController.createCourse);

// Update course information
// PUT /api/courses/:courseCode
router.put('/courses/:courseCode', courseSectionController.updateCourse);

// Delete a course
// DELETE /api/courses/:courseCode
router.delete('/courses/:courseCode', courseSectionController.deleteCourse);

// Get all sections with filters
// Example: GET /api/sections?facultyID=FC&semesterNumber=1&intakeMonth=October&academicYear=2024/2025
router.get('/sections', courseSectionController.getSections);

// Get sections for a specific course
// Example: GET /api/sections/course/SCSE1013?semesterNumber=1&intakeMonth=October&academicYear=2024/2025
router.get('/sections/course/:courseCode', courseSectionController.getSectionsByCourse);

// Create a new section
// POST /api/sections
router.post('/sections', courseSectionController.createSection);

// Update section information
// PUT /api/sections/:sectionID
router.put('/sections/:sectionID', courseSectionController.updateSection);

// Delete a section
// DELETE /api/sections/:sectionID
router.delete('/sections/:sectionID', courseSectionController.deleteSection);

module.exports = router;