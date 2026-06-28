import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import RegistrationStepper from './RegistrationStepper'
import '../courses/courses.css'
import './registration.css'

function ReportRegistration() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        selectedPattern = [],
        patternIndex = 0,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        patterns,
        totalPatterns
    } = location.state || {}

    const totalCredits = selectedPattern.reduce((s, p) => s + (p.creditHours || 0), 0)
    const days = [...new Set(selectedPattern.map(p => p.day))]
    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Registration Report</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            <RegistrationStepper current={3} />

            {/* Success banner */}
            <div className="success-card">
                <i className="fas fa-circle-check"></i>
                <h3>Blueprint Ready for Registration!</h3>
                <p>Your registration plan is complete. Log in to the UTM student portal during your allocated registration time slot and use this plan to register.</p>
            </div>

            {/* Summary header card */}
            <div className="pattern-meta-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2>Pattern {patternIndex + 1} — Final Blueprint</h2>
                        <p style={{ marginTop: '6px', opacity: 0.85 }}>
                            {academicSession} • {intakeMonth} Intake • Semester {semesterNumber}
                        </p>
                    </div>
                    <span className="clash-free-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                        <i className="fas fa-check"></i> Clash Free
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{selectedPattern.length}</div>
                        <div style={{ fontSize: '12px', opacity: 0.75 }}>Courses</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{totalCredits}</div>
                        <div style={{ fontSize: '12px', opacity: 0.75 }}>Credit Hours</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{days.length}</div>
                        <div style={{ fontSize: '12px', opacity: 0.75 }}>Days/Week</div>
                    </div>
                </div>
            </div>

            {/* Course table */}
            {selectedPattern.length > 0 ? (
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Course Name</th>
                                <th>Sec</th>
                                <th>Lecturer</th>
                                <th>Day</th>
                                <th>Time</th>
                                <th>Venue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPattern.map((s, i) => (
                                <tr key={i}>
                                    <td style={{ color: '#aaa', fontSize: '12px' }}>{i + 1}</td>
                                    <td><strong style={{ color: '#8b0000' }}>{s.courseCode}</strong></td>
                                    <td style={{ maxWidth: '160px' }}>{s.courseName}</td>
                                    <td style={{ textAlign: 'center' }}>{s.sectionNumber}</td>
                                    <td>{s.lecturerName || 'TBA'}</td>
                                    <td>{s.day}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{s.timeStart?.slice(0, 5)} – {s.timeEnd?.slice(0, 5)}</td>
                                    <td>{s.venue || 'TBA'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>No course data found. Please go back and select a pattern.</span>
                </div>
            )}

            <div className="warning-card">
                <i className="fas fa-triangle-exclamation"></i>
                <span>
                    Section availability may change. Always register during your allocated time slot on the UTM student portal. This plan is a simulation only.
                </span>
            </div>

            <div className="sticky-bottom">
                <button
                    className="btn primary"
                    onClick={() => navigate('/registration/simulate-drop', {
                        state: { selectedPattern, ...navState }
                    })}
                >
                    <i className="fas fa-arrow-down-from-line"></i>
                    Simulate Course Drop
                </button>
                <button
                    className="btn outline"
                    onClick={() => navigate('/registration/gap-filling', {
                        state: { selectedPattern, ...navState }
                    })}
                >
                    <i className="fas fa-puzzle-piece"></i>
                    Check Gap Filling
                </button>
                <button
                    className="btn outline"
                    onClick={() => navigate('/registration/partial-recovery', {
                        state: { selectedPattern, ...navState }
                    })}
                >
                    <i className="fas fa-rotate-right"></i>
                    Partial Recovery
                </button>
            </div>
        </div>
    )
}

export default ReportRegistration
