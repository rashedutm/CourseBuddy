const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')

router.get('/intakes', courseController.getIntakes)
router.get('/semesters', courseController.getSemesters)
router.get('/handbook', courseController.checkHandbook)

module.exports = router
