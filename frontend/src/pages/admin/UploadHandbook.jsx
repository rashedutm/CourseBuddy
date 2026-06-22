import React, { useState } from "react";

// UC031: Upload Handbook
// Lets an admin pick an intake + upload an Excel
// handbook file. 


function UploadHandbook() {
    const [programme, setProgramme] = useState("SECSEH");
    const [intake, setIntake] = useState("October");
    const [semesterNumber, setSemesterNumber] = useState("1");

    //Tracks the file selected by the admin from their computer
    const [selectedFile, setSelectedFile] = useState(null);

    //Holds the success or error message shown after upload
    const [statusMessage, setStatusMessage] = useState("");

    //Runs when the admin picks a file from their computer
    const handleFileChange = (event)
=> {
    const file = event.target.files[0];
    setSelectedFile(file);
    setStatusMessage(""); //Clear any previous status message when a new file is selected
};
//Runs when the admin clicks "Upload Handbook"
const handleUpload = ()
=> {
    if (!selectedFile) {
        setStatusMessage("Please choose an Excel file before uploading.");
        return;
    }

    // Since there is no proper backend yet, we simulate a successful upload
    setStatusMessage(
        '"{selectedFile.name}" uploaded successfully for ${programme}, ${intakee} intake, Semester ${semesterNumber}.'
    );
    setSelectedFile(null);
}; 


    return (
    <div style={styles.page}>
        <div style={styles.card}>
            <p style={styles.eyebrow}> Handbook Management</p>
            <h1 style={styles.title}>Upload Handbook</h1>
          <p style={styles.subtitle}> 
          Upload the semester handbook in Excel format. Select the correct
          programme, intake, and semester before uploading so the data is
          stored accurately. </p>


        </h1>

   {/* Programme dropdown — maps to programmeID in handbook_slot */}
   <div style={styles.formGroup}>
    <label style={styles.label}>Programme</label>
    <select
    style={styles.select}
    value={programme}
    onChange={(e) => setProgramme(e.target.value)}
    >
        <option value="SECSEH"> Software Engineering </option>
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


  
// Inline styles so that no separate CSS file needed
// Colour palette: red maroon + off-white + gray
// Consistent across all Handbook Management pages

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    padding: "48px 24px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "0.625rem",
    padding: "40px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  eyebrow: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#717182",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "#030213",
    lineHeight: "1.5",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#717182",
    lineHeight: "1.5",
    margin: "0 0 28px 0",
  },
  formGroup: {
    marginBottom: "22px",
  },
  label: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#030213",
    lineHeight: "1.5",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.5",
    borderRadius: "calc(0.625rem - 2px)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f3f3f5",
    color: "#030213",
  },
  fileInput: {
    width: "100%",
    fontSize: "1rem",
    fontWeight: "400",
    color: "#030213",
  },
  fileName: {
    fontSize: "14px",
    color: "#717182",
    margin: "8px 0 0 0",
  },
  button: {
    width: "100%",
    padding: "12px 0",
    backgroundColor: "#030213",
    color: "#ffffff",
    border: "none",
    borderRadius: "calc(0.625rem - 2px)",
    fontSize: "1rem",
    fontWeight: "500",
    lineHeight: "1.5",
    cursor: "pointer",
  },
  status: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#030213",
    backgroundColor: "#ececf0",
    padding: "12px 14px",
    borderRadius: "calc(0.625rem - 2px)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
};
export default UploadHandbook;

