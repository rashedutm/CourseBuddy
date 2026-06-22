import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseByCode, updateCourse } from "../../services/courseSectionService";
import "./admin.css";
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
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Course & Section Management</p>
                <h1 style={styles.title}>Edit Course Data</h1>
                <p style={styles.subtitle}>
                    Update course information such as name, credit hours, and prerequisites.
                </p>

                {/* Search Section */}
                <div style={styles.searchSection}>
                    <div style={styles.searchContainer}>
                        <input
                            type="text"
                            style={styles.searchInput}
                            placeholder="Enter course code (e.g., SCSE1013)"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                        />
                        <button
                            style={styles.searchButton}
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {message && (
                    <div
                        style={
                            messageType === "success" ? styles.successBox : styles.errorBox
                        }
                    >
                        <p
                            style={
                                messageType === "success"
                                    ? styles.successText
                                    : styles.errorText
                            }
                        >
                            {message}
                        </p>
                    </div>
                )}

                {/* Edit Form */}
                {courseCode && (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Course Code</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={courseCode}
                                disabled
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Course Name</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Credit Hours</label>
                            <input
                                type="number"
                                style={styles.input}
                                value={creditHours}
                                onChange={(e) => setCreditHours(e.target.value)}
                                min="1"
                                max="10"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Has Prerequisites</label>
                            <select
                                style={styles.select}
                                value={hasPrerequisite ? "yes" : "no"}
                                onChange={(e) => setHasPrerequisite(e.target.value === "yes")}
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>

                        <button
                            className="admin-btn"
                            style={{opacity: loading ? 0.5 : 1}}
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Course"}
                        </button>
                    </div>
                )}

                {/* Navigation buttons */}
                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb'}}>
                  <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>Related Actions:</p>
                  <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer', minWidth: '150px'}}
                      onClick={() => navigate('/admin/courses/view')}
                    >
                      View Courses
                    </button>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer', minWidth: '150px'}}
                      onClick={() => navigate('/admin/courses/edit-section')}
                    >
                      Edit Section
                    </button>
                    <button 
                      className="admin-btn-outline"
                      style={{flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #8b0000', background: '#fff', color: '#8b0000', cursor: 'pointer', minWidth: '150px'}}
                      onClick={() => navigate('/admin/courses/delete')}
                    >
                      Delete Course/Section
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}


export default EditCourseData;