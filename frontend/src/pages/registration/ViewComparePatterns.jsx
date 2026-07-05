import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import MiniTimetableGrid from './MiniTimetableGrid'
import { useRegistrationWorkspace, MAX_COMPARE_PATTERNS } from './workspace/RegistrationWorkspaceContext'
import { computeConflicts, sectionKey, sumCredits } from './workspace/scheduleUtils'
import '../courses/courses.css'
import './registration.css'

// The compare set and the in-progress mix both live in the persistent
// workspace context now (not local state / location.state) — so navigating
// away to Explore or the Draft Vault and coming back leaves everything
// exactly as it was, and more patterns can be added in from those pages
// without losing what's already here.
function ViewComparePatterns() {
    const navigate = useNavigate()
    const { state: workspace, setCurrentGoal, savePattern, removeFromCompareSet, toggleMixSection, setMixSections } = useRegistrationWorkspace()
    const comparePatterns = workspace.compareSet
    const mixSections = workspace.mixSections

    // Click-to-mix: pick individual course blocks from any compared pattern
    // and assemble them into a new custom mix, shown live below.
    const mixKeys = useMemo(() => new Set(mixSections.map(sectionKey)), [mixSections])
    const mixConflicts = useMemo(() => computeConflicts(mixSections), [mixSections])
    const mixCredits = sumCredits(mixSections)
    const mixDays = [...new Set(mixSections.map((s) => s.day))]

    const clearMix = () => setMixSections([])

    const mixLabel = `Custom Mix (${comparePatterns.map((c) => c.label).join(' + ')})`

    const saveMixToVault = () => {
        savePattern(mixLabel, mixSections)
    }

    const useMix = () => {
        setCurrentGoal(mixSections, mixLabel)
        navigate('/registration/routine', { state: { selectedPattern: mixSections, patternLabel: mixLabel } })
    }

    if (comparePatterns.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Compare Patterns</h1>
                </header>
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-scale-balanced"></i>
                    <span>Nothing to compare yet. Pick 2-{MAX_COMPARE_PATTERNS} patterns from Explore or the Draft Vault.</span>
                </div>
                <button className="btn outline" onClick={() => navigate('/registration/filter')}>
                    <i className="fas fa-compass"></i>
                    Go to Explore
                </button>
            </div>
        )
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Compare Patterns</h1>
            </header>
            <div className="info-note" style={{ marginBottom: '20px' }}>
                <i className="fas fa-info-circle"></i>
                <p>
                    Compare {comparePatterns.length} patterns side by side, or click individual course blocks from any of
                    them to mix them into a new custom pattern below. Add more from Explore or the Draft Vault any
                    time (up to {MAX_COMPARE_PATTERNS}) — nothing here is lost when you navigate away.
                </p>
            </div>

            <div className="patterns-grid">
                {comparePatterns.map(({ id, pattern, label }, i) => {
                    const credits = pattern.reduce((s, p) => s + (p.creditHours || 0), 0)
                    const days = [...new Set(pattern.map((p) => p.day))]
                    const panelConflicts = computeConflicts(pattern)
                    return (
                        <div key={id} className={`compare-panel panel-${i % 4}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3>{label}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {panelConflicts.size > 0 ? (
                                        <span className="clash-free-badge" style={{ background: '#fdecea', color: '#dc2626', fontSize: '11px', padding: '4px 10px' }}>
                                            <i className="fas fa-triangle-exclamation"></i> Clash
                                        </span>
                                    ) : (
                                        <span className="clash-free-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>Clash Free</span>
                                    )}
                                    <button
                                        className="compare-remove-btn"
                                        title="Remove from comparison"
                                        onClick={() => removeFromCompareSet(id)}
                                    >
                                        <i className="fas fa-xmark"></i>
                                    </button>
                                </div>
                            </div>

                            <MiniTimetableGrid pattern={pattern} onBlockClick={toggleMixSection} selectedKeys={mixKeys} />

                            <div className="compare-stat-row">
                                <span>{pattern.length} Courses</span>
                                <span>{credits} CH</span>
                                <span>{days.length} Days/Week</span>
                            </div>

                        </div>
                    )
                })}
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
                        <span>{mixSections.length} Courses</span>
                        <span>{mixCredits} CH</span>
                        <span>{mixDays.length} Days/Week</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button className="btn outline" style={{ flex: 1, marginBottom: 0 }} onClick={clearMix}>
                            <i className="fas fa-xmark"></i> Clear Mix
                        </button>
                        <button
                            className="view-btn"
                            style={{ flex: 1, background: '#fff7e6', color: '#d97706' }}
                            title="Save to Draft Vault"
                            onClick={saveMixToVault}
                        >
                            <i className="fas fa-bookmark"></i> Save to Vault
                        </button>
                        <button
                            className="view-btn"
                            style={{ flex: 1, background: 'var(--reg-maroon)', color: '#fff' }}
                            onClick={useMix}
                        >
                            <i className="fas fa-lock"></i> Sandbox
                        </button>
                    </div>
                </div>
            )}

            <button className="btn outline" onClick={() => navigate('/registration/filter')}>
                <i className="fas fa-compass"></i>
                Add More from Explore
            </button>
        </div>
    )
}

export default ViewComparePatterns
