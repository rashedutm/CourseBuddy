const express = require('express')
const router = express.Router()
const registrationController = require('../controllers/registrationController')

// ============================================
// Subsystem 4 — Draft Vault (Registration Simulation)
// Drafts are per-student and survive logout, so the vault and archive are
// restored from the DB on sign-in instead of living only in localStorage.
// ============================================
router.get('/registration/drafts', registrationController.getDrafts)
router.post('/registration/drafts', registrationController.createDraft)
router.patch('/registration/drafts/:draftID', registrationController.updateDraft)
router.delete('/registration/drafts/:draftID', registrationController.deleteDraft)

module.exports = router
