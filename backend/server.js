const express = require('express')
require('dotenv').config()
const cors = require('cors')
const db = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())

const courseRoutes = require('./routes/courseRoutes')
app.use('/api', courseRoutes)

app.get('/', (req, res) => {
    res.send('CourseBuddy backend is running')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})