// Timetable Service - Business logic for timetable operations

const db = require('../config/db');

// Get timetable data by filters
exports.getTimetableData = (semesterNumber, intakeMonth, academicYear, facultyID) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                s.sectionID,
                s.courseCode,
                c.courseName,
                c.creditHours,
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
                s.academicYear
            FROM section s
            JOIN course c ON s.courseCode = c.courseCode
            WHERE s.semesterNumber = ? 
              AND s.intakeMonth = ? 
              AND s.academicYear = ?
              AND s.facultyID = ?
            ORDER BY s.day, s.timeStart, s.courseCode
        `;

        db.query(query, [semesterNumber, intakeMonth, academicYear, facultyID], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get available semesters for dropdown
exports.getAvailableSemesters = (facultyID) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT DISTINCT semesterNumber, intakeMonth, academicYear
            FROM section
            WHERE facultyID = ?
            ORDER BY academicYear DESC, semesterNumber
        `;

        db.query(query, [facultyID], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Delete timetable data for a specific semester
exports.deleteTimetable = (semesterNumber, intakeMonth, academicYear, facultyID) => {
    return new Promise((resolve, reject) => {
        const deleteQuery = `
            DELETE FROM section
            WHERE semesterNumber = ? 
              AND intakeMonth = ? 
              AND academicYear = ?
              AND facultyID = ?
        `;

        db.query(deleteQuery, [semesterNumber, intakeMonth, academicYear, facultyID], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({
                deleted: true,
                message: 'Timetable deleted successfully',
                affectedRows: result.affectedRows
            });
        });
    });
};

const XLSX = require('xlsx');

