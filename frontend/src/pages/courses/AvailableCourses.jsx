import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    getAvailableCourses,
    getAvailableFreeElectives
} from '../../services/courseService'
import './courses.css'

function AvailableCourses() {
    const navigate = useNavigate()
    const location = useLocation()

    // Get data passed from SelectIntakeSemester page
    const {
        intakeID,
        semesterID,
        semesterNumber,
        academicSession,
        intakeMonth
    } = location.state || {}

    const [courses, setCourses] = useState([])
    const [freeElectives, setFreeElectives] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const programmeID = localStorage.getItem('programmeID')
    const academicYear = academicSession
        ? `${academicSession}-${intakeMonth === 'October' ? '1' : '2'}`
        : null

    useEffect(() => {
        if (!intakeID || !semesterID || !semesterNumber || !programmeID || !academicYear) {
            setErrorMessage('Missing session data. Please go back and select again.')
            setLoading(false)
            return
        }

        const loadCourses = async () => {
            try {
                // Load fixed and elective_group courses
                const courseData = await getAvailableCourses(
                    programmeID,
                    intakeID,
                    semesterNumber,
                    academicYear
                )
                setCourses(courseData)

                // Load free elective courses
                try {
                    const freeData = await getAvailableFreeElectives(
                        programmeID,
                        intakeID,
                        semesterNumber,
                        academicYear
                    )
                    setFreeElectives(freeData)
                } catch (err) {
                    // Free electives may not exist — not a critical error
                    setFreeElectives([])
                }
            } catch (err) {
                setErrorMessage('Unable to load courses: ' + err.message)
            } finally {
                setLoading(false)
            }
        }

        loadCourses()
    }, [intakeID, semesterID, semesterNumber, programmeID, academicYear])

    const allCourses = [...courses, ...freeElectives]

    const filteredCourses = allCourses.filter(course =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCourseClick = (courseCode) => {
        navigate('/courses/prerequisite', {
            state: {
                courseCode,
                intakeID,
                semesterID,
                semesterNumber,
                academicSession,
                intakeMonth
            }
        })
    }

    const handleProceedToSelect = () => {
        navigate('/courses/select', {
            state: {
                intakeID,
                semesterID,
                semesterNumber,
                academicSession,
                intakeMonth,
                availableCourses: allCourses
            }
        })
    }

    if (loading) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Available Courses</h1>
                </header>
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading Courses...</h2>
                    <p>Fetching available courses for your semester.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Available Courses</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            {/* Summary card */}
            <div className="summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Total Courses</h3>
                    <span style={{ fontSize: '26px', fontWeight: '700' }}>{allCourses.length} Courses</span>
                </div>
                <i className="fas fa-book-open" style={{ fontSize: '32px', opacity: '0.4' }}></i>
            </div>

            {/* Search bar */}
            <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    placeholder="Search course name or code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Error state */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* No courses found */}
            {!loading && allCourses.length === 0 && !errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>No courses are currently available for your selected intake and semester. Please contact your faculty administrator.</span>
                </div>
            )}

            {/* Course list */}
            {filteredCourses.map(course => (
                <div
                    key={course.courseCode}
                    className={`course-card ${course.hasPrerequisite ? 'has-prereq' : 'no-prereq'}`}
                    onClick={() => course.hasPrerequisite && handleCourseClick(course.courseCode)}
                >
                    <div className="course-header">
                        <span className="course-code">{course.courseCode}</span>
                        <span className="credit-badge">{course.creditHours} Credits</span>
                    </div>
                    <p className="course-name">{course.courseName}</p>
                    <div className="course-footer">
                        {course.hasPrerequisite ? (
                            <span className="prereq-tag has">
                                <i className="fas fa-exclamation-circle"></i>
                                Has Prerequisite
                            </span>
                        ) : (
                            <span className="prereq-tag none">
                                <i className="fas fa-check-circle"></i>
                                No Prerequisite
                            </span>
                        )}
                        {course.slotType && (
                            <span className="sections-info">
                                {course.slotType === 'fixed' ? 'Required' :
                                 course.slotType === 'elective_group' ? `Choose ${course.pickCount}` :
                                 'Free Elective'}
                            </span>
                        )}
                    </div>
                </div>
            ))}

            {/* Proceed button */}
            {allCourses.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <button className="btn primary" onClick={handleProceedToSelect}>
                        <i className="fas fa-check"></i>
                        Proceed to Select Courses
                    </button>
                </div>
            )}
        </div>
    )
}

export default AvailableCourses