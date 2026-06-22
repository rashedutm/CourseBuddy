import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadTimetable } from "../../services/timetableService";
import "./admin.css";
import "./admin.css";
// UC034: Upload Timetable
// Lets an admin upload timetable Excel file for a specific semester

function UploadTimetable() {
    const navigate = useNavigate();
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [facultyID, setFacultyID] = useState("FC");
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setStatusMessage("");
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setStatusMessage("Please choose an Excel file before uploading.");
            return;
        }

        setLoading(true);
        setStatusMessage("");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("semesterNumber", semesterNumber);
            formData.append("intakeMonth", intakeMonth);
            formData.append("academicYear", academicYear);
            formData.append("facultyID", facultyID);
            formData.append("uploadedBy", "admin");

            const result = await uploadTimetable(formData);
            setStatusMessage(
                `${selectedFile.name} uploaded successfully for Semester ${semesterNumber}, ${intakeMonth} ${academicYear}.`
            );
            setSelectedFile(null);
        } catch (error) {
            setStatusMessage(error.message || "Failed to upload timetable. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Timetable Management</p>
                <h1 style={styles.title}>Upload Timetable</h1>
                <p style={styles.subtitle}>
                    Upload the semester timetable in Excel format. Select the correct
                    semester, intake, and academic year before uploading.
                </p>

                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Semester Number</label>
                        <select
                            style={styles.select}
                            value={semesterNumber}
                            onChange={(e) => setSemesterNumber(e.target.value)}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <option key={num} value={num}>
                                    Semester {num}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Intake Month</label>
                        <select
                            style={styles.select}
                            value={intakeMonth}
                            onChange={(e) => setIntakeMonth(e.target.value)}
                        >
                            <option value="October">October</option>
                            <option value="March">March</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Academic Year</label>
                        <select
                            style={styles.select}
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                        >
                            <option value="2024/2025">2024/2025</option>
                            <option value="2025/2026">2025/2026</option>
                            <option value="2026/2027">2026/2027</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Faculty</label>
                        <select
                            style={styles.select}
                            value={facultyID}
                            onChange={(e) => setFacultyID(e.target.value)}
                        >
                            <option value="FC">Faculty of Computing (FC)</option>
                        </select>
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Timetable File (.xlsx)</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        style={styles.fileInput}
                    />
                    {selectedFile && (
                        <p style={styles.fileName}>Selected: {selectedFile.name}</p>
                    )}
                </div>

                <button
                    style={{
                        ...styles.button,
                        opacity: loading || !selectedFile ? 0.5 : 1
                    }}
                    onClick={handleUpload}
                    disabled={loading || !selectedFile}
                >
                    {loading ? "Uploading..." : "Upload Timetable"}
                </button>

                {statusMessage && (
                    <p className="admin-status success">{statusMessage}</p>
                )}

                {/* Navigation buttons */}
                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>Related Actions:</p>
                    <div style={{display: 'flex', gap: '12px'}}>
                        <button 
                            className="admin-btn-outline"
                            style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer'}}
                            onClick={() => navigate('/admin/timetable/view')}
                        >
                            View Timetable Data
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


export default UploadTimetable;