import React, { useState } from "react";

// UC031: Upload Handbook
// Lets an admin pick an intake + upload an Excel
// handbook file.

function UploadHandbook() {
    const [programme, setProgramme] = useState("SCSEH"); // Fixed: SCSEH not SECSEH
    const [intake, setIntake] = useState("October");
    const [semesterNumber, setSemesterNumber] = useState("1");

    // Tracks the file selected by the admin from their computer
    const [selectedFile, setSelectedFile] = useState(null);

    // Holds the success or error message shown after upload
    const [statusMessage, setStatusMessage] = useState("");

    // Runs when the admin picks a file from their computer
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setStatusMessage(""); // Clear any previous status message when a new file is selected
    };

    // Runs when the admin clicks "Upload Handbook"
    const handleUpload = () => {
        if (!selectedFile) {
            setStatusMessage("Please choose an Excel file before uploading.");
            return;
        }

        // Since there is no proper backend yet, we simulate a successful upload
        // FIXED: Used backticks (`) instead of single quotes (') and fixed intakee → intake
        setStatusMessage(
            `${selectedFile.name} uploaded successfully for ${programme}, ${intake} intake, Semester ${semesterNumber}.`
        );
        setSelectedFile(null);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Handbook Management</p>
                <h1 style={styles.title}>Upload Handbook</h1>
                <p style={styles.subtitle}>
                    Upload the semester handbook in Excel format. Select the correct
                    programme, intake, and semester before uploading so the data is
                    stored accurately.
                </p>

                {/* Programme dropdown — maps to programmeID in handbook_slot */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Programme</label>
                    <select
                        style={styles.select}
                        value={programme}
                        onChange={(e) => setProgramme(e.target.value)}
                    >
                        <option value="SCSEH">Software Engineering</option>
                        <option value="SCSSEH">Computer Science</option>
                        <option value="SCSDEH">Data Engineering</option>
                        <option value="SCJAI">Artificial Intelligence</option>
                        <option value="SCSIS">Information Systems</option>
                    </select>
                </div>

                {/* Intake dropdown — maps to intakeID in handbook_slot */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Intake</label>
                    <select
                        style={styles.select}
                        value={intake}
                        onChange={(e) => setIntake(e.target.value)}
                    >
                        <option value="October">October Intake</option>
                        <option value="March">March Intake</option>
                    </select>
                </div>

                {/* Semester dropdown — maps to semesterNumber in handbook_slot */}
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

                {/* File picker — fileName saved in handbook_upload_log */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Handbook File (.xlsx)</label>
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

                <button style={styles.button} onClick={handleUpload}>
                    Upload Handbook
                </button>

                {/* Status message shown after upload attempt */}
                {statusMessage && (
                    <p style={styles.status}>{statusMessage}</p>
                )}
            </div>
        </div>
    );
}



export default UploadHandbook;