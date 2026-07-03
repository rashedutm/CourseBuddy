import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import FullTimetableGrid from './FullTimetableGrid'
import { saveSelectedPattern } from '../../services/courseService'
import { useRegistrationWorkspace } from './workspace/RegistrationWorkspaceContext'
import { computeConflicts, computeDropImpact, overlaps, sectionKey, sumCredits, STATUS } from './workspace/scheduleUtils'
import '../courses/courses.css'
import './registration.css'

const MIN_CREDITS = 9
const DELETE_ANIM_MS = 200

// Every section across every generated pattern, deduplicated — stands in for
// the "cross-reference the uploaded timetable" query until Rashed/Yousra's
// subsystems expose a real "sections at time X" / "sections for course Y" endpoint.
function buildCandidatePool(patterns) {
    const seen = new Set()
    const pool = []
    patterns.forEach((pattern) => {
        pattern.forEach((section) => {
            const dedupeKey = `${sectionKey(section)}|${section.day}|${section.timeStart}`
            if (!seen.has(dedupeKey)) {
                seen.add(dedupeKey)
                pool.push(section)
            }
        })
    })
    return pool
}

// Does at least one viable replacement exist for this section right now?
// Computed proactively, before any delete, so risk is visible before it bites.
function hasAnyBackup(section, routine, candidatePool) {
    const anchors = routine.filter((o) => o.courseCode !== section.courseCode)
    const occupied = new Set(anchors.map((o) => o.courseCode))
    const key = sectionKey(section)
    return candidatePool.some((c) => {
        if (sectionKey(c) === key) return false
        if (anchors.some((a) => overlaps(a, c))) return false
        // another section of the same course, or a clash-free substitute course
        return c.courseCode === section.courseCode || !occupied.has(c.courseCode)
    })
}

function CandidateCard({ section, onSelect }) {
    return (
        <div className="recommender-card" onClick={() => onSelect(section)}>
            <div className="recommender-card-main">
                <span className="course-code">{section.courseCode}</span>
                <span className="recommender-card-name">{section.courseName}</span>
            </div>
            <div className="recommender-card-detail">
                Sec {section.sectionNumber} • {section.day} {section.timeStart?.slice(0, 5)}–{section.timeEnd?.slice(0, 5)}
            </div>
            <div className="recommender-card-detail muted">{section.lecturerName || 'TBA'}</div>
        </div>
    )
}

function DropImpactBanner({ section, impact }) {
    const load = `${impact.creditsBefore} → ${impact.creditsAfter} CH`
    if (impact.severity === 'severe') {
        const blocked = impact.blockedMandatory.map((d) => d.courseName).join(', ')
        return (
            <div className="impact-banner severe">
                <div className="impact-banner-title"><i className="fas fa-triangle-exclamation"></i> Graduation Risk</div>
                <p>Dropping <strong>{section.courseCode}</strong> blocks <strong>{blocked}</strong> (mandatory). This can delay your graduation.</p>
                <div className="impact-banner-load">Load {load}{impact.underLoad ? ' • below minimum' : ''}</div>
            </div>
        )
    }
    if (impact.severity === 'warning') {
        return (
            <div className="impact-banner warning">
                <div className="impact-banner-title"><i className="fas fa-circle-exclamation"></i> Think Twice</div>
                <p>
                    {impact.underLoad && <>Drops you to <strong>{impact.creditsAfter} CH</strong>, below the {MIN_CREDITS} CH minimum. </>}
                    {impact.dependents.length > 0 && <>Unlocks future course{impact.dependents.length > 1 ? 's' : ''} you may still need. </>}
                </p>
                <div className="impact-banner-load">Load {load}</div>
            </div>
        )
    }
    return (
        <div className="impact-banner safe">
            <div className="impact-banner-title"><i className="fas fa-circle-check"></i> Safe to Drop</div>
            <p>No prerequisite conflicts — no future courses require {section.courseCode} as a prerequisite.</p>
            <div className="impact-banner-load">Load {load}</div>
        </div>
    )
}

