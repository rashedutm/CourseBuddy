import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, getSections } from "../../services/courseSectionService";
import "./admin.css";
import "./admin.css";

// UC037: View Course and Section Data
// Shows courses and their sections for a selected semester

function ViewCourseSection() {
    const navigate = useNavigate();
    const [facultyID, setFacultyID] = useState("FC");
    const [semesterNumber, setSemesterNumber] = useState("1");
    const [intakeMonth, setIntakeMonth] = useState("October");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("courses");

    // Load courses on component mount and when filters change
    useEffect(() => {
        loadCourses();
    }, [facultyID, searchTerm]);

    // Load sections when course is selected
    useEffect(() => {
        if (selectedCourse) {
            loadSections();
        }
    }, [selectedCourse, semesterNumber, intakeMonth, academicYear]);

    const loadCourses = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getCourses({ facultyID, searchTerm });
            setCourses(data);
        } catch (err) {
            console.error("Error loading courses:", err);
            setError(err.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const loadSections = async () => {
        if (!selectedCourse) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getSections({
                facultyID,
                semesterNumber,
                intakeMonth,
                academicYear,
                courseCode: selectedCourse
            });
            setSections(data);
        } catch (err) {
            console.error("Error loading sections:", err);
            setError(err.message || "Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseCode) => {
        setSelectedCourse(courseCode);
        setActiveTab("sections");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <p style={styles.eyebrow}>Course & Section Management</p>
                <h1 style={styles.title}>View Course and Section Data</h1>
                <p style={styles.subtitle}>
                    Browse and manage courses and their timetable sections.
                </p>

                {/* Tab Navigation */}
                <div style={styles.tabContainer}>
                    <button
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === "courses" ? "#2563eb" : "#f3f4f6",
                            color: activeTab === "courses" ? "#ffffff" : "#374151"
                        }}
                        onClick={() => setActiveTab("courses")}
                    >
                        Courses
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            backgroundColor: activeTab === "sections" ? "#2563eb" : "#f3f4f6",
                            color: activeTab === "sections" ? "#ffffff" : "#374151"
                        }}
                        onClick={() => setActiveTab("sections")}
                        disabled={!selectedCourse}
                    >
                        Sections {selectedCourse && `(${selectedCourse})`}
                    </button>
                </div>

                {/* Search and Filters */}
                {activeTab === "courses" && (
                    <div style={styles.filtersContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Search Courses</label>
                            <input
                                type="text"
                                style={styles.input}
                                placeholder="Search by course code or name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "sections" && (
                    <div style={styles.filtersContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Semester Number</label>
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
                            <label style={styles.label}>Intake Month</label>
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
                )}

                {loading && (
                    <div style={styles.loadingContainer}>
                        <p style={styles.loadingText}>Loading...</p>
                    </div>
                )}

                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorText}>{error}</p>
                    </div>
                )}

                {/* Courses Table */}
                {activeTab === "courses" && !loading && !error && (
                    <div style={styles.tableContainer}>
                        {courses.length === 0 ? (
                            <p style={styles.emptyText}>No courses found</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Course Code</th>
                                        <th style={styles.th}>Course Name</th>
                                        <th style={styles.th}>Credit Hours</th>
                                        <th style={styles.th}>Faculty</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr
                                            key={course.courseCode}
                                            style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                                        >
                                            <td style={styles.td}>
                                                <strong>{course.courseCode}</strong>
                                            </td>
                                            <td style={styles.td}>{course.courseName}</td>
                                            <td style={styles.td}>{course.creditHours}</td>
                                            <td style={styles.td}>{course.facultyName || "N/A"}</td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.actionButton}
                                                    onClick={() => handleCourseClick(course.courseCode)}
                                                >
                                                    View Sections
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Sections Table */}
                {activeTab === "sections" && !loading && !error && (
                    <div style={styles.tableContainer}>
                        {sections.length === 0 ? (
                            <p style={styles.emptyText}>No sections found for this course</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Section</th>
                                        <th style={styles.th}>Day</th>
                                        <th style={styles.th}>Time</th>
                                        <th style={styles.th}>Venue</th>
                                        <th style={styles.th}>Lecturer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sections.map((section, index) => (
                                        <tr
                                            key={section.sectionID}
                                            style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                                        >
                                            <td style={styles.td}>
                                                <strong>{section.sectionNumber}</strong>
                                            </td>
                                            <td style={styles.td}>{section.day}</td>
                                            <td style={styles.td}>
                                                {section.timeStart} - {section.timeEnd}
                                            </td>
                                            <td style={styles.td}>{section.venue || "TBA"}</td>
                                            <td style={styles.td}>{section.lecturerName || "TBA"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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



export default ViewCourseSection;