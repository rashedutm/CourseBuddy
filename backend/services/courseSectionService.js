// Course Section Service - Business logic for course and section management

const db = require('../config/db');

// Get all courses with optional filters
exports.getCourses = (filters = {}) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                c.courseCode,
                c.courseName,
                c.creditHours,
                c.hasPrerequisite,
                c.ownerFacultyID,
                a.facultyName
            FROM course c
            LEFT JOIN admins a ON c.ownerFacultyID = a.facultyID
            WHERE 1=1
        `;
        
        const params = [];

        if (filters.facultyID) {
            query += ' AND c.ownerFacultyID = ?';
            params.push(filters.facultyID);
        }

        if (filters.searchTerm) {
            query += ' AND (c.courseCode LIKE ? OR c.courseName LIKE ?)';
            params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
        }

        query += ' ORDER BY c.courseCode';

        db.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get course details by course code
exports.getCourseByCode = (courseCode) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.courseCode,
                c.courseName,
                c.creditHours,
                c.hasPrerequisite,
                c.ownerFacultyID,
                a.facultyName
            FROM course c
            LEFT JOIN admins a ON c.ownerFacultyID = a.facultyID
            WHERE c.courseCode = ?
        `;

        db.query(query, [courseCode], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0] || null);
        });
    });
};

// Get sections for a specific course
exports.getSectionsByCourse = (courseCode, semesterNumber, intakeMonth, academicYear) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                sectionID,
                courseCode,
                sectionNumber,
                lecturerID,
                lecturerName,
                day,
                timeStart,
                timeEnd,
                timeSlot,
                venue,
                semesterNumber,
                intakeMonth,
                academicYear
            FROM section
            WHERE courseCode = ? 
              AND semesterNumber = ? 
              AND intakeMonth = ? 
              AND academicYear = ?
            ORDER BY day, timeStart
        `;

        db.query(query, [courseCode, semesterNumber, intakeMonth, academicYear], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get all sections with filters
exports.getSections = (filters = {}) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                s.sectionID,
                s.courseCode,
                c.courseName,
                s.sectionNumber,
                s.lecturerID,
                s.lecturerName,
                s.day,
                s.timeStart,
                s.timeEnd,
                s.timeSlot,
                s.venue,
                s.semesterNumber,
                s.intakeMonth,
                s.academicYear,
                s.facultyID
            FROM section s
            JOIN course c ON s.courseCode = c.courseCode
            WHERE 1=1
        `;
        
        const params = [];

        if (filters.facultyID) {
            query += ' AND s.facultyID = ?';
            params.push(filters.facultyID);
        }

        if (filters.semesterNumber) {
            query += ' AND s.semesterNumber = ?';
            params.push(filters.semesterNumber);
        }

        if (filters.intakeMonth) {
            query += ' AND s.intakeMonth = ?';
            params.push(filters.intakeMonth);
        }

        if (filters.academicYear) {
            query += ' AND s.academicYear = ?';
            params.push(filters.academicYear);
        }

        if (filters.courseCode) {
            query += ' AND s.courseCode = ?';
            params.push(filters.courseCode);
        }

        query += ' ORDER BY s.academicYear DESC, s.semesterNumber, s.courseCode, s.sectionNumber';

        db.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Update course information
exports.updateCourse = (courseCode, updateData) => {
    return new Promise((resolve, reject) => {
        const allowedFields = ['courseName', 'creditHours', 'hasPrerequisite'];
        const updates = [];
        const params = [];

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(updateData[field]);
            }
        });

        if (updates.length === 0) {
            return resolve({ updated: false, message: 'No valid fields to update' });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        params.push(courseCode);

        const query = `UPDATE course SET ${updates.join(', ')} WHERE courseCode = ?`;

        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                updated: result.affectedRows > 0,
                message: result.affectedRows > 0 ? 'Course updated successfully' : 'No changes made',
                affectedRows: result.affectedRows
            });
        });
    });
};

// Update section information
exports.updateSection = (sectionID, updateData) => {
    return new Promise((resolve, reject) => {
        const allowedFields = ['sectionNumber', 'lecturerID', 'lecturerName', 'day', 'timeStart', 'timeEnd', 'timeSlot', 'venue'];
        const updates = [];
        const params = [];

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(updateData[field]);
            }
        });

        if (updates.length === 0) {
            return resolve({ updated: false, message: 'No valid fields to update' });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        params.push(sectionID);

        const query = `UPDATE section SET ${updates.join(', ')} WHERE sectionID = ?`;

        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                updated: result.affectedRows > 0,
                message: result.affectedRows > 0 ? 'Section updated successfully' : 'No changes made',
                affectedRows: result.affectedRows
            });
        });
    });
};

// Delete a course
exports.deleteCourse = (courseCode) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM course WHERE courseCode = ?`;

        db.query(query, [courseCode], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                deleted: result.affectedRows > 0,
                message: result.affectedRows > 0 ? 'Course deleted successfully' : 'Course not found',
                affectedRows: result.affectedRows
            });
        });
    });
};

// Delete a section
exports.deleteSection = (sectionID) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM section WHERE sectionID = ?`;

        db.query(query, [sectionID], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                deleted: result.affectedRows > 0,
                message: result.affectedRows > 0 ? 'Section deleted successfully' : 'Section not found',
                affectedRows: result.affectedRows
            });
        });
    });
};

// Create a new course
exports.createCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        const { courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite } = courseData;

        if (!courseCode || !courseName || !creditHours || !ownerFacultyID) {
            return reject(new Error('Missing required fields: courseCode, courseName, creditHours, ownerFacultyID'));
        }

        const query = `
            INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite)
            VALUES (?, ?, ?, ?, ?)
        `;

        const hasPrereq = hasPrerequisite || false;

        db.query(query, [courseCode, courseName, creditHours, ownerFacultyID, hasPrereq], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                created: true,
                courseCode,
                message: 'Course created successfully'
            });
        });
    });
};

// Create a new section
exports.createSection = (sectionData) => {
    return new Promise((resolve, reject) => {
        const {
            sectionID,
            courseCode,
            sectionNumber,
            lecturerID,
            lecturerName,
            day,
            timeStart,
            timeEnd,
            timeSlot,
            venue,
            facultyID,
            semesterNumber,
            intakeMonth,
            academicYear
        } = sectionData;

        if (!sectionID || !courseCode || !sectionNumber || !day || !timeStart || !timeEnd || !facultyID || !semesterNumber || !intakeMonth || !academicYear) {
            return reject(new Error('Missing required fields for section creation'));
        }

        const query = `
            INSERT INTO section 
            (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [
            sectionID,
            courseCode,
            sectionNumber,
            lecturerID || null,
            lecturerName || null,
            day,
            timeStart,
            timeEnd,
            timeSlot || null,
            venue || null,
            facultyID,
            semesterNumber,
            intakeMonth,
            academicYear
        ], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                created: true,
                sectionID,
                message: 'Section created successfully'
            });
        });
    });
};