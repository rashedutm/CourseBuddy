import React, { useState, useEffect } from "react";
import { getCourses, deleteCourse, deleteSection, getSections } from "../../services/courseSectionService";
import "./admin.css";

// UC040: Delete Course or Section Entry
// Allows admin to delete courses or sections

function DeleteCourseSection() {
    const [activeTab, setActiveTab] = useState("course");
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // Load courses on component mount
    useEffect(() => {
        loadCourses();
    }, []);

    // Load sections when course is selected
    useEffect(() => {
        if (selectedCourse && activeTab === "section") {
            loadSections();
        }
    }, [selectedCourse, semesterNumber, intakeMonth, academicYear, activeTab]);

    const loadCourses = async () => {
        setLoading(true);
        setMessage("");

        try {
            const data = await getCourses({ facultyID: "FC" });
            setCourses(data);
        } catch (error) {
            setMessage(error.message || "Failed to load courses");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const loadSections = async () => {
        if (!selectedCourse) return;

        setLoading(true);
        setMessage("");

        try {
            const data = await getSections({
                facultyID: "FC",
                courseCode: selectedCourse,
                semesterNumber,
                intakeMonth,
                academicYear
            });
            setSections(data);
        } catch (error) {
            setMessage(error.message || "Failed to load sections");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async () => {
        if (!selectedCourse) {
            setMessage("Please select a course to delete");
            setMessageType("error");
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete course ${selectedCourse}? This will also delete all associated sections. This action cannot be undone.`
        );

        if (!confirmDelete) return;

        setLoading(true);
        setMessage("");

        try {
            const result = await deleteCourse(selectedCourse);
            setMessage(result.message || "Course deleted successfully");
            setMessageType("success");
            setSelectedCourse("");
            loadCourses(); // Reload courses list
        } catch (error) {
            setMessage(error.message || "Failed to delete course");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSection = async () => {
        if (!selectedSection) {
            setMessage("Please select a section to delete");
            setMessageType("error");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this section? This action cannot be undone."
        );

        if (!confirmDelete) return;

        setLoading(true);
        setMessage("");

        try {
            const result = await deleteSection(selectedSection);
            setMessage(result.message || "Section deleted successfully");
            setMessageType("success");
            setSelectedSection("");
            loadSections(); // Reload sections list
        } catch (error) {
            setMessage(error.message || "Failed to delete section");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Course & Section Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>Delete Course or Section</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Permanently remove courses or sections from the system. This action cannot be undone.
                </p>

                {/* Tab Navigation */}
                <div style={{display: 'flex', gap: '8px', marginBottom: '24px'}}>
                    <button
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '10px 10px 0 0',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: activeTab === "course" ? '#dc2626' : '#f3f4f6',
                            color: activeTab === "course" ? '#ffffff' : '#374151'
                        }}
                        onClick={() => setActiveTab("course")}
                    >
                        Delete Course
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '10px 10px 0 0',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: activeTab === "section" ? '#dc2626' : '#f3f4f6',
                            color: activeTab === "section" ? '#ffffff' : '#374151'
                        }}
                        onClick={() => setActiveTab("section")}
                    >
                        Delete Section
                    </button>
                </div>

                {/* Warning Box */}
                <div className="admin-warning">
                    <p>⚠️ Warning: This will permanently delete the selected {activeTab === "course" ? "course and all its sections" : "section"}. This action cannot be undone.</p>
                </div>

                {message && (
                    <div className={`admin-status ${messageType === "success" ? 'success' : 'error'}`}>
                        <p>{message}</p>
                    </div>
                )}

                {/* Delete Course Tab */}
                {activeTab === "course" && (
                    <div className="admin-form-group">
                        <label>Select Course to Delete</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                        >
                            <option value="">-- Select a course --</option>
                            {courses.map((course) => (
                                <option key={course.courseCode} value={course.courseCode}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>

                        <button
                            className="admin-btn-danger"
                            style={{opacity: loading || !selectedCourse ? 0.5 : 1, marginTop: '16px'}}
                            onClick={handleDeleteCourse}
                            disabled={loading || !selectedCourse}
                        >
                            {loading ? "Deleting..." : "Delete Course"}
                        </button>
                    </div>
                )}

                {/* Delete Section Tab */}
                {activeTab === "section" && (
                    <div className="admin-form-group">
                        <label>Select Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                        >
                            <option value="">-- Select a course --</option>
                            {courses.map((course) => (
                                <option key={course.courseCode} value={course.courseCode}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>

                        {selectedCourse && (
                            <>
                                <div style={{display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap'}}>
                                    <div className="admin-form-group">
                                        <label>Semester</label>
                                        <select
                                            value={semesterNumber}
                                            onChange={(e) => setSemesterNumber(e.target.value)}
                                            style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
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
                                            style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
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
                                            style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                        >
                                            <option value="2024/2025">2024/2025</option>
                                            <option value="2025/2026">2025/2026</option>
                                            <option value="2026/2027">2026/2027</option>
                                        </select>
                                    </div>
                                </div>

                                {sections.length > 0 && (
                                    <div className="admin-form-group" style={{marginTop: '16px'}}>
                                        <label>Select Section to Delete</label>
                                        <select
                                            value={selectedSection}
                                            onChange={(e) => setSelectedSection(e.target.value)}
                                            style={{padding: '10px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'}}
                                        >
                                            <option value="">-- Select a section --</option>
                                            {sections.map((section) => (
                                                <option key={section.sectionID} value={section.sectionID}>
                                                    {section.sectionNumber} - {section.day} {section.timeStart}-{section.timeEnd} - {section.venue || "TBA"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button
                                    className="admin-btn-danger"
                                    style={{opacity: loading || !selectedSection ? 0.5 : 1, marginTop: '16px'}}
                                    onClick={handleDeleteSection}
                                    disabled={loading || !selectedSection}
                                >
                                    {loading ? "Deleting..." : "Delete Section"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeleteCourseSection;