import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveSelectedPattern } from '../../services/courseService'
import './courses.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

    const [status, setStatus] = useState('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const totalCredits = pattern.reduce((sum, s) => sum + (s.creditHours || 0), 0)
    const uniqueDays = DAYS.filter(day => pattern.some(s => s.day === day))

    // Build timetable grid
    // Get all unique time slots
    const timeSlots = [...new Set(
        pattern.map(s => `${s.timeStart?.slice(0, 5)}-${s.timeEnd?.slice(0, 5)}`)
    )].sort()

    const handleConfirm = async () => {
        setStatus('saving')
        try {
            await saveSelectedPattern(studentID, semesterID, pattern)
            setStatus('saved')
        } catch (err) {
            setStatus('error')
            setErrorMessage('Unable to save your selected pattern. Please try again.')
        }
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
            <p className="subtitle">Pattern {patternIndex + 1} — Full Schedule</p>

            {/* Pattern meta */}
            <div className="pattern-meta-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Pattern {patternIndex + 1}</h2>
                    <p>{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>
                </div>
                <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '600'
                }}>
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
                    <div className="value">{uniqueDays.length}</div>
                    <div className="label">Days/Week</div>
                </div>
            </div>

            {/* ============================================
                TIMETABLE VIEW
                Days as columns, time slots as rows
                ============================================ */}
            <div style={{
                background: '#fff',
                borderRadius: '15px',
                padding: '16px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,.05)',
                overflowX: 'auto'
            }}>
                <h3 style={{ fontSize: '15px', color: '#555', marginBottom: '14px' }}>
                    <i className="fas fa-calendar-week" style={{ color: '#8b0000', marginRight: '8px' }}></i>
                    Weekly Timetable
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px 8px', fontSize: '13px', color: '#888', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #f0f0f0', width: '100px' }}>
                                Time
                            </th>
                            {uniqueDays.map(day => (
                                <th key={day} style={{
                                    padding: '10px 8px',
                                    fontSize: '13px',
                                    color: '#8b0000',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    borderBottom: '2px solid #f0f0f0',
                                    background: '#fdf0f0',
                                    borderRadius: '8px 8px 0 0'
                                }}>
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(timeSlot => {
                            const [start, end] = timeSlot.split('-')
                            return (
                                <tr key={timeSlot}>
                                    <td style={{
                                        padding: '10px 8px',
                                        fontSize: '12px',
                                        color: '#888',
                                        borderBottom: '1px solid #f5f5f5',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {start}<br/>{end}
                                    </td>
                                    {uniqueDays.map(day => {
                                        const section = pattern.find(s =>
                                            s.day === day &&
                                            s.timeStart?.slice(0, 5) === start
                                        )
                                        return (
                                            <td key={day} style={{
                                                padding: '6px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #f5f5f5'
                                            }}>
                                                {section ? (
                                                    <div style={{
                                                        background: '#fdf0f0',
                                                        border: '1px solid #f5c6c6',
                                                        borderRadius: '8px',
                                                        padding: '6px 8px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div style={{ fontWeight: '700', color: '#8b0000' }}>
                                                            {section.courseCode}
                                                        </div>
                                                        <div style={{ color: '#555', marginTop: '2px' }}>
                                                            Sec {section.sectionNumber}
                                                        </div>
                                                        {section.venue && (
                                                            <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>
                                                                {section.venue}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#eee' }}>—</span>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Course detail list */}
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
                            <div className="detail-value">{section.timeStart?.slice(0, 5)} — {section.timeEnd?.slice(0, 5)}</div>
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
                    <p>Your preferred pattern has been saved. Please proceed to register on the UTM student portal based on this timetable.</p>
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
                <div style={{ marginTop: '20px' }}>
                    <button
                        className="btn primary"
                        onClick={handleConfirm}
                        disabled={status === 'saving'}
                    >
                        <i className="fas fa-bookmark"></i>
                        {status === 'saving' ? 'Saving...' : 'Select This Pattern'}
                    </button>
                    <button className="btn outline" onClick={handleBack}>
                        <i className="fas fa-arrow-left"></i>
                        Back to Patterns
                    </button>
                </div>
            )}

            {status === 'saved' && (
                <button className="btn outline" onClick={handleBack}>
                    <i className="fas fa-arrow-left"></i>
                    Back to Patterns
                </button>
            )}
        </div>
    )
}

export default SelectPattern