// Upload timetable from Excel file
exports.uploadTimetable = (semesterNumber, intakeMonth, academicYear, facultyID, fileName, uploadedBy, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            // Parse the Excel file
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            if (!rows || rows.length === 0) {
                return reject(new Error('Excel file is empty or has no data rows'));
            }

            // Determine column mapping (handle different header formats)
            const headers = Object.keys(rows[0]);
            const colMap = {};
            
            // Map common header variations to our field names
            headers.forEach(header => {
                const h = header.toString().toLowerCase().trim();
                if (h.includes('code') || h.includes('course')) colMap.courseCode = header;
                else if (h.includes('section') || h.includes('sec')) colMap.sectionNumber = header;
                else if (h.includes('lecturer') || h.includes('lec')) colMap.lecturerName = header;
                else if (h.includes('day')) colMap.day = header;
                else if (h.includes('start') || h.includes('from') || h.includes('begin')) colMap.timeStart = header;
                else if (h.includes('end') || h.includes('to') || h.includes('until')) colMap.timeEnd = header;
                else if (h.includes('time') || h.includes('slot')) colMap.timeSlot = header;
                else if (h.includes('venue') || h.includes('room') || h.includes('location') || h.includes('class')) colMap.venue = header;
            });

            if (!colMap.courseCode || !colMap.sectionNumber || !colMap.day || !colMap.timeStart || !colMap.timeEnd) {
                return reject(new Error('Excel file missing required columns. Need: Course Code, Section, Day, Time Start, Time End'));
            }

            // Create upload log first
            const uploadLogID = `TUL${Date.now()}`;
            const logQuery = `
                INSERT INTO timetable_upload_log 
                (uploadLogID, facultyID, semesterNumber, intakeMonth, academicYear, uploadedBy, fileName, totalSectionsUploaded, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(logQuery, [uploadLogID, facultyID, semesterNumber, intakeMonth, academicYear, uploadedBy, fileName, rows.length, 'success'], (err) => {
                if (err) {
                    return reject(err);
                }

                // Insert each row as a section
                let insertedCount = 0;
                let errorCount = 0;
                let completed = 0;

                rows.forEach((row, index) => {
                    const sectionID = `SEC${Date.now()}${Math.random().toString(36).substr(2, 5)}${index}`;
                    const courseCode = String(row[colMap.courseCode]).trim();
                    const sectionNumber = String(row[colMap.sectionNumber]).trim();
                    const lecturerName = colMap.lecturerName ? String(row[colMap.lecturerName] || '').trim() : null;
                    const day = String(row[colMap.day]).trim();
                    const timeStart = formatTime(row[colMap.timeStart]);
                    const timeEnd = formatTime(row[colMap.timeEnd]);
                    const timeSlotVal = colMap.timeSlot ? String(row[colMap.timeSlot] || '').trim() : null;
                    const venue = colMap.venue ? String(row[colMap.venue] || '').trim() : null;

                    // Validate day
                    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    let dayAbbr = day.substring(0, 3);
                    // Capitalize first letter only
                    dayAbbr = dayAbbr.charAt(0).toUpperCase() + dayAbbr.slice(1).toLowerCase();
                    if (!validDays.includes(dayAbbr)) {
                        dayAbbr = dayAbbr === 'Mon' ? 'Mon' : 
                                  dayAbbr === 'Tue' ? 'Tue' : 
                                  dayAbbr === 'Wed' ? 'Wed' : 
                                  dayAbbr === 'Thu' ? 'Thu' : 
                                  dayAbbr === 'Fri' ? 'Fri' : 
                                  dayAbbr === 'Sat' ? 'Sat' : 'Mon';
                    }

                    const insertQuery = `
                        INSERT INTO section 
                        (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    db.query(insertQuery, [
                        sectionID,
                        courseCode,
                        sectionNumber,
                        null,
                        lecturerName || null,
                        dayAbbr,
                        timeStart,
                        timeEnd,
                        timeSlotVal,
                        venue,
                        facultyID,
                        parseInt(semesterNumber),
                        intakeMonth,
                        academicYear
                    ], (err) => {
                        completed++;
                        if (err) {
                            errorCount++;
                        } else {
                            insertedCount++;
                        }

                        // When all rows are processed
                        if (completed === rows.length) {
                            const status = errorCount === 0 ? 'success' : 
                                          insertedCount > 0 ? 'partial' : 'failed';
                            
                            // Update the upload log with actual counts
                            const updateLog = `
                                UPDATE timetable_upload_log 
                                SET totalSectionsUploaded = ?, status = ?
                                WHERE uploadLogID = ?
                            `;
                            db.query(updateLog, [insertedCount, status, uploadLogID], () => {
                                resolve({
                                    success: insertedCount > 0,
                                    uploadLogID,
                                    message: `Timetable uploaded: ${insertedCount} sections inserted, ${errorCount} errors`,
                                    totalSections: insertedCount,
                                    errors: errorCount
                                });
                            });
                        }
                    });
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

// Helper: Format time string to HH:mm:ss
function formatTime(value) {
    if (!value) return '00:00:00';
    
    // If it's a serial number (Excel date/time)
    if (typeof value === 'number') {
        const totalSeconds = Math.round(value * 86400);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // If it's a string like "14:00" or "2pm-5pm" or "14:00:00"
    let str = String(value).trim();
    
    // Handle "2pm-5pm" format - take the start time
    if (str.includes('-')) {
        str = str.split('-')[0].trim();
    }
    
    // Handle am/pm format
    if (str.toLowerCase().includes('am') || str.toLowerCase().includes('pm')) {
        const match = str.toLowerCase().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
        if (match) {
            let hours = parseInt(match[1]);
            const minutes = match[2] ? parseInt(match[2]) : 0;
            const period = match[3];
            if (period === 'pm' && hours !== 12) hours += 12;
            if (period === 'am' && hours === 12) hours = 0;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        }
    }
    
    // Handle "14:00" or "14:00:00" format
    const timeMatch = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
        const hours = String(timeMatch[1]).padStart(2, '0');
        const minutes = String(timeMatch[2]).padStart(2, '0');
        const seconds = timeMatch[3] ? String(timeMatch[3]).padStart(2, '0') : '00';
        return `${hours}:${minutes}:${seconds}`;
    }
    
    return '00:00:00';
}

// Get sections for a specific course
exports.getSectionsByCourse = (courseCode, semesterNumber, intakeMonth, academicYear) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                sectionID,
                sectionNumber,
                lecturerID,
                lecturerName,
                day,
                timeStart,
                timeEnd,
                timeSlot,
                venue
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