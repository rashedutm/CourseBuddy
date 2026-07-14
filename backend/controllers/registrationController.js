const registrationService = require('../services/registrationService')

// Mirrors MAX_SAVED_PATTERNS in the frontend workspace — enforced here too, so the
// cap holds even if the client is bypassed.
const MAX_DRAFTS = 30

// ============================================
// GET /api/registration/drafts?studentID=
// Every draft for the student (vault + archived).
// ============================================
exports.getDrafts = async (req, res) => {
    try {
        const { studentID } = req.query
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }
        const drafts = await registrationService.getDraftsByStudent(studentID)
        res.json(drafts)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// POST /api/registration/drafts
// Body: { id?, studentID, semesterID, name, sections, credits, priority?, comment? }
// ============================================
exports.createDraft = async (req, res) => {
    try {
        const { studentID, semesterID, name, sections } = req.body
        if (!studentID || !semesterID || !name) {
            return res.status(400).json({ error: 'studentID, semesterID and name are required' })
        }
        if (!Array.isArray(sections) || sections.length === 0) {
            return res.status(400).json({ error: 'sections must be a non-empty array' })
        }

        const existing = await registrationService.getDraftsByStudent(studentID)
        if (existing.length >= MAX_DRAFTS) {
            return res.status(409).json({
                message: `You have reached the maximum of ${MAX_DRAFTS} saved drafts. Please delete one before saving another.`
            })
        }

        const draft = await registrationService.createDraft(req.body)
        res.status(201).json(draft)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// PATCH /api/registration/drafts/:draftID
// Body: { studentID, ...any of: name, priority, comment, archived }
// ============================================
exports.updateDraft = async (req, res) => {
    try {
        const { draftID } = req.params
        const { studentID, ...patch } = req.body
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }

        const draft = await registrationService.updateDraft(draftID, studentID, patch)
        if (!draft) {
            return res.status(404).json({ error: 'Draft not found' })
        }
        res.json(draft)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ============================================
// DELETE /api/registration/drafts/:draftID?studentID=
// ============================================
exports.deleteDraft = async (req, res) => {
    try {
        const { draftID } = req.params
        const { studentID } = req.query
        if (!studentID) {
            return res.status(400).json({ error: 'studentID is required' })
        }

        const removed = await registrationService.deleteDraft(draftID, studentID)
        if (!removed) {
            return res.status(404).json({ error: 'Draft not found' })
        }
        res.json({ message: 'Draft deleted' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
