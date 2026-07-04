import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadHandbook } from "../../services/handbookService";
import "./admin.css";

// UC031: Upload Handbook
// Lets an admin pick an intake + upload an Excel
// handbook file.

function UploadHandbook() {
  const navigate = useNavigate();
      const [programme, setProgramme] = useState("SCSEH");
      const [intake, setIntake] = useState("October");
      const [semesterNumber, setSemesterNumber] = useState("1");
  
      // Tracks the file selected by the admin from their computer
      const [selectedFile, setSelectedFile] = useState(null);
  
      // Holds the success or error message shown after upload
      const [statusMessage, setStatusMessage] = useState("");
      const [loading, setLoading] = useState(false);
      const [uploadSuccess, setUploadSuccess] = useState(false);
  
      // Runs when the admin picks a file from their computer
      const handleFileChange = (event) => {
          const file = event.target.files[0];
          setSelectedFile(file);
          setStatusMessage(""); // Clear any previous status message when a new file is selected
      };
  
      // Runs when the admin clicks "Upload Handbook"
      const handleUpload = async () => {
          if (!selectedFile) {
              setStatusMessage("Please choose an Excel file before uploading.");
              return;
          }
  
}
return (
  <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Handbook Management</p>
                <h1 className="admin-header" style={{marginBottom: '8px'}}>Upload Handbook</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Upload the semester handbook in Excel format. Select the correct
                    programme, intake, and semester before uploading so the data is
                    stored accurately.
                </p>
                
)

  export default UploadHandbook;
