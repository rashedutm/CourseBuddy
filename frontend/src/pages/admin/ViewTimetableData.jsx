import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTimetableData, getAvailableSemesters } from "../../services/timetableService";
import "./admin.css";

// UC035: View Timetable Data
// Shows timetable sections for a selected semester

function ViewTimetableData() {
    const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const [semesterNumber, setSemesterNumber] = useState(searchParams.get("semesterNumber") || "1");
        const [intakeMonth, setIntakeMonth] = useState(searchParams.get("intakeMonth") || "October");
        const [academicYear, setAcademicYear] = useState(searchParams.get("academicYear") || "2024/2025");
        const [facultyID, setFacultyID] = useState(searchParams.get("facultyID") || "FC");
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
                    // Set fallback semesters
                    setAvailableSemesters([
                        { semesterNumber: 1, intakeMonth: "October", academicYear: "2024/2025" },
                        { semesterNumber: 2, intakeMonth: "October", academicYear: "2024/2025" }
                    ]);
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
                    // Set empty data on error - page will show "no data" message
                    setTimetableData([]);
                    // Don't show error if it's just no data
                    if (!err.message.includes('No timetable data')) {
                        setError("No timetable data available for selected semester");
                    }
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
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Timetable Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>View Timetable Data</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Browse the timetable sections for a selected semester.
                </p>

                <div className="admin-form-group" style={{marginBottom: '24px'}}>
                    <label>Semester</label>
                    <select
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

                {loading && (
                    <div className="admin-loading">
                        <p>Loading timetable data...</p>
                    </div>
                )}

                {!loading && timetableData.length === 0 && (
                    <div className="admin-empty">
                        <p>No timetable data found for the selected semester.</p>
                    </div>
                )}

                {!loading && timetableData.length > 0 && (
                    <>
                        {daysOrder.map((day) => {
                            const daySections = groupedByDay[day];
                            if (!daySections || daySections.length === 0) return null;

                            return (
                                <div key={day} style={{marginBottom: '32px'}}>
                                    <h3 style={{fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '16px'}}>{day}</h3>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Course Code</th>
                                                <th>Course Name</th>
                                                <th>Section</th>
                                                <th>Lecturer</th>
                                                <th>Venue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {daySections.map((section, index) => (
                                                <tr key={section.sectionID} style={index % 2 === 0 ? {backgroundColor: '#fff'} : {backgroundColor: '#f9fafb'}}>
                                                    <td>{section.timeStart} - {section.timeEnd}</td>
                                                    <td><strong>{section.courseCode}</strong></td>
                                                    <td>{section.courseName}</td>
                                                    <td>{section.sectionNumber}</td>
                                                    <td>{section.lecturerName || "TBA"}</td>
                                                    <td>{section.venue || "TBA"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}

                        <p style={{fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '32px'}}>
                            Showing {timetableData.length} sections for Semester {semesterNumber}, {intakeMonth} {academicYear}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewTimetableData;
