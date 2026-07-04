import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MiniTimetableGrid from './MiniTimetableGrid'
import { useRegistrationWorkspace, MAX_SAVED_PATTERNS } from './workspace/RegistrationWorkspaceContext'
import { computeConflicts, sectionKey, sumCredits } from './workspace/scheduleUtils'
import '../courses/courses.css'
import './registration.css'

function ViewComparePatterns() {
    const navigate = useNavigate()
    const location = useLocation()
    const { state: workspace, setCurrentGoal, savePattern } = useRegistrationWorkspace()
    const vaultFull = workspace.savedPatterns.length >= MAX_SAVED_PATTERNS

    const {
        patternA = [],
        patternIndexA = 0,
        patternB = [],
        patternIndexB = 1,
        patterns,
        totalPatterns,
        studentID = workspace.meta.studentID,
        semesterID = workspace.meta.semesterID,
        semesterNumber = workspace.meta.semesterNumber,
        intakeMonth = workspace.meta.intakeMonth,
        academicSession = workspace.meta.academicSession,
        intakeID = workspace.meta.intakeID
    } = location.state || {}

    const creditsA = patternA.reduce((s, p) => s + (p.creditHours || 0), 0)
    const creditsB = patternB.reduce((s, p) => s + (p.creditHours || 0), 0)
    const daysA = [...new Set(patternA.map(p => p.day))]
    const daysB = [...new Set(patternB.map(p => p.day))]

    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    const selectPattern = (pattern, index) => {
        navigate('/registration/routine', {
            state: { selectedPattern: pattern, patternIndex: index, ...navState }
        })
    }

    // Click-to-mix: pick individual course blocks from either pattern and
    // assemble them into a new custom mix, shown live below.
    const [mixSections, setMixSections] = useState([])
    const mixKeys = useMemo(() => new Set(mixSections.map(sectionKey)), [mixSections])
    const mixConflicts = useMemo(() => computeConflicts(mixSections), [mixSections])
    const mixCredits = sumCredits(mixSections)
    const mixDays = [...new Set(mixSections.map(s => s.day))]

    const toggleMixSection = (section) => {
        setMixSections(prev => {
            const key = sectionKey(section)
            if (prev.some(s => sectionKey(s) === key)) return prev.filter(s => sectionKey(s) !== key)
            return [...prev, section]
        })
    }

    const clearMix = () => setMixSections([])

    const saveMixToVault = () => {
        savePattern(`Custom Mix (${patternIndexA + 1}+${patternIndexB + 1})`, mixSections)
    }

    const useMix = () => {
        setCurrentGoal(mixSections, `Custom Mix (${patternIndexA + 1}+${patternIndexB + 1})`)
        navigate('/registration/routine', {
            state: { selectedPattern: mixSections, ...navState }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Compare Patterns</h1>
            </header>
            <div className="info-note" style={{ marginBottom: '20px' }}>
                <i className="fas fa-info-circle"></i>
                <p>Compare the two patterns side by side, or click individual course blocks from either one to mix them into a new custom pattern below.</p>
            </div>

            <div className="compare-grid">
                <div className="compare-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Pattern {patternIndexA + 1}</h3>
                        <span className="clash-free-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Clash Free</span>
                    </div>

                    <MiniTimetableGrid pattern={patternA} onBlockClick={toggleMixSection} selectedKeys={mixKeys} />

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

                    <MiniTimetableGrid pattern={patternB} onBlockClick={toggleMixSection} selectedKeys={mixKeys} />

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

            {mixSections.length > 0 && (
                <div className="pattern-card" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>Your Mix</h3>
                        {mixConflicts.size > 0 ? (
                            <span className="clash-free-badge" style={{ background: '#fdecea', color: '#dc2626', fontSize: '11px', padding: '4px 10px' }}>
                                <i className="fas fa-triangle-exclamation"></i> Clash Detected
                            </span>
                        ) : (
                            <span className="clash-free-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Clash Free</span>
                        )}
                    </div>

                    <MiniTimetableGrid pattern={mixSections} onBlockClick={toggleMixSection} selectedKeys={mixKeys} conflictKeys={mixConflicts} />

                    <div className="compare-stat-row">
                        <span>{mixCredits} Credits</span>
                        <span>{mixDays.length} Days/Week</span>
                        <span>{mixSections.length} Courses</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button className="btn outline" style={{ flex: 1, marginBottom: 0 }} onClick={clearMix}>
                            <i className="fas fa-xmark"></i> Clear Mix
                        </button>
                        <button
                            className="view-btn"
                            style={{ flex: 1, background: '#fff7e6', color: '#d97706', opacity: vaultFull ? 0.4 : 1, cursor: vaultFull ? 'not-allowed' : 'pointer' }}
                            title={vaultFull ? `Vault full (${MAX_SAVED_PATTERNS}/${MAX_SAVED_PATTERNS})` : 'Save to Draft Vault'}
                            disabled={vaultFull}
                            onClick={saveMixToVault}
                        >
                            <i className="fas fa-bookmark"></i> Save to Vault
                        </button>
                        <button
                            className="view-btn"
                            style={{ flex: 1, background: '#e8f8ee', color: '#22a559' }}
                            onClick={useMix}
                        >
                            Use This
                        </button>
                    </div>
                </div>
            )}

            <button className="btn outline" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
                Back to Filter
            </button>
        </div>
    )
}

export default ViewComparePatterns
