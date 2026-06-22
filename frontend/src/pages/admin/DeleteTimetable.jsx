import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTimetable, getAvailableSemesters } from "../../services/timetableService";
import "./admin.css";
import "./admin.css";

// UC036: Delete Timetable
// Allows admin to delete timetable data for a specific semester

function DeleteTimetable() {
    const navigate = useNavigate();
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [facultyID, setFacultyID] = useState("FC");
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
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Timetable Management</p>
                <h1 style={styles.title}>Delete Timetable</h1>
                <p style={styles.subtitle}>
                    Permanently remove timetable data for a selected semester. This action
                    cannot be undone.
                </p>

                <div style={styles.warningBox}>
                    <p style={styles.warningText}>
                        ⚠️ Warning: This will permanently delete all section data for the
                        selected semester.
                    </p>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Select Semester</label>
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

                {message && (
                    <div
                        style={
                            messageType === "success" ? styles.successBox : styles.errorBox
                        }
                    >
                        <p
                            style={
                                messageType === "success"
                                    ? styles.successText
                                    : styles.errorText
                            }
                        >
                            {message}
                        </p>
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
                      onClick={() => navigate('/admin/timetable/view')}
                    >
                      View Timetable Data
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}


export default DeleteTimetable;