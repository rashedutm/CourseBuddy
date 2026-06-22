import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, deleteCourse, deleteSection } from "../../services/courseSectionService";
import "./admin.css";
import "./admin.css";

// UC040: Delete Course or Section Entry
// Allows admin to delete courses or sections

function DeleteCourseSection() {
    const navigate = useNavigate();
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
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Course & Section Management</p>
                <h1 style={styles.title}>Delete Course or Section</h1>
                <p style={styles.subtitle}>
                    Permanently remove courses or sections from the system. This action
                    cannot be undone.
                </p>

                {/* Tab Navigation */}
                <div style={styles.tabContainer}>
                    <button
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === "course" ? "#dc2626" : "#f3f4f6",
                            color: activeTab === "course" ? "#ffffff" : "#374151"
                        }}
                        onClick={() => setActiveTab("course")}
                    >
                        Delete Course
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === "section" ? "#dc2626" : "#f3f4f6",
                            color: activeTab === "section" ? "#ffffff" : "#374151"
                        }}
                        onClick={() => setActiveTab("section")}
                    >
                        Delete Section
                    </button>
                </div>

                {/* Warning Box */}
                <div style={styles.warningBox}>
                    <p style={styles.warningText}>
                        ⚠️ Warning: This will permanently delete the selected{" "}
                        {activeTab === "course" ? "course and all its sections" : "section"}.
                        This action cannot be undone.
                    </p>
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

                {/* Delete Course Tab */}
                {activeTab === "course" && (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Select Course to Delete</label>
                            <select
                                style={styles.select}
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">-- Select a course --</option>
                                {courses.map((course) => (
                                    <option key={course.courseCode} value={course.courseCode}>
                                        {course.courseCode} - {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            style={{
                                ...styles.button,
                                backgroundColor: "#dc2626",
                                opacity: loading || !selectedCourse ? 0.5 : 1
                            }}
                            onClick={handleDeleteCourse}
                            disabled={loading || !selectedCourse}
                        >
                            {loading ? "Deleting..." : "Delete Course"}
                        </button>
                    </div>
                )}

                {/* Delete Section Tab */}
                {activeTab === "section" && (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Select Course</label>
                            <select
                                style={styles.select}
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">-- Select a course --</option>
                                {courses.map((course) => (
                                    <option key={course.courseCode} value={course.courseCode}>
                                        {course.courseCode} - {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedCourse && (
                            <>
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

                                {sections.length > 0 && (
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Select Section to Delete</label>
                                        <select
                                            style={styles.select}
                                            value={selectedSection}
                                            onChange={(e) => setSelectedSection(e.target.value)}
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
                                    style={{opacity: loading || !selectedSection ? 0.5 : 1}}
                                    onClick={handleDeleteSection}
                                    disabled={loading || !selectedSection}
                                >
                                    {loading ? "Deleting..." : "Delete Section"}
                                </button>
                            </>
                        )}
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
                      onClick={() => navigate('/admin/courses/edit-section')}
                    >
                      Edit Section
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteCourseSection;