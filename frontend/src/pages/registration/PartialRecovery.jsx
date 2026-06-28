import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getActivePattern } from '../../services/courseService'
import '../courses/courses.css'
import './registration.css'

const RECOVERY_OPTIONS = ['Different Section', 'Waitlist', 'Defer to Next Sem']

function PartialRecovery() {
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
    const [courseStatus, setCourseStatus] = useState({})
    const [recoveryPlan, setRecoveryPlan] = useState({})

    const buildStatus = (arr) => {
        const statusMap = {}
        arr.forEach((s, i) => { statusMap[s.courseCode] = i % 3 !== 1 })
        return statusMap
    }

    useEffect(() => {
        if (passedPattern && passedPattern.length > 0) {
            setCourseStatus(buildStatus(passedPattern))
            return
        }
        if (!studentID) return
        getActivePattern(studentID)
            .then(data => {
                const arr = Array.isArray(data) ? data : []
                setPattern(arr)
                setCourseStatus(buildStatus(arr))
            })
            .catch(() => setPattern([]))
            .finally(() => setLoading(false))
    }, [passedPattern, studentID])

    const setRecovery = (code, option) => {
        setRecoveryPlan(prev => ({ ...prev, [code]: option }))
    }

    const failedCourses = pattern.filter(s => courseStatus[s.courseCode] === false)
    const registeredCourses = pattern.filter(s => courseStatus[s.courseCode] !== false)
    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Partial Recovery</h1>
            </header>
            <p className="subtitle">Resolve courses that failed to register</p>

            <div className="warning-card">
                <i className="fas fa-triangle-exclamation"></i>
                <span>
                    Some courses in your blueprint could not be registered. Choose a recovery action for each failed course below.
                </span>
            </div>

            {loading ? (
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading Registration Status...</h2>
                    <p>Checking which courses were registered successfully.</p>
                </div>
            ) : pattern.length === 0 ? (
                <div className="no-pattern-card" style={{ display: 'block' }}>
                    <i className="fas fa-circle-xmark"></i>
                    <h3>No Blueprint Found</h3>
                    <p>Please go back and select a final blueprint first.</p>
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="value" style={{ color: '#22a559' }}>{registeredCourses.length}</div>
                            <div className="label">Registered</div>
                        </div>
                        <div className="stat-card">
                            <div className="value" style={{ color: '#c0392b' }}>{failedCourses.length}</div>
                            <div className="label">Failed</div>
                        </div>
                        <div className="stat-card">
                            <div className="value">{pattern.length}</div>
                            <div className="label">Total</div>
                        </div>
                    </div>

                    {/* Registered */}
                    {registeredCourses.length > 0 && (
                        <>
                            <div className="section">
                                <label>Successfully Registered</label>
                            </div>
                            {registeredCourses.map((s, i) => (
                                <div key={i} className="recovery-course-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span className="course-code">{s.courseCode}</span>
                                            <p style={{ fontSize: '14px', marginTop: '6px', color: '#555' }}>{s.courseName}</p>
                                            <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                                Section {s.sectionNumber} • {s.day} {s.timeStart?.slice(0, 5)}
                                            </p>
                                        </div>
                                        <span className="recovery-status-badge status-registered">
                                            <i className="fas fa-check"></i> Registered
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Failed */}
                    {failedCourses.length > 0 && (
                        <>
                            <div className="section" style={{ marginTop: '10px' }}>
                                <label>Failed — Choose Recovery Action</label>
                            </div>
                            {failedCourses.map((s, i) => (
                                <div key={i} className="recovery-course-card failed">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div>
                                            <span className="course-code">{s.courseCode}</span>
                                            <p style={{ fontSize: '14px', marginTop: '6px', color: '#555' }}>{s.courseName}</p>
                                            <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                                Section {s.sectionNumber} — Section was full
                                            </p>
                                        </div>
                                        <span className="recovery-status-badge status-failed">
                                            <i className="fas fa-xmark"></i> Failed
                                        </span>
                                    </div>
                                    <div className="recovery-option">
                                        <p>Select a recovery action:</p>
                                        <div className="recovery-option-btns">
                                            {RECOVERY_OPTIONS.map(opt => (
                                                <button
                                                    key={opt}
                                                    className={`rec-btn ${recoveryPlan[s.courseCode] === opt ? 'selected' : ''}`}
                                                    onClick={() => setRecovery(s.courseCode, opt)}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {failedCourses.length === 0 && (
                        <div className="success-card">
                            <i className="fas fa-circle-check"></i>
                            <h3>All Courses Registered!</h3>
                            <p>Your blueprint was fully registered. No recovery needed.</p>
                        </div>
                    )}
                </>
            )}

            <div className="sticky-bottom">
                <button
                    className="btn primary"
                    onClick={() => navigate('/registration/gap-filling', {
                        state: { selectedPattern: pattern, ...navState }
                    })}
                >
                    <i className="fas fa-puzzle-piece"></i>
                    Find Alternative Sections
                </button>
                <button className="btn outline" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i>
                    Back
                </button>
            </div>
        </div>
    )
}

export default PartialRecovery
