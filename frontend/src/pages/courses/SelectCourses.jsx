import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveSelectedCourses } from '../../services/courseService'
import './courses.css'

function SelectCourses() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        intakeID,
        semesterID,
        semesterNumber,
        academicSession,
        intakeMonth,
        availableCourses = []
    } = location.state || {}

    const [selectedCodes, setSelectedCodes] = useState([])
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const MAX_COURSES = 8

    const totalCreditHours = availableCourses
        .filter(c => selectedCodes.includes(c.courseCode))
        .reduce((sum, c) => sum + c.creditHours, 0)

    const handleToggle = (courseCode) => {
        setErrorMessage('')
        if (selectedCodes.includes(courseCode)) {
            setSelectedCodes(selectedCodes.filter(c => c !== courseCode))
        } else {
            if (selectedCodes.length >= MAX_COURSES) {
                setErrorMessage(`You have reached the maximum of ${MAX_COURSES} courses allowed.`)
                return
            }
            setSelectedCodes([...selectedCodes, courseCode])
        }
    }

    const handleViewPrerequisite = (e, course) => {
        e.stopPropagation()
        navigate('/courses/prerequisites', {
            state: {
                courseCode: course.courseCode,
                courseName: course.courseName,
                creditHours: course.creditHours,
                intakeID,
                semesterID,
                semesterNumber,
                academicSession,
                intakeMonth
            }
        })
    }

    const handleGeneratePatterns = async () => {
        if (selectedCodes.length === 0) {
            setErrorMessage('Please select at least one course before generating patterns.')
            return
        }

        const studentID = localStorage.getItem('studentID')
        if (!studentID) {
            setErrorMessage('Student not found. Please log in again.')
            return
        }

        setLoading(true)
        try {
            await saveSelectedCourses(studentID, selectedCodes, semesterID)
            navigate('/courses/generate', {
                state: {
                    studentID,
                    semesterID,
                    semesterNumber,
                    intakeMonth,
                    academicSession,
                    intakeID,
                    selectedCodes
                }
            })
        } catch (err) {
            setErrorMessage('Unable to save your course selection. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Select Courses</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            <div className="instruction">
                <i className="fas fa-circle-info"></i>
                <span>Select the courses you want to register this semester. Maximum {MAX_COURSES} courses allowed.</span>
            </div>

            {/* Error message */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Course list */}
            {availableCourses.map(course => (
                <div
                    key={course.courseCode}
                    className={`course-card ${selectedCodes.includes(course.courseCode) ? 'selected' : ''}`}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}
                    onClick={() => handleToggle(course.courseCode)}
                >
                    {/* Checkbox */}
                    <div className="checkbox">
                        {selectedCodes.includes(course.courseCode) && (
                            <i className="fas fa-check"></i>
                        )}
                    </div>

                    {/* Course content */}
                    <div style={{ flex: 1 }}>
                        <div className="course-header">
                            <span className="course-code">{course.courseCode}</span>
                            <span className="credit-badge">{course.creditHours} Credits</span>
                        </div>
                        <p className="course-name">{course.courseName}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="sections-info" style={{ fontSize: '13px', color: '#888' }}>
                                {course.slotType === 'fixed' ? 'Required' :
                                 course.slotType === 'elective_group' ? `Elective — Pick ${course.pickCount}` :
                                 'Free Elective'}
                            </span>
                            {course.hasPrerequisite && (
                                <span
                                    style={{ fontSize: '12px', color: '#d4af37', cursor: 'pointer' }}
                                    onClick={(e) => handleViewPrerequisite(e, course)}
                                >
                                    <i className="fas fa-exclamation-circle"></i> View Prerequisite
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Sticky bottom panel */}
            <div className="sticky-bottom">
                {errorMessage && (
                    <div className="error-toast" style={{ display: 'flex', marginBottom: '12px' }}>
                        <i className="fas fa-circle-exclamation"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}
                <div className="summary-row">
                    <div className="summary-item">
                        <div className="value">{selectedCodes.length}</div>
                        <div className="label">Courses Selected</div>
                    </div>
                    <div className="summary-item">
                        <div className="value">{totalCreditHours}</div>
                        <div className="label">Credit Hours</div>
                    </div>
                    <div className="summary-item">
                        <div className="value">{selectedCodes.length}/{MAX_COURSES}</div>
                        <div className="label">Max Courses</div>
                    </div>
                </div>
                <button
                    className="btn primary"
                    disabled={selectedCodes.length === 0 || loading}
                    onClick={handleGeneratePatterns}
                >
                    <i className="fas fa-wand-magic-sparkles"></i>
                    {loading ? 'Saving...' : 'Generate Patterns'}
                </button>
            </div>
        </div>
    )
}

export default SelectCourses
