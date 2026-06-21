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
// studentFacultyID comes from JWT token via req.user
// ============================================
exports.getAvailableFreeElectives = async (req, res) => {
    try {
        const { programmeID, intakeID, semesterNumber, academicYear } = req.query
        if (!programmeID || !intakeID || !semesterNumber || !academicYear) {
            return res.status(400).json({ error: 'programmeID, intakeID, semesterNumber and academicYear are required' })
        }
        const studentInfo = await courseService.getStudentInfo(req.user.studentID)
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
// UC005 - POST /api/patterns/generate
// Generate clash free patterns for selected courses
// Body: { studentID, semesterID, academicYear }
// ============================================
exports.generatePatterns = async (req, res) => {
    try {
        const { studentID, semesterID, academicYear } = req.body
        if (!studentID || !semesterID || !academicYear) {
            return res.status(400).json({ error: 'studentID, semesterID and academicYear are required' })
        }

        const selectedCourses = await courseService.getSelectedCourses(studentID, semesterID)
        if (selectedCourses.length === 0) {
            return res.status(400).json({ error: 'No courses selected. Please select courses first.' })
        }

        const studentInfo = await courseService.getStudentInfo(studentID)
        if (!studentInfo) {
            return res.status(404).json({ error: 'Student profile not found' })
        }

        const semesterList = await courseService.getSemesterByIntake(studentInfo.intakeID)
        const currentSemester = semesterList.find(s => s.semesterID === semesterID)
        if (!currentSemester) {
            return res.status(404).json({ error: 'Semester not found' })
        }

        const courseCodes = selectedCourses.map(c => c.courseCode)
        const sections = await courseService.getSectionsByCourses(
            courseCodes,
            currentSemester.semesterNumber,
            studentInfo.intakeMonth,
            academicYear
        )

        if (sections.length === 0) {
            return res.status(404).json({
                message: 'Timetable data is currently unavailable for one or more of your selected courses. Please contact your faculty administrator.'
            })
        }

        // Group sections by course
        const sectionsByCourse = {}
        sections.forEach(section => {
            if (!sectionsByCourse[section.courseCode]) {
                sectionsByCourse[section.courseCode] = []
            }
            sectionsByCourse[section.courseCode].push(section)
        })

        const patterns = courseService.generateClashFreePatterns(sectionsByCourse)
        if (patterns.length === 0) {
            return res.status(404).json({
                message: 'No clash free pattern could be generated for your selected courses. Please consider removing one or more courses and try again.'
            })
        }

        res.json({ totalPatterns: patterns.length, patterns })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC007 - POST /api/patterns/select
// Save student's preferred pattern
// Body: { studentID, patternID }
// ============================================
exports.saveSelectedPattern = async (req, res) => {
    try {
        const { studentID, patternID } = req.body
        if (!studentID || !patternID) {
            return res.status(400).json({ error: 'studentID and patternID are required' })
        }
        const result = await courseService.saveSelectedPattern(studentID, patternID)
        res.json({ message: 'Pattern saved successfully', result })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC009 - GET /api/lecturers
// Get lecturers for selected courses
// Query: courseCodes, semesterNumber, intakeMonth, academicYear
// ============================================
exports.getLecturersForCourses = async (req, res) => {
    try {
        const { courseCodes, semesterNumber, intakeMonth, academicYear } = req.query
        if (!courseCodes || !semesterNumber || !intakeMonth || !academicYear) {
            return res.status(400).json({ error: 'courseCodes, semesterNumber, intakeMonth and academicYear are required' })
        }
        const courseCodesArray = courseCodes.split(',')
        const lecturers = await courseService.getLecturersByCourses(
            courseCodesArray,
            parseInt(semesterNumber),
            intakeMonth,
            academicYear
        )
        res.json(lecturers)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// UC010 - POST /api/preferences/filter
// Get patterns filtered by lecturer preference
// Body: { studentID, semesterID, lecturerPreferences, academicYear }
// lecturerPreferences = { courseCode: lecturerID }
// ============================================
exports.getFilteredPatterns = async (req, res) => {
    try {
        const { studentID, semesterID, lecturerPreferences, academicYear } = req.body
        if (!studentID || !semesterID || !lecturerPreferences || !academicYear) {
            return res.status(400).json({ error: 'studentID, semesterID, lecturerPreferences and academicYear are required' })
        }

        const selectedCourses = await courseService.getSelectedCourses(studentID, semesterID)
        if (selectedCourses.length === 0) {
            return res.status(400).json({ error: 'No courses selected' })
        }

        const studentInfo = await courseService.getStudentInfo(studentID)
        const semesterList = await courseService.getSemesterByIntake(studentInfo.intakeID)
        const currentSemester = semesterList.find(s => s.semesterID === semesterID)

        const courseCodes = selectedCourses.map(c => c.courseCode)
        const filteredSections = await courseService.getSectionsByPreference(
            courseCodes,
            lecturerPreferences,
            currentSemester.semesterNumber,
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
        const emptyCourses = courseCodes.filter(code => !sectionsByCourse[code] || sectionsByCourse[code].length === 0)
        if (emptyCourses.length > 0) {
            return res.status(404).json({
                message: 'No sections are available for one or more courses based on your lecturer preference. Please adjust your preferences and try again.',
                emptyCourses
            })
        }

        const patterns = courseService.generateClashFreePatterns(sectionsByCourse)
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
// UC012 - POST /api/preferences/reset
// Reset all lecturer preferences for a student
// Body: { studentID }
// ============================================
exports.resetLecturerPreferences = async (req, res) => {
    try {
        const { studentID } = req.body
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }
        await courseService.resetPreferences(studentID)
        res.json({ message: 'Your lecturer preferences have been successfully reset.' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// Helper - GET /api/student/info
// Get student info for the logged in student
// Uses studentID from JWT token via req.user
// ============================================
exports.getStudentInfo = async (req, res) => {
    try {
        const studentInfo = await courseService.getStudentInfo(req.user.studentID)
        if (!studentInfo) {
            return res.status(404).json({ error: 'Student profile not found' })
        }
        res.json(studentInfo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
