import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveSelectedPattern } from '../../services/courseService'
import './courses.css'

function SelectPattern() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        pattern = [],
        patternIndex,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        patterns,
        totalPatterns
    } = location.state || {}

    const [status, setStatus] = useState('idle') // idle | confirm | saving | saved | error
    const [errorMessage, setErrorMessage] = useState('')

    const totalCredits = pattern.reduce((sum, s) => sum + (s.creditHours || 0), 0)

    const handleSelectClick = () => {
        setStatus('confirm')
    }

    const handleConfirm = async () => {
        setStatus('saving')
        try {
            await saveSelectedPattern(studentID, semesterID, pattern)
            setStatus('saved')
        } catch (err) {
            setStatus('error')
            setErrorMessage('Unable to save your selected pattern at this time. Please try again later.')
        }
    }

    const handleCancel = () => {
        setStatus('idle')
    }

    const handleBack = () => {
        navigate('/courses/patterns', {
            state: { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={handleBack}></i>
                <h1>Pattern Details</h1>
            </header>
            <p className="subtitle">Full schedule breakdown</p>

            {/* Pattern meta */}
            <div className="pattern-meta-card">
                <div>
                    <h2>Pattern {patternIndex + 1}</h2>
                    <p>{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>
                </div>
                <span className="clash-free-badge">
                    <i className="fas fa-check"></i> Clash Free
                </span>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="value">{pattern.length}</div>
                    <div className="label">Courses</div>
                </div>
                <div className="stat-card">
                    <div className="value">{totalCredits}</div>
                    <div className="label">Credit Hours</div>
                </div>
                <div className="stat-card">
                    <div className="value">{[...new Set(pattern.map(s => s.day))].length}</div>
                    <div className="label">Days/Week</div>
                </div>
            </div>

            {/* Course detail cards */}
            {pattern.map((section, i) => (
                <div key={i} className="course-detail-card">
                    <div className="course-detail-header">
                        <span className="course-code">{section.courseCode}</span>
                        <span className="section-number">Section {section.sectionNumber}</span>
                    </div>
                    <p className="course-name">{section.courseName}</p>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-label">Lecturer</div>
                            <div className="detail-value">{section.lecturerName || 'TBA'}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Day</div>
                            <div className="detail-value">{section.day}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Time</div>
                            <div className="detail-value">{section.timeStart?.slice(0,5)} — {section.timeEnd?.slice(0,5)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Venue</div>
                            <div className="detail-value">{section.venue || 'TBA'}</div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Success state */}
            {status === 'saved' && (
                <div className="success-card">
                    <i className="fas fa-circle-check"></i>
                    <h3>Pattern Saved Successfully</h3>
                    <p>Your preferred pattern has been saved. Please proceed to register on the UTM student portal based on this pattern.</p>
                </div>
            )}

            {/* Error state */}
            {status === 'error' && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Buttons */}
            {status !== 'saved' && (
                <div className="sticky-bottom">
                    <button className="btn primary" onClick={handleSelectClick} disabled={status === 'saving'}>
                        <i className="fas fa-bookmark"></i>
                        {status === 'saving' ? 'Saving...' : 'Select This Pattern'}
                    </button>
                    <button className="btn outline" onClick={handleBack}>
                        <i className="fas fa-arrow-left"></i>
                        Back to Patterns
                    </button>
                </div>
            )}

            {/* Confirmation modal */}
            {status === 'confirm' && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Confirm Selection</h2>
                        <p>Are you sure you want to select Pattern {patternIndex + 1} as your registration plan?</p>
                        <div className="modal-pattern-preview">
                            <h4>Pattern {patternIndex + 1} Summary</h4>
                            {pattern.map((s, i) => (
                                <div key={i} className="preview-row">
                                    <span>{s.courseCode} — S{s.sectionNumber}</span>
                                    <span>{s.day} {s.timeStart?.slice(0,5)}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn primary" onClick={handleConfirm}>
                            <i className="fas fa-check"></i>
                            Confirm
                        </button>
                        <button className="btn outline" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SelectPattern
