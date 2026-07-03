import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MiniTimetableGrid from './MiniTimetableGrid'
import { useRegistrationWorkspace, MAX_SAVED_PATTERNS } from './workspace/RegistrationWorkspaceContext'
import '../courses/courses.css'
import './registration.css'

function FilterPatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        patterns = [],
        totalPatterns = 0,
        studentID,
        programmeID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID
    } = location.state || {}

    const { state: workspace, setMeta, setGeneratedPatterns, setCurrentGoal, savePattern } = useRegistrationWorkspace()
    const vaultFull = workspace.savedPatterns.length >= MAX_SAVED_PATTERNS

    // Feed the workspace context once on mount so the sidebar, Custom Builder,
    // and Recovery view can see these patterns even if the user jumps there directly.
    useEffect(() => {
        setMeta({ studentID, programmeID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID })
        setGeneratedPatterns(patterns)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        setCurrentGoal(pattern, `Pattern ${originalIndex + 1}`)
        navigate('/registration/routine', {
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

                            <div style={{ fontSize: '12px', color: '#888', margin: '6px 0 12px' }}>
                                {credits} Credits
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="view-btn"
                                    style={{ flex: 'none', width: '40px', background: '#fff7e6', color: '#d97706', opacity: vaultFull ? 0.4 : 1, cursor: vaultFull ? 'not-allowed' : 'pointer' }}
                                    title={vaultFull ? `Vault full (${MAX_SAVED_PATTERNS}/${MAX_SAVED_PATTERNS})` : 'Save to Saved Routines'}
                                    disabled={vaultFull}
                                    onClick={() => savePattern(`Pattern ${originalIndex + 1}`, pattern)}
                                >
                                    <i className="fas fa-star"></i>
                                </button>
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

            {selectedIndices.length === 2 && (
                <div className="sticky-bottom">
                    <button className="btn primary" onClick={handleCompare}>
                        <i className="fas fa-scale-balanced"></i>
                        Compare Selected Patterns
                    </button>
                </div>
            )}
        </div>
    )
}

export default FilterPatterns
