import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getActivePattern } from '../../services/courseService'
import '../courses/courses.css'
import './registration.css'

const MIN_CREDITS = 9

function SimulateCourseDrop() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        selectedPattern: passedPattern,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        patterns,
        totalPatterns
    } = location.state || {}

    const [pattern, setPattern] = useState(passedPattern || [])
    const [loading, setLoading] = useState(!passedPattern && !!studentID)
    const [droppingCode, setDroppingCode] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        if (passedPattern || !studentID) return
        getActivePattern(studentID)
            .then(data => setPattern(Array.isArray(data) ? data : []))
            .catch(() => setPattern([]))
            .finally(() => setLoading(false))
    }, [passedPattern, studentID])

    const totalCredits = pattern.reduce((s, p) => s + (p.creditHours || 0), 0)
    const droppedSection = droppingCode ? pattern.find(s => s.courseCode === droppingCode) : null
    const droppedCredits = droppedSection?.creditHours || 3
    const remainingCredits = droppingCode ? totalCredits - droppedCredits : totalCredits
    const isSafe = remainingCredits >= MIN_CREDITS
    const remainingPattern = pattern.filter(s => s.courseCode !== droppingCode)

    const handleToggleDrop = (code) => {
        setDroppingCode(prev => prev === code ? null : code)
        setShowConfirm(false)
    }

    const handleConfirmDrop = () => {
        const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }
        navigate('/registration/select-final', {
            state: { selectedPattern: remainingPattern, patternIndex: 0, ...navState }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Simulate Course Drop</h1>
            </header>
            <p className="subtitle">See the impact before you decide to drop</p>

            <div className="info-note">
                <i className="fas fa-info-circle"></i>
                <p>Tap any course to simulate dropping it. CourseBuddy will show the credit impact before you commit to the change.</p>
            </div>

            {loading ? (
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading Your Blueprint...</h2>
                    <p>Fetching your registered courses.</p>
                </div>
            ) : pattern.length === 0 ? (
                <div className="no-pattern-card" style={{ display: 'block' }}>
                    <i className="fas fa-circle-xmark"></i>
                    <h3>No Blueprint Found</h3>
                    <p>Please go back and select a final blueprint first.</p>
                </div>
            ) : (
                <>
                    {/* Credit summary */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="value">{totalCredits}</div>
                            <div className="label">Total Credits</div>
                        </div>
                        <div className="stat-card">
                            <div className="value" style={{ color: droppingCode ? (isSafe ? '#e67e22' : '#c0392b') : '#22a559' }}>
                                {remainingCredits}
                            </div>
                            <div className="label">After Drop</div>
                        </div>
                        <div className="stat-card">
                            <div className="value" style={{ color: '#888' }}>{MIN_CREDITS}</div>
                            <div className="label">Min. Required</div>
                        </div>
                    </div>

                    {/* Impact card */}
                    {droppingCode && (
                        <div className={`drop-impact-card ${isSafe ? 'safe' : ''}`}>
                            <h4>
                                <i className={`fas ${isSafe ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                                {isSafe ? 'Safe to Drop' : 'Warning: Below Minimum Credits'}
                            </h4>
                            <div className="impact-row">
                                <span>Dropping</span>
                                <strong>{droppingCode} — {droppedSection?.courseName}</strong>
                            </div>
                            <div className="impact-row">
                                <span>Credits removed</span>
                                <strong>{droppedCredits} Credit Hours</strong>
                            </div>
                            <div className="impact-row">
                                <span>Remaining credits</span>
                                <strong style={{ color: isSafe ? '#22a559' : '#c0392b' }}>
                                    {remainingCredits} CH (min. {MIN_CREDITS} required)
                                </strong>
                            </div>
                            {!isSafe && (
                                <p style={{ fontSize: '13px', color: '#c0392b', marginTop: '8px', lineHeight: '1.5' }}>
                                    Dropping this course puts you below the minimum credit requirement. Consider deferring or finding an alternative course instead.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Course list */}
                    <div className="section">
                        <label>Tap a Course to Simulate Drop</label>
                    </div>

                    {pattern.map((s, i) => {
                        const isDropping = droppingCode === s.courseCode
                        return (
                            <div
                                key={i}
                                className={`drop-course-row ${isDropping ? 'dropping' : ''}`}
                                onClick={() => handleToggleDrop(s.courseCode)}
                            >
                                <div className="drop-check">
                                    {isDropping && <i className="fas fa-xmark"></i>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: isDropping ? '#c0392b' : '#333', fontSize: '14px' }}>
                                        {s.courseCode} — Section {s.sectionNumber}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                                        {s.courseName}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                                        {s.day} {s.timeStart?.slice(0, 5)}–{s.timeEnd?.slice(0, 5)} • {s.lecturerName || 'TBA'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: isDropping ? '#c0392b' : '#8b0000' }}>
                                        {s.creditHours || 3} CH
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
            )}

            <div className="sticky-bottom">
                {droppingCode && (
                    <button
                        className="btn danger"
                        onClick={() => setShowConfirm(true)}
                    >
                        <i className="fas fa-arrow-down-from-line"></i>
                        Apply Drop — Update Blueprint
                    </button>
                )}
                <button className="btn outline" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i>
                    Back
                </button>
            </div>

            {/* Confirmation modal */}
            {showConfirm && droppingCode && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-icon">
                            <i className="fas fa-arrow-down-from-line" style={{ color: '#c0392b' }}></i>
                        </div>
                        <h2>Confirm Course Drop</h2>
                        <p>
                            Remove <strong>{droppingCode}</strong> from your blueprint?
                            You will have <strong style={{ color: isSafe ? '#22a559' : '#c0392b' }}>
                                {remainingCredits} credit hours
                            </strong> remaining.
                            {!isSafe && ' This is below the minimum requirement.'}
                        </p>
                        <div className="modal-pattern-preview">
                            <h4>Dropping: {droppingCode}</h4>
                            <div className="preview-row">
                                <span>{droppedSection?.courseName}</span>
                                <span>{droppedCredits} CH</span>
                            </div>
                            <div className="preview-row">
                                <span>{droppedSection?.day} {droppedSection?.timeStart?.slice(0, 5)}</span>
                                <span>Section {droppedSection?.sectionNumber}</span>
                            </div>
                        </div>
                        <button className="btn danger" onClick={handleConfirmDrop}>
                            <i className="fas fa-check"></i>
                            Yes, Update Blueprint
                        </button>
                        <button className="btn outline" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SimulateCourseDrop