function SelectedRoutine() {
    const navigate = useNavigate()
    const location = useLocation()
    const { state: workspace, setCurrentGoal, updateGoalSection, removeGoalSection } = useRegistrationWorkspace()
    const panelRef = useRef(null)

    const passedPattern = location.state?.selectedPattern

    useEffect(() => {
        if (passedPattern && passedPattern.length > 0) {
            setCurrentGoal(passedPattern, location.state?.patternLabel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const routine = workspace.currentGoal.sections
    const [saveStatus, setSaveStatus] = useState('idle')
    const [statusMap, setStatusMap] = useState({}) // courseCode -> STATUS
    const [pendingSlot, setPendingSlot] = useState(null) // the section being recovered/dropped
    const [pendingMode, setPendingMode] = useState(null) // 'failed' | 'drop'
    const [pendingImpact, setPendingImpact] = useState(null)
    const [removingKey, setRemovingKey] = useState(null)
    const [confirmedKey, setConfirmedKey] = useState(null)

    const totalCredits = sumCredits(routine)
    const conflicts = useMemo(() => computeConflicts(routine), [routine])
    const candidatePool = useMemo(() => buildCandidatePool(workspace.generatedPatterns), [workspace.generatedPatterns])
    const backupMap = useMemo(() => {
        const map = {}
        routine.forEach((s) => { map[sectionKey(s)] = hasAnyBackup(s, routine, candidatePool) })
        return map
    }, [routine, candidatePool])

    const statusOf = (s) => statusMap[s.courseCode] || STATUS.PLANNED
    const registeredCount = routine.filter((s) => statusOf(s) === STATUS.REGISTERED).length
    const failedCount = routine.filter((s) => statusOf(s) === STATUS.FAILED).length
    const allSecured = routine.length > 0 && registeredCount === routine.length

    // Mode-aware recovery suggestions, always avoiding every other course in the
    // plan (registered ones are hard-locked anchors — UC017 state-lock).
    const recovery = useMemo(() => {
        if (!pendingSlot) return null
        const code = pendingSlot.courseCode
        const key = sectionKey(pendingSlot)
        const anchors = routine.filter((s) => s.courseCode !== code)
        const occupied = new Set(anchors.map((s) => s.courseCode))
        const clashFree = (c) => !anchors.some((a) => overlaps(a, c))

        // Real default: no backlog/retake table exists yet in any subsystem's
        // schema (checked database/schema.sql end to end) — empty until the
        // team adds one, likely under Tarin's student-academic-history territory.
        const retakes = []
        const col3 = { col3: retakes, col3Title: 'Retake Courses', col3Icon: 'fa-clock-rotate-left' }

        if (pendingMode === 'failed') {
            const sameCourse = candidatePool.filter((c) => c.courseCode === code && sectionKey(c) !== key && clashFree(c))
            const substitutes = candidatePool.filter((c) => c.courseCode !== code && !occupied.has(c.courseCode) && clashFree(c))
            return {
                col1: sameCourse, col1Title: 'Other Sections — Same Course', col1Icon: 'fa-rotate',
                col2: substitutes, col2Title: 'Or Swap the Course', col2Icon: 'fa-puzzle-piece',
                ...col3,
            }
        }
        // drop: substitutes for the freed slot
        const sameSlot = candidatePool.filter((c) =>
            c.courseCode !== code && !occupied.has(c.courseCode) &&
            c.day === pendingSlot.day && c.timeStart === pendingSlot.timeStart && clashFree(c))
        const sameSlotKeys = new Set(sameSlot.map(sectionKey))
        const gapFillers = candidatePool.filter((c) =>
            c.courseCode !== code && !occupied.has(c.courseCode) && !sameSlotKeys.has(sectionKey(c)) && clashFree(c))
        return {
            col1: sameSlot, col1Title: 'Fills the Freed Slot', col1Icon: 'fa-bolt',
            col2: gapFillers, col2Title: 'Other Substitutes', col2Icon: 'fa-puzzle-piece',
            ...col3,
        }
    }, [pendingSlot, pendingMode, routine, candidatePool])

    useEffect(() => {
        if (pendingSlot && panelRef.current) {
            panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [pendingSlot])

    const openPanel = (section, mode, impact = null) => {
        setPendingSlot(section)
        setPendingMode(mode)
        setPendingImpact(impact)
    }
    const dismissPanel = () => { setPendingSlot(null); setPendingMode(null); setPendingImpact(null) }

    const handleStatus = (section, target) => {
        const code = section.courseCode
        const next = statusOf(section) === target ? STATUS.PLANNED : target
        setStatusMap((prev) => ({ ...prev, [code]: next }))
        if (next === STATUS.FAILED) {
            openPanel(section, 'failed')
        } else if (pendingMode === 'failed' && pendingSlot?.courseCode === code) {
            dismissPanel()
        }
    }

    const handleDrop = (section) => {
        if (removingKey) return
        // Real default: no prerequisite endpoint wired up yet (needs Rashed's
        // `prerequisite` table via an API) — impact still reflects real credit math.
        const impact = computeDropImpact(section, routine, [], MIN_CREDITS)
        setRemovingKey(sectionKey(section))
        setTimeout(() => {
            removeGoalSection(section.courseCode)
            setStatusMap((prev) => { const n = { ...prev }; delete n[section.courseCode]; return n })
            openPanel(section, 'drop', impact)
            setRemovingKey(null)
        }, DELETE_ANIM_MS)
    }

    const applyCandidate = (candidate) => {
        const mode = pendingMode
        const originalCode = pendingSlot?.courseCode
        updateGoalSection(candidate.courseCode, candidate)
        // A fresh section for a failed course goes back to "planned" so you can
        // try to register the new one.
        if (mode === 'failed' && candidate.courseCode === originalCode) {
            setStatusMap((prev) => ({ ...prev, [candidate.courseCode]: STATUS.PLANNED }))
        }
        dismissPanel()
        const key = sectionKey(candidate)
        setConfirmedKey(key)
        setTimeout(() => setConfirmedKey((k) => (k === key ? null : k)), 900)
    }

    const handleSave = async () => {
        const { studentID, semesterID } = workspace.meta
        if (!studentID || !semesterID) { setSaveStatus('error'); return }
        setSaveStatus('saving')
        try {
            await saveSelectedPattern(studentID, semesterID, routine)
            setSaveStatus('saved')
        } catch {
            setSaveStatus('error')
        }
    }

    if (routine.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Your Routine</h1>
                </header>
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>No routine selected yet. Go to Explore and pick a pattern, or load a saved one from the sidebar.</span>
                </div>
            </div>
        )
    }

    const creditStatus = totalCredits < MIN_CREDITS ? 'danger' : totalCredits < MIN_CREDITS + 3 ? 'warning' : 'safe'
    const conflictStatus = conflicts.size > 0 ? 'danger' : 'safe'
    const securedStatus = allSecured ? 'safe' : failedCount > 0 ? 'danger' : 'neutral'

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Registration Cockpit</h1>
            </header>
            <p className="cockpit-hint">
                <i className="fas fa-bolt"></i> Mark each course as you go on the UTM portal — <strong>Got it</strong> locks it, <strong>Full</strong> finds an instant backup.
            </p>

            <div className="risk-status-bar">
                <div className={`risk-chip ${creditStatus}`}>
                    <span className="risk-chip-value">{totalCredits}</span>
                    <span className="risk-chip-label">Credits</span>
                </div>
                <div className={`risk-chip ${conflictStatus}`}>
                    <span className="risk-chip-value">{conflicts.size > 0 ? conflicts.size : '✓'}</span>
                    <span className="risk-chip-label">{conflicts.size > 0 ? 'Clashes' : 'Clash Free'}</span>
                </div>
                <div className={`risk-chip ${securedStatus}`}>
                    <span className="risk-chip-value">{registeredCount}/{routine.length}</span>
                    <span className="risk-chip-label">{allSecured ? 'All Secured' : 'Secured'}</span>
                </div>
            </div>

            <div className="routine-dashboard">
                <div className="routine-grid-col">
                    <FullTimetableGrid pattern={routine} conflictKeys={conflicts} />
                </div>

                <div className="routine-list-col">
                    {routine.map((s, i) => {
                        const key = sectionKey(s)
                        const st = statusOf(s)
                        const rowClass = [
                            'routine-row',
                            st === STATUS.FAILED && 'failed',
                            st === STATUS.REGISTERED && 'registered',
                            st === STATUS.PLANNED && conflicts.has(key) && 'conflict',
                            removingKey === key && 'removing',
                            confirmedKey === key && 'confirmed',
                        ].filter(Boolean).join(' ')
                        return (
                            <div key={i} className={rowClass}>
                                <div className="routine-row-body">
                                    <div className="routine-row-main">
                                        <span className="course-code">{s.courseCode}</span>
                                        <span className="routine-row-name">{s.courseName}</span>
                                        {!backupMap[key] && st !== STATUS.REGISTERED && (
                                            <span className="routine-row-badge" title="No same-time or clash-free alternative found">
                                                <i className="fas fa-triangle-exclamation"></i> No Backup
                                            </span>
                                        )}
                                    </div>
                                    <div className="routine-row-detail">
                                        Sec {s.sectionNumber} • {s.day} {s.timeStart?.slice(0, 5)}–{s.timeEnd?.slice(0, 5)} • {s.creditHours || 3} CH
                                    </div>
                                    <div className="routine-row-detail muted">{s.lecturerName || 'TBA'} • {s.venue || 'TBA'}</div>
                                </div>
                                <div className="routine-row-actions">
                                    <button
                                        className={`status-btn got ${st === STATUS.REGISTERED ? 'active' : ''}`}
                                        title="Mark as registered (locks the slot)"
                                        onClick={() => handleStatus(s, STATUS.REGISTERED)}
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                        className={`status-btn full ${st === STATUS.FAILED ? 'active' : ''}`}
                                        title="Section full — find a backup now"
                                        onClick={() => handleStatus(s, STATUS.FAILED)}
                                    >
                                        Full
                                    </button>
                                    <button
                                        className="status-btn drop"
                                        title="Drop this course (add/drop)"
                                        onClick={() => handleDrop(s)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {pendingSlot && recovery && (
                <div className="recovery-panel" ref={panelRef}>
                    <div className="recovery-panel-header">
                        <div>
                            {pendingMode === 'failed' ? (
                                <>
                                    <i className="fas fa-triangle-exclamation" style={{ color: 'var(--reg-red)', marginRight: '6px' }}></i>
                                    <strong>Section Full — {pendingSlot.courseName || pendingSlot.courseCode}</strong>
                                    <span style={{ color: '#888', fontWeight: 400 }}> (Sec {pendingSlot.sectionNumber})</span>
                                    <div className="recovery-panel-sub">
                                        Was {pendingSlot.day} {pendingSlot.timeStart?.slice(0, 5)}–{pendingSlot.timeEnd?.slice(0, 5)} • grab a backup below
                                    </div>
                                </>
                            ) : (
                                <strong style={{ fontSize: '14px' }}>Dropped {pendingSlot.courseName || pendingSlot.courseCode} — Substitutes</strong>
                            )}
                        </div>
                        <button className="recovery-panel-close" onClick={dismissPanel}>
                            <i className="fas fa-xmark"></i>
                        </button>
                    </div>

                    {pendingMode === 'drop' && pendingImpact && (
                        <DropImpactBanner section={pendingSlot} impact={pendingImpact} />
                    )}

                    <div className="recommender-columns">
                        <div className="recommender-col">
                            <div className="recommender-col-title priority">
                                <i className={`fas ${recovery.col1Icon}`}></i> {recovery.col1Title}
                            </div>
                            {recovery.col1.length === 0 ? (
                                <p className="workspace-empty-note">Nothing available here.</p>
                            ) : (
                                recovery.col1.map((c) => <CandidateCard key={sectionKey(c)} section={c} onSelect={applyCandidate} />)
                            )}
                        </div>
                        <div className="recommender-col">
                            <div className="recommender-col-title">
                                <i className={`fas ${recovery.col2Icon}`}></i> {recovery.col2Title}
                            </div>
                            {recovery.col2.length === 0 ? (
                                <p className="workspace-empty-note">No clash-free options found.</p>
                            ) : (
                                recovery.col2.map((c) => <CandidateCard key={sectionKey(c)} section={c} onSelect={applyCandidate} />)
                            )}
                        </div>
                        <div className="recommender-col">
                            <div className="recommender-col-title retake">
                                <i className={`fas ${recovery.col3Icon}`}></i> {recovery.col3Title}
                            </div>
                            {recovery.col3.length === 0 ? (
                                <p className="workspace-empty-note">No backlog courses fit right now.</p>
                            ) : (
                                recovery.col3.map((c) => <CandidateCard key={sectionKey(c)} section={c} onSelect={applyCandidate} />)
                            )}
                        </div>
                    </div>
                </div>
            )}

            {allSecured && (
                <div className="success-card">
                    <i className="fas fa-circle-check"></i>
                    <h3>All Courses Secured! 🎉</h3>
                    <p>Every course in your routine is marked registered. You're done for this semester.</p>
                </div>
            )}

            {saveStatus === 'saved' && (
                <div className="success-card">
                    <i className="fas fa-circle-check"></i>
                    <h3>Routine Saved!</h3>
                    <p>Your registration routine has been saved.</p>
                </div>
            )}
            {saveStatus === 'error' && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>Could not save routine. Please try again.</span>
                </div>
            )}

            <div className="sticky-bottom">
                {saveStatus !== 'saved' && (
                    <button className="btn primary" onClick={handleSave} disabled={saveStatus === 'saving'}>
                        <i className="fas fa-floppy-disk"></i>
                        {saveStatus === 'saving' ? 'Saving...' : 'Save This Routine'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default SelectedRoutine
