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
        preferenceApplied: initialPreferenceApplied = false,
        noPreferenceMatch: initialNoPreferenceMatch = false,
        preferenceReset = false,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        selectedCodes = [],
        preferences = {},
        academicYear,
        // The full, unfiltered result of the last generation. Kept alongside the
        // (possibly filtered) `patterns` so Reset / Adjust can restore every
        // pattern without regenerating on the server.
        allPatterns = patterns
    } = location.state || {}

    const [currentPatterns, setCurrentPatterns] = useState(patterns)
    const [currentTotal, setCurrentTotal] = useState(totalPatterns)
    const [currentAll, setCurrentAll] = useState(allPatterns)
    const [preferenceApplied, setPreferenceApplied] = useState(initialPreferenceApplied)
    const [noPreferenceMatch, setNoPreferenceMatch] = useState(initialNoPreferenceMatch)
    const [regenerating, setRegenerating] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const hasPreferences = Object.values(preferences).some(v => v && v !== '')

    const handleRegenerate = async () => {
        if (selectedCodes.length === 0 || !academicYear) {
            setErrorMessage('Your course selection was not carried over. Please go back and select your courses again.')
            return
        }
        setRegenerating(true)
        setErrorMessage('')
        try {
            await saveSelectedCourses(studentID, selectedCodes, semesterID)
            // The server re-applies the preference while building the patterns,
            // so a regenerated set still honours it.
            const data = await generatePatterns(studentID, semesterID, academicYear, preferences)

            setCurrentPatterns(data.patterns)
            setCurrentTotal(data.totalPatterns)
            setCurrentAll(data.allPatterns)
            setPreferenceApplied(data.preferenceApplied)
            setNoPreferenceMatch(data.noPreferenceMatch)
        } catch (err) {
            setErrorMessage(err.message || 'Unable to regenerate patterns. Please try again.')
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
                totalPatterns: currentTotal,
                // Passed so the details page can hand them back on Back —
                // without these, Regenerate has no courses and no academic year.
                allPatterns: currentAll,
                preferences,
                preferenceApplied,
                noPreferenceMatch,
                selectedCodes,
                academicYear
            }
        })
    }


    // Hand the *unfiltered* set to the preference page, otherwise adjusting a
    // preference would filter an already-filtered list and patterns would
    // disappear for good.
    const handleSetPreference = () => {
        navigate('/courses/lecturer-preference', {
            state: {
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                patterns: currentAll,
                totalPatterns: currentAll.length,
                preferences,
                selectedCodes,
                academicYear
            }
        })
    }

    const handleResetPreferences = () => {
        navigate('/courses/reset-preference', {
            state: {
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                patterns: currentAll,
                totalPatterns: currentAll.length,
                lecturerPreferences: preferences,
                selectedCodes,
                academicYear
            }
        })
    }

    const handleGoToRegistration = () => {
        navigate('/registration/filter', {
            state: {
                patterns: currentPatterns,
                totalPatterns: currentTotal,
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
                {hasPreferences ? 'Adjust Lecturer Preference' : 'Set Lecturer Preference'}
            </button>

            {/* Nothing to reset until a preference has actually been applied */}
            {hasPreferences && (
                <button className="btn danger" style={{ marginBottom: '12px' }} onClick={handleResetPreferences}>
                    <i className="fas fa-rotate-left"></i>
                    Reset All Preferences
                </button>
            )}

            {/* Came back from a successful reset */}
            {preferenceReset && !regenerating && (
                <div className="result-summary" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-circle-check" style={{ color: '#22a559' }}></i>
                    <span style={{ fontSize: '14px', color: '#555' }}>
                        Lecturer preferences cleared. Showing all available patterns.
                    </span>
                </div>
            )}

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
