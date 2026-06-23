const express = require('express')
require('dotenv').config()
const cors = require('cors')
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
// Tarin — Subsystem 5 Routes (add when ready)
// ============================================
// const authRoutes = require('./routes/authRoutes')
// app.use('/api', authRoutes)

// ============================================
// Yousra — Subsystem 6 Routes (add when ready)
// ============================================
// const adminRoutes = require('./routes/adminRoutes')
// app.use('/api', adminRoutes)

// ============================================
// Zimly — Subsystem 4 Routes (add when ready)
// ============================================
// const registrationRoutes = require('./routes/registrationRoutes')
// app.use('/api', registrationRoutes)

app.get('/', (req, res) => {
    res.send('CourseBuddy backend is running')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
