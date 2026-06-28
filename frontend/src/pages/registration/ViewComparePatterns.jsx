import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import RegistrationStepper from './RegistrationStepper'
import '../courses/courses.css'
import './registration.css'

function ViewComparePatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        patternA = [],
        patternIndexA = 0,
        patternB = [],
        patternIndexB = 1,
        patterns,
        totalPatterns,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID
    } = location.state || {}

    const creditsA = patternA.reduce((s, p) => s + (p.creditHours || 0), 0)
    const creditsB = patternB.reduce((s, p) => s + (p.creditHours || 0), 0)
    const daysA = [...new Set(patternA.map(p => p.day))]
    const daysB = [...new Set(patternB.map(p => p.day))]

    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    const selectPattern = (pattern, index) => {
        navigate('/registration/select-final', {
            state: { selectedPattern: pattern, patternIndex: index, ...navState }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Compare Patterns</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            <RegistrationStepper current={1} />

            <div className="info-note" style={{ marginBottom: '20px' }}>
                <i className="fas fa-info-circle"></i>
                <p>Compare the two patterns side by side and choose the one that fits your schedule best.</p>
            </div>

            <div className="compare-grid">
                <div className="compare-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Pattern {patternIndexA + 1}</h3>
                        <span className="clash-free-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Clash Free</span>
                    </div>

                    {patternA.map((s, i) => (
                        <div key={i} className="compare-section-row">
                            <span className="code">{s.courseCode} — S{s.sectionNumber}</span>
                            <span className="time-info">{s.day} {s.timeStart?.slice(0, 5)}–{s.timeEnd?.slice(0, 5)}</span>
                            <span style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{s.lecturerName || 'TBA'}</span>
                        </div>
                    ))}

                    <div className="compare-stat-row">
                        <span>{creditsA} Credits</span>
                        <span>{daysA.length} Days/Week</span>
                    </div>

                    <button
                        className="btn primary"
                        style={{ marginTop: '14px', marginBottom: '0' }}
                        onClick={() => selectPattern(patternA, patternIndexA)}
                    >
                        <i className="fas fa-check"></i>
                        Choose Pattern {patternIndexA + 1}
                    </button>
                </div>

                <div className="compare-panel panel-b">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Pattern {patternIndexB + 1}</h3>
                        <span className="clash-free-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Clash Free</span>
                    </div>

                    {patternB.map((s, i) => (
                        <div key={i} className="compare-section-row">
                            <span className="code" style={{ color: '#2980b9' }}>{s.courseCode} — S{s.sectionNumber}</span>
                            <span className="time-info">{s.day} {s.timeStart?.slice(0, 5)}–{s.timeEnd?.slice(0, 5)}</span>
                            <span style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{s.lecturerName || 'TBA'}</span>
                        </div>
                    ))}

                    <div className="compare-stat-row">
                        <span>{creditsB} Credits</span>
                        <span>{daysB.length} Days/Week</span>
                    </div>

                    <button
                        style={{ marginTop: '14px', marginBottom: '0', background: '#2980b9', color: '#fff', borderRadius: '15px', width: '100%', padding: '14px', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}
                        onClick={() => selectPattern(patternB, patternIndexB)}
                    >
                        <i className="fas fa-check"></i>
                        Choose Pattern {patternIndexB + 1}
                    </button>
                </div>
            </div>

            <button className="btn outline" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
                Back to Filter
            </button>
        </div>
    )
}

export default ViewComparePatterns
