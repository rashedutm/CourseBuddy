const patternService = require('../services/patternService')

// ============================================
// UC005 — POST /api/patterns/generate
// Generate clash free patterns for student
// Body: { studentID, semesterID, academicYear }
// ============================================
exports.generatePatterns = async (req, res) => {
    try {
        const { studentID, semesterID, academicYear } = req.body
        if (!studentID || !semesterID || !academicYear) {
            return res.status(400).json({
                error: 'studentID, semesterID and academicYear are required'
            })
        }

        const { patterns, studentInfo, semesterInfo } = await patternService.generatePatterns(
            studentID,
            semesterID,
            academicYear
        )

        if (patterns.length === 0) {
            return res.status(404).json({
                message: 'No clash free pattern could be generated for your selected courses. Please consider removing one or more courses and try again.'
            })
        }

        res.json({
            totalPatterns: patterns.length,
            patterns,
            semesterNumber: semesterInfo.semesterNumber,
            intakeMonth: studentInfo.intakeMonth
        })
    } catch (err) {
        if (err.message === 'NO_COURSES_SELECTED') {
            return res.status(400).json({ error: 'No courses selected. Please select courses first.' })
        }
        if (err.message === 'STUDENT_NOT_FOUND') {
            return res.status(404).json({ error: 'Student profile not found.' })
        }
        if (err.message === 'SEMESTER_NOT_FOUND') {
            return res.status(404).json({ error: 'Semester not found.' })
        }
        if (err.message === 'NO_TIMETABLE_DATA') {
            return res.status(404).json({
                message: 'Timetable data is currently unavailable for one or more of your selected courses. Please contact your faculty administrator.'
            })
        }
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC007 — POST /api/patterns/select
// Save student's chosen pattern to DB
// Body: { studentID, semesterID, sections }
// sections = array of section objects from frontend
// ============================================
exports.saveSelectedPattern = async (req, res) => {
    try {
        const { studentID, semesterID, sections } = req.body
        if (!studentID || !semesterID || !sections) {
            return res.status(400).json({
                error: 'studentID, semesterID and sections are required'
            })
        }
        if (!Array.isArray(sections) || sections.length === 0) {
            return res.status(400).json({ error: 'sections must be a non-empty array' })
        }

        const result = await patternService.savePattern(studentID, semesterID, sections)
        res.json({
            message: 'Pattern saved successfully',
            patternID: result.patternID,
            historyID: result.historyID
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC008 — GET /api/patterns/active?studentID=
// Get student's currently active saved pattern
// ============================================
exports.getActivePattern = async (req, res) => {
    try {
        const { studentID } = req.query
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }

        const pattern = await patternService.getActivePattern(studentID)
        if (!pattern || pattern.length === 0) {
            return res.status(404).json({ message: 'No active pattern found for this student.' })
        }

        res.json(pattern)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}