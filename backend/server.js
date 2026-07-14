const express = require('express')
require('dotenv').config()
const cors = require('cors')
const path = require('path')
const db = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())

// ============================================
// Rashed — Subsystem 3 Routes
// ============================================
const courseRoutes = require('./routes/courseRoutes')
const patternRoutes = require('./routes/patternRoutes')
const lecturerRoutes = require('./routes/lecturerRoutes')
const preferenceRoutes = require('./routes/preferenceRoutes')

app.use('/api', courseRoutes)
app.use('/api', patternRoutes)
app.use('/api', lecturerRoutes)
app.use('/api', preferenceRoutes)

// ============================================
// Tarin — Subsystem 5 Routes
// ============================================
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const homeRoutes = require('./routes/homeRoutes')
const plannerRoutes = require('./routes/plannerRoutes')
app.use('/api', authRoutes)
app.use('/api', profileRoutes)
app.use('/api', homeRoutes)
app.use('/api', plannerRoutes)

// ============================================
// Yousra — Subsystem 6 Routes (admin: handbook, timetable, course/section)
// Mounted under /api/admin so paths like /handbook, /courses and /sections
// don't collide with the student-facing routes above (courseRoutes already
// defines GET /handbook and /courses/*).
// ============================================
const handbookRoutes = require('./routes/handbookRoutes')
const timetableRoutes = require('./routes/timetableRoutes')
const courseSectionRoutes = require('./routes/courseSectionRoutes')
app.use('/api/admin', handbookRoutes)
app.use('/api/admin', timetableRoutes)
app.use('/api/admin', courseSectionRoutes)

// ============================================
// Zimly — Subsystem 4 Routes (registration simulation / draft vault)
// ============================================
const registrationRoutes = require('./routes/registrationRoutes')
app.use('/api', registrationRoutes)

// In production (Railway), one service hosts everything: the API under /api,
// and the pre-built React app for every other route. Local dev is untouched —
// teammates keep running the CRA dev server on :3000 against this on :5000.
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../frontend/build')
    app.use(express.static(frontendBuildPath))
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('CourseBuddy backend is running')
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
