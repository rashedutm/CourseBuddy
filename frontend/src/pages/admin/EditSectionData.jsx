import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSectionsByCourse, updateSection } from "../../services/courseSectionService";
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
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Course & Section Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>Edit Section Data</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Update section information such as time, venue, and lecturer.
                </p>

                {/* Search Section */}
                <div className="admin-form-group" style={{marginBottom: '24px'}}>
                    <label>Search Course</label>
                    <div style={{display: 'flex', gap: '12px', marginBottom: '16px'}}>
                        <input
                            type="text"
                            style={{flex: 1, padding: '12px 16px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '15px'}}
                            placeholder="Enter course code (e.g., SCSE1013)"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                        />
                        <button
                            className="admin-btn"
                            style={{width: 'auto', padding: '12px 24px'}}
                            onClick={handleCourseSearch}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Load Sections"}
                        </button>
                    </div>

                    <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                        <div className="admin-form-group">
                            <label>Semester</label>
                            <select
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

                        <div className="admin-form-group">
                            <label>Intake</label>
                            <select
                                value={intakeMonth}
                                onChange={(e) => setIntakeMonth(e.target.value)}
                            >
                                <option value="October">October</option>
                                <option value="March">March</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Academic Year</label>
                            <select
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
                    <div className={`admin-status ${messageType === "success" ? 'success' : 'error'}`}>
                        <p>{message}</p>
                    </div>
                )}

                {/* Sections List */}
                {sections.length > 0 && (
                    <div style={{marginBottom: '24px'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px'}}>Available Sections</h3>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px'}}>
                            {sections.map((section) => (
                                <div
                                    key={section.sectionID}
                                    style={{
                                        padding: '16px',
                                        border: '2px solid',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        borderColor: selectedSection === section.sectionID ? '#8b0000' : '#e5e7eb',
                                        background: selectedSection === section.sectionID ? '#fffafa' : '#ffffff'
                                    }}
                                    onClick={() => handleSectionClick(section)}
                                >
                                    <p style={{fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px'}}>{section.sectionNumber}</p>
                                    <p style={{fontSize: '13px', color: '#888', margin: '4px 0'}}>
                                        {section.day} {section.timeStart}-{section.timeEnd}
                                    </p>
                                    <p style={{fontSize: '13px', color: '#888', margin: '4px 0'}}>{section.venue || "TBA"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {selectedSection && (
                    <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px'}}>Edit Section</h3>

                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                            <div className="admin-form-group">
                                <label>Section Number</label>
                                <input
                                    type="text"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={sectionNumber}
                                    onChange={(e) => setSectionNumber(e.target.value)}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Lecturer Name</label>
                                <input
                                    type="text"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={lecturerName}
                                    onChange={(e) => setLecturerName(e.target.value)}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Day</label>
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                >
                                    {days.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Time Start</label>
                                <input
                                    type="time"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={timeStart}
                                    onChange={(e) => setTimeStart(e.target.value)}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Time End</label>
                                <input
                                    type="time"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={timeEnd}
                                    onChange={(e) => setTimeEnd(e.target.value)}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Venue</label>
                                <input
                                    type="text"
                                    style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            className="admin-btn"
                            style={{opacity: loading ? 0.5 : 1, width: 'auto', padding: '12px 24px'}}
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Section"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditSectionData;