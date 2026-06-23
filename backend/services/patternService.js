const db = require('../config/db')
const { generateClashFreePatterns } = require('./clashDetectionService')

// ============================================
// Helper — Get current running academic year
// Returns the most recent academicYear in section table
// Used for free elective and foreign language courses
// ============================================
exports.getCurrentAcademicYear = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT academicYear 
            FROM section 
            ORDER BY academicYear DESC 
            LIMIT 1
        `
        db.query(sql, (err, results) => {
            if (err) return reject(err)
            resolve(results[0]?.academicYear)
        })
    })
}

// ============================================
// UC005 — Get all sections for selected courses
// Uses BOTH student's academic year AND current
// running academic year — covers regular courses
// AND free elective / foreign language courses
// ============================================
exports.getSectionsByCourses = async (courseCodes, semesterNumber, intakeMonth, academicYear) => {
    const currentAcademicYear = await exports.getCurrentAcademicYear()

    return new Promise((resolve, reject) => {
        const placeholders = courseCodes.map(() => '?').join(',')
        const sql = `
            SELECT
                s.sectionID,
                s.courseCode,
                s.sectionNumber,
                s.lecturerID,
                s.lecturerName,
                s.day,
                s.timeStart,
                s.timeEnd,
                s.venue,
                c.courseName,
                c.creditHours
            FROM section s
            JOIN course c ON s.courseCode = c.courseCode
            WHERE s.courseCode IN (${placeholders})
            AND s.semesterNumber = ?
            AND s.intakeMonth = ?
            AND s.academicYear IN (?, ?)
            ORDER BY s.courseCode, s.sectionNumber
        `
        db.query(sql, [...courseCodes, semesterNumber, intakeMonth, academicYear, currentAcademicYear], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC005 — Get student's selected courses
// ============================================
exports.getSelectedCourses = (studentID, semesterID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                sc.selectionID,
                sc.courseCode,
                sc.selectionDate,
                c.courseName,
                c.creditHours,
                c.hasPrerequisite
            FROM selected_course sc
            JOIN course c ON sc.courseCode = c.courseCode
            WHERE sc.studentID = ? AND sc.semesterID = ?
        `
        db.query(sql, [studentID, semesterID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

// ============================================
// UC005 — Get student info for intakeMonth
// ============================================
exports.getStudentInfo = (studentID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                s.studentID,
                s.name,
                s.programmeID,
                s.intakeID,
                s.userID,
                u.utmEmail,
                p.programmeName,
                p.facultyID,
                a.facultyName,
                i.intakeMonth,
                i.intakeYear,
                i.academicSession,
                i.intakeNumber
            FROM student s
            JOIN users u ON s.userID = u.userID
            JOIN programme p ON s.programmeID = p.programmeID
            JOIN admins a ON p.facultyID = a.facultyID
            JOIN intake i ON s.intakeID = i.intakeID
            WHERE s.studentID = ?
        `
        db.query(sql, [studentID], (err, results) => {
            if (err) return reject(err)
            resolve(results[0])
        })
    })
}

// ============================================
// UC005 — Get semester info by semesterID
// ============================================
exports.getSemesterByID = (semesterID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM semester WHERE semesterID = ?
        `
        db.query(sql, [semesterID], (err, results) => {
            if (err) return reject(err)
            resolve(results[0])
        })
    })
}

