const db = require('../config/db')

// UC001 - Get all available intakes
exports.getIntakeList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM intake'
        db.query(sql, (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// UC001 - Get semesters belonging to a specific intake
exports.getSemesterByIntake = (intakeID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM semester WHERE intakeID = ?'
        db.query(sql, [intakeID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// UC001 - Check if handbook exists for the selected intake + semester
exports.getHandbookByIntakeSemester = (intakeID, semesterID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM handbook WHERE intakeID = ? AND semesterID = ?'
        db.query(sql, [intakeID, semesterID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}
