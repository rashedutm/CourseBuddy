import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import RegistrationStepper from './RegistrationStepper'
import { saveSelectedPattern } from '../../services/courseService'
import { MOCK_ACTIVE_PATTERN } from './_mockData' // TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
import '../courses/courses.css'
import './registration.css'

const COURSE_COLORS = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#e67e22', '#16a085', '#d63031', '#2c3e50']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

function timeToRow(timeStr) {
    if (!timeStr) return 0
    const h = parseInt(timeStr.slice(0, 2))
    return h - 8 + 2
}

function dayToCol(dayStr) {
    if (!dayStr) return 0
    const d = dayStr.trim().toLowerCase()
    if (d.startsWith('mon')) return 2
    if (d.startsWith('tue')) return 3
    if (d.startsWith('wed')) return 4
    if (d.startsWith('thu')) return 5
    if (d.startsWith('fri')) return 6
    return 0
}

function FullTimetableGrid({ pattern }) {
    const courseColorMap = useMemo(() => {
        const map = {}
        let idx = 0
        pattern.forEach(s => {
            if (!map[s.courseCode]) map[s.courseCode] = COURSE_COLORS[idx++ % COURSE_COLORS.length]
        })
        return map
    }, [pattern])

    return (
        <div className="timetable-wrapper">
            <div style={{
                display: 'grid',
                gridTemplateColumns: '48px repeat(5, 1fr)',
                gridTemplateRows: `36px repeat(${HOURS.length}, 56px)`,
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)',
                minWidth: '360px',
                fontSize: '12px'
            }}>
                {/* Header */}
                <div style={{ background: '#8b0000', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                {DAY_SHORT.map(d => (
                    <div key={d} style={{
                        background: '#8b0000', color: '#fff', fontWeight: 700,
                        fontSize: '11px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {d}
                    </div>
                ))}

                {/* Time slots */}
                {HOURS.map(h => (
                    <React.Fragment key={h}>
                        <div style={{
                            background: '#fdf0f0', color: '#8b0000', fontWeight: 600,
                            fontSize: '10px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', border: '1px solid #f0f0f0'
                        }}>
                            {h}:00
                        </div>
                        {DAY_SHORT.map(d => (
                            <div key={d} style={{ border: '1px solid #f5f5f5' }}></div>
                        ))}
                    </React.Fragment>
                ))}

                {/* Course blocks */}
                {pattern.map((s, i) => {
                    const col = dayToCol(s.day)
                    const startRow = timeToRow(s.timeStart)
                    const endRow = timeToRow(s.timeEnd)
                    if (!col || !startRow || !endRow || startRow >= endRow) return null
                    return (
                        <div
                            key={i}
                            style={{
                                gridColumn: col,
                                gridRow: `${startRow} / ${endRow}`,
                                background: courseColorMap[s.courseCode],
                                borderRadius: '6px',
                                padding: '4px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#fff',
                                overflow: 'hidden',
                                margin: '3px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                lineHeight: '1.4'
                            }}
                        >
                            <div>{s.courseCode}</div>
                            <div style={{ opacity: 0.85, fontWeight: 400 }}>S{s.sectionNumber}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function SelectFinalBlueprint() {
    const navigate = useNavigate()
    const location = useLocation()

    // TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
    // Real default: selectedPattern = [] (it arrives via location.state).
    const {
        selectedPattern = MOCK_ACTIVE_PATTERN,
        patternIndex = 0,
        patterns,
        totalPatterns,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID
    } = location.state || {}

    const [status, setStatus] = useState('idle')

    const totalCredits = selectedPattern.reduce((s, p) => s + (p.creditHours || 0), 0)
    const days = [...new Set(selectedPattern.map(p => p.day))]
    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    const handleSaveDraft = async () => {
        if (!studentID || !semesterID) { setStatus('error'); return }
        setStatus('saving')
        try {
            await saveSelectedPattern(studentID, semesterID, selectedPattern)
            setStatus('saved')
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Final Blueprint</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            <RegistrationStepper current={2} />

            <div className="stats-row">
                <div className="stat-card">
                    <div className="value">{selectedPattern.length}</div>
                    <div className="label">Courses</div>
                </div>
                <div className="stat-card">
                    <div className="value">{totalCredits}</div>
                    <div className="label">Credits</div>
                </div>
                <div className="stat-card">
                    <div className="value">{days.length}</div>
                    <div className="label">Days/Week</div>
                </div>
            </div>

            {/* Timetable grid */}
            <div className="section">
                <label>Weekly Timetable — Pattern {patternIndex + 1}</label>
                {selectedPattern.length > 0
                    ? <FullTimetableGrid pattern={selectedPattern} />
                    : (
                        <div className="error-card" style={{ display: 'flex' }}>
                            <i className="fas fa-circle-exclamation"></i>
                            <span>No pattern data. Please go back and select a pattern.</span>
                        </div>
                    )
                }
            </div>

            {/* Course detail cards */}
            {selectedPattern.map((s, i) => (
                <div key={i} className="course-detail-card">
                    <div className="course-detail-header">
                        <span className="course-code">{s.courseCode}</span>
                        <span className="section-number">Section {s.sectionNumber}</span>
                    </div>
                    <p className="course-name">{s.courseName}</p>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-label">Day</div>
                            <div className="detail-value">{s.day}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Time</div>
                            <div className="detail-value">{s.timeStart?.slice(0, 5)} – {s.timeEnd?.slice(0, 5)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Lecturer</div>
                            <div className="detail-value">{s.lecturerName || 'TBA'}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Venue</div>
                            <div className="detail-value">{s.venue || 'TBA'}</div>
                        </div>
                    </div>
                </div>
            ))}

            {status === 'saved' && (
                <div className="success-card">
                    <i className="fas fa-circle-check"></i>
                    <h3>Blueprint Saved!</h3>
                    <p>Your registration blueprint has been saved to your vault. You can now generate the final report.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>Could not save blueprint. Please try again.</span>
                </div>
            )}

            <div className="sticky-bottom">
                <button
                    className="btn primary"
                    onClick={() => navigate('/registration/report', {
                        state: { selectedPattern, patternIndex, ...navState }
                    })}
                >
                    <i className="fas fa-file-lines"></i>
                    Generate Registration Report
                </button>
                {status !== 'saved' && (
                    <button
                        className="btn outline"
                        onClick={handleSaveDraft}
                        disabled={status === 'saving'}
                    >
                        <i className="fas fa-floppy-disk"></i>
                        {status === 'saving' ? 'Saving...' : 'Save to Draft Vault'}
                    </button>
                )}
                <button
                    className="btn outline"
                    onClick={() => navigate('/registration/simulate-drop', {
                        state: { selectedPattern, ...navState }
                    })}
                >
                    <i className="fas fa-arrow-down-from-line"></i>
                    Simulate Course Drop
                </button>
            </div>
        </div>
    )
}

export default SelectFinalBlueprint