// ============================================
// UC005 — Run clash detection and return patterns
// Groups sections by course then calls algorithm
// ============================================
exports.generatePatterns = async (studentID, semesterID, academicYear) => {
    const selectedCourses = await exports.getSelectedCourses(studentID, semesterID)
    if (selectedCourses.length === 0) {
        throw new Error('NO_COURSES_SELECTED')
    }

    const studentInfo = await exports.getStudentInfo(studentID)
    if (!studentInfo) {
        throw new Error('STUDENT_NOT_FOUND')
    }

    const semesterInfo = await exports.getSemesterByID(semesterID)
    if (!semesterInfo) {
        throw new Error('SEMESTER_NOT_FOUND')
    }

    const courseCodes = selectedCourses.map(c => c.courseCode)
    const sections = await exports.getSectionsByCourses(
        courseCodes,
        semesterInfo.semesterNumber,
        studentInfo.intakeMonth,
        academicYear
    )

    if (sections.length === 0) {
        throw new Error('NO_TIMETABLE_DATA')
    }

    // Group sections by course
    const sectionsByCourse = {}
    sections.forEach(section => {
        if (!sectionsByCourse[section.courseCode]) {
            sectionsByCourse[section.courseCode] = []
        }
        sectionsByCourse[section.courseCode].push(section)
    })

    // Check all selected courses have sections
    // If any course has no sections, throw error
    const missingCourses = courseCodes.filter(code => !sectionsByCourse[code])
    if (missingCourses.length > 0) {
        throw new Error(`NO_TIMETABLE_DATA`)
    }

    // Run clash detection
    const patterns = generateClashFreePatterns(sectionsByCourse)
    return { patterns, studentInfo, semesterInfo }
}

// ============================================
// UC007 — Save selected pattern to DB
// Saves pattern header and all section details
// Deactivates previous active pattern first
// ============================================
exports.savePattern = (studentID, semesterID, sections) => {
    return new Promise((resolve, reject) => {
        const deactivateSql = `
            UPDATE registration_history
            SET isActive = FALSE
            WHERE studentID = ? AND isActive = TRUE
        `
        db.query(deactivateSql, [studentID], (err) => {
            if (err) return reject(err)

            const patternID = `PAT-${Date.now()}`
            const generatedDate = new Date().toISOString().split('T')[0]
            const totalCourses = sections.length
            const totalCreditHours = sections.reduce((sum, s) => sum + (s.creditHours || 0), 0)

            const patternSql = `
                INSERT INTO pattern
                (patternID, studentID, semesterID, totalCourses, totalCreditHours, generatedDate, isSelected)
                VALUES (?, ?, ?, ?, ?, ?, TRUE)
            `
            db.query(patternSql, [patternID, studentID, semesterID, totalCourses, totalCreditHours, generatedDate], (err) => {
                if (err) return reject(err)

                const detailValues = sections.map((s, i) => [
                    `PD-${Date.now()}-${i}`,
                    patternID,
                    s.courseCode,
                    s.sectionID
                ])

                const detailSql = `
                    INSERT INTO pattern_detail
                    (patternDetailID, patternID, courseCode, sectionID)
                    VALUES ?
                `
                db.query(detailSql, [detailValues], (err) => {
                    if (err) return reject(err)

                    const historyID = `HIS-${Date.now()}`
                    const selectedDate = generatedDate
                    const historySql = `
                        INSERT INTO registration_history
                        (historyID, studentID, patternID, selectedDate, isActive)
                        VALUES (?, ?, ?, ?, TRUE)
                    `
                    db.query(historySql, [historyID, studentID, patternID, selectedDate], (err, result) => {
                        if (err) return reject(err)
                        resolve({ patternID, historyID })
                    })
                })
            })
        })
    })
}

// ============================================
// UC007 — Get student's currently active pattern
// ============================================
exports.getActivePattern = (studentID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                p.patternID,
                p.totalCourses,
                p.totalCreditHours,
                p.generatedDate,
                pd.courseCode,
                pd.sectionID,
                s.sectionNumber,
                s.lecturerName,
                s.day,
                s.timeStart,
                s.timeEnd,
                s.venue,
                c.courseName,
                c.creditHours
            FROM registration_history rh
            JOIN pattern p ON rh.patternID = p.patternID
            JOIN pattern_detail pd ON p.patternID = pd.patternID
            JOIN section s ON pd.sectionID = s.sectionID
            JOIN course c ON pd.courseCode = c.courseCode
            WHERE rh.studentID = ? AND rh.isActive = TRUE
            ORDER BY pd.courseCode
        `
        db.query(sql, [studentID], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}