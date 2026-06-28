const preferenceService = require('../services/preferenceService')
const patternService = require('../services/patternService')
const { generateClashFreePatterns } = require('../services/clashDetectionService')

// ============================================
// UC009 — POST /api/preferences/save
// Save lecturer preference for one course
// Body: { studentID, courseCode, lecturerID }
// ============================================
exports.savePreference = async (req, res) => {
    try {
        const { studentID, courseCode, lecturerID } = req.body
        if (!studentID || !courseCode || !lecturerID) {
            return res.status(400).json({
                error: 'studentID, courseCode and lecturerID are required'
            })
        }
        const result = await preferenceService.saveLecturerPreference(studentID, courseCode, lecturerID)
        res.json({ message: 'Lecturer preference saved successfully', result })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC010 — POST /api/preferences/filter
// Filter patterns by lecturer preferences
// Body: { studentID, semesterID, lecturerPreferences, academicYear }
// lecturerPreferences = { courseCode: lecturerID }
// ============================================
exports.getFilteredPatterns = async (req, res) => {
    try {
        const { studentID, semesterID, lecturerPreferences, academicYear } = req.body
        if (!studentID || !semesterID || !lecturerPreferences || !academicYear) {
            return res.status(400).json({
                error: 'studentID, semesterID, lecturerPreferences and academicYear are required'
            })
        }

        const selectedCourses = await patternService.getSelectedCourses(studentID, semesterID)
        if (selectedCourses.length === 0) {
            return res.status(400).json({ error: 'No courses selected' })
        }

        const studentInfo = await patternService.getStudentInfo(studentID)
        const semesterInfo = await patternService.getSemesterByID(semesterID)

        const courseCodes = selectedCourses.map(c => c.courseCode)
        const filteredSections = await preferenceService.getSectionsByPreference(
            courseCodes,
            lecturerPreferences,
            semesterInfo.semesterNumber,
            studentInfo.intakeMonth,
            academicYear
        )

        // Group filtered sections by course
        const sectionsByCourse = {}
        filteredSections.forEach(section => {
            if (!sectionsByCourse[section.courseCode]) {
                sectionsByCourse[section.courseCode] = []
            }
            sectionsByCourse[section.courseCode].push(section)
        })

        // Check if any course has no sections after filtering
        const emptyCourses = courseCodes.filter(
            code => !sectionsByCourse[code] || sectionsByCourse[code].length === 0
        )
        if (emptyCourses.length > 0) {
            return res.status(404).json({
                message: 'No sections are available for one or more courses based on your lecturer preference. Please adjust your preferences and try again.',
                emptyCourses
            })
        }

        const patterns = generateClashFreePatterns(sectionsByCourse)
        if (patterns.length === 0) {
            return res.status(404).json({
                message: 'No clash free pattern could be found with your selected lecturer preferences.'
            })
        }

        res.json({ totalPatterns: patterns.length, patterns })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC012 — POST /api/preferences/reset
// Reset all lecturer preferences for student
// Body: { studentID, resetReason }
// ============================================
exports.resetPreferences = async (req, res) => {
    try {
        const { studentID, resetReason } = req.body
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }
        const result = await preferenceService.resetPreferences(studentID, resetReason)
        res.json({ message: 'Your lecturer preferences have been successfully reset.', result })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC010 — GET /api/preferences/active?studentID=
// Get all active preferences for a student
// ============================================
exports.getActivePreferences = async (req, res) => {
    try {
        const { studentID } = req.query
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }
        const preferences = await preferenceService.getActivePreferences(studentID)
        res.json(preferences)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
