import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveSelectedCourses, generatePatterns } from '../../services/courseService'
import './courses.css'

function ViewPatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        patterns = [],
        totalPatterns = 0,
        preferenceApplied = false,
        noPreferenceMatch = false,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        selectedCodes = [],
        preferences = {},
        academicYear
    } = location.state || {}

    const [currentPatterns, setCurrentPatterns] = useState(patterns)
    const [currentTotal, setCurrentTotal] = useState(totalPatterns)
    const [regenerating, setRegenerating] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleRegenerate = async () => {
        setRegenerating(true)
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

            const finalPatterns = filteredPatterns.length > 0 ? filteredPatterns : data.patterns
            setCurrentPatterns(finalPatterns)
            setCurrentTotal(finalPatterns.length)
        } catch (err) {
            setErrorMessage('Unable to regenerate patterns. Please try again.')
        } finally {
            setRegenerating(false)
        }
    }

    const handleViewDetails = (pattern, index) => {
        navigate('/courses/patterns/select', {
            state: {
                pattern,
                patternIndex: index,
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                patterns: currentPatterns,
                totalPatterns: currentTotal
            }
        })
    }

    const handleSetPreference = () => {
        navigate('/courses/lecturer-preference', {
            state: {
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                patterns,
                totalPatterns
            }
        })
    }

    const handleGoToRegistration = () => {
        navigate('/registration/filter', {
            state: {
                patterns,
                totalPatterns,
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID
            }
        })
    }

    if (!currentPatterns || currentPatterns.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Generated Patterns</h1>
                </header>
                <div className="no-pattern-card" style={{ display: 'block' }}>
                    <i className="fas fa-circle-xmark"></i>
                    <h3>No Clash Free Pattern Found</h3>
                    <p>No clash free pattern could be generated for your selected courses. Please go back and try different courses.</p>
                </div>
                <button className="btn outline" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i>
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Generated Patterns</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            {/* Summary card */}
            <div className="summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Clash Free Patterns</h3>
                    <span style={{ fontSize: '26px', fontWeight: '700' }}>{currentTotal} Patterns</span>
                    {preferenceApplied && (
                        <p style={{ fontSize: '12px', opacity: '0.8', marginTop: '4px' }}>
                            <i className="fas fa-check"></i> Filtered by lecturer preference
                        </p>
                    )}
                </div>
                <i className="fas fa-wand-magic-sparkles" style={{ fontSize: '32px', opacity: '0.4' }}></i>
            </div>

            {/* Set lecturer preference button */}
            <button className="btn outline" style={{ marginBottom: '12px' }} onClick={handleSetPreference}>
                <i className="fas fa-sliders"></i>
                Set Lecturer Preference
            </button>

            {/* No preference match warning */}
            {noPreferenceMatch && (
                <div className="warning-card">
                    <i className="fas fa-triangle-exclamation"></i>
                    <span>No patterns matched your lecturer preference. Showing all available patterns instead.</span>
                </div>
            )}

            {/* Error */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Regenerate button */}
            <button
                className="btn outline"
                style={{ marginBottom: '20px' }}
                onClick={handleRegenerate}
                disabled={regenerating}
            >
                <i className="fas fa-rotate"></i>
                {regenerating ? 'Regenerating...' : 'Regenerate (Get Different Patterns)'}
            </button>

            <button className="btn primary" style={{ marginBottom: '20px' }} onClick={handleGoToRegistration}>
                <i className="fas fa-table-cells-large"></i>
                Go to Registration Simulation
            </button>

            {/* Pattern list */}
            <div className="patterns-grid">
                {currentPatterns.map((pattern, index) => {
                    const totalCredits = pattern.reduce((sum, s) => sum + (s.creditHours || 0), 0)
                    return (
                        <div
                            key={index}
                            className="pattern-card"
                            onClick={() => handleViewDetails(pattern, index)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="pattern-header">
                                <span className="pattern-number">Pattern {index + 1}</span>
                                <span className="clash-free-badge">
                                    <i className="fas fa-check"></i> Clash Free
                                </span>
                            </div>

                            {pattern.map((section, i) => (
                                <div key={i} className="section-row">
                                    <span className="course">{section.courseCode}</span>
                                    <span className="section">S{section.sectionNumber}</span>
                                    <span className="time">{section.day} {section.timeStart?.slice(0, 5)}-{section.timeEnd?.slice(0, 5)}</span>
                                </div>
                            ))}

                            <div className="pattern-footer">
                                <span>{pattern.length} Courses • {totalCredits} Credit Hours</span>
                                <button className="view-btn" onClick={e => { e.stopPropagation(); handleViewDetails(pattern, index) }}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ViewPatterns
