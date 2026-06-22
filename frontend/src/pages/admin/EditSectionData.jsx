import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSectionsByCourse, updateSection } from "../../services/courseSectionService";
import "./admin.css";
import "./admin.css";

// UC039: Edit Section Data
// Allows admin to edit section/timetable information

function EditSectionData() {
    const navigate = useNavigate();
    const [courseCode, setCourseCode] = useState("");
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionNumber, setSectionNumber] = useState("");
    const [lecturerName, setLecturerName] = useState("");
    const [day, setDay] = useState("Mon");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [venue, setVenue] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Load sections when course code and filters change
    useEffect(() => {
        if (courseCode) {
            loadSections();
        }
    }, [courseCode, semesterNumber, intakeMonth, academicYear]);

    const loadSections = async () => {
        setLoading(true);
        setMessage("");

        try {
            const data = await getSectionsByCourse(courseCode, semesterNumber, intakeMonth, academicYear);
            setSections(data);
        } catch (error) {
            setMessage(error.message || "Failed to load sections");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSearch = () => {
        if (!courseCode) {
            setMessage("Please enter a course code");
            setMessageType("error");
            return;
        }
        loadSections();
    };

    const handleSectionClick = (section) => {
        setSelectedSection(section.sectionID);
        setSectionNumber(section.sectionNumber);
        setLecturerName(section.lecturerName || "");
        setDay(section.day);
        setTimeStart(section.timeStart);
        setTimeEnd(section.timeEnd);
        setVenue(section.venue || "");
    };

    const handleUpdate = async () => {
        if (!selectedSection) {
            setMessage("Please select a section to edit");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const result = await updateSection(selectedSection, {
                sectionNumber,
                lecturerName,
                day,
                timeStart,
                timeEnd,
                venue
            });

            setMessage(result.message || "Section updated successfully");
            setMessageType("success");
            loadSections(); // Reload sections to show updated data
        } catch (error) {
            setMessage(error.message || "Failed to update section");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Course & Section Management</p>
                <h1 style={styles.title}>Edit Section Data</h1>
                <p style={styles.subtitle}>
                    Update section information such as time, venue, and lecturer.
                </p>

                {/* Search Section */}
                <div style={styles.searchSection}>
                    <div style={styles.searchContainer}>
                        <input
                            type="text"
                            style={styles.searchInput}
                            placeholder="Enter course code (e.g., SCSE1013)"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                        />
                        <button
                            style={styles.searchButton}
                            onClick={handleCourseSearch}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Load Sections"}
                        </button>
                    </div>

                    <div style={styles.filterRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Semester</label>
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

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Intake</label>
                            <select
                                style={styles.select}
                                value={intakeMonth}
                                onChange={(e) => setIntakeMonth(e.target.value)}
                            >
                                <option value="October">October</option>
                                <option value="March">March</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Academic Year</label>
                            <select
                                style={styles.select}
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                            >
                                <option value="2024/2025">2024/2025</option>
                                <option value="2025/2026">2025/2026</option>
                                <option value="2026/2027">2026/2027</option>
                            </select>
                        </div>
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

                {/* Sections List */}
                {sections.length > 0 && (
                    <div style={styles.sectionsList}>
                        <h3 style={styles.sectionTitle}>Available Sections</h3>
                        <div style={styles.sectionGrid}>
                            {sections.map((section) => (
                                <div
                                    key={section.sectionID}
                                    style={{
                                        ...styles.sectionCard,
                                        borderColor: selectedSection === section.sectionID ? "#2563eb" : "#e5e7eb",
                                        backgroundColor: selectedSection === section.sectionID ? "#eff6ff" : "#ffffff"
                                    }}
                                    onClick={() => handleSectionClick(section)}
                                >
                                    <p style={styles.sectionCode}>{section.sectionNumber}</p>
                                    <p style={styles.sectionTime}>
                                        {section.day} {section.timeStart}-{section.timeEnd}
                                    </p>
                                    <p style={styles.sectionVenue}>{section.venue || "TBA"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {selectedSection && (
                    <div style={styles.formContainer}>
                        <h3 style={styles.formTitle}>Edit Section</h3>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Section Number</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={sectionNumber}
                                    onChange={(e) => setSectionNumber(e.target.value)}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Lecturer Name</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={lecturerName}
                                    onChange={(e) => setLecturerName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Day</label>
                                <select
                                    style={styles.select}
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                >
                                    {days.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Time Start</label>
                                <input
                                    type="time"
                                    style={styles.input}
                                    value={timeStart}
                                    onChange={(e) => setTimeStart(e.target.value)}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Time End</label>
                                <input
                                    type="time"
                                    style={styles.input}
                                    value={timeEnd}
                                    onChange={(e) => setTimeEnd(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Venue</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                            />
                        </div>

                        <button
                            className="admin-btn"
                            style={{opacity: loading ? 0.5 : 1}}
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Section"}
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
                      onClick={() => navigate('/admin/courses/edit-course')}
                    >
                      Edit Course
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


export default EditSectionData;