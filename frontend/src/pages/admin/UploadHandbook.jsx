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
    

    return (
    <div>
      <h1>Upload Handbook</h1>
    </div>
  );
}

export default UploadHandbook;

