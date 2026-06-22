import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTimetableData, getAvailableSemesters } from "../../services/timetableService";
import "./admin.css";
import "./admin.css";

// UC035: View Timetable Data
// Shows timetable sections for a selected semester

function ViewTimetableData() {
    const navigate = useNavigate();
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [facultyID, setFacultyID] = useState("FC");
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [timetableData, setTimetableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load available semesters on component mount
    useEffect(() => {
        loadAvailableSemesters();
    }, []);

    // Load timetable data when filters change
    useEffect(() => {
        if (semesterNumber && intakeMonth && academicYear && facultyID) {
            loadTimetableData();
        }
    }, [semesterNumber, intakeMonth, academicYear, facultyID]);

    const loadAvailableSemesters = async () => {
        try {
            const semesters = await getAvailableSemesters(facultyID);
            setAvailableSemesters(semesters);
        } catch (err) {
            console.error("Error loading semesters:", err);
        }
    };

    const loadTimetableData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getTimetableData(semesterNumber, intakeMonth, academicYear, facultyID);
            setTimetableData(data);
        } catch (err) {
            console.error("Error loading timetable data:", err);
            setError(err.message || "Failed to load timetable data");
            setTimetableData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSemesterChange = (e) => {
        const value = e.target.value;
        const [sem, month, year] = value.split("|");
        setSemesterNumber(sem);
        setIntakeMonth(month);
        setAcademicYear(year);
    };

    // Group sections by day
    const groupedByDay = timetableData.reduce((acc, section) => {
        if (!acc[section.day]) {
            acc[section.day] = [];
        }
        acc[section.day].push(section);
        return acc;
    }, {});

    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Timetable Management</p>
                <h1 style={styles.title}>View Timetable Data</h1>
                <p style={styles.subtitle}>
                    Browse the timetable sections for a selected semester.
                </p>

                <div style={styles.filtersContainer}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Semester</label>
                        <select
                            style={styles.select}
                            value={`${semesterNumber}|${intakeMonth}|${academicYear}`}
                            onChange={handleSemesterChange}
                        >
                            {availableSemesters.map((sem) => (
                                <option
                                    key={`${sem.semesterNumber}|${sem.intakeMonth}|${sem.academicYear}`}
                                    value={`${sem.semesterNumber}|${sem.intakeMonth}|${sem.academicYear}`}
                                >
                                    Semester {sem.semesterNumber} - {sem.intakeMonth} {sem.academicYear}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && (
                    <div style={styles.loadingContainer}>
                        <p style={styles.loadingText}>Loading timetable data...</p>
                    </div>
                )}

                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorText}>{error}</p>
                    </div>
                )}

                {!loading && !error && timetableData.length === 0 && (
                    <div style={styles.emptyContainer}>
                        <p style={styles.emptyText}>
                            No timetable data found for the selected semester.
                        </p>
                    </div>
                )}

                {!loading && !error && timetableData.length > 0 && (
                    <>
                        {daysOrder.map((day) => {
                            const daySections = groupedByDay[day];
                            if (!daySections || daySections.length === 0) return null;

                            return (
                                <div key={day} style={styles.daySection}>
                                    <h3 style={styles.dayTitle}>{day}</h3>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Time</th>
                                                <th style={styles.th}>Course Code</th>
                                                <th style={styles.th}>Course Name</th>
                                                <th style={styles.th}>Section</th>
                                                <th style={styles.th}>Lecturer</th>
                                                <th style={styles.th}>Venue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {daySections.map((section, index) => (
                                                <tr
                                                    key={section.sectionID}
                                                    style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                                                >
                                                    <td style={styles.td}>
                                                        {section.timeStart} - {section.timeEnd}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <strong>{section.courseCode}</strong>
                                                    </td>
                                                    <td style={styles.td}>{section.courseName}</td>
                                                    <td style={styles.td}>{section.sectionNumber}</td>
                                                    <td style={styles.td}>{section.lecturerName || "TBA"}</td>
                                                    <td style={styles.td}>{section.venue || "TBA"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}

                        <p style={styles.footnote}>
                            Showing {timetableData.length} sections for Semester {semesterNumber}, {intakeMonth} {academicYear}
                        </p>
                    </>
                )}

                {/* Navigation buttons */}
                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb'}}>
                  <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>Related Actions:</p>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer'}}
                      onClick={() => navigate('/admin/timetable/upload')}
                    >
                      Upload Timetable
                    </button>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer'}}
                      onClick={() => navigate('/admin/timetable/delete')}
                    >
                      Delete Timetable
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}


export default ViewTimetableData;