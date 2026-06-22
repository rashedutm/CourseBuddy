import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getLecturersForCourses } from '../../services/courseService'
import './courses.css'

function SetLecturerPreference() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        patterns,
        totalPatterns
    } = location.state || {}

    const academicYear = academicSession
        ? `${academicSession}-${intakeMonth === 'October' ? '1' : '2'}`
        : null

    const [lecturersByCourse, setLecturersByCourse] = useState({})
    const [preferences, setPreferences] = useState({})
    const [courseCodes, setCourseCodes] = useState([])
    const [courseNames, setCourseNames] = useState({})
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!patterns || patterns.length === 0) {
            setErrorMessage('No patterns found. Please go back.')
            setLoading(false)
            return
        }

        // Extract unique course codes from patterns
        const codes = [...new Set(patterns[0].map(s => s.courseCode))]
        const names = {}
        patterns[0].forEach(s => { names[s.courseCode] = s.courseName })
        setCourseCodes(codes)
        setCourseNames(names)

        getLecturersForCourses(codes, semesterNumber, intakeMonth, academicYear)
            .then(data => {
                // Group by courseCode
                const grouped = {}
                data.forEach(row => {
                    if (!grouped[row.courseCode]) grouped[row.courseCode] = []
                    grouped[row.courseCode].push(row)
                })
                setLecturersByCourse(grouped)
                setLoading(false)
            })
            .catch(err => {
                setErrorMessage('Unable to load lecturer information at this time. Please try again later.')
                setLoading(false)
            })
    }, [patterns, semesterNumber, intakeMonth, academicYear])

    const handlePreferenceSelect = (courseCode, lecturerID) => {
        setPreferences(prev => ({
            ...prev,
            [courseCode]: lecturerID === prev[courseCode] ? null : lecturerID
        }))
    }

    const handleApply = () => {
        navigate('/courses/patterns/filtered', {
            state: {
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                lecturerPreferences: preferences,
                academicYear,
                patterns,
                totalPatterns
            }
        })
    }

    const handleSkip = () => {
        navigate('/courses/patterns', {
            state: { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }
        })
    }

    if (loading) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Lecturer Preference</h1>
                </header>
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading Lecturers...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ paddingBottom: '140px' }}>
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Lecturer Preference</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            <div className="info-card">
                <i className="fas fa-circle-info"></i>
                <span>Selecting a preferred lecturer is optional. Leave a course unset to consider all available sections for that course.</span>
            </div>

            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {courseCodes.map(courseCode => {
                const lecturers = lecturersByCourse[courseCode] || []
                const isSet = preferences[courseCode]

                return (
                    <div key={courseCode} className="course-pref-card">
                        <div className="course-pref-header">
                            <span className="course-code">{courseCode}</span>
                            <span className={`selected-badge ${isSet ? 'pref-set' : 'pref-none'}`}>
                                {isSet ? '✓ Preference Set' : 'Not Set'}
                            </span>
                        </div>
                        <p className="course-name">{courseNames[courseCode]}</p>

                        {lecturers.length === 0 ? (
                            <div className="unavailable-note">
                                <i className="fas fa-triangle-exclamation"></i>
                                Lecturer information is currently unavailable for this course.
                            </div>
                        ) : (
                            <div className="lecturer-list">
                                {lecturers.map(lec => (
                                    <div
                                        key={lec.lecturerID}
                                        className={`lecturer-option ${preferences[courseCode] === lec.lecturerID ? 'selected' : ''}`}
                                        onClick={() => handlePreferenceSelect(courseCode, lec.lecturerID)}
                                    >
                                        <div className="radio-circle">
                                            {preferences[courseCode] === lec.lecturerID && (
                                                <i className="fas fa-check"></i>
                                            )}
                                        </div>
                                        <div className="lecturer-info">
                                            <div className="lecturer-name">{lec.lecturerName}</div>
                                            <div className="lecturer-sections">Sections: {lec.assignedSections}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}

            <div className="sticky-bottom">
                <button className="btn primary" onClick={handleApply}>
                    <i className="fas fa-sliders"></i>
                    Apply Preferences
                </button>
                <button className="btn outline" onClick={handleSkip}>
                    <i className="fas fa-forward"></i>
                    Skip — Show All Patterns
                </button>
            </div>
        </div>
    )
}

export default SetLecturerPreference
