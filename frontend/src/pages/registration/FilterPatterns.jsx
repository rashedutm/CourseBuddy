import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import RegistrationStepper from './RegistrationStepper'
import MiniTimetableGrid from './MiniTimetableGrid'
import { MOCK_REGISTRATION_STATE } from './_mockData' // TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
import '../courses/courses.css'
import './registration.css'

function FilterPatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    // TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
    // Real defaults should be: patterns = [], totalPatterns = 0, and the
    // rest left undefined (they arrive via location.state from the generator).
    const {
        patterns = MOCK_REGISTRATION_STATE.patterns,
        totalPatterns = MOCK_REGISTRATION_STATE.totalPatterns,
        studentID = MOCK_REGISTRATION_STATE.studentID,
        semesterID = MOCK_REGISTRATION_STATE.semesterID,
        semesterNumber = MOCK_REGISTRATION_STATE.semesterNumber,
        intakeMonth = MOCK_REGISTRATION_STATE.intakeMonth,
        academicSession = MOCK_REGISTRATION_STATE.academicSession,
        intakeID = MOCK_REGISTRATION_STATE.intakeID
    } = location.state || {}

    const [activeFilter, setActiveFilter] = useState('All')
    const [selectedIndices, setSelectedIndices] = useState([])

    const FILTERS = ['All', '≤15 Credits', '16-18 Credits', '4-Day Week', '5-Day Week', 'Morning Heavy', 'Afternoon Heavy']

    const filteredPatterns = useMemo(() => {
        if (activeFilter === 'All') return patterns
        return patterns.filter(pattern => {
            const credits = pattern.reduce((s, p) => s + (p.creditHours || 0), 0)
            const days = new Set(pattern.map(p => p.day)).size
            const morningCount = pattern.filter(p => parseInt(p.timeStart?.slice(0, 2) || 0) < 12).length
            if (activeFilter === '≤15 Credits') return credits <= 15
            if (activeFilter === '16-18 Credits') return credits >= 16 && credits <= 18
            if (activeFilter === '4-Day Week') return days <= 4
            if (activeFilter === '5-Day Week') return days === 5
            if (activeFilter === 'Morning Heavy') return morningCount > pattern.length / 2
            if (activeFilter === 'Afternoon Heavy') return morningCount <= pattern.length / 2
            return true
        })
    }, [patterns, activeFilter])

    const toggleSelect = (originalIndex) => {
        setSelectedIndices(prev => {
            if (prev.includes(originalIndex)) return prev.filter(i => i !== originalIndex)
            if (prev.length < 2) return [...prev, originalIndex]
            return [prev[1], originalIndex]
        })
    }

    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    const handleCompare = () => {
        const [a, b] = selectedIndices
        navigate('/registration/compare', {
            state: {
                patternA: patterns[a], patternIndexA: a,
                patternB: patterns[b], patternIndexB: b,
                ...navState
            }
        })
    }

    const handleSelectDirect = (pattern, originalIndex) => {
        navigate('/registration/select-final', {
            state: { selectedPattern: pattern, patternIndex: originalIndex, ...navState }
        })
    }

    if (!patterns || patterns.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Registration Simulation</h1>
                </header>
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>No patterns available. Please go back and generate patterns first.</span>
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
                <h1>Registration Simulation</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            <RegistrationStepper current={0} />

            {/* Filter chips */}
            <div className="section">
                <label>Filter Patterns</label>
                <div className="filter-bar">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#888' }}>
                Showing {filteredPatterns.length} of {totalPatterns} patterns
            </div>

            {selectedIndices.length > 0 && (
                <div className="instruction">
                    <i className="fas fa-hand-pointer"></i>
                    <span>
                        {selectedIndices.length === 1
                            ? 'Select one more pattern to compare, or tap "Use This" to proceed directly.'
                            : '2 patterns selected — tap Compare below to see them side by side.'}
                    </span>
                </div>
            )}

            <div className="patterns-grid">
                {filteredPatterns.map((pattern, idx) => {
                    const originalIndex = patterns.indexOf(pattern)
                    const isSelected = selectedIndices.includes(originalIndex)
                    const credits = pattern.reduce((s, p) => s + (p.creditHours || 0), 0)
                    const days = [...new Set(pattern.map(p => p.day))]

                    return (
                        <div
                            key={idx}
                            className={`pattern-card ${isSelected ? 'selected-pattern' : ''}`}
                            style={{ cursor: 'default' }}
                        >
                            <div className="pattern-header">
                                <span className="pattern-number">Pattern {originalIndex + 1}</span>
                                <span className="clash-free-badge">Clash Free</span>
                            </div>

                            <MiniTimetableGrid pattern={pattern} />

                            {pattern.map((s, i) => (
                                <div key={i} className="section-row">
                                    <span className="course">{s.courseCode}</span>
                                    <span className="section" style={{ color: '#8b0000', fontWeight: 700 }}>S{s.sectionNumber}</span>
                                    <span className="time">{s.day?.slice(0, 3)} {s.timeStart?.slice(0, 5)}</span>
                                </div>
                            ))}

                            <div style={{ paddingTop: '10px', fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                                {credits} Credits • {days.length} Day{days.length !== 1 ? 's' : ''}/Week
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="view-btn"
                                    style={{
                                        flex: 1,
                                        background: isSelected ? '#8b0000' : '#fdf0f0',
                                        color: isSelected ? '#fff' : '#8b0000'
                                    }}
                                    onClick={() => toggleSelect(originalIndex)}
                                >
                                    {isSelected ? <><i className="fas fa-check"></i> Selected</> : 'Add to Compare'}
                                </button>
                                <button
                                    className="view-btn"
                                    style={{ flex: 1, background: '#e8f8ee', color: '#22a559' }}
                                    onClick={() => handleSelectDirect(pattern, originalIndex)}
                                >
                                    Use This
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="sticky-bottom">
                {selectedIndices.length === 2 && (
                    <button className="btn primary" onClick={handleCompare}>
                        <i className="fas fa-scale-balanced"></i>
                        Compare Selected Patterns
                    </button>
                )}
                <button className="btn outline" onClick={() => navigate('/registration/draft', { state: navState })}>
                    <i className="fas fa-vault"></i>
                    View Saved Drafts
                </button>
            </div>
        </div>
    )
}

export default FilterPatterns
