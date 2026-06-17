const courseService = require('../services/courseService')

// GET /api/intakes
exports.getIntakes = async (req, res) => {
    try {
        const intakes = await courseService.getIntakeList()
        res.json(intakes)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/semesters?intakeID=IN001
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

// GET /api/handbook?intakeID=IN001&semesterID=SEM002
exports.checkHandbook = async (req, res) => {
    try {
        const { intakeID, semesterID } = req.query
        if (!intakeID || !semesterID) {
            return res.status(400).json({ error: 'intakeID and semesterID are required' })
        }
        const handbook = await courseService.getHandbookByIntakeSemester(intakeID, semesterID)

        if (handbook.length === 0) {
            // A1 alternate flow - no handbook data found
            return res.status(404).json({
                message: 'No course data available for the selected intake and semester. Please contact your faculty administrator.'
            })
        }

        res.json(handbook[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
