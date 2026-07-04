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

        
}