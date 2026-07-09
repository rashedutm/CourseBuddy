const plannerService = require('../services/plannerService');

const VALID_STATUSES = ['not_taken', 'in_progress', 'completed', 'failed', 'dropped'];

exports.getPlanner = async (req, res) => {
    try {
        const planner = await plannerService.getPlannerForUser(req.user.userID);
        res.json(planner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { courseCode, status } = req.body;
        if (!courseCode || !status) {
            return res.status(400).json({ error: 'courseCode and status are required' });
        }
        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const intakeInfo = await plannerService.getStudentIntakeType(req.user.userID);
        if (!intakeInfo) {
            return res.status(404).json({ error: 'Complete initial academic setup first' });
        }

        const catalogRow = await plannerService.getCatalogRow(intakeInfo.intakeMonth, courseCode);
        if (!catalogRow) {
            return res.status(404).json({ error: 'Course not found in your degree catalog' });
        }

        const currentSemester = await plannerService.getCurrentSemester(req.user.userID);
        if (!plannerService.isInteractiveSemester(catalogRow.semesterNumber, currentSemester)) {
            return res.status(403).json({ error: 'This semester is not yet open for status updates' });
        }

        await plannerService.upsertStatus(req.user.userID, courseCode, status);
        res.json({ message: 'Status updated', courseCode, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCurrentSemester = async (req, res) => {
    try {
        const currentSemester = parseInt(req.body.currentSemester, 10);
        if (!Number.isInteger(currentSemester) || currentSemester < 1) {
            return res.status(400).json({ error: 'currentSemester must be a positive integer' });
        }

        const intakeInfo = await plannerService.getStudentIntakeType(req.user.userID);
        if (!intakeInfo) {
            return res.status(404).json({ error: 'Complete initial academic setup first' });
        }

        const maxSemester = await plannerService.getMaxSemester(intakeInfo.intakeMonth);
        if (currentSemester > maxSemester) {
            return res.status(400).json({ error: `currentSemester can't exceed ${maxSemester}` });
        }

        await plannerService.setCurrentSemester(req.user.userID, currentSemester);
        res.json({ message: 'Current semester updated', currentSemester });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
