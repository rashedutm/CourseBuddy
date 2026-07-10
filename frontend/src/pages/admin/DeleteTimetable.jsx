import React, { useState, useEffect } from "react";
import { deleteTimetable, getAvailableSemesters } from "../../services/timetableService";
import "./admin.css";

// UC036: Delete Timetable
// Allows admin to delete timetable data for a specific semester

function DeleteTimetable() {
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [facultyID] = useState("FC");
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        loadAvailableSemesters();
    }, []);

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

    const handleSemesterChange = (e) => {
        const value = e.target.value;
        const [sem, month, year] = value.split("|");
        setSemesterNumber(sem);
        setIntakeMonth(month);
        setAcademicYear(year);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the timetable for Semester ${semesterNumber}, ${intakeMonth} ${academicYear}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        setLoading(true);
        setMessage("");

        try {
            const result = await deleteTimetable(semesterNumber, intakeMonth, academicYear, facultyID);
            setMessage(result.message || "Timetable deleted successfully");
            setMessageType("success");
        } catch (error) {
            setMessage(error.message || "Failed to delete timetable");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Timetable Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>Delete Timetable</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Permanently remove timetable data for a selected semester. This action cannot be undone.
                </p>

                <div className="admin-warning">
                    <p>⚠️ Warning: This will permanently delete all section data for the selected semester.</p>
                </div>

                <div className="admin-form-group" style={{marginBottom: '24px'}}>
                    <label>Select Semester</label>
                    <select
                        value={`${semesterNumber}|${intakeMonth}|${academicYear}`}
                        onChange={handleSemesterChange}
                        style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
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

                {message && (
                    <div className={`admin-status ${messageType === "success" ? 'success' : 'error'}`}>
                        <p>{message}</p>
                    </div>
                )}

                <button
                    className="admin-btn-danger"
                    style={{opacity: loading || !semesterNumber ? 0.5 : 1}}
                    onClick={handleDelete}
                    disabled={loading || !semesterNumber}
                >
                    {loading ? "Deleting..." : "Delete Timetable"}
                </button>
            </div>
        </div>
    );
}

export default DeleteTimetable;