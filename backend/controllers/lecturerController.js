const lecturerService = require('../services/lecturerService')

// ============================================
// UC009 — GET /api/lecturers
// Get lecturers for a list of course codes
// Query: courseCodes, semesterNumber, intakeMonth, academicYear
// ============================================
exports.getLecturersForCourses = async (req, res) => {
    try {
        const { courseCodes, semesterNumber, intakeMonth, academicYear } = req.query
        if (!courseCodes || !semesterNumber || !intakeMonth || !academicYear) {
            return res.status(400).json({
                error: 'courseCodes, semesterNumber, intakeMonth and academicYear are required'
            })
        }

        const courseCodesArray = courseCodes.split(',')
        const lecturers = await lecturerService.getLecturersByCourses(
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
