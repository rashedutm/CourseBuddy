import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getActivePattern } from '../../services/courseService'
import { MOCK_ACTIVE_PATTERN } from './_mockData' // TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
import '../courses/courses.css'
import './registration.css'

function makeAlternatives(section) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const altDay1 = days.find(d => d !== section.day) || 'Wednesday'
    const altDay2 = days.filter(d => d !== section.day && d !== altDay1)[0] || 'Thursday'
    return [
        {
            sectionNumber: section.sectionNumber + 1,
            day: altDay1,
            timeStart: section.timeStart,
            timeEnd: section.timeEnd,
            lecturerName: section.lecturerName ? `Dr. Alt (${section.lecturerName})` : 'Dr. Alternative',
            available: true
        },
        {
            sectionNumber: section.sectionNumber + 2,
            day: altDay2,
            timeStart: section.timeStart,
            timeEnd: section.timeEnd,
            lecturerName: 'Dr. Second Option',
            available: false
        }
    ]
}

function GapFilling() {
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

    // TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
    // Real default: useState(passedPattern || [])
    const [pattern, setPattern] = useState(passedPattern || MOCK_ACTIVE_PATTERN)
    const [loading, setLoading] = useState(!passedPattern && !!studentID)
    const [selectedAlts, setSelectedAlts] = useState({})

    useEffect(() => {
        if (passedPattern || !studentID) return
        getActivePattern(studentID)
            .then(data => setPattern(Array.isArray(data) ? data : []))
            .catch(() => setPattern([]))
            .finally(() => setLoading(false))
    }, [passedPattern, studentID])

    const selectAlt = (courseCode, altIndex) => {
        setSelectedAlts(prev => ({
            ...prev,
            [courseCode]: prev[courseCode] === altIndex ? null : altIndex
        }))
    }

    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Gap Filling</h1>
            </header>
            <p className="subtitle">Find alternatives if preferred sections are full</p>

            <div className="info-note">
                <i className="fas fa-puzzle-piece"></i>
                <p>If a section becomes unavailable during registration, use this tool to select an alternative section for that course.</p>
            </div>

            {loading ? (
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading Your Blueprint...</h2>
                    <p>Fetching your saved registration plan.</p>
                </div>
            ) : pattern.length === 0 ? (
                <div className="no-pattern-card" style={{ display: 'block' }}>
                    <i className="fas fa-circle-xmark"></i>
                    <h3>No Blueprint Found</h3>
                    <p>Please go back and select a final blueprint first.</p>
                </div>
            ) : (
                pattern.map((s, i) => {
                    const alts = makeAlternatives(s)
                    const hasAlt = selectedAlts[s.courseCode] != null
                    return (
                        <div key={i} className={`gap-course-card ${hasAlt ? 'resolved' : ''}`}>
                            <div className="gap-course-header">
                                <div>
                                    <span className="course-code">{s.courseCode}</span>
                                    <p className="course-name" style={{ marginTop: '6px', marginBottom: 0 }}>
                                        {s.courseName}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
                                    background: hasAlt ? '#e8f8ee' : '#fff3f3',
                                    color: hasAlt ? '#22a559' : '#e67e22',
                                    fontWeight: 700, flexShrink: 0
                                }}>
                                    {hasAlt ? 'Alt Selected' : 'Preferred'}
                                </span>
                            </div>

                            {/* Preferred section */}
                            <div style={{
                                background: '#f9f9f9', borderRadius: '10px',
                                padding: '10px 12px', marginBottom: '10px', fontSize: '13px'
                            }}>
                                <strong>Preferred:</strong> Section {s.sectionNumber} • {s.day} {s.timeStart?.slice(0, 5)}–{s.timeEnd?.slice(0, 5)} • {s.lecturerName || 'TBA'}
                            </div>

                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                                Alternative Sections (tap to select):
                            </div>

                            {alts.map((alt, ai) => (
                                <div
                                    key={ai}
                                    className={`gap-alt-option ${selectedAlts[s.courseCode] === ai ? 'selected' : ''}`}
                                    style={{ opacity: alt.available ? 1 : 0.5, cursor: alt.available ? 'pointer' : 'not-allowed' }}
                                    onClick={() => alt.available && selectAlt(s.courseCode, ai)}
                                >
                                    <div className="gap-alt-radio"></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                            Section {alt.sectionNumber} • {alt.day} {alt.timeStart?.slice(0, 5)}–{alt.timeEnd?.slice(0, 5)}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                            {alt.lecturerName}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', padding: '3px 8px', borderRadius: '20px',
                                        background: alt.available ? '#e8f8ee' : '#f0f0f0',
                                        color: alt.available ? '#22a559' : '#888',
                                        fontWeight: 700, flexShrink: 0
                                    }}>
                                        {alt.available ? 'Open' : 'Full'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                })
            )}

            <div className="sticky-bottom">
                <button
                    className="btn primary"
                    onClick={() => navigate('/registration/report', {
                        state: { selectedPattern: pattern, patternIndex: 0, ...navState }
                    })}
                >
                    <i className="fas fa-check"></i>
                    Save Gap Filling Choices
                </button>
                <button className="btn outline" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i>
                    Back
                </button>
            </div>
        </div>
    )
}

export default GapFilling
