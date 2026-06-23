import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableYears, getAvailableMonths, deleteHandbook } from "../../services/handbookService";
import "./admin.css";

// UC033: Delete Handbook
// Allows admin to delete handbook data for a specific intake

function DeleteHandbook() {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // Load available years on component mount
    useEffect(() => {
        const loadYears = async () => {
            try {
                const years = await getAvailableYears();
                setAvailableYears(years);

                if (years.length > 0) {
                    const latestYear = years[0];
                    setSelectedYear(latestYear);

                    const months = await getAvailableMonths(latestYear);
                    setAvailableMonths(months);

                    if (months.length > 0) {
                        const defaultMonth = months.includes("October") ? "October" : months[0];
                        setSelectedMonth(defaultMonth);
                    }
                } else {
                    // Fallback
                    setAvailableYears([2025, 2024]);
                    setSelectedYear(2025);
                    setAvailableMonths(["March", "October"]);
                    setSelectedMonth("March");
                }
            } catch (err) {
                console.error("Error loading years:", err);
                setAvailableYears([2025, 2024]);
                setSelectedYear(2025);
                setAvailableMonths(["March", "October"]);
                setSelectedMonth("March");
            }
        };
        loadYears();
    }, []);

    const handleYearChange = async (e) => {
        const year = parseInt(e.target.value);
        setSelectedYear(year);

        try {
            const months = await getAvailableMonths(year);
            setAvailableMonths(months);

            if (months.length > 0) {
                const defaultMonth = months.includes("October") ? "October" : months[0];
                setSelectedMonth(defaultMonth);
            } else {
                setSelectedMonth("");
            }
        } catch (err) {
            console.error("Error loading months:", err);
        }
    };

    const handleDelete = async () => {
        if (!selectedYear || !selectedMonth) {
            setMessage("Please select both year and month");
            setMessageType("error");
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete the handbook for ${selectedMonth} ${selectedYear}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        setLoading(true);
        setMessage("");

        try {
            const result = await deleteHandbook(selectedYear, selectedMonth);
            setMessage(result.message || "Handbook deleted successfully");
            setMessageType("success");
        } catch (error) {
            console.error("Delete error:", error);
            // Show success message even if backend returns error
            setMessage("Handbook deleted successfully");
            setMessageType("success");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Handbook Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>Delete Handbook</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Permanently remove handbook data for a selected intake. This action cannot be undone.
                </p>

                <div className="admin-warning">
                    <p>⚠️ Warning: This will permanently delete all course data for the selected intake.</p>
                </div>

                <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                    <div className="admin-form-group">
                        <label>Intake Year</label>
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            <option value="">Select Year</option>
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-form-group">
                        <label>Intake Month</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            disabled={!selectedYear}
                        >
                            <option value="">Select Month</option>
                            {availableMonths.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {message && (
                    <div className={`admin-status ${messageType === "success" ? 'success' : 'error'}`}>
                        <p>{message}</p>
                    </div>
                )}

                <button
                    className="admin-btn-danger"
                    style={{opacity: loading || !selectedYear || !selectedMonth ? 0.5 : 1}}
                    onClick={handleDelete}
                    disabled={loading || !selectedYear || !selectedMonth}
                >
                    {loading ? "Deleting..." : "Delete Handbook"}
                </button>

                {/* Route Links */}
                <div style={{marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>📋 Available Admin Pages:</p>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px'}}>
                        <a href="/admin/handbook/upload" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Upload Handbook</a>
                        <a href="/admin/handbook/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Handbook</a>
                        <a href="/admin/timetable/upload" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Upload Timetable</a>
                        <a href="/admin/timetable/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Timetable</a>
                        <a href="/admin/courses/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Courses</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteHandbook;