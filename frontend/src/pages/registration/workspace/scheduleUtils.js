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

export function sumCredits(sections = []) {
    return sections.reduce((sum, s) => sum + (s.creditHours || 0), 0)
}

// Registration-day status of a course in the routine (UC017 course_status).
export const STATUS = { PLANNED: 'planned', REGISTERED: 'registered', FAILED: 'failed' }

// Drop Impact Alert (SDD §6.3 / UC019): what happens if this course is dropped.
// `prerequisiteRows` mirrors the real `prerequisite` table: each row means
// row.courseCode REQUIRES row.prerequisiteCourseCode. To find what this drop
// blocks, look for rows where THIS course is someone else's prerequisite.
export function computeDropImpact(section, routine, prerequisiteRows = [], minCredits = 9) {
    const creditsBefore = sumCredits(routine)
    const creditsAfter = creditsBefore - (section.creditHours || 0)
    const underLoad = creditsAfter < minCredits
    // Downstream courses this one unlocks; mandatory ones are the graduation risk.
    const dependents = prerequisiteRows
        .filter((row) => row.prerequisiteCourseCode === section.courseCode)
        .map((row) => ({ courseCode: row.courseCode, courseName: row.courseName, isMandatory: row.isMandatory }))
    const blockedMandatory = dependents.filter((d) => d.isMandatory)
    let severity = 'safe' // safe → warning → severe
    if (blockedMandatory.length > 0) severity = 'severe'
    else if (underLoad || dependents.length > 0) severity = 'warning'
    return { creditsBefore, creditsAfter, underLoad, dependents, blockedMandatory, severity }
}
