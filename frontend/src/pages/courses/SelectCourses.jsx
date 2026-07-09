import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveSelectedCourses, getLecturersForCourses, generatePatterns } from '../../services/courseService'
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

    const academicYear = academicSession
        ? `${academicSession}-${intakeMonth === 'October' ? '1' : '2'}`
        : null

    const [selectedCodes, setSelectedCodes] = useState([])
    const [lecturersByCourse, setLecturersByCourse] = useState({})
    const [preferences, setPreferences] = useState({})
    const [loadingLecturers, setLoadingLecturers] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const MAX_COURSES = 8

    const totalCreditHours = availableCourses
        .filter(c => selectedCodes.includes(c.courseCode))
        .reduce((sum, c) => sum + c.creditHours, 0)

    // Filter courses by search query
    const filteredCourses = availableCourses.filter(course =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        if (availableCourses.length === 0) return
        const allCodes = availableCourses.map(c => c.courseCode)
        setLoadingLecturers(true)
        getLecturersForCourses(allCodes, semesterNumber, intakeMonth, academicYear)
            .then(data => {
                const grouped = {}
                data.forEach(row => {
                    if (!grouped[row.courseCode]) grouped[row.courseCode] = []
                    grouped[row.courseCode].push(row)
                })
                setLecturersByCourse(grouped)
            })
            .catch(() => {})
            .finally(() => setLoadingLecturers(false))
    }, [availableCourses, semesterNumber, intakeMonth, academicYear])

    const handleToggle = (courseCode) => {
        if (selectedCodes.includes(courseCode)) {
            setSelectedCodes(selectedCodes.filter(c => c !== courseCode))
            const newPrefs = { ...preferences }
            delete newPrefs[courseCode]
            setPreferences(newPrefs)
        } else {
            if (selectedCodes.length >= MAX_COURSES) {
                alert(`You can only select a maximum of ${MAX_COURSES} courses at a time.`)
                return
            }
            setSelectedCodes([...selectedCodes, courseCode])
        }
    }

    const handlePreferenceChange = (courseCode, lecturerID) => {
        setPreferences(prev => ({ ...prev, [courseCode]: lecturerID }))
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

    const handleGenerate = async () => {
        if (selectedCodes.length === 0) {
            setErrorMessage('Please select at least one course.')
            return
        }

        const studentID = localStorage.getItem('studentID')
        if (!studentID) {
            setErrorMessage('Student not found. Please log in again.')
            return
        }

        setGenerating(true)
        setErrorMessage('')

        try {
            await saveSelectedCourses(studentID, selectedCodes, semesterID)
            const data = await generatePatterns(studentID, semesterID, academicYear)

            let filteredPatterns = data.patterns
            const hasPreferences = Object.values(preferences).some(v => v && v !== '')

            if (hasPreferences) {
                filteredPatterns = data.patterns.filter(pattern =>
                    pattern.every(section => {
                        const pref = preferences[section.courseCode]
                        if (!pref) return true
                        return section.lecturerID === pref
                    })
                )
            }

            navigate('/courses/patterns', {
                state: {
                    patterns: filteredPatterns.length > 0 ? filteredPatterns : data.patterns,
                    totalPatterns: filteredPatterns.length > 0 ? filteredPatterns.length : data.patterns.length,
                    preferenceApplied: hasPreferences && filteredPatterns.length > 0,
                    noPreferenceMatch: hasPreferences && filteredPatterns.length === 0,
                    studentID,
                    semesterID,
                    semesterNumber,
                    intakeMonth,
                    academicSession,
                    intakeID,
                    selectedCodes,
                    preferences,
                    academicYear
                }
            })
        } catch (err) {
            setErrorMessage(err.message || 'Unable to generate patterns. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="container" style={{ paddingBottom: '180px' }}>
        <header>
            <span
                onClick={() => navigate(-1)}
                style={{
                    fontSize: '70px',
                    color: '#8b0000',
                    cursor: 'pointer',
                    fontWeight: '900',
                    lineHeight: '1',
                    userSelect: 'none',
                    transition: 'all 0.2s'
                }}
            >
                ‹
            </span>
            <h1>Select Courses</h1>
        </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            {/* Search box */}
            <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    placeholder="Search by course name or code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <i
                        className="fas fa-times"
                        style={{ color: '#aaa', cursor: 'pointer' }}
                        onClick={() => setSearchQuery('')}
                    />
                )}
            </div>

            {/* Search result count */}
            {searchQuery && (
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', marginTop: '-8px' }}>
                    {filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
            )}

                {errorMessage && (
                    <div className="warning-card">
                        <i className="fas fa-triangle-exclamation"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}

            {/* No search results */}
            {filteredCourses.length === 0 && searchQuery && (
                <div className="no-pref-card">
                    <i className="fas fa-magnifying-glass"></i>
                    <p>No courses found for "{searchQuery}"</p>
                </div>
            )}

            <div className="courses-grid">
                {filteredCourses.map(course => {
                    const isSelected = selectedCodes.includes(course.courseCode)
                    const lecturers = lecturersByCourse[course.courseCode] || []
                    const hasPref = preferences[course.courseCode] && preferences[course.courseCode] !== ''

                    return (
                        <div
                            key={course.courseCode}
                            className={`course-card ${isSelected ? 'selected' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleToggle(course.courseCode)}
                        >
                            {/* Course row */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                <div
                                    className="checkbox"
                                    style={{
                                        background: isSelected ? '#22a559' : '#fff',
                                        borderColor: isSelected ? '#22a559' : '#ddd'
                                    }}
                                >
                                    {isSelected && (
                                        <i className="fas fa-check" style={{ color: '#fff' }}></i>
                                    )}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div className="course-header">
                                        <span className="course-code">{course.courseCode}</span>
                                        <span className="credit-badge">{course.creditHours} Credits</span>
                                    </div>
                                    <p className="course-name">{course.courseName}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="sections-info">
                                            {course.slotType === 'fixed' ? 'Required' :
                                             course.slotType === 'elective_group' ? `Elective — Pick ${course.pickCount}` :
                                             'Free Elective'}
                                        </span>
                                        {course.hasPrerequisite && (
                                            <span
                                                style={{ fontSize: '12px', color: '#d4af37', cursor: 'pointer' }}
                                                onClick={(e) => handleViewPrerequisite(e, course)}
                                            >
                                                <i className="fas fa-exclamation-circle"></i> Prerequisite
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Lecturer preference */}
                            {isSelected && (
                                <div
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        marginTop: '14px',
                                        background: hasPref ? '#e8f8ee' : '#fff8e1',
                                        border: `1px solid ${hasPref ? '#b7ebc8' : '#ffe082'}`,
                                        borderRadius: '10px',
                                        padding: '12px 14px'
                                    }}
                                >
                                    <label style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: hasPref ? '#22a559' : '#856404',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <i className={`fas ${hasPref ? 'fa-circle-check' : 'fa-chalkboard-teacher'}`}></i>
                                        {hasPref ? 'Lecturer Preference Set' : 'Set Lecturer Preference (Optional)'}
                                    </label>
                                    <select
                                        value={preferences[course.courseCode] || ''}
                                        onChange={e => handlePreferenceChange(course.courseCode, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '10px',
                                            border: `1px solid ${hasPref ? '#b7ebc8' : '#ffe082'}`,
                                            fontSize: '14px',
                                            color: '#333',
                                            background: '#fff',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">👤 No Preference — Show All Sections</option>
                                        {loadingLecturers && (
                                            <option disabled>Loading lecturers...</option>
                                        )}
                                        {lecturers.map(lec => (
                                            <option key={lec.lecturerID} value={lec.lecturerID}>
                                                ✓ {lec.lecturerName} (Sec: {lec.assignedSections})
                                            </option>
                                        ))}
                                        {!loadingLecturers && lecturers.length === 0 && (
                                            <option disabled>No lecturer info available</option>
                                        )}
                                    </select>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Sticky bottom */}
            <div className="sticky-bottom">
                <div className="summary-row">
                    <div className="summary-item">
                        <div className="value">{selectedCodes.length}</div>
                        <div className="label">Selected</div>
                    </div>
                    <div className="summary-item">
                        <div className="value">{totalCreditHours}</div>
                        <div className="label">Credit Hours</div>
                    </div>
                    <div className="summary-item">
                        <div className="value">{Object.values(preferences).filter(v => v).length}</div>
                        <div className="label">Preferences Set</div>
                    </div>
                </div>
                <button
                    className="btn primary"
                    disabled={selectedCodes.length === 0 || generating}
                    onClick={handleGenerate}
                >
                    <i className="fas fa-wand-magic-sparkles"></i>
                    {generating ? 'Generating...' : 'Generate Clash Free Patterns'}
                </button>
            </div>
        </div>
    )
}

export default SelectCourses
