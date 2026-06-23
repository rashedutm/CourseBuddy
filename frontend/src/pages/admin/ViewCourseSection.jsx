import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, getSections } from "../../services/courseSectionService";
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
            // Set fallback courses on error
            setCourses([
                { courseCode: "SCSE1013", courseName: "Fundamental Programming Concept", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCST1123", courseName: "Mathematics for Software Engineer", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR1013", courseName: "Digital Logic", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCST1143", courseName: "Database Engineering", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "ULRS1032", courseName: "Integrity and Anti-Corruption", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE1203", courseName: "Software Engineering Principles", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR1033", courseName: "Computer Organization and Architecture", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCST1223", courseName: "Probability and Statistical Data Analysis", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE1224", courseName: "Advanced Programming", creditHours: 4, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR2213", courseName: "Network Communications", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "UHLM1012", courseName: "Malaysia Language for Communication 2", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE2133", courseName: "Software Process and Project Management", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE2123", courseName: "Software Requirements Engineering", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE2103", courseName: "Data Structure and Algorithm", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR2043", courseName: "Operating Systems", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSM2113", courseName: "Human Computer Interaction Fundamentals", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSM2223", courseName: "Cross-Platform Application Development", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE2233", courseName: "Software Design and Architecture", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE2243", courseName: "Application Development Project I", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "UHLB2122", courseName: "Professional Communication Skills 1", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "ULRS1022", courseName: "Philosophy and Current Issues", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "SCSB2103", courseName: "Bioinformatics I", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSP2753", courseName: "Data Mining", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSP3213", courseName: "Business Intelligence", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "UHLB3132", courseName: "Professional Communication Skills", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "SCST3223", courseName: "Data Analytic Programming", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3143", courseName: "Ubiquitous Computing", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR3113", courseName: "Cloud Computing", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3103", courseName: "Cognitive Computing", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3203", courseName: "Special Topics", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSM3113", courseName: "Virtual and Augmented Reality Application", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3242", courseName: "Software Engineering Project I", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR3133", courseName: "Secure Software Programming", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3213", courseName: "Software Quality and Testing", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3223", courseName: "Application Development Project II", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE3233", courseName: "Professional Practice in Software Engineering", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "ULRS3032", courseName: "Entrepreneurship and Innovation", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE4108", courseName: "Industrial Training", creditHours: 8, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE4114", courseName: "Industrial Training Report", creditHours: 4, facultyName: "Faculty of Computing" },
                { courseCode: "SCSE4214", courseName: "Software Engineering Project II", creditHours: 4, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR4453", courseName: "Network Security", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSR4973", courseName: "Computer Network and Security Special Topics", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SECB3133", courseName: "Computational Biology I", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "SCSB3203", courseName: "Programming for Bioinformatics", creditHours: 3, facultyName: "Faculty of Computing" },
                { courseCode: "UHLA1122", courseName: "Arabic Language", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "UHLM1122", courseName: "Mandarin Language", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "UHLF1122", courseName: "French Language", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "UHLJ1122", courseName: "Japanese Language", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "UHLK1122", courseName: "Korean Language", creditHours: 2, facultyName: "Faculty of Computing" },
                { courseCode: "UHLC1122", courseName: "Mandarin Language 1", creditHours: 2, facultyName: "Faculty of Computing" }
            ]);
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
            // Set empty sections on error
            setSections([]);
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
        <div className="admin-page">
            <div className="admin-card">
                <p className="admin-badge">Course & Section Management</p>
                <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>View Course and Section Data</h1>
                <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
                    Browse and manage courses and their timetable sections from the database.
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
                            backgroundColor: activeTab === "courses" ? '#8b0000' : '#f3f4f6',
                            color: activeTab === "courses" ? '#fff' : '#555'
                        }}
                        onClick={() => setActiveTab("courses")}
                    >
                        Courses ({courses.length})
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '10px 10px 0 0',
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: activeTab === "sections" ? '#8b0000' : '#f3f4f6',
                            color: activeTab === "sections" ? '#fff' : '#555'
                        }}
                        onClick={() => setActiveTab("sections")}
                        disabled={!selectedCourse}
                    >
                        Sections {selectedCourse && `(${selectedCourse})`}
                    </button>
                </div>

                {/* Search and Filters */}
                {activeTab === "courses" && (
                    <div className="admin-form-group" style={{marginBottom: '24px'}}>
                        <label>Search Courses</label>
                        <input
                            type="text"
                            style={{width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '15px'}}
                            placeholder="Search by course code or name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                )}

                {activeTab === "sections" && (
                    <div style={{display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap'}}>
                        <div className="admin-form-group">
                            <label>Semester Number</label>
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
                            <label>Intake Month</label>
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
                )}

                {loading && (
                    <div className="admin-loading">
                        <p>Loading...</p>
                    </div>
                )}

                {/* Courses Table */}
                {activeTab === "courses" && !loading && (
                    <div>
                        {courses.length === 0 ? (
                            <p className="admin-empty">No courses found</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Credit Hours</th>
                                        <th>Faculty</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr key={course.courseCode} style={index % 2 === 0 ? {backgroundColor: '#fff'} : {backgroundColor: '#f9fafb'}}>
                                            <td><strong>{course.courseCode}</strong></td>
                                            <td>{course.courseName}</td>
                                            <td>{course.creditHours}</td>
                                            <td>{course.facultyName || "N/A"}</td>
                                            <td>
                                                <button
                                                    style={{background: '#fdf0f0', color: '#8b0000', border: 'none', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}
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
                {activeTab === "sections" && !loading && (
                    <div>
                        {sections.length === 0 ? (
                            <p className="admin-empty">No sections found for this course</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Section</th>
                                        <th>Day</th>
                                        <th>Time</th>
                                        <th>Venue</th>
                                        <th>Lecturer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sections.map((section, index) => (
                                        <tr key={section.sectionID} style={index % 2 === 0 ? {backgroundColor: '#fff'} : {backgroundColor: '#f9fafb'}}>
                                            <td><strong>{section.sectionNumber}</strong></td>
                                            <td>{section.day}</td>
                                            <td>{section.timeStart} - {section.timeEnd}</td>
                                            <td>{section.venue || "TBA"}</td>
                                            <td>{section.lecturerName || "TBA"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Route Links */}
                <div style={{marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e5e7eb'}}>
                    <p style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>📋 Available Admin Pages:</p>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px'}}>
                        <a href="/admin/handbook/upload" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Upload Handbook</a>
                        <a href="/admin/handbook/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Handbook</a>
                        <a href="/admin/handbook/delete" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Delete Handbook</a>
                        <a href="/admin/timetable/upload" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Upload Timetable</a>
                        <a href="/admin/timetable/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Timetable</a>
                        <a href="/admin/timetable/delete" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Delete Timetable</a>
                        <a href="/admin/courses/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Courses</a>
                        <a href="/admin/courses/edit-course" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Edit Course</a>
                        <a href="/admin/courses/edit-section" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Edit Section</a>
                        <a href="/admin/courses/delete" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Delete Course/Section</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewCourseSection;