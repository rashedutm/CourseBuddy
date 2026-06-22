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
            setMessage(error.message || "Failed to delete handbook");
            setMessageType("error");
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
                    Permanently remove handbook data for a selected intake. This action
                    cannot be undone.
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

                {/* Navigation buttons */}
                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb'}}>
                  <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>Related Actions:</p>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer'}}
                      onClick={() => navigate('/admin/handbook/upload')}
                    >
                      Upload Handbook
                    </button>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer'}}
                      onClick={() => navigate('/admin/handbook/view')}
                    >
                      View Handbook Data
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteHandbook;