import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MiniTimetableGrid from './MiniTimetableGrid'
import { useRegistrationWorkspace, MAX_COMPARE_PATTERNS } from './workspace/RegistrationWorkspaceContext'
import { computeMaxGapHours } from './workspace/scheduleUtils'
import '../courses/courses.css'
import './registration.css'

// A compact filter pill (Airbnb/Linear style): shows the group name until a
// value is picked, then the value itself with a maroon accent. Clicking opens
// a small popover with the options; clicking outside or an option closes it.
function FilterDropdown({ groupLabel, icon, value, defaultValue, options, onSelect, footnote }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [open])

    const isActive = value !== defaultValue
    const selectedLabel = options.find((o) => o.value === value)?.label

    return (
        <div className="filter-pill-wrap" ref={ref}>
            <button
                type="button"
                className={`filter-pill ${isActive ? 'active' : ''} ${open ? 'open' : ''}`}
                onClick={() => setOpen((o) => !o)}
            >
                {icon && <i className={icon}></i>}
                <span className="filter-pill-label">{isActive ? selectedLabel : groupLabel}</span>
                <i className="fas fa-chevron-down filter-pill-caret"></i>
            </button>
            {open && (
                <div className="filter-pop">
                    {options.map((opt) => (
                        <button
                            type="button"
                            key={String(opt.value)}
                            className={`filter-pop-option ${opt.value === value ? 'active' : ''}`}
                            onClick={() => { onSelect(opt.value); setOpen(false) }}
                        >
                            <span>{opt.label}</span>
                            {opt.value === value && <i className="fas fa-check"></i>}
                        </button>
                    ))}
                    {footnote && <div className="filter-pop-footnote">{footnote}</div>}
                </div>
            )}
        </div>
    )
}

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

    const { state: workspace, setMeta, setGeneratedPatterns, setCurrentGoal, savePattern, addToCompareSet } = useRegistrationWorkspace()

    // Feed the workspace context once on mount so the sidebar, Custom Builder,
    // and Recovery view can see these patterns even if the user jumps there directly.
    useEffect(() => {
        setMeta({ studentID, programmeID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID })
        setGeneratedPatterns(patterns)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [activeFilter, setActiveFilter] = useState('All')
    const [maxGap, setMaxGap] = useState(null) // hours; null = no gap filter applied
    const [selectedIndices, setSelectedIndices] = useState([])
    const MAX_COMPARE = MAX_COMPARE_PATTERNS

    // If the Compare page already holds patterns, those are enough to compare
    // against — so a single new pick here is sufficient to trigger it. Only
    // from an empty compare set do you need 2 to have anything to line up.
    const existingCompareCount = workspace.compareSet.length
    const minToCompare = existingCompareCount > 0 ? 1 : 2

    const FILTERS = ['All', '≤15 Credits', '16-18 Credits', '4-Day Week', '5-Day Week', 'Morning Heavy', 'Afternoon Heavy']
    const GAP_OPTIONS = [1, 2, 3, 4, 5, 6]

    const filteredPatterns = useMemo(() => {
        return patterns.filter(pattern => {
            const credits = pattern.reduce((s, p) => s + (p.creditHours || 0), 0)
            const days = new Set(pattern.map(p => p.day)).size
            const morningCount = pattern.filter(p => parseInt(p.timeStart?.slice(0, 2) || 0) < 12).length

            if (activeFilter === '≤15 Credits' && !(credits <= 15)) return false
            if (activeFilter === '16-18 Credits' && !(credits >= 16 && credits <= 18)) return false
            if (activeFilter === '4-Day Week' && !(days <= 4)) return false
            if (activeFilter === '5-Day Week' && !(days === 5)) return false
            if (activeFilter === 'Morning Heavy' && !(morningCount > pattern.length / 2)) return false
            if (activeFilter === 'Afternoon Heavy' && !(morningCount <= pattern.length / 2)) return false

            if (maxGap != null && computeMaxGapHours(pattern) > maxGap) return false

            return true
        })
    }, [patterns, activeFilter, maxGap])

    const toggleSelect = (originalIndex) => {
        setSelectedIndices(prev => {
            if (prev.includes(originalIndex)) return prev.filter(i => i !== originalIndex)
            if (prev.length < MAX_COMPARE) return [...prev, originalIndex]
            return [...prev.slice(1), originalIndex] // FIFO: drop the oldest pick once at cap
        })
    }

    const handleCompare = () => {
        const entries = selectedIndices.map((i) => ({ pattern: patterns[i], label: `Pattern ${i + 1}` }))
        addToCompareSet(entries)
        setSelectedIndices([])
        navigate('/registration/compare')
    }

    const handleSelectDirect = (pattern, originalIndex) => {
        setCurrentGoal(pattern, `Pattern ${originalIndex + 1}`)
        navigate('/registration/routine', {
            state: { selectedPattern: pattern, patternLabel: `Pattern ${originalIndex + 1}` }
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
            {/* Compact, modern filter pills — each opens a popover of options */}
            <div className="filter-toolbar">
                <FilterDropdown
                    groupLabel="Filter patterns"
                    icon="fas fa-sliders"
                    value={activeFilter}
                    defaultValue="All"
                    options={FILTERS.map((f) => ({ value: f, label: f === 'All' ? 'All patterns' : f }))}
                    onSelect={setActiveFilter}
                />
                <FilterDropdown
                    groupLabel="Max gap"
                    icon="fas fa-hourglass-half"
                    value={maxGap}
                    defaultValue={null}
                    options={[{ value: null, label: 'Any gap' }, ...GAP_OPTIONS.map((h) => ({ value: h, label: `≤${h}h between classes` }))]}
                    onSelect={setMaxGap}
                    footnote="Lunch (1–2pm) doesn't count toward the gap."
                />
                {(activeFilter !== 'All' || maxGap != null) && (
                    <button
                        type="button"
                        className="filter-clear-btn"
                        onClick={() => { setActiveFilter('All'); setMaxGap(null) }}
                    >
                        <i className="fas fa-xmark"></i> Clear
                    </button>
                )}
                <span className="filter-result-count">
                    Showing {filteredPatterns.length} of {totalPatterns} patterns
                </span>
            </div>

            {selectedIndices.length > 0 && (
                <div className="instruction">
                    <i className="fas fa-hand-pointer"></i>
                    <span>
                        {selectedIndices.length < minToCompare
                            ? `Select ${minToCompare - selectedIndices.length} more pattern${minToCompare - selectedIndices.length > 1 ? 's' : ''} to compare, or tap "Sandbox" to proceed directly.`
                            : existingCompareCount > 0
                                ? `${selectedIndices.length} selected — tap Compare below to add ${selectedIndices.length === 1 ? 'it' : 'them'} to the ${existingCompareCount} already in Compare.`
                                : selectedIndices.length < MAX_COMPARE
                                    ? `${selectedIndices.length} patterns selected — tap Compare below, or pick up to ${MAX_COMPARE - selectedIndices.length} more.`
                                    : `${MAX_COMPARE} patterns selected (max) — tap Compare below to see them side by side.`}
                    </span>
                </div>
            )}

            <div className="patterns-grid">
                {filteredPatterns.map((pattern, idx) => {
                    const originalIndex = patterns.indexOf(pattern)
                    const isSelected = selectedIndices.includes(originalIndex)
                    const credits = pattern.reduce((s, p) => s + (p.creditHours || 0), 0)
                    const days = [...new Set(pattern.map(p => p.day))].length

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

                            <div className="compare-stat-row">
                                <span>{pattern.length} Courses</span>
                                <span>{credits} CH</span>
                                <span>{days} Days/Week</span>
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
                                    {isSelected ? <><i className="fas fa-check"></i> Selected</> : 'Compare'}
                                </button>
                                <button
                                    className="view-btn"
                                    style={{ flex: 1, background: '#fff7e6', color: '#d97706' }}
                                    title="Save to Draft Vault"
                                    onClick={() => savePattern(`Pattern ${originalIndex + 1}`, pattern)}
                                >
                                    <i className="fas fa-bookmark"></i> Save to Vault
                                </button>
                                <button
                                    className="view-btn"
                                    style={{ flex: 1, background: 'var(--reg-maroon)', color: '#fff' }}
                                    onClick={() => handleSelectDirect(pattern, originalIndex)}
                                >
                                    <i className="fas fa-lock"></i> Sandbox
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {selectedIndices.length >= minToCompare && (
                <div className="sticky-bottom">
                    <button className="btn primary" onClick={handleCompare}>
                        <i className="fas fa-scale-balanced"></i>
                        {existingCompareCount > 0
                            ? `Add ${selectedIndices.length} to Compare (${existingCompareCount} already there)`
                            : `Compare ${selectedIndices.length} Selected Patterns`}
                    </button>
                </div>
            )}
        </div>
    )
}

export default FilterPatterns
