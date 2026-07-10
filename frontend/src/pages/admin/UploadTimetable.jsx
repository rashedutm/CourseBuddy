import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadTimetable } from "../../services/timetableService";
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
        const [statusType, setStatusType] = useState("");
        const [loading, setLoading] = useState(false);
        const [uploadSuccess, setUploadSuccess] = useState(false);
    
        const handleFileChange = (event) => {
            const file = event.target.files[0];
            setSelectedFile(file);
            setStatusMessage("");
            setStatusType("");
            setUploadSuccess(false);
        };
    
        const handleUpload = async () => {
            if (!selectedFile) {
                setStatusMessage("Please choose an Excel file before uploading.");
                setStatusType("error");
                return;
            }
    
            setLoading(true);
            setStatusMessage("");
            setStatusType("");
    
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
                    `${selectedFile.name} uploaded successfully for Semester ${semesterNumber}, ${intakeMonth} ${academicYear}. ${result.data ? result.data.totalSections + ' sections inserted.' : ''}`
                );
                setStatusType("success");
                setUploadSuccess(true);
                setSelectedFile(null);
            } catch (error) {
                setStatusMessage(error.message || "Failed to upload timetable. Please try again.");
                setStatusType("error");
            } finally {
                setLoading(false);
            }
        };
    
        const handleViewTimetable = () => {
            navigate(`/admin/timetable/view?semesterNumber=${semesterNumber}&intakeMonth=${intakeMonth}&academicYear=${academicYear}&facultyID=${facultyID}`);
        };
    
        return (
            <div className="admin-page">
                <div className="admin-card">
                    <p className="admin-badge">Timetable Management</p>
                    <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>Upload Timetable</h1>
                    <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                        Upload the semester timetable in Excel format. Select the correct
                        semester, intake, and academic year before uploading.
                    </p>
    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                        <div className="admin-form-group">
                            <label>Semester Number</label>
                            <select
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
    
                        <div className="admin-form-group">
                            <label>Intake Month</label>
                            <select
                                value={intakeMonth}
                                onChange={(e) => setIntakeMonth(e.target.value)}
                            >
                                <option value="October">October</option>
                                <option value="March">March</option>
                            </select>
                        </div>
    
                        <div className="admin-form-group">
                            <label>Academic Year</label>
                            <select
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                            >
                                <option value="2024/2025">2024/2025</option>
                                <option value="2025/2026">2025/2026</option>
                                <option value="2026/2027">2026/2027</option>
                            </select>
                        </div>
    
                        <div className="admin-form-group">
                            <label>Faculty</label>
                            <select
                                value={facultyID}
                                onChange={(e) => setFacultyID(e.target.value)}
                            >
                                <option value="FC">Faculty of Computing (FC)</option>
                            </select>
                        </div>
                    </div>
    
                    <div className="admin-form-group">
                        <label>Timetable File (.xlsx)</label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                        />
                        {selectedFile && (
                            <p style={{fontSize: '14px', color: '#6b7280', marginTop: '8px'}}>
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>
    
                    <button 
                        className="admin-btn"
                        style={{opacity: loading || !selectedFile ? 0.5 : 1}}
                        onClick={handleUpload}
                        disabled={loading || !selectedFile}
                    >
                        {loading ? "Uploading..." : "Upload Timetable"}
                    </button>
    
                    {statusMessage && (
                        <p className={`admin-status ${statusType === "error" ? "error" : "success"}`}>{statusMessage}</p>
                    )}
    
                    {/* Success actions: Navigate to View Timetable */}
                    {uploadSuccess && (
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: '#f0fdf4',
                            borderRadius: '12px',
                            border: '1px solid #bbf7d0',
                            textAlign: 'center'
                        }}>
                            <p style={{fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '12px'}}>
                                ✅ Timetable uploaded successfully!
                            </p>
                            <button
                                className="admin-btn"
                                onClick={handleViewTimetable}
                                style={{
                                    background: '#16a34a',
                                    color: '#fff',
                                    padding: '12px 24px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer'
                                }}
                            >
                                View Timetable → View the uploaded timetable data
                            </button>
                            <button
                                className="admin-btn"
                                onClick={() => {
                                    setUploadSuccess(false);
                                    setStatusMessage("");
                                    setStatusType("");
                                }}
                                style={{
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    padding: '12px 24px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    marginLeft: '12px'
                                }}
                            >
                                Upload Another File
                            </button>
                        </div>
                    )}
    
                    {/* Navigation link to View Timetable page */}
                    <div style={{marginTop: '24px', paddingTop: '20px', borderTop: '2px solid #e5e7eb'}}>
                        <p style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>📋 Quick Links:</p>
                        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                            <a href="/admin/timetable/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>
                                View Timetable Data
                            </a>
                            <a href="/admin/timetable/delete" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>
                                Delete Timetable
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    
    export default UploadTimetable;
    