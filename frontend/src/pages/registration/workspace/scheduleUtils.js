// Shared schedule-math helpers for the workspace (Custom Builder + Recovery views).
// A "section" is the same shape used throughout registration/:
//   { courseCode, sectionNumber, courseName, creditHours, day, timeStart, timeEnd, lecturerName, venue }

function toMinutes(time) {
    if (!time) return null
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

// Two sections clash if they land on the same day and their time ranges overlap.
export function overlaps(a, b) {
    if (!a || !b || a.day !== b.day) return false
    const aStart = toMinutes(a.timeStart)
    const aEnd = toMinutes(a.timeEnd)
    const bStart = toMinutes(b.timeStart)
    const bEnd = toMinutes(b.timeEnd)
    if ([aStart, aEnd, bStart, bEnd].some((v) => v == null)) return false
    return aStart < bEnd && bStart < aEnd
}

// Returns a Set of "courseCode|sectionNumber" keys for every section in the goal
// that clashes with at least one other section in the same goal.
export function computeConflicts(sections = []) {
    const conflicts = new Set()
    for (let i = 0; i < sections.length; i++) {
        for (let j = i + 1; j < sections.length; j++) {
            if (overlaps(sections[i], sections[j])) {
                conflicts.add(sectionKey(sections[i]))
                conflicts.add(sectionKey(sections[j]))
            }
        }
    }
    return conflicts
}

export function sectionKey(s) {
    return `${s.courseCode}|${s.sectionNumber}`
}

// Sections share a "slot group" when they belong to the same course AND occupy
// the exact same day+time block (i.e. picking any one of them is equivalent in
// terms of your schedule).  Used by the grid components to label a block as
// "S01/S02" rather than just "S01".
//
// Returns Map<sectionKey, string[]> where the value is the full list of
// sectionNumbers in that group (including the section itself).  Sections that
// are alone in their slot are NOT present in the map (no grouping to show).
export function buildSiblingMap(allSections = []) {
    const buckets = {}
    allSections.forEach((s) => {
        const slotKey = `${s.courseCode}|${s.day}|${s.timeStart}|${s.timeEnd}`
        if (!buckets[slotKey]) buckets[slotKey] = []
        buckets[slotKey].push(s)
    })
    const map = new Map()
    Object.values(buckets).forEach((group) => {
        if (group.length < 2) return
        const nums = group.map((s) => s.sectionNumber)
        group.forEach((s) => map.set(sectionKey(s), nums))
    })
    return map
}

// One colour family per course, keyed off courseCode itself (not position in
// any one pattern) so the same subject is always the same colour everywhere
// it's rendered — mini grid, full grid, compare, mix. Red is deliberately
// excluded — that colour is reserved for clash/conflict flagging elsewhere,
// so a course would look like it's clashing when it isn't.
export const COURSE_COLOR_PALETTE = [
    { pastel: '#BFDBFE', solid: '#2563EB' }, // blue
    { pastel: '#BBF7D0', solid: '#16A34A' }, // green
    { pastel: '#FBCFE8', solid: '#DB2777' }, // pink
    { pastel: '#FEF08A', solid: '#D97706' }, // amber
    { pastel: '#DDD6FE', solid: '#7C3AED' }, // purple
    { pastel: '#BAE6FD', solid: '#0284C7' }, // sky
    { pastel: '#C7D2FE', solid: '#4F46E5' }, // indigo
    { pastel: '#99F6E4', solid: '#0D9488' }, // teal
]

export function courseColor(courseCode) {
    if (!courseCode) return COURSE_COLOR_PALETTE[0]
    let hash = 0
    for (let i = 0; i < courseCode.length; i++) {
        hash = (hash * 31 + courseCode.charCodeAt(i)) | 0
    }
    return COURSE_COLOR_PALETTE[Math.abs(hash) % COURSE_COLOR_PALETTE.length]
}

export function sumCredits(sections = []) {
    return sections.reduce((sum, s) => sum + (s.creditHours || 0), 0)
}

const LUNCH_START_MIN = 13 * 60 // 1:00 PM
const LUNCH_END_MIN = 14 * 60 // 2:00 PM

function overlapMinutes(aStart, aEnd, bStart, bEnd) {
    return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart))
}

// Largest gap between two consecutive classes on the same day, in hours.
// Time spent inside the 1-2pm lunch hour doesn't count as "gap" — a 3-hour
// gap that includes lunch reads as a 2-hour gap between classes.
export function computeMaxGapHours(pattern = []) {
    const byDay = {}
    pattern.forEach((s) => {
        if (!s.day) return
        const day = s.day.slice(0, 3)
        if (!byDay[day]) byDay[day] = []
        byDay[day].push(s)
    })

    let maxGap = 0
    Object.values(byDay).forEach((sections) => {
        const sorted = [...sections].sort((a, b) => toMinutes(a.timeStart) - toMinutes(b.timeStart))
        for (let i = 0; i < sorted.length - 1; i++) {
            const prevEnd = toMinutes(sorted[i].timeEnd)
            const nextStart = toMinutes(sorted[i + 1].timeStart)
            if (prevEnd == null || nextStart == null || nextStart <= prevEnd) continue
            const rawGap = nextStart - prevEnd
            const lunchOverlap = overlapMinutes(prevEnd, nextStart, LUNCH_START_MIN, LUNCH_END_MIN)
            maxGap = Math.max(maxGap, (rawGap - lunchOverlap) / 60)
        }
    })
    return maxGap
}

// Registration-day status of a course in the routine (UC017 course_status).
// "Section full" is no longer a separate status — a student who can't get
// their planned section now just swaps to a different one via the section
// toggle, which surfaces as a normal clash if the new section collides.
export const STATUS = { PLANNED: 'planned', REGISTERED: 'registered' }

// Real SCSEH handbook pacing (per Zimly, 2026-07): 12 CH minimum per semester,
// 21 CH maximum, with a 16-18 CH "designed pace" band to graduate in 8
// semesters. DEFAULT_TARGET_CREDITS is the midpoint of that band — a
// per-student override belongs in workspace.meta.targetCreditsPerSemester
// (settable once a settings UI exists; this is just the fallback).
export const MIN_CREDITS_PER_SEMESTER = 12
export const MAX_CREDITS_PER_SEMESTER = 21
export const DEFAULT_TARGET_CREDITS_PER_SEMESTER = 17

// Walks the prerequisite graph outward from `courseCode`, collecting every
// course that requires it either directly or transitively (A needs B needs C
// — dropping C should surface A too, not just B). `level` marks how many
// hops away each one is, for the cascade visualization.
function findPrerequisiteCascade(courseCode, prerequisiteRows, seen = new Set(), level = 1) {
    const direct = prerequisiteRows.filter((row) => row.prerequisiteCourseCode === courseCode && !seen.has(row.courseCode))
    let out = []
    direct.forEach((row) => {
        seen.add(row.courseCode)
        out.push({ courseCode: row.courseCode, courseName: row.courseName, isMandatory: row.isMandatory, level })
    })
    direct.forEach((row) => {
        out = out.concat(findPrerequisiteCascade(row.courseCode, prerequisiteRows, seen, level + 1))
    })
    return out
}

// Drop Impact Alert (SDD §6.3 / UC019): what happens if this course is dropped.
// `prerequisiteRows` mirrors the real `prerequisite` table: each row means
// row.courseCode REQUIRES row.prerequisiteCourseCode. To find what this drop
// blocks, look for rows where THIS course is someone else's prerequisite —
// including anything further down the chain (see findPrerequisiteCascade).
export function computeDropImpact(section, routine, prerequisiteRows = [], minCredits = 9) {
    const creditsBefore = sumCredits(routine)
    const creditsAfter = creditsBefore - (section.creditHours || 0)
    const underLoad = creditsAfter < minCredits
    const dependents = findPrerequisiteCascade(section.courseCode, prerequisiteRows)
    const blockedMandatory = dependents.filter((d) => d.isMandatory)
    let severity = 'safe' // safe → warning → severe
    if (blockedMandatory.length > 0) severity = 'severe'
    else if (underLoad || dependents.length > 0) severity = 'warning'
    return { creditsBefore, creditsAfter, underLoad, dependents, blockedMandatory, severity }
}

// Creative extension to UC019's "Drop Impact Alert": a rough read on how a
// drop ripples into the bigger picture — the standard 4-year (8-semester)
// graduation timeline and FYP/Internship eligibility. Built only from real
// fields (semesterNumber, and academic_profile's real totalCreditsCompleted
// aggregate column) — see MOCK_ACADEMIC_PROFILE for what's an assumption vs.
// what's a real schema field.
export function estimateGraduationImpact(impact, currentSemester, totalSemesters = 8) {
    const delayTier = impact.blockedMandatory.length > 0 ? 'severe' : (impact.underLoad || impact.dependents.length > 0) ? 'caution' : 'none'
    return {
        currentSemester,
        totalSemesters,
        // A blocked mandatory course commonly cycles once a year — missing it
        // pushes graduation out by roughly a full year (2 semesters).
        projectedSemester: delayTier === 'severe' ? totalSemesters + 2 : totalSemesters,
        delayTier,
    }
}

export function estimateFypEligibility(impact, academicProfile) {
    const projectedTotal = (academicProfile.totalCreditsCompleted || 0) + impact.creditsAfter
    return {
        projectedTotal,
        required: academicProfile.requiredCreditsForFYP,
        onTrack: projectedTotal >= academicProfile.requiredCreditsForFYP,
    }
}

// UC020 Execute Gap Filling: is this candidate clear to recommend? True if it
// has no prerequisite of its own, or every course it requires is already in
// `completedCourses`.
export function prerequisitesMet(courseCode, prerequisiteRows = [], completedCourses = []) {
    const required = prerequisiteRows.filter((row) => row.courseCode === courseCode)
    return required.every((row) => completedCourses.includes(row.prerequisiteCourseCode))
}

// How "close" a candidate's slot is to the one just freed — used to rank and
// filter substitutes/retakes by convenience instead of splitting them into
// separate hardcoded buckets. 0 = exact day+time match (the freed slot
// itself); same-day candidates always outrank other-day ones; beyond that,
// candidates are ranked by how close the time-of-day is.
export function timeProximity(freedSection, candidate) {
    const sameDay = freedSection.day === candidate.day
    const timeDiff = Math.abs(toMinutes(freedSection.timeStart) - toMinutes(candidate.timeStart))
    return { proximityScore: sameDay ? timeDiff : timeDiff + 1440, sameSlot: sameDay && timeDiff === 0 }
}
