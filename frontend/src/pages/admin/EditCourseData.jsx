import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseByCode, updateCourse } from "../../services/courseSectionService";
import "./admin.css";

// UC038: Edit Course Data
// Allows admin to edit course information

function EditCourseData() {
    const navigate = useNavigate();
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [creditHours, setCreditHours] = useState("");
    const [hasPrerequisite, setHasPrerequisite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [searchCode, setSearchCode] = useState("");

    const handleSearch = async () => {
        if (!searchCode) {
            setMessage("Please enter a course code");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const data = await getCourseByCode(searchCode);
            setCourseCode(data.courseCode);
            setCourseName(data.courseName);
            setCreditHours(data.creditHours);
            setHasPrerequisite(data.hasPrerequisite);
            setMessage("Course loaded successfully");
            setMessageType("success");
        } catch (error) {
            setMessage(error.message || "Course not found");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!courseCode) {
            setMessage("Please search for a course first");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const result = await updateCourse(courseCode, {
                courseName,
                creditHours: parseInt(creditHours),
                hasPrerequisite
            });

            setMessage(result.message || "Course updated successfully");
            setMessageType("success");
        } catch (error) {
            setMessage(error.message || "Failed to update course");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Course & Section Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>Edit Course Data</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Update course information such as name, credit hours, and prerequisites.
                </p>

                {/* Search Section */}
                <div className="admin-form-group" style={{marginBottom: '24px'}}>
                    <label>Search Course</label>
                    <div style={{display: 'flex', gap: '12px'}}>
                        <input
                            type="text"
                            style={{flex: 1, padding: '12px 16px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '15px'}}
                            placeholder="Enter course code (e.g., SCSE1013)"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                        />
                        <button
                            className="admin-btn"
                            style={{width: 'auto', padding: '12px 24px'}}
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`admin-status ${messageType === "success" ? 'success' : 'error'}`}>
                        <p>{message}</p>
                    </div>
                )}

                {/* Edit Form */}
                {courseCode && (
                    <div style={{marginTop: '24px'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px'}}>Edit Course</h3>
                        
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                            <div className="admin-form-group">
                                <label>Course Code</label>
                                <input
                                    type="text"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px', background: '#f9fafb'}}
                                    value={courseCode}
                                    disabled
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Course Name</label>
                                <input
                                    type="text"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Credit Hours</label>
                                <input
                                    type="number"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={creditHours}
                                    onChange={(e) => setCreditHours(e.target.value)}
                                    min="1"
                                    max="10"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Has Prerequisites</label>
                                <select
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={hasPrerequisite ? "yes" : "no"}
                                    onChange={(e) => setHasPrerequisite(e.target.value === "yes")}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>

                        <button
                            className="admin-btn"
                            style={{opacity: loading ? 0.5 : 1, width: 'auto', padding: '12px 24px'}}
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Course"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditCourseData;