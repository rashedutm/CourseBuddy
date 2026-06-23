import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './courses.css'

function ViewPatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        patterns = [],
        totalPatterns = 0,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID
    } = location.state || {}

    const [savedPatternIndex] = useState(null)

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
                patterns,
                totalPatterns
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

    if (!patterns || patterns.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Generated Patterns</h1>
                </header>
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>No patterns available. Please go back and generate patterns again.</span>
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

            {/* Total count */}
            <div className="summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Total Clash Free Patterns</h3>
                    <span style={{ fontSize: '26px', fontWeight: '700' }}>{totalPatterns} Patterns</span>
                </div>
                <i className="fas fa-wand-magic-sparkles" style={{ fontSize: '32px', opacity: '0.4' }}></i>
            </div>

            {/* Set lecturer preference button */}
            <button className="btn outline" style={{ marginBottom: '20px' }} onClick={handleSetPreference}>
                <i className="fas fa-sliders"></i>
                Set Lecturer Preference
            </button>

            {/* Pattern list */}
            <div className="patterns-grid">
            {patterns.map((pattern, index) => {
                const courses = pattern
                const totalCredits = courses.reduce((sum, s) => sum + (s.creditHours || 0), 0)
                const isSaved = savedPatternIndex === index

                return (
                    <div
                        key={index}
                        className={`pattern-card ${isSaved ? 'selected-pattern' : ''}`}
                    >
                        <div className="pattern-header">
                            <span className="pattern-number">Pattern {index + 1}</span>
                            <span className={`pattern-badge ${isSaved ? 'saved-badge' : 'new-badge'}`}>
                                {isSaved ? '⭐ Saved' : 'Clash Free'}
                            </span>
                        </div>

                        {courses.map((section, i) => (
                            <div key={i} className="section-row">
                                <span className="course">{section.courseCode}</span>
                                <span className="section">S{section.sectionNumber}</span>
                                <span className="time">{section.day} {section.timeStart?.slice(0,5)}-{section.timeEnd?.slice(0,5)}</span>
                            </div>
                        ))}

                        <div className="pattern-footer">
                            <span>{courses.length} Courses • {totalCredits} Credit Hours</span>
                            <button
                                className="view-btn"
                                onClick={() => handleViewDetails(pattern, index)}
                            >
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
