import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './courses.css'

function FilteredPatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        lecturerPreferences = {},
        patterns = [],
        totalPatterns
    } = location.state || {}

    const [filteredPatterns, setFilteredPatterns] = useState([])
    const [noPatternFound, setNoPatternFound] = useState(false)

    useEffect(() => {
        // Filter patterns based on lecturer preferences in frontend
        // For courses with a preference, only keep patterns where that section
        // is taught by the preferred lecturer
        const filtered = patterns.filter(pattern => {
            return pattern.every(section => {
                const pref = lecturerPreferences[section.courseCode]
                if (!pref) return true
                return section.lecturerID === pref
            })
        })

        if (filtered.length === 0) {
            setNoPatternFound(true)
        } else {
            setFilteredPatterns(filtered)
        }
    }, [patterns, lecturerPreferences])

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
                patterns: filteredPatterns,
                totalPatterns: filteredPatterns.length
            }
        })
    }

    const handleGenerateWithoutPref = () => {
        navigate('/courses/generate-without-pref', {
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

    const handleAdjustPreferences = () => {
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

    // UC012 — patterns here are the unfiltered set, so ResetPreference can show
    // them again once the preferences are cleared.
    const handleResetPreferences = () => {
        navigate('/courses/reset-preference', {
            state: {
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                patterns,
                totalPatterns,
                lecturerPreferences
            }
        })
    }

    const handleGoToRegistration = () => {
        navigate('/registration/filter', {
            state: {
                patterns: filteredPatterns,
                totalPatterns: filteredPatterns.length,
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID
            }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Filtered Patterns</h1>
            </header>
            <p className="subtitle">Patterns filtered by lecturer preference</p>

            {/* Applied preferences summary */}
            <div className="pref-summary-card">
                <h3>Applied Preferences</h3>
                {Object.entries(lecturerPreferences).map(([code, lecID]) => (
                    <div key={code} className="pref-row">
                        <span className="course">{code}</span>
                        <span className="lecturer" style={{ opacity: '0.85', fontSize: '13px' }}>
                            {lecID ? `Lecturer ID: ${lecID}` : 'All sections considered'}
                        </span>
                    </div>
                ))}
            </div>

            {/* No pattern found */}
            {noPatternFound ? (
                <>
                    <div className="no-pattern-card" style={{ display: 'block' }}>
                        <i className="fas fa-circle-xmark"></i>
                        <h3>No Pattern Found</h3>
                        <p>No clash free pattern could be found with your selected lecturer preferences.</p>
                    </div>
                    <button className="btn primary" onClick={handleGenerateWithoutPref}>
                        <i className="fas fa-rotate-left"></i>
                        Generate Without Preference
                    </button>
                    <button className="btn outline" onClick={handleAdjustPreferences}>
                        <i className="fas fa-sliders"></i>
                        Adjust Preferences
                    </button>
                    <button className="btn danger" onClick={handleResetPreferences}>
                        <i className="fas fa-rotate-left"></i>
                        Reset All Preferences
                    </button>
                </>
            ) : (
                <>
                    {/* Result summary */}
                    <div className="result-summary">
                        <div><h3>Filtered Patterns Found</h3></div>
                        <span className="result-badge">{filteredPatterns.length} Patterns</span>
                    </div>

                    {/* Pattern cards */}
                    {filteredPatterns.map((pattern, index) => {
                        const totalCredits = pattern.reduce((sum, s) => sum + (s.creditHours || 0), 0)
                        return (
                            <div key={index} className="pattern-card">
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
                                        <span className="time">{section.day} {section.timeStart?.slice(0,5)}-{section.timeEnd?.slice(0,5)}</span>
                                    </div>
                                ))}
                                <div className="pattern-footer">
                                    <span>{pattern.length} Courses • {totalCredits} Credit Hours</span>
                                    <button className="view-btn" onClick={() => handleViewDetails(pattern, index)}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    <button className="btn primary" style={{ marginTop: '10px' }} onClick={handleGoToRegistration}>
                        <i className="fas fa-table-cells-large"></i>
                        Go to Registration Simulation
                    </button>
                    <button className="btn outline" style={{ marginTop: '10px' }} onClick={handleAdjustPreferences}>
                        <i className="fas fa-sliders"></i>
                        Adjust Preferences
                    </button>
                    <button className="btn danger" onClick={handleResetPreferences}>
                        <i className="fas fa-rotate-left"></i>
                        Reset All Preferences
                    </button>
                </>
            )}
        </div>
    )
}

export default FilteredPatterns
