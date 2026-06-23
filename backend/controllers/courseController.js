const courseService = require('../services/courseService')

// ============================================
// UC001 - GET /api/sessions
// Get all unique academic sessions
// ============================================
exports.getAcademicSessions = async (req, res) => {
    try {
        const sessions = await courseService.getAcademicSessions()
        res.json(sessions)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC001 - GET /api/intakes?academicSession=2024/2025
// Get intakes for a specific academic session
// ============================================
exports.getIntakesBySession = async (req, res) => {
    try {
        const { academicSession } = req.query
        if (!academicSession) {
            return res.status(400).json({ error: 'academicSession is required' })
        }
        const intakes = await courseService.getIntakesBySession(academicSession)
        res.json(intakes)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC001 - GET /api/semesters?intakeID=IN-2024-1
// Get semesters for a specific intake
// ============================================
exports.getSemesters = async (req, res) => {
    try {
        const { intakeID } = req.query
        if (!intakeID) {
            return res.status(400).json({ error: 'intakeID is required' })
        }
        const semesters = await courseService.getSemesterByIntake(intakeID)
        res.json(semesters)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC001 - GET /api/handbook
// Check if handbook exists for programme + intake + semester
// Query: programmeID, intakeID, semesterNumber
// ============================================
exports.checkHandbook = async (req, res) => {
    try {
        const { programmeID, intakeID, semesterNumber } = req.query
        if (!programmeID || !intakeID || !semesterNumber) {
            return res.status(400).json({ error: 'programmeID, intakeID and semesterNumber are required' })
        }
        const handbook = await courseService.checkHandbookExists(programmeID, intakeID, parseInt(semesterNumber))
        if (handbook.length === 0) {
            return res.status(404).json({
                message: 'No course data available for the selected intake and semester. Please contact your faculty administrator.'
            })
        }
        res.json(handbook)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC002 - GET /api/courses/available
// Get available fixed and elective_group courses
// Query: programmeID, intakeID, semesterNumber, academicYear
// ============================================
exports.getAvailableCourses = async (req, res) => {
    try {
        const { programmeID, intakeID, semesterNumber, academicYear } = req.query
        if (!programmeID || !intakeID || !semesterNumber || !academicYear) {
            return res.status(400).json({ error: 'programmeID, intakeID, semesterNumber and academicYear are required' })
        }
        const courses = await courseService.getAvailableCourses(
            programmeID,
            intakeID,
            parseInt(semesterNumber),
            academicYear
        )
        res.json(courses)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC002 - GET /api/courses/free-electives
// Get available free elective courses
// studentFacultyID resolved from studentID in query
// ============================================
exports.getAvailableFreeElectives = async (req, res) => {
    try {
        const { programmeID, intakeID, semesterNumber, academicYear, studentID } = req.query
        if (!programmeID || !intakeID || !semesterNumber || !academicYear || !studentID) {
            return res.status(400).json({ error: 'programmeID, intakeID, semesterNumber, academicYear and studentID are required' })
        }
        const studentInfo = await courseService.getStudentInfo(studentID)
        if (!studentInfo) {
            return res.status(404).json({ error: 'Student profile not found' })
        }
        const courses = await courseService.getAvailableFreeElectives(
            programmeID,
            intakeID,
            parseInt(semesterNumber),
            academicYear,
            studentInfo.facultyID
        )
        res.json(courses)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC003 - GET /api/courses/prerequisites?courseCode=SCSE1203
// Get prerequisite info for a specific course
// ============================================
exports.getPrerequisiteInfo = async (req, res) => {
    try {
        const { courseCode } = req.query
        if (!courseCode) {
            return res.status(400).json({ error: 'courseCode is required' })
        }
        const prerequisites = await courseService.getPrerequisiteByCourse(courseCode)
        res.json(prerequisites)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC004 - POST /api/courses/select
// Save student's selected courses
// Body: { studentID, courseCodes, semesterID }
// ============================================
exports.saveSelectedCourses = async (req, res) => {
    try {
        const { studentID, courseCodes, semesterID } = req.body
        if (!studentID || !courseCodes || !semesterID) {
            return res.status(400).json({ error: 'studentID, courseCodes and semesterID are required' })
        }
        if (!Array.isArray(courseCodes) || courseCodes.length === 0) {
            return res.status(400).json({ error: 'Please select at least one course before generating patterns' })
        }
        const result = await courseService.saveSelectedCourses(studentID, courseCodes, semesterID)
        res.json({ message: 'Courses saved successfully', result })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// Helper - GET /api/student/info?studentID=
// Get student info including programme and faculty
// ============================================
exports.getStudentInfo = async (req, res) => {
    try {
        const { studentID } = req.query
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }
        const studentInfo = await courseService.getStudentInfo(studentID)
        if (!studentInfo) {
            return res.status(404).json({ error: 'Student profile not found' })
        }
        res.json(studentInfo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/current-academic-year
exports.getCurrentAcademicYear = async (req, res) => {
    try {
        const year = await courseService.getCurrentAcademicYear()
        res.json({ academicYear: year })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}