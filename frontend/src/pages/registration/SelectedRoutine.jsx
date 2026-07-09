import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import FullTimetableGrid from './FullTimetableGrid'
import { saveSelectedPattern } from '../../services/courseService'
import { useRegistrationWorkspace } from './workspace/RegistrationWorkspaceContext'
import {
    computeConflicts, computeDropImpact, estimateGraduationImpact, estimateFypEligibility,
    overlaps, sectionKey, sumCredits, STATUS, prerequisitesMet, timeProximity,
    MIN_CREDITS_PER_SEMESTER, MAX_CREDITS_PER_SEMESTER, DEFAULT_TARGET_CREDITS_PER_SEMESTER,
} from './workspace/scheduleUtils'
import '../courses/courses.css'
import './registration.css'

const MIN_CREDITS = MIN_CREDITS_PER_SEMESTER // real SCSEH handbook minimum
const DELETE_ANIM_MS = 200
const TOTAL_SEMESTERS = 8 // standard 4-year bachelor's, 2 semesters/year
const CREDIT_RING_MAX = MAX_CREDITS_PER_SEMESTER // real SCSEH handbook maximum

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

// Every distinct section number on record for a course — this is what the
// "which section did you actually get" toggle offers. Only as rich as
// candidatePool currently is (sections scattered across the mock generated
// patterns); a real timetable feed would widen this without any code change
// here — see courseService for where that plugs in.
function sectionsForCourse(candidatePool, courseCode) {
    const seen = new Set()
    return candidatePool
        .filter((c) => c.courseCode === courseCode)
        .filter((c) => (seen.has(c.sectionNumber) ? false : (seen.add(c.sectionNumber), true)))
        .sort((a, b) => a.sectionNumber.localeCompare(b.sectionNumber))
}

// "Which section did you actually get?" toggle. Collapsed, it just shows the
// section number (Sec 01) — a native <select> can't show richer text only
// while open, so this is a small custom dropdown: expanded, each option also
// shows the lecturer, since that's usually how a student tells sections apart.
function SectionToggle({ section, options, onChange, disabled }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [open])

    return (
        <div className="section-toggle-wrap" ref={ref}>
            <button
                type="button"
                className="section-toggle"
                title="Which section did you actually get?"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
            >
                Sec {section.sectionNumber} <i className="fas fa-chevron-down"></i>
            </button>
            {open && (
                <div className="section-toggle-menu">
                    {options.map((opt) => (
                        <button
                            type="button"
                            key={opt.sectionNumber}
                            className={`section-toggle-option ${opt.sectionNumber === section.sectionNumber ? 'active' : ''}`}
                            onClick={() => { onChange(opt.sectionNumber); setOpen(false) }}
                        >
                            <span className="section-toggle-option-top">
                                <span className="section-toggle-option-sec">Sec {opt.sectionNumber}</span>
                                <span className="section-toggle-option-time">{opt.day} {opt.timeStart?.slice(0, 5)}</span>
                            </span>
                            <span className="section-toggle-option-lect">{opt.lecturerName || 'TBA'}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function CandidateCard({ section, onSelect }) {
    return (
        <div className="recommender-card" onClick={() => onSelect(section)}>
            <div className="recommender-card-main">
                <span className="course-code">{section.courseCode}</span>
                <span className="recommender-card-name">{section.courseName}</span>
                {section.sameSlot && (
                    <span className="recommender-card-samefit-tag" title="Same day and time as the freed slot">
                        <i className="fas fa-bullseye"></i> Exact Fit
                    </span>
                )}
                {section.fromVault && (
                    <span className="recommender-card-vault-tag" title={`From your Draft Vault: ${section.fromVault}`}>
                        <i className="fas fa-box-archive"></i> {section.fromVault}
                    </span>
                )}
            </div>
            <div className="recommender-card-detail">
                Sec {section.sectionNumber} • {section.day} {section.timeStart?.slice(0, 5)}–{section.timeEnd?.slice(0, 5)}
            </div>
            <div className="recommender-card-detail muted">{section.lecturerName || 'TBA'}</div>
        </div>
    )
}

// A small conic-gradient ring — compact stand-in for what used to be a full
// gauge card. Two of these side by side take up a fraction of the space.
// `markers` draw small clock-hand ticks at given values (e.g. the handbook's
// minimum and designed-pace credit load) around the ring's edge.
function MiniRing({ value, max, color, label, markers = [] }) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))
    return (
        <div className="mini-ring-wrap">
            <div className="mini-ring" style={{ '--pct': pct, '--ring-color': color }}>
                {markers.map((m, i) => (
                    <span
                        key={i}
                        className="mini-ring-tick"
                        style={{ transform: `rotate(${Math.min(100, Math.max(0, (m.value / max) * 100)) * 3.6}deg)` }}
                        title={m.label}
                    ></span>
                ))}
                <div className="mini-ring-inner">
                    <span className="mini-ring-value">{value}</span>
                </div>
            </div>
            <div className="mini-ring-label">{label}</div>
        </div>
    )
}

// UC019 Simulate Course Drop, expanded but kept compact: two small rings
// (credit load, FYP/Internship track) plus three one-line reads — semester
// position, prerequisite cascade, and intake availability — instead of big
// bars and boxed cards.
function DropImpactDashboard({ section, impact, grad, fyp, intakeMonth, optimumCredits }) {
    const creditColor = impact.creditsAfter < MIN_CREDITS ? 'var(--reg-red)' : impact.creditsAfter < MIN_CREDITS + 3 ? 'var(--reg-amber)' : 'var(--reg-green)'
    const fypColor = fyp.onTrack ? 'var(--reg-green)' : 'var(--reg-amber)'
    return (
        <div className="impact-dashboard">
            <div className="mini-ring-row">
                <MiniRing
                    value={impact.creditsAfter}
                    max={CREDIT_RING_MAX}
                    color={creditColor}
                    label={`Credits ${impact.creditsBefore}→${impact.creditsAfter}`}
                    markers={[
                        { value: MIN_CREDITS, label: `Minimum ${MIN_CREDITS} CH` },
                        { value: optimumCredits, label: `Handbook pace ${optimumCredits} CH` },
                    ]}
                />
                <MiniRing value={fyp.projectedTotal} max={fyp.required} color={fypColor} label={`FYP Track /${fyp.required} CH`} />
            </div>
            <div className={`impact-line ${grad.delayTier}`}>
                <i className="fas fa-graduation-cap"></i> Semester {grad.currentSemester} of {grad.totalSemesters}
                {grad.delayTier === 'severe' && <> — may slip to semester {grad.projectedSemester} (+1 year)</>}
            </div>
            <div className={`impact-line ${impact.blockedMandatory.length > 0 ? 'severe' : 'none'}`}>
                {impact.blockedMandatory.length > 0
                    ? <><i className="fas fa-lock"></i> Blocks {impact.blockedMandatory.map((d) => d.courseCode).join(', ')}</>
                    : <><i className="fas fa-circle-check"></i> No courses blocked</>}
            </div>
            {intakeMonth && (
                <div className="impact-line muted">
                    <i className="fas fa-calendar-days"></i> {intakeMonth} intake — next retake likely the following {intakeMonth} cycle
                </div>
            )}
        </div>
    )
}

function SelectedRoutine() {
    const navigate = useNavigate()
    const location = useLocation()
    const { state: workspace, setGeneratedPatterns, setCurrentGoal, updateGoalSection, removeGoalSection, savePattern } = useRegistrationWorkspace()
    const panelRef = useRef(null)

    const passedPattern = location.state?.selectedPattern

    useEffect(() => {
        if (passedPattern && passedPattern.length > 0) {
            setCurrentGoal(passedPattern, location.state?.patternLabel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Dev-only test overlay — never written to the workspace or localStorage.
    // Keeps the clash-test isolated so the sidebar's "Current Routine" card
    // is not polluted after running a dev scenario.
    const routine = workspace.currentGoal.sections
    // The handbook's designed semester credit pace (16-18 CH for SCSEH) — a
    // per-student override belongs in workspace.meta.targetCreditsPerSemester
    // once a settings UI exists to set it; falls back to the handbook midpoint.
    const optimumCredits = workspace.meta.targetCreditsPerSemester || DEFAULT_TARGET_CREDITS_PER_SEMESTER
    const [saveStatus, setSaveStatus] = useState('idle')
    const [statusMap, setStatusMap] = useState({}) // courseCode -> STATUS
    const [pendingSlot, setPendingSlot] = useState(null) // the section being dropped
    const [pendingMode, setPendingMode] = useState(null) // 'simulate-drop' | 'drop'
    const [pendingImpact, setPendingImpact] = useState(null)
    const [removingKey, setRemovingKey] = useState(null)
    const [confirmedKey, setConfirmedKey] = useState(null)
    const [sameSlotOnly, setSameSlotOnly] = useState(false)

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
    const allSecured = routine.length > 0 && registeredCount === routine.length

    const grad = useMemo(() => (
        pendingImpact ? estimateGraduationImpact(pendingImpact, workspace.meta.semesterNumber || 1, TOTAL_SEMESTERS) : null
    ), [pendingImpact, workspace.meta.semesterNumber])
    const fyp = useMemo(() => (
        pendingImpact ? estimateFypEligibility(pendingImpact, null) : null
    ), [pendingImpact])

    // UC020 Execute Gap Filling, only computed once the drop is confirmed —
    // two buckets, Substitutes (Draft Vault fits first, then the wider
    // candidate pool) and Retake Courses, both prerequisite-filtered and
    // ranked by proximity to the freed slot. The pending course is NOT
    // removed from `routine` until a concrete choice is made, so anchors
    // below correctly exclude it from clash-checking without any state
    // mutation having happened yet.
    const recovery = useMemo(() => {
        if (!pendingSlot || pendingMode !== 'drop') return null
        const code = pendingSlot.courseCode
        const anchors = routine.filter((s) => s.courseCode !== code)
        const occupied = new Set(anchors.map((s) => s.courseCode))
        const clashFree = (c) => !anchors.some((a) => overlaps(a, c))
        const eligible = (c) => prerequisitesMet(c.courseCode, [], [])
        const clearOfCourse = (c) => c.courseCode !== code && !occupied.has(c.courseCode) && clashFree(c)
        const withProximity = (c) => ({ ...c, ...timeProximity(pendingSlot, c) })

        const vaultFits = []
        const seenVaultKeys = new Set()
        workspace.savedPatterns.forEach((draft) => {
            draft.sections.filter((c) => clearOfCourse(c) && eligible(c)).forEach((c) => {
                const k = sectionKey(c)
                if (seenVaultKeys.has(k)) return
                seenVaultKeys.add(k)
                vaultFits.push({ ...withProximity(c), fromVault: draft.name })
            })
        })
        const poolFits = candidatePool
            .filter((c) => clearOfCourse(c) && eligible(c) && !seenVaultKeys.has(sectionKey(c)))
            .map(withProximity)
        const substitutes = [...vaultFits, ...poolFits].sort((a, b) => a.proximityScore - b.proximityScore)

        const retakes = []

        return { substitutes, retakes }
    }, [pendingSlot, pendingMode, routine, candidatePool, workspace.savedPatterns])

    useEffect(() => {
        if (pendingSlot && panelRef.current) {
            panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [pendingSlot, pendingMode])

    const openPanel = (section, mode, impact = null) => {
        setPendingSlot(section)
        setPendingMode(mode)
        setPendingImpact(impact)
        setSameSlotOnly(false)
    }
    const dismissPanel = () => { setPendingSlot(null); setPendingMode(null); setPendingImpact(null) }

    const toggleRegistered = (section) => {
        const code = section.courseCode
        setStatusMap((prev) => ({ ...prev, [code]: statusOf(section) === STATUS.REGISTERED ? STATUS.PLANNED : STATUS.REGISTERED }))
    }

    // "Which section did you actually get?" — defaults to whatever's already
    // in the routine; switching it swaps that course's section in place and
    // the existing conflict-detection picks up any new clash automatically.
    const handleSectionChange = (courseCode, sectionNumber) => {
        const chosen = candidatePool.find((c) => c.courseCode === courseCode && c.sectionNumber === sectionNumber)
            || routine.find((s) => s.courseCode === courseCode && s.sectionNumber === sectionNumber)
        if (chosen) updateGoalSection(courseCode, chosen)
    }

    // UC019 Simulate Course Drop: show the impact dashboard first — the course
    // stays in the routine untouched until the student confirms and either
    // picks a substitute or explicitly drops it with nothing in its place.
    const handleDrop = (section) => {
        if (removingKey) return
        const impact = computeDropImpact(section, routine, [], MIN_CREDITS)
        openPanel(section, 'simulate-drop', impact)
    }

    const confirmDrop = () => setPendingMode('drop') // move into gap-filling; nothing removed yet

    const cancelDrop = () => dismissPanel()

    const dropWithoutReplacing = () => {
        const section = pendingSlot
        setRemovingKey(sectionKey(section))
        setTimeout(() => {
            removeGoalSection(section.courseCode)
            setStatusMap((prev) => { const n = { ...prev }; delete n[section.courseCode]; return n })
            dismissPanel()
            setRemovingKey(null)
        }, DELETE_ANIM_MS)
    }

    const applyCandidate = (candidate) => {
        const originalCode = pendingSlot?.courseCode
        removeGoalSection(originalCode) // the pending course is still in state until now
        updateGoalSection(candidate.courseCode, candidate)
        dismissPanel()
        const key = sectionKey(candidate)
        setConfirmedKey(key)
        setTimeout(() => setConfirmedKey((k) => (k === key ? null : k)), 900)
    }

    const handleSave = () => {
        setSaveStatus('saving')
        savePattern(workspace.currentGoal.label || 'Saved Routine', routine)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2500)
        const { studentID, semesterID } = workspace.meta
        if (studentID && semesterID) {
            saveSelectedPattern(studentID, semesterID, routine).catch(() => {})
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
    const securedStatus = allSecured ? 'safe' : 'neutral'

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Registration Sandbox</h1>
            </header>
            <p className="sandbox-hint">
                <i className="fas fa-bolt"></i> Mark each course as you go on the UTM portal — <strong>Got it</strong> locks it, the section toggle swaps in whichever one you actually got.
            </p>


            <div className="risk-status-bar">
                <div className={`risk-chip ${creditStatus}`}>
                    <div className="risk-chip-top">
                        <i className="fas fa-layer-group"></i>
                        <span className="risk-chip-value">{totalCredits}</span>
                        <span className="risk-chip-label">Credits</span>
                    </div>
                    <div className="risk-chip-bar" title={`Minimum ${MIN_CREDITS} CH · Handbook pace ${optimumCredits} CH`}>
                        <div className="risk-chip-bar-fill" style={{ width: `${Math.min(100, (totalCredits / CREDIT_RING_MAX) * 100)}%` }}></div>
                        <div className="risk-chip-bar-tick" style={{ left: `${Math.min(100, (MIN_CREDITS / CREDIT_RING_MAX) * 100)}%` }}></div>
                        <div className="risk-chip-bar-tick optimum" style={{ left: `${Math.min(100, (optimumCredits / CREDIT_RING_MAX) * 100)}%` }}></div>
                    </div>
                </div>
                <div className={`risk-chip ${conflictStatus}`}>
                    <div className="risk-chip-top">
                        <i className="fas fa-scale-balanced"></i>
                        <span className="risk-chip-value">{conflicts.size > 0 ? conflicts.size : '✓'}</span>
                        <span className="risk-chip-label">{conflicts.size > 0 ? 'Clashes' : 'Clash Free'}</span>
                    </div>
                </div>
                <div className={`risk-chip ${securedStatus}`}>
                    <div className="risk-chip-top">
                        <i className="fas fa-shield-halved"></i>
                        <span className="risk-chip-value">{registeredCount}/{routine.length}</span>
                        <span className="risk-chip-label">{allSecured ? 'All Secured' : 'Secured'}</span>
                    </div>
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
                        const isPending = pendingSlot && sectionKey(pendingSlot) === key
                        const rowClass = [
                            'routine-row',
                            st === STATUS.REGISTERED && 'registered',
                            st === STATUS.PLANNED && conflicts.has(key) && 'conflict',
                            removingKey === key && 'removing',
                            confirmedKey === key && 'confirmed',
                            isPending && 'pending-drop',
                        ].filter(Boolean).join(' ')
                        return (
                            <React.Fragment key={i}>
                                <div className={rowClass}>
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
                                            {s.day} {s.timeStart?.slice(0, 5)}–{s.timeEnd?.slice(0, 5)} • {s.creditHours || 3} CH
                                        </div>
                                        <div className="routine-row-detail muted">{s.lecturerName || 'TBA'} • {s.venue || 'TBA'}</div>
                                    </div>
                                    <div className="routine-row-actions">
                                        <button
                                            className={`status-btn got ${st === STATUS.REGISTERED ? 'active' : ''}`}
                                            title="Mark as registered (locks the slot)"
                                            onClick={() => toggleRegistered(s)}
                                            disabled={isPending}
                                        >
                                            <i className="fas fa-check"></i>
                                        </button>
                                        <SectionToggle
                                            section={s}
                                            options={(() => {
                                                const known = sectionsForCourse(candidatePool, s.courseCode)
                                                return known.some((c) => c.sectionNumber === s.sectionNumber) ? known : [...known, s]
                                            })()}
                                            onChange={(sectionNumber) => handleSectionChange(s.courseCode, sectionNumber)}
                                            disabled={isPending || st === STATUS.REGISTERED}
                                        />
                                        <button
                                            className="status-btn drop"
                                            title="Drop this course (add/drop)"
                                            onClick={() => handleDrop(s)}
                                            disabled={isPending}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                {isPending && pendingMode === 'simulate-drop' && (
                                    <div className="inline-expand" ref={panelRef}>
                                        <div className="recovery-panel-header">
                                            <div>
                                                <i className="fas fa-flask" style={{ color: 'var(--reg-amber)', marginRight: '6px' }}></i>
                                                <strong>Simulate Drop — {pendingSlot.courseName || pendingSlot.courseCode}</strong>
                                            </div>
                                            <button className="recovery-panel-close" onClick={dismissPanel}>
                                                <i className="fas fa-xmark"></i>
                                            </button>
                                        </div>

                                        {pendingImpact && grad && fyp && (
                                            <DropImpactDashboard
                                                section={pendingSlot}
                                                impact={pendingImpact}
                                                grad={grad}
                                                fyp={fyp}
                                                intakeMonth={workspace.meta.intakeMonth}
                                                optimumCredits={optimumCredits}
                                            />
                                        )}

                                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                            <button className="btn outline" style={{ flex: 1, marginBottom: 0 }} onClick={cancelDrop}>
                                                <i className="fas fa-xmark"></i> Cancel
                                            </button>
                                            <button
                                                className="btn"
                                                style={{ flex: 1, marginBottom: 0, background: 'var(--reg-red)', color: '#fff' }}
                                                onClick={confirmDrop}
                                            >
                                                <i className="fas fa-trash"></i> Confirm Drop
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>


            {pendingMode === 'drop' && recovery && (
                <div className="recovery-panel" ref={panelRef}>
                    <div className="recovery-panel-header">
                        <div>
                            <i className="fas fa-arrows-spin" style={{ color: 'var(--reg-maroon)', marginRight: '6px' }}></i>
                            <strong>Dropping {pendingSlot.courseName || pendingSlot.courseCode} — Find a Replacement</strong>
                            <div className="recovery-panel-sub">Still not final — pick a substitute below, or drop it with nothing in its place.</div>
                        </div>
                        <button className="recovery-panel-close" onClick={dismissPanel}>
                            <i className="fas fa-xmark"></i>
                        </button>
                    </div>

                    <label className="same-slot-toggle">
                        <input type="checkbox" checked={sameSlotOnly} onChange={(e) => setSameSlotOnly(e.target.checked)} />
                        Same time slot only
                    </label>

                    <div className="recommender-columns">
                        <div className="recommender-col">
                            <div className="recommender-col-title">
                                <i className="fas fa-puzzle-piece"></i> Substitutes
                            </div>
                            {(() => {
                                const list = sameSlotOnly ? recovery.substitutes.filter((c) => c.sameSlot) : recovery.substitutes
                                return list.length === 0 ? (
                                    <p className="workspace-empty-note">No clash-free options {sameSlotOnly ? 'in that exact slot' : ''} right now.</p>
                                ) : (
                                    list.map((c) => <CandidateCard key={sectionKey(c)} section={c} onSelect={applyCandidate} />)
                                )
                            })()}
                        </div>
                        <div className="recommender-col">
                            <div className="recommender-col-title retake">
                                <i className="fas fa-clock-rotate-left"></i> Retake Courses
                            </div>
                            {(() => {
                                const list = sameSlotOnly ? recovery.retakes.filter((c) => c.sameSlot) : recovery.retakes
                                return list.length === 0 ? (
                                    <p className="workspace-empty-note">No flagged retakes {sameSlotOnly ? 'in that exact slot' : ''} fit right now.</p>
                                ) : (
                                    list.map((c) => <CandidateCard key={sectionKey(c)} section={c} onSelect={applyCandidate} />)
                                )
                            })()}
                        </div>
                    </div>
                    <button className="btn outline" style={{ marginTop: '10px', marginBottom: 0 }} onClick={dropWithoutReplacing}>
                        <i className="fas fa-trash"></i> Drop Without Replacing
                    </button>
                </div>
            )}

            {allSecured && (
                <div className="success-card">
                    <i className="fas fa-circle-check"></i>
                    <h3>All Courses Secured! 🎉</h3>
                    <p>Every course in your routine is marked registered. You're done for this semester.</p>
                </div>
            )}

            <div className="sticky-bottom">
                <button
                    className="view-btn"
                    style={{ width: '100%', background: '#fff7e6', color: '#d97706', opacity: saveStatus === 'saving' ? 0.4 : 1, cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer' }}
                    title="Save to Draft Vault"
                    disabled={saveStatus === 'saving'}
                    onClick={handleSave}
                >
                    <i className="fas fa-bookmark"></i>
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved to Vault!' : 'Save to Vault'}
                </button>
            </div>
        </div>
    )
}

export default SelectedRoutine
